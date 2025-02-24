import { supabase } from '@/lib/supabase/client';
import type { Emoji } from '@/lib/types';

export async function createEmoji(data: {
  image_url: string;
  prompt: string;
  creator_user_id: string;
}) {
  const { error } = await supabase
    .from('emojis')
    .insert([{
      url: data.image_url,
      prompt: data.prompt,
      creator_user_id: data.creator_user_id,
      likes_count: 0
    }]);

  if (error) {
    console.error('Error creating emoji:', error);
    throw error;
  }
}

export async function getEmojis() {
  const { data, error } = await supabase
    .from('emojis')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching emojis:', error);
    throw error;
  }

  return data?.map(emoji => ({
    id: emoji.id,
    url: emoji.url,
    prompt: emoji.prompt,
    likes: emoji.likes_count || 0,
    createdAt: emoji.created_at
  })) as Emoji[];
}

export async function toggleLike(emojiId: string, userId: string) {
  // Check if the user has already liked this emoji
  const { data: existingLike, error: likeCheckError } = await supabase
    .from('emoji_likes')
    .select()
    .eq('user_id', userId)
    .eq('emoji_id', emojiId)
    .single();

  if (likeCheckError && !likeCheckError.message.includes('No rows found')) {
    console.error('Error checking like:', likeCheckError);
    throw likeCheckError;
  }

  // If the user has already liked the emoji, remove the like
  if (existingLike) {
    const { error: deleteLikeError } = await supabase
      .from('emoji_likes')
      .delete()
      .eq('user_id', userId)
      .eq('emoji_id', emojiId);

    if (deleteLikeError) {
      console.error('Error removing like:', deleteLikeError);
      throw deleteLikeError;
    }

    // Decrement the likes count
    const { error: updateError } = await supabase
      .from('emojis')
      .update({ likes_count: supabase.raw('likes_count - 1') })
      .eq('id', emojiId);

    if (updateError) {
      console.error('Error updating likes count:', updateError);
      throw updateError;
    }

    return false;
  }

  // If the user hasn't liked the emoji yet, add the like
  const { error: addLikeError } = await supabase
    .from('emoji_likes')
    .insert([{ user_id: userId, emoji_id: emojiId }]);

  if (addLikeError) {
    console.error('Error adding like:', addLikeError);
    throw addLikeError;
  }

  // Increment the likes count
  const { error: updateError } = await supabase
    .from('emojis')
    .update({ likes_count: supabase.raw('likes_count + 1') })
    .eq('id', emojiId);

  if (updateError) {
    console.error('Error updating likes count:', updateError);
    throw updateError;
  }

  return true;
}

export async function isEmojiLikedByUser(emojiId: string, userId: string) {
  const { data, error } = await supabase
    .from('emoji_likes')
    .select()
    .eq('user_id', userId)
    .eq('emoji_id', emojiId)
    .single();

  if (error && !error.message.includes('No rows found')) {
    console.error('Error checking like status:', error);
    throw error;
  }

  return !!data;
} 