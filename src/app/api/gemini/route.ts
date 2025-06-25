// Import Next.js request/response types
import { NextRequest, NextResponse } from "next/server";
import {supabase} from "@/lib/supabase";

// Handle POST requests to /api/gemini
export async function POST(request: NextRequest) {
    // Get message from request body
    const {message, user_id}= await request.json();

    // Fetch conversation history for this user
    const { data: chatHistory, error } = await supabase
        .from('messages')
        .select('role, message')
        .eq('user_id', user_id)
        .order('created_at', { ascending: true })
        .limit(20); // Limit to last 20 messages to avoid token limits

    if (error) {
        console.error('Error fetching chat history:', error);
    }

    await supabase.from('messages').insert([
        {role:'user', message, user_id}
    ]);

    // Build conversation contents including history
    const contents = [
        // System-level instruction
        {
            role: 'user',
            parts: [{
                text: "You are myBot, a personal healthcare companion made by Ron Paragoso. You speak in a calm, polite, and caring tone. Always prioritize the user's health and emotional well-being. Respond with empathy, short logical explanations, and avoid slang. If the topic is unrelated to healthcare, still remain helpful and supportive. Use the conversation history to provide contextual and personalized responses."
            }],
        }
    ];

    // Add chat history to contents
    if (chatHistory && chatHistory.length > 0) {
        chatHistory.forEach((msg) => {
            contents.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.message }]
            });
        });
    }

    // Add current user message
    contents.push({
        role: 'user',
        parts: [{ text: message }]
    });
    
    // Call Gemini API with user's message and history
    const response = await fetch ('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
        method:"POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: contents
        }),
    });

    // Parse Gemini's response
    const data = await response.json();
    
    // Extract AI text or fallback message (No response)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

     await supabase.from('messages').insert([
        {role:'assistant', message:text, user_id}
    ]);

    // Return AI response to client
    return NextResponse.json({ text });
}
