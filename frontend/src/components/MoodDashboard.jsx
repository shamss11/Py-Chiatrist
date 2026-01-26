import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Smile } from 'lucide-react';

const MoodDashboard = ({ data }) => {
    // Mock data if none provided
    const plotData = data || [
        { day: 'Mon', score: 4 },
        { day: 'Tue', score: 3 },
        { day: 'Wed', score: 6 },
        { day: 'Thu', score: 2 },
        { day: 'Fri', score: 5 },
        { day: 'Sat', score: 4 },
        { day: 'Sun', score: 3 },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="glass-morphism p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-light text-deep-teal flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-sage" />
                        Emotional Trends
                    </h2>
                    <div className="flex items-center gap-2 bg-sage/20 px-4 py-2 rounded-full">
                        <Smile className="w-4 h-4 text-deep-teal" />
                        <span className="text-sm font-medium text-deep-teal">Stability: High</span>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={plotData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#718096', fontSize: 12 }}
                            />
                            <YAxis
                                hide
                                domain={[0, 10]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#A8B8A0"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#1E3A3A', strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-center text-sm text-gray-500 font-light">
                    Your mood intensity over the last 7 days. Higher scores indicate more intense emotions.
                </p>
            </div>
        </div>
    );
};

export default MoodDashboard;
