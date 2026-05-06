/*
  # Populate All Program Structures - Part 3: Swimming

  Creates complete weekly structures for one representative program
  of each objective in swimming discipline.
*/

-- SWIMMING BASE: Learn to Swim Base (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Technique foundation", "sessions": [
    {"day": 2, "workout_name": "Technique Focus 2000m", "description": "Build technique", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Aerobic Base 2500m", "description": "Aerobic conditioning", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Volume increase", "sessions": [
    {"day": 2, "workout_name": "Aerobic Base 2500m", "description": "Base building", "duration_minutes": 60, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical refinement", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Endurance 3000m", "description": "Extended swim", "duration_minutes": 70, "intensity": "easy"},
    {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Tempo introduction", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "First tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base 2500m", "description": "Aerobic maintenance", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Endurance 3000m", "description": "Long swim", "duration_minutes": 70, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Light aerobic", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Build phase", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic base", "duration_minutes": 70, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Swim 3500m", "description": "Extended swim", "duration_minutes": 80, "intensity": "moderate"},
    {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Endurance consolidation", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Sustained tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical refinement", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Long Swim 3500m", "description": "Long endurance", "duration_minutes": 80, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Peak base volume", "sessions": [
    {"day": 2, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic work", "duration_minutes": 70, "intensity": "easy"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Long Swim 4000m", "description": "Peak long swim", "duration_minutes": 90, "intensity": "moderate"},
    {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Recovery assessment", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Endurance 3000m", "description": "Assessment swim", "duration_minutes": 70, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Learn to Swim Base' AND discipline = 'swimming';

-- SWIMMING VO2MAX: 200m Specialist (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Speed introduction", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Base maintenance", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Power 8x50m", "description": "First sprint work", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base 2500m", "description": "Aerobic maintenance", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Sprint Intervals 10x100m", "description": "Sprint intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Aerobic Endurance 3000m", "description": "Endurance", "duration_minutes": 70, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Intensity progression", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Race Pace 100m Repeats", "description": "Race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Sprint Power 8x50m", "description": "Power work", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Aerobic Base 2500m", "description": "Aerobic base", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Peak speed load", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Intervals 10x100m", "description": "Sprint work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic maintenance", "duration_minutes": 70, "intensity": "easy"},
    {"day": 6, "workout_name": "Race Pace 100m Repeats", "description": "Race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Technique Focus 2000m", "description": "Technical refinement", "duration_minutes": 55, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Light aerobic", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Speed refinement", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Power 8x50m", "description": "Power development", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Aerobic Base 2500m", "description": "Aerobic base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Race Pace 100m Repeats", "description": "Race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Taper and test", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Taper swim", "duration_minutes": 40, "intensity": "easy"},
    {"day": 4, "workout_name": "Sprint Power 8x50m", "description": "Speed maintenance", "duration_minutes": 45, "intensity": "hard"},
    {"day": 6, "workout_name": "Race Day Activation", "description": "Pre-race", "duration_minutes": 30, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = '200m Specialist' AND discipline = 'swimming';

-- SWIMMING THRESHOLD: Threshold Intervals (8 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Threshold baseline", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Tempo intro", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Base 2500m", "description": "Aerobic base", "duration_minutes": 60, "intensity": "easy"},
    {"day": 6, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "Tempo development", "sessions": [
    {"day": 2, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic base", "duration_minutes": 70, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Swim 2000m", "description": "Extended tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"}
  ]},
  {"week_number": 3, "focus": "Threshold introduction", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Swim 2000m", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Endurance 3000m", "description": "Long swim", "duration_minutes": 70, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Light tempo", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Light aerobic", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Threshold progression", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Tempo maintenance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Long Swim 3500m", "description": "Long endurance", "duration_minutes": 80, "intensity": "moderate"}
  ]},
  {"week_number": 6, "focus": "Peak threshold load", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Peak threshold", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Aerobic recovery", "duration_minutes": 70, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Swim 2000m", "description": "Tempo endurance", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Long Swim 3500m", "description": "Long swim", "duration_minutes": 80, "intensity": "moderate"}
  ]},
  {"week_number": 7, "focus": "Consolidation", "sessions": [
    {"day": 2, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold intervals", "duration_minutes": 60, "intensity": "hard"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 7, "workout_name": "Aerobic Endurance 3000m", "description": "Endurance", "duration_minutes": 70, "intensity": "easy"}
  ]},
  {"week_number": 8, "focus": "Test week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Pre-test technical", "duration_minutes": 50, "intensity": "easy"},
    {"day": 6, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold test", "duration_minutes": 60, "intensity": "hard"}
  ]}
]'::jsonb
WHERE name = 'Threshold Intervals' AND discipline = 'swimming';

-- SWIMMING RACE PREP: Season Peak Swim (6 weeks)
UPDATE program_templates
SET weekly_structure = '[
  {"week_number": 1, "focus": "Race intensity intro", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Base maintenance", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Race Pace 100m Repeats", "description": "Race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Sprint Intervals 10x100m", "description": "Sprint work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Aerobic Endurance 3000m", "description": "Endurance", "duration_minutes": 70, "intensity": "easy"}
  ]},
  {"week_number": 2, "focus": "High-intensity tolerance", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Power 8x50m", "description": "Power work", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 6, "workout_name": "Race Pace 100m Repeats", "description": "Race pace", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Long Swim 3500m", "description": "Long swim", "duration_minutes": 80, "intensity": "moderate"}
  ]},
  {"week_number": 3, "focus": "Race simulation peak", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Race Pace 100m Repeats", "description": "Full race sim", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Tempo Swim 2000m", "description": "Tempo work", "duration_minutes": 60, "intensity": "moderate"},
    {"day": 6, "workout_name": "Sprint Intervals 10x100m", "description": "Sprint work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 7, "workout_name": "Aerobic Endurance 3000m", "description": "Recovery endurance", "duration_minutes": 70, "intensity": "easy"}
  ]},
  {"week_number": 4, "focus": "Recovery week", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Technical work", "duration_minutes": 55, "intensity": "easy"},
    {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Light aerobic", "duration_minutes": 60, "intensity": "easy"}
  ]},
  {"week_number": 5, "focus": "Race sharpening", "sessions": [
    {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Recovery", "duration_minutes": 45, "intensity": "easy"},
    {"day": 2, "workout_name": "Sprint Power 8x50m", "description": "Sprint sharpness", "duration_minutes": 50, "intensity": "very_hard"},
    {"day": 4, "workout_name": "Anaerobic Threshold 6x200m", "description": "Threshold work", "duration_minutes": 60, "intensity": "hard"},
    {"day": 6, "workout_name": "Race Pace 100m Repeats", "description": "Final race sim", "duration_minutes": 55, "intensity": "very_hard"},
    {"day": 7, "workout_name": "Technique Focus 2000m", "description": "Technical prep", "duration_minutes": 50, "intensity": "easy"}
  ]},
  {"week_number": 6, "focus": "Taper and race", "sessions": [
    {"day": 2, "workout_name": "Easy Recovery 1500m", "description": "Easy taper", "duration_minutes": 40, "intensity": "easy"},
    {"day": 4, "workout_name": "Sprint Power 8x50m", "description": "Race openers", "duration_minutes": 45, "intensity": "hard"},
    {"day": 6, "workout_name": "Race Day Activation", "description": "Pre-race activation", "duration_minutes": 30, "intensity": "easy"}
  ]}
]'::jsonb
WHERE name = 'Season Peak Swim' AND discipline = 'swimming';
