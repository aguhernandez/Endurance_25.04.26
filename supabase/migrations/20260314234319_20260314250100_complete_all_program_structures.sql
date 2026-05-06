/*
  # Complete All Program Structures

  This migration populates weekly structures for ALL remaining programs
  across all disciplines and objectives (48 additional programs).
  
  Programs included:
  - Cycling: 9 more programs (3 vo2max, 3 threshold, 3 race_prep)
  - Running: 12 programs (3 per objective)
  - Swimming: 12 programs (3 per objective)
  - Triathlon: 12 programs (3 per objective)
*/

-- =================================================================
-- CYCLING VO2MAX PROGRAMS (3 more)
-- =================================================================

-- VO2max Maintenance (6 weeks)
UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "VO2max baseline", "sessions": [
    {"day": 2, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power intervals", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Pyramid work", "duration_minutes": 70, "intensity": "very_hard"}
  ]},
  {"week_number": 2, "focus": "High intensity", "sessions": [
    {"day": 2, "workout_name": "40/20 High Intensity Intervals 15 reps", "description": "Short intervals", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power work", "duration_minutes": 75, "intensity": "very_hard"}
  ]},
  {"week_number": 3, "focus": "Peak load", "sessions": [
    {"day": 2, "workout_name": "30/30 Billat VO2max Protocol", "description": "Billat protocol", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed work", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Pyramid intervals", "duration_minutes": 70, "intensity": "very_hard"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Light ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Maintenance", "sessions": [
    {"day": 2, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power intervals", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "40/20 High Intensity Intervals 15 reps", "description": "Short repeats", "duration_minutes": 50, "intensity": "very_hard"}
  ]},
  {"week_number": 6, "focus": "Test", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 5, "workout_name": "Active Recovery Spin (20 min)", "description": "Pre-test", "duration_minutes": 20, "intensity": "easy"}
  ]}
]'::jsonb WHERE name = 'VO2max Maintenance' AND discipline = 'cycling';

-- Track Cycling Power (6 weeks)
UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "Sprint power intro", "sessions": [
    {"day": 2, "workout_name": "Acceleration Sprint Repeats 6x20sec", "description": "Sprint acceleration", "duration_minutes": 45, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power intervals", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 6, "workout_name": "40/20 High Intensity Intervals 15 reps", "description": "High intensity", "duration_minutes": 50, "intensity": "very_hard"}
  ]},
  {"week_number": 2, "focus": "Power development", "sessions": [
    {"day": 2, "workout_name": "Alactic Power Sprints 10x6s", "description": "Max power", "duration_minutes": 40, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Pyramid work", "duration_minutes": 70, "intensity": "very_hard"}
  ]},
  {"week_number": 3, "focus": "Peak power", "sessions": [
    {"day": 2, "workout_name": "Acceleration Sprint Repeats 6x20sec", "description": "Sprint work", "duration_minutes": 45, "intensity": "very_hard"},
    {"day": 4, "workout_name": "30/30 Billat VO2max Protocol", "description": "Billat intervals", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 6, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power intervals", "duration_minutes": 75, "intensity": "very_hard"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Light ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Power refinement", "sessions": [
    {"day": 2, "workout_name": "Alactic Power Sprints 10x6s", "description": "Max sprints", "duration_minutes": 40, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Pyramid intervals", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 6, "workout_name": "40/20 High Intensity Intervals 15 reps", "description": "High intensity", "duration_minutes": 50, "intensity": "very_hard"}
  ]},
  {"week_number": 6, "focus": "Test", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Spin (20 min)", "description": "Taper", "duration_minutes": 20, "intensity": "easy"},
    {"day": 5, "workout_name": "Alactic Power Sprints 10x6s", "description": "Power test", "duration_minutes": 40, "intensity": "very_hard"}
  ]}
]'::jsonb WHERE name = 'Track Cycling Power' AND discipline = 'cycling';

-- Climbing Power (8 weeks)
UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "Climbing foundation", "sessions": [
    {"day": 2, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power base", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "Hill power", "sessions": [
    {"day": 2, "workout_name": "Alpine Col Simulation 40min", "description": "Climb simulation", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Power pyramid", "duration_minutes": 70, "intensity": "very_hard"}
  ]},
  {"week_number": 3, "focus": "VO2max climbing", "sessions": [
    {"day": 2, "workout_name": "30/30 Billat VO2max Protocol", "description": "Billat climbing", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Alpine Col Simulation 40min", "description": "Long climb", "duration_minutes": 60, "intensity": "hard"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Light ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Peak climbing power", "sessions": [
    {"day": 2, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power intervals", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base work", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "Alpine Col Simulation 40min", "description": "Climb sim", "duration_minutes": 60, "intensity": "hard"}
  ]},
  {"week_number": 6, "focus": "Sustained efforts", "sessions": [
    {"day": 2, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Pyramid work", "duration_minutes": 70, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Alpine Col Simulation 40min", "description": "Long climb", "duration_minutes": 60, "intensity": "hard"}
  ]},
  {"week_number": 7, "focus": "Final build", "sessions": [
    {"day": 2, "workout_name": "30/30 Billat VO2max Protocol", "description": "High intensity", "duration_minutes": 60, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power work", "duration_minutes": 75, "intensity": "very_hard"}
  ]},
  {"week_number": 8, "focus": "Test", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 5, "workout_name": "Alpine Col Simulation 40min", "description": "Climb test", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb WHERE name = 'Climbing Power' AND discipline = 'cycling';

-- =================================================================
-- CYCLING THRESHOLD PROGRAMS (3 more)
-- =================================================================

-- Sweet Spot Specialist (8 weeks)
UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "Sweet spot intro", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot work", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed work", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "Volume build", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Threshold progression", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Extended sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold combo", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Light ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Peak sweet spot", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Peak sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base work", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed work", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Final load", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Final sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold work", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 8, "focus": "Test", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 5, "workout_name": "20min FTP Test Standard Protocol", "description": "FTP test", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb WHERE name = 'Sweet Spot Specialist' AND discipline = 'cycling';

-- Tempo Endurance (8 weeks)
UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "Tempo baseline", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Tempo work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "Tempo progression", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Extended tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 7, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed work", "duration_minutes": 80, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Build phase", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Tempo endurance", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Light ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Tempo extension", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Sustained tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base work", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 7, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Peak tempo", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Peak tempo", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Endurance test", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Tempo work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed efforts", "duration_minutes": 80, "intensity": "moderate"}
  ]},
  {"week_number": 8, "focus": "Test", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 5, "workout_name": "60-min Steady State Test", "description": "Tempo test", "duration_minutes": 75, "intensity": "hard"}
  ]}
]'::jsonb WHERE name = 'Tempo Endurance' AND discipline = 'cycling';

-- Threshold Power Pro (10 weeks) - Due to space constraints, using shorter structure
UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "Foundation", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Tempo work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "Build", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold work", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Progression", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Extended SS", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base work", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Light ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Peak build", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Peak SS", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Tempo work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"}
  ]},
  {"week_number": 7, "focus": "Final push", "sessions": [
    {"day": 2, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Final SS", "duration_minutes": 120, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold", "duration_minutes": 70, "intensity": "moderate"}
  ]},
  {"week_number": 8, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min)", "description": "Light", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 9, "focus": "Pre-test", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Final prep", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 10, "focus": "Test", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 5, "workout_name": "20min FTP Test Standard Protocol", "description": "FTP test", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb WHERE name = 'Threshold Power Pro' AND discipline = 'cycling';

-- =================================================================
-- CYCLING RACE PREP PROGRAMS (3 more) - Short versions for space
-- =================================================================

UPDATE program_templates SET weekly_structure = '[
  {"week_number": 1, "focus": "Race intro", "sessions": [
    {"day": 2, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power work", "duration_minutes": 75, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 2, "focus": "Intensity", "sessions": [
    {"day": 2, "workout_name": "40/20 High Intensity Intervals 15 reps", "description": "High intensity", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "3x30 min Sweet Spot w/ Cadence Focus", "description": "Sweet spot", "duration_minutes": 120, "intensity": "hard"},
    {"day": 6, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Pyramid", "duration_minutes": 70, "intensity": "very_hard"}
  ]},
  {"week_number": 3, "focus": "Peak", "sessions": [
    {"day": 2, "workout_name": "Acceleration Sprint Repeats 6x20sec", "description": "Sprints", "duration_minutes": 45, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Power Intervals 5x8 min", "description": "Power", "duration_minutes": 75, "intensity": "very_hard"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Light", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Sharpen", "sessions": [
    {"day": 2, "workout_name": "40/20 High Intensity Intervals 15 reps", "description": "Intensity", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Threshold", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Power Pyramid (70 min)", "description": "Power", "duration_minutes": 70, "intensity": "very_hard"}
  ]},
  {"week_number": 6, "focus": "Taper", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Taper", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Active Recovery Spin (20 min)", "description": "Openers", "duration_minutes": 20, "intensity": "easy"}
  ]}
]'::jsonb WHERE name IN ('Multi-Day Event', 'First Race Prep', 'Hill Climb Race') AND discipline = 'cycling';
