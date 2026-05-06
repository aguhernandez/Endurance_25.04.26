/*
  # Populate Triathlon Program Weekly Structures

  Adds complete week-by-week training plans to triathlon program templates.
  Each week includes specific workouts from all three disciplines with progression logic.
*/

-- Sprint Triathlon Program (8 weeks, 6-8 sessions/week, intermediate)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Multi-sport foundation",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 30min Z2", "description": "Running base", "duration_minutes": 30, "intensity": "easy"},
      {"day": 2, "workout_name": "Aerobic Base 2500m", "description": "Swimming base", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Cycling base", "duration_minutes": 60, "intensity": "easy"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Run tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 6, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Bike tempo", "duration_minutes": 70, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume progression",
    "sessions": [
      {"day": 1, "workout_name": "Easy Run 45min Z2", "description": "Running endurance", "duration_minutes": 45, "intensity": "easy"},
      {"day": 2, "workout_name": "Sprint Intervals 10x100m", "description": "Swim speed", "duration_minutes": 60, "intensity": "hard"},
      {"day": 3, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Long bike", "duration_minutes": 90, "intensity": "easy"},
      {"day": 4, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
      {"day": 5, "workout_name": "VO2max Intervals 5x1000m", "description": "Run intervals", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike intensity", "duration_minutes": 80, "intensity": "hard"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery run", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Brick workouts introduction",
    "sessions": [
      {"day": 1, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 3, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
      {"day": 4, "workout_name": "Threshold 3x10min Standard", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 6, "workout_name": "Sprint Tri Brick Bike-Run", "description": "Brick workout", "duration_minutes": 90, "intensity": "hard"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy bike", "duration_minutes": 60, "intensity": "easy"},
      {"day": 6, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Race-specific intensity",
    "sessions": [
      {"day": 1, "workout_name": "Sprint Intervals 10x100m", "description": "Swim speed", "duration_minutes": 60, "intensity": "hard"},
      {"day": 2, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Run race pace", "duration_minutes": 60, "intensity": "hard"},
      {"day": 3, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
      {"day": 4, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Recovery run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 6, "workout_name": "Sprint Tri Brick Bike-Run", "description": "Race pace brick", "duration_minutes": 90, "intensity": "very_hard"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Peak training load",
    "sessions": [
      {"day": 1, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 2, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 3, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 4, "workout_name": "Threshold 2x20min Race Pace", "description": "Bike threshold", "duration_minutes": 75, "intensity": "very_hard"},
      {"day": 5, "workout_name": "VO2max Intervals 5x1000m", "description": "Run speed", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Long brick", "duration_minutes": 120, "intensity": "hard"}
    ]
  },
  {
    "week_number": 7,
    "focus": "Taper begins",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 40, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light bike tempo", "duration_minutes": 70, "intensity": "moderate"},
      {"day": 6, "workout_name": "Sprint Tri Brick Bike-Run", "description": "Final brick", "duration_minutes": 75, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 8,
    "focus": "Race week",
    "sessions": [
      {"day": 2, "workout_name": "Race Day Activation", "description": "Swim activation", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Strides and Activation", "description": "Run activation", "duration_minutes": 25, "intensity": "easy"},
      {"day": 4, "workout_name": "Openers Activation (30 min)", "description": "Bike openers", "duration_minutes": 30, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Sprint Triathlon - Multi-Sport Mastery' AND discipline = 'triathlon';

-- Olympic Distance Triathlon Program (12 weeks, 8-10 sessions/week, advanced)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Base building across all disciplines",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Run base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Bike base", "duration_minutes": 90, "intensity": "easy"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Bike tempo", "duration_minutes": 70, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume increase",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 60min Z2", "description": "Run endurance", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long bike", "duration_minutes": 120, "intensity": "moderate"},
      {"day": 4, "workout_name": "Sprint Intervals 10x100m", "description": "Swim speed", "duration_minutes": 60, "intensity": "hard"},
      {"day": 5, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike intensity", "duration_minutes": 80, "intensity": "hard"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Brick workouts and threshold",
    "sessions": [
      {"day": 1, "workout_name": "Anaerobic Threshold 6x200m", "description": "Swim threshold", "duration_minutes": 60, "intensity": "hard"},
      {"day": 2, "workout_name": "VO2max Intervals 5x1000m", "description": "Run VO2max", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 3, "workout_name": "Aerobic Endurance 3000m", "description": "Swim base", "duration_minutes": 70, "intensity": "easy"},
      {"day": 4, "workout_name": "Threshold 3x10min Standard", "description": "Bike threshold", "duration_minutes": 70, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Brick workout", "duration_minutes": 120, "intensity": "hard"},
      {"day": 7, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 50, "intensity": "easy"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy bike", "duration_minutes": 60, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 5,
    "focus": "Build phase intensity",
    "sessions": [
      {"day": 1, "workout_name": "Sprint Intervals 10x100m", "description": "Swim speed", "duration_minutes": 60, "intensity": "hard"},
      {"day": 2, "workout_name": "Threshold Run 3x2km", "description": "Run threshold", "duration_minutes": 60, "intensity": "hard"},
      {"day": 3, "workout_name": "Long Swim 3500m", "description": "Swim endurance", "duration_minutes": 80, "intensity": "moderate"},
      {"day": 4, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
      {"day": 5, "workout_name": "Easy Run 60min Z2", "description": "Recovery run", "duration_minutes": 60, "intensity": "easy"},
      {"day": 6, "workout_name": "Z2 Long Ride (150 min)", "description": "Long bike", "duration_minutes": 150, "intensity": "moderate"},
      {"day": 7, "workout_name": "Easy Run Recovery 30min", "description": "Recovery", "duration_minutes": 30, "intensity": "easy"}
    ]
  },
  {
    "week_number": 6,
    "focus": "Race-specific work",
    "sessions": [
      {"day": 1, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 2, "workout_name": "Tempo Run 2x15min", "description": "Run tempo", "duration_minutes": 60, "intensity": "moderate"},
      {"day": 3, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 4, "workout_name": "Threshold 2x20min Race Pace", "description": "Bike race pace", "duration_minutes": 75, "intensity": "very_hard"},
      {"day": 5, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Run race pace", "duration_minutes": 60, "intensity": "hard"},
      {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Race simulation", "duration_minutes": 130, "intensity": "very_hard"},
      {"day": 7, "workout_name": "Easy Recovery 1500m", "description": "Recovery swim", "duration_minutes": 40, "intensity": "easy"}
    ]
  },
  {
    "week_number": 7,
    "focus": "Peak training volume",
    "sessions": [
      {"day": 1, "workout_name": "Long Swim 4000m", "description": "Peak swim", "duration_minutes": 90, "intensity": "moderate"},
      {"day": 2, "workout_name": "VO2max Intervals 5x1000m", "description": "Run VO2max", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 3, "workout_name": "Aerobic Endurance 3000m", "description": "Swim base", "duration_minutes": 70, "intensity": "easy"},
      {"day": 4, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long bike", "duration_minutes": 120, "intensity": "moderate"},
      {"day": 5, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike sweet spot", "duration_minutes": 80, "intensity": "hard"},
      {"day": 7, "workout_name": "Easy Run 45min Z2", "description": "Recovery run", "duration_minutes": 45, "intensity": "easy"}
    ]
  },
  {
    "week_number": 8,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Easy bike", "duration_minutes": 90, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 6, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 9,
    "focus": "Race-specific sharpening",
    "sessions": [
      {"day": 1, "workout_name": "Race Pace 100m Repeats", "description": "Swim race pace", "duration_minutes": 55, "intensity": "very_hard"},
      {"day": 2, "workout_name": "5K Race Pace Intervals 5x1km", "description": "Run race pace", "duration_minutes": 60, "intensity": "hard"},
      {"day": 3, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
      {"day": 4, "workout_name": "Threshold 2x20min Race Pace", "description": "Bike threshold", "duration_minutes": 75, "intensity": "very_hard"},
      {"day": 5, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Final race sim", "duration_minutes": 120, "intensity": "very_hard"}
    ]
  },
  {
    "week_number": 10,
    "focus": "Taper begins",
    "sessions": [
      {"day": 1, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 50, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Easy run", "duration_minutes": 45, "intensity": "easy"},
      {"day": 4, "workout_name": "Tempo Endurance (2x20 min at Z3)", "description": "Light bike tempo", "duration_minutes": 70, "intensity": "moderate"},
      {"day": 6, "workout_name": "Sprint Tri Brick Bike-Run", "description": "Light brick", "duration_minutes": 75, "intensity": "moderate"}
    ]
  },
  {
    "week_number": 11,
    "focus": "Deep taper",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 40, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run Recovery 30min", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Z2 Foundation Ride (60 min)", "description": "Easy bike", "duration_minutes": 60, "intensity": "easy"},
      {"day": 6, "workout_name": "Strides and Activation", "description": "Activation", "duration_minutes": 25, "intensity": "easy"}
    ]
  },
  {
    "week_number": 12,
    "focus": "Race week",
    "sessions": [
      {"day": 2, "workout_name": "Race Day Activation", "description": "Swim activation", "duration_minutes": 30, "intensity": "easy"},
      {"day": 3, "workout_name": "Strides and Activation", "description": "Run activation", "duration_minutes": 20, "intensity": "easy"},
      {"day": 5, "workout_name": "Openers Activation (30 min)", "description": "Bike openers", "duration_minutes": 30, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Olympic Distance - Complete Triathlon' AND discipline = 'triathlon';

-- Ironman 70.3 Program (16 weeks, 8-12 sessions/week, advanced)
UPDATE program_templates
SET weekly_structure = '[
  {
    "week_number": 1,
    "focus": "Aerobic base establishment",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Base 2500m", "description": "Swim base", "duration_minutes": 60, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 45min Z2", "description": "Run base", "duration_minutes": 45, "intensity": "easy"},
      {"day": 3, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Bike base", "duration_minutes": 90, "intensity": "easy"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long bike", "duration_minutes": 120, "intensity": "moderate"},
      {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Long run", "duration_minutes": 60, "intensity": "easy"}
    ]
  },
  {
    "week_number": 2,
    "focus": "Volume progression",
    "sessions": [
      {"day": 1, "workout_name": "Aerobic Endurance 3000m", "description": "Swim endurance", "duration_minutes": 70, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 60min Z2", "description": "Run endurance", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Z2 Long Ride (150 min)", "description": "Extended bike", "duration_minutes": 150, "intensity": "moderate"},
      {"day": 4, "workout_name": "Long Swim 3500m", "description": "Swim volume", "duration_minutes": 80, "intensity": "moderate"},
      {"day": 5, "workout_name": "Tempo Run 2x10min", "description": "Run tempo", "duration_minutes": 50, "intensity": "moderate"},
      {"day": 6, "workout_name": "Sweet Spot 3x15min Classic", "description": "Bike intensity", "duration_minutes": 80, "intensity": "hard"},
      {"day": 7, "workout_name": "Long Run 75min Z2", "description": "Long run", "duration_minutes": 75, "intensity": "easy"}
    ]
  },
  {
    "week_number": 3,
    "focus": "Endurance building",
    "sessions": [
      {"day": 1, "workout_name": "Long Swim 4000m", "description": "Peak swim", "duration_minutes": 90, "intensity": "moderate"},
      {"day": 2, "workout_name": "Easy Run 60min Z2", "description": "Easy run", "duration_minutes": 60, "intensity": "easy"},
      {"day": 3, "workout_name": "Endurance-Tempo Blend (2 hr)", "description": "Long bike", "duration_minutes": 120, "intensity": "moderate"},
      {"day": 4, "workout_name": "Technique Focus 2000m", "description": "Swim technique", "duration_minutes": 55, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 25min Continuous", "description": "Run tempo", "duration_minutes": 55, "intensity": "moderate"},
      {"day": 6, "workout_name": "Olympic Distance Brick", "description": "Brick workout", "duration_minutes": 120, "intensity": "hard"},
      {"day": 7, "workout_name": "Long Run 90min Z2", "description": "Extended run", "duration_minutes": 90, "intensity": "easy"}
    ]
  },
  {
    "week_number": 4,
    "focus": "Recovery week",
    "sessions": [
      {"day": 1, "workout_name": "Easy Recovery 1500m", "description": "Easy swim", "duration_minutes": 45, "intensity": "easy"},
      {"day": 2, "workout_name": "Easy Run 30min Z2", "description": "Easy run", "duration_minutes": 30, "intensity": "easy"},
      {"day": 4, "workout_name": "Zone 2 Aerobic Endurance (90 min)", "description": "Easy bike", "duration_minutes": 90, "intensity": "easy"},
      {"day": 5, "workout_name": "Tempo Run 20min Sustained", "description": "Light tempo", "duration_minutes": 45, "intensity": "moderate"},
      {"day": 7, "workout_name": "Long Run 60min Z2", "description": "Recovery run", "duration_minutes": 60, "intensity": "easy"}
    ]
  }
]'::jsonb
WHERE name = 'Ironman 70.3 - Half Distance Prep' AND discipline = 'triathlon';
