/*
  # Running Library — Extended Scientific Collection

  ## Summary
  Adds 130+ structured running workouts based on:
  - Daniels Running Formula (VDOT zones: E, M, T, I, R)
  - Lydiard periodization
  - Bompa training periodization
  - Billat VO2max running research
  - Canova marathon methodology
  - Pfitzinger advanced marathon programs
  - Wisloff / Norwegian method for running

  ## Categories
  Easy/recovery, aerobic base, tempo, threshold, VO2max/speed, anaerobic,
  hills, race-specific, technique/drills, testing

  ## HR Zone Reference (Karvonen HRR)
  Z1 <50% HRR | Z2 50-60% | Z3 60-70% | Z4 70-85% | Z5 >85% HRR
*/

DO $$
DECLARE w uuid;
BEGIN

-- ==================================================================
-- EASY / AEROBIC BASE (20 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Run (30 min) — E-pace Daniels','30-minute easy run at Daniels E-pace (HRR Z1-Z2). Conversational intensity. Primary recovery and aerobic base maintenance tool.','hr','endurance','easy',true,30,15,ARRAY['easy','E-pace','daniels','30min'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',1800,'hr',2),(w,2,'cooldown','time',60,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Run (45 min)','45-minute aerobic base run at comfortable conversational pace (HRR Z2). Primary aerobic endurance stimulus.','hr','endurance','easy',true,45,22,ARRAY['easy','base','45min','hrr'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2100,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Medium-Long Run (75 min)','75-minute aerobic development run at Z2. Bridge between standard long run and easy days. Pfitzinger staple for marathon training.','hr','endurance','moderate',true,75,52,ARRAY['medium-long','75min','z2','pfitzinger'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',4200,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run (105 min)','105-minute aerobic long run at Z2. Builds mitochondrial density and fat oxidation. Foundation session for marathon runners.','hr','endurance','moderate',true,105,74,ARRAY['long','105min','z2','marathon-prep'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',6000,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run with Finish Surge (90 min)','90-minute long run finishing with 10-minute Z3 surge. Teaches running at marathon effort from a fatigued state. Pfitzinger marathon-specific adaptation.','hr','endurance','moderate',true,90,68,ARRAY['long-run','finish-surge','90min','marathon'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',4200,'hr',2),(w,3,'steady','time',600,'hr',3),(w,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run 120 min (Lydiard Base)','Two-hour Lydiard aerobic conditioning run. High-volume stimulus for capillarization and mitochondrial proliferation. Central to Lydiard base-building.','hr','endurance','hard',true,120,84,ARRAY['lydiard','long','120min','base-building'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',6900,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy + Strides (50 min)','50-minute easy run with 6x20-second strides at end. Classic training day for maintaining speed economy without metabolic stress.','hr','endurance','easy',true,50,28,ARRAY['easy','strides','6x20s','economy'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2400,'hr',2),(w,3,'interval','time',20,'pace',5),(w,4,'recovery','time',40,'hr',1),(w,5,'interval','time',20,'pace',5),(w,6,'recovery','time',40,'hr',1),(w,7,'interval','time',20,'pace',5),(w,8,'recovery','time',40,'hr',1),(w,9,'interval','time',20,'pace',5),(w,10,'recovery','time',40,'hr',1),(w,11,'interval','time',20,'pace',5),(w,12,'recovery','time',40,'hr',1),(w,13,'interval','time',20,'pace',5),(w,14,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Base Run with Accelerations (60 min)','60-minute base run with 8x10-second accelerations. Builds general aerobic capacity while maintaining neuromuscular freshness.','hr','endurance','easy',true,60,35,ARRAY['base','accelerations','60min','z2'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',600,'hr',2),(w,3,'interval','time',10,'pace',5),(w,4,'steady','time',490,'hr',2),(w,5,'interval','time',10,'pace',5),(w,6,'steady','time',490,'hr',2),(w,7,'interval','time',10,'pace',5),(w,8,'steady','time',490,'hr',2),(w,9,'interval','time',10,'pace',5),(w,10,'steady','time',490,'hr',2),(w,11,'interval','time',10,'pace',5),(w,12,'steady','time',490,'hr',2),(w,13,'interval','time',10,'pace',5),(w,14,'steady','time',490,'hr',2),(w,15,'interval','time',10,'pace',5),(w,16,'steady','time',490,'hr',2),(w,17,'interval','time',10,'pace',5),(w,18,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Development Run (55 min, mid-Z2)','55 minutes firmly in the middle of HRR Z2. Trains cardiovascular drift management and metabolic efficiency at key aerobic stimulus zone.','hr','endurance','easy',true,55,30,ARRAY['aerobic','development','mid-z2','55min'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2700,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Extensive Aerobic Run (3 hr) — Ultra Base','Three-hour ultra-endurance base run for trail and ultra runners. Maximum aerobic volume session for glycolytic-to-oxidative enzyme development and tendon conditioning.','hr','endurance','very_hard',true,180,126,ARRAY['ultra','long','180min','trail','lydiard'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',10200,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Recovery Jog (20 min)','Very easy 20-minute recovery jog strictly below 50% HRR. Post-hard session blood flow facilitation and muscle repair stimulus.','hr','recovery','easy',true,20,8,ARRAY['recovery','20min','z1','jog'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',1200,'hr',1),(w,2,'cooldown','time',60,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Progression Run — E to M Pace (60 min)','60-minute progression from easy (Z2) to marathon pace (Z3) in 15-minute blocks. Trains pace control and metabolic transition.','hr','endurance','moderate',true,60,48,ARRAY['progression','E-to-M','60min','marathon-pace'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',900,'hr',2),(w,3,'steady','time',900,'hr',3),(w,4,'steady','time',900,'hr',3),(w,5,'steady','time',600,'hr',4),(w,6,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hilly Easy Run (60 min)','60-minute easy effort on hilly terrain. Natural HR variation from terrain provides aerobic variation without structured interval work.','hr','endurance','moderate',true,60,38,ARRAY['hills','easy','terrain','60min'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2400,'hr',2),(w,3,'steady','time',600,'hr',3),(w,4,'steady','time',900,'hr',2),(w,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Pre-Race Easy Run (30 min, day before race)','30-minute easy shakeout the day before competition. Maintains neuromuscular readiness without adding fatigue. Strict HR Z1.','hr','recovery','easy',true,30,12,ARRAY['pre-race','shakeout','day-before','z1'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',1800,'hr',1),(w,2,'cooldown','time',60,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Base (70 min mid-week)','Standard mid-week aerobic maintenance run. Balances weekly training stress with sufficient aerobic stimulus.','hr','endurance','easy',true,70,42,ARRAY['mid-week','base','70min','z2'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',3600,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Mountain Trail Long Run (150 min)','2.5-hour trail run on varied terrain. Incorporates natural elevation changes. HR Z2 effort-based rather than pace-based due to trail conditions.','hr','endurance','hard',true,150,100,ARRAY['trail','mountain','long','150min'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',8400,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','General Aerobic Run (Pfitzinger 10-14 mi)','General aerobic run at 70-81% HRR max. Pfitzinger''s General Aerobic category between Easy and Lactate Threshold in intensity.','hr','endurance','moderate',true,80,60,ARRAY['general-aerobic','pfitzinger','80min','z2-z3'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',3000,'hr',2),(w,3,'steady','time',1200,'hr',3),(w,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Base Building Run with Marathon Segments (90 min)','Long run with 3x15-min marathon-pace segments inserted after 30 minutes of easy running. Trains metabolic transition and marathon-specific conditioning from a fresh state.','hr','endurance','hard',true,90,72,ARRAY['base','marathon-segments','90min','specific'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',1800,'hr',2),(w,3,'steady','time',900,'hr',3),(w,4,'steady','time',600,'hr',2),(w,5,'steady','time',900,'hr',3),(w,6,'steady','time',600,'hr',2),(w,7,'steady','time',900,'hr',3),(w,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Post-Race Recovery Run (40 min)','40-minute recovery jog 24-48 hours after competition. Gentle aerobic restoration without tissue damage risk.','hr','recovery','easy',true,40,18,ARRAY['post-race','recovery','40min','z1'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',2400,'hr',1),(w,2,'cooldown','time',60,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Back-to-Back Long Run Day 2 (90 min)','Second day of back-to-back long runs. Slightly elevated fatigue from previous day allows training of fat oxidation under glycogen-depleted conditions. Bompa accumulation method.','hr','endurance','hard',true,90,62,ARRAY['back-to-back','long','day2','glycogen-depleted'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',5100,'hr',2),(w,3,'cooldown','time',300,'hr',1);

-- ==================================================================
-- TEMPO / THRESHOLD (25 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Run 20 min Continuous','Classic 20-minute continuous tempo run at LTHR (HRR Z4). Fundamental threshold development. Daniels T-pace.','hr','threshold','moderate',true,40,42,ARRAY['tempo','20min','continuous','T-pace','daniels'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',1200,'hr',4),(w,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Run 30 min Continuous','30-minute continuous tempo run at LTHR. Builds threshold duration tolerance.','hr','threshold','hard',true,50,55,ARRAY['tempo','30min','continuous','threshold'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',1800,'hr',4),(w,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Run 40 min Continuous','40-minute threshold run. Advanced tempo development for competitive athletes.','hr','threshold','very_hard',true,60,66,ARRAY['tempo','40min','advanced','threshold'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',2400,'hr',4),(w,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Cruise Intervals 3x10 min','Three 10-minute tempo intervals with 2-minute jog recoveries. Allows higher total threshold volume than single continuous tempo.','hr','threshold','moderate',true,60,62,ARRAY['cruise','3x10','threshold','intervals'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',600,'hr',4),(w,3,'recovery','time',120,'hr',2),(w,4,'interval','time',600,'hr',4),(w,5,'recovery','time',120,'hr',2),(w,6,'interval','time',600,'hr',4),(w,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Cruise Intervals 4x6 min','Four shorter 6-minute cruise intervals. Introduces threshold training to developing athletes. High quality maintained due to shorter durations.','hr','threshold','moderate',true,55,55,ARRAY['cruise','4x6','threshold','entry-level'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',360,'hr',4),(w,3,'recovery','time',90,'hr',2),(w,4,'interval','time',360,'hr',4),(w,5,'recovery','time',90,'hr',2),(w,6,'interval','time',360,'hr',4),(w,7,'recovery','time',90,'hr',2),(w,8,'interval','time',360,'hr',4),(w,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Cruise Intervals 6x5 min','Six 5-minute threshold intervals with 1-min rest. Higher repetition count for greater total threshold volume.','hr','threshold','hard',true,65,68,ARRAY['cruise','6x5','threshold','volume'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',300,'hr',4),(w,3,'recovery','time',60,'hr',2),(w,4,'interval','time',300,'hr',4),(w,5,'recovery','time',60,'hr',2),(w,6,'interval','time',300,'hr',4),(w,7,'recovery','time',60,'hr',2),(w,8,'interval','time',300,'hr',4),(w,9,'recovery','time',60,'hr',2),(w,10,'interval','time',300,'hr',4),(w,11,'recovery','time',60,'hr',2),(w,12,'interval','time',300,'hr',4),(w,13,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Broken Tempo 3x15 min (Pfitzinger LT)','Pfitzinger lactate threshold run: 3x15 min at LT pace (top of Z3 to low Z4). Builds lactate clearance capacity with accumulated volume.','hr','threshold','hard',true,75,75,ARRAY['pfitzinger','LT','3x15','lactate-threshold'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',900,'hr',4),(w,3,'recovery','time',180,'hr',2),(w,4,'interval','time',900,'hr',4),(w,5,'recovery','time',180,'hr',2),(w,6,'interval','time',900,'hr',4),(w,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo + Endurance Combo (90 min)','20-minute tempo sandwiched within 90-minute long run. Teaches threshold running from a pre-fatigued state. Pfitzinger''s LT + long combination.','hr','threshold','hard',true,90,78,ARRAY['tempo-within-long','90min','pfitzinger','combination'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2400,'hr',2),(w,3,'interval','time',1200,'hr',4),(w,4,'steady','time',1500,'hr',2),(w,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Marathon Pace Intervals 4x3 km','Four 3-kilometer efforts at marathon goal pace (HRR mid-Z3). Classical marathon-specific conditioning work. Canova marathon specificity phase.','hr','threshold','moderate',true,65,58,ARRAY['marathon-pace','4x3km','canova','specific'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',720,'hr',3),(w,3,'recovery','time',120,'hr',2),(w,4,'interval','time',720,'hr',3),(w,5,'recovery','time',120,'hr',2),(w,6,'interval','time',720,'hr',3),(w,7,'recovery','time',120,'hr',2),(w,8,'interval','time',720,'hr',3),(w,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Marathon Pace Long Run (16 km at MP)','Long run with 16-kilometer middle section at marathon pace. Canova race-specificity block for marathon peak phase.','hr','threshold','hard',true,100,85,ARRAY['marathon-pace','16km','canova','peak-phase'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',4800,'hr',3),(w,3,'cooldown','time',600,'hr',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Half Marathon Specific Run 5x2km','Five 2-kilometer efforts at half marathon goal pace (high Z3/low Z4). Race-specific conditioning for half marathon distance.','hr','threshold','hard',true,65,65,ARRAY['half-marathon','specific','5x2km','race-pace'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',480,'hr',4),(w,3,'recovery','time',150,'hr',2),(w,4,'interval','time',480,'hr',4),(w,5,'recovery','time',150,'hr',2),(w,6,'interval','time',480,'hr',4),(w,7,'recovery','time',150,'hr',2),(w,8,'interval','time',480,'hr',4),(w,9,'recovery','time',150,'hr',2),(w,10,'interval','time',480,'hr',4),(w,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Accumulation 2x20 min','Two 20-minute threshold intervals with 5-minute jog recovery. High threshold volume for trained athletes. Advanced Daniels T-pace protocol.','hr','threshold','very_hard',true,60,70,ARRAY['threshold','2x20','advanced','high-volume'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',1200,'hr',4),(w,3,'recovery','time',300,'hr',2),(w,4,'interval','time',1200,'hr',4),(w,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Descending Tempo 30/20/10 min','Three tempo blocks with descending durations: 30, 20, 10 minutes. Trains pacing under progressive fatigue with each effort at increasing relative intensity.','hr','threshold','very_hard',true,90,82,ARRAY['descending','tempo','30-20-10','fatigue'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',1800,'hr',4),(w,3,'recovery','time',300,'hr',2),(w,4,'interval','time',1200,'hr',4),(w,5,'recovery','time',240,'hr',2),(w,6,'interval','time',600,'hr',4),(w,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','10km Race Pace Intervals 5x1 km','Five 1-kilometer repetitions at 10km race goal pace (high Z4). Race-specific conditioning and lactate tolerance.','hr','threshold','hard',true,55,58,ARRAY['10km','race-pace','5x1km','specific'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',240,'hr',4),(w,3,'recovery','time',120,'hr',2),(w,4,'interval','time',240,'hr',4),(w,5,'recovery','time',120,'hr',2),(w,6,'interval','time',240,'hr',4),(w,7,'recovery','time',120,'hr',2),(w,8,'interval','time',240,'hr',4),(w,9,'recovery','time',120,'hr',2),(w,10,'interval','time',240,'hr',4),(w,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Ladder 5/10/15/10/5 min','Ascending then descending threshold ladder. Trains ability to execute threshold pacing across varied durations under fatigue.','hr','threshold','hard',true,75,72,ARRAY['threshold','ladder','pyramid','5-10-15'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',300,'hr',4),(w,3,'recovery','time',120,'hr',2),(w,4,'interval','time',600,'hr',4),(w,5,'recovery','time',180,'hr',2),(w,6,'interval','time',900,'hr',4),(w,7,'recovery','time',180,'hr',2),(w,8,'interval','time',600,'hr',4),(w,9,'recovery','time',120,'hr',2),(w,10,'interval','time',300,'hr',4),(w,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Continuous Threshold to Aerobic Transition','Start at threshold (Z4), gradually let HR drift down to Z2 over 30 minutes. Reverse of progression run; trains pace control during fatigue.','hr','threshold','hard',true,55,55,ARRAY['threshold-to-aerobic','transition','drift','pacing'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',600,'hr',4),(w,3,'steady','time',600,'hr',4),(w,4,'steady','time',600,'hr',3),(w,5,'steady','time',600,'hr',3),(w,6,'steady','time',600,'hr',2),(w,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Fartlek 12x1 min','Twelve 1-minute threshold efforts with 1-minute easy jog between each. Accumulates threshold work with rapid on-off pattern improving lactate shuttle efficiency.','hr','threshold','hard',true,45,50,ARRAY['fartlek','threshold','12x1min','lactate-shuttle'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',60,'hr',4),(w,3,'recovery','time',60,'hr',2),(w,4,'interval','time',60,'hr',4),(w,5,'recovery','time',60,'hr',2),(w,6,'interval','time',60,'hr',4),(w,7,'recovery','time',60,'hr',2),(w,8,'interval','time',60,'hr',4),(w,9,'recovery','time',60,'hr',2),(w,10,'interval','time',60,'hr',4),(w,11,'recovery','time',60,'hr',2),(w,12,'interval','time',60,'hr',4),(w,13,'recovery','time',60,'hr',2),(w,14,'interval','time',60,'hr',4),(w,15,'recovery','time',60,'hr',2),(w,16,'interval','time',60,'hr',4),(w,17,'recovery','time',60,'hr',2),(w,18,'interval','time',60,'hr',4),(w,19,'recovery','time',60,'hr',2),(w,20,'interval','time',60,'hr',4),(w,21,'recovery','time',60,'hr',2),(w,22,'interval','time',60,'hr',4),(w,23,'recovery','time',60,'hr',2),(w,24,'interval','time',60,'hr',4),(w,25,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Race Simulation 10 km at Threshold','Full 10-kilometer race simulation at threshold effort. Psychologically and physiologically mimics competition conditions. Used 2-3 weeks before target race.','hr','threshold','very_hard',true,55,65,ARRAY['race-simulation','10km','threshold','competition'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',2400,'hr',4),(w,3,'interval','time',300,'hr',5),(w,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Progressive Tempo 5+10+15 min','Progressive threshold blocks ascending in duration: 5, then 10, then 15 minutes with equal recovery. Teaches pacing under ascending fatigue.','hr','threshold','hard',true,65,65,ARRAY['progressive','5-10-15','threshold','ascending'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',300,'hr',4),(w,3,'recovery','time',300,'hr',2),(w,4,'interval','time',600,'hr',4),(w,5,'recovery','time',300,'hr',2),(w,6,'interval','time',900,'hr',4),(w,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Steady-State Threshold Run (60 min)','60-minute steady-state run at the boundary of Z3-Z4. Maximum aerobic steady state. Equivalent to marathon pace for highly trained runners.','hr','threshold','very_hard',true,70,72,ARRAY['steady-state','60min','MLSS','threshold'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',3600,'hr',4),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Negative Split Marathon-Pace Run (60 min)','60-minute run beginning at marathon pace and progressing to slightly faster over the second half. Trains negative-split race strategy and glycolytic reserve management.','hr','threshold','hard',true,60,65,ARRAY['negative-split','marathon','60min','race-strategy'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',1800,'hr',3),(w,3,'steady','time',900,'hr',4),(w,4,'interval','time',300,'hr',4),(w,5,'cooldown','time',300,'hr',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Rolling Hills Tempo (45 min)','Tempo effort on rolling course. Natural power variation from terrain trains force development and HR management. More specific to cross-country and trail racing.','hr','threshold','moderate',true,55,55,ARRAY['rolling-hills','tempo','terrain','cross-country'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',2400,'hr',4),(w,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Block Periodization — Build Week','Threshold-heavy week simulation: 3 threshold sessions in 3 days with easy between. Bompa intensification block for competition preparation.','hr','threshold','very_hard',true,55,60,ARRAY['threshold','periodization','block','intensification'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',600,'hr',4),(w,3,'recovery','time',180,'hr',2),(w,4,'interval','time',600,'hr',4),(w,5,'recovery','time',180,'hr',2),(w,6,'interval','time',600,'hr',4),(w,7,'cooldown','time',600,'hr',1);

-- ==================================================================
-- VO2MAX / INTERVAL (20 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Intervals 5x1000 m (Daniels I-pace)','Five 1000m repetitions at Daniels I-pace (VO2max pace). Classic interval training session from Running Formula.','pace','vo2max','very_hard',true,55,62,ARRAY['vo2max','1000m','I-pace','daniels'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',240,'pace',5),(w,3,'recovery','time',180,'pace',1),(w,4,'interval','time',240,'pace',5),(w,5,'recovery','time',180,'pace',1),(w,6,'interval','time',240,'pace',5),(w,7,'recovery','time',180,'pace',1),(w,8,'interval','time',240,'pace',5),(w,9,'recovery','time',180,'pace',1),(w,10,'interval','time',240,'pace',5),(w,11,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Intervals 3x1200 m','Three 1200m efforts at VO2max intensity (Z5). Classic VDOT interval length maximizing oxygen consumption stimulus.','pace','vo2max','hard',true,45,50,ARRAY['vo2max','1200m','3x','I-pace'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',290,'pace',5),(w,3,'recovery','time',290,'pace',1),(w,4,'interval','time',290,'pace',5),(w,5,'recovery','time',290,'pace',1),(w,6,'interval','time',290,'pace',5),(w,7,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Billat VO2max 30/30 Running','30s at VO2max pace / 30s at recovery jog (50% VO2max). Maximizes time at VO2max. Billat 2001 landmark protocol for endurance runners.','hr','vo2max','hard',true,40,46,ARRAY['billat','30-30','vo2max','MAS'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',30,'hr',5),(w,3,'recovery','time',30,'hr',2),(w,4,'interval','time',30,'hr',5),(w,5,'recovery','time',30,'hr',2),(w,6,'interval','time',30,'hr',5),(w,7,'recovery','time',30,'hr',2),(w,8,'interval','time',30,'hr',5),(w,9,'recovery','time',30,'hr',2),(w,10,'interval','time',30,'hr',5),(w,11,'recovery','time',30,'hr',2),(w,12,'interval','time',30,'hr',5),(w,13,'recovery','time',30,'hr',2),(w,14,'interval','time',30,'hr',5),(w,15,'recovery','time',30,'hr',2),(w,16,'interval','time',30,'hr',5),(w,17,'recovery','time',30,'hr',2),(w,18,'interval','time',30,'hr',5),(w,19,'recovery','time',30,'hr',2),(w,20,'interval','time',30,'hr',5),(w,21,'recovery','time',30,'hr',2),(w,22,'interval','time',30,'hr',5),(w,23,'recovery','time',30,'hr',2),(w,24,'interval','time',30,'hr',5),(w,25,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Norwegian 4x4 Interval Running','Four 4-minute intervals at 90-95% HRmax (HRR Z5) with 3-minute active recovery jogs. Wisloff et al. 2007 — highest VO2max stimulus per minute.','hr','vo2max','very_hard',true,45,55,ARRAY['norwegian','4x4','vo2max','wisloff'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',240,'hr',5),(w,3,'recovery','time',180,'hr',2),(w,4,'interval','time',240,'hr',5),(w,5,'recovery','time',180,'hr',2),(w,6,'interval','time',240,'hr',5),(w,7,'recovery','time',180,'hr',2),(w,8,'interval','time',240,'hr',5),(w,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Long Intervals 3x2 km','Three 2-kilometer efforts at VO2max pace with 3-minute jog recovery. Maximizes total VO2max time exposure per session. Daniels I-pace.','pace','vo2max','very_hard',true,50,60,ARRAY['vo2max','2km','3x','long-intervals'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',480,'pace',5),(w,3,'recovery','time',180,'pace',1),(w,4,'interval','time',480,'pace',5),(w,5,'recovery','time',180,'pace',1),(w,6,'interval','time',480,'pace',5),(w,7,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','MAS Tolerance 5x3 min','Five 3-minute efforts at maximal aerobic speed (MAS/vVO2max). Targets time at 100% VO2max. Billat and Koralsztein landmark MAS training protocol.','hr','vo2max','very_hard',true,50,60,ARRAY['MAS','vVO2max','5x3','billat'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',180,'hr',5),(w,3,'recovery','time',180,'hr',2),(w,4,'interval','time',180,'hr',5),(w,5,'recovery','time',180,'hr',2),(w,6,'interval','time',180,'hr',5),(w,7,'recovery','time',180,'hr',2),(w,8,'interval','time',180,'hr',5),(w,9,'recovery','time',180,'hr',2),(w,10,'interval','time',180,'hr',5),(w,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Interval Pyramid 400/600/800/1000/800/600/400 m','Classic VDOT interval pyramid from Daniels. Progressive distance building then descending with equal recovery ratios.','pace','vo2max','very_hard',true,55,62,ARRAY['pyramid','intervals','vdot','daniels'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',90,'pace',5),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',135,'pace',5),(w,5,'recovery','time',135,'pace',1),(w,6,'interval','time',185,'pace',5),(w,7,'recovery','time',185,'pace',1),(w,8,'interval','time',240,'pace',5),(w,9,'recovery','time',240,'pace',1),(w,10,'interval','time',185,'pace',5),(w,11,'recovery','time',185,'pace',1),(w,12,'interval','time',135,'pace',5),(w,13,'recovery','time',135,'pace',1),(w,14,'interval','time',90,'pace',5),(w,15,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','5x5 min VO2max (Seiler Running)','Five 5-minute VO2max intervals with 2.5-minute passive or active rest. Seiler polarized high-intensity running adaptation. Excellent for distance runners.','hr','vo2max','very_hard',true,65,75,ARRAY['seiler','5x5','vo2max','polarized'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',300,'hr',5),(w,3,'recovery','time',150,'hr',2),(w,4,'interval','time',300,'hr',5),(w,5,'recovery','time',150,'hr',2),(w,6,'interval','time',300,'hr',5),(w,7,'recovery','time',150,'hr',2),(w,8,'interval','time',300,'hr',5),(w,9,'recovery','time',150,'hr',2),(w,10,'interval','time',300,'hr',5),(w,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Track 200m Repeats x16 (R-pace)','Sixteen 200m repetitions at Daniels R-pace (5km or faster). High repetition speed work improving running economy and neuromuscular efficiency.','pace','sprint','hard',true,45,40,ARRAY['R-pace','200m','16x','economy'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',45,'pace',5),(w,3,'recovery','time',75,'pace',1),(w,4,'interval','time',45,'pace',5),(w,5,'recovery','time',75,'pace',1),(w,6,'interval','time',45,'pace',5),(w,7,'recovery','time',75,'pace',1),(w,8,'interval','time',45,'pace',5),(w,9,'recovery','time',75,'pace',1),(w,10,'interval','time',45,'pace',5),(w,11,'recovery','time',75,'pace',1),(w,12,'interval','time',45,'pace',5),(w,13,'recovery','time',75,'pace',1),(w,14,'interval','time',45,'pace',5),(w,15,'recovery','time',75,'pace',1),(w,16,'interval','time',45,'pace',5),(w,17,'recovery','time',75,'pace',1),(w,18,'interval','time',45,'pace',5),(w,19,'recovery','time',75,'pace',1),(w,20,'interval','time',45,'pace',5),(w,21,'recovery','time',75,'pace',1),(w,22,'interval','time',45,'pace',5),(w,23,'recovery','time',75,'pace',1),(w,24,'interval','time',45,'pace',5),(w,25,'recovery','time',75,'pace',1),(w,26,'interval','time',45,'pace',5),(w,27,'recovery','time',75,'pace',1),(w,28,'interval','time',45,'pace',5),(w,29,'recovery','time',75,'pace',1),(w,30,'interval','time',45,'pace',5),(w,31,'recovery','time',75,'pace',1),(w,32,'interval','time',45,'pace',5),(w,33,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','MAS Test — Time Trial 6 min','Six-minute maximal effort time trial for MAS (maximal aerobic speed) estimation. Distance covered in 6 minutes x 0.5 = estimated MAS.','hr','vo2max','very_hard',true,20,28,ARRAY['MAS-test','6min','time-trial','assessment'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',360,'hr',5),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Ladder 600/800/1000/1200 m','Ascending distance ladder at VO2max pace. Progressive distance increases total stress on oxygen transport system session.','pace','vo2max','hard',true,45,52,ARRAY['ladder','600-1200','vo2max','ascending'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',145,'pace',5),(w,3,'recovery','time',145,'pace',1),(w,4,'interval','time',195,'pace',5),(w,5,'recovery','time',195,'pace',1),(w,6,'interval','time',240,'pace',5),(w,7,'recovery','time',240,'pace',1),(w,8,'interval','time',290,'pace',5),(w,9,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Fartlek VO2max Pickups (45 min)','45-minute run with 8 unstructured VO2max-effort pickups (1-3 min each). Develops VO2max adaptations within continuous running context. Lydiard sharpening work.','hr','vo2max','hard',true,45,52,ARRAY['fartlek','pickups','vo2max','lydiard'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',2),(w,2,'steady','time',300,'hr',2),(w,3,'interval','time',90,'hr',5),(w,4,'steady','time',240,'hr',2),(w,5,'interval','time',90,'hr',5),(w,6,'steady','time',240,'hr',2),(w,7,'interval','time',90,'hr',5),(w,8,'steady','time',240,'hr',2),(w,9,'interval','time',90,'hr',5),(w,10,'steady','time',240,'hr',2),(w,11,'interval','time',90,'hr',5),(w,12,'steady','time',240,'hr',2),(w,13,'interval','time',90,'hr',5),(w,14,'steady','time',240,'hr',2),(w,15,'interval','time',90,'hr',5),(w,16,'steady','time',240,'hr',2),(w,17,'interval','time',90,'hr',5),(w,18,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Track 1 Mile Repeats 4x','Four mile repeats at I-pace (VO2max). Demanding but classic distance for maximizing VO2max time on track.','pace','vo2max','very_hard',true,60,68,ARRAY['mile','4x','I-pace','track','vo2max'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',360,'pace',5),(w,3,'recovery','time',360,'pace',1),(w,4,'interval','time',360,'pace',5),(w,5,'recovery','time',360,'pace',1),(w,6,'interval','time',360,'pace',5),(w,7,'recovery','time',360,'pace',1),(w,8,'interval','time',360,'pace',5),(w,9,'cooldown','time',600,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Cross Country Race Simulation (8 km)','8-kilometer race simulation with tactical effort distribution: controlled first km, surge at 3km, maintain through 6km, final 2km at race pace.','hr','vo2max','hard',true,45,55,ARRAY['cross-country','race-sim','8km','tactical'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',300,'hr',4),(w,3,'steady','time',600,'hr',5),(w,4,'steady','time',900,'hr',4),(w,5,'interval','time',600,'hr',5),(w,6,'cooldown','time',600,'hr',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','HIIT Running 8x30s (All Out)','Eight 30-second all-out running efforts with 4-minute complete recovery. Gibala SIT adaptation for running — induces VO2max gains with low total volume.','hr','vo2max','very_hard',true,45,48,ARRAY['HIIT','30s','all-out','SIT','vo2max'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',30,'hr',5),(w,3,'recovery','time',240,'hr',1),(w,4,'interval','time',30,'hr',5),(w,5,'recovery','time',240,'hr',1),(w,6,'interval','time',30,'hr',5),(w,7,'recovery','time',240,'hr',1),(w,8,'interval','time',30,'hr',5),(w,9,'recovery','time',240,'hr',1),(w,10,'interval','time',30,'hr',5),(w,11,'recovery','time',240,'hr',1),(w,12,'interval','time',30,'hr',5),(w,13,'recovery','time',240,'hr',1),(w,14,'interval','time',30,'hr',5),(w,15,'recovery','time',240,'hr',1),(w,16,'interval','time',30,'hr',5),(w,17,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','5km Time Trial — VDOT Test','Full-effort 5-kilometer time trial for VDOT (Daniels) fitness assessment. Used to prescribe all training paces. Test every 4-6 weeks.','pace','vo2max','very_hard',true,30,38,ARRAY['test','VDOT','5km','time-trial'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'steady','time',1200,'pace',5),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','10km Time Trial — LT Assessment','10-kilometer time trial effort for lactate threshold heart rate assessment. Provides LTHR = average HR of last 20 minutes of race.','hr','threshold','very_hard',true,55,65,ARRAY['test','10km','LTHR','assessment'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',2400,'hr',4),(w,3,'interval','time',300,'hr',5),(w,4,'cooldown','time',300,'hr',1);

-- ==================================================================
-- HILLS (12 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Short Hill Sprints 10x10s','Ten maximal 10-second uphill sprints targeting neuromuscular power and running-specific force development. Lydiard hill work foundation.','hr','strength','moderate',true,30,20,ARRAY['hills','10s','sprint','neuromuscular','lydiard'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',10,'hr',5),(w,3,'recovery','time',110,'hr',1),(w,4,'interval','time',10,'hr',5),(w,5,'recovery','time',110,'hr',1),(w,6,'interval','time',10,'hr',5),(w,7,'recovery','time',110,'hr',1),(w,8,'interval','time',10,'hr',5),(w,9,'recovery','time',110,'hr',1),(w,10,'interval','time',10,'hr',5),(w,11,'recovery','time',110,'hr',1),(w,12,'interval','time',10,'hr',5),(w,13,'recovery','time',110,'hr',1),(w,14,'interval','time',10,'hr',5),(w,15,'recovery','time',110,'hr',1),(w,16,'interval','time',10,'hr',5),(w,17,'recovery','time',110,'hr',1),(w,18,'interval','time',10,'hr',5),(w,19,'recovery','time',110,'hr',1),(w,20,'interval','time',10,'hr',5),(w,21,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Bounding Circuit (8x60s)','Eight 60-second explosive bounding uphill sections. Lydiard hill bounding develops gluteal power and elastic energy storage.','hr','strength','hard',true,40,38,ARRAY['bounding','60s','hill','elastic-energy','lydiard'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',60,'hr',5),(w,3,'recovery','time',120,'hr',1),(w,4,'interval','time',60,'hr',5),(w,5,'recovery','time',120,'hr',1),(w,6,'interval','time',60,'hr',5),(w,7,'recovery','time',120,'hr',1),(w,8,'interval','time',60,'hr',5),(w,9,'recovery','time',120,'hr',1),(w,10,'interval','time',60,'hr',5),(w,11,'recovery','time',120,'hr',1),(w,12,'interval','time',60,'hr',5),(w,13,'recovery','time',120,'hr',1),(w,14,'interval','time',60,'hr',5),(w,15,'recovery','time',120,'hr',1),(w,16,'interval','time',60,'hr',5),(w,17,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Repeats 2 min (6x)','Six 2-minute sustained hill efforts at controlled effort (Z4). Builds lactate tolerance and specific climbing strength.','hr','strength','hard',true,45,45,ARRAY['hills','2min','6x','Z4','climbing'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',120,'hr',4),(w,3,'recovery','time',120,'hr',1),(w,4,'interval','time',120,'hr',4),(w,5,'recovery','time',120,'hr',1),(w,6,'interval','time',120,'hr',4),(w,7,'recovery','time',120,'hr',1),(w,8,'interval','time',120,'hr',4),(w,9,'recovery','time',120,'hr',1),(w,10,'interval','time',120,'hr',4),(w,11,'recovery','time',120,'hr',1),(w,12,'interval','time',120,'hr',4),(w,13,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Hill Repeats 4x3 min','Four long hill repeats at Z5 intensity (3-minute sustained climb). Combines VO2max stimulus with hill-specific strength.','hr','vo2max','very_hard',true,40,44,ARRAY['hills','3min','4x','vo2max','strength'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',180,'hr',5),(w,3,'recovery','time',180,'hr',1),(w,4,'interval','time',180,'hr',5),(w,5,'recovery','time',180,'hr',1),(w,6,'interval','time',180,'hr',5),(w,7,'recovery','time',180,'hr',1),(w,8,'interval','time',180,'hr',5),(w,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Downhill Running Technique (40 min)','Easy aerobic effort with deliberate downhill running sections. Trains eccentric quad control, braking mechanics, and high-turnover foot strike on descent.','hr','other','easy',true,40,24,ARRAY['downhill','technique','eccentric','descent'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2400,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Strides 15x20s','Fifteen 20-second uphill strides at controlled fast effort. Builds hill-specific power without lactate accumulation. Running strides adapted for slope.','hr','strength','moderate',true,35,25,ARRAY['hill-strides','20s','15x','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',20,'hr',5),(w,3,'recovery','time',60,'hr',1),(w,4,'interval','time',20,'hr',5),(w,5,'recovery','time',60,'hr',1),(w,6,'interval','time',20,'hr',5),(w,7,'recovery','time',60,'hr',1),(w,8,'interval','time',20,'hr',5),(w,9,'recovery','time',60,'hr',1),(w,10,'interval','time',20,'hr',5),(w,11,'recovery','time',60,'hr',1),(w,12,'interval','time',20,'hr',5),(w,13,'recovery','time',60,'hr',1),(w,14,'interval','time',20,'hr',5),(w,15,'recovery','time',60,'hr',1),(w,16,'interval','time',20,'hr',5),(w,17,'recovery','time',60,'hr',1),(w,18,'interval','time',20,'hr',5),(w,19,'recovery','time',60,'hr',1),(w,20,'interval','time',20,'hr',5),(w,21,'recovery','time',60,'hr',1),(w,22,'interval','time',20,'hr',5),(w,23,'recovery','time',60,'hr',1),(w,24,'interval','time',20,'hr',5),(w,25,'recovery','time',60,'hr',1),(w,26,'interval','time',20,'hr',5),(w,27,'recovery','time',60,'hr',1),(w,28,'interval','time',20,'hr',5),(w,29,'recovery','time',60,'hr',1),(w,30,'interval','time',20,'hr',5),(w,31,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Continuous Hilly Long Run (100 min)','Long run on hilly terrain with controlled effort (HR ≤ Z2/Z3). Develops climbing strength and aerobic capacity on varied terrain.','hr','endurance','hard',true,100,70,ARRAY['hilly','long','100min','terrain'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',3600,'hr',2),(w,3,'steady','time',1800,'hr',3),(w,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Circuit Speed Endurance (5x4 min)','Five 4-minute sustained hill climbs at hard aerobic pace (Z4-Z5). Speed-endurance development combining elevation gradient with lactate system stress.','hr','vo2max','hard',true,50,55,ARRAY['hill-circuit','speed-endurance','5x4','Z4-Z5'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',240,'hr',5),(w,3,'recovery','time',180,'hr',1),(w,4,'interval','time',240,'hr',5),(w,5,'recovery','time',180,'hr',1),(w,6,'interval','time',240,'hr',5),(w,7,'recovery','time',180,'hr',1),(w,8,'interval','time',240,'hr',5),(w,9,'recovery','time',180,'hr',1),(w,10,'interval','time',240,'hr',5),(w,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Repetitive Short Hills 20x30s','Twenty 30-second hill sprints developing anaerobic tolerance and lactic acid buffering capacity. High-volume hill sprint training method.','hr','sprint','hard',true,45,42,ARRAY['hills','20x30s','anaerobic','tolerance'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',30,'hr',5),(w,3,'recovery','time',90,'hr',1),(w,4,'interval','time',30,'hr',5),(w,5,'recovery','time',90,'hr',1),(w,6,'interval','time',30,'hr',5),(w,7,'recovery','time',90,'hr',1),(w,8,'interval','time',30,'hr',5),(w,9,'recovery','time',90,'hr',1),(w,10,'interval','time',30,'hr',5),(w,11,'recovery','time',90,'hr',1),(w,12,'interval','time',30,'hr',5),(w,13,'recovery','time',90,'hr',1),(w,14,'interval','time',30,'hr',5),(w,15,'recovery','time',90,'hr',1),(w,16,'interval','time',30,'hr',5),(w,17,'recovery','time',90,'hr',1),(w,18,'interval','time',30,'hr',5),(w,19,'recovery','time',90,'hr',1),(w,20,'interval','time',30,'hr',5),(w,21,'recovery','time',90,'hr',1),(w,22,'interval','time',30,'hr',5),(w,23,'recovery','time',90,'hr',1),(w,24,'interval','time',30,'hr',5),(w,25,'recovery','time',90,'hr',1),(w,26,'interval','time',30,'hr',5),(w,27,'recovery','time',90,'hr',1),(w,28,'interval','time',30,'hr',5),(w,29,'recovery','time',90,'hr',1),(w,30,'interval','time',30,'hr',5),(w,31,'recovery','time',90,'hr',1),(w,32,'interval','time',30,'hr',5),(w,33,'recovery','time',90,'hr',1),(w,34,'interval','time',30,'hr',5),(w,35,'recovery','time',90,'hr',1),(w,36,'interval','time',30,'hr',5),(w,37,'recovery','time',90,'hr',1),(w,38,'interval','time',30,'hr',5),(w,39,'recovery','time',90,'hr',1),(w,40,'interval','time',30,'hr',5),(w,41,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Elevation Gain Challenge (60 min, 500m D+)','60-minute trail run targeting 500m elevation gain. Develops vertical-specific strength and cardiovascular adaptation to altitude-change demands.','hr','endurance','hard',true,60,52,ARRAY['elevation','500m','trail','vertical'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',1800,'hr',3),(w,3,'steady','time',1200,'hr',2),(w,4,'steady','time',600,'hr',3),(w,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Lydiard Hill Phase — Full Circuit (90 min)','Complete Lydiard hill phase circuit including uphill, crest strides, downhill running. The full hill conditioning phase that develops running-specific strength for track seasons.','hr','strength','hard',true,90,70,ARRAY['lydiard','hill-phase','circuit','strength-training'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'interval','time',90,'hr',5),(w,3,'recovery','time',60,'hr',1),(w,4,'interval','time',90,'hr',5),(w,5,'recovery','time',60,'hr',1),(w,6,'interval','time',90,'hr',5),(w,7,'recovery','time',60,'hr',1),(w,8,'interval','time',90,'hr',5),(w,9,'recovery','time',60,'hr',1),(w,10,'steady','time',600,'hr',3),(w,11,'steady','time',600,'hr',2),(w,12,'interval','time',20,'pace',5),(w,13,'recovery','time',40,'hr',2),(w,14,'interval','time',20,'pace',5),(w,15,'recovery','time',40,'hr',2),(w,16,'interval','time',20,'pace',5),(w,17,'recovery','time',40,'hr',2),(w,18,'interval','time',20,'pace',5),(w,19,'recovery','time',40,'hr',2),(w,20,'interval','time',20,'pace',5),(w,21,'cooldown','time',600,'hr',1);

-- ==================================================================
-- TECHNIQUE / DRILLS (10 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Running Mechanics Drill Session (40 min)','A-skip, B-skip, high knees, butt kicks, straight-leg bounds sequence. Evidence-based running drill circuit targeting mechanics and running economy improvements.','rpe','other','easy',true,40,18,ARRAY['drills','mechanics','A-skip','B-skip','economy'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',30,'rpe',5),(w,3,'steady','time',30,'rpe',5),(w,4,'steady','time',30,'rpe',5),(w,5,'steady','time',30,'rpe',5),(w,6,'steady','time',30,'rpe',5),(w,7,'steady','time',30,'rpe',5),(w,8,'recovery','time',300,'hr',1),(w,9,'steady','time',30,'rpe',5),(w,10,'steady','time',30,'rpe',5),(w,11,'steady','time',30,'rpe',5),(w,12,'steady','time',30,'rpe',5),(w,13,'steady','time',30,'rpe',5),(w,14,'steady','time',30,'rpe',5),(w,15,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Barefoot / Minimal Drill Walk-Run (30 min)','Barefoot or minimal shoe running session. Develops proprioception, foot strength, and natural foot strike mechanics. Gradual adaptation required.','rpe','other','easy',true,30,14,ARRAY['barefoot','proprioception','foot-strength','minimal'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',600,'rpe',3),(w,2,'steady','time',120,'rpe',4),(w,3,'steady','time',120,'rpe',3),(w,4,'steady','time',120,'rpe',4),(w,5,'steady','time',120,'rpe',3),(w,6,'steady','time',120,'rpe',4),(w,7,'steady','time',120,'rpe',3),(w,8,'steady','time',120,'rpe',4),(w,9,'cooldown','time',120,'rpe',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Cadence Drill — 180 spm Training (30 min)','Easy run with deliberate 180 steps-per-minute cadence focus. Maffetone-inspired cadence drill improving stride efficiency and reducing ground contact time.','hr','other','easy',true,30,15,ARRAY['cadence','180spm','stride','efficiency'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',1500,'hr',2),(w,3,'cooldown','time',180,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Posture and Form Run (45 min)','Aerobic base run with periodic 30-second focused segments: trunk lean, arm swing, high-elbow recovery, forward gaze. Deliberate practice of elite running mechanics.','hr','other','easy',true,45,22,ARRAY['form','posture','deliberate-practice','mechanics'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',300,'hr',2),(w,3,'steady','time',30,'rpe',4),(w,4,'steady','time',300,'hr',2),(w,5,'steady','time',30,'rpe',4),(w,6,'steady','time',300,'hr',2),(w,7,'steady','time',30,'rpe',4),(w,8,'steady','time',300,'hr',2),(w,9,'steady','time',30,'rpe',4),(w,10,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Treadmill Overspeed Training (30 min)','30-minute treadmill session with periodic 15-second above-maximal pace segments. Trains neuromuscular leg speed and stride frequency.','pace','sprint','moderate',true,30,22,ARRAY['treadmill','overspeed','leg-speed','neuromuscular'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',2),(w,2,'steady','time',300,'pace',3),(w,3,'interval','time',15,'pace',5),(w,4,'steady','time',285,'pace',3),(w,5,'interval','time',15,'pace',5),(w,6,'steady','time',285,'pace',3),(w,7,'interval','time',15,'pace',5),(w,8,'steady','time',285,'pace',3),(w,9,'interval','time',15,'pace',5),(w,10,'steady','time',285,'pace',3),(w,11,'interval','time',15,'pace',5),(w,12,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Dynamic Warm-Up Protocol (20 min)','Full dynamic warm-up routine: leg swings, lateral hip mobility, hip circles, ankle mobility, activation runs. Research-backed pre-training preparation sequence.','rpe','recovery','easy',true,20,8,ARRAY['warm-up','dynamic','mobility','activation'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',600,'rpe',3),(w,2,'steady','time',600,'rpe',4),(w,3,'cooldown','time',180,'rpe',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Breathing Technique Run (40 min)','Easy run with deliberate diaphragmatic breathing and rhythmic breathing pattern practice. Trains respiratory economy and CO2 tolerance.','hr','other','easy',true,40,20,ARRAY['breathing','diaphragmatic','rhythmic','CO2'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'hr',1),(w,2,'steady','time',2100,'hr',2),(w,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Foot Strike Conversion Drill (30 min)','Structured session transitioning from heel-strike to mid-foot strike pattern. Gradual adaptations reduce injury risk. Run with metronome at 178+ spm.','hr','other','easy',true,30,14,ARRAY['foot-strike','midfoot','gait','conversion'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',600,'rpe',3),(w,2,'steady','time',300,'hr',2),(w,3,'steady','time',300,'rpe',4),(w,4,'steady','time',300,'hr',2),(w,5,'steady','time',300,'rpe',4),(w,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Post-Workout Cooldown Run (15 min)','Mandatory slow cooldown jog following any hard training session. Facilitates active lactate clearance, cardiac output reduction, and psychological transition.','hr','recovery','easy',true,15,6,ARRAY['cooldown','post-workout','15min','recovery'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',900,'hr',1),(w,2,'cooldown','time',60,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Achilles and Tendon Conditioning (30 min)','Low-intensity run incorporating single-leg calf raises, Achilles eccentrics, and controlled ankle flexion patterns. Injury prevention for Achilles tendinopathy and plantar fasciitis.','rpe','recovery','easy',true,30,12,ARRAY['achilles','tendon','eccentric','injury-prevention'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'rpe',2),(w,2,'steady','time',600,'rpe',4),(w,3,'steady','time',300,'rpe',3),(w,4,'steady','time',600,'rpe',4),(w,5,'cooldown','time',300,'rpe',2);

-- ==================================================================
-- RACE-SPECIFIC / PEAKING (10 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Sharpening Session — Competition Prep','Pre-competition sharpening: 20-min easy, 3x800m at race pace, 10-min easy. Activates neuromuscular system and sharpens race-pace feel.','hr','vo2max','moderate',true,45,45,ARRAY['sharpening','competition-prep','800m','race-pace'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',600,'hr',2),(w,3,'interval','time',200,'hr',5),(w,4,'recovery','time',200,'hr',2),(w,5,'interval','time',200,'hr',5),(w,6,'recovery','time',200,'hr',2),(w,7,'interval','time',200,'hr',5),(w,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Taper Week Quality Session','Final quality session during taper week: reduced volume, maintained intensity. 20-min easy, 4x200m fast, cooldown. Maintains neuromuscular readiness.','hr','recovery','easy',true,35,25,ARRAY['taper','quality','pre-race','200m'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',600,'hr',2),(w,3,'interval','time',45,'pace',5),(w,4,'recovery','time',90,'hr',1),(w,5,'interval','time',45,'pace',5),(w,6,'recovery','time',90,'hr',1),(w,7,'interval','time',45,'pace',5),(w,8,'recovery','time',90,'hr',1),(w,9,'interval','time',45,'pace',5),(w,10,'cooldown','time',600,'hr',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','5km Race Simulation','Full 5-kilometer race simulation effort. Tactical pacing: first km controlled, middle 3km at goal pace, final 1km at maximal effort.','hr','vo2max','very_hard',true,30,38,ARRAY['race-simulation','5km','tactical','competition'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',300,'hr',4),(w,3,'steady','time',600,'hr',5),(w,4,'steady','time',240,'hr',5),(w,5,'interval','time',60,'hr',5),(w,6,'cooldown','time',600,'hr',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','21km Race Simulation (Half Marathon)','Half marathon race simulation split into three tactical blocks. Develops race pace familiarity and carbohydrate oxidation rate at goal intensity.','hr','threshold','very_hard',true,100,90,ARRAY['half-marathon','race-simulation','21km','tactical'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'hr',2),(w,2,'steady','time',1200,'hr',4),(w,3,'steady','time',1800,'hr',4),(w,4,'steady','time',1200,'hr',4),(w,5,'interval','time',600,'hr',5),(w,6,'cooldown','time',600,'hr',2);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Peaking Phase Short Speed (30 min)','Short intense session with 6x150m race-speed strides on track. Competition phase peaking work activating fast-twitch fibers.','pace','sprint','moderate',true,30,20,ARRAY['peaking','150m','6x','race-speed'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',2),(w,2,'interval','time',30,'pace',5),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',30,'pace',5),(w,5,'recovery','time',90,'pace',1),(w,6,'interval','time',30,'pace',5),(w,7,'recovery','time',90,'pace',1),(w,8,'interval','time',30,'pace',5),(w,9,'recovery','time',90,'pace',1),(w,10,'interval','time',30,'pace',5),(w,11,'recovery','time',90,'pace',1),(w,12,'interval','time',30,'pace',5),(w,13,'cooldown','time',300,'pace',1);

END $$;
