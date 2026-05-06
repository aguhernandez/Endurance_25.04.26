/*
  # Seed Cycling Program Templates
  
  Inserts 40 cycling programs (10 per objective):
  - 10 Base/Endurance programs
  - 10 VO2max Development programs
  - 10 Threshold/Tempo programs
  - 10 Race Preparation programs
*/

-- BASE / ENDURANCE CYCLING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Base Building Foundation', 'Establece una base aeróbica sólida con volumen gradual. Build solid aerobic foundation with gradual volume increase.', 'base', 'cycling', 12, 4, 'beginner', true),
('Endurance Fundamentals', 'Desarrollo de resistencia básica con énfasis en Zona 2. Basic endurance development with Zone 2 emphasis.', 'base', 'cycling', 8, 3, 'beginner', false),
('Aerobic Base Extension', 'Extensión de capacidad aeróbica con rodadas largas. Aerobic capacity extension with long rides.', 'base', 'cycling', 16, 5, 'intermediate', true),
('Long Distance Prep', 'Preparación para eventos de larga distancia con volumen alto. Preparation for long-distance events with high volume.', 'base', 'cycling', 20, 5, 'intermediate', false),
('Winter Base Builder', 'Programa de base invernal con sesiones indoor/outdoor. Winter base program with indoor/outdoor sessions.', 'base', 'cycling', 12, 4, 'intermediate', false),
('Gran Fondo Foundation', 'Base específica para Gran Fondo con escaladas. Gran Fondo specific base with climbing focus.', 'base', 'cycling', 16, 6, 'advanced', true),
('Ultra Endurance Base', 'Base para eventos ultra con volumen extremo. Ultra event base with extreme volume.', 'base', 'cycling', 24, 6, 'advanced', false),
('Time Trial Base', 'Base aeróbica para contrarreloj con posición aero. Aerobic base for time trial with aero position work.', 'base', 'cycling', 12, 5, 'advanced', false),
('Century Ride Builder', 'Construcción progresiva hacia 100 millas. Progressive build towards 100-mile rides.', 'base', 'cycling', 14, 4, 'intermediate', false),
('Endurance Recovery', 'Reconstrucción de base post-lesión o descanso. Base rebuilding post-injury or rest period.', 'base', 'cycling', 8, 3, 'beginner', false);

-- VO2MAX DEVELOPMENT CYCLING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('VO2max Primer', 'Introducción a entrenamientos de alta intensidad. Introduction to high-intensity training.', 'vo2max', 'cycling', 6, 4, 'beginner', false),
('Power at VO2max', 'Desarrollo de potencia máxima aeróbica. Maximal aerobic power development.', 'vo2max', 'cycling', 8, 5, 'intermediate', true),
('Hill Repeat Specialist', 'Intervalos en subida para maximizar VO2max. Hill intervals to maximize VO2max.', 'vo2max', 'cycling', 6, 4, 'intermediate', false),
('Criterium Power', 'Potencia explosiva para carreras cortas tipo criterium. Explosive power for short criterium races.', 'vo2max', 'cycling', 8, 5, 'advanced', true),
('Sprint Power Developer', 'Desarrollo de sprint y potencia anaeróbica. Sprint and anaerobic power development.', 'vo2max', 'cycling', 6, 4, 'advanced', false),
('VO2max Intervals Pro', 'Intervalos avanzados de 3-8 minutos en Zona 5. Advanced 3-8 minute intervals in Zone 5.', 'vo2max', 'cycling', 10, 6, 'advanced', true),
('Climbing Power', 'Potencia en subida con intervalos largos. Climbing power with long intervals.', 'vo2max', 'cycling', 8, 5, 'intermediate', false),
('Track Cycling Power', 'Potencia específica para pista con alta intensidad. Track-specific power with high intensity.', 'vo2max', 'cycling', 6, 5, 'advanced', false),
('Aerobic Capacity Boost', 'Impulso rápido de capacidad aeróbica. Quick aerobic capacity boost.', 'vo2max', 'cycling', 4, 4, 'intermediate', false),
('VO2max Maintenance', 'Mantenimiento de VO2max durante temporada. VO2max maintenance during season.', 'vo2max', 'cycling', 6, 3, 'intermediate', false);

-- THRESHOLD / TEMPO CYCLING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('FTP Builder', 'Incrementa tu FTP con trabajo de umbral. Increase your FTP with threshold work.', 'threshold', 'cycling', 8, 4, 'beginner', true),
('Sweet Spot Specialist', 'Enfoque en zona Sweet Spot (88-94% FTP). Focus on Sweet Spot zone (88-94% FTP).', 'threshold', 'cycling', 12, 5, 'intermediate', true),
('Tempo Endurance', 'Resistencia en tempo para eventos largos. Tempo endurance for long events.', 'threshold', 'cycling', 10, 4, 'intermediate', false),
('Threshold Power Pro', 'Programa avanzado de potencia en umbral. Advanced threshold power program.', 'threshold', 'cycling', 8, 6, 'advanced', true),
('FTP Boost 20min', 'Mejora FTP con intervalos de 20 minutos. Improve FTP with 20-minute intervals.', 'threshold', 'cycling', 6, 5, 'advanced', false),
('Lactate Threshold', 'Desplaza umbral de lactato hacia arriba. Shift lactate threshold upwards.', 'threshold', 'cycling', 10, 5, 'advanced', false),
('Time Trial Threshold', 'Umbral específico para contrarreloj. Threshold specific for time trials.', 'threshold', 'cycling', 8, 5, 'intermediate', false),
('Sustainable Power', 'Potencia sostenible para eventos de resistencia. Sustainable power for endurance events.', 'threshold', 'cycling', 12, 4, 'intermediate', false),
('Threshold Intervals', 'Intervalos clásicos de umbral 2x20, 3x15. Classic threshold intervals 2x20, 3x15.', 'threshold', 'cycling', 8, 4, 'beginner', false),
('Race Pace Builder', 'Construcción de ritmo de carrera sostenible. Sustainable race pace building.', 'threshold', 'cycling', 10, 5, 'intermediate', false);

-- RACE PREPARATION CYCLING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Road Race Peak', 'Pico para carrera de ruta con intensidades mixtas. Road race peak with mixed intensities.', 'race_prep', 'cycling', 8, 5, 'intermediate', true),
('Gran Fondo Taper', 'Puesta a punto para Gran Fondo. Gran Fondo taper and peak.', 'race_prep', 'cycling', 6, 4, 'intermediate', false),
('Criterium Sharpening', 'Afilado para criteriums con alta intensidad. Criterium sharpening with high intensity.', 'race_prep', 'cycling', 4, 5, 'advanced', true),
('Time Trial Peak', 'Pico específico para contrarreloj. Time trial specific peak.', 'race_prep', 'cycling', 6, 5, 'advanced', false),
('Stage Race Prep', 'Preparación para carreras por etapas. Stage race preparation.', 'race_prep', 'cycling', 10, 6, 'advanced', true),
('Century Event Peak', 'Pico para eventos de 100 millas. Peak for 100-mile events.', 'race_prep', 'cycling', 6, 4, 'intermediate', false),
('Hill Climb Race', 'Preparación específica para subidas cronometradas. Specific prep for timed hill climbs.', 'race_prep', 'cycling', 6, 5, 'advanced', false),
('First Race Prep', 'Primera carrera - introducción a competición. First race - competition introduction.', 'race_prep', 'cycling', 8, 4, 'beginner', false),
('Multi-Day Event', 'Preparación para eventos de múltiples días. Multi-day event preparation.', 'race_prep', 'cycling', 8, 5, 'intermediate', false),
('Championship Peak', 'Pico para campeonato con taper preciso. Championship peak with precise taper.', 'race_prep', 'cycling', 8, 6, 'advanced', false);
