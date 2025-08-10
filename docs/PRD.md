# Product Requirements Document (PRD) — Skeuomorphic Answering Machine Web App

## 1. Overview

A playful, skeuomorphic web application that resembles a physical answering machine. Visitors can record an audio message, which is automatically uploaded as a compressed MP3 file directly from their browser to a designated Dropbox folder. The admin can then download and delete messages directly via Dropbox’s web or desktop interface.

The app will be **MVP complete** on launch — no expansion phases expected.

Key goals:

- Fun, nostalgic skeuomorphic design.
- Simple user flow for visitors (record → upload → done).
- Direct-to-Dropbox upload, no backend storage handling.
- Operate entirely on free-tier hosting and storage to keep costs at **\$0**.

---

## 2. Core User Experience

### 2.1 UI & Skeuomorphic Design

- Main interface resembles a physical answering machine:

  - Large central **Record** button.
  - Decorative **play, stop, rewind** buttons (non-functional, for aesthetics).
  - Small digital display (e.g., “Recording… 00:45”).
  - Optional **animated spinning tape reels** while recording.

- Background and textures styled for realism (shadows, highlights, brushed metal/plastic).
- Mobile and desktop responsive.

### 2.2 Recording Flow

1. User lands on page.
2. Sees answering machine interface.
3. Clicks **Record Message**.
4. Browser microphone permission prompt appears.
5. Recording starts; digital display shows elapsed time; tape reels animate.
6. Auto-stop after **10 minutes** or when user clicks **Stop**.
7. Recording automatically uploads as an MP3 file (32–64 kbps) directly to Dropbox.
8. Simple confirmation message: “Message saved. Thank you!”

### 2.3 Limits & Anti-Spam

- LocalStorage counter limits each browser to **10 recordings**.
- Enforced recording time limit: **10 minutes** max.
- No login required for visitors.

---

## 3. Admin Functionality

- **Admin = Non-technical person.**
- Recordings saved in a **Dropbox folder**.
- Admin manages messages directly in Dropbox: listen, download, delete.
- Admin access secured via their Dropbox account.
- Filenames include **timestamp** (e.g., `message-2025-08-10_14-23-05.mp3`).

---

## 4. Storage & Hosting

### 4.1 Storage

- **Dropbox** via direct upload from client using Dropbox API.
- Files stored as compressed MP3 at **32–64 kbps** for optimal space usage.
- Files are private — only accessible to the admin via their Dropbox login.
- Estimated capacity: \~200–400 ten-minute messages per 1 GB.

### 4.2 Hosting

- Next.js app hosted on **Vercel Hobby (free) tier**.
- No heavy backend — minimal serverless functions if needed for generating temporary Dropbox upload tokens.

### 4.3 Cost Control

- Direct-to-Dropbox upload avoids server hosting file payloads.
- MP3 compression minimizes storage usage.

---

## 5. Tech Stack

**Frontend:**

- React via Next.js with TypeScript (strict type safety, no `any` types).
- HTML5 Audio API for recording.
- MP3 encoding in browser (32–64 kbps).
- CSS3 + JS animations for skeuomorphic effects (spinning tapes, glowing LEDs).

**Backend:**

- Minimal — only if required for token generation.
- Dropbox API for secure upload flow.

**Build & Deployment:**

- Hosted on Vercel (Hobby tier).
- Version control via GitHub.

---

## 6. Privacy & Permissions

- No explicit consent form — browser handles microphone permission requests.
- No personally identifiable metadata collected.
- No analytics unless admin adds externally.

---

## 7. Optional Features (if budget/time allow)

- **Greeting audio**: play a pre-recorded message before recording begins.

---

## 8. Acceptance Criteria

- Users can:

  - Visit site, record up to 10 messages (10 min each), and have them saved to admin’s Dropbox.
  - See realistic skeuomorphic answering machine UI with animations during recording.

- Admin can:

  - Access all recordings in their Dropbox folder.
  - Play, download, delete them via Dropbox.

- The app:

  - Runs entirely on free-tier hosting & storage.
  - Enforces time and count limits to control storage costs.
  - Works on modern desktop and mobile browsers.

---

## 9. Non-Goals

- No authentication for users.
- No built-in playback for visitors after recording.
- No transcription or analytics.
- No custom admin dashboard.
