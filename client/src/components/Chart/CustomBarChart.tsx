import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Define the data structure
interface ChartDataItem {
  month: string;
  amount: number;
  category?: string; // Optional since it's used in tooltip but might not always be present
}

// Define props interface
interface CustomBarChartProps {
  data: ChartDataItem[];
}

// Define tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    value: number;
  }>;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
  // Function to alternate colors
  const getBarColor = (index: number): string => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb"; 
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600">
            Amount: <span className="text-sm font-medium text-gray-900">
               ₦{payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: "#555" }} 
            stroke="none" 
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#555" }} 
            stroke="none" 
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="amount"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
          >
            {data.map((_entry: ChartDataItem, index: number) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;