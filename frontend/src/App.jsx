import React, { useState } from 'react';
import JournalInterface from './components/JournalInterface';
import MoodDashboard from './components/MoodDashboard';
import CrisisButton from './components/CrisisButton';
import { Sparkles, Info } from 'lucide-react';

function App() {
    const [lastResponse, setLastResponse] = useState(null);

    const handleNewResponse = (data) => {
        setLastResponse(data);
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="p-8 text-center space-y-2">
                <h1 className="text-5xl font-extralight tracking-tight text-deep-teal flex items-center justify-center gap-3">
                    Py-Chiatrist <Sparkles className="w-8 h-8 text-sage" />
                </h1>
                <p className="text-sage font-medium tracking-widest uppercase text-xs">
                    AI-Powered Clinical Insight Journal
                </p>
            </header>

            <main className="space-y-12">
                <JournalInterface onResponse={handleNewResponse} />

                {lastResponse && (
                    <div className="w-full max-w-4xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="glass-morphism p-8 space-y-4 border-l-4 border-sage">
                            <h3 className="text-sm font-bold text-sage uppercase tracking-wider flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Clinical Perspective
                            </h3>
                            <p className="text-lg text-deep-teal font-light leading-relaxed whitespace-pre-wrap">
                                {lastResponse.response}
                            </p>
                        </div>
                    </div>
                )}

                <MoodDashboard />
            </main>

            <CrisisButton />

            {/* Footer Disclaimer */}
            <footer className="fixed bottom-0 w-full p-4 bg-white/10 backdrop-blur-md text-center text-[10px] text-gray-500 uppercase tracking-widest border-t border-white/10">
                This is an AI research tool, not a substitute for professional clinical therapy.
                Py-Chiatrist does not provide medical advice or diagnosis.
            </footer>
        </div>
    );
}

export default App;
