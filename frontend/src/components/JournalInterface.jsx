import React, { useState } from 'react';
import { Send, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import axios from 'axios';

const JournalInterface = ({ onResponse }) => {
    const [entry, setEntry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entry.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Assuming user_id: 1 for demo purposes
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
            setError(`Failed to connect to the AI guide: ${errorMsg}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="glass-morphism p-10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="flex items-center gap-4 border-b border-orange-100 pb-6">
                    <Heart className="w-8 h-8 text-deep-amber animate-pulse" />
                    <div>
                        <h2 className="text-2xl font-light text-deep-amber">How are you feeling today?</h2>
                        <p className="text-sm text-orange-400 font-light italic">Your thoughts are safe and encrypted.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="Start writing your thoughts here..."
                        className="input-glass min-h-[200px] resize-none text-lg font-light"
                        disabled={isLoading}
                    />

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-orange-400/60">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest font-medium">Harden Usage Active</span>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !entry.trim()}
                            className="btn-primary flex items-center gap-3 shadow-orange-200"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Analyzing...
                                </span>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Capture Entry
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-500 text-sm animate-in shake duration-500">
                        <ShieldAlert className="w-5 h-5 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalInterface;
