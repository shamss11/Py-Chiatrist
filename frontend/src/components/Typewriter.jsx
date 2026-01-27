import React, { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, speed = 20, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        setDisplayedText('');
        setIndex(0);
    }, [text]);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [index, text, speed, onComplete]);

    const formatLine = (line) => {
        // Regex to match **text** and capture it
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // If closed, strip ** and bold
                return <strong key={i} className="font-bold text-orange-700">{part.slice(2, -2)}</strong>;
            }
            // If it's an unclosed bold tag being typed (e.g. "**word")
            if (part.startsWith('**')) {
                return <strong key={i} className="font-bold text-orange-700">{part.slice(2)}</strong>;
            }
            // Fallback for cases where ** is split differently
            if (part.includes('**')) {
                const chunks = part.split('**');
                return chunks.map((chunk, j) => (
                    j % 2 === 1
                        ? <strong key={j} className="font-bold text-orange-700">{chunk}</strong>
                        : chunk
                ));
            }
            return part;
        });
    };

    const lines = displayedText.split('\n');

    return (
        <div ref={containerRef} className="space-y-6">
            {lines.map((line, i) => (
                <p key={i} className="min-h-[1.5em]">
                    {formatLine(line)}
                    {index < text.length && i === lines.length - 1 && (
                        <span className="inline-block w-2 h-5 bg-[#FFB347] ml-1 animate-pulse align-middle" />
                    )}
                </p>
            ))}
        </div>
    );
};

export default Typewriter;
