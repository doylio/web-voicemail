import { Dropbox } from "dropbox";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

/**
 * API route to generate a temporary Dropbox upload link
 * POST /api/dropbox/upload-link
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { filename } = await request.json();

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Initialize Dropbox client with app credentials
    const dropbox = new Dropbox({
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
      fetch: fetch,
    });

    // Generate folder path (default to /voicemail-messages if not specified)
    const folderPath = process.env.DROPBOX_FOLDER_PATH || "/voicemail-messages";
    const fullPath = `${folderPath}/${filename}`;

    // Generate temporary upload link
    const response = await dropbox.filesGetTemporaryUploadLink({
      commit_info: {
        path: fullPath,
        mode: { ".tag": "add" },
        autorename: true,
      },
      duration: 600, // 10 minutes expiration
    });

    return NextResponse.json({
      uploadUrl: response.result.link,
      path: fullPath,
    });
  } catch (error) {
    console.error("Dropbox upload link generation failed:", error);

    // Return a user-friendly error without exposing internal details
    return NextResponse.json(
      { error: "Failed to generate upload link" },
      { status: 500 }
    );
  }
}
