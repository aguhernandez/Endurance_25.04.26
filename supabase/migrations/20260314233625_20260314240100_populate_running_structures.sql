/*
  # Populate All Program Structures - Part 2: Running

  Creates complete weekly structures for one representative program
  of each objective in running discipline.
*/

-- RUNNING BASE: Aerobic Endurance Pro (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Aerobic foundation", "sessions": [
    {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Build aerobic base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 60min Z2", "description": "Weekend long run", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume increase", "sessions": [
    {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Easy Run 60min Z2", "description": "Mid-week volume", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Extended long run", "duration_minutes": 75, "intensity": "easy"},
    {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Tempo introduction", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 20min Sustained", "description": "First tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 60min Z2", "description": "Moderate long", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Build phase", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Tempo intervals", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 60min Z2", "description": "Easy run", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 90min Z2", "description": "Extended long", "duration_minutes": 90, "intensity": "moderate"},
    {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Endurance consolidation", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 25min Continuous", "description": "Sustained tempo", "duration_minutes": 55, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 90min Z2", "description": "Long endurance", "duration_minutes": 90, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Peak base volume", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Tempo work", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 60min Z2", "description": "Mid-week run", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 105min Z2", "description": "Peak long run", "duration_minutes": 105, "intensity": "moderate"},
    {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Recovery and assessment", "sessions": [
    {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
    {"day": 6, "workout_name": "Long Run 75min Z2", "description": "Recovery long", "duration_minutes": 75, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Aerobic Endurance Pro' AND discipline = 'running';

-- RUNNING VO2MAX: Explosive Speed (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Speed introduction", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Easy base", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Intervals 5x1000m", "description": "First VO2max", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Tempo maintenance", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max Intervals 6x800m", "description": "Speed work", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Easy Run 45min Z2", "description": "Easy endurance", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Intensity progression", "sessions": [
    {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Intervals 8x600m", "description": "Fast intervals", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Run 2x10min", "description": "Tempo work", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max Intervals 5x1000m", "description": "VO2max work", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Peak VO2max load", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Race pace", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Run 25min Continuous", "description": "Tempo endurance", "duration_minutes": 55, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max Intervals 5x1000m", "description": "Peak VO2max", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
    {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "VO2max refinement", "sessions": [
    {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Intervals 6x800m", "description": "Speed intervals", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Run 2x10min", "description": "Tempo work", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Race pace", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Strides and Activation", "description": "Pre-test activation", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Time trial", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb
WHERE name = 'Explosive Speed' AND discipline = 'running';

-- RUNNING THRESHOLD: Progressive Tempo (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Threshold baseline", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 20min Sustained", "description": "Tempo intro", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Run 60min Z2", "description": "Long run", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Tempo development", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Tempo intervals", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Run 25min Continuous", "description": "Extended tempo", "duration_minutes": 55, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Threshold introduction", "sessions": [
    {"day": 2, "workout_name": "Threshold Run 3x2km", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Easy Run 30min Z2", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Run 2x15min", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long run", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run Recovery 30min", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Threshold progression", "sessions": [
    {"day": 2, "workout_name": "Threshold Run 2x3km", "description": "Longer threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Run 2x10min", "description": "Tempo maintenance", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "Threshold Run 3x2km", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Long endurance", "duration_minutes": 90, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Peak threshold load", "sessions": [
    {"day": 2, "workout_name": "Marathon Pace Run 10km", "description": "Race pace", "duration_minutes": 65, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run 45min Z2", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Run 2x15min", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Long run", "duration_minutes": 90, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "Threshold Run 3x2km", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Threshold Run 2x3km", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Strides and Activation", "description": "Pre-test", "duration_minutes": 25, "intensity": "easy"},
    {"day": 6, "workout_name": "Half Marathon Pace 3x3km", "description": "Threshold test", "duration_minutes": 65, "intensity": "hard"}
  ]}
]'::jsonb
WHERE name = 'Progressive Tempo' AND discipline = 'running';

-- RUNNING RACE PREP: Road Race Season (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Race intensity intro", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Base maintenance", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Race pace", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Run 2x10min", "description": "Tempo work", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max Intervals 5x1000m", "description": "Speed work", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "High-intensity tolerance", "sessions": [
    {"day": 1, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Intervals 6x800m", "description": "Speed intervals", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Run 25min Continuous", "description": "Tempo endurance", "duration_minutes": 55, "intensity": "moderate"},
    {"day": 6, "workout_name": "Threshold Run 3x2km", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Race simulation peak", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Race simulation", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Run 2x15min", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max Intervals 5x1000m", "description": "Speed work", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
    {"day": 4, "workout_name": "Easy Run Recovery 30min", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Race sharpening", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Base maintenance", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Intervals 6x800m", "description": "Speed sharpness", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Threshold Run 3x2km", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 6, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Final race sim", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Taper and race", "sessions": [
    {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Easy taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Strides and Activation", "description": "Race openers", "duration_minutes": 25, "intensity": "easy"},
    {"day": 6, "workout_name": "Easy Run 30min Z2", "description": "Pre-race", "duration_minutes": 30, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Road Race Season' AND discipline = 'running';
