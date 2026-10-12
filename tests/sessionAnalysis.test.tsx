// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import SessionAnalysis from '../src/components/SessionAnalysis';
import { sessionAnalysisWithCapabilities, sessionAnalysisWithoutCapabilities } from './fixtures/sessionAnalysisCapabilities';

const api = vi.hoisted(() => ({ hubSessionAction: vi.fn() }));
vi.mock('../src/lib/hubApi', () => api);

const seriesFixture = {
  heart_rate: [120, 145, 165, 150],
  power: [100, 180, 250, 160],
  gps: [{ lat: 1, lng: 1, altitude_m: 100 }, { lat: 1.1, lng: 1.1, altitude_m: 110 }],
  altitude: [100, 105, 110],
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
  return render(<LanguageProvider><SessionAnalysis athleteId="athlete-fixture" plannedId="planned-fixture" executedId="executed-fixture" onBack={() => undefined}/></LanguageProvider>);
}

beforeEach(() => api.hubSessionAction.mockReset());
afterEach(() => cleanup());

describe('session analysis capability blocks', () => {
  it.each([
    ['heart_rate_zones', 'Time in zones · HR', 'Z2'],
    ['power_zones', 'Time in zones · Power', 'Z3'],
    ['timeseries', 'Time series', '● HR'],
    ['derived_indicators', 'Indicators', '4.2'],
    ['laps', 'Laps and intervals', 'Synthetic interval'],
    ['gps', 'Map and elevation profile', 'Route available · no map library is installed in this project'],
  ])('renders %s when capability is enabled', async (capability, heading, content) => {
    renderAnalysis({ [capability]: true });
    expect(await screen.findByText(heading)).toBeTruthy();
    await waitFor(() => expect(screen.getByText(content)).toBeTruthy());
  });

  it.each([
    ['heart_rate_zones', 'Time in zones · HR'],
    ['power_zones', 'Time in zones · Power'],
    ['timeseries', 'Time series'],
    ['derived_indicators', 'Indicators'],
    ['laps', 'Laps and intervals'],
    ['gps', 'Map and elevation profile', { gps: false, altitude: false }],
  ])('omits %s block when capability is disabled', async (capability, heading, extra = {}) => {
    renderAnalysis({ [capability]: false, ...extra });
    await screen.findByText('Session analysis');
    expect(screen.queryByText(heading)).toBeNull();
  });

  it('shows the elevation profile when altitude is available without GPS', async () => {
    renderAnalysis({ gps: false, altitude: true });
    expect(await screen.findByText('Map and elevation profile')).toBeTruthy();
    expect(screen.queryByText('Route available · no map library is installed in this project')).toBeNull();
  });

  it('renders only available header data when every optional capability is absent', async () => {
    api.hubSessionAction.mockImplementation(async (action: string) => action === 'get-session-analysis' ? sessionAnalysisWithoutCapabilities : {});
    render(<LanguageProvider><SessionAnalysis athleteId="athlete-fixture" plannedId="planned-fixture" executedId="none" onBack={() => undefined}/></LanguageProvider>);
    expect(await screen.findByText('Session analysis')).toBeTruthy();
    expect(screen.queryByText('Time in zones · HR')).toBeNull();
    expect(screen.queryByText('Time in zones · Power')).toBeNull();
    expect(screen.queryByText('Time series')).toBeNull();
    expect(screen.queryByText('Indicators')).toBeNull();
    expect(screen.queryByText('Laps and intervals')).toBeNull();
    expect(screen.queryByText('Map and elevation profile')).toBeNull();
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
      athlete_id: 'athlete-fixture',
      planned_session_id: 'planned-fixture',
      executed_session_id: 'executed-fixture',
      comment: 'Synthetic coach note',
      athlete_visible: true,
      status: 'reviewed',
    })));
  });
});
