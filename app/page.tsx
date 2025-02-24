'use client';

import { useUser } from "@clerk/nextjs";
import { EmojiGeneratorForm } from "@/components/emoji-generator-form";
import { EmojiGrid } from "@/components/emoji-grid";
import { LoadingAnimation } from "@/components/loading-animation";
import { useEmojiStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { emojis, isLoading, setIsLoading, addEmojis, toggleLike, isLiked } = useEmojiStore();

  // Filter emojis to only show the current user's emojis when signed in
  const filteredEmojis = isSignedIn 
    ? emojis.filter(emoji => emoji.userId === user?.id)
    : emojis;

  if (!isLoaded) {
    return <LoadingAnimation />;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
        <main className="container mx-auto flex flex-col items-center py-16 px-4 text-center gap-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Create Amazing Emojis with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Generate unique and expressive emojis using artificial intelligence. 
            Sign up now to start creating your own custom emojis!
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </SignUpButton>

          {isLoading ? (
            <LoadingAnimation />
          ) : emojis.length > 0 ? (
            <div className="w-full max-w-4xl">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Latest Community Creations
              </h2>
              <EmojiGrid
                emojis={emojis}
                onLike={toggleLike}
                isLiked={isLiked}
              />
            </div>
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto flex flex-col items-center py-16 px-4 gap-8">
        <h1 className="text-4xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          🤓 Emoji maker
        </h1>
        
        <div className="w-full max-w-xl">
          <EmojiGeneratorForm
            onGenerate={async (prompt: string) => {
              try {
                setIsLoading(true);
                const response = await fetch("/api/generate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || "Failed to generate emoji");
                }

                if (!Array.isArray(data.images) || data.images.length === 0) {
                  throw new Error("No emoji was generated. Please try a different prompt.");
                }

                addEmojis(data.images, prompt, user?.id || '');
              } catch (error) {
                console.error('Error generating emoji:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to generate emoji');
              } finally {
                setIsLoading(false);
              }
            }}
            isGenerating={isLoading}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try prompts like "happy cat", "cool penguin", or "excited robot"
          </p>
        </div>

        {isLoading ? (
          <LoadingAnimation />
        ) : filteredEmojis.length > 0 ? (
          <EmojiGrid
            emojis={filteredEmojis}
            onLike={toggleLike}
            isLiked={isLiked}
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No emojis generated yet.</p>
            <p className="text-sm">Enter a prompt above to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
