// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ScheduleWorkoutModal from '../src/components/ScheduleWorkoutModal';

vi.mock('../src/lib/supabase', () => ({ supabase: { from: () => ({ select: () => ({ order: async () => ({ data: [] }) }) }) } }));
afterEach(cleanup);

describe('schedule modal', () => {
  it('opens and reloads after closing without calling missing setters', async () => {
    const props = { selectedDate: new Date('2026-11-09T12:00:00'), isCoach: false, currentUserId: 'athlete', onClose: vi.fn(), onScheduled: vi.fn() };
    const view = render(<ScheduleWorkoutModal {...props} isOpen={false} />);
    view.rerender(<ScheduleWorkoutModal {...props} isOpen />);
    expect(await screen.findByText('Load from Library')).toBeTruthy();
    view.rerender(<ScheduleWorkoutModal {...props} isOpen={false} />);
    view.rerender(<ScheduleWorkoutModal {...props} isOpen />);
    expect(await screen.findByText('Load from Library')).toBeTruthy();
  });
});
