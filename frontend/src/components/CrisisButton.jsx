import React, { useState } from 'react';
import { ShieldAlert, X, Phone, MessageSquare, ExternalLink } from 'lucide-react';

const CrisisButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-12 right-12 bg-red-600 text-white p-5 rounded-3xl shadow-[0_15px_40px_rgba(220,38,38,0.3)] 
                           hover:bg-red-700 transition-all hover:-translate-y-2 z-40 group flex items-center gap-3 active:scale-95"
            >
                <ShieldAlert className="w-7 h-7" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 font-bold uppercase tracking-widest text-xs">
                    Get Support Now
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-[#2D241E]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 lg:p-12 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 lg:p-16 max-w-2xl w-full shadow-2xl space-y-10 relative animate-in slide-in-from-bottom-8 duration-500 border border-red-50">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-8 right-8 p-3 rounded-2xl bg-gray-50 text-text-muted hover:text-text-main transition-all hover:rotate-90"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest">
                                <ShieldAlert className="w-4 h-4" />
                                Immediate Clinical Support
                            </div>
                            <h2 className="text-5xl font-bold text-text-main tracking-tighter leading-tight">
                                There is <span className="text-red-600">help available</span> for you right now.
                            </h2>
                            <p className="text-lg text-text-muted font-light leading-relaxed">
                                If you are feeling overwhelmed or in immediate danger, please reach out to professional support services. You don't have to navigate this alone.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <a
                                href="tel:988"
                                className="flex flex-col p-8 bg-red-50/50 rounded-[2rem] border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all group"
                            >
                                <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-xl text-text-main mb-2">Crisis Lifeline</h4>
                                <p className="text-red-700/80 text-sm font-medium mb-4">Call or Text 988 (USA)</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-red-600/60 uppercase tracking-widest mt-auto">
                                    Available 24/7 <ExternalLink className="w-3 h-3" />
                                </div>
                            </a>

                            <a
                                href="sms:741741"
                                className="flex flex-col p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                            >
                                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-xl text-text-main mb-2">Crisis Text Line</h4>
                                <p className="text-blue-700/80 text-sm font-medium mb-4">Text HOME to 741741</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-600/60 uppercase tracking-widest mt-auto">
                                    Encrypted Messaging <ExternalLink className="w-3 h-3" />
                                </div>
                            </a>
                        </div>

                        <div className="p-6 rounded-2xl bg-gray-50 text-center">
                            <p className="text-[11px] text-text-muted/60 uppercase tracking-[0.2em] leading-relaxed">
                                International Support: <a href="https://www.befrienders.org/" className="underline hover:text-primary-dark">befrienders.org</a> • iasp.info
                                <br />Emergency Services: Contact local emergency 111 / 911 / 112
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CrisisButton;
