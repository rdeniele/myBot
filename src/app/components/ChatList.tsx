import ChatMessage from './ChatMessage';

type ChatListProps = {
  chat: { id: string; role: 'user' | 'assistant'; message: string; createdAt?: string }[];
};

export default function ChatList({ chat }: ChatListProps) {
  return (
    <div className="space-y-2 mb-4">
      {chat.map((msg) => (
        <ChatMessage 
          key={msg.id} 
          role={msg.role} 
          message={msg.message} 
          createdAt={msg.createdAt || new Date().toISOString()} 
        />
      ))}
    </div>
  );
}