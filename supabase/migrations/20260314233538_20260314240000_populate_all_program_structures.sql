/*
  # Populate All Program Structures - Part 1: Cycling

  Creates complete weekly structures for one representative program
  of each objective in cycling discipline.
*/

-- CYCLING BASE: Base Building Foundation (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Aerobic foundation", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Build aerobic base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Extended aerobic work", "duration_minutes": 90, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base Endurance Ride", "description": "Weekend base ride", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume increase", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Maintain aerobic base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Steady aerobic work", "duration_minutes": 90, "intensity": "easy"},
    {"day": 6, "workout_name": "Z2 Long Ride (150 min)", "description": "Long weekend ride", "duration_minutes": 150, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance Ride", "description": "Easy recovery ride", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Tempo introduction", "sessions": [
    {"day": 2, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "First tempo session", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic maintenance", "duration_minutes": 90, "intensity": "easy"},
    {"day": 6, "workout_name": "Endurance with Tempo Pickups (90 min)", "description": "Mixed intensity ride", "duration_minutes": 90, "intensity": "moderate"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance Ride", "description": "Short aerobic ride", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Moderate base ride", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Build phase begins", "sessions": [
    {"day": 2, "workout_name": "Continuous Tempo (40 min)", "description": "Sustained tempo effort", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic base", "duration_minutes": 90, "intensity": "easy"},
    {"day": 6, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long mixed ride", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance Ride", "description": "Recovery spin", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Muscular endurance", "sessions": [
    {"day": 2, "workout_name": "Muscular Endurance Tempo 3x15 min", "description": "ME development", "duration_minutes": 80, "intensity": "hard"},
    {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy aerobic", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long weekend ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Peak base volume", "sessions": [
    {"day": 2, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Tempo intervals", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Continuous Tempo (40 min)", "description": "Continuous effort", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Z2 Long Ride (150 min)", "description": "Long base ride", "duration_minutes": 150, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance Ride", "description": "Easy recovery", "duration_minutes": 75, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Assessment", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy spin", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "FTP Ramp Test Protocol", "description": "FTP assessment", "duration_minutes": 60, "intensity": "hard"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Recovery ride", "duration_minutes": 90, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Base Building Foundation' AND discipline = 'cycling';

-- CYCLING VO2MAX: VO2max Primer (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "VO2max introduction", "sessions": [
    {"day": 1, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Base maintenance", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Classic 5x5min", "description": "First VO2max session", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Tempo work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max 6x3min Hard Start", "description": "High-intensity intervals", "duration_minutes": 65, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic endurance", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Intensity progression", "sessions": [
    {"day": 1, "workout_name": "Aerobic Base Endurance Ride", "description": "Recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Tabata Protocol 8x20s", "description": "Micro-intervals", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Sweet Spot 3x15min Classic", "description": "Sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 6, "workout_name": "VO2max Extended 4x6min", "description": "Extended VO2max", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Peak VO2max load", "sessions": [
    {"day": 1, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy aerobic", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max Pyramid Up 3-4-5-4-3 min", "description": "Pyramid intervals", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Continuous Tempo (40 min)", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "VO2max Classic 5x5min", "description": "Classic VO2max", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Z2 Long Ride (150 min)", "description": "Long base", "duration_minutes": 150, "intensity": "moderate"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic ride", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "VO2max refinement", "sessions": [
    {"day": 1, "workout_name": "Aerobic Base Endurance Ride", "description": "Base maintenance", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "VO2max 30-30 Intervals x20", "description": "Short repeats", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Sweet Spot 3x15min Classic", "description": "Sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 6, "workout_name": "VO2max Extended 4x6min", "description": "Extended intervals", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy spin", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Openers Activation (30 min)", "description": "Pre-test openers", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "VO2max Estimation 5min All-Out", "description": "VO2max test", "duration_minutes": 45, "intensity": "very_hard"}
  ]}
]'::jsonb
WHERE name = 'VO2max Primer' AND discipline = 'cycling';

-- CYCLING THRESHOLD: FTP Builder (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Threshold baseline", "sessions": [
    {"day": 2, "workout_name": "Sweet Spot 2x20min Classic", "description": "Sweet spot intro", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic base", "duration_minutes": 90, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Tempo work", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "Sweet spot development", "sessions": [
    {"day": 2, "workout_name": "Sweet Spot 3x12min Progressive", "description": "Progressive intervals", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Continuous Tempo (40 min)", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Extended sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 7, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Threshold introduction", "sessions": [
    {"day": 2, "workout_name": "Threshold 3x10min Standard", "description": "Threshold intervals", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Sweet Spot Over-Unders 6x6min", "description": "Over-unders", "duration_minutes": 75, "intensity": "hard"},
    {"day": 7, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic base", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance Ride", "description": "Easy spin", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Recovery ride", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Threshold progression", "sessions": [
    {"day": 2, "workout_name": "Threshold 2x15min Sustained", "description": "Longer threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Sweet Spot 3x15min Classic", "description": "Sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 6, "workout_name": "Threshold 4x8min with Surge", "description": "Threshold surges", "duration_minutes": 70, "intensity": "hard"},
    {"day": 7, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Peak threshold load", "sessions": [
    {"day": 2, "workout_name": "Threshold 2x20min Race Pace", "description": "Race threshold", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Continuous Tempo (40 min)", "description": "Tempo recovery", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Sweet Spot 2x20min Classic", "description": "Sweet spot endurance", "duration_minutes": 70, "intensity": "hard"},
    {"day": 7, "workout_name": "Z2 Long Ride (150 min)", "description": "Long base", "duration_minutes": 150, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "Threshold 3x10min Standard", "description": "Standard threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy aerobic", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Threshold 2x15min Sustained", "description": "Sustained threshold", "duration_minutes": 70, "intensity": "hard"},
    {"day": 7, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic endurance", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Openers Activation (30 min)", "description": "Pre-test activation", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "20min FTP Test Standard Protocol", "description": "FTP test", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb
WHERE name = 'FTP Builder' AND discipline = 'cycling';

-- CYCLING RACE PREP: Championship Peak (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Race intensity intro", "sessions": [
    {"day": 1, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Base maintenance", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "Race Simulation 40k TT Pace", "description": "TT simulation", "duration_minutes": 90, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Threshold 3x10min Standard", "description": "Threshold maintenance", "duration_minutes": 70, "intensity": "hard"},
    {"day": 6, "workout_name": "Criterium Simulation Race", "description": "Race simulation", "duration_minutes": 80, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "High-intensity tolerance", "sessions": [
    {"day": 1, "workout_name": "Aerobic Base Endurance Ride", "description": "Recovery", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Power Development 10x15s", "description": "Sprint work", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Sweet Spot 3x15min Classic", "description": "Sweet spot", "duration_minutes": 80, "intensity": "hard"},
    {"day": 6, "workout_name": "Anaerobic Capacity 8x2min", "description": "Anaerobic intervals", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Z2 Long Ride (150 min)", "description": "Long base", "duration_minutes": 150, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Race simulation peak", "sessions": [
    {"day": 1, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy spin", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "Criterium Simulation Race", "description": "Full race sim", "duration_minutes": 80, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Threshold 2x20min Race Pace", "description": "Race threshold", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 6, "workout_name": "Road Race Simulation Full", "description": "Complete race sim", "duration_minutes": 120, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Recovery", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance Ride", "description": "Easy aerobic", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Aerobic endurance", "duration_minutes": 90, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Race sharpening", "sessions": [
    {"day": 1, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Base maintenance", "duration_minutes": 60, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Power Development 10x15s", "description": "Sprint sharpness", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Threshold 4x8min with Surge", "description": "Race surges", "duration_minutes": 70, "intensity": "hard"},
    {"day": 6, "workout_name": "Race Simulation 40k TT Pace", "description": "Final race sim", "duration_minutes": 90, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Taper and race", "sessions": [
    {"day": 2, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy taper", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Openers Activation (30 min)", "description": "Race openers", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Pre-Race Aerobic Activation (45 min)", "description": "Pre-race activation", "duration_minutes": 45, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Championship Peak' AND discipline = 'cycling';
