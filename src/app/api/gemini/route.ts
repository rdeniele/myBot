// Import Next.js request/response types
import { NextRequest, NextResponse } from "next/server";
import {supabase} from "@/lib/supabase";

// Handle POST requests to /api/gemini
export async function POST(request: NextRequest) {
    // Get message from request body
    const {message}= await request.json();

    await supabase.from('messages').insert([
        {role:'user', message}
    ]);
    
    // Call Gemini API with user's message
    const response = await fetch ('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
        method:"POST",
        headers: {'Content-Type': 'application/json'},
        // Format message for Gemini API
        body: JSON.stringify({
            contents: [
            // System-level instruction
            {
                role: 'user',
                // System message to set the AI's behavior
                parts: [{
                    text: "You are myBot, a personal healthcare companion made by Ron Paragoso. You speak in a calm, polite, and caring tone. Always prioritize the user's health and emotional well-being. Respond with empathy, short logical explanations, and avoid slang. If the topic is unrelated to healthcare, still remain helpful and supportive."
                }],
            },
            // User message
            {
                role: 'user',
                parts: [{ text: message }],
            },
            ],
        }),
    });

    // Parse Gemini's response
    const data = await response.json();
    
    // Extract AI text or fallback message (No response)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

     await supabase.from('messages').insert([
        {role:'assistant', message:text}
    ]);

    // Return AI response to client
    return NextResponse.json({ text });
}
