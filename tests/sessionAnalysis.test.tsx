// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import SessionAnalysis from '../src/components/SessionAnalysis';
import { sessionAnalysisWithCapabilities, sessionAnalysisWithoutCapabilities } from './fixtures/sessionAnalysisCapabilities';

const api = vi.hoisted(() => ({ hubSessionAction: vi.fn() }));
vi.mock('../src/lib/hubApi', () => api);

const seriesFixture = {
  executed_session_id: 'executed-fixture',
  capabilities: { hr: true, power: true, gps: true, altitude: true },
  series: { heart_rate: [120, 145, 165, 150], power: [100, 180, 250, 160], altitude: [100, 105, 110] },
  route: [{ lat: 1, lng: 1, altitude_m: 100 }, { lat: 1.1, lng: 1.1, altitude_m: 110 }],
  hr_zone_seconds: [{ zone: 2, seconds: 1200 }],
  power_zone_seconds: [{ zone: 3, seconds: 600 }],
  derived: { hr_drift: 4.2, efficiency: 1.8 },
};

function renderAnalysis(overrides: Record<string, unknown> = {}) {
  const fixture = {
    ...sessionAnalysisWithCapabilities,
    capabilities: { ...sessionAnalysisWithCapabilities.capabilities, ...overrides },
  };
  api.hubSessionAction.mockImplementation(async (action: string) => {
    if (action === 'get-session-analysis') return fixture;
    if (action === 'get-session-timeseries') return seriesFixture;
    return {};
  });
  return render(<LanguageProvider><SessionAnalysis athleteId="athlete-fixture" executedId="executed-fixture" canReview onBack={() => undefined}/></LanguageProvider>);
}

beforeEach(() => api.hubSessionAction.mockReset());
afterEach(() => cleanup());

describe('session analysis capability blocks', () => {
  it.each([
    ['hr', 'Time in zones · HR', 'Z2'],
    ['power', 'Time in zones · Power', 'Z3'],
    ['hr', 'Time series', '● HR'],
    ['hr', 'Derived indicators', '4.2'],
    ['laps', 'Laps and intervals', 'Synthetic interval'],
    ['gps', 'Route and elevation', 'Ruta'],
  ])('renders %s when capability is enabled', async (capability, heading, content) => {
    renderAnalysis({ [capability]: true });
    expect(await screen.findByText(heading)).toBeTruthy();
    await waitFor(() => expect(screen.getByText(content)).toBeTruthy());
  });

  it.each([
    ['hr', 'Time in zones · HR'],
    ['power', 'Time in zones · Power'],
    ['hr', 'Time series', { power: false }],
    ['hr', 'Derived indicators', { power: false }],
    ['laps', 'Laps and intervals'],
    ['gps', 'Route and elevation', { gps: false, altitude: false }],
  ])('omits %s block when capability is disabled', async (capability, heading, extra = {}) => {
    renderAnalysis({ [capability]: false, ...extra });
    await screen.findByText('Session analysis');
    expect(screen.queryByText(heading)).toBeNull();
  });

  it('shows the elevation profile when altitude is available without GPS', async () => {
    renderAnalysis({ gps: false, altitude: true });
    expect(await screen.findByText('Route and elevation')).toBeTruthy();
    expect(screen.getByLabelText('Elevation profile')).toBeTruthy();
  });

  it('renders only available header data when every optional capability is absent', async () => {
    api.hubSessionAction.mockImplementation(async (action: string) => action === 'get-session-analysis' ? sessionAnalysisWithoutCapabilities : {});
    render(<LanguageProvider><SessionAnalysis athleteId="athlete-fixture" executedId="executed-fixture" onBack={() => undefined}/></LanguageProvider>);
    expect(await screen.findByText('Session analysis')).toBeTruthy();
    expect(screen.queryByText('Time in zones · HR')).toBeNull();
    expect(screen.queryByText('Time in zones · Power')).toBeNull();
    expect(screen.queryByText('Time series')).toBeNull();
    expect(screen.queryByText('Indicators')).toBeNull();
    expect(screen.queryByText('Laps and intervals')).toBeNull();
    expect(screen.queryByText('Route and elevation')).toBeNull();
    expect(api.hubSessionAction).toHaveBeenCalledTimes(1);
    expect(api.hubSessionAction).toHaveBeenCalledWith('get-session-analysis', expect.any(Object));
  });

  it('saves a review through the Hub action with athlete visibility preference', async () => {
    renderAnalysis({ timeseries: false, laps: false, gps: false, altitude: false });
    await screen.findByText('Session analysis');
    fireEvent.change(screen.getByPlaceholderText('Coach comment'), { target: { value: 'Synthetic coach note' } });
    fireEvent.click(screen.getByLabelText('Visible to athlete'));
    fireEvent.click(screen.getByText('Mark as reviewed'));
    await waitFor(() => expect(api.hubSessionAction).toHaveBeenCalledWith('save-review', expect.objectContaining({
      executed_session_id: 'executed-fixture',
      planned_workout_id: 'planned-fixture',
      comment: 'Synthetic coach note',
      visible_to_athlete: true,
      status: 'reviewed',
    })));
  });
});
