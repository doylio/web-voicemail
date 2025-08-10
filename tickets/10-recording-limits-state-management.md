# Ticket #10: Recording Limits & State Management

## Description

Implement comprehensive state management for recording sessions, including LocalStorage-based recording limits, time constraints, and overall application state handling.

## Priority

High - Essential for preventing abuse and managing user experience

## Dependencies

- Ticket #4: Recording Controls UI (UI states needed)
- Ticket #9: Dropbox Upload Integration (upload completion tracking needed)

## Acceptance Criteria

### Recording Count Limits

- [ ] Implement LocalStorage-based counter for recording attempts
- [ ] Limit each browser to maximum 10 recordings
- [ ] Track successful uploads vs. failed attempts
- [ ] Display remaining recording count to users
- [ ] Handle LocalStorage clearing/manipulation gracefully
- [ ] Prevent recording when limit is reached

### Time-Based Limits

- [ ] Enforce 10-minute maximum recording duration
- [ ] Implement countdown timer showing remaining time
- [ ] Auto-stop recording when time limit reached
- [ ] Provide warnings as time limit approaches (e.g., at 9 minutes)
- [ ] Handle timer display updates smoothly

### Recording State Management

- [ ] Implement comprehensive state machine for recording flow:
  - Idle (ready to record)
  - Recording (actively recording)
  - Stopped (recording finished, processing)
  - Encoding (converting to MP3)
  - Uploading (sending to Dropbox)
  - Completed (upload successful)
  - Error (various error states)
- [ ] Ensure smooth transitions between states
- [ ] Prevent invalid state transitions
- [ ] Handle browser refresh during recording

### LocalStorage Management

- [ ] Store recording count persistently
- [ ] Track recording timestamps for potential future features
- [ ] Handle LocalStorage quota limits
- [ ] Implement data validation for stored values
- [ ] Provide mechanism to reset count (for testing/debugging)
- [ ] Handle LocalStorage unavailable scenarios

### User Feedback & Messaging

- [ ] Display current recording count (e.g., "Recording 3 of 10")
- [ ] Show time remaining during recording
- [ ] Provide clear messages when limits are reached
- [ ] Display appropriate error messages for each state
- [ ] Show progress indicators for long-running operations

### Anti-Spam Measures

- [ ] Implement client-side rate limiting
- [ ] Track and prevent rapid successive recording attempts
- [ ] Add cooldown period between recordings if needed
- [ ] Handle suspicious usage patterns gracefully
- [ ] Prevent automation/bot usage where possible

### Error State Handling

- [ ] Handle partial recordings (stopped before completion)
- [ ] Manage failed upload scenarios
- [ ] Recover gracefully from browser crashes
- [ ] Handle network interruptions during recording
- [ ] Provide clear recovery options for users

### Persistence & Recovery

- [ ] Save recording state across browser sessions where appropriate
- [ ] Handle browser refresh during active recording
- [ ] Implement session recovery for interrupted uploads
- [ ] Clear temporary data after successful completion
- [ ] Handle browser back/forward navigation appropriately

### Performance & Memory Management

- [ ] Clean up audio data after successful upload
- [ ] Prevent memory leaks during long recording sessions
- [ ] Handle large recordings efficiently
- [ ] Optimize state updates for smooth UI performance
- [ ] Monitor resource usage during recording

### Accessibility & User Experience

- [ ] Provide screen reader announcements for state changes
- [ ] Ensure all limits and states are clearly communicated
- [ ] Handle keyboard navigation through different states
- [ ] Provide clear visual indicators for all states
- [ ] Test with assistive technologies

### Edge Case Handling

- [ ] Handle system clock changes during recording
- [ ] Manage browser memory pressure scenarios
- [ ] Handle device sleep/wake during recording
- [ ] Test with browser developer tools manipulation
- [ ] Handle concurrent tab scenarios appropriately

## Technical Notes

- Use React state management (Context or local state)
- Implement proper cleanup in useEffect hooks
- Consider using a state machine library for complex state management
- Ensure state persistence is handled securely
- Plan for future state synchronization if needed

## Testing Requirements

- Test LocalStorage limits and edge cases
- Verify state management across browser sessions
- Test all error scenarios and recovery paths
- Validate timing accuracy and consistency
- Test on various devices and browsers

## Definition of Done

- Recording limits are properly enforced
- State management works reliably across all scenarios
- User feedback is clear and helpful for all states
- Error handling provides appropriate recovery options
- Performance remains smooth during all operations
- Anti-spam measures are effective but not intrusive
