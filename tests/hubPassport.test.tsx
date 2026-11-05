// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { useHubPassport } from '../src/hooks/useHubPassport';
const mocks = vi.hoisted(() => ({ passport: vi.fn(), profile: vi.fn(), upsert: vi.fn() }));
vi.mock('../src/lib/hubApi', () => ({ hubGetBiologicalPassport: mocks.passport, hubGetAthleteProfile: mocks.profile }));
vi.mock('../src/lib/supabase', () => ({ supabase: { from: () => ({ upsert: mocks.upsert }) } }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe('Hub Passport', () => {
  it('reads the active passport and persists its verified FTP and physiology', async () => {
    mocks.profile.mockResolvedValue({ athlete: { id: 'a', full_name: 'Athlete' } });
    mocks.passport.mockResolvedValue({ active_passport: { measurement_date: '2026-01-01', source: 'hub', ftp_watts: 250, vo2max: 55, lt2_hr: 170, training_zones: null }, passport_history: [] });
    mocks.upsert.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useHubPassport());
    await act(async () => { await result.current.fetchPassport('a', 'a'); });
    expect(result.current.snapshot?.passport.active_passport?.ftp_watts).toBe(250);
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ athlete_id: 'a', vo2max: 55 }), expect.anything());
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ athlete_id: 'a', current_ftp_watts: 250 }), expect.anything());
  });
  it('rejects a missing active passport without writing physiology', async () => {
    mocks.profile.mockResolvedValue({ athlete: { id: 'a', full_name: 'Athlete' } });
    mocks.passport.mockResolvedValue({ active_passport: null, passport_history: [] });
    const { result } = renderHook(() => useHubPassport());
    await act(async () => { expect(await result.current.fetchPassport('a', 'a')).toBeNull(); });
    expect(result.current.snapshot).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
});
