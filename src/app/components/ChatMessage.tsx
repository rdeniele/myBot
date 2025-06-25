import Image from 'next/image';

type ChatMessageProps = {
    role: 'user' | 'assistant';
    message: string;
    createdAt: string;
    userEmail?: string;
}

export default function ChatMessage({ role, message, createdAt, userEmail }: ChatMessageProps) {
    const isUser = role === 'user';
    
    return(
        <div className={`flex gap-3 p-4 group hover:bg-gray-50 transition-colors duration-200 ${
            isUser ? 'flex-row-reverse' : ''
        }`}>
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white">
                    {isUser ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm transition-all">
                            {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                        </div>
                    ) : (
                        <div className="relative w-full h-full bg-gray-50">
                            <Image
                                src="/assets/myBot.png"
                                alt="myBot avatar"
                                fill
                                className="object-cover transition-opacity hover:opacity-95"
                                priority
                                sizes="(max-width: 768px) 40px, 40px"
                                loading="eager"
                                onError={(e) => {
                                    e.currentTarget.src = "/assets/fallback-bot.png";
                                }}
                            />
                        </div>
                    )}
                </div>
                {/* Online indicator for bot */}
                {!isUser && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
            </div>
            
            {/* Message content */}
            <div className={`flex-1 max-w-xs sm:max-w-md md:max-w-lg ${isUser ? 'text-right' : 'text-left'}`}>
                {/* Header with name and time */}
                <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-sm font-medium text-gray-700">
                        {isUser ? (userEmail ? userEmail.split('@')[0] : 'You') : 'myBot'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                
                {/* Message bubble */}
                <div className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
                    isUser 
                        ? 'bg-blue-500 text-white rounded-br-md' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    )
}