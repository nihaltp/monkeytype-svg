'use client';

import React, { useState } from 'react';
import { Copy, Check, Zap, Github, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LandingPage() {
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
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-6xl">
              Monkeytype Streak
            </h1>
            <p className="text-xl text-muted-foreground">
              Show off your typing discipline on GitHub with a dynamic streak widget.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <Card className="border-border bg-card shadow-2xl">
              <div className="p-8">
                <div className="mb-8 space-y-4">
                  <label htmlFor="username" className="block text-sm font-medium text-foreground">
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
                      className="border-input bg-background text-foreground"
                    />
                    <Button
                      onClick={handleGenerate}
                      disabled={loading || !username.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>

                {imageUrl && (
                  <div className="mb-8 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                    <div className="flex justify-center rounded-lg border border-border bg-muted/50 p-4">
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

                {imageUrl && username && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">GitHub README Markdown</h2>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm text-foreground">
                        <code>{markdownLink}</code>
                      </pre>
                      <button
                        onClick={handleCopyMarkdown}
                        className="absolute right-4 top-4 rounded-lg bg-background p-2 hover:bg-muted"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-y border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Live Updates</h3>
              <p className="text-muted-foreground">
                Always current stats fetched directly via the Monkeytype API.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Github className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">GitHub Ready</h3>
              <p className="text-muted-foreground">
                Copy-paste markdown support for your README.md profile.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Performance</h3>
              <p className="text-muted-foreground">
                Cached responses for lightning-fast loading times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">Looks Great on Your Profile</h2>
            <p className="mt-4 text-muted-foreground">
              Seamlessly integrates with your existing GitHub statistics.
            </p>
          </div>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="border-b border-border bg-muted/50 p-4 flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
               <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
               <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               <span className="ml-2 text-xs text-muted-foreground">nihaltp/README.md</span>
            </div>
            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                <div className="h-8 w-48 rounded bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full max-w-2xl rounded bg-muted/50"></div>
                  <div className="h-4 w-full max-w-xl rounded bg-muted/50"></div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-6 flex justify-center items-center h-[250px] relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-4xl font-bold select-none">
                    YOUR STATS HERE
                 </div>
                 <div className="z-10 text-center">
                    <p className="text-sm text-muted-foreground">Monkeytype Streak Widget</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>
          Made with ❤️ by <a href="https://github.com/nihaltp" className="underline hover:text-foreground">nihaltp</a> | Data from Monkeytype API
        </p>
      </footer>
    </main>
  );
}
