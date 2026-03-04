"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TrendData {
  name: string
  total: number
}

export function TrendChart({ data }: { data: TrendData[] }) {
  return (
    <div className="bg-white border border-[#D9D2C7] rounded-2xl p-6 h-[320px] shadow-sm flex flex-col">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F5E] mb-6">Monthly Trend</h3>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C07B5A" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#C07B5A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#8B6F5E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              padding={{ left: 30, right: 30 }}
            />
            <YAxis
              stroke="#8B6F5E"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#5C4033', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#C07B5A', strokeDasharray: '3 3' }}
              formatter={(value: number) => [`${value} เล่ม`, "อ่านจบ"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#C07B5A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
              dot={false}
              activeDot={{ r: 5, fill: "#C07B5A", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}