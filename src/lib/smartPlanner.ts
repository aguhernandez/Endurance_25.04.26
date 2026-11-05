export interface SmartPlannerHubContext {
  events: Array<{ id?: string; title?: string; event_date?: string; priority?: string }>;
  availability: Array<{ id?: string; date?: string; day_of_week?: number; available_minutes?: number; notes?: string }>;
  biological_passport_available: boolean;
  biological_passport_summary?: Record<string, unknown>;
  fetched_at: string;
}

export interface SmartPlannerAlerts {
  warnings: string[];
  blocks: string[];
}

export function buildPlannerAlerts(
  context: SmartPlannerHubContext | undefined,
  block: { weeks?: Array<{ week_start_date?: string; sessions?: Array<{ day_of_week?: number; estimated_duration_minutes?: number; estimated_impulse?: number; intensity_basis?: string }> }> }
): SmartPlannerAlerts {
  const warnings: string[] = [];
  const blocks: string[] = [];

  if (!context) {
    blocks.push('No se pudo verificar el contexto compartido de Hub. La propuesta no debe publicarse.');
  } else {
    if (!context.biological_passport_available) {
      warnings.push('No hay Biological Passport disponible: las sesiones sin una zona o métrica compatible quedan como prescripción insuficiente.');
    }
    if (context.events.length === 0) warnings.push('No hay competencias compartidas de Hub para orientar la periodización.');
    if (context.availability.length === 0) warnings.push('No hay disponibilidad compartida de Hub; revisá manualmente los días propuestos.');
  }

  for (const week of block.weeks ?? []) {
    for (const session of week.sessions ?? []) {
      if (context?.availability.length && week.week_start_date && session.day_of_week != null) {
        const date = new Date(`${week.week_start_date}T00:00:00Z`);
        date.setUTCDate(date.getUTCDate() + session.day_of_week - 1);
        const day = date.toISOString().slice(0, 10);
        const matching = context.availability.filter(window => window.date ? window.date === day : window.day_of_week === session.day_of_week);
        if (!matching.length || (session.estimated_duration_minutes != null && matching.every(window => window.available_minutes != null && window.available_minutes < session.estimated_duration_minutes!))) {
          warnings.push(`Revisar disponibilidad para la sesión del ${day}.`);
        }
      }
      if (!Number.isFinite(session.estimated_impulse)) {
        warnings.push('Una sesión no tiene Impulse estimado confiable.');
      }
      if (session.intensity_basis && ['hr', 'pace', 'rpe'].includes(session.intensity_basis) && !context?.biological_passport_available) {
        warnings.push('Hay una sesión basada en HR/pace/RPE sin fisiología disponible; requiere edición antes de publicar.');
      }
    }
  }

  return { warnings: [...new Set(warnings)], blocks: [...new Set(blocks)] };
}

export function isPublishablePlannerBlock(
  status: 'pending' | 'accepted' | 'rejected' | 'applied',
  alerts: SmartPlannerAlerts
): boolean {
  return status === 'accepted' && alerts.blocks.length === 0;
}
