export function altitudeAt(progress: number, summit: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.round(p * summit);
}

export function stageAltitude(index: number, count: number, summit: number): number {
  if (count <= 0) return summit;
  return Math.round(((index / count) * summit) / 10) * 10;
}

export function formatAltitude(metres: number): string {
  return `${metres.toLocaleString("en-US")} m`;
}
