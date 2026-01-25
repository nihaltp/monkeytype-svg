'use client';

import React from "react"

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function MonkeytypeStreakGenerator() {
  const [username, setUsername] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const url = `/api/streak?username=${encodeURIComponent(username)}`;
      setImageUrl(url);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : typeof window !== 'undefined'
      ? window.location.origin
      : 'YOUR_DEPLOYMENT_URL';

  const markdownLink = `![Monkeytype Streak](${deploymentUrl}/api/streak?username=${encodeURIComponent(username)})`;

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownLink);
      setCopied(true);
      toast.success('Markdown copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
      console.error(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-amber-400">
            Monkeytype Streak Generator
          </h1>
          <p className="text-lg text-slate-400">
            Create a dynamic GitHub README widget for your Monkeytype stats
          </p>
        </div>

        {/* Main Card */}
        <Card className="border border-slate-700 bg-slate-900 shadow-2xl">
          <div className="p-8">
            {/* Input Section */}
            <div className="mb-8 space-y-4">
              <label htmlFor="username" className="block text-sm font-medium text-slate-200">
                Monkeytype Username
              </label>
              <div className="flex gap-3">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your Monkeytype username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-amber-400"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !username.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500"
                >
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            {imageUrl && (
              <div className="mb-8 space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">Preview</h2>
                <div className="flex justify-center rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${username}'s Monkeytype Streak`}
                    width={800}
                    height={250}
                    className="max-w-full"
                  />
                </div>
              </div>
            )}

            {/* Markdown Code Block */}
            {imageUrl && username && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">GitHub README Markdown</h2>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800 p-4 text-sm text-slate-200">
                    <code>{markdownLink}</code>
                  </pre>
                  <button
                    onClick={handleCopyMarkdown}
                    className="absolute right-4 top-4 rounded-lg bg-slate-700 p-2 hover:bg-slate-600"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-slate-300" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Paste this into your GitHub README.md to display your Monkeytype streak!
                </p>
              </div>
            )}

            {/* Instructions */}
            {!imageUrl && (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="mb-4 font-semibold text-slate-200">How to use:</h3>
                <ol className="space-y-2 text-sm text-slate-400">
                  <li>{'1. Enter your Monkeytype username above'}</li>
                  <li>{'2. Click Generate to create your streak widget'}</li>
                  <li>{'3. Copy the markdown code to your GitHub README'}</li>
                  <li>{'4. The widget will automatically update every 4 hours with your latest stats'}</li>
                </ol>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Made with ❤️ by <a href="https://github.com/nihaltp" className="underline">nihaltp</a> | Data from Monkeytype API
        </p>
      </div>
    </main>
  );
}
