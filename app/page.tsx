'use client';

import { useUser } from "@clerk/nextjs";
import { EmojiGeneratorForm } from "@/components/emoji-generator-form";
import { EmojiGrid } from "@/components/emoji-grid";
import { LoadingAnimation } from "@/components/loading-animation";
import { useEmojiStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { emojis, isLoading, setIsLoading, addEmojis, toggleLike, isLiked } = useEmojiStore();

  // Filter emojis to only show the current user's emojis
  const userEmojis = emojis.filter(emoji => emoji.userId === user?.id);

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
        ) : userEmojis.length > 0 ? (
          <EmojiGrid
            emojis={userEmojis}
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
