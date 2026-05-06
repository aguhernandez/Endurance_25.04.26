/*
  # Seed Swimming Program Templates
  
  Inserts 40 swimming programs (10 per objective):
  - 10 Base/Endurance programs
  - 10 VO2max Development programs
  - 10 Threshold/Tempo programs
  - 10 Race Preparation programs
*/

-- BASE / ENDURANCE SWIMMING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Learn to Swim Base', 'Base desde cero con técnica fundamental. Base from scratch with fundamental technique.', 'base', 'swimming', 12, 3, 'beginner', true),
('Open Water Base', 'Base para aguas abiertas con resistencia. Open water base with endurance focus.', 'base', 'swimming', 12, 4, 'intermediate', true),
('Pool Endurance', 'Resistencia en piscina con volumen alto. Pool endurance with high volume.', 'base', 'swimming', 10, 5, 'intermediate', false),
('Technique & Endurance', 'Técnica y resistencia combinadas. Technique and endurance combined.', 'base', 'swimming', 14, 4, 'beginner', false),
('Distance Swimming Base', 'Base para natación de distancia. Distance swimming base building.', 'base', 'swimming', 16, 5, 'advanced', true),
('Aerobic Capacity Pool', 'Capacidad aeróbica con series largas. Aerobic capacity with long sets.', 'base', 'swimming', 12, 5, 'intermediate', false),
('Masters Swimming Base', 'Base para nadadores masters. Masters swimmers base program.', 'base', 'swimming', 10, 4, 'intermediate', false),
('Triathlon Swim Base', 'Base de natación para triatletas. Triathlon swim base for triathletes.', 'base', 'swimming', 12, 3, 'beginner', false),
('Continuous Swimming', 'Natación continua sin paradas. Continuous swimming without stops.', 'base', 'swimming', 8, 4, 'intermediate', false),
('Winter Pool Base', 'Base invernal en piscina climatizada. Winter base in heated pool.', 'base', 'swimming', 12, 4, 'intermediate', false);

-- VO2MAX DEVELOPMENT SWIMMING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Sprint Power Swimming', 'Potencia de sprint con series cortas. Sprint power with short sets.', 'vo2max', 'swimming', 6, 4, 'intermediate', true),
('200m Specialist', 'Especialización en 200m con VO2max. 200m specialization with VO2max work.', 'vo2max', 'swimming', 8, 5, 'advanced', false),
('VO2max Sets Pool', 'Series de VO2max en piscina 100-200m. Pool VO2max sets 100-200m.', 'vo2max', 'swimming', 6, 5, 'advanced', true),
('High Intensity Swim', 'Natación de alta intensidad. High intensity swimming.', 'vo2max', 'swimming', 6, 4, 'intermediate', false),
('Speed Endurance Swim', 'Resistencia de velocidad en agua. Speed endurance in water.', 'vo2max', 'swimming', 8, 5, 'advanced', false),
('400m Power', 'Potencia para 400m con intervalos. Power for 400m with intervals.', 'vo2max', 'swimming', 8, 5, 'intermediate', false),
('Lactate Training', 'Entrenamiento de lactato en natación. Lactate training in swimming.', 'vo2max', 'swimming', 6, 4, 'advanced', false),
('Sprint Intervals', 'Intervalos de sprint 25-50m. Sprint intervals 25-50m.', 'vo2max', 'swimming', 4, 4, 'intermediate', false),
('VO2max Peak Swim', 'Pico de VO2max natación. Swimming VO2max peak.', 'vo2max', 'swimming', 6, 5, 'advanced', false),
('Race Speed Work', 'Trabajo de velocidad de carrera. Race speed work.', 'vo2max', 'swimming', 6, 4, 'advanced', false);

-- THRESHOLD / TEMPO SWIMMING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Threshold Pace Swim', 'Ritmo de umbral en natación. Threshold pace swimming.', 'threshold', 'swimming', 8, 4, 'intermediate', true),
('CSS Training', 'Entrenamiento de velocidad crítica (CSS). Critical swim speed (CSS) training.', 'threshold', 'swimming', 10, 5, 'advanced', true),
('Tempo Swimming Sets', 'Series de tempo natación. Tempo swimming sets.', 'threshold', 'swimming', 8, 4, 'intermediate', false),
('Sustained Pace', 'Ritmo sostenido con series medias. Sustained pace with medium sets.', 'threshold', 'swimming', 10, 5, 'advanced', false),
('1500m Pace Training', 'Entrenamiento a ritmo de 1500m. 1500m pace training.', 'threshold', 'swimming', 12, 5, 'advanced', false),
('Threshold Intervals', 'Intervalos de umbral 200-400m. Threshold intervals 200-400m.', 'threshold', 'swimming', 8, 4, 'intermediate', false),
('Race Pace Builder', 'Construcción de ritmo de carrera. Race pace building.', 'threshold', 'swimming', 10, 5, 'intermediate', false),
('Steady State Swim', 'Natación en estado estable. Steady state swimming.', 'threshold', 'swimming', 8, 4, 'beginner', false),
('Open Water Pace', 'Ritmo para aguas abiertas. Open water pace work.', 'threshold', 'swimming', 10, 4, 'intermediate', true),
('Cruise Pace Sets', 'Series a ritmo de crucero. Cruise pace sets.', 'threshold', 'swimming', 8, 4, 'intermediate', false);

-- RACE PREPARATION SWIMMING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Open Water Race Prep', 'Preparación para carrera de aguas abiertas. Open water race preparation.', 'race_prep', 'swimming', 6, 4, 'intermediate', true),
('Pool Competition Taper', 'Taper para competición en piscina. Pool competition taper.', 'race_prep', 'swimming', 3, 4, 'advanced', false),
('Sprint Meet Prep', 'Preparación para competición de sprint. Sprint meet preparation.', 'race_prep', 'swimming', 4, 5, 'advanced', true),
('Distance Race Peak', 'Pico para carrera de distancia. Distance race peak.', 'race_prep', 'swimming', 6, 4, 'advanced', false),
('Masters Competition', 'Competición para masters nadadores. Masters swimmers competition prep.', 'race_prep', 'swimming', 6, 4, 'intermediate', false),
('Triathlon Swim Taper', 'Taper de natación para triatlón. Triathlon swim taper.', 'race_prep', 'swimming', 3, 3, 'intermediate', true),
('Championship Swim Peak', 'Pico para campeonato de natación. Swimming championship peak.', 'race_prep', 'swimming', 4, 5, 'advanced', false),
('First Swim Meet', 'Primera competición de natación. First swim meet preparation.', 'race_prep', 'swimming', 6, 4, 'beginner', false),
('Multi-Event Taper', 'Taper para múltiples eventos. Multi-event taper strategy.', 'race_prep', 'swimming', 4, 4, 'advanced', false),
('Season Peak Swim', 'Pico de temporada natación. Season peak swimming.', 'race_prep', 'swimming', 6, 5, 'advanced', false);
