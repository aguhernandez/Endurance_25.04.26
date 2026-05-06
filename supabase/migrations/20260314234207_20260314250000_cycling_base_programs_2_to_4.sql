/*
  # Cycling Base Programs 2-4

  Creates weekly structures for 3 additional cycling base programs
*/

-- CYCLING BASE #2: Endurance Fundamentals (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Aerobic foundation", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base Endurance 45 min", "description": "Build aerobic base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Easy aerobic", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long weekend ride", "duration_minutes": 120, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume increase", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base Endurance 45 min", "description": "Maintain aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Aerobic efficiency", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Extended long ride", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Active Recovery Ride (30 min)", "description": "Recovery spin", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Endurance extension", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base with efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Long endurance test", "duration_minutes": 120, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Light spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Build phase", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Active Recovery Ride (30 min)", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Endurance consolidation", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed intensity", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Endurance test", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Peak base volume", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base with efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Mid-week ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Peak long ride", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Assessment", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Light ride", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "20-min Maximal Mean Power Protocol", "description": "FTP test", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb
WHERE name = 'Endurance Fundamentals' AND discipline = 'cycling';

-- CYCLING BASE #3: Aerobic Base Extension (10 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Foundation", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Easy base", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Base building", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Weekend ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume building", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base Endurance 45 min", "description": "Aerobic work", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Easy spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Sustained efforts", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base with efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Light ride", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Extended endurance", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed intensity", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Long test", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Active Recovery Ride (30 min)", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Threshold intro", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Combined work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Build consolidation", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base with efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Aerobic maintenance", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Endurance test", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 8, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Light spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 9, "focus": "Peak volume", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed intensity", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Mid-week ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Peak long ride", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 10, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Active Recovery Spin (20 min)", "description": "Pre-test", "duration_minutes": 20, "intensity": "easy"},
    {"day": 6, "workout_name": "20min FTP Test Standard Protocol", "description": "FTP assessment", "duration_minutes": 60, "intensity": "very_hard"}
  ]}
]'::jsonb
WHERE name = 'Aerobic Base Extension' AND discipline = 'cycling';

-- CYCLING BASE #4: Long Distance Prep (12 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Foundation start", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Easy base", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Base building", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Weekend ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume introduction", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base Endurance 45 min", "description": "Aerobic work", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy spin", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "First long ride", "duration_minutes": 120, "intensity": "easy"},
    {"day": 7, "workout_name": "Active Recovery Ride (30 min)", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Endurance building", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base with efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy aerobic", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Light ride", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Volume progression", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Mixed intensity", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Extended endurance", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Long ride focus", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Combined work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Mixed Terrain 3hr", "description": "Long mixed ride", "duration_minutes": 180, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Build phase", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base with efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Aerobic maintenance", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long endurance", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Active Recovery Ride (30 min)", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Recovery", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy recovery", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base Z2 (30 min)", "description": "Light spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 9, "focus": "Peak build", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed intensity", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Mid-week ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Mixed Terrain 3hr", "description": "Peak long ride", "duration_minutes": 180, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Recovery ride", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 10, "focus": "Volume consolidation", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base + 3-min Efforts (80 min)", "description": "Base efforts", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Efficiency Ride (45 min)", "description": "Easy ride", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Decoupling Test 2hr Z2", "description": "Endurance test", "duration_minutes": 120, "intensity": "moderate"}
  ]},
  {"week_number": 11, "focus": "Final build", "sessions": [
    {"day": 2, "workout_name": "Aerobic + Threshold Long Combo (70 min)", "description": "Mixed work", "duration_minutes": 70, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base Endurance 45 min", "description": "Aerobic base", "duration_minutes": 45, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Volume Ride (120 min)", "description": "Long ride", "duration_minutes": 120, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Base Endurance 45 min", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 12, "focus": "Assessment", "sessions": [
    {"day": 2, "workout_name": "Active Recovery Ride (30 min)", "description": "Easy spin", "duration_minutes": 30, "intensity": "easy"},
    {"day": 4, "workout_name": "Active Recovery Spin (20 min)", "description": "Pre-test", "duration_minutes": 20, "intensity": "easy"},
    {"day": 6, "workout_name": "60-min Steady State Test", "description": "Endurance assessment", "duration_minutes": 75, "intensity": "hard"}
  ]}
]'::jsonb
WHERE name = 'Long Distance Prep' AND discipline = 'cycling';
