import { useEffect, useRef } from 'react';
import type { TranscriptMessage } from '@/hooks/useAnamQaSession';

interface TranscriptPanelProps {
    messages: TranscriptMessage[];
}

export default function TranscriptPanel({ messages }: TranscriptPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div 
            className="flex-1 w-full overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-md p-4 space-y-4"
            data-testid="qa-transcript"
            ref={scrollRef}
        >
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                    No transcript data yet.
                </div>
            ) : (
                messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    const isSystem = msg.role === 'system' || msg.role === 'error';
                    const isError = msg.role === 'error';

                    if (isSystem) {
                        return (
                            <div 
                                key={msg.id} 
                                className={`flex justify-center w-full px-2 py-1 text-xs font-mono rounded ${isError ? 'text-red-400 bg-red-950/30' : 'text-zinc-500 bg-zinc-800/50'}`}
                                data-testid="qa-message-system"
                            >
                                {msg.content}
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={msg.id} 
                            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                                    isUser 
                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                        : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                                }`}
                                data-testid={isUser ? "qa-message-user" : "qa-message-agent"}
                            >
                                <span className="block text-[10px] uppercase tracking-wider mb-1 opacity-60 font-bold">
                                    {isUser ? 'User' : 'Agent'}
                                </span>
                                {msg.content}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
