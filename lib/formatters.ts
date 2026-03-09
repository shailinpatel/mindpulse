import type { RiskLevel, PHQ9Severity, GAD7Severity, Trend } from "./types";

// ── Date Formatting ─────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date("2026-02-28"); // fixed "today" for mock data consistency
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return formatDate(date);
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Score Formatting ────────────────────────────────────────────────

export function formatScore(score: number, maxScore: number): string {
  return `${score}/${maxScore}`;
}

export function formatPHQ9(score: number): string {
  return formatScore(score, 27);
}

export function formatGAD7(score: number): string {
  return formatScore(score, 21);
}

export function formatRiskScore(value: number): string {
  return `${Math.round(value)}`;
}

// ── Severity Formatting ─────────────────────────────────────────────

export function formatPHQ9Severity(score: number): PHQ9Severity {
  if (score <= 4) return "minimal";
  if (score <= 9) return "mild";
  if (score <= 14) return "moderate";
  if (score <= 19) return "moderately_severe";
  return "severe";
}

export function formatGAD7Severity(score: number): GAD7Severity {
  if (score <= 4) return "minimal";
  if (score <= 9) return "mild";
  if (score <= 14) return "moderate";
  return "severe";
}

export function formatSeverityLabel(severity: PHQ9Severity | GAD7Severity): string {
  const labels: Record<string, string> = {
    minimal: "Minimal",
    mild: "Mild",
    moderate: "Moderate",
    moderately_severe: "Mod. Severe",
    severe: "Severe",
  };
  return labels[severity] || severity;
}

// ── Risk Level Formatting ───────────────────────────────────────────

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return "low";
  if (score <= 50) return "moderate";
  if (score <= 75) return "elevated";
  return "critical";
}

export function formatRiskLevel(level: RiskLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

// ── Trend Formatting ────────────────────────────────────────────────

export function formatTrend(trend: Trend): string {
  const labels: Record<Trend, string> = {
    improving: "Improving",
    stable: "Stable",
    declining: "Declining",
  };
  return labels[trend];
}

// ── Number Formatting ───────────────────────────────────────────────

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`;
}

export function formatUnit(value: number, unit: string): string {
  if (unit === "%") return formatPercent(value);
  if (unit === "steps") return formatNumber(Math.round(value));
  return `${value.toFixed(1)} ${unit}`;
}
