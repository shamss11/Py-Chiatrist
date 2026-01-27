import React, { useState } from 'react';
import { Search, BookOpen, Loader2, FileText, ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import Typewriter from './Typewriter';

const DeepDive = () => {
    const [topic, setTopic] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [sources, setSources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const res = await axios.get(`http://127.0.0.1:8000/clinical/deep-dive?topic=${encodeURIComponent(topic)}`);
            setAnalysis(res.data.analysis);
            setSources(res.data.sources);
        } catch (err) {
            console.error("Deep dive failed:", err);
            setError("The synthesis engine encountered an error. Please try a different topic.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-slide-up">
            <section className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase">
                    <Sparkles className="w-4 h-4" />
                    Advanced RAG Synthesis
                </div>
                <h2 className="text-5xl font-bold text-text-main tracking-tight">Clinical Deep Dive</h2>
                <p className="text-text-muted max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Explore specific psychological concepts, therapeutic frameworks, or mental health topics
                    referenced against our specialized clinical knowledge base.
                </p>
            </section>

            <div className="card-premium p-2 bg-white/50 backdrop-blur-xl border-orange-100 shadow-xl overflow-hidden">
                <form onSubmit={handleSearch} className="flex items-center">
                    <div className="flex-1 flex items-center px-6">
                        <Search className="w-6 h-6 text-orange-400" />
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Type a topic (e.g., 'CBT for anxiety', 'Neuroplasticity and depression')"
                            className="w-full py-6 px-4 bg-transparent border-none focus:ring-0 outline-none text-xl font-light text-text-main placeholder:text-text-muted/40"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="btn-pro-primary h-[72px] px-10 rounded-2xl m-1"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Initiate Analysis"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center animate-slide-up">
                    {error}
                </div>
            )}

            {analysis && (
                <div className="grid lg:grid-cols-4 gap-12 animate-slide-up">
                    <div className="lg:col-span-3 space-y-8">
                        <div className="card-premium p-12 space-y-10 bg-white">
                            <div className="flex items-center justify-between border-b border-orange-100 pb-8">
                                <h3 className="text-3xl font-bold flex items-center gap-4 text-text-main">
                                    <BookOpen className="w-8 h-8 text-primary-dark" />
                                    Clinical Synthesis
                                </h3>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                    Topic: {topic}
                                </div>
                            </div>

                            <div className="prose prose-orange max-w-none">
                                <div className="text-lg text-text-main leading-relaxed font-light whitespace-pre-wrap">
                                    <Typewriter text={analysis} speed={10} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="card-premium p-8 bg-gradient-to-br from-orange-50 to-white border-orange-100">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-dark mb-6 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                References Used
                            </h4>
                            <div className="space-y-4">
                                {[...new Set(sources)].map((source, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-orange-100 shadow-sm transition-transform hover:-translate-y-1 cursor-default group">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-bold text-orange-600">{i + 1}</span>
                                        </div>
                                        <p className="text-xs text-text-main font-semibold leading-tight group-hover:text-primary-dark transition-colors">
                                            {source.replace('.pdf', '').replace('.txt', '').replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#2D241E] text-white">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-4">Clinical Notice</p>
                            <p className="text-xs font-light leading-relaxed opacity-70 italic">
                                This analysis is generated through retrieval-augmented generation from specific academic papers.
                                It is intended for educational purposes and should not replace professional medical advice.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeepDive;
