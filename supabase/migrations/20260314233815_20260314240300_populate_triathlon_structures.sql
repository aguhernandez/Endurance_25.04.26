/*
  # Populate All Program Structures - Part 4: Triathlon

  Creates complete weekly structures for one representative program
  of each objective in triathlon discipline.
*/

-- TRIATHLON BASE: Aerobic Tri Foundation (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Multi-sport foundation", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Running base", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "Aerobic Base 2500m", "description": "Swimming base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 3, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Cycling base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
    {"day": 5, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Long bike", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume progression", "sessions": [
    {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Run endurance", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
    {"day": 3, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Extended bike", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
    {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy bike", "duration_minutes": 60, "intensity": "easy"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Long run", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Tempo integration", "sessions": [
    {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 3, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Bike tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Swim tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Long bike", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 3, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy bike", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Easy Run 30min Z2", "description": "Recovery run", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Build phase begins", "sessions": [
    {"day": 1, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
    {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 3, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long bike", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
    {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Bike tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long run", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Endurance consolidation", "sessions": [
    {"day": 1, "workout_name": "Long Swim 3500m", "description": "Long swim", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 2, "workout_name": "Tempo Run 25min Continuous", "description": "Sustained tempo", "duration_minutes": 55, "intensity": "moderate"},
    {"day": 3, "workout_name": "Z2 Long Ride (150 min)", "description": "Extended bike", "duration_minutes": 150, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Recovery run", "duration_minutes": 45, "intensity": "easy"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long run", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 7, "focus": "Peak base volume", "sessions": [
    {"day": 1, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
    {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 3, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long bike", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Swim tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Easy run", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Z2 Long Ride (150 min)", "description": "Peak long bike", "duration_minutes": 150, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Peak long run", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Recovery assessment", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 3, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy bike", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Recovery run", "duration_minutes": 45, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Aerobic Tri Foundation' AND discipline = 'triathlon';

-- TRIATHLON VO2MAX: Tri VO2max Builder (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "VO2max introduction across disciplines", "sessions": [
    {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Base maintenance", "duration_minutes": 30, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Classic 5x5min", "description": "Bike VO2max", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 3, "workout_name": "Sprint Power 8x50m", "description": "Swim speed", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "VO2max Intervals 5x1000m", "description": "Run VO2max", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 5, "workout_name": "Aerobic Base 2500m", "description": "Swim recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Bike tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 7, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Intensity progression", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Swim recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max 6x3min Hard Start", "description": "Bike intervals", "duration_minutes": 65, "intensity": "very_hard"},
    {"day": 3, "workout_name": "VO2max Intervals 6x800m", "description": "Run speed", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Sprint Intervals 10x100m", "description": "Swim intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 5, "workout_name": "Easy Run Recovery 30min", "description": "Recovery run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Peak VO2max load", "sessions": [
    {"day": 1, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Pyramid Up 3-4-5-4-3 min", "description": "Bike pyramid", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 3, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Run race pace", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 5, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "VO2max Classic 5x5min", "description": "Bike VO2max", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 3, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light bike tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo run", "duration_minutes": 45, "intensity": "moderate"}
  ]},
  {"week_number": 5, "focus": "VO2max refinement", "sessions": [
    {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max 30-30 Intervals x20", "description": "Bike short repeats", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 3, "workout_name": "VO2max Intervals 5x1000m", "description": "Run VO2max", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Sprint Power 8x50m", "description": "Swim power", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 5, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "VO2max Extended 4x6min", "description": "Bike extended", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Taper swim", "duration_minutes": 40, "intensity": "easy"},
    {"day": 3, "workout_name": "Strides and Activation", "description": "Run activation", "duration_minutes": 25, "intensity": "easy"},
    {"day": 5, "workout_name": "Openers Activation (30 min)", "description": "Bike openers", "duration_minutes": 30, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Tri VO2max Builder' AND discipline = 'triathlon';

-- TRIATHLON THRESHOLD: Threshold Integration (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Threshold baseline", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Swim tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 3, "workout_name": "Sweet Spot 2x20min Classic", "description": "Bike sweet spot", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Long run", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Threshold development", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Swim threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 3, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
    {"day": 5, "workout_name": "Easy Recovery 1500m", "description": "Swim recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Continuous Tempo (40 min)", "description": "Bike tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Threshold integration", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Swim tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 3, "workout_name": "Threshold 3x10min Standard", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Threshold Run 3x2km", "description": "Run threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 5, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
    {"day": 6, "workout_name": "Sweet Spot Over-Unders 6x6min", "description": "Bike over-unders", "duration_minutes": 75, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long run", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 3, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light bike tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Tempo Run 20min Sustained", "description": "Light run tempo", "duration_minutes": 45, "intensity": "moderate"},
    {"day": 6, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Threshold progression", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Swim threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 3, "workout_name": "Threshold 2x15min Sustained", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Threshold Run 2x3km", "description": "Run threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 5, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Long endurance", "duration_minutes": 90, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Peak threshold load", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Swim tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 3, "workout_name": "Threshold 2x20min Race Pace", "description": "Bike race threshold", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Marathon Pace Run 10km", "description": "Run race pace", "duration_minutes": 65, "intensity": "moderate"},
    {"day": 5, "workout_name": "Aerobic Base 2500m", "description": "Swim recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Sweet Spot 2x20min Classic", "description": "Bike sweet spot", "duration_minutes": 70, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Long run", "duration_minutes": 90, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Swim threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 3, "workout_name": "Threshold 3x10min Standard", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Threshold Run 3x2km", "description": "Run threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 5, "workout_name": "Easy Recovery 1500m", "description": "Swim recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Threshold 2x15min Sustained", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 3, "workout_name": "Openers Activation (30 min)", "description": "Bike activation", "duration_minutes": 30, "intensity": "easy"},
    {"day": 5, "workout_name": "Strides and Activation", "description": "Run activation", "duration_minutes": 25, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Threshold Integration' AND discipline = 'triathlon';

-- TRIATHLON RACE PREP: A-Race Preparation (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Race intensity introduction", "sessions": [
    {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "Race Simulation 40k TT Pace", "description": "Bike race sim", "duration_minutes": 90, "intensity": "very_hard"},
    {"day": 3, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Run race pace", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Sprint Intervals 10x100m", "description": "Swim speed", "duration_minutes": 60, "intensity": "hard"},
    {"day": 5, "workout_name": "Threshold 3x10min Standard", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 6, "workout_name": "Sprint Tri Brick Bike-Run", "description": "Brick workout", "duration_minutes": 90, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "High-intensity tolerance", "sessions": [
    {"day": 1, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 2, "workout_name": "Sprint Power Development 10x15s", "description": "Bike sprint", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 3, "workout_name": "VO2max Intervals 5x1000m", "description": "Run VO2max", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Anaerobic Threshold 6x200m", "description": "Swim threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 5, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Long brick", "duration_minutes": 120, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long endurance", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Race simulation peak", "sessions": [
    {"day": 1, "workout_name": "Open Water Simulation", "description": "Swim race sim", "duration_minutes": 75, "intensity": "moderate"},
    {"day": 2, "workout_name": "Criterium Simulation Race", "description": "Bike race sim", "duration_minutes": 80, "intensity": "very_hard"},
    {"day": 3, "workout_name": "Threshold Run 3x2km", "description": "Run threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 5, "workout_name": "Threshold 2x20min Race Pace", "description": "Bike race threshold", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Full race sim", "duration_minutes": 130, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Easy Run 45min Z2", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 3, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
    {"day": 4, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light bike tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Race sharpening", "sessions": [
    {"day": 1, "workout_name": "Sprint Power 8x50m", "description": "Swim sharpness", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 2, "workout_name": "Sprint Power Development 10x15s", "description": "Bike sprint", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 3, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Run race pace", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 5, "workout_name": "Threshold 4x8min with Surge", "description": "Bike surges", "duration_minutes": 70, "intensity": "hard"},
    {"day": 6, "workout_name": "Sprint Tri Brick Bike-Run", "description": "Final brick", "duration_minutes": 90, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Endurance", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Taper and race", "sessions": [
    {"day": 2, "workout_name": "Race Day Activation", "description": "Swim activation", "duration_minutes": 30, "intensity": "easy"},
    {"day": 3, "workout_name": "Strides and Activation", "description": "Run activation", "duration_minutes": 20, "intensity": "easy"},
    {"day": 5, "workout_name": "Openers Activation (30 min)", "description": "Bike openers", "duration_minutes": 30, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'A-Race Preparation' AND discipline = 'triathlon';
