import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const csatData = [
  { mes: "Jan", valor: 4.1 },
  { mes: "Fev", valor: 4.2 },
  { mes: "Mar", valor: 4.0 },
  { mes: "Abr", valor: 4.3 },
  { mes: "Mai", valor: 4.5 },
  { mes: "Jun", valor: 4.3 },
];

const tmoData = [
  { mes: "Jan", valor: 9.2 },
  { mes: "Fev", valor: 8.8 },
  { mes: "Mar", valor: 9.0 },
  { mes: "Abr", valor: 8.5 },
  { mes: "Mai", valor: 8.3 },
  { mes: "Jun", valor: 8.5 },
];

interface MetricsChartProps {
  type: 'csat' | 'tmo';
}

export const MetricsChart = ({ type }: MetricsChartProps) => {
  const data = type === 'csat' ? csatData : tmoData;
  const title = type === 'csat' ? 'Evolução CSAT' : 'Evolução TMO';
  const color = type === 'csat' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke={color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
