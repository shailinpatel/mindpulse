import type { RiskLevel, PHQ9Severity, GAD7Severity } from "./types";

// ── Risk Score Thresholds ────────────────────────────────────────────

export const RISK_THRESHOLDS: Record<RiskLevel, { min: number; max: number }> = {
  low: { min: 0, max: 25 },
  moderate: { min: 26, max: 50 },
  elevated: { min: 51, max: 75 },
  critical: { min: 76, max: 100 },
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "var(--risk-low)",
  moderate: "var(--risk-moderate)",
  elevated: "var(--risk-elevated)",
  critical: "var(--risk-critical)",
};

// Tailwind class mappings for risk levels
export const RISK_BG_CLASSES: Record<RiskLevel, string> = {
  low: "bg-risk-low/15 text-risk-low",
  moderate: "bg-risk-moderate/15 text-risk-moderate",
  elevated: "bg-risk-elevated/15 text-risk-elevated",
  critical: "bg-risk-critical/15 text-risk-critical",
};

export const RISK_BORDER_CLASSES: Record<RiskLevel, string> = {
  low: "border-l-risk-low",
  moderate: "border-l-risk-moderate",
  elevated: "border-l-risk-elevated",
  critical: "border-l-risk-critical",
};

// ── PHQ-9 Severity Bands ────────────────────────────────────────────

export const PHQ9_BANDS: { severity: PHQ9Severity; min: number; max: number; label: string }[] = [
  { severity: "minimal", min: 0, max: 4, label: "Minimal" },
  { severity: "mild", min: 5, max: 9, label: "Mild" },
  { severity: "moderate", min: 10, max: 14, label: "Moderate" },
  { severity: "moderately_severe", min: 15, max: 19, label: "Mod. Severe" },
  { severity: "severe", min: 20, max: 27, label: "Severe" },
];

// ── GAD-7 Severity Bands ────────────────────────────────────────────

export const GAD7_BANDS: { severity: GAD7Severity; min: number; max: number; label: string }[] = [
  { severity: "minimal", min: 0, max: 4, label: "Minimal" },
  { severity: "mild", min: 5, max: 9, label: "Mild" },
  { severity: "moderate", min: 10, max: 14, label: "Moderate" },
  { severity: "severe", min: 15, max: 21, label: "Severe" },
];

// ── Severity Band Colors ────────────────────────────────────────────

export const SEVERITY_BAND_COLORS: Record<string, string> = {
  minimal: "rgba(74, 222, 128, 0.08)",   // green tint
  mild: "rgba(250, 204, 21, 0.08)",      // yellow tint
  moderate: "rgba(251, 146, 60, 0.08)",  // orange tint
  moderately_severe: "rgba(248, 113, 113, 0.08)", // red-light tint
  severe: "rgba(239, 68, 68, 0.08)",     // red tint
};

// ── Chart Configuration ─────────────────────────────────────────────

export const CHART_COLORS = {
  teal: "oklch(0.75 0.12 195)",
  tealMuted: "oklch(0.75 0.12 195 / 0.2)",
  phq9: "#f97316",        // warm orange
  gad7: "#3b82f6",        // blue
  grid: "oklch(0.25 0.005 260)",
  axis: "oklch(0.5 0.01 260)",
  tooltipBg: "oklch(0.17 0.005 260)",
  tooltipBorder: "oklch(0.25 0.005 260)",
};

// ── Mood Labels ─────────────────────────────────────────────────────

export const MOOD_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const MOOD_COLORS: Record<number, string> = {
  1: "var(--risk-critical)",
  2: "var(--risk-elevated)",
  3: "var(--risk-moderate)",
  4: "oklch(0.7 0.15 160)",
  5: "var(--risk-low)",
};

// ── Passive Metric Definitions ──────────────────────────────────────

export const PASSIVE_METRIC_DEFS = [
  { id: "sleep_duration", label: "Sleep Duration", category: "sleep" as const, unit: "hrs", normalRange: { min: 7, max: 9 } },
  { id: "sleep_consistency", label: "Sleep Consistency", category: "sleep" as const, unit: "%", normalRange: { min: 75, max: 100 } },
  { id: "steps", label: "Daily Steps", category: "activity" as const, unit: "steps", normalRange: { min: 5000, max: 15000 } },
  { id: "active_minutes", label: "Active Minutes", category: "activity" as const, unit: "min", normalRange: { min: 30, max: 90 } },
  { id: "sedentary_time", label: "Sedentary Time", category: "activity" as const, unit: "hrs", normalRange: { min: 4, max: 8 } },
  { id: "screen_time", label: "Screen Time", category: "screen_time" as const, unit: "hrs", normalRange: { min: 2, max: 6 } },
  { id: "nighttime_screen", label: "Nighttime Screen", category: "screen_time" as const, unit: "hrs", normalRange: { min: 0, max: 1 } },
  { id: "call_frequency", label: "Call Frequency", category: "social" as const, unit: "calls", normalRange: { min: 2, max: 8 } },
  { id: "text_frequency", label: "Text Frequency", category: "social" as const, unit: "msgs", normalRange: { min: 10, max: 50 } },
  { id: "typing_speed", label: "Typing Speed", category: "typing" as const, unit: "wpm", normalRange: { min: 35, max: 60 } },
  { id: "typing_errors", label: "Typing Errors", category: "typing" as const, unit: "%", normalRange: { min: 1, max: 5 } },
  { id: "call_duration", label: "Call Duration", category: "voice" as const, unit: "min", normalRange: { min: 5, max: 30 } },
  { id: "location_entropy", label: "Location Entropy", category: "mobility" as const, unit: "bits", normalRange: { min: 1.5, max: 3.5 } },
  { id: "home_time", label: "Home Time", category: "mobility" as const, unit: "%", normalRange: { min: 40, max: 70 } },
  { id: "movement_radius", label: "Movement Radius", category: "mobility" as const, unit: "km", normalRange: { min: 2, max: 15 } },
] as const;
