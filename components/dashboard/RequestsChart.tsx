"use client"

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Log {
    created_at: string
}

interface RequestsChartProps {
    logs: Log[]
}

export function RequestsChart({ logs }: RequestsChartProps) {
    // Process logs to group by day for the last 7 days
    const last7Days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date(),
    })

    const data = last7Days.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd")
        const count = logs.filter((log) => {
            const logDate = format(parseISO(log.created_at), "yyyy-MM-dd")
            return logDate === dateStr
        }).length

        // Simulation for comparison line (e.g., previous average or predicted)
        const ghostCount = Math.max(0, count + (Math.random() * 4 - 2))

        return {
            name: format(day, "dd MMM", { locale: ptBR }),
            requests: count,
            prediction: Math.round(ghostCount),
        }
    })

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{
                            fontSize: '11px',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="requests"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorRequests)"
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="prediction"
                        stroke="#c7d2fe"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="none"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
