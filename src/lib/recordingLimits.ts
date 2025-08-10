/**
 * Manages recording count limits using localStorage
 */

export class RecordingLimitManager {
  private static readonly STORAGE_KEY = "answering_machine_recording_count";
  private static readonly MAX_RECORDINGS = 10;

  /**
   * Checks if the user can record another message
   */
  static canRecord(): boolean {
    const count = this.getRecordingCount();
    return count < this.MAX_RECORDINGS;
  }

  /**
   * Increments the recording count
   */
  static incrementCount(): void {
    const currentCount = this.getRecordingCount();
    localStorage.setItem(this.STORAGE_KEY, String(currentCount + 1));
  }

  /**
   * Gets the current recording count
   */
  static getRecordingCount(): number {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      // Handle localStorage access errors (private browsing, etc.)
      return 0;
    }
  }

  /**
   * Resets the recording count (for testing purposes)
   */
  static resetCount(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Handle localStorage access errors
    }
  }

  /**
   * Gets remaining recordings
   */
  static getRemainingRecordings(): number {
    return Math.max(0, this.MAX_RECORDINGS - this.getRecordingCount());
  }
}
