"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_COMPLAINTS_BY_CATEGORY,
  CHART_INCIDENTS_TREND,
  CHART_MUNICIPALITY_ACTIVITY,
} from "@/lib/mock-data";

const COLORS = ["#22d3ee", "#38bdf8", "#6366f1", "#818cf8", "#a78bfa", "#2dd4bf", "#34d399"];
const axisStyle = { fill: "#94a3b8", fontSize: 11 };
const gridStroke = "rgba(56, 189, 248, 0.12)";

export function ComplaintsByCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaints by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={CHART_COMPLAINTS_BY_CATEGORY}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {CHART_COMPLAINTS_BY_CATEGORY.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function IncidentsTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={CHART_INCIDENTS_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip />
            <Line type="monotone" dataKey="incidents" stroke="#38bdf8" strokeWidth={2} dot={{ fill: "#22d3ee" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MunicipalityActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Municipality Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={CHART_MUNICIPALITY_ACTIVITY}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="municipality" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(56,189,248,0.3)" }} />
            <Bar dataKey="complaints" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="incidents" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
