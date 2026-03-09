// ── Risk & Assessment Types ──────────────────────────────────────────

export type RiskLevel = "low" | "moderate" | "elevated" | "critical";
export type Trend = "improving" | "stable" | "declining";
export type Condition = "depression" | "anxiety" | "both";
export type Gender = "male" | "female" | "non-binary";

export type PHQ9Severity = "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
export type GAD7Severity = "minimal" | "mild" | "moderate" | "severe";

export type AlertType =
  | "score_spike"
  | "missed_assessment"
  | "passive_anomaly"
  | "medication_gap"
  | "inactivity"
  | "risk_escalation";

export type AlertSeverity = "info" | "warning" | "critical";

// ── Core Data Models ─────────────────────────────────────────────────

export interface RiskScore {
  value: number; // 0-100
  level: RiskLevel;
  trend: Trend;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  condition: Condition;
  enrolledDate: string; // ISO date
  riskScore: RiskScore;
  latestPHQ9: number;
  latestGAD7: number;
  activeAlerts: number;
  phq9Trend: number[]; // sparkline data (last 8 scores)
  archetype: string;
}

export interface AssessmentEntry {
  date: string;
  type: "phq9" | "gad7";
  score: number;
  severity: PHQ9Severity | GAD7Severity;
}

export interface Alert {
  id: string;
  patientId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// ── Passive Data ─────────────────────────────────────────────────────

export interface PassiveDataPoint {
  date: string;
  value: number;
}

export interface PassiveMetric {
  id: string;
  label: string;
  category: PassiveCategory;
  unit: string;
  data: PassiveDataPoint[];
  normalRange: { min: number; max: number };
  currentValue: number;
  trend: Trend;
}

export type PassiveCategory =
  | "sleep"
  | "activity"
  | "screen_time"
  | "social"
  | "typing"
  | "voice"
  | "mobility";

// ── Timeline & Notes ─────────────────────────────────────────────────

export type TimelineEventType =
  | "assessment"
  | "alert"
  | "note"
  | "medication"
  | "appointment"
  | "milestone";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

export interface ClinicianNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: number; // 1-5
  sentiment: "positive" | "neutral" | "negative";
}

export interface MoodEntry {
  date: string;
  rating: number; // 1-5
  label: string;
}

export interface MedicationDay {
  date: string;
  taken: boolean;
  medication: string;
}

// ── Dashboard Summary ────────────────────────────────────────────────

export interface DashboardSummary {
  totalPatients: number;
  highRiskCount: number;
  pendingAssessments: number;
  activeAlerts: number;
}

// ── Patient Detail (aggregated) ──────────────────────────────────────

export interface PatientDetail extends Patient {
  assessments: AssessmentEntry[];
  passiveMetrics: PassiveMetric[];
  timeline: TimelineEvent[];
  clinicianNotes: ClinicianNote[];
  journalEntries: JournalEntry[];
  moodEntries: MoodEntry[];
  medicationAdherence: MedicationDay[];
  alerts: Alert[];
}
