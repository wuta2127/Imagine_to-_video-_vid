import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const prompt = formData.get('prompt');
    const duration = formData.get('duration') || '5';

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required.' },
        { status: 400 }
      );
    }

    /*
      CONNECT YOUR VIDEO MODEL/API HERE.

      Generic flow:
      1. Upload the image to your provider or object storage.
      2. Send image URL/file + prompt + duration to the video model.
      3. Poll the provider until the generation job finishes.
      4. Return the final MP4 URL:
         return NextResponse.json({ videoUrl: finalVideoUrl });

      Keep API keys only on the server, for example:
      VIDEO_API_KEY=your_key_here

      This starter intentionally does not hard-code a specific provider,
      so you can connect the service/model you prefer.
    */

    // Demo response so the interface can be tested immediately.
    // Replace this URL with the generated result from your AI video provider.
    const demoVideo =
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({
      videoUrl: demoVideo,
      demo: true,
      received: {
        fileName: image.name,
        prompt,
        duration
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Unable to generate the video.' },
      { status: 500 }
    );
  }
}
