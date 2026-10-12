/** Synthetic-only examples for capability-gated UI checks. Never import this file from src/. */
export const sessionAnalysisWithCapabilities = {
  session_name: 'Synthetic interval workout',
  planned: { duration_minutes: 60, distance_km: 20, avg_hr: 145, max_hr: 178, calories: 550 },
  executed: { duration_minutes: 63, distance_km: 19.8, avg_hr: 151, max_hr: 181, calories: 590, source: 'synthetic_fixture' },
  passport_date: '2026-01-15',
  capabilities: { heart_rate_zones: true, power_zones: true, timeseries: true, derived_indicators: true, laps: true, gps: true, altitude: true },
  zone_comparison: [
    { type: 'hr', zone: 2, name: 'Aerobic', planned_percent: 70, actual_percent: 62 },
    { type: 'power', zone: 3, name: 'Tempo', planned_percent: 35, actual_percent: 40 },
  ],
  indicators: { hr_drift: 4.2, efficiency: 1.8, planned_if: 0.82, actual_if: 0.86, planned_tss: 65, actual_tss: 74 },
  laps: [{ label: 'Synthetic interval', duration_s: 300, avg_hr: 165, avg_power: 220 }],
  planned_steps: [{ start_percent: 20, end_percent: 40 }],
  subjective: { rpe: 7, comment: 'Synthetic athlete note' },
};

export const sessionAnalysisWithoutCapabilities = {
  session_name: 'Synthetic easy session',
  planned: { duration_minutes: 40 },
  executed: { duration_minutes: 41 },
  capabilities: { heart_rate_zones: false, power_zones: false, timeseries: false, derived_indicators: false, laps: false, gps: false, altitude: false },
};
