// src/components/StockChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Stock } from "../types/Stock";

interface Props {
  data: Stock[];
}

export const StockChart: React.FC<Props> = ({ data }) => (
  <LineChart width={600} height={300} data={data}>
    <XAxis dataKey="timestamp" />
    <YAxis domain={['auto', 'auto']} />
    <Tooltip />
    <Line type="monotone" dataKey="price" stroke="#3b82f6" />
  </LineChart>
);
