'use client';

// import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {supabase} from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import AuthForm from "./components/AuthForm";
import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";

type Message = {
  id:string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}
export default function Home() {
  const[session, setSession] = useState<Session | null>(null);
  const[input, setInput] = useState("");
  const[chat, setChat] = useState<{ id: string; role: 'user' | 'assistant'; message: string }[]>([]);
  const[isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const getSession = async()=>{
      const {data} = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const {data:listener}=supabase.auth.onAuthStateChange((_event, session)=>{
      setSession(session);
    })

    return () =>{
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(()=>{
    if(!session) return;

    const fetchChat = async()=>{
      const response = await fetch(`/api/chat?user_id=${session.user.id}`);
      const data: Message[] = await response.json();
      setChat(data.map(msg => ({
        id: msg.id,
        role: msg.role,
        message: msg.message
      })));
    }

    fetchChat();
  
  },[session]);

  const sendMessage = async() =>{
    if(!input.trim() || !session) return;
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
      body: JSON.stringify({ message: input, user_id: session.user.id }),
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setChat([]); // Clear chat when logging out
  };

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

  if (!session) return <AuthForm />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">myBot</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <ChatList chat={chat} />
        </div>
        <ChatInput 
          input={input} 
          setInput={setInput} 
          onSend={sendMessage} 
          isLoading={isLoading}
          session={session}
        />      
        </div>
    </div>
  );
}
