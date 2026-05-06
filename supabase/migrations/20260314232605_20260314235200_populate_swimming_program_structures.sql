/*
  # Populate Swimming Program Weekly Structures

  Adds complete week-by-week training plans to swimming program templates.
  Each week includes specific workouts from the library with progression logic.
*/

-- Sprint Swimming Program (6 weeks, 4-5 sessions/week, intermediate)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Technical foundation and speed introduction",
    "sessions": [
      {"day": 1, "workout_name": "Technique Focus 2000m", "description": "Drill work and technique", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Aerobic Base 2500m", "description": "Aerobic conditioning", "duration_minutes": 60, "intensity": "easy"},
      {"day": 5, "workout_name": "Sprint Power 8x50m", "description": "Speed development", "duration_minutes": 50, "intensity": "very_hard"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume and speed development",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Base building", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Sprint Intervals 10x100m", "description": "Sprint intervals", "duration_minutes": 60, "intensity": "hard"},
      {"day": 5, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
      {"day": 6, "workout_name": "Sprint Power 8x50m", "description": "Power development", "duration_minutes": 50, "intensity": "very_hard"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Lactate tolerance",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic base", "duration_minutes": 65, "intensity": "easy"},
      {"day": 3, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
      {"day": 5, "workout_name": "Race Pace 100m Repeats", "description": "Race pace", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Easy Recovery 1500m", "description": "Recovery swim", "duration_minutes": 45, "intensity": "easy"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Technique Focus 2000m", "description": "Technical refinement", "duration_minutes": 55, "intensity": "easy"},
      {"day": 5, "workout_name": "Aerobic Base 2500m", "description": "Light aerobic", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Race-specific speed",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Base maintenance", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Race Pace 100m Repeats", "description": "Race simulation", "duration_minutes": 60, "intensity": "very_hard"},
      {"day": 5, "workout_name": "Sprint Intervals 10x100m", "description": "Sprint work", "duration_minutes": 60, "intensity": "hard"},
      {"day": 6, "workout_name": "Technique Focus 2000m", "description": "Technical prep", "duration_minutes": 50, "intensity": "easy"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Taper and race",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Taper swim", "duration_minutes": 40, "intensity": "easy"},
      {"day": 3, "workout_name": "Sprint Power 8x50m", "description": "Speed maintenance", "duration_minutes": 45, "intensity": "hard"},
      {"day": 5, "workout_name": "Race Day Activation", "description": "Pre-race", "duration_minutes": 30, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Sprint Swimming - Power & Speed' AND discipline = 'swimming';

-- Open Water Swimming Program (8 weeks, 4 sessions/week, intermediate)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Endurance foundation",
    "sessions": [
      {"day": 2, "workout_name": "Aerobic Base 2500m", "description": "Base building", "duration_minutes": 60, "intensity": "easy"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
      {"day": 6, "workout_name": "Aerobic Endurance 3000m", "description": "Long swim", "duration_minutes": 70, "intensity": "easy"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume increase",
    "sessions": [
      {"day": 2, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic work", "duration_minutes": 70, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Tempo effort", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Swim 3500m", "description": "Extended swim", "duration_minutes": 80, "intensity": "moderate"},
      {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Threshold development",
    "sessions": [
      {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic base", "duration_minutes": 70, "intensity": "easy"},
      {"day": 6, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
      {"day": 7, "workout_name": "Long Swim 3500m", "description": "Long endurance", "duration_minutes": 80, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical refinement", "duration_minutes": 55, "intensity": "easy"},
      {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Light aerobic", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Endurance building",
    "sessions": [
      {"day": 2, "workout_name": "Aerobic Endurance 3000m", "description": "Base work", "duration_minutes": 70, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Tempo swim", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 6, "workout_name": "Long Swim 4000m", "description": "Peak long swim", "duration_minutes": 90, "intensity": "moderate"},
      {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Race-specific endurance",
    "sessions": [
      {"day": 2, "workout_name": "Open Water Simulation", "description": "Race simulation", "duration_minutes": 75, "intensity": "moderate"},
      {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic maintenance", "duration_minutes": 70, "intensity": "easy"},
      {"day": 6, "workout_name": "Long Swim 3500m", "description": "Long swim", "duration_minutes": 80, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 7,
    "focus": "Final preparations",
    "sessions": [
      {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 4, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
      {"day": 6, "workout_name": "Open Water Simulation", "description": "Final race sim", "duration_minutes": 70, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 8,
    "focus": "Taper and race",
    "sessions": [
      {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Taper", "duration_minutes": 40, "intensity": "easy"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical refinement", "duration_minutes": 50, "intensity": "easy"},
      {"day": 6, "workout_name": "Race Day Activation", "description": "Pre-race activation", "duration_minutes": 30, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Open Water Swimming - Distance Prep' AND discipline = 'swimming';
