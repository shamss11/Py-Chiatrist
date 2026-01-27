import React, { useState } from 'react';
import { Heart, ShieldAlert, Sparkles, Send, Info } from 'lucide-react';
import axios from 'axios';

const JournalInterface = ({ onResponse }) => {
    const [entry, setEntry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompts, setPrompts] = useState([]);

    React.useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/user/1/suggested-prompts');
                setPrompts(res.data);
            } catch (err) {
                console.error("Failed to fetch prompts:", err);
            }
        };
        fetchPrompts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entry.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/journal/submit', {
                user_id: 1,
                content: entry
            });
            onResponse(response.data);
            setEntry('');
        } catch (err) {
            const errorMsg = err.response
                ? `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
                : err.message;
            setError(`Connection issue: ${errorMsg}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="card-premium overflow-hidden">
                <div className="grid lg:grid-cols-5 h-full">
                    {/* Writing Sidebar Info */}
                    <div className="col-span-2 bg-gradient-to-br from-orange-50 to-white p-10 border-r border-orange-100 hidden lg:flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                <Heart className="w-7 h-7 text-primary-dark" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-text-main">Safe Space</h2>
                            <p className="text-text-muted leading-relaxed font-light">
                                Take a moment to reflect. Your entry is analyzed through the lens of verified clinical research from institutions like Harvard and Oxford.
                            </p>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-sm text-[#E67E22] font-medium">
                                    <ShieldAlert className="w-5 h-5" />
                                    End-to-End Encryption
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#E67E22] font-medium">
                                    <Info className="w-5 h-5" />
                                    Academic RAG Engine
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E67E22] mb-3">Suggested Focus</h4>
                            <div className="space-y-3">
                                {prompts.map((prompt, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setEntry(prompt)}
                                        className="w-full text-left p-4 rounded-xl bg-white border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group"
                                    >
                                        <p className="text-sm text-text-main group-hover:text-primary-dark transition-colors font-light leading-relaxed">
                                            {prompt}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-orange-100/50 border border-orange-200 mt-8">
                            <p className="text-xs text-orange-800/70 leading-relaxed italic">
                                "The act of naming emotions reduces the activity of the amygdala, the brain's alarm system." — Clinical Research Insight
                            </p>
                        </div>
                    </div>

                    {/* Editor area */}
                    <div className="col-span-3 p-8 lg:p-12">
                        <form onSubmit={handleSubmit} className="h-full flex flex-col space-y-8">
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[#E67E22] mb-4">
                                    Today's Reflection
                                </label>
                                <textarea
                                    value={entry}
                                    onChange={(e) => setEntry(e.target.value)}
                                    placeholder="I've been feeling a bit overwhelmed lately because..."
                                    className="textarea-pro min-h-[400px] lg:min-h-[500px]"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-orange-100">
                                <div className="flex items-center gap-2 text-text-muted text-xs">
                                    <span className={`w-2 h-2 rounded-full ${entry.length > 0 ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
                                    {entry.length} characters
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !entry.trim()}
                                    className="btn-pro-primary h-14 min-w-[200px]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Clinical Synthesis...
                                        </span>
                                    ) : (
                                        <>
                                            Analyze Entry
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-slide-up">
                                <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalInterface;
