import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { hubAIBlockAction, hubGetAvailability, hubGetBiologicalPassport, hubGetSharedEvents } from '../lib/hubApi';
import { SmartPlannerHubContext } from '../lib/smartPlanner';

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
  planner_context?: SmartPlannerHubContext;
}

export type EditableAIBlock = Pick<AIGeneratedBlock, 'weeks'>;

export function useAIBlock(athleteId: string | null) {
  const [blocks, setBlocks] = useState<AIGeneratedBlock[]>([]);
  const [settings, setSettings] = useState<AIFeatureSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlannerContext = useCallback(async (): Promise<SmartPlannerHubContext> => {
    if (!athleteId) throw new Error('Athlete is required');
    const { data: profile, error: profileError } = await supabase.from('profiles').select('hub_user_id').eq('id', athleteId).maybeSingle();
    if (profileError || !profile?.hub_user_id) throw new Error('Athlete is not linked to Hub');
    const [events, availability, passport] = await Promise.all([
      hubGetSharedEvents(profile.hub_user_id),
      hubGetAvailability(profile.hub_user_id),
      hubGetBiologicalPassport(profile.hub_user_id).catch(() => null),
    ]);
    return {
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        event_date: event.event_date ?? undefined,
        priority: event.priority ?? undefined,
      })),
      availability: availability.map(window => ({
        id: window.id,
        date: window.available_date ?? undefined,
        day_of_week: window.day_of_week ?? undefined,
        available_minutes: window.max_duration_minutes ?? undefined,
        notes: window.notes ?? undefined,
      })),
      biological_passport_available: Boolean(passport?.active_passport),
      biological_passport_summary: passport?.active_passport
        ? {
            measurement_date: passport.active_passport.measurement_date,
            source: passport.active_passport.source,
            sport_context: passport.active_passport.sport_context,
            ftp_watts: passport.active_passport.ftp_watts,
            running_threshold_pace: passport.active_passport.running_threshold_pace,
          }
        : undefined,
      fetched_at: new Date().toISOString(),
    };
  }, [athleteId]);

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
      const result = await hubAIBlockAction<{ blocks: AIGeneratedBlock[] }>('ai-block-list', { athlete_id: athleteId });
      setBlocks(result.blocks || []);
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
      const plannerContext = options.planner_context ?? await loadPlannerContext();
      const result = await hubAIBlockAction<{ success: boolean; block: AIGeneratedBlock; rationale?: string }>('ai-block-generate', { ...options, planner_context: plannerContext });
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
  }, [loadPlannerContext]);

  const updateBlockStatus = useCallback(async (
    blockId: string,
    status: AIGeneratedBlock['status'],
    feedback?: string
  ) => {
    try {
      const result = await hubAIBlockAction<{ block: AIGeneratedBlock }>('ai-block-review', { athlete_id: athleteId, block_id: blockId, status, feedback });
      setBlocks(prev => prev.map(b => b.id === blockId ? result.block : b));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Block review failed');
      return false;
    }
  }, [athleteId]);

  const editBlock = useCallback(async (blockId: string, editedBlock: EditableAIBlock): Promise<boolean> => {
    try {
      const result = await hubAIBlockAction<{ block: AIGeneratedBlock }>('ai-block-edit', {
        athlete_id: athleteId,
        block_id: blockId,
        weeks: editedBlock.weeks,
      });
      setBlocks(previous => previous.map(block => block.id === blockId ? result.block : block));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Block edit failed');
      return false;
    }
  }, [athleteId]);

  const applyBlockToCalendar = useCallback(async (
    blockId: string,
    coachId?: string
  ): Promise<ApplyBlockResult> => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return { success: false, insertedCount: 0, errors: ['Block not found'] };
    if (block.status !== 'accepted') {
      return { success: false, insertedCount: 0, errors: ['The block must be accepted before it can be published to the calendar'] };
    }

    try {
      const result = await hubAIBlockAction<{ success: boolean; insertedCount: number; errors?: string[] }>('ai-block-publish', {
        athlete_id: block.athlete_id,
        block_id: blockId,
        coach_id: coachId,
      });
      if (result.success) setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, status: 'applied' } : b));
      return { success: Boolean(result.success), insertedCount: result.insertedCount || 0, errors: result.errors || [] };
    } catch (cause) {
      return { success: false, insertedCount: 0, errors: [cause instanceof Error ? cause.message : 'Publication failed'] };
    }

  }, [blocks]);

  const updateAdminSettings = useCallback(async (
    updates: Partial<AIFeatureSettings>,
    adminId: string
  ) => {
    if (!settings?.id || !adminId) return false;
    try {
      const result = await hubAIBlockAction<{ settings: AIFeatureSettings }>('ai-settings-update', { settings_id: settings.id, updates });
      if (!result.settings) return false;
      setSettings(result.settings);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Settings update failed');
      return false;
    }
  }, [settings?.id]);

  return {
    blocks,
    settings,
    loading,
    generating,
    error,
    generateBlock,
    updateBlockStatus,
    editBlock,
    applyBlockToCalendar,
    updateAdminSettings,
    reloadBlocks: loadBlocks,
    reloadSettings: loadSettings,
    loadPlannerContext,
  };
}
