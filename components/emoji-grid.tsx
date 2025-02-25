'use client';

import { Download, Heart, Sticker } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Emoji } from "@/lib/types";
import { toast } from "sonner";

interface EmojiGridProps {
  emojis: Emoji[];
  onLike?: (id: string) => void;
  isLiked: (id: string) => boolean;
}

const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return url.trim().length > 0;
  } catch {
    return false;
  }
};

const downloadImage = async (url: string, prompt: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `emoji-${prompt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
    toast.error('Failed to download image');
  }
};

const downloadSticker = async (url: string, prompt: string) => {
  try {
    const response = await fetch('/api/sticker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: url }),
    });

    if (!response.ok) {
      throw new Error('Failed to convert image to sticker');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `sticker-${prompt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    toast.success('Sticker downloaded successfully');
  } catch (error) {
    console.error('Error downloading sticker:', error);
    toast.error('Failed to download sticker');
  }
};

export function EmojiGrid({ emojis, onLike, isLiked }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
      {emojis.filter(emoji => isValidUrl(emoji.url)).map((emoji) => (
        <div key={emoji.id} className="relative group bg-white dark:bg-gray-800 rounded-lg p-2">
          <div className="relative aspect-square">
            <Image
              src={emoji.url}
              alt={`Generated emoji from prompt: ${emoji.prompt}`}
              fill
              className="object-contain rounded-lg"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => onLike?.(emoji.id)}
              >
                <Heart 
                  className={`h-4 w-4 transition-colors ${isLiked(emoji.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => downloadImage(emoji.url, emoji.prompt)}
                title="Download as PNG"
              >
                <Download className="h-4 w-4 text-white" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => downloadSticker(emoji.url, emoji.prompt)}
                title="Download as WhatsApp Sticker"
              >
                <Sticker className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300 truncate" title={emoji.prompt}>
              {emoji.prompt}
            </span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Heart className="h-3 w-3" /> {emoji.likes}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 