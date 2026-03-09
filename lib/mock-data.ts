import type {
  Patient, PatientDetail, AssessmentEntry, Alert, PassiveMetric,
  TimelineEvent, ClinicianNote, JournalEntry, MoodEntry, MedicationDay,
  RiskLevel, Trend, Condition, Gender, AlertType, AlertSeverity,
  PassiveDataPoint, DashboardSummary,
} from "./types";
import { PASSIVE_METRIC_DEFS, MOOD_LABELS } from "./constants";
import { formatPHQ9Severity, formatGAD7Severity, getRiskLevel } from "./formatters";

// ── Seeded PRNG ─────────────────────────────────────────────────────
// Mulberry32 — fast, deterministic, good distribution

function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRandom<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randomBetween(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ── Patient Archetypes ──────────────────────────────────────────────

interface Archetype {
  id: string;
  phq9Range: [number, number];
  gad7Range: [number, number];
  phq9Trend: "down" | "flat" | "up" | "cycle";
  riskRange: [number, number];
  adherenceRate: number; // 0-1
  passiveDeviation: number; // how much passive data deviates from normal
  condition: Condition;
}

const ARCHETYPES: Archetype[] = [
  { id: "improving_depression", phq9Range: [8, 18], gad7Range: [3, 8], phq9Trend: "down", riskRange: [20, 45], adherenceRate: 0.92, passiveDeviation: 0.15, condition: "depression" },
  { id: "stable_anxiety", phq9Range: [3, 7], gad7Range: [8, 13], phq9Trend: "flat", riskRange: [30, 50], adherenceRate: 0.85, passiveDeviation: 0.2, condition: "anxiety" },
  { id: "deteriorating_both", phq9Range: [12, 22], gad7Range: [10, 18], phq9Trend: "up", riskRange: [55, 80], adherenceRate: 0.6, passiveDeviation: 0.4, condition: "both" },
  { id: "crisis_risk", phq9Range: [20, 27], gad7Range: [16, 21], phq9Trend: "up", riskRange: [80, 98], adherenceRate: 0.35, passiveDeviation: 0.6, condition: "both" },
  { id: "new_patient", phq9Range: [10, 16], gad7Range: [8, 14], phq9Trend: "flat", riskRange: [40, 60], adherenceRate: 0.75, passiveDeviation: 0.25, condition: "both" },
  { id: "recovered", phq9Range: [0, 4], gad7Range: [0, 4], phq9Trend: "down", riskRange: [5, 15], adherenceRate: 0.95, passiveDeviation: 0.1, condition: "depression" },
  { id: "non_adherent", phq9Range: [12, 20], gad7Range: [9, 16], phq9Trend: "up", riskRange: [50, 70], adherenceRate: 0.4, passiveDeviation: 0.35, condition: "depression" },
  { id: "seasonal_pattern", phq9Range: [6, 18], gad7Range: [4, 12], phq9Trend: "cycle", riskRange: [25, 60], adherenceRate: 0.8, passiveDeviation: 0.3, condition: "depression" },
  { id: "improving_anxiety", phq9Range: [2, 6], gad7Range: [10, 17], phq9Trend: "down", riskRange: [25, 45], adherenceRate: 0.88, passiveDeviation: 0.15, condition: "anxiety" },
  { id: "mild_stable", phq9Range: [5, 9], gad7Range: [5, 9], phq9Trend: "flat", riskRange: [20, 35], adherenceRate: 0.9, passiveDeviation: 0.12, condition: "both" },
  { id: "treatment_resistant", phq9Range: [14, 22], gad7Range: [12, 18], phq9Trend: "flat", riskRange: [55, 75], adherenceRate: 0.7, passiveDeviation: 0.35, condition: "both" },
  { id: "early_relapse", phq9Range: [4, 16], gad7Range: [3, 12], phq9Trend: "up", riskRange: [30, 65], adherenceRate: 0.65, passiveDeviation: 0.3, condition: "depression" },
];

// ── Name Generation ─────────────────────────────────────────────────

const FIRST_NAMES_M = ["James", "Marcus", "David", "Robert", "Michael", "Daniel", "Kevin", "Thomas", "Andrew", "Christopher", "Carlos", "Raj", "Omar", "Kenji", "Liam"];
const FIRST_NAMES_F = ["Sarah", "Emily", "Maya", "Jessica", "Rachel", "Lauren", "Priya", "Aisha", "Mei", "Sofia", "Olivia", "Amara", "Yuki", "Elena", "Grace"];
const FIRST_NAMES_NB = ["Alex", "Jordan", "Riley", "Casey", "Morgan", "Avery", "Quinn", "Sage"];
const LAST_NAMES = ["Chen", "Patel", "Johnson", "Williams", "Kim", "Rodriguez", "Thompson", "Martinez", "Anderson", "Taylor", "Lee", "Walker", "Hall", "Adams", "Wright"];

function generateName(rng: () => number, gender: Gender): string {
  const pool = gender === "male" ? FIRST_NAMES_M : gender === "female" ? FIRST_NAMES_F : FIRST_NAMES_NB;
  return `${pickRandom(rng, pool)} ${pickRandom(rng, LAST_NAMES)}`;
}

// ── Time Series Generation ──────────────────────────────────────────

const TODAY = new Date("2026-02-28T12:00:00Z");

function daysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function makeTimestamp(rng: () => number, daysBack: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - daysBack);
  d.setHours(Math.floor(randomBetween(rng, 8, 18)));
  d.setMinutes(Math.floor(randomBetween(rng, 0, 59)));
  d.setSeconds(0);
  return d.toISOString();
}

function generateAssessmentSeries(
  rng: () => number,
  archetype: Archetype,
  weeks: number = 26
): { phq9: AssessmentEntry[]; gad7: AssessmentEntry[] } {
  const phq9: AssessmentEntry[] = [];
  const gad7: AssessmentEntry[] = [];
  const [phq9Min, phq9Max] = archetype.phq9Range;
  const [gad7Min, gad7Max] = archetype.gad7Range;

  for (let w = weeks - 1; w >= 0; w--) {
    // Skip some weeks for non-adherent patients
    if (archetype.adherenceRate < 0.7 && rng() > archetype.adherenceRate + 0.2) continue;
    // New patients only have 2 weeks of data
    if (archetype.id === "new_patient" && w > 2) continue;

    const date = daysAgo(w * 7);
    const progress = (weeks - 1 - w) / (weeks - 1); // 0 → 1

    let phq9Score: number;
    let gad7Score: number;

    switch (archetype.phq9Trend) {
      case "down":
        phq9Score = phq9Max - (phq9Max - phq9Min) * progress + randomBetween(rng, -2, 2);
        gad7Score = gad7Max - (gad7Max - gad7Min) * progress + randomBetween(rng, -1, 1);
        break;
      case "up":
        phq9Score = phq9Min + (phq9Max - phq9Min) * progress + randomBetween(rng, -2, 2);
        gad7Score = gad7Min + (gad7Max - gad7Min) * progress + randomBetween(rng, -1, 1);
        break;
      case "cycle":
        phq9Score = (phq9Min + phq9Max) / 2 + Math.sin(progress * Math.PI * 2) * (phq9Max - phq9Min) / 2 + randomBetween(rng, -2, 2);
        gad7Score = (gad7Min + gad7Max) / 2 + Math.sin(progress * Math.PI * 2) * (gad7Max - gad7Min) / 2 + randomBetween(rng, -1, 1);
        break;
      default: // flat
        phq9Score = (phq9Min + phq9Max) / 2 + randomBetween(rng, -(phq9Max - phq9Min) / 3, (phq9Max - phq9Min) / 3);
        gad7Score = (gad7Min + gad7Max) / 2 + randomBetween(rng, -(gad7Max - gad7Min) / 3, (gad7Max - gad7Min) / 3);
    }

    phq9Score = Math.round(clamp(phq9Score, 0, 27));
    gad7Score = Math.round(clamp(gad7Score, 0, 21));

    phq9.push({ date, type: "phq9", score: phq9Score, severity: formatPHQ9Severity(phq9Score) });
    gad7.push({ date, type: "gad7", score: gad7Score, severity: formatGAD7Severity(gad7Score) });
  }

  return { phq9, gad7 };
}

function generatePassiveData(
  rng: () => number,
  archetype: Archetype,
  days: number = 90
): PassiveMetric[] {
  return PASSIVE_METRIC_DEFS.map((def) => {
    const { min, max } = def.normalRange;
    const midpoint = (min + max) / 2;
    const range = max - min;
    const data: PassiveDataPoint[] = [];

    for (let d = days - 1; d >= 0; d--) {
      // Base value near midpoint, deviated by archetype
      const deviation = archetype.passiveDeviation * range * (rng() - 0.3);
      let value = midpoint + deviation + randomBetween(rng, -range * 0.1, range * 0.1);

      // Crisis patients: sleep drops, screen time spikes, social drops
      if (archetype.id === "crisis_risk") {
        if (def.category === "sleep") value -= range * 0.3;
        if (def.category === "screen_time") value += range * 0.4;
        if (def.category === "social") value -= range * 0.4;
        if (def.id === "home_time") value += range * 0.3;
      }

      // Deteriorating: gradual worsening over time
      if (archetype.phq9Trend === "up") {
        const progress = (days - d) / days;
        if (def.category === "sleep") value -= range * 0.15 * progress;
        if (def.category === "activity") value -= range * 0.2 * progress;
        if (def.id === "sedentary_time") value += range * 0.2 * progress;
      }

      // Improving: gradual normalization
      if (archetype.phq9Trend === "down") {
        const progress = (days - d) / days;
        value = value + (midpoint - value) * progress * 0.3;
      }

      value = clamp(value, 0, def.unit === "%" ? 100 : max * 2);
      data.push({ date: daysAgo(d), value: Math.round(value * 10) / 10 });
    }

    const currentValue = data[data.length - 1].value;
    const oldValue = data[Math.max(0, data.length - 14)].value;
    const trend: Trend = currentValue < oldValue * 0.95 ? "declining" : currentValue > oldValue * 1.05 ? "improving" : "stable";

    return {
      id: def.id,
      label: def.label,
      category: def.category,
      unit: def.unit,
      data,
      normalRange: { min, max },
      currentValue,
      trend,
    };
  });
}

function generateMoodEntries(rng: () => number, archetype: Archetype, days: number = 90): MoodEntry[] {
  const entries: MoodEntry[] = [];
  const baseMood = archetype.riskRange[0] < 30 ? 4 : archetype.riskRange[0] < 50 ? 3 : 2;

  for (let d = days - 1; d >= 0; d--) {
    // ~70% of days have a mood entry
    if (rng() > 0.7) continue;
    const rating = Math.round(clamp(baseMood + randomBetween(rng, -1.5, 1.5), 1, 5));
    entries.push({
      date: daysAgo(d),
      rating,
      label: MOOD_LABELS[rating],
    });
  }
  return entries;
}

function generateMedicationAdherence(rng: () => number, archetype: Archetype, days: number = 90): MedicationDay[] {
  const meds = ["Sertraline 50mg", "Escitalopram 10mg", "Venlafaxine 75mg", "Fluoxetine 20mg"];
  const medication = pickRandom(rng, meds);
  const entries: MedicationDay[] = [];

  for (let d = days - 1; d >= 0; d--) {
    entries.push({
      date: daysAgo(d),
      taken: rng() < archetype.adherenceRate,
      medication,
    });
  }
  return entries;
}

function generateJournalEntries(rng: () => number, archetype: Archetype): JournalEntry[] {
  const entries: JournalEntry[] = [];
  const templates = {
    positive: [
      "Had a good session with my therapist today. Feeling more hopeful about managing things.",
      "Went for a walk in the park. The fresh air really helped clear my mind.",
      "Connected with a friend I hadn't spoken to in a while. It felt really nice.",
      "Managed to complete my work tasks without feeling overwhelmed. Small win.",
      "Tried the breathing exercises Dr. recommended. Actually felt calmer afterward.",
      "Slept well for the first time in a while. Woke up feeling refreshed.",
    ],
    neutral: [
      "Another routine day. Not particularly good or bad. Just getting through.",
      "Did my usual activities. Energy levels are about average.",
      "Had a quiet day at home. Trying to maintain my routine.",
      "Work was manageable today. Didn't feel as stressed as last week.",
      "Took my medication on time. Trying to be more consistent.",
    ],
    negative: [
      "Struggled to get out of bed this morning. Everything feels heavy.",
      "Couldn't concentrate at work. My mind keeps racing with worries.",
      "Didn't sleep well again. The anxiety gets worse at night.",
      "Cancelled plans with friends. Just couldn't face being social.",
      "Feeling disconnected from everything. Going through the motions.",
      "Had a tough conversation that brought up a lot of difficult emotions.",
    ],
  };

  const numEntries = archetype.id === "new_patient" ? 3 : Math.floor(randomBetween(rng, 6, 14));

  for (let i = 0; i < numEntries; i++) {
    const daysBack = Math.floor(randomBetween(rng, 0, 60));
    const mood = Math.round(clamp(
      archetype.riskRange[0] < 30 ? 4 : archetype.riskRange[0] < 60 ? 3 : 2,
      1, 5
    ) + randomBetween(rng, -1, 1));
    const sentiment = mood >= 4 ? "positive" : mood <= 2 ? "negative" : "neutral";
    const pool = templates[sentiment as keyof typeof templates];

    entries.push({
      id: `journal-${i}`,
      date: daysAgo(daysBack),
      content: pickRandom(rng, pool),
      mood: clamp(mood, 1, 5),
      sentiment,
    });
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateClinicianNotes(rng: () => number, archetype: Archetype): ClinicianNote[] {
  const authors = ["Dr. Sarah Mitchell", "Dr. James Park", "Lisa Thompson, LCSW"];
  const noteTemplates = [
    { content: "Patient reports improved sleep quality. Continue current medication regimen. Next assessment in 2 weeks.", tags: ["medication", "sleep"] },
    { content: "Discussed coping strategies for workplace stress. Patient engaged well in session. Assigned homework: daily mindfulness practice.", tags: ["therapy", "coping"] },
    { content: "PHQ-9 score increased by 3 points from last assessment. Scheduling follow-up sooner. Consider medication adjustment.", tags: ["assessment", "medication"] },
    { content: "Patient missed last two appointments. Attempted phone outreach — left voicemail. Will try again this week.", tags: ["adherence", "outreach"] },
    { content: "Reviewed passive data trends showing decreased activity and increased screen time. Discussed behavioral activation strategies.", tags: ["passive-data", "behavioral"] },
    { content: "Family session went well. Support system appears strong. Patient reports feeling more connected.", tags: ["family", "support"] },
    { content: "Medication side effects reported: mild nausea and drowsiness. Will monitor for 2 more weeks before considering alternatives.", tags: ["medication", "side-effects"] },
    { content: "Patient making good progress with exposure exercises for anxiety. Gradually increasing difficulty of situations.", tags: ["therapy", "anxiety"] },
  ];

  const numNotes = archetype.id === "new_patient" ? 2 : Math.floor(randomBetween(rng, 4, 8));
  const notes: ClinicianNote[] = [];

  for (let i = 0; i < numNotes; i++) {
    const template = pickRandom(rng, noteTemplates);
    notes.push({
      id: `note-${i}`,
      author: pickRandom(rng, authors),
      content: template.content,
      timestamp: makeTimestamp(rng, Math.floor(randomBetween(rng, 1, 90))),
      tags: template.tags,
    });
  }

  return notes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateTimeline(
  rng: () => number,
  assessments: AssessmentEntry[],
  notes: ClinicianNote[],
  alerts: Alert[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Add assessment events
  assessments.slice(-6).forEach((a, i) => {
    events.push({
      id: `tl-assessment-${i}`,
      type: "assessment",
      title: `${a.type === "phq9" ? "PHQ-9" : "GAD-7"} Assessment`,
      description: `Score: ${a.score} (${a.severity})`,
      timestamp: a.date + "T10:00:00.000Z",
      metadata: { score: a.score, type: a.type },
    });
  });

  // Add note events
  notes.slice(0, 4).forEach((n, i) => {
    events.push({
      id: `tl-note-${i}`,
      type: "note",
      title: "Clinician Note",
      description: n.content.slice(0, 100) + (n.content.length > 100 ? "..." : ""),
      timestamp: n.timestamp,
      metadata: { author: n.author },
    });
  });

  // Add alert events
  alerts.slice(0, 3).forEach((a, i) => {
    events.push({
      id: `tl-alert-${i}`,
      type: "alert",
      title: a.message,
      description: `Alert severity: ${a.severity}`,
      timestamp: a.timestamp,
    });
  });

  // Add appointment events
  const numAppointments = Math.floor(randomBetween(rng, 2, 5));
  for (let i = 0; i < numAppointments; i++) {
    events.push({
      id: `tl-apt-${i}`,
      type: "appointment",
      title: "Therapy Session",
      description: pickRandom(rng, ["In-person session", "Telehealth session", "Group therapy session"]),
      timestamp: makeTimestamp(rng, Math.floor(randomBetween(rng, 3, 60))),
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateAlerts(rng: () => number, archetype: Archetype, patientId: string): Alert[] {
  const alerts: Alert[] = [];
  const alertPool: { type: AlertType; severity: AlertSeverity; message: string }[] = [];

  // Different archetypes generate different alerts
  if (archetype.riskRange[1] > 70) {
    alertPool.push(
      { type: "risk_escalation", severity: "critical", message: "Risk score exceeded critical threshold" },
      { type: "score_spike", severity: "critical", message: "PHQ-9 score increased by 5+ points" },
    );
  }
  if (archetype.adherenceRate < 0.6) {
    alertPool.push(
      { type: "missed_assessment", severity: "warning", message: "Missed scheduled assessment (2 weeks overdue)" },
      { type: "medication_gap", severity: "warning", message: "Medication not logged for 3+ consecutive days" },
    );
  }
  if (archetype.passiveDeviation > 0.3) {
    alertPool.push(
      { type: "passive_anomaly", severity: "warning", message: "Sleep duration dropped below 5 hours (3-day average)" },
      { type: "inactivity", severity: "info", message: "Step count below 2,000 for past 5 days" },
    );
  }
  // Always have at least one potential alert
  alertPool.push(
    { type: "passive_anomaly", severity: "info", message: "Screen time increased 40% from baseline" },
  );

  const numAlerts = archetype.id === "recovered" ? 0 : Math.floor(randomBetween(rng, 0, Math.min(alertPool.length, 4)));

  for (let i = 0; i < numAlerts; i++) {
    const template = alertPool[i % alertPool.length];
    alerts.push({
      id: `alert-${patientId}-${i}`,
      patientId,
      type: template.type,
      severity: template.severity,
      message: template.message,
      timestamp: makeTimestamp(rng, Math.floor(randomBetween(rng, 0, 14))),
      acknowledged: rng() < 0.3,
    });
  }

  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ── Patient Generation ──────────────────────────────────────────────

function generatePatient(seed: number, index: number): PatientDetail {
  const rng = createRng(seed + index * 7919);
  const archetype = ARCHETYPES[index % ARCHETYPES.length];
  const gender: Gender = pickRandom(rng, ["male", "female", "non-binary"]);
  const id = `p-${(index + 1).toString().padStart(3, "0")}`;

  const { phq9, gad7 } = generateAssessmentSeries(rng, archetype);
  const assessments = [...phq9, ...gad7].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestPHQ9 = phq9.length > 0 ? phq9[phq9.length - 1].score : 0;
  const latestGAD7 = gad7.length > 0 ? gad7[gad7.length - 1].score : 0;

  const riskValue = Math.round(clamp(
    randomBetween(rng, archetype.riskRange[0], archetype.riskRange[1]),
    0, 100
  ));

  const trend: Trend = archetype.phq9Trend === "down" ? "improving"
    : archetype.phq9Trend === "up" ? "declining"
    : "stable";

  const alerts = generateAlerts(rng, archetype, id);
  const clinicianNotes = generateClinicianNotes(rng, archetype);
  const passiveMetrics = generatePassiveData(rng, archetype);
  const moodEntries = generateMoodEntries(rng, archetype);
  const medicationAdherence = generateMedicationAdherence(rng, archetype);
  const journalEntries = generateJournalEntries(rng, archetype);
  const timeline = generateTimeline(rng, assessments, clinicianNotes, alerts);

  // Sparkline: last 8 PHQ-9 scores
  const phq9Trend = phq9.slice(-8).map((a) => a.score);

  const enrolledDaysAgo = archetype.id === "new_patient"
    ? Math.floor(randomBetween(rng, 10, 16))
    : Math.floor(randomBetween(rng, 90, 220));

  return {
    id,
    name: generateName(rng, gender),
    age: Math.floor(randomBetween(rng, 22, 68)),
    gender,
    condition: archetype.condition,
    enrolledDate: daysAgo(enrolledDaysAgo),
    riskScore: {
      value: riskValue,
      level: getRiskLevel(riskValue),
      trend,
    },
    latestPHQ9,
    latestGAD7,
    activeAlerts: alerts.filter((a) => !a.acknowledged).length,
    phq9Trend,
    archetype: archetype.id,
    assessments,
    passiveMetrics,
    timeline,
    clinicianNotes,
    journalEntries,
    moodEntries,
    medicationAdherence,
    alerts,
  };
}

// ── Data Export ──────────────────────────────────────────────────────

const SEED = 42;
const PATIENT_COUNT = 14;

// Generate all patients once and cache
let _patients: PatientDetail[] | null = null;

export function getAllPatients(): PatientDetail[] {
  if (!_patients) {
    _patients = Array.from({ length: PATIENT_COUNT }, (_, i) => generatePatient(SEED, i));
  }
  return _patients;
}

export function getPatientById(id: string): PatientDetail | undefined {
  return getAllPatients().find((p) => p.id === id);
}

export function getPatientSummaries(): Patient[] {
  return getAllPatients().map(({ assessments, passiveMetrics, timeline, clinicianNotes, journalEntries, moodEntries, medicationAdherence, alerts, ...summary }) => summary);
}

export function getDashboardSummary(): DashboardSummary {
  const patients = getAllPatients();
  return {
    totalPatients: patients.length,
    highRiskCount: patients.filter((p) => p.riskScore.level === "elevated" || p.riskScore.level === "critical").length,
    pendingAssessments: patients.filter((p) => {
      const lastAssessment = p.assessments[p.assessments.length - 1];
      if (!lastAssessment) return true;
      const daysSince = (TODAY.getTime() - new Date(lastAssessment.date).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 7;
    }).length,
    activeAlerts: patients.reduce((sum, p) => sum + p.activeAlerts, 0),
  };
}
