import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Emoji {
  id: string;
  url: string;
  prompt: string;
  likes: number;
  userId: string;
  createdAt: string;
}

interface EmojiStore {
  emojis: Emoji[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  addEmojis: (urls: string[], prompt: string, userId: string) => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
}

export const useEmojiStore = create<EmojiStore>()(
  persist(
    (set, get) => ({
      emojis: [],
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      addEmojis: (urls, prompt, userId) => {
        const newEmojis = urls.map((url) => ({
          id: Math.random().toString(36).substring(7),
          url,
          prompt,
          likes: 0,
          userId,
          createdAt: new Date().toISOString(),
        }));
        set({ emojis: [...newEmojis, ...get().emojis] });
      },
      toggleLike: (id) =>
        set((state) => ({
          emojis: state.emojis.map((emoji) =>
            emoji.id === id
              ? { ...emoji, likes: emoji.likes + (emoji.likes > 0 ? -1 : 1) }
              : emoji
          ),
        })),
      isLiked: (id) => (get().emojis.find((emoji) => emoji.id === id)?.likes ?? 0) > 0,
    }),
    {
      name: 'emoji-storage',
    }
  )
); 