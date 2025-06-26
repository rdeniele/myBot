# myBot - AI Health Companion

A modern, responsive AI chatbot application built with Next.js, Supabase, and Google's Gemini AI. myBot serves as your personal healthcare companion, providing health advice and support with a calm, caring approach.

![myBot Screenshot](public/assets/myBot.png)

## Features

- 🤖 **AI-Powered Conversations** - Powered by Google's Gemini AI model
- 🔐 **Secure Authentication** - Email/password authentication with Supabase
- 💾 **Chat History** - Persistent conversation history stored in database
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates** - Instant message delivery and updates
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 🏥 **Health-Focused** - Specialized for healthcare conversations and advice

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini AI
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Google Cloud account with Gemini API access
- Git installed on your machine

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/myBot.git
   cd myBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_supabase_database_url
   ```

4. **Set up Supabase Database**
   
   Create a `messages` table in your Supabase database:
   ```sql
   CREATE TABLE messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
     message TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable Row Level Security
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   
   -- Create policy for users to access their own messages
   CREATE POLICY "Users can access their own messages" ON messages
     FOR ALL USING (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Go to Settings > API to get your project URL and anon key
3. Set up the database table as shown above
4. Configure authentication providers if needed

### Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your environment variables

### Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
4. Deploy!

## Project Structure

```
myBot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # Fetch chat history
│   │   │   └── gemini/
│   │   │       └── route.ts          # Gemini AI integration
│   │   ├── components/
│   │   │   ├── AuthForm.tsx          # Authentication component
│   │   │   ├── ChatInput.tsx         # Message input component
│   │   │   ├── ChatList.tsx          # Chat messages list
│   │   │   └── ChatMessage.tsx       # Individual message component
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main page component
│   └── lib/
│       └── supabase.ts               # Supabase client configuration
├── public/
│   └── assets/
│       └── myBot.png                 # Bot avatar image
├── .env.local                        # Environment variables
├── package.json
└── README.md
```

## Usage

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Start Chatting**: Type your health-related questions or concerns
3. **Get Advice**: Receive personalized health guidance from myBot
4. **View History**: Access your previous conversations anytime
5. **Logout**: Securely end your session when done

## Features in Detail

### Authentication
- Secure email/password authentication
- Email confirmation for new accounts
- Persistent login sessions
- Secure logout functionality

### Chat Interface
- Real-time message delivery
- Auto-scrolling to latest messages
- Typing indicators and loading states
- Responsive design for all devices

### AI Integration
- Context-aware conversations using chat history
- Health-focused responses
- Error handling for API failures
- Optimized for healthcare advice

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ by [Ron Paragoso](https://github.com/rdeniele)
- Powered by [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- Database and Auth by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/myBot/issues) page
2. Create a new issue if needed
3. Contact the maintainer

---

**Note**: This application is for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for serious health concerns.
