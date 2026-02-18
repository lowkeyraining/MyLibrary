"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 1 },
  { name: "Feb", total: 4 }, // ข้อมูลสมมติให้เห็นภาพก่อน
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
]

export function TrendChart() {
  return (
    <div className="bg-white border border-[#D9D2C7] rounded-2xl p-6 h-[320px] shadow-sm flex flex-col">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B6F5E] mb-6">Monthly Trend</h3>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            />
            <YAxis 
              stroke="#8B6F5E" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#5C4033', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#C07B5A', strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#C07B5A" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}