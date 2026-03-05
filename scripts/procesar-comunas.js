import fs from 'fs';

// Leer datos descargados desde Overpass API
const data = fs.readFileSync('/tmp/comunas-all.json', 'utf-8');
const overpassData = JSON.parse(data);

console.log(`Elementos recibidos: ${overpassData.elements?.length || 0}`);

const geojson = convertirAGeoJSON(overpassData);

// Guardar todas las comunas descargadas
fs.writeFileSync('public/data/comunas-santiago.geojson', JSON.stringify(geojson, null, 2));
console.log(`\nGeoJSON creado con ${geojson.features.length} comunas`);
console.log('Comunas:', geojson.features.map(f => f.properties.name).join(', '));

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
    const wayPoints = new Map();
    
    outerWays.forEach((way, idx) => {
      const firstNode = way.nodes[0];
      const lastNode = way.nodes[way.nodes.length - 1];
      wayPoints.set(idx, { first: firstNode, last: lastNode, nodes: way.nodes });
    });
    
    // Encontrir conexiones
    const orderedWays = [];
    const used = new Set();
    
    orderedWays.push(0);
    used.add(0);
    
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