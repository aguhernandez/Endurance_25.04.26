import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  objective: 'base' | 'vo2max' | 'threshold' | 'race_prep';
  discipline: 'cycling' | 'running' | 'swimming' | 'triathlon';
  duration_weeks: number;
  sessions_per_week: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  weekly_structure: any[];
  is_featured: boolean;
  created_at: string;
}

export interface ApplyProgramResult {
  success: boolean;
  created_count?: number;
  program_name?: string;
  duration_weeks?: number;
  start_date?: string;
  end_date?: string;
  error?: string;
}

export function useProgramTemplates(discipline?: string) {
  const [programs, setPrograms] = useState<ProgramTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, [discipline]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('program_templates')
        .select('*')
        .order('discipline', { ascending: true })
        .order('level', { ascending: true });

      if (discipline) {
        query = query.eq('discipline', discipline);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPrograms(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const applyProgram = async (
    athleteId: string,
    programId: string,
    startDate: Date
  ): Promise<ApplyProgramResult> => {
    try {
      const { data, error: applyError } = await supabase.rpc('apply_program_to_athlete', {
        p_athlete_id: athleteId,
        p_program_id: programId,
        p_start_date: startDate.toISOString().split('T')[0]
      });

      if (applyError) throw applyError;

      return data as ApplyProgramResult;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to apply program'
      };
    }
  };

  return {
    programs,
    loading,
    error,
    applyProgram,
    refetch: fetchPrograms
  };
}
