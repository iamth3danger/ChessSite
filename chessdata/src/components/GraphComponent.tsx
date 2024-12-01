import React from "react";
import { WinPercentageData } from "../classes/WeeklyData";
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

export interface WinPercentageGraphProps {
  opening : string;
  data: WinPercentageData[];
}

export function GraphComponent(props : WinPercentageGraphProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-black border border-white">
      <CardHeader>
        <CardTitle className="text-white">Win Percentage - {props.opening} </CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="h-[300px] overflow-x-auto">
          <div className="min-w-[600px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ backgroundColor: "black" }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  dataKey="week"
                  label={{
                    value: "Week",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: "white" },
                  }}
                  tick={{ fontSize: 12, fill: "white" }}
                  stroke="white"
                />
                <YAxis
                  label={{
                    value: "Win %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "white" },
                  }}
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "white" }}
                  stroke="white"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid white",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="winPercentage"
                  stroke="white"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
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
