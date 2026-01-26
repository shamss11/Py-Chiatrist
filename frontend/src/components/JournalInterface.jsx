import React, { useState } from 'react';
import { Send, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import axios from 'axios';

const JournalInterface = ({ onResponse }) => {
    const [entry, setEntry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
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
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            <div className="glass-morphism p-8 space-y-4">
                <h2 className="text-2xl font-light text-deep-teal flex items-center gap-2">
                    <Heart className="w-6 h-6 text-sage" />
                    How are you feeling today?
                </h2>

                <textarea
                    className="w-full h-64 p-4 bg-white/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-sage focus:border-transparent outline-none transition-all resize-none text-lg font-light leading-relaxed"
                    placeholder="Start writing your thoughts here..."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    disabled={isLoading}
                />

                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 italic">
                        Your thoughts are safe and encrypted.
                    </p>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !entry.trim()}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isLoading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-sage text-white hover:bg-deep-teal shadow-lg hover:shadow-xl active:scale-95'
                            }`}
                    >
                        {isLoading ? (
                            <div className="typing-indicator">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Capture Entry
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalInterface;
