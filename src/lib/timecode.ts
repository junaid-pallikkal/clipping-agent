/**
 * Accurate timecode and timestamp utilities for video editing.
 * Frame-accurate double precision floats maintained.
 */

export function formatTimecode(seconds: number, includeHours: boolean = false): string {
  if (isNaN(seconds) || seconds < 0) return includeHours ? '00:00:00' : '00:00';
  
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (includeHours || hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
}

export function formatPreciseTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00.00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(mins)}:${secs.toFixed(2).padStart(5, '0')}`;
}

export function parsePreciseTime(str: string): number {
  const parts = str.trim().split(':');
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  if (parts.length === 3) {
    const hrs = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hrs * 3600 + mins * 60 + secs;
  }
  return parseFloat(str) || 0;
}
