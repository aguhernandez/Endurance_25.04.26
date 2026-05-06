/*
  # Seed Running Program Templates
  
  Inserts 40 running programs (10 per objective):
  - 10 Base/Endurance programs
  - 10 VO2max Development programs
  - 10 Threshold/Tempo programs
  - 10 Race Preparation programs
*/

-- BASE / ENDURANCE RUNNING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Couch to 5K Base', 'Construye base desde cero con walk/run. Build base from scratch with walk/run progression.', 'base', 'running', 8, 3, 'beginner', true),
('Marathon Base Builder', 'Base aeróbica para maratón con kilometraje alto. Aerobic base for marathon with high mileage.', 'base', 'running', 16, 5, 'intermediate', true),
('Easy Running Foundation', 'Fundamentos de carrera fácil y aeróbica. Easy running and aerobic fundamentals.', 'base', 'running', 12, 4, 'beginner', false),
('Ultra Running Base', 'Base extrema para ultras con volumen progresivo. Extreme base for ultras with progressive volume.', 'base', 'running', 20, 6, 'advanced', true),
('Half Marathon Foundation', 'Base específica para medio maratón. Half marathon specific base building.', 'base', 'running', 12, 4, 'intermediate', false),
('Trail Running Base', 'Base para trail con desnivel y técnica. Trail base with elevation and technique.', 'base', 'running', 14, 5, 'intermediate', false),
('Recovery Base Build', 'Reconstrucción de base post-lesión. Base rebuilding post-injury.', 'base', 'running', 8, 3, 'beginner', false),
('Long Slow Distance', 'Enfoque en distancia larga lenta (LSD). Long slow distance (LSD) focus.', 'base', 'running', 12, 4, 'intermediate', false),
('Aerobic Endurance Pro', 'Resistencia aeróbica avanzada con alto volumen. Advanced aerobic endurance with high volume.', 'base', 'running', 16, 6, 'advanced', false),
('Winter Base Running', 'Base invernal con adaptación al frío. Winter base with cold adaptation.', 'base', 'running', 10, 4, 'intermediate', false);

-- VO2MAX DEVELOPMENT RUNNING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('5K Speed Builder', 'Velocidad específica para 5K con intervalos. 5K specific speed with intervals.', 'vo2max', 'running', 8, 4, 'intermediate', true),
('VO2max Intervals', 'Intervalos clásicos de 3-5 minutos en Z5. Classic 3-5 minute intervals in Z5.', 'vo2max', 'running', 6, 4, 'intermediate', false),
('Track Speed Work', 'Trabajo de velocidad en pista 400m-1200m. Track speed work 400m-1200m.', 'vo2max', 'running', 8, 5, 'advanced', true),
('Hill Sprints Power', 'Sprints en subida para potencia máxima. Hill sprints for maximum power.', 'vo2max', 'running', 6, 4, 'advanced', false),
('Mile Repeat Specialist', 'Repeticiones de milla para VO2max. Mile repeats for VO2max development.', 'vo2max', 'running', 8, 5, 'advanced', false),
('Speed Endurance', 'Resistencia de velocidad con intervalos largos. Speed endurance with long intervals.', 'vo2max', 'running', 6, 4, 'intermediate', false),
('10K Power', 'Potencia aeróbica para 10K. Aerobic power for 10K racing.', 'vo2max', 'running', 8, 5, 'intermediate', true),
('Fartlek Training', 'Entrenamiento Fartlek con cambios de ritmo. Fartlek training with pace changes.', 'vo2max', 'running', 6, 3, 'beginner', false),
('Explosive Speed', 'Velocidad explosiva con sprints cortos. Explosive speed with short sprints.', 'vo2max', 'running', 4, 4, 'advanced', false),
('VO2max Peak', 'Pico de VO2max antes de fase de umbral. VO2max peak before threshold phase.', 'vo2max', 'running', 6, 5, 'advanced', false);

-- THRESHOLD / TEMPO RUNNING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Tempo Run Master', 'Domina el tempo run en zona de umbral. Master the tempo run at threshold pace.', 'threshold', 'running', 8, 4, 'intermediate', true),
('Lactate Threshold Builder', 'Construcción de umbral de lactato. Lactate threshold building.', 'threshold', 'running', 10, 5, 'intermediate', false),
('Marathon Pace Training', 'Entrenamiento a ritmo de maratón. Marathon pace training.', 'threshold', 'running', 12, 5, 'advanced', true),
('Cruise Intervals', 'Intervalos de crucero en umbral. Cruise intervals at threshold.', 'threshold', 'running', 8, 4, 'intermediate', false),
('Half Marathon Pace', 'Ritmo específico de medio maratón. Half marathon specific pace.', 'threshold', 'running', 10, 5, 'intermediate', true),
('Sustained Threshold', 'Umbral sostenido con bloques largos. Sustained threshold with long blocks.', 'threshold', 'running', 8, 5, 'advanced', false),
('Tempo Progression', 'Progresión de tempo con incrementos. Tempo progression with increments.', 'threshold', 'running', 6, 4, 'beginner', false),
('Race Pace Simulation', 'Simulación de ritmo de carrera. Race pace simulation training.', 'threshold', 'running', 8, 5, 'advanced', false),
('Threshold Maintenance', 'Mantenimiento de umbral durante base. Threshold maintenance during base.', 'threshold', 'running', 12, 3, 'intermediate', false),
('Progressive Tempo', 'Tempo progresivo de lento a rápido. Progressive tempo from slow to fast.', 'threshold', 'running', 6, 4, 'intermediate', false);

-- RACE PREPARATION RUNNING PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Marathon Taper Peak', 'Taper y pico para maratón. Marathon taper and peak.', 'race_prep', 'running', 3, 4, 'intermediate', true),
('5K Race Sharpening', 'Afilado para 5K con intensidad alta. 5K sharpening with high intensity.', 'race_prep', 'running', 4, 4, 'intermediate', false),
('Half Marathon Peak', 'Pico específico para medio maratón. Half marathon specific peak.', 'race_prep', 'running', 6, 5, 'intermediate', true),
('10K Competition Prep', 'Preparación de competición 10K. 10K competition preparation.', 'race_prep', 'running', 6, 5, 'advanced', false),
('Ultra Marathon Taper', 'Taper para ultra con recuperación. Ultra taper with recovery focus.', 'race_prep', 'running', 4, 4, 'advanced', true),
('Track Meet Prep', 'Preparación para competición en pista. Track meet preparation.', 'race_prep', 'running', 4, 5, 'advanced', false),
('First Marathon', 'Primer maratón - enfoque conservador. First marathon - conservative approach.', 'race_prep', 'running', 18, 5, 'intermediate', false),
('Trail Race Peak', 'Pico para carrera de trail. Trail race peak.', 'race_prep', 'running', 6, 5, 'advanced', false),
('Road Race Season', 'Temporada de carreras de ruta múltiples. Multiple road race season.', 'race_prep', 'running', 12, 6, 'advanced', false),
('Championship Taper', 'Taper preciso para campeonato. Precise championship taper.', 'race_prep', 'running', 3, 4, 'advanced', false);
