import { KPICards } from '../components/dashboard/KPICards';
import { LiveFlowChart } from '../components/dashboard/LiveFlowChart';
import { TopBrandsChart } from '../components/dashboard/TopBrandsChart';
import { VehicleTypesChart } from '../components/dashboard/VehicleTypesChart';
import { OpportunityWidget } from '../components/dashboard/OpportunityWidget';
import { WeeklyHeatmap } from '../components/dashboard/WeeklyHeatmap';
import { kpis, flowChartData, topBrandsData, vehicleTypesData } from '../data/mockData';

export function Dashboard() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 relative z-10">
        {/* Header Section */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-md">Command Center</h1>
          <p className="text-gray-400 text-sm md:text-base">Inteligencia vehicular y optimización OOH en tiempo real.</p>
        </div>

        {/* KPIs */}
        <KPICards data={kpis} />

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <LiveFlowChart data={flowChartData} />
          <TopBrandsChart data={topBrandsData} />
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <VehicleTypesChart data={vehicleTypesData} />
          <WeeklyHeatmap />
        </div>

        {/* Smart Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-6 md:pb-10">
          <OpportunityWidget />
        </div>
      </div>
  );
}