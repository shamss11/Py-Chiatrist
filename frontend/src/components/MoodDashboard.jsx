import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Smile } from 'lucide-react';
import axios from 'axios';

const MoodDashboard = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrend = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/user/1/mood-trend');
                setData(response.data);
            } catch (err) {
                console.error("Failed to fetch mood trend:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrend();
    }, [refreshTrigger]);

    if (isLoading) return <div className="text-center p-10 font-light text-deep-amber">Loading your emotional journey...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="glass-morphism p-10 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-light text-deep-amber flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                        Emotional Trends
                    </h2>
                    <div className="flex items-center gap-2 bg-orange-100/50 px-4 py-2 rounded-full border border-orange-200/50">
                        <Smile className="w-4 h-4 text-deep-amber" />
                        <span className="text-sm font-medium text-deep-amber">
                            {data.length > 0 ? "Insights Active" : "Start journaling to see trends"}
                        </span>
                    </div>
                </div>

                <div className="h-64 w-full">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FED7AA" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#92400E', fontSize: 12, fontWeight: 300 }}
                                />
                                <YAxis
                                    hide
                                    domain={[0, 10]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 248, 240, 0.95)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(251, 191, 36, 0.3)',
                                        boxShadow: '0 10px 25px rgba(251, 146, 60, 0.1)'
                                    }}
                                    itemStyle={{ color: '#92400E' }}
                                    formatter={(value, name, props) => [value, `Intensity (${props.payload.emotion})`]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#F59E0B"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#D97706', strokeWidth: 0 }}
                                    activeDot={{ r: 8, fill: '#92400E', strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-orange-300 font-light italic border-2 border-dashed border-orange-100 rounded-3xl">
                            <p>Your mood graph will appear once you capture more entries.</p>
                        </div>
                    )}
                </div>

                <p className="text-center text-sm text-orange-400/70 font-light max-w-lg mx-auto leading-relaxed">
                    This chart visualizes your mood intensity over time. Hover over points to see specific clinical emotions detected by Gemini.
                </p>
            </div>
        </div>
    );
};

export default MoodDashboard;
