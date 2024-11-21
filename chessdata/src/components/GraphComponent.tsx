import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WinPercentageData {
  week: number;
  winPercentage: number;
}

interface WinPercentageGraphProps {
  data: WinPercentageData[];
}

export function GraphComponent({ data }: WinPercentageGraphProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Win Percentage Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-x-auto">
          <div className="min-w-[600px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  label={{
                    value: "Week",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{ value: "Win %", angle: -90, position: "insideLeft" }}
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="winPercentage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GraphComponent;
