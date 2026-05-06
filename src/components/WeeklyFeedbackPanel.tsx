import { useState, useEffect } from 'react';
import { MessageSquare, Save, AlertCircle, TrendingUp, Moon, Zap, Heart, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WeeklyFeedbackPanelProps {
  athleteId: string;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  loadVariance: number;
  caVariance: number;
  afVariance: number;
  rbVariance: number;
}

interface WeeklyAdjustment {
  id?: string;
  athlete_notes?: string;
  perceived_difficulty?: number;
  sleep_quality?: number;
  stress_level?: number;
  motivation_level?: number;
  injury_concerns?: string;
  coach_notes?: string;
  adjustment_reason?: string;
  next_week_recommendation?: string;
  readiness_score?: number;
  recommended_load_adjustment?: number;
}

export default function WeeklyFeedbackPanel({
  athleteId,
  weekNumber,
  weekStartDate,
  weekEndDate,
  loadVariance,
  caVariance,
  afVariance,
  rbVariance,
}: WeeklyFeedbackPanelProps) {
  const { profile } = useAuth();
  const isCoach = profile?.role === 'coach' || profile?.role === 'admin';
  const isOwnData = profile?.id === athleteId;

  const [adjustment, setAdjustment] = useState<WeeklyAdjustment>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadAdjustment();
  }, [athleteId, weekNumber]);

  const loadAdjustment = async () => {
    const { data } = await supabase
      .from('weekly_adjustments')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('week_number', weekNumber)
      .maybeSingle();

    if (data) {
      setAdjustment(data);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const payload = {
        athlete_id: athleteId,
        week_number: weekNumber,
        week_start_date: weekStartDate,
        week_end_date: weekEndDate,
        load_variance_pct: loadVariance,
        ca_variance: caVariance,
        af_variance: afVariance,
        rb_variance: rbVariance,
        ...adjustment,
      };

      if (isCoach) {
        payload.coach_id = profile.id;
      }

      const { error } = await supabase
        .from('weekly_adjustments')
        .upsert(payload, { onConflict: 'athlete_id,week_number' });

      if (error) throw error;

      setSaveMessage('Saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Error saving adjustment:', err);
      setSaveMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const renderSlider = (
    label: string,
    value: number | undefined,
    onChange: (val: number) => void,
    icon: React.ReactNode,
    lowLabel: string,
    highLabel: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <span className="ml-auto text-lg font-bold text-primary-purple dark:text-white">
          {value || 5}/10
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value || 5}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-yellow"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex items-center gap-3">
          <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-primary-purple dark:text-white font-heading">
            Feedback y Ajustes Semanales / Weekly Feedback & Adjustments
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Registra cómo te sentiste esta semana y planifica ajustes / Track how you felt and plan adjustments
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Athlete Section */}
        {isOwnData && (
          <div className="space-y-4">
            <h4 className="text-md font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-yellow" />
              Autoevaluación del Atleta / Athlete Self-Assessment
            </h4>

            {renderSlider(
              'Dificultad Percibida / Perceived Difficulty',
              adjustment.perceived_difficulty,
              (val) => setAdjustment({ ...adjustment, perceived_difficulty: val }),
              <Zap size={16} className="text-orange-500" />,
              'Muy Fácil / Too Easy',
              'Muy Difícil / Too Hard'
            )}

            {renderSlider(
              'Calidad del Sueño / Sleep Quality',
              adjustment.sleep_quality,
              (val) => setAdjustment({ ...adjustment, sleep_quality: val }),
              <Moon size={16} className="text-indigo-500" />,
              'Pobre / Poor',
              'Excelente / Excellent'
            )}

            {renderSlider(
              'Nivel de Estrés / Stress Level',
              adjustment.stress_level,
              (val) => setAdjustment({ ...adjustment, stress_level: val }),
              <AlertCircle size={16} className="text-red-500" />,
              'Sin Estrés / No Stress',
              'Muy Estresado / Very Stressed'
            )}

            {renderSlider(
              'Nivel de Motivación / Motivation Level',
              adjustment.motivation_level,
              (val) => setAdjustment({ ...adjustment, motivation_level: val }),
              <Heart size={16} className="text-pink-500" />,
              'Baja / Low',
              'Alta / High'
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MessageSquare size={16} />
                Tus Notas / Your Notes
              </label>
              <textarea
                value={adjustment.athlete_notes || ''}
                onChange={(e) => setAdjustment({ ...adjustment, athlete_notes: e.target.value })}
                placeholder="¿Cómo te sentiste esta semana? ¿Desafíos o logros? / How did this week feel? Challenges or successes?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <AlertCircle size={16} />
                Lesiones o Problemas de Salud / Injury or Health Concerns
              </label>
              <textarea
                value={adjustment.injury_concerns || ''}
                onChange={(e) => setAdjustment({ ...adjustment, injury_concerns: e.target.value })}
                placeholder="¿Dolor, molestias o problemas de salud? / Any pain, discomfort, or health issues?"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* Coach Section */}
        {isCoach && (
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Target size={18} className="text-green-500" />
              Análisis del Coach / Coach Analysis
            </h4>

            {renderSlider(
              'Preparación para Próxima Semana / Readiness for Next Week',
              adjustment.readiness_score,
              (val) => setAdjustment({ ...adjustment, readiness_score: val }),
              <TrendingUp size={16} className="text-green-500" />,
              'No Listo / Not Ready',
              'Completamente Listo / Fully Ready'
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Ajuste de Carga Recomendado / Recommended Load Adjustment (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={adjustment.recommended_load_adjustment || 0}
                  onChange={(e) => setAdjustment({ ...adjustment, recommended_load_adjustment: parseFloat(e.target.value) })}
                  step="5"
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-bold"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {adjustment.recommended_load_adjustment && adjustment.recommended_load_adjustment > 0 ? 'Aumentar / Increase' : 'Reducir / Decrease'} carga próxima semana / load next week
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Razón del Ajuste / Adjustment Reason
              </label>
              <input
                type="text"
                value={adjustment.adjustment_reason || ''}
                onChange={(e) => setAdjustment({ ...adjustment, adjustment_reason: e.target.value })}
                placeholder="ej., Semana de recuperación, enfermedad, preparación para carrera / e.g., Recovery week, illness, race prep"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notas del Coach / Coach Notes
              </label>
              <textarea
                value={adjustment.coach_notes || ''}
                onChange={(e) => setAdjustment({ ...adjustment, coach_notes: e.target.value })}
                placeholder="Análisis del rendimiento y manejo de carga / Analysis of performance and load management"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recomendación Próxima Semana / Next Week Recommendation
              </label>
              <textarea
                value={adjustment.next_week_recommendation || ''}
                onChange={(e) => setAdjustment({ ...adjustment, next_week_recommendation: e.target.value })}
                placeholder="Áreas de enfoque y recomendaciones / Focus areas and recommendations"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* Display Section for viewing other's notes */}
        {!isOwnData && !isCoach && adjustment.coach_notes && (
          <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-bold text-gray-800 dark:text-gray-200">Feedback del Coach / Coach Feedback</h4>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{adjustment.coach_notes}</p>
            </div>
            {adjustment.next_week_recommendation && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">PRÓXIMA SEMANA / NEXT WEEK</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{adjustment.next_week_recommendation}</p>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        {(isOwnData || isCoach) && (
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-purple hover:bg-primary-purple/90 disabled:bg-gray-400 text-white font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <Save size={16} />
              {saving ? 'Guardando... / Saving...' : 'Guardar Feedback / Save Feedback'}
            </button>
            {saveMessage && (
              <span className={`text-sm font-medium ${
                saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'
              }`}>
                {saveMessage === 'Saved successfully' ? 'Guardado exitosamente / Saved successfully' : saveMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
