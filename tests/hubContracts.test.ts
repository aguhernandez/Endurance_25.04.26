import { describe, expect, it } from 'vitest';
import { hubActivityToWorkoutData, type HubExternalActivity } from '../src/lib/hubApi';
import { vi } from 'vitest';
vi.mock('../src/lib/supabase', () => ({ supabase: {} }));

const activity: HubExternalActivity = {
  id: 'activity', user_id: 'athlete', name: 'Ride', source: 'hub', sport_type: 'cycling',
  distance_meters: null, duration_seconds: null, calories: null, start_time: '2026-01-01',
  local_date: '2026-01-01', created_at: '', updated_at: '',
};

describe('Hub activity adapter', () => {
  it('represents missing optional series and measurements as absent', () => {
    const result = hubActivityToWorkoutData(activity);
    expect(result.distance).toBeUndefined();
    expect(result.duration).toBeUndefined();
    expect(result.gps_track).toBeUndefined();
    expect(result.splits).toBeUndefined();
  });
  it('preserves GPS coordinates, altitude aliases and measurements', () => {
    const result = hubActivityToWorkoutData({ ...activity, gps_track: [{ lat: 1, lng: 2, altitude: 321, heart_rate: 145 }] });
    expect(result.gps_track?.[0]).toMatchObject({ lat: 1, lng: 2, altitude_m: 321, heart_rate: 145 });
    expect(result.heart_rate).toEqual([145]);
  });
});
