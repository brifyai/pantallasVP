import https from 'https';
import fs from 'fs';

// Consulta usando bounding box de Santiago (aproximado)
// Santiago está aproximadamente entre:
// -70.9, -33.7 (suroeste) y -70.5, -33.3 (noreste)
// Formato: (sur, oeste, norte, este) = (-33.7, -70.9, -33.3, -70.5)
const query = `
[out:json][timeout:90];
relation["boundary"="administrative"]["admin_level"="8"](-33.7,-70.9,-33.3,-70.5);
out body;
>;
out skel qt;
`;

const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

console.log('Descargando límites de comunas desde Overpass API...');
console.log('Usando bounding box: 33.7,-70.9,33.3,-70.5');
console.log('Esto puede tomar unos segundos...');

https.get(url, { timeout: 120000 }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const overpassData = JSON.parse(data);
      console.log(`Elementos recibidos: ${overpassData.elements?.length || 0}`);
      
      const geojson = convertirAGeoJSON(overpassData);
      
      // Guardar todas las comunas descargadas (Gran Santiago y alrededores)
      fs.writeFileSync('public/data/comunas-santiago.geojson', JSON.stringify(geojson, null, 2));
      console.log(`\nGeoJSON creado con ${geojson.features.length} comunas`);
      console.log('Comunas:', geojson.features.map(f => f.properties.name).join(', '));
      
    } catch (e) {
      console.error('Error:', e.message);
      fs.writeFileSync('/tmp/overpass-response.json', data.substring(0, 10000));
      console.error('Primeros 10000 caracteres guardados en /tmp/overpass-response.json');
    }
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});

function convertirAGeoJSON(overpassData) {
  const geojson = { type: 'FeatureCollection', features: [] };
  const elements = overpassData.elements || [];
  
  const nodes = {};
  const ways = {};
  const relations = [];
  
  elements.forEach(e => {
    if (e.type === 'node') nodes[e.id] = e;
    else if (e.type === 'way') ways[e.id] = e;
    else if (e.type === 'relation') relations.push(e);
  });
  
  console.log(`Nodos: ${Object.keys(nodes).length}, Ways: ${Object.keys(ways).length}, Relaciones: ${relations.length}`);
  
  relations.forEach(relation => {
    if (!relation.tags || !relation.tags.name) return;
    
    const members = relation.members || [];
    
    // Obtener todos los ways exteriores
    const outerWays = members
      .filter(m => m.type === 'way' && (m.role === 'outer' || m.role === ''))
      .map(m => ways[m.ref])
      .filter(w => w && w.nodes);
    
    if (outerWays.length === 0) return;
    
    // Reconstruir el polígono conectando los ways
    const wayPoints = new Map(); // punto inicial/final de cada way
    const wayConnections = new Map(); // conexiones entre ways
    
    outerWays.forEach((way, idx) => {
      const firstNode = way.nodes[0];
      const lastNode = way.nodes[way.nodes.length - 1];
      wayPoints.set(idx, { first: firstNode, last: lastNode, nodes: way.nodes });
    });
    
    // Encontrir conexiones
    const orderedWays = [];
    const used = new Set();
    
    // Empezar con el primer way
    orderedWays.push(0);
    used.add(0);
    
    // Intentar conectar los demás ways
    while (orderedWays.length < outerWays.length) {
      const lastWayIdx = orderedWays[orderedWays.length - 1];
      const lastWay = wayPoints.get(lastWayIdx);
      const lastNode = lastWay.last;
      
      let found = false;
      for (let i = 0; i < outerWays.length; i++) {
        if (used.has(i)) continue;
        
        const currentWay = wayPoints.get(i);
        if (currentWay.first === lastNode) {
          orderedWays.push(i);
          used.add(i);
          found = true;
          break;
        } else if (currentWay.last === lastNode) {
          // Invertir el way
          wayPoints.set(i, { first: currentWay.last, last: currentWay.first, nodes: [...currentWay.nodes].reverse() });
          orderedWays.push(i);
          used.add(i);
          found = true;
          break;
        }
      }
      
      if (!found) break;
    }
    
    // Construir coordenadas
    const coordinates = [];
    const seenNodes = new Set();
    
    orderedWays.forEach(wayIdx => {
      const way = wayPoints.get(wayIdx);
      way.nodes.forEach(nodeId => {
        if (!seenNodes.has(nodeId)) {
          seenNodes.add(nodeId);
          const node = nodes[nodeId];
          if (node && node.lat && node.lon) {
            coordinates.push([node.lon, node.lat]);
          }
        }
      });
    });
    
    if (coordinates.length > 2) {
      // Cerrar el polígono
      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coordinates.push([...first]);
      }
      
      geojson.features.push({
        type: 'Feature',
        properties: { 
          name: relation.tags.name,
          population: relation.tags.population || null,
          wikidata: relation.tags.wikidata || null
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      });
      console.log(`✓ ${relation.tags.name}: ${coordinates.length} puntos`);
    }
  });
  
  return geojson;
}