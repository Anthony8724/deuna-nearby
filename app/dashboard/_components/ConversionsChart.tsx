"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ConversionDay } from "../data/merchantAnalytics";

export function ConversionsChart({ data }: { data: ConversionDay[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#635bff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#635bff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis
            dataKey="fecha"
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          />
          <Area
            type="monotone"
            dataKey="conversiones"
            stroke="#635bff"
            strokeWidth={2}
            fill="url(#convGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
