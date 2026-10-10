export function altitudeAt(progress: number, summit: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.round(p * summit);
}

export function formatAltitude(metres: number): string {
  return `${metres.toLocaleString("en-US")} m`;
}
