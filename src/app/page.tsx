'use client';

// import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";

type Message = {
  id:string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export default function Home() {
  const[input, setInput] = useState("");
  const[chat, setChat] = useState<{ id: string; role: 'user' | 'assistant'; message: string }[]>([]);
  const[isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const fetchChat = async()=>{
      const response = await fetch('/api/chat');
      const data: Message[] = await response.json();
      setChat(data.map(msg => ({
        id: msg.id,
        role: msg.role,
        message: msg.message
      })));
    }

    fetchChat();
  
  },[])

  const sendMessage = async() =>{
    if(!input.trim()) return;
    setIsLoading(true);
    setChat(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      message: input
    }]);

    const response = await fetch('/api/gemini',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setChat(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      message: data.text
    }]);
    setInput("");
    setIsLoading(false);
  }

  // Smooth auto-scroll function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll when chat updates
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl h-[80vh] flex flex-col">
        <h1 className="text-2xl font-bold mb-4">myBot</h1>
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <ChatList chat={chat} />
        </div>
        <ChatInput input={input} setInput={setInput} onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
