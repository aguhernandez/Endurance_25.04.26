/** Synthetic-only examples for capability-gated UI checks. Never import this file from src/. */
export const sessionAnalysisWithCapabilities = {
  session: { id: 'executed-fixture', name: 'Synthetic interval workout', started_at: '2026-01-15T09:00:00Z', source: 'synthetic_fixture', laps: [{ label: 'Synthetic interval', duration_s: 300, avg_hr: 165, avg_power: 220 }], rpe: 7, athlete_comment: 'Synthetic athlete note' },
  metrics: { duration_minutes: 63, distance_km: 19.8, avg_hr: 151, max_hr: 181, calories_kcal: 590 },
  match: { status: 'matched' },
  planned_workout: { id: 'planned-fixture', name: 'Synthetic planned session', duration_minutes: 60, distance_km: 20, avg_hr: 145, max_hr: 178, calories: 550 },
  planned_zone_time: { hr: [{ zone: 2, seconds: 1800 }], power: [{ zone: 3, seconds: 900 }] },
  zones_used: {},
  biological_passport_date: '2026-01-15',
  coach_comment: '',
  capabilities: { hr: true, power: true, gps: true, altitude: true, cadence: true, laps: true },
};

export const sessionAnalysisWithoutCapabilities = {
  session: { id: 'executed-fixture', name: 'Synthetic easy session' },
  metrics: { duration_minutes: 41 },
  planned_workout: { duration_minutes: 40 },
  capabilities: { hr: false, power: false, gps: false, altitude: false, cadence: false, laps: false },
};
