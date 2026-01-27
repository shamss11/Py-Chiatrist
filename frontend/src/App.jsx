import React, { useState } from 'react';
import JournalInterface from './components/JournalInterface';
import MoodDashboard from './components/MoodDashboard';
import ClinicalBasis from './components/ClinicalBasis';
import CrisisButton from './components/CrisisButton';
import Typewriter from './components/Typewriter';
import {
    Sparkles,
    Info,
    Brain,
    LineChart,
    PenLine,
    GraduationCap,
    LayoutDashboard,
    User,
    Settings,
    ShieldCheck,
    ChevronRight,
    Bell,
    Star
} from 'lucide-react';

function App() {
    const [lastResponse, setLastResponse] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState('home');

    const handleNewResponse = (data) => {
        setLastResponse(data);
        setActiveTab('journal'); // Switch to journal to show response
        setRefreshTrigger(prev => prev + 1);
    };

    const navItems = [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'journal', label: 'Journal', icon: PenLine },
        { id: 'trends', label: 'Emotional Trends', icon: LineChart },
        { id: 'clinical', label: 'Methodology', icon: GraduationCap },
    ];

    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            {/* Professional Navbar */}
            <nav className="nav-blur">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="bg-gradient-to-br from-[#FFB347] to-[#E67E22] p-2.5 rounded-xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-500">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#2D241E]">
                            Py-Chiatrist
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`nav - link ${activeTab === item.id ? 'nav-link-active' : 'nav-link-inactive'} `}
                            >
                                <item.icon className="w-4.5 h-4.5" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl text-text-muted hover:bg-orange-50 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-orange-100 mx-2"></div>
                        <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-orange-100 hover:border-orange-200 transition-all shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-sm font-semibold text-text-main hidden sm:block">Clinical Guest</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                {activeTab === 'home' && (
                    <div className="space-y-12 animate-slide-up">
                        {/* Hero Header */}
                        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#2D241E] to-[#453830] p-12 lg:p-20 text-white shadow-2xl">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 text-xs font-bold tracking-[0.2em] uppercase">
                                        <ShieldCheck className="w-4 h-4" />
                                        Private • Secure • Clinical
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                                        Transform your <span className="text-[#FFB347]">mental landscape.</span>
                                    </h2>
                                    <p className="text-xl text-white/60 font-light leading-relaxed max-w-xl">
                                        Advanced behavioral insights grounded in research from
                                        Oxford and Harvard, delivered through high-privacy AI.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button
                                            onClick={() => setActiveTab('journal')}
                                            className="btn-pro-primary"
                                        >
                                            Start Daily Journal
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('clinical')}
                                            className="btn-pro-secondary"
                                        >
                                            View Methodology
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden lg:flex justify-center animate-slow-float">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#FFB347]/20 blur-[80px] rounded-full"></div>
                                        <Brain className="w-64 h-64 text-[#FFB347] relative z-10 opacity-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats / Info */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="card-premium p-8 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold">Research-Backed</h3>
                                <p className="text-text-muted font-light leading-relaxed text-sm">
                                    Our RAG engine retrieves clinical context from verified academic repositories.
                                </p>
                            </div>
                            <div className="card-premium p-8 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                                    <LineChart className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold">Smart Evolution</h3>
                                <p className="text-text-muted font-light leading-relaxed text-sm">
                                    Visualize your emotional growth with dynamic charting and pattern detection.
                                </p>
                            </div>
                            <div className="card-premium p-8 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold">Privacy First</h3>
                                <p className="text-text-muted font-light leading-relaxed text-sm">
                                    Local storage and encrypted transmissions ensure your thoughts remain yours.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'journal' && (
                    <div className="space-y-12 animate-slide-up">
                        <section className="text-center space-y-4 mb-12">
                            <h2 className="text-4xl font-bold text-text-main tracking-tight">Personal Journal</h2>
                            <p className="text-text-muted max-w-xl mx-auto">
                                Express your thoughts freely. Our clinical guide will provide insights based on your entry.
                            </p>
                        </section>

                        <JournalInterface onResponse={handleNewResponse} />

                        {lastResponse && (
                            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="card-premium p-10 space-y-8 bg-gradient-to-br from-white to-orange-50/30">
                                    <div className="flex items-center justify-between border-b border-orange-100 pb-6">
                                        <h3 className="text-2xl font-bold gradient-text flex items-center gap-3">
                                            <Star className="w-6 h-6 fill-[#FFB347]" />
                                            AI Clinical Perspective
                                        </h3>
                                        <div className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase">Verified Source</div>
                                    </div>
                                    <div className="text-xl text-text-main leading-relaxed font-light py-2">
                                        <Typewriter
                                            key={lastResponse.timestamp || lastResponse.response}
                                            text={lastResponse.response}
                                            speed={25}
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-orange-100 flex items-center gap-3 text-sm text-text-muted italic">
                                        <Info className="w-5 h-5 text-orange-400" />
                                        {lastResponse.disclaimer}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div className="animate-slide-up">
                        <section className="text-center space-y-4 mb-12">
                            <h2 className="text-4xl font-bold text-text-main tracking-tight">Emotional Trajectory</h2>
                            <p className="text-text-muted max-w-xl mx-auto">
                                Analyzing your sentiment patterns over the last 7 days.
                            </p>
                        </section>
                        <MoodDashboard refreshTrigger={refreshTrigger} />
                    </div>
                )}

                {activeTab === 'clinical' && (
                    <div className="animate-slide-up">
                        <ClinicalBasis />
                    </div>
                )}
            </main>

            <footer className="container mx-auto px-6 py-12 mt-20 border-t border-orange-100">
                <div className="grid md:grid-cols-4 gap-12 text-sm text-text-muted mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-1.5 rounded-lg">
                                <Brain className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-xl font-bold text-text-main">Py-Chiatrist</span>
                        </div>
                        <p className="max-w-sm">
                            Bridging the gap between cutting-edge AI and academic mental health research.
                            Build your emotional intelligence with every entry.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-text-main uppercase tracking-widest text-xs">Resources</h4>
                        <ul className="space-y-2">
                            <li className="hover:text-primary transition-colors cursor-pointer">Clinical Sources</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Support Network</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-text-main uppercase tracking-widest text-xs">Platform</h4>
                        <ul className="space-y-2">
                            <li className="hover:text-primary transition-colors cursor-pointer">Dashboard</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Journaling Tools</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">API Docs</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-orange-50 text-[11px] uppercase tracking-[0.3em] font-medium text-orange-400">
                    &copy; 2026 Py-Chiatrist AI. Developed for Advanced Agentic Coding Research.
                </div>
            </footer>

            <CrisisButton />
        </div>
    );
}

export default App;
