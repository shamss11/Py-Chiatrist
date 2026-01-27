import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Smile, Calendar, Target, Activity } from 'lucide-react';
import axios from 'axios';

const TriggerChart = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);
    const COLORS = ['#FFB347', '#E67E22', '#D35400', '#F39C12', '#F1C40F'];

    useEffect(() => {
        const fetchTriggers = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/user/1/trigger-distribution');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch triggers:", err);
            }
        };
        fetchTriggers();
    }, [refreshTrigger]);

    if (!data.length) return null;

    return (
        <div className="card-premium p-10 space-y-8 animate-slide-up">
            <h3 className="text-2xl font-bold text-text-main flex items-center gap-3">
                <Target className="w-6 h-6 text-primary-dark" />
                Root Trigger Analysis
            </h3>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 20, right: 40, top: 20, bottom: 20 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={180}
                            axisLine={false}
                            tickLine={false}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                const label = payload.value.length > 25 ? payload.value.substring(0, 22) + '...' : payload.value;
                                return (
                                    <text x={x} y={y} dy={4} textAnchor="end" fill="#7A6A5E" fontSize={12} fontWeight={600}>
                                        {label}
                                    </text>
                                );
                            }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255, 179, 71, 0.05)' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[0, 8, 8, 0]}
                            barSize={24}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-sm text-text-muted font-light italic text-center">
                Detected recurring environmental and internal factors influencing your emotional state.
            </p>
        </div>
    );
};

const MoodDashboard = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendRes, insightRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/user/1/mood-trend'),
                    axios.get('http://127.0.0.1:8000/user/1/insights')
                ]);
                setData(trendRes.data);
                setInsights(insightRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-primary-dark rounded-full animate-spin"></div>
            <span className="text-text-muted font-light tracking-widest text-sm uppercase">Rebuilding timeline...</span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-slide-up">
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Visual Overview */}
                <div className="lg:col-span-3 card-premium p-10 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-text-main flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-primary-dark" />
                                7-Day Journey
                            </h3>
                            <p className="text-sm text-text-muted font-light">Daily intensity of AI-detected emotional state</p>
                        </div>
                        <div className="flex bg-orange-50 p-1.5 rounded-2xl border border-orange-100">
                            <button className="px-5 py-2 bg-white text-primary-dark font-bold text-xs rounded-xl shadow-sm tracking-widest uppercase">7 Days</button>
                            <button className="px-5 py-2 text-text-muted font-bold text-xs rounded-xl tracking-widest uppercase opacity-40 cursor-not-allowed">30 Days</button>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFB347" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#FFB347" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#7A6A5E', fontSize: 13, fontWeight: 500 }}
                                        dy={15}
                                    />
                                    <YAxis hide domain={[0, 10]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255, 179, 71, 0.2)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                            padding: '12px 16px'
                                        }}
                                        itemStyle={{ color: '#E67E22', fontWeight: 600 }}
                                        formatter={(value, name, props) => [value, `Intensity (${props.payload.emotion})`]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#FFB347"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        dot={{ r: 6, fill: '#fff', stroke: '#FFB347', strokeWidth: 3 }}
                                        activeDot={{ r: 8, strokeWidth: 0, fill: '#E67E22' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-text-muted/40 font-light border-2 border-dashed border-orange-100 rounded-[3rem]">
                                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-lg">Your data visualization will appear here.</p>
                                <p className="text-sm">Start by capturing your first journal entry.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Insight sidebar */}
                <div className="space-y-8">
                    <div className="card-premium p-8 bg-gradient-to-br from-[#FFB347] to-[#E67E22] text-white">
                        <Activity className="w-10 h-10 mb-6 text-white/50" />
                        <h4 className="text-lg font-bold mb-2">Weekly Summary</h4>
                        <p className="text-white/80 text-sm font-light leading-relaxed">
                            {insights?.insight_message || "Awaiting your first entries to generate professional summary reports."}
                        </p>
                    </div>

                    <div className="card-premium p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-primary-dark" />
                            <h4 className="font-bold text-sm tracking-widest uppercase">Key Insights</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { label: 'Top Emotion', value: insights?.top_emotion || 'N/A' },
                                { label: 'Stability', value: insights?.stability || 'N/A' },
                                { label: 'Top Triggers', value: insights?.trigger_summary || 'None' }
                            ].map((item, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted">{item.label}</span>
                                    <span className="font-bold text-text-main">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Trigger Chart Section */}
            <TriggerChart refreshTrigger={refreshTrigger} />

            <div className="text-center">
                <p className="text-xs text-text-muted/60 uppercase tracking-[0.3em] font-medium">
                    Cross-referenced with Research-Based Sentinel Guardrails
                </p>
            </div>
        </div>
    );
};

export default MoodDashboard;
