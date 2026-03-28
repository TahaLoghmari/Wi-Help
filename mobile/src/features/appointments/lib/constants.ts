// ─── Timeline dot colors ─────────────────────────────────────────────────────

export const timelineDotColors: Record<string, string> = {
  offeredAt: "#3fa6ff",
  confirmedAt: "#14d3ac",
  completedAt: "#00e984",
  cancelledAt: "rgba(0,84,110,0.4)",
};

// ─── Timeline row type ───────────────────────────────────────────────────────

export interface TimelineRow {
  key: string;
  label: string;
  value: string;
  dotColor: string;
}
