'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    
    const { error } = result;
    if (error) {
      alert(error.message);
    } else {
      if (isSignUp) {
        alert('Account created successfully! Please check your email (including spam folder) for a confirmation link to activate your account.');
      } else {
        alert('Logged in successfully!');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">myBot</h1>
          <h2 className="text-xl font-semibold text-gray-600">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp ? 'Join us to start chatting' : 'Sign in to continue'}
          </p>
        </div>
        
        {/* Email confirmation note for signup */}
        {isSignUp && (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm p-4 rounded-r-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-lg">📧</span>
              </div>
              <div className="ml-3">
                <p className="font-medium">Email Confirmation Required</p>
                <p className="text-xs mt-1 text-blue-700">
                  After signing up, we&apos;ll send a confirmation email to verify your account. 
                  Please check your inbox and spam folder.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>
        
        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        {/* Switch between login/signup */}
        <button
          className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={loading}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create one'}
        </button>
      </div>
    </div>
  );
}
