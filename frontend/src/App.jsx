import React, { useState } from 'react';
import JournalInterface from './components/JournalInterface';
import MoodDashboard from './components/MoodDashboard';
import CrisisButton from './components/CrisisButton';
import { Sparkles, Info } from 'lucide-react';

function App() {
    const [lastResponse, setLastResponse] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleNewResponse = (data) => {
        setLastResponse(data);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen pb-20">
            <header className="pt-12 pb-8 text-center space-y-4">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-orange-200/30 rounded-full blur-2xl animate-pulse"></div>
                        <img
                            src="/logo.png"
                            alt="Py-Chiatrist Logo"
                            className="w-24 h-24 relative animate-float drop-shadow-2xl"
                        />
                    </div>
                </div>
                <h1 className="text-5xl font-semibold tracking-tight orange-gradient-text">
                    Py-Chiatrist
                </h1>
                <p className="text-orange-400/80 font-light tracking-[0.2em] uppercase text-sm">
                    AI-POWERED CLINICAL INSIGHT JOURNAL
                </p>
            </header>

            <main className="container mx-auto px-4 space-y-12">
                <JournalInterface onResponse={handleNewResponse} />

                {lastResponse && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="glass-morphism p-8 space-y-6 border-orange-200">
                            <h3 className="text-xl font-medium text-deep-amber flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Clinical Perspective
                            </h3>
                            <div className="prose prose-orange max-w-none text-muted-brown leading-relaxed">
                                {lastResponse.response.split('\n').map((line, i) => (
                                    <p key={i} className="mb-4">{line}</p>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-orange-100 flex items-center gap-2 text-xs text-orange-400/70 italic">
                                <Info className="w-4 h-4" />
                                {lastResponse.disclaimer}
                            </div>
                        </div>
                    </div>
                )}

                <MoodDashboard refreshTrigger={refreshTrigger} />
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
