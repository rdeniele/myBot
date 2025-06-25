import { Session } from "@supabase/supabase-js";

type ChatInputProps = {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  session: Session | null;
};

export default function ChatInput({ input, setInput, onSend, isLoading, session }: ChatInputProps) {
  return (
    <div className="flex gap-2">
      <input
        className="border p-2 flex-1 rounded-4xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSend()}
        placeholder="Ask something..."
        disabled={!session}
      />
      
      <button onClick={onSend}
        disabled={isLoading || !session}
        className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}