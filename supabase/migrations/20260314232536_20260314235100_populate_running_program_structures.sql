/*
  # Populate Running Program Weekly Structures

  Adds complete week-by-week training plans to running program templates.
  Each week includes specific workouts from the library with progression logic.
*/

-- 5K Training Program (8 weeks, 4-5 sessions/week, intermediate)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Aerobic base and speed introduction",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Build aerobic base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Tempo introduction", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 60min Z2", "description": "Weekend long run", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume increase with intervals",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Recovery run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "VO2max Intervals 5x1000m", "description": "Speed work", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Extended long run", "duration_minutes": 75, "intensity": "easy"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Threshold development",
    "sessions": [
      {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Tempo intervals", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 6, "workout_name": "VO2max Intervals 6x800m", "description": "High intensity", "duration_minutes": 60, "intensity": "very_hard"},
      {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Long run", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Recovery run", "duration_minutes": 45, "intensity": "easy"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Speed endurance",
    "sessions": [
      {"day": 2, "workout_name": "Tempo Run 25min Continuous", "description": "Sustained tempo", "duration_minutes": 55, "intensity": "moderate"},
      {"day": 4, "workout_name": "VO2max Intervals 8x600m", "description": "Speed intervals", "duration_minutes": 60, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Race-specific intensity",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Race pace work", "duration_minutes": 60, "intensity": "hard"},
      {"day": 6, "workout_name": "Tempo Run 2x10min", "description": "Tempo intervals", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Long run", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 7,
    "focus": "Peak race prep",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy spin", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "VO2max Intervals 5x1000m", "description": "Final speed work", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
    ]
  },
  {
    "week_number": 8,
    "focus": "Taper and race",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Taper run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Strides and Activation", "description": "Race prep", "duration_minutes": 30, "intensity": "easy"},
      {"day": 7, "workout_name": "Easy Run 30min Z2", "description": "Pre-race shake", "duration_minutes": 30, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = '5K Training - Speed Development' AND discipline = 'running';

-- Marathon Training Program (16 weeks, 5-6 sessions/week, advanced)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Base building phase 1",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 20min Sustained", "description": "Tempo work", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Long run", "duration_minutes": 90, "intensity": "easy"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume progression",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 2x10min", "description": "Tempo intervals", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Mid-week long", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 105min Z2", "description": "Long run build", "duration_minutes": 105, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Endurance consolidation",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 25min Continuous", "description": "Sustained tempo", "duration_minutes": 55, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Aerobic base", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 120min Z2", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Moderate long", "duration_minutes": 90, "intensity": "easy"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Lactate threshold work",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Base maintenance", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Threshold Run 3x2km", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Recovery", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 135min Z2", "description": "Extended long", "duration_minutes": 135, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Aerobic power",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Easy base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 2x15min", "description": "Extended tempo", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Aerobic", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 150min Z2", "description": "Long endurance", "duration_minutes": 150, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 7,
    "focus": "Peak base volume",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Threshold Run 2x3km", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Easy run", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 165min Z2", "description": "Peak long run", "duration_minutes": 165, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 8,
    "focus": "Recovery and adaptation",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 25min Continuous", "description": "Tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Easy", "duration_minutes": 45, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 120min Z2", "description": "Moderate long", "duration_minutes": 120, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 9,
    "focus": "Marathon-specific endurance",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Marathon Pace Run 10km", "description": "Race pace work", "duration_minutes": 65, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Recovery", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 180min Marathon Pace Finish", "description": "Long with MP finish", "duration_minutes": 180, "intensity": "hard"}
    ]
  },
  {
    "week_number": 10,
    "focus": "Race-specific work",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Threshold Run 3x2km", "description": "Threshold", "duration_minutes": 60, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Easy", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 165min Z2", "description": "Long endurance", "duration_minutes": 165, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 11,
    "focus": "Peak training load",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Marathon Pace Run 16km", "description": "Extended MP", "duration_minutes": 85, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Recovery", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 180min Z2", "description": "Peak long run", "duration_minutes": 180, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 12,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Easy", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 2x10min", "description": "Light tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 120min Z2", "description": "Moderate long", "duration_minutes": 120, "intensity": "easy"}
    ]
  },
  {
    "week_number": 13,
    "focus": "Final quality block",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Marathon Pace Run 10km", "description": "Race pace", "duration_minutes": 65, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Easy", "duration_minutes": 60, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 150min Marathon Pace Finish", "description": "Final long with MP", "duration_minutes": 150, "intensity": "hard"}
    ]
  },
  {
    "week_number": 14,
    "focus": "Taper begins",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Easy", "duration_minutes": 45, "intensity": "easy"},
      {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Reduced long", "duration_minutes": 90, "intensity": "easy"}
    ]
  },
  {
    "week_number": 15,
    "focus": "Deep taper",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Easy", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Strides and Activation", "description": "Activation", "duration_minutes": 30, "intensity": "easy"},
      {"day": 5, "workout_name": "Easy Run 30min Z2", "description": "Light jog", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 16,
    "focus": "Race week",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Shake out", "duration_minutes": 30, "intensity": "easy"},
      {"day": 5, "workout_name": "Strides and Activation", "description": "Pre-race", "duration_minutes": 20, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Marathon Training - Endurance Builder' AND discipline = 'running';

-- Half Marathon Program (10 weeks, 4-5 sessions/week, intermediate)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Base building",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Tempo intro", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Long run", "duration_minutes": 75, "intensity": "easy"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume increase",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Run 2x10min", "description": "Tempo intervals", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 90min Z2", "description": "Extended long", "duration_minutes": 90, "intensity": "easy"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Threshold work",
    "sessions": [
      {"day": 2, "workout_name": "Tempo Run 25min Continuous", "description": "Sustained tempo", "duration_minutes": 55, "intensity": "moderate"},
      {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Base run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 6, "workout_name": "Threshold Run 3x2km", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
      {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Long run", "duration_minutes": 90, "intensity": "easy"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Moderate long", "duration_minutes": 75, "intensity": "easy"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Speed endurance",
    "sessions": [
      {"day": 2, "workout_name": "Tempo Run 2x15min", "description": "Extended tempo", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 4, "workout_name": "VO2max Intervals 5x1000m", "description": "Speed work", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Long Run 105min Z2", "description": "Long endurance", "duration_minutes": 105, "intensity": "moderate"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Race-specific pace",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "Half Marathon Pace 3x3km", "description": "Race pace work", "duration_minutes": 65, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 120min Z2", "description": "Peak long run", "duration_minutes": 120, "intensity": "moderate"},
      {"day": 7, "workout_name": "Easy Run 30min Z2", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 7,
    "focus": "Quality week",
    "sessions": [
      {"day": 2, "workout_name": "Threshold Run 2x3km", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
      {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 6, "workout_name": "Long Run 105min Z2", "description": "Long run", "duration_minutes": 105, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 8,
    "focus": "Final build",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Half Marathon Pace 3x3km", "description": "Race pace", "duration_minutes": 65, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 90min Marathon Pace Finish", "description": "Long with finish", "duration_minutes": 90, "intensity": "hard"}
    ]
  },
  {
    "week_number": 9,
    "focus": "Taper begins",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 40, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Run 60min Z2", "description": "Reduced long", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 10,
    "focus": "Race week",
    "sessions": [
      {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Shake out", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Strides and Activation", "description": "Pre-race", "duration_minutes": 25, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Half Marathon - Race Ready' AND discipline = 'running';
