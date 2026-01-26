import React, { useState } from 'react';
import { ShieldAlert, X, Phone, MessageSquare } from 'lucide-react';

const CrisisButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-red-500 text-white p-4 rounded-full shadow-2xl hover:bg-red-600 transition-all hover:scale-110 z-40 group"
            >
                <ShieldAlert className="w-6 h-6" />
                <span className="absolute right-full mr-4 bg-white text-red-500 px-3 py-1 rounded-md text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-red-100">
                    Need Help?
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-red-600">You Are Not Alone</h2>
                            <p className="text-gray-600">Please reach out to one of these professional resources if you're feeling overwhelmed.</p>
                        </div>

                        <div className="space-y-4">
                            <a
                                href="tel:988"
                                className="flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-500 p-2 rounded-lg text-white">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-red-700">988 Suicide & Crisis Lifeline</p>
                                        <p className="text-sm text-red-600/80">Call or Text 988 (USA)</p>
                                    </div>
                                </div>
                            </a>

                            <a
                                href="sms:741741"
                                className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-500 p-2 rounded-lg text-white">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-700">Crisis Text Line</p>
                                        <p className="text-sm text-blue-600/80">Text HOME to 741741 (USA)</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <p className="text-center text-xs text-gray-400">
                            International resources: befrienders.org
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default CrisisButton;
