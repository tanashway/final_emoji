import { NextResponse } from "next/server";
import sharp from 'sharp';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Fetch the image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the image with sharp
    const processedImage = await sharp(buffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .webp({ quality: 80, lossless: false }) // Optimize for size while maintaining quality
      .toBuffer();

    // Check if the processed image is under 100KB
    if (processedImage.length > 100 * 1024) {
      // If it's over 100KB, try again with lower quality
      const reprocessedImage = await sharp(buffer)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({ quality: 60, lossless: false })
        .toBuffer();

      return new NextResponse(reprocessedImage, {
        headers: {
          'Content-Type': 'image/webp',
          'Content-Disposition': 'attachment; filename="sticker.webp"'
        }
      });
    }

    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Disposition': 'attachment; filename="sticker.webp"'
      }
    });

  } catch (error) {
    console.error('Error converting image to sticker:', error);
    return NextResponse.json(
      { error: "Failed to convert image to sticker" },
      { status: 500 }
    );
  }
} 