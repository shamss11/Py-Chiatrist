import React from 'react';
import { BookOpen, GraduationCap, Database, Search, ShieldCheck, Globe, Star, Info } from 'lucide-react';

const ClinicalBasis = () => {
    const sources = [
        { name: 'Harvard Medical School', focus: 'Behavioral Genetics & Mood Disorders', cite: 'HMS Dept of Psychiatry', url: 'https://psychiatry.hms.harvard.edu/' },
        { name: 'University of Oxford', focus: 'Cognitive Behavioral Research Unit', cite: 'CBT Research Oxford', url: 'https://www.psych.ox.ac.uk/' },
        { name: 'Johns Hopkins Medicine', focus: 'Affective Disorder Clinical Service', cite: 'JH Affective Neuro', url: 'https://www.hopkinsmedicine.org/psychiatry' },
        { name: 'Stanford Medicine', focus: 'Precision Mental Health & Wellness', cite: 'Stanford Wellness', url: 'https://psychiatry.stanford.edu/' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-16 animate-slide-up pb-20">
            {/* Narrative Header */}
            <section className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-100 text-primary-dark text-xs font-bold uppercase tracking-[0.2em] shadow-sm">
                    <Star className="w-4 h-4" />
                    Evidence-Based Architecture
                </div>
                <h2 className="text-5xl font-bold text-text-main tracking-tighter leading-tight">
                    How we ground AI in <span className="gradient-text">Clinical Science</span>
                </h2>
                <p className="text-lg text-text-muted font-light leading-relaxed">
                    Unlike generic chat systems, Py-Chiatrist employs a Retrieval-Augmented Generation (RAG)
                    architecture to bridge the gap between machine intelligence and academic expertise.
                </p>
            </section>

            {/* Methodology Grid */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: Database, title: "Curated Knowledge", desc: "Indexing peer-reviewed clinical papers from open-access academic repositories." },
                    { icon: Search, title: "Precision Context", desc: "Finding relevant CBT and MBSR methodologies for every journal entry." },
                    { icon: Globe, title: "Institutional RAG", desc: "Insights cross-referenced with frameworks from Harvard, Oxford, and Stanford." },
                    { icon: ShieldCheck, title: "Safety Guardrails", desc: "Multi-stage sentiment filtering to ensure crisis triggers are handled with priority." }
                ].map((item, i) => (
                    <div key={i} className="card-premium aspect-square p-8 flex flex-col items-start justify-between group hover:-translate-y-2 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <item.icon className="w-7 h-7 text-primary-dark" />
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-bold text-lg text-text-main leading-tight">{item.title}</h4>
                            <p className="text-xs text-text-muted leading-relaxed font-light line-clamp-3">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Institutional Table/List */}
            <section className="bg-[#2D241E] rounded-[3rem] p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFB347]/5 rounded-full blur-[100px] -mr-40 -mt-20"></div>

                <div className="relative z-10 grid lg:grid-cols-5 gap-16 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-3xl font-bold tracking-tight">Our Knowledge <br />Partnerships</h3>
                        <p className="text-white/60 font-light leading-relaxed">
                            Our RAG system is designed to provide users with supportive, informational insights
                            drawn from the world's most distinguished centers of clinical research.
                        </p>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <Info className="w-10 h-10 text-[#FFB347] flex-shrink-0" />
                            <p className="text-[11px] text-white/40 leading-relaxed italic uppercase tracking-wider">
                                Py-Chiatrist operates as an AI assistant and is not a clinical practitioner.
                                Research is retrieved for informational purposes only.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                        {sources.map((source, i) => (
                            <a
                                key={i}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-6 rounded-3xl bg-white/5 border border-white/5 lg hover:bg-white/10 hover:border-white/20 transition-all group block"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-[#FFB347] rounded-xl flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <h5 className="font-bold text-white group-hover:text-[#FFB347] transition-colors">{source.name}</h5>
                                </div>
                                <p className="text-xs text-white/40 font-light italic mb-2 tracking-wide uppercase">{source.cite}</p>
                                <p className="text-sm text-white/70 leading-relaxed font-light">{source.focus}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <div className="text-center pt-8">
                <p className="text-xs text-text-muted/50 uppercase tracking-[0.4em] font-medium">
                    Bridging Binary Wisdom with Human Clinical Grounding
                </p>
            </div>
        </div>
    );
};

export default ClinicalBasis;
