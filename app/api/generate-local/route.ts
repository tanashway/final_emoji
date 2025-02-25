import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/client";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log('Starting local emoji generation with prompt:', prompt);
    
    try {
      // Call the local Stable Diffusion API
      const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `emoji style ${prompt}, simple, cute, minimal, solid color background, centered`,
          negative_prompt: "text, watermark, signature, blurry, low quality, realistic, photographic, photograph, multiple objects",
          width: 1024,
          height: 1024,
          steps: 30,
          cfg_scale: 7.5,
          sampler_name: "Euler a"
        }),
      });
      
      if (!response.ok) {
        console.error('Local API error:', response.status, await response.text());
        return NextResponse.json(
          { error: "Error communicating with local Stable Diffusion. Please ensure it's running on port 7860." },
          { status: 500 }
        );
      }
      
      const data = await response.json();
      
      if (!data.images || data.images.length === 0) {
        console.error('No images received from local API');
        return NextResponse.json(
          { error: "No images were generated. Please try a different prompt." },
          { status: 500 }
        );
      }
      
      console.log(`Received ${data.images.length} images from local API`);
      
      // Process the base64 images
      const processedImages = await Promise.all(data.images.map(async (base64Image: string) => {
        // Create a buffer from the base64 image
        const imageBuffer = Buffer.from(base64Image, 'base64');
        
        // Generate a unique filename
        const filename = `emoji-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('emojis')
          .upload(`generated/${filename}`, imageBuffer, {
            contentType: 'image/png',
            cacheControl: '3600'
          });
        
        if (uploadError) {
          console.error('Error uploading to Supabase:', uploadError);
          throw new Error('Failed to upload generated image');
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('emojis')
          .getPublicUrl(`generated/${filename}`);
        
        const imageUrl = publicUrlData.publicUrl;
        
        // Add to emojis table
        const { error: dbError } = await supabase
          .from('emojis')
          .insert([{
            image_url: imageUrl,
            prompt: prompt,
            creator_user_id: userId,
            likes_count: 0
          }]);
        
        if (dbError) {
          console.error('Error inserting into database:', dbError);
          throw new Error('Failed to save emoji to database');
        }
        
        return imageUrl;
      }));
      
      return NextResponse.json({ images: processedImages });
    } catch (error) {
      console.error('Error with local generation:', error);
      return NextResponse.json(
        { error: "Error communicating with local Stable Diffusion. Please ensure it's running on port 7860." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error generating emoji:', errorMessage);
    return NextResponse.json(
      { error: "Failed to generate emoji. Please try again with a different prompt." },
      { status: 500 }
    );
  }
} 