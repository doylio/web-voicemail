# Coding Style Guide - Skeuomorphic Answering Machine Web App

## Overview

This style guide ensures consistency and maintainability for AI developers working on the skeuomorphic answering machine web application. The project uses Next.js with TypeScript and focuses on creating a realistic, nostalgic user interface with direct-to-Dropbox audio recording functionality.

## TypeScript Guidelines

### Type Safety

- **Strict TypeScript**: Use strict mode with no `any` types allowed
- **Explicit typing**: Always provide explicit return types for functions
- **Interface over type**: Prefer `interface` for object shapes, `type` for unions/primitives
- **Null safety**: Use strict null checks, prefer optional chaining (`?.`)

```typescript
// ✅ Good
interface RecordingState {
  isRecording: boolean;
  duration: number;
  hasPermission: boolean | null;
}

function startRecording(): Promise<MediaStream> {
  // implementation
}

// ❌ Bad
function startRecording(): any {
  // implementation
}
```

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Files**:
  - Components: `PascalCase.tsx`
  - Utilities: `camelCase.ts`
  - Pages: `kebab-case.tsx` (Next.js convention)

```typescript
// ✅ Good
const MAX_RECORDING_DURATION = 600; // 10 minutes
interface AudioRecorderProps {}
const RecordingButton: React.FC<AudioRecorderProps> = () => {};
```

## File Organization

### Directory Structure

Follow Next.js App Router structure:

```
src/
├── app/                    # Next.js App Router - pages, layouts, global styles
├── components/            # Reusable UI components for the answering machine interface
├── hooks/                 # Custom React hooks for audio recording, uploads, and state
├── lib/                   # Utility functions, API clients, and shared configurations
├── types/                 # TypeScript type definitions for all data structures
└── styles/               # Component-specific CSS modules for skeuomorphic styling
```

## Component Guidelines

### Component Structure

Follow this consistent structure for all React components:

```typescript
// 1. Imports
// 2. Types/Interfaces specific to this component
// 3. Constants specific to this component
// 4. Main component function
// 5. Sub-components (if any)
// 6. Default export

interface RecordingButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

const BUTTON_ANIMATION_DURATION = 300;

/**
 * A skeuomorphic record button that mimics a physical answering machine button
 */
export const RecordingButton: React.FC<RecordingButtonProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
  disabled = false,
}) => {
  // Component implementation
};
```

### Props and State

- **Props**: Always destructure props in function signature
- **State**: Use descriptive state variable names
- **Handlers**: Prefix event handlers with `handle` or `on`

```typescript
// ✅ Good
const [isRecording, setIsRecording] = useState<boolean>(false);
const [recordingDuration, setRecordingDuration] = useState<number>(0);

const handleStartRecording = useCallback(() => {
  // implementation
}, []);

// ❌ Bad
const [recording, setRecording] = useState(false);
const [duration, setDuration] = useState(0);
```

## Styling Guidelines

### CSS Modules Approach

Use CSS Modules for component-specific styling to maintain the skeuomorphic design:

```typescript
// RecordingButton.tsx
import styles from "./RecordingButton.module.css";

export const RecordingButton: React.FC<Props> = () => {
  return (
    <button
      className={`${styles.recordButton} ${
        isRecording ? styles.recording : ""
      }`}
    >
      Record
    </button>
  );
};
```

```css
/* RecordingButton.module.css */
.recordButton {
  /* Skeuomorphic styling */
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  border-radius: 50%;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  transition: all 0.3s ease;
}

.recordButton.recording {
  background: linear-gradient(145deg, #ff4444, #ff6666);
  box-shadow: inset 5px 5px 10px #cc3333, inset -5px -5px 10px #ff7777;
}
```

### Animation Guidelines

- Use CSS transitions for smooth skeuomorphic effects
- Prefer `transform` and `opacity` for performance
- Keep animations subtle and realistic

## Audio Recording Guidelines

### MediaRecorder API Usage

```typescript
/**
 * Initializes audio recording with optimal settings for voice recording
 */
async function initializeRecording(): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  });

  const recorder = new MediaRecorder(stream, {
    mimeType: "audio/webm;codecs=opus",
  });

  return recorder;
}
```

### Error Handling

Always handle audio permission and recording errors gracefully:

```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // Recording logic
} catch (error) {
  if (error.name === "NotAllowedError") {
    // Handle permission denied
  } else if (error.name === "NotFoundError") {
    // Handle no microphone found
  } else {
    // Handle other errors
  }
}
```

## Documentation Standards

### JSDoc Comments

Provide JSDoc comments for all exported functions, custom hooks, and complex logic:

````typescript
/**
 * Custom hook for managing audio recording state and operations
 *
 * @param maxDuration - Maximum recording duration in seconds (default: 600)
 * @returns Object containing recording state and control functions
 *
 * @example
 * ```typescript
 * const { isRecording, startRecording, stopRecording } = useAudioRecorder(300);
 * ```
 */
export function useAudioRecorder(maxDuration: number = 600) {
  // Implementation
}
````

### Inline Comments

Add inline comments for complex logic, especially around:

- Audio encoding/decoding
- Dropbox API interactions
- Skeuomorphic animations
- Browser compatibility checks

```typescript
// Convert WebM to MP3 using lamejs for better compression and compatibility
const mp3Buffer = convertToMp3(audioBuffer, {
  bitRate: 64, // 64kbps for optimal size/quality balance
  sampleRate: 44100,
});

// Apply skeuomorphic shadow animation to simulate button press
const animateButtonPress = () => {
  // Reduce shadow depth to simulate physical depression
  element.style.boxShadow = "inset 5px 5px 10px rgba(0,0,0,0.2)";
};
```

## State Management

### Local State

Use React's built-in state management for component-level state:

```typescript
interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  uploadStatus: "idle" | "uploading" | "success" | "error";
}

const [recordingState, setRecordingState] = useState<RecordingState>({
  isRecording: false,
  isPaused: false,
  duration: 0,
  audioBlob: null,
  uploadStatus: "idle",
});
```

### LocalStorage for Limits

Handle recording limits with proper error handling:

```typescript
/**
 * Manages recording count limits using localStorage
 */
class RecordingLimitManager {
  private static readonly STORAGE_KEY = "answering_machine_recording_count";
  private static readonly MAX_RECORDINGS = 10;

  static canRecord(): boolean {
    const count = this.getRecordingCount();
    return count < this.MAX_RECORDINGS;
  }

  static incrementCount(): void {
    const currentCount = this.getRecordingCount();
    localStorage.setItem(this.STORAGE_KEY, String(currentCount + 1));
  }

  private static getRecordingCount(): number {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      // Handle localStorage access errors (private browsing, etc.)
      return 0;
    }
  }
}
```

## Performance Guidelines

### Async Operations

- Use proper async/await patterns for audio operations
- Handle Promise rejections appropriately
- Avoid blocking the main thread during MP3 encoding

```typescript
/**
 * Processes and uploads recorded audio with proper error handling
 */
async function processAndUploadRecording(audioBlob: Blob): Promise<void> {
  try {
    // Convert to MP3 in a non-blocking way
    const mp3Blob = await convertToMp3Async(audioBlob);

    // Upload to Dropbox
    await uploadToDropbox(mp3Blob);
  } catch (error) {
    console.error("Recording processing failed:", error);
    throw new Error("Failed to process recording");
  }
}
```

### Memory Management

- Clean up MediaRecorder streams properly
- Revoke object URLs after use
- Clear audio buffers when no longer needed

## Security Guidelines

### Dropbox API

- Never expose Dropbox API keys in client-side code
- Use temporary upload tokens generated server-side
- Validate file types and sizes before upload

### Audio Permissions

- Request microphone permissions gracefully
- Provide clear feedback when permissions are denied
- Handle permission state changes

## Testing Considerations

While testing setup is a separate ticket, structure code to be testable:

- Keep pure functions separate from React components
- Use dependency injection for external services
- Make side effects explicit and controllable

```typescript
// ✅ Good - testable
export function calculateRecordingDuration(
  startTime: number,
  endTime: number
): number {
  return Math.floor((endTime - startTime) / 1000);
}

// ✅ Good - dependency injection
export function createAudioRecorder(
  mediaDevices: MediaDevices = navigator.mediaDevices
) {
  // Implementation
}
```

## Browser Compatibility

Ensure compatibility with modern browsers:

- Use feature detection for MediaRecorder API
- Provide fallbacks for unsupported audio formats
- Handle different browser audio constraints

```typescript
/**
 * Checks if the browser supports the required audio recording features
 */
function checkAudioSupport(): { supported: boolean; reason?: string } {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { supported: false, reason: "MediaDevices API not supported" };
  }

  if (!window.MediaRecorder) {
    return { supported: false, reason: "MediaRecorder API not supported" };
  }

  return { supported: true };
}
```

This style guide should be followed by all AI developers working on the project to ensure consistent, maintainable, and high-quality code that achieves the skeuomorphic answering machine vision outlined in the PRD.
