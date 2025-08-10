# Ticket #8: MP3 Encoding

## Description

Implement browser-based MP3 encoding to compress recorded audio files at 32-64 kbps before upload to minimize storage usage and upload time.

## Priority

High - Required for storage efficiency

## Dependencies

- Ticket #7: Dropbox API Integration & Audio Recording (audio recording needed)

## Acceptance Criteria

### MP3 Encoding Implementation

- [ ] Research and integrate browser-based MP3 encoding library (e.g., lamejs)
- [ ] Convert recorded WAV audio to MP3 format
- [ ] Configure encoding bitrate between 32-64 kbps for optimal compression
- [ ] Maintain acceptable audio quality for voice recordings
- [ ] Handle encoding process without blocking UI

### Encoding Configuration

- [ ] Set appropriate MP3 encoding parameters:
  - Bitrate: 32-64 kbps (configurable)
  - Sample rate: optimize for voice (22kHz or lower)
  - Channel configuration: mono for voice recordings
- [ ] Test different bitrate settings for quality vs. size balance
- [ ] Ensure encoding settings are consistent across all recordings

### Performance Optimization

- [ ] Implement encoding in Web Worker to avoid UI blocking
- [ ] Show encoding progress to user during conversion
- [ ] Handle large audio files efficiently
- [ ] Optimize memory usage during encoding process
- [ ] Test encoding speed on various devices

### File Size Management

- [ ] Validate compressed file sizes meet storage requirements
- [ ] Calculate estimated storage usage (target: 200-400 messages per GB)
- [ ] Implement file size monitoring and reporting
- [ ] Handle encoding failures gracefully
- [ ] Provide fallback options if encoding fails

### Quality Assurance

- [ ] Test encoded audio quality across different recording scenarios:
  - Quiet voices
  - Loud voices
  - Background noise
  - Music/non-voice content
- [ ] Ensure audio remains intelligible after compression
- [ ] Compare file sizes before and after encoding
- [ ] Validate audio playback compatibility

### Browser Compatibility

- [ ] Test MP3 encoding across target browsers
- [ ] Handle browsers with limited encoding support
- [ ] Implement fallback strategies for unsupported browsers
- [ ] Test on mobile devices for performance
- [ ] Verify Web Worker support

### Integration with Upload Flow

- [ ] Seamlessly integrate encoding into the recording workflow
- [ ] Update UI to show encoding progress
- [ ] Handle encoding errors in upload flow
- [ ] Ensure encoded files upload correctly to Dropbox
- [ ] Maintain proper error handling throughout process

### User Experience

- [ ] Provide clear feedback during encoding process
- [ ] Show estimated time remaining for encoding
- [ ] Display file size reduction achieved
- [ ] Handle long encoding times gracefully
- [ ] Ensure process can be cancelled if needed

### Error Handling

- [ ] Handle encoding failures with clear error messages
- [ ] Implement retry mechanisms for encoding errors
- [ ] Provide fallback options (upload uncompressed if needed)
- [ ] Log encoding errors for debugging
- [ ] Handle memory limitations during encoding

## Technical Notes

- Consider using lamejs or similar library for MP3 encoding
- Implement encoding in Web Worker for performance
- Plan for progressive enhancement (fallback to uncompressed)
- Test thoroughly on mobile devices for memory constraints
- Monitor encoding performance across different audio lengths

## Performance Targets

- Encoding should complete within reasonable time (under 30 seconds for 10-minute recording)
- Memory usage should remain manageable on mobile devices
- Compressed files should be 70-90% smaller than original
- Audio quality should remain acceptable for voice content

## Definition of Done

- MP3 encoding works reliably across target browsers
- Compressed files meet size and quality requirements
- Encoding process doesn't block user interface
- Error handling provides appropriate fallbacks
- Performance is acceptable on mobile devices
- Integration with upload flow is seamless
