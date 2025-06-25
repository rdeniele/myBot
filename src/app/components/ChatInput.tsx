import { Session } from "@supabase/supabase-js";
import { useState } from "react";

type ChatInputProps = {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  session: Session | null;
};

export default function ChatInput({ input, setInput, onSend, isLoading, session }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className={`flex items-end gap-3 p-3 rounded-2xl border-2 transition-all duration-200 ${
        isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      } ${!session ? 'opacity-50' : ''}`}>
        <div className="flex-1">
          <textarea
            className="w-full resize-none border-none outline-none text-sm placeholder-gray-500 bg-transparent max-h-32 min-h-[20px]"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message here..."
            disabled={!session}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '20px',
              maxHeight: '128px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
        </div>
        
        <button 
          onClick={onSend}
          disabled={isLoading || !session || !input.trim()}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            isLoading || !input.trim() 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}