# Skeuomorphic Answering Machine Web App

A playful, skeuomorphic web application that resembles a physical answering machine. Visitors can record audio messages which are automatically uploaded as compressed MP3 files directly to Dropbox.

## Features

- 🎙️ Browser-based audio recording with MediaRecorder API
- 📱 Responsive skeuomorphic design mimicking a physical answering machine
- 🎵 Automatic MP3 compression for optimal storage
- ☁️ Direct-to-Dropbox upload without backend storage
- 🛡️ Recording limits (10 messages per browser, 10 minutes max duration)
- 🎨 Animated tape reels and realistic UI elements

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Dropbox account and API credentials

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd web-voicemail
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Dropbox API credentials:

```env
NEXT_PUBLIC_DROPBOX_APP_KEY=your_dropbox_app_key_here
DROPBOX_APP_SECRET=your_dropbox_app_secret_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More
