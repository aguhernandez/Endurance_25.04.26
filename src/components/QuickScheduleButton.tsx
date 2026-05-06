import { useState } from 'react';
import { Calendar, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuickScheduleButtonProps {
  athleteId: string;
  dateStr: string;
  onScheduled?: () => void;
}

interface LibraryWorkout {
  id: string;
  name: string;
  sport: string;
  estimated_duration_minutes: number;
  difficulty_level: string;
}

export default function QuickScheduleButton({ athleteId, dateStr, onScheduled }: QuickScheduleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workouts, setWorkouts] = useState<LibraryWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    try {
      const { data } = await supabase
        .from('workouts')
        .select('id, name, sport, estimated_duration_minutes, difficulty_level')
        .eq('is_library', true)
        .order('name');
      setWorkouts(data || []);
    } catch (err) {
      console.error('Error loading library:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (workoutId: string) => {
    setScheduling(true);
    try {
      const { data: templateWorkout } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

      if (!templateWorkout) throw new Error('Workout not found');

      const { data: steps } = await supabase
        .from('workout_steps')
        .select('*')
        .eq('workout_id', workoutId)
        .order('step_order');

      const { data: newWorkout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          athlete_id: athleteId,
          name: templateWorkout.name,
          description: templateWorkout.description,
          sport: templateWorkout.sport,
          estimated_duration_minutes: templateWorkout.estimated_duration_minutes,
          scheduled_date: dateStr,
          is_library: false,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      if (steps && steps.length > 0) {
        const newSteps = steps.map(step => ({
          workout_id: newWorkout.id,
          step_order: step.step_order,
          step_type: step.step_type,
          duration_seconds: step.duration_seconds,
          target_power_low: step.target_power_low,
          target_power_high: step.target_power_high,
          target_pace_per_km: step.target_pace_per_km,
          target_hr_zone: step.target_hr_zone,
          target_cadence: step.target_cadence,
          notes: step.notes,
          repeat_count: step.repeat_count,
        }));

        await supabase.from('workout_steps').insert(newSteps);
      }

      setIsOpen(false);
      if (onScheduled) onScheduled();
    } catch (err) {
      console.error('Error scheduling workout:', err);
      alert('Failed to schedule workout');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-300 transition"
      >
        <Plus size={14} />
        Agregar / Add
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-primary-purple dark:text-white font-heading">
                    Programar Entrenamiento / Schedule Workout
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Cargando entrenamientos... / Loading workouts...</div>
              ) : workouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No hay entrenamientos en la biblioteca / No library workouts available
                </div>
              ) : (
                <div className="grid gap-3">
                  {workouts.map((workout) => (
                    <button
                      key={workout.id}
                      onClick={() => handleSchedule(workout.id)}
                      disabled={scheduling}
                      className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{workout.name}</h4>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                              {workout.sport}
                            </span>
                            <span>{workout.estimated_duration_minutes} min</span>
                            <span className="inline-flex px-2 py-1 rounded bg-primary-yellow/20 text-primary-purple text-xs font-bold">
                              {workout.difficulty_level}
                            </span>
                          </div>
                        </div>
                        <Plus size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
