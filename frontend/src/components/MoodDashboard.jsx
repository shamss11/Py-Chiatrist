import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Smile, Calendar, Target, Activity, Download, Book, FileText } from 'lucide-react';
import axios from 'axios';
import { exportToPDF } from '../utils/pdfExport';

const JournalHistory = ({ refreshTrigger }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/user/1/history');
                if (Array.isArray(res.data)) {
                    setHistory(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [refreshTrigger]);

    if (isLoading) return null;
    if (!history || !history.length) return null;

    return (
        <div className="card-premium p-10 space-y-8 animate-slide-up bg-white">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-text-main flex items-center gap-3">
                    <Book className="w-6 h-6 text-[#FFB347]" />
                    Clinical Notebook
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    {history.length} Saved Entries
                </span>
            </div>

            <div className="grid gap-6">
                {(Array.isArray(history) ? history : []).slice(0, 5).map((entry, i) => (
                    <div key={entry.id || i} className="p-6 rounded-[1.5rem] bg-[#FFFBF5] border border-orange-100/50 hover:border-orange-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm">
                                    {(entry.sentiment?.emotion === 'Joy') ? '☀️' : (entry.sentiment?.emotion === 'Anxiety') ? '🌊' : '☁️'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-main">
                                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                                    </p>
                                    <p className="text-[10px] text-text-muted uppercase tracking-wider">{entry.sentiment?.emotion || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-white rounded-lg border border-orange-50 text-[10px] font-bold text-orange-600">
                                Intensity: {entry.sentiment?.intensity || 0}
                            </div>
                        </div>
                        <p className="text-sm text-text-main font-light leading-relaxed line-clamp-2 italic opacity-80">
                            "{entry.content}"
                        </p>
                        {entry.sentiment?.triggers && typeof entry.sentiment.triggers === 'string' && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {entry.sentiment.triggers.split(',').filter(t => t.trim()).map((tag, j) => (
                                    <span key={j} className="text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-orange-100/50 text-orange-700 rounded-md">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs text-text-muted font-light italic text-center pt-4 border-t border-orange-50">
                Your historical record of emotional evolution and clinical progress.
            </p>
        </div>
    );
};

const MoodPrediction = ({ refreshTrigger }) => {
    const [prediction, setPrediction] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/user/1/mood-prediction');
                setPrediction(res.data.prediction);
                setStatus(res.data.status);
            } catch (err) {
                console.error("Failed to fetch prediction:", err);
            }
        };
        fetchPrediction();
    }, [refreshTrigger]);

    if (status === 'accumulating') return null;

    return (
        <div className="card-premium p-10 bg-gradient-to-br from-[#2D241E] to-[#453830] text-white space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-3 text-orange-400">
                    <TrendingUp className="w-5 h-5" />
                    Emotional Trajectory Forecast
                </h3>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-orange-200">
                    AI Predictive Engine
                </div>
            </div>

            {status === 'loading' ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
            ) : (
                <p className="text-lg font-light leading-relaxed italic opacity-90 border-l-2 border-orange-500/30 pl-6">
                    "{prediction}"
                </p>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-[10px] uppercase tracking-widest text-orange-200/50 font-bold">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Clinical Pattern Synthesis Active
                </div>
                <div className="h-1 w-1 bg-orange-500/50 rounded-full"></div>
                <span>Next 72 Hours</span>
            </div>
        </div>
    );
};

const MoodDashboard = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);
    const [insights, setInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const success = await exportToPDF('mood-dashboard-report', `clinical-report-${new Date().toISOString().split('T')[0]}.pdf`);
            if (!success) {
                alert("PDF generation failed. Please try again or check your browser console.");
            }
        } catch (err) {
            console.error("Export Error:", err);
            alert("An unexpected error occurred during export.");
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendRes, insightRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/user/1/mood-trend'),
                    axios.get('http://127.0.0.1:8000/user/1/insights')
                ]);
                if (Array.isArray(trendRes.data)) {
                    setData(trendRes.data);
                }
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
        <div id="mood-dashboard-report" className="w-full max-w-6xl mx-auto space-y-8 animate-slide-up bg-[#FFFBF5] p-4">
            <div className="flex justify-end pr-4">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-orange-100 rounded-2xl text-primary-dark font-bold text-xs tracking-widest uppercase hover:bg-orange-50 transition-all shadow-sm disabled:opacity-50"
                >
                    {isExporting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download Clinical Report
                        </>
                    )}
                </button>
            </div>

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

            {/* Prediction Section */}
            <MoodPrediction refreshTrigger={refreshTrigger} />

            {/* Notebook Section */}
            <JournalHistory refreshTrigger={refreshTrigger} />

            <div className="text-center">
                <p className="text-xs text-text-muted/60 uppercase tracking-[0.3em] font-medium">
                    Cross-referenced with Research-Based Sentinel Guardrails
                </p>
            </div>
        </div>
    );
};

export default MoodDashboard;
