import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data: emojis, error } = await supabase
      .from('emojis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emojis:', error);
      return NextResponse.json(
        { error: 'Failed to fetch emojis' },
        { status: 500 }
      );
    }

    return NextResponse.json({ emojis });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 