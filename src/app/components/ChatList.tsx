import ChatMessage from './ChatMessage';

type ChatListProps = {
  chat: { id: string; role: 'user' | 'assistant'; message: string; createdAt?: string }[];
  userEmail?: string;
};

export default function ChatList({ chat, userEmail }: ChatListProps) {
  if (chat.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Start a conversation</h3>
          <p className="text-gray-500 text-sm">Ask me anything about health, wellness, or just say hello!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chat.map((msg, index) => (
        <div key={msg.id} className={index === chat.length - 1 ? 'animate-fade-in' : ''}>
          <ChatMessage 
            role={msg.role} 
            message={msg.message} 
            createdAt={msg.createdAt || new Date().toISOString()}
            userEmail={userEmail}
          />
        </div>
      ))}
    </div>
  );
}