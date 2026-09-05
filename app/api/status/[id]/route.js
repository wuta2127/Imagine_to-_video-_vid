import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required." },
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

    const runwayResponse = await fetch(
      `https://api.dev.runwayml.com/v1/tasks/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "X-Runway-Version": "2024-11-06",
        },
        cache: "no-store",
      }
    );

    const result = await runwayResponse.json();

    if (!runwayResponse.ok) {
      console.error("Runway status error:", result);

      return NextResponse.json(
        {
          error:
            result?.error ||
            result?.message ||
            "Unable to check Runway task.",
        },
        { status: runwayResponse.status }
      );
    }

    if (result.status === "SUCCEEDED") {
      return NextResponse.json({
        status: "SUCCEEDED",
        videoUrl: result.output?.[0] || null,
      });
    }

    if (
      result.status === "FAILED" ||
      result.status === "CANCELED"
    ) {
      return NextResponse.json({
        status: result.status,
        error:
          result.failure ||
          "Video generation failed.",
      });
    }

    return NextResponse.json({
      status: result.status,
      videoUrl: null,
    });
  } catch (error) {
    console.error("Status route error:", error);

    return NextResponse.json(
      {
        error: "Unable to check video generation status.",
      },
      { status: 500 }
    );
  }
}
