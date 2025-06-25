import Image from 'next/image';

type ChatMessageProps = {
    role: 'user' | 'assistant';
    message: string;
    createdAt: string;
    userEmail?: string;
}

export default function ChatMessage({ role, message, createdAt, userEmail }: ChatMessageProps) {
    return(
        <div className={`p-2 rounded-4xl relative flex items-center justify-center gap-4 ${role === 'user' ? 'bg-blue-100 flex-row-reverse' : 'bg-gray-100'}`}>

            {/* Date */}
            <div className="text-xs text-gray-500 absolute top-1">
                {new Date(createdAt).toLocaleTimeString()}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ">
                {role === 'user' ? (
                    <Image 
                        src="/assets/user.png" 
                        alt="User" 
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image 
                        src="/assets/myBot.png" 
                        alt="Baymax" 
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            
            {/* Message content */}
            <div className={`flex-1 p-4 ${role === 'user' ? 'text-right' : 'text-left'}`}>
                <strong>{role === 'user' ? (userEmail ? userEmail.split('@')[0] : 'You') : 'myBot'}:</strong> {message}
            </div>
        </div>
    )
}