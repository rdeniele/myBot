'use client';

import { useEffect, useState, useRef } from "react";
import {supabase} from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import AuthForm from "./components/AuthForm";
import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";
import Image from "next/image";

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
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      message: input
    };
    
    setChat(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetch('/api/gemini',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput, user_id: session.user.id }),
      });

      const data = await response.json();
      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: data.text
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChat(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setChat([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-blue-500">
                <Image 
                  src="/assets/myBot.png" 
                  alt="myBot" 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">myBot</h1>
                <p className="text-xs text-gray-500">Your AI Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{session.user.email}</p>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          <div 
            ref={chatContainerRef} 
            className="flex-1 overflow-y-auto"
          >
            <ChatList chat={chat} userEmail={session.user.email} />
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
    </div>
  );
}
