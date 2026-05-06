/*
  # Seed Triathlon Program Templates
  
  Inserts 40 triathlon programs (10 per objective):
  - 10 Base/Endurance programs
  - 10 VO2max Development programs
  - 10 Threshold/Tempo programs
  - 10 Race Preparation programs
*/

-- BASE / ENDURANCE TRIATHLON PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Sprint Tri Base', 'Base multideporte para triatlón sprint. Multi-sport base for sprint triathlon.', 'base', 'triathlon', 12, 6, 'beginner', true),
('Olympic Distance Base', 'Base para distancia olímpica balanceada. Balanced Olympic distance base.', 'base', 'triathlon', 16, 8, 'intermediate', true),
('Half Ironman Base', 'Base para medio Ironman con volumen alto. Half Ironman base with high volume.', 'base', 'triathlon', 20, 9, 'advanced', true),
('Full Ironman Base', 'Base completa para Ironman full. Complete Ironman full distance base.', 'base', 'triathlon', 24, 10, 'advanced', true),
('First Triathlon Base', 'Base para primer triatlón desde cero. Base for first triathlon from scratch.', 'base', 'triathlon', 12, 5, 'beginner', false),
('Aerobic Tri Foundation', 'Fundamento aeróbico multideporte. Multi-sport aerobic foundation.', 'base', 'triathlon', 14, 7, 'intermediate', false),
('Winter Tri Base', 'Base de triatlón invernal con indoor. Winter triathlon base with indoor focus.', 'base', 'triathlon', 12, 6, 'intermediate', false),
('Long Course Base', 'Base para larga distancia balanceada. Long course balanced base building.', 'base', 'triathlon', 18, 8, 'advanced', false),
('Age Group Base', 'Base para triatletas age group. Age group triathletes base program.', 'base', 'triathlon', 16, 7, 'intermediate', false),
('Endurance Tri Build', 'Construcción de resistencia tri. Triathlon endurance building.', 'base', 'triathlon', 14, 7, 'intermediate', false);

-- VO2MAX DEVELOPMENT TRIATHLON PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Tri VO2max Builder', 'VO2max en tres disciplinas. VO2max across three disciplines.', 'vo2max', 'triathlon', 8, 8, 'intermediate', true),
('Sprint Tri Power', 'Potencia para triatlón sprint. Power for sprint triathlon racing.', 'vo2max', 'triathlon', 6, 7, 'advanced', true),
('High Intensity Tri', 'Alta intensidad multideporte. Multi-sport high intensity training.', 'vo2max', 'triathlon', 8, 8, 'advanced', false),
('Olympic Power Build', 'Construcción de potencia olímpica. Olympic distance power building.', 'vo2max', 'triathlon', 8, 9, 'advanced', false),
('VO2max Integration', 'Integración de VO2max en tres deportes. VO2max integration across three sports.', 'vo2max', 'triathlon', 6, 7, 'intermediate', false),
('Speed Development Tri', 'Desarrollo de velocidad tri. Triathlon speed development.', 'vo2max', 'triathlon', 8, 8, 'advanced', false),
('Lactate Tolerance Tri', 'Tolerancia al lactato multideporte. Multi-sport lactate tolerance.', 'vo2max', 'triathlon', 6, 7, 'advanced', false),
('Power Intervals Tri', 'Intervalos de potencia en 3 disciplinas. Power intervals across 3 disciplines.', 'vo2max', 'triathlon', 8, 8, 'intermediate', false),
('VO2max Peak Tri', 'Pico de VO2max triatlón. Triathlon VO2max peak phase.', 'vo2max', 'triathlon', 6, 8, 'advanced', false),
('Race Intensity Build', 'Construcción de intensidad de carrera. Race intensity building.', 'vo2max', 'triathlon', 8, 7, 'intermediate', false);

-- THRESHOLD / TEMPO TRIATHLON PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Tri Threshold Master', 'Dominio de umbral en tres disciplinas. Threshold mastery across three disciplines.', 'threshold', 'triathlon', 10, 8, 'intermediate', true),
('Olympic Pace Training', 'Entrenamiento a ritmo olímpico. Olympic distance pace training.', 'threshold', 'triathlon', 12, 9, 'advanced', true),
('Half IM Threshold', 'Umbral para medio Ironman. Half Ironman threshold training.', 'threshold', 'triathlon', 12, 9, 'advanced', true),
('Tempo Tri Builder', 'Construcción de tempo multideporte. Multi-sport tempo building.', 'threshold', 'triathlon', 10, 7, 'intermediate', false),
('Sustained Race Pace', 'Ritmo de carrera sostenido tri. Sustained triathlon race pace.', 'threshold', 'triathlon', 10, 8, 'advanced', false),
('Threshold Integration', 'Integración de umbral en tres deportes. Threshold integration across three sports.', 'threshold', 'triathlon', 10, 8, 'intermediate', false),
('Long Course Tempo', 'Tempo para larga distancia. Long course tempo training.', 'threshold', 'triathlon', 12, 8, 'advanced', false),
('Race Simulation', 'Simulación de carrera completa. Full race simulation training.', 'threshold', 'triathlon', 8, 8, 'intermediate', false),
('Threshold Endurance', 'Resistencia en umbral multideporte. Multi-sport threshold endurance.', 'threshold', 'triathlon', 10, 7, 'intermediate', false),
('Tri Race Pace', 'Ritmo específico de carrera tri. Triathlon specific race pace.', 'threshold', 'triathlon', 10, 8, 'advanced', false);

-- RACE PREPARATION TRIATHLON PROGRAMS (10)
INSERT INTO program_templates (name, description, objective, discipline, duration_weeks, sessions_per_week, level, is_featured) VALUES
('Sprint Tri Peak', 'Pico para triatlón sprint. Sprint triathlon peak and taper.', 'race_prep', 'triathlon', 6, 6, 'intermediate', true),
('Olympic Distance Taper', 'Taper para distancia olímpica. Olympic distance taper.', 'race_prep', 'triathlon', 4, 7, 'intermediate', false),
('Half Ironman Peak', 'Pico para medio Ironman. Half Ironman peak preparation.', 'race_prep', 'triathlon', 8, 8, 'advanced', true),
('Ironman Full Taper', 'Taper para Ironman completo. Full Ironman taper strategy.', 'race_prep', 'triathlon', 10, 7, 'advanced', true),
('First Triathlon Race', 'Primera carrera de triatlón. First triathlon race preparation.', 'race_prep', 'triathlon', 8, 6, 'beginner', false),
('Championship Tri Peak', 'Pico para campeonato tri. Championship triathlon peak.', 'race_prep', 'triathlon', 8, 9, 'advanced', false),
('Multi-Race Season', 'Temporada de múltiples carreras. Multiple race season management.', 'race_prep', 'triathlon', 12, 8, 'advanced', false),
('Long Course Taper', 'Taper para larga distancia. Long course taper protocol.', 'race_prep', 'triathlon', 6, 7, 'advanced', false),
('Age Group Championship', 'Campeonato age group. Age group championship preparation.', 'race_prep', 'triathlon', 8, 8, 'intermediate', false),
('A-Race Preparation', 'Preparación para carrera A prioritaria. A-race priority preparation.', 'race_prep', 'triathlon', 10, 9, 'advanced', false);
