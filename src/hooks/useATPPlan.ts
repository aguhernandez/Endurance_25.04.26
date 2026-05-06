import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ATPPlan, ATPEvent } from '../types/workout';
import { WeekOverride } from '../lib/banisterEngine';

export interface ATPWeekOverride {
  id: string;
  plan_id: string;
  athlete_id: string;
  week_number: number;
  week_start_date: string;
  override_impulse: number;
}

export function useATPPlan(athleteId: string | null | undefined) {
  const [plan, setPlan] = useState<ATPPlan | null>(null);
  const [events, setEvents] = useState<ATPEvent[]>([]);
  const [weekOverrides, setWeekOverrides] = useState<ATPWeekOverride[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPlan = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data: planData } = await supabase
        .from('atp_plans')
        .select('*')
        .eq('athlete_id', id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setPlan(planData || null);

      if (planData) {
        const [eventsRes, overridesRes] = await Promise.all([
          supabase
            .from('atp_events')
            .select('*')
            .eq('plan_id', planData.id)
            .order('event_date', { ascending: true }),
          supabase
            .from('atp_week_overrides')
            .select('*')
            .eq('plan_id', planData.id)
            .order('week_number', { ascending: true }),
        ]);

        setEvents(eventsRes.data || []);
        setWeekOverrides(overridesRes.data || []);
      } else {
        setEvents([]);
        setWeekOverrides([]);
      }
    } catch (err) {
      console.error('Error loading ATP plan:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (athleteId) {
      fetchPlan(athleteId);
    } else {
      setPlan(null);
      setEvents([]);
      setWeekOverrides([]);
    }
  }, [athleteId, fetchPlan]);

  async function savePlan(updates: Partial<ATPPlan>) {
    if (!athleteId) return;
    setSaving(true);
    try {
      if (plan) {
        const { data, error } = await supabase
          .from('atp_plans')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', plan.id)
          .select()
          .single();
        if (error) throw error;
        setPlan(data);
      } else {
        const { data, error } = await supabase
          .from('atp_plans')
          .insert({
            athlete_id: athleteId,
            plan_name: updates.plan_name || 'Annual Training Plan',
            ca_start: updates.ca_start ?? 50,
            al_start: updates.al_start ?? 50,
            tau_chronic: updates.tau_chronic ?? 28,
            tau_acute: updates.tau_acute ?? 7,
            rb_min: updates.rb_min ?? -25,
            rb_peak_target: updates.rb_peak_target ?? 10,
            ca_target_main_event: updates.ca_target_main_event ?? 100,
            plan_start_date: updates.plan_start_date ?? new Date().toISOString().split('T')[0],
            is_active: true,
          })
          .select()
          .single();
        if (error) throw error;
        setPlan(data);
      }
    } catch (err) {
      console.error('Error saving ATP plan:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function deletePlan() {
    if (!plan || !athleteId) return;
    setSaving(true);
    try {
      await supabase.from('atp_week_overrides').delete().eq('plan_id', plan.id);
      await supabase.from('atp_events').delete().eq('plan_id', plan.id);
      const { error } = await supabase.from('atp_plans').delete().eq('id', plan.id);
      if (error) throw error;
      setPlan(null);
      setEvents([]);
      setWeekOverrides([]);
    } catch (err) {
      console.error('Error deleting ATP plan:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function addEvent(evt: {
    event_name: string;
    event_date: string;
    priority: 'A' | 'B' | 'C';
    notes?: string;
  }) {
    if (!athleteId || !plan) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('atp_events')
        .insert({
          plan_id: plan.id,
          athlete_id: athleteId,
          ...evt,
        })
        .select()
        .single();
      if (error) throw error;
      setEvents(prev => [...prev, data].sort((a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ));
    } catch (err) {
      console.error('Error adding ATP event:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(eventId: string) {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('atp_events')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error('Error removing ATP event:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function updateEvent(eventId: string, updates: Partial<ATPEvent>) {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('atp_events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', eventId)
        .select()
        .single();
      if (error) throw error;
      setEvents(prev => prev.map(e => e.id === eventId ? data : e).sort((a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ));
    } catch (err) {
      console.error('Error updating ATP event:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function setWeekOverride(weekNumber: number, weekStartDate: string, overrideImpulse: number) {
    if (!plan || !athleteId) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('atp_week_overrides')
        .upsert({
          plan_id: plan.id,
          athlete_id: athleteId,
          week_number: weekNumber,
          week_start_date: weekStartDate,
          override_impulse: Math.round(overrideImpulse * 100) / 100,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'plan_id,week_number' })
        .select()
        .single();
      if (error) throw error;
      setWeekOverrides(prev => {
        const filtered = prev.filter(o => o.week_number !== weekNumber);
        return [...filtered, data].sort((a, b) => a.week_number - b.week_number);
      });
    } catch (err) {
      console.error('Error setting week override:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function clearWeekOverride(weekNumber: number) {
    if (!plan) return;
    setSaving(true);
    try {
      await supabase
        .from('atp_week_overrides')
        .delete()
        .eq('plan_id', plan.id)
        .eq('week_number', weekNumber);
      setWeekOverrides(prev => prev.filter(o => o.week_number !== weekNumber));
    } catch (err) {
      console.error('Error clearing week override:', err);
    } finally {
      setSaving(false);
    }
  }

  async function clearAllOverrides() {
    if (!plan) return;
    setSaving(true);
    try {
      await supabase.from('atp_week_overrides').delete().eq('plan_id', plan.id);
      setWeekOverrides([]);
    } catch (err) {
      console.error('Error clearing all overrides:', err);
    } finally {
      setSaving(false);
    }
  }

  const engineOverrides: WeekOverride[] = weekOverrides.map(o => ({
    weekNumber: o.week_number,
    overrideImpulse: o.override_impulse,
  }));

  return {
    plan,
    events,
    weekOverrides,
    engineOverrides,
    loading,
    saving,
    savePlan,
    deletePlan,
    addEvent,
    removeEvent,
    updateEvent,
    setWeekOverride,
    clearWeekOverride,
    clearAllOverrides,
    refetch: () => athleteId ? fetchPlan(athleteId) : undefined,
  };
}
