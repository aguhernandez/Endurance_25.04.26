import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface ApplyBlockResult {
  success: boolean;
  insertedCount: number;
  errors: string[];
}

export interface AIBlockSession {
  day_of_week: number;
  sport: string;
  session_name: string;
  description: string;
  intensity_basis: string;
  estimated_duration_minutes: number;
  estimated_impulse: number;
  target_zone?: number;
  target_percent_ftp?: number;
  category: string;
  key_points: string[];
}

export interface AIBlockWeek {
  week_number: number;
  week_start_date: string;
  microcycle_type: 'load' | 'load_peak' | 'deload';
  target_impulse: number;
  weekly_notes: string;
  sessions: AIBlockSession[];
}

export interface AIGeneratedBlock {
  id: string;
  athlete_id: string;
  coach_id: string | null;
  block_name: string;
  block_weeks: number;
  block_start_date: string;
  block_end_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  weeks: AIBlockWeek[];
  context_summary: Record<string, unknown>;
  rationale?: string;
  athlete_feedback?: string;
  coach_notes?: string;
  requested_by_role: 'athlete' | 'coach';
  created_at: string;
  updated_at: string;
}

export interface AIFeatureSettings {
  id: string;
  ai_enabled: boolean;
  membership_tier_allowlist: string[];
  coaches_can_send: boolean;
  max_blocks_per_month: number;
}

export interface GenerateBlockOptions {
  athlete_id: string;
  coach_id?: string;
  requested_by_role: 'athlete' | 'coach';
  block_weeks?: number | 'single';
  block_start_date?: string;
  focus?: string;
  additional_context?: string;
  sessions_per_week?: number;
  sport?: string;
  sub_disciplines?: string[];
  session_duration_hours?: number;
  weekly_hours?: number;
}

export function useAIBlock(athleteId: string | null) {
  const [blocks, setBlocks] = useState<AIGeneratedBlock[]>([]);
  const [settings, setSettings] = useState<AIFeatureSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    const { data } = await supabase
      .from('ai_feature_settings')
      .select('*')
      .maybeSingle();
    setSettings(data);
  }, []);

  const loadBlocks = useCallback(async () => {
    if (!athleteId) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('ai_generated_blocks')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (err) throw err;
      setBlocks(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load blocks');
    } finally {
      setLoading(false);
    }
  }, [athleteId]);

  useEffect(() => {
    loadSettings();
    loadBlocks();
  }, [loadSettings, loadBlocks]);

  const generateBlock = useCallback(async (options: GenerateBlockOptions): Promise<AIGeneratedBlock | null> => {
    setGenerating(true);
    setError(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-ai-block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Apikey': supabaseAnonKey,
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'AI generation failed');
      }

      const result = await response.json();
      if (result.success) {
        const newBlock: AIGeneratedBlock = {
          ...result.block,
          rationale: result.rationale,
        };
        setBlocks(prev => [newBlock, ...prev]);
        return newBlock;
      }
      throw new Error('Generation failed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  const updateBlockStatus = useCallback(async (
    blockId: string,
    status: AIGeneratedBlock['status'],
    feedback?: string
  ) => {
    const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (feedback) updateData.athlete_feedback = feedback;

    const { error: err } = await supabase
      .from('ai_generated_blocks')
      .update(updateData)
      .eq('id', blockId);

    if (!err) {
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, status, ...(feedback ? { athlete_feedback: feedback } : {}) } : b));
    }
    return !err;
  }, []);

  const applyBlockToCalendar = useCallback(async (
    blockId: string,
    coachId?: string
  ): Promise<ApplyBlockResult> => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return { success: false, insertedCount: 0, errors: ['Block not found'] };

    const errors: string[] = [];

    interface SessionToInsert {
      workout: Record<string, unknown>;
      session: AIBlockSession;
    }
    const sessionsToProcess: SessionToInsert[] = [];

    for (const week of block.weeks) {
      const weekStart = new Date(week.week_start_date + 'T00:00:00');

      for (const session of week.sessions) {
        const dayOffset = session.day_of_week - 1;
        const sessionDate = new Date(weekStart);
        sessionDate.setDate(weekStart.getDate() + dayOffset);
        const dateStr = sessionDate.toISOString().split('T')[0];

        const allowedSports = ['cycling', 'running', 'swimming'];
        const sport = allowedSports.includes(session.sport) ? session.sport : 'cycling';

        sessionsToProcess.push({
          workout: {
            athlete_id: block.athlete_id,
            coach_id: coachId ?? block.coach_id ?? null,
            sport,
            name: session.session_name,
            description: session.description || null,
            intensity_basis: ['power', 'hr', 'pace', 'rpe'].includes(session.intensity_basis as string)
              ? session.intensity_basis
              : null,
            scheduled_date: dateStr,
            status: 'planned',
            estimated_duration_minutes: session.estimated_duration_minutes,
            estimated_impulse: session.estimated_impulse,
            actual_avg_intensity_percent_ftp: session.target_percent_ftp ?? null,
            difficulty_color: null,
            is_library: false,
          },
          session,
        });
      }
    }

    if (sessionsToProcess.length === 0) {
      return { success: false, insertedCount: 0, errors: ['No sessions found in block'] };
    }

    const { data: insertedWorkouts, error: insertErr } = await supabase
      .from('workouts')
      .insert(sessionsToProcess.map(s => s.workout))
      .select('id');

    if (insertErr) {
      errors.push(insertErr.message);
      return { success: false, insertedCount: 0, errors };
    }

    if (insertedWorkouts && insertedWorkouts.length > 0) {
      const allSteps: Record<string, unknown>[] = [];
      const totalDuration = (session: AIBlockSession) => session.estimated_duration_minutes || 60;

      insertedWorkouts.forEach((inserted, idx) => {
        const { session } = sessionsToProcess[idx];
        const dur = totalDuration(session);
        const keyPoints = session.key_points || [];

        const warmupMins = Math.round(dur * 0.15);
        const cooldownMins = Math.round(dur * 0.1);
        const mainMins = dur - warmupMins - cooldownMins;

        let order = 1;

        allSteps.push({
          workout_id: inserted.id,
          order: order++,
          step_type: 'warmup',
          duration_type: 'time',
          duration_value: warmupMins * 60,
          target_type: session.intensity_basis && ['power', 'hr', 'pace', 'rpe'].includes(session.intensity_basis) ? session.intensity_basis : null,
          target_percent_ftp: session.target_percent_ftp ? Math.round(session.target_percent_ftp * 0.6) : null,
          target_zone: session.target_zone ? Math.max(1, (session.target_zone || 2) - 1) : null,
        });

        if (keyPoints.length > 0) {
          const stepDuration = Math.round((mainMins / keyPoints.length) * 60);
          for (let i = 0; i < keyPoints.length; i++) {
            const isInterval = keyPoints[i].toLowerCase().includes('x') ||
              keyPoints[i].toLowerCase().includes('interval') ||
              keyPoints[i].toLowerCase().includes('repeat');
            allSteps.push({
              workout_id: inserted.id,
              order: order++,
              step_type: i % 2 === 0 ? (isInterval ? 'interval' : 'steady') : 'recovery',
              duration_type: 'time',
              duration_value: stepDuration,
              target_type: session.intensity_basis && ['power', 'hr', 'pace', 'rpe'].includes(session.intensity_basis) ? session.intensity_basis : null,
              target_percent_ftp: session.target_percent_ftp ?? null,
              target_zone: session.target_zone ?? null,
            });
          }
        } else {
          allSteps.push({
            workout_id: inserted.id,
            order: order++,
            step_type: 'steady',
            duration_type: 'time',
            duration_value: mainMins * 60,
            target_type: session.intensity_basis && ['power', 'hr', 'pace', 'rpe'].includes(session.intensity_basis) ? session.intensity_basis : null,
            target_percent_ftp: session.target_percent_ftp ?? null,
            target_zone: session.target_zone ?? null,
          });
        }

        allSteps.push({
          workout_id: inserted.id,
          order: order++,
          step_type: 'cooldown',
          duration_type: 'time',
          duration_value: cooldownMins * 60,
          target_type: session.intensity_basis && ['power', 'hr', 'pace', 'rpe'].includes(session.intensity_basis) ? session.intensity_basis : null,
          target_percent_ftp: session.target_percent_ftp ? Math.round(session.target_percent_ftp * 0.5) : null,
          target_zone: session.target_zone ? Math.max(1, (session.target_zone || 2) - 1) : null,
        });
      });

      if (allSteps.length > 0) {
        await supabase.from('workout_steps').insert(allSteps);
      }
    }

    await supabase
      .from('ai_generated_blocks')
      .update({ status: 'applied', updated_at: new Date().toISOString() })
      .eq('id', blockId);

    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, status: 'applied' } : b));

    return { success: true, insertedCount: sessionsToProcess.length, errors: [] };
  }, [blocks]);

  const updateAdminSettings = useCallback(async (
    updates: Partial<AIFeatureSettings>,
    adminId: string
  ) => {
    const { data, error: err } = await supabase
      .from('ai_feature_settings')
      .update({ ...updates, updated_by: adminId, updated_at: new Date().toISOString() })
      .eq('id', settings?.id || '')
      .select()
      .single();

    if (!err && data) {
      setSettings(data);
    }
    return !err;
  }, [settings?.id]);

  return {
    blocks,
    settings,
    loading,
    generating,
    error,
    generateBlock,
    updateBlockStatus,
    applyBlockToCalendar,
    updateAdminSettings,
    reloadBlocks: loadBlocks,
    reloadSettings: loadSettings,
  };
}
