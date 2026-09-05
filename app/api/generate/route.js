mport { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");
    const prompt = formData.get("prompt");
    const duration = Number(formData.get("duration") || 5);

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RUNWAYML_API_SECRET;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Runway API key is not configured." },
        { status: 500 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = data:${image.type};base64,${base64Image};

    const runwayResponse = await fetch(
      "https://api.dev.runwayml.com/v1/image_to_video",
      {
        method: "POST",
        headers: {
          Authorization: Bearer ${apiKey},
          "Content-Type": "application/json",
          "X-Runway-Version": "2024-11-06",
        },
        body: JSON.stringify({
          model: "gen4.5",
          promptImage: dataUri,
          promptText: prompt,
          ratio: "1280:720",
          duration: duration,
        }),
      }
    );

    const result = await runwayResponse.json();

    if (!runwayResponse.ok) {
      console.error("Runway error:", result);

      return NextResponse.json(
        {
          error:
            result?.error ||
            result?.message ||
            "Runway could not start the video generation.",
        },
        { status: runwayResponse.status }
      );
    }

    return NextResponse.json({
      taskId: result.id,
      status: "started",
    });
  } catch (error) {
    console.error("Generate error:", error);

    return NextResponse.json(
      { error: "Unable to start video generation." },
      { status: 500 }
    );
  }
}
