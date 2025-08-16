/**
 * Utility functions for Dropbox upload operations
 */

interface DropboxUploadLinkResponse {
  uploadUrl: string;
  path: string;
}

/**
 * Generates a temporary Dropbox upload link via the server API
 *
 * @param filename - The name of the file to upload
 * @returns Promise resolving to upload URL and path information
 *
 * @throws Error if the API request fails or returns an error
 */
export async function getDropboxUploadLink(
  filename: string
): Promise<DropboxUploadLinkResponse> {
  const response = await fetch("/api/dropbox/upload-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to get upload link");
  }

  return response.json();
}

/**
 * Uploads an audio blob to Dropbox using a temporary upload link
 *
 * @param blob - The audio blob to upload
 * @param uploadUrl - The temporary upload URL from Dropbox
 * @returns Promise resolving when upload is complete
 *
 * @throws Error if the upload fails
 */
export async function uploadToDropbox(
  blob: Blob,
  uploadUrl: string
): Promise<void> {
  // Create form data for the upload
  const formData = new FormData();
  formData.append("file", blob);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status: ${response.status}`);
  }
}

/**
 * Complete workflow to upload an audio recording to Dropbox
 *
 * @param blob - The audio blob to upload
 * @param filename - The name for the uploaded file
 * @returns Promise resolving to the Dropbox path where the file was uploaded
 *
 * @throws Error if any step of the process fails
 */
export async function uploadRecordingToDropbox(
  blob: Blob,
  filename: string
): Promise<string> {
  try {
    // Step 1: Get temporary upload link
    const { uploadUrl, path } = await getDropboxUploadLink(filename);

    // Step 2: Upload the file
    await uploadToDropbox(blob, uploadUrl);

    return path;
  } catch (error) {
    console.error("Failed to upload recording to Dropbox:", error);
    throw new Error("Failed to save your message. Please try again.");
  }
}
