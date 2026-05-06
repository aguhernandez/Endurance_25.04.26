/*
  # Triathlon Transition & Brick Workouts Library

  ## Summary
  Inserts 35+ triathlon-specific workouts into the public library.

  ## New Workout Categories (sport = 'triathlon')
  - T1 Transition Practice: swim-to-bike drills, wetsuit removal, helmet/shoe mounting
  - T2 Transition Practice: bike-to-run drills, racking, shoe change, race belt
  - Swim-Bike Bricks: combined swim + bike sessions with immediate transitions
  - Bike-Run Bricks: core triathlon brick with run off the bike (dead legs adaptation)
  - Full Triathlon Bricks: Olympic, Sprint, Half-Ironman simulation sets
  - Neuromuscular Adaptation: dead legs, cadence focus, aerobic bridge sessions

  ## Scientific Basis
  - Hausswirth et al. (2000): Running economy changes post-cycling (brick effect)
  - Millet & Vleck (2000): Neuromuscular recruitment differences swim-bike-run
  - Peeling et al. (2005): Swim-bike-run performance determinants
  - Laursen & Rhodes (2001): High-intensity training for ultradistance triathlon
  - Couzens (2008): Triathlon training methodology, brick adaptation protocols

  ## Category Mapping to schema allowed values
  - technique/transition drills → 'other'
  - endurance/aerobic bricks → 'endurance'
  - race simulations → 'other'
  - interval bricks → 'threshold' or 'vo2max'
  - polarized/hard → 'threshold'

  ## Zone Reference (HRR Karvonen)
  Z1 <50% HRR | Z2 50-60% HRR | Z3 60-70% HRR | Z4 70-85% HRR | Z5 >85% HRR
*/

DO $$
DECLARE
  w_t1_basic uuid; w_t1_adv uuid; w_t1_mount uuid; w_t1_sprint uuid;
  w_t2_basic uuid; w_t2_seq uuid; w_t2_gear uuid;
  w_sb_sprint uuid; w_sb_olympic uuid; w_sb_negsplit uuid; w_sb_hi uuid; w_sb_cadence uuid;
  w_br_intro uuid; w_br_sprint uuid; w_br_olympic uuid; w_br_hi uuid; w_br_repeats uuid;
  w_br_hard uuid; w_br_thresh uuid;
  w_full_sprint uuid; w_full_olympic uuid; w_full_hi uuid; w_full_tt uuid;
  w_nm_dead uuid; w_nm_cad uuid; w_nm_bridge uuid; w_nm_aero uuid;
  w_rp_sprint_act uuid; w_rp_olympic_act uuid; w_rp_sharp uuid;
  w_td_t1tt uuid; w_td_t2tt uuid; w_td_walkthru uuid;
  w_ow_basic uuid; w_ow_surge uuid;
  w_im_pace uuid; w_im_run uuid;
BEGIN

-- =====================================================================
-- T1 TRANSITION PRACTICE
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T1 Wetsuit Removal Drill','Practice wetsuit exit: cross arms, pull to waist in one motion, step out heel-first. Target under 60s removal. 5 reps with rest between. Reference: ITU transition rules, Couzens (2008).','rpe','other','easy',true,20,18,ARRAY['t1','transition','technique','wetsuit'])
RETURNING id INTO w_t1_basic;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t1_basic,1,'warmup','time',600,'hr',2),
(w_t1_basic,2,'interval','time',450,'hr',3),
(w_t1_basic,3,'interval','time',300,'hr',3),
(w_t1_basic,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T1 Race-Speed Wetsuit Exit','High-speed T1 simulation. 200m hard swim effort then full T1 in under 90s (wetsuit, helmet, shoes, mount). Race urgency throughout. 4 reps. Reference: ITU elite transition benchmarks.','rpe','other','moderate',true,30,35,ARRAY['t1','transition','race-speed','wetsuit'])
RETURNING id INTO w_t1_adv;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t1_adv,1,'warmup','time',600,'hr',2),
(w_t1_adv,2,'interval','time',900,'hr',4),
(w_t1_adv,3,'interval','time',180,'hr',2),
(w_t1_adv,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T1 Flying Mount Practice','Bike flying mount drill: shoes pre-clipped on bike, run with bike, jump mount at speed. Practice on grass first. Target mount time under 5s. Saves 20-30s in race. Reference: ITU elite coaching manual.','rpe','other','moderate',true,25,20,ARRAY['t1','transition','flying-mount','technique'])
RETURNING id INTO w_t1_mount;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t1_mount,1,'warmup','time',600,'hr',2),
(w_t1_mount,2,'interval','time',600,'hr',3),
(w_t1_mount,3,'interval','time',300,'hr',4),
(w_t1_mount,4,'cooldown','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T1 Sprint Distance Simulation','Full sprint T1: 400m swim + full T1 targeting under 75s. Wetsuit, helmet buckle, mount. 3 reps. Benchmark session to track T1 time improvement over training block. Reference: Sprint ITU race format.','hr','other','hard',true,35,42,ARRAY['t1','transition','sprint','benchmark'])
RETURNING id INTO w_t1_sprint;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t1_sprint,1,'warmup','time',480,'hr',2),
(w_t1_sprint,2,'interval','time',900,'hr',4),
(w_t1_sprint,3,'recovery','time',300,'hr',1),
(w_t1_sprint,4,'interval','time',1200,'hr',4),
(w_t1_sprint,5,'cooldown','time',600,'hr',2);

-- =====================================================================
-- T2 TRANSITION PRACTICE
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T2 Flying Dismount Drill','Practice flying dismount: unclip at 200m, swing leg over, run with bike to rack. Target dismount under 3s. Saves 15-20s per race. 10 reps on grass. Reference: ITU coaching resources.','rpe','other','easy',true,20,15,ARRAY['t2','transition','flying-dismount','technique'])
RETURNING id INTO w_t2_basic;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t2_basic,1,'warmup','time',600,'hr',2),
(w_t2_basic,2,'interval','time',600,'hr',3),
(w_t2_basic,3,'interval','time',300,'hr',4),
(w_t2_basic,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T2 Complete Bike-to-Run Sequence','Full T2 drill: dismount, rack, helmet off, shoes, race belt, run exit. Target under 60s. First 200m of run to feel brick effect (heavy legs are normal). 5 reps with recovery. Reference: Couzens (2008).','rpe','other','moderate',true,30,28,ARRAY['t2','transition','sequence','brick'])
RETURNING id INTO w_t2_seq;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t2_seq,1,'warmup','time',900,'hr',2),
(w_t2_seq,2,'interval','time',900,'hr',3),
(w_t2_seq,3,'interval','time',600,'hr',4),
(w_t2_seq,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T2 Race Gear Rehearsal','Practice T2 with all race gear: elastic laces, race belt with number, cap. Simulate fatigue with 10 min hard ride first. Test all race equipment under race conditions before A-race.','rpe','other','moderate',true,25,22,ARRAY['t2','transition','race-gear','rehearsal'])
RETURNING id INTO w_t2_gear;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_t2_gear,1,'warmup','time',300,'hr',2),
(w_t2_gear,2,'steady','time',600,'hr',4),
(w_t2_gear,3,'interval','time',600,'hr',3),
(w_t2_gear,4,'steady','time',300,'hr',2),
(w_t2_gear,5,'cooldown','time',300,'hr',1);

-- =====================================================================
-- SWIM-BIKE BRICKS
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Swim-Bike Brick: Sprint Base','Sprint distance brick. 400m swim + immediate mount + 10km bike at tempo. First 5 min of bike feels awkward — horizontal to vertical position change. Focus on smooth pedaling. Reference: Peeling et al. (2005).','hr','endurance','moderate',true,55,68,ARRAY['swim-bike','brick','sprint','endurance'])
RETURNING id INTO w_sb_sprint;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sb_sprint,1,'warmup','time',480,'hr',2),
(w_sb_sprint,2,'steady','time',2400,'hr',3),
(w_sb_sprint,3,'cooldown','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Swim-Bike Brick: Olympic Simulation','Olympic distance swim-bike. 1500m swim + 40km bike. Maintain pace through T1. First 10km of bike: resist overcooking with swim-fresh legs. Settle into race pace. Reference: ITU Olympic distance race analysis.','hr','endurance','hard',true,110,155,ARRAY['swim-bike','brick','olympic','simulation'])
RETURNING id INTO w_sb_olympic;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sb_olympic,1,'warmup','time',720,'hr',2),
(w_sb_olympic,2,'steady','time',5400,'hr',3),
(w_sb_olympic,3,'cooldown','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Swim-Bike Brick: Negative Split Bike','750m swim relaxed, then 20km bike with negative split — first 10km Z2, second 10km Z3-Z4. Trains pacing discipline and aerobic economy. Reference: Hausswirth et al. (2010) pacing in triathlon.','hr','endurance','moderate',true,75,95,ARRAY['swim-bike','brick','negative-split','pacing'])
RETURNING id INTO w_sb_negsplit;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sb_negsplit,1,'warmup','time',360,'hr',2),
(w_sb_negsplit,2,'steady','time',1800,'hr',2),
(w_sb_negsplit,3,'steady','time',1800,'hr',3),
(w_sb_negsplit,4,'cooldown','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Swim-Bike Brick: Half Ironman 70.3','70.3 swim-bike. 1900m swim + 90km bike. Nutrition every 30-45min on bike mandatory (60-90g carbs/hr). Reference: Laursen & Rhodes (2001) Ironman physiology.','hr','endurance','very_hard',true,195,280,ARRAY['swim-bike','brick','70.3','half-ironman'])
RETURNING id INTO w_sb_hi;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sb_hi,1,'warmup','time',600,'hr',2),
(w_sb_hi,2,'steady','time',10800,'hr',3),
(w_sb_hi,3,'cooldown','time',600,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Swim-Bike: High Cadence Focus Off Swim','400m swim + 15km bike at 95-100 rpm Z2-Z3. High cadence helps transition from swim to run biomechanics. Trains neuromuscular efficiency at race RPM. Reference: Millet & Vleck (2000) triathlon biomechanics.','hr','other','easy',true,60,72,ARRAY['swim-bike','brick','cadence','neuromuscular'])
RETURNING id INTO w_sb_cadence;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sb_cadence,1,'warmup','time',360,'hr',2),
(w_sb_cadence,2,'steady','time',2700,'hr',3),
(w_sb_cadence,3,'cooldown','time',300,'hr',2);

-- =====================================================================
-- BIKE-RUN BRICKS
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Bike-Run Brick: Introduction 30+20min','Introduction brick. 30min moderate bike, immediate 20min run. First 5-10min of run = heavy legs (brick effect). Normal — push through and RPE normalizes. Reference: Hausswirth et al. (2000) brick adaptation.','hr','endurance','easy',true,55,62,ARRAY['bike-run','brick','intro','beginner'])
RETURNING id INTO w_br_intro;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_intro,1,'warmup','time',600,'hr',2),
(w_br_intro,2,'steady','time',1200,'hr',3),
(w_br_intro,3,'steady','time',1200,'hr',3),
(w_br_intro,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Bike-Run Brick: Sprint Race Simulation','Sprint triathlon brick. 20km bike at race pace + 5km run at race pace. Benchmark: record split times each session. Focus on running form off the bike despite heavy quads. Reference: Sprint ITU race demands.','hr','other','hard',true,65,85,ARRAY['bike-run','brick','sprint','race-simulation'])
RETURNING id INTO w_br_sprint;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_sprint,1,'warmup','time',900,'hr',2),
(w_br_sprint,2,'steady','time',2700,'hr',4),
(w_br_sprint,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Bike-Run Brick: Olympic Race Simulation','Olympic distance brick. 40km bike + 10km run. First 2km of run: hold back 10-15s/km slower than target. Negative split on run. Reference: Olympic distance triathlon physiology.','hr','other','hard',true,115,160,ARRAY['bike-run','brick','olympic','race-simulation'])
RETURNING id INTO w_br_olympic;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_olympic,1,'warmup','time',600,'hr',2),
(w_br_olympic,2,'steady','time',3600,'hr',3),
(w_br_olympic,3,'steady','time',1200,'hr',3),
(w_br_olympic,4,'steady','time',1200,'hr',4),
(w_br_olympic,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Bike-Run Brick: Half Ironman 70.3','70.3 brick. 90km bike + 21km run. Execute nutrition plan on bike (60-90g carbs/hr). Run pacing Z2-Z3 throughout. Reference: Laursen & Rhodes (2001), Couzens (2008) long course prep.','hr','endurance','very_hard',true,220,320,ARRAY['bike-run','brick','70.3','half-ironman'])
RETURNING id INTO w_br_hi;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_hi,1,'warmup','time',600,'hr',2),
(w_br_hi,2,'steady','time',12000,'hr',3),
(w_br_hi,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Brick: Short Repeats 3x(10km Bike + 2km Run)','Multiple short bricks. 3x(10km bike + 2km run) with 5 min rest between sets. Each set trains neuromuscular transition. High training density per unit time. Reference: Brick methodology, Couzens (2008).','hr','threshold','moderate',true,75,90,ARRAY['bike-run','brick','repeats','neuromuscular'])
RETURNING id INTO w_br_repeats;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_repeats,1,'warmup','time',600,'hr',2),
(w_br_repeats,2,'interval','time',1500,'hr',3),
(w_br_repeats,3,'recovery','time',300,'hr',1),
(w_br_repeats,4,'interval','time',1500,'hr',3),
(w_br_repeats,5,'recovery','time',300,'hr',1),
(w_br_repeats,6,'interval','time',1500,'hr',3),
(w_br_repeats,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Brick: Hard Bike + Easy Run (Polarized)','Polarized brick. 45min hard bike (Z4) immediately followed by 15min very easy run (Z1-Z2). Trains running form on very fatigued legs. Reference: Seiler polarized approach applied to triathlon.','hr','threshold','hard',true,65,88,ARRAY['bike-run','brick','polarized','threshold'])
RETURNING id INTO w_br_hard;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_hard,1,'warmup','time',600,'hr',2),
(w_br_hard,2,'steady','time',2700,'hr',4),
(w_br_hard,3,'steady','time',900,'hr',2),
(w_br_hard,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Brick: Threshold Intervals Off Bike','30min Z2 bike then 4x1km at threshold (Z4) off the bike with 90s recovery. Quality work under brick fatigue. Reference: Daniels threshold intervals adapted for triathlon.','hr','threshold','hard',true,70,95,ARRAY['bike-run','brick','threshold','intervals'])
RETURNING id INTO w_br_thresh;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_br_thresh,1,'warmup','time',600,'hr',2),
(w_br_thresh,2,'steady','time',1800,'hr',3),
(w_br_thresh,3,'interval','time',240,'hr',4),
(w_br_thresh,4,'recovery','time',90,'hr',2),
(w_br_thresh,5,'interval','time',240,'hr',4),
(w_br_thresh,6,'recovery','time',90,'hr',2),
(w_br_thresh,7,'interval','time',240,'hr',4),
(w_br_thresh,8,'recovery','time',90,'hr',2),
(w_br_thresh,9,'interval','time',240,'hr',4),
(w_br_thresh,10,'cooldown','time',600,'hr',2);

-- =====================================================================
-- FULL TRIATHLON BRICKS (All 3 Disciplines)
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Full Sprint Triathlon Simulation','Complete sprint simulation: 750m swim + T1 + 20km bike + T2 + 5km run. Record total time and each split. Race effort throughout. Key pre-race confidence session. Reference: Sprint ITU standard distances.','hr','other','hard',true,85,115,ARRAY['full-triathlon','sprint','simulation','race-specific'])
RETURNING id INTO w_full_sprint;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_full_sprint,1,'warmup','time',480,'hr',2),
(w_full_sprint,2,'steady','time',4200,'hr',4),
(w_full_sprint,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Full Olympic Triathlon Simulation','Complete Olympic simulation: 1500m swim + T1 + 40km bike + T2 + 10km run. Execute race-day nutrition. All transitions included. Done 2-3 weeks before A-race. Reference: ITU Olympic standard.','hr','other','hard',true,135,195,ARRAY['full-triathlon','olympic','simulation','race-specific'])
RETURNING id INTO w_full_olympic;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_full_olympic,1,'warmup','time',720,'hr',2),
(w_full_olympic,2,'steady','time',7200,'hr',3),
(w_full_olympic,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Full Half Ironman Simulation 70.3','Complete 70.3: 1900m swim + T1 + 90km bike + T2 + 21km run. Full nutrition protocol. Done 3-4 weeks before 70.3 A-race. Conservative pacing — this is not a race. Reference: IRONMAN 70.3 standard distances.','hr','other','very_hard',true,260,370,ARRAY['full-triathlon','70.3','half-ironman','simulation'])
RETURNING id INTO w_full_hi;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_full_hi,1,'warmup','time',600,'hr',2),
(w_full_hi,2,'steady','time',14400,'hr',3),
(w_full_hi,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Sprint Triathlon Time Trial','Sprint TT against personal best. 750m + 20km + 5km. No drafting. Record T1, T2, and each discipline split. Primary benchmark session for sprint triathletes.','hr','other','hard',true,80,108,ARRAY['time-trial','sprint','benchmark','splits'])
RETURNING id INTO w_full_tt;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_full_tt,1,'warmup','time',720,'hr',2),
(w_full_tt,2,'steady','time',3900,'hr',4),
(w_full_tt,3,'cooldown','time',900,'hr',1);

-- =====================================================================
-- NEUROMUSCULAR ADAPTATION
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Dead Legs: 5x(5min Bike Surge + 1km Run)','Trains the specific muscle firing pattern from cycling to running. 5x(5min bike Z4 surge + immediate 1km run at effort). Eliminates brick heaviness through repeated adaptation. Reference: Hausswirth et al. (2000).','hr','threshold','hard',true,70,88,ARRAY['neuromuscular','dead-legs','brick-adaptation','intervals'])
RETURNING id INTO w_nm_dead;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_nm_dead,1,'warmup','time',900,'hr',2),
(w_nm_dead,2,'interval','time',300,'hr',4),
(w_nm_dead,3,'interval','time',300,'hr',4),
(w_nm_dead,4,'recovery','time',180,'hr',1),
(w_nm_dead,5,'interval','time',300,'hr',4),
(w_nm_dead,6,'interval','time',300,'hr',4),
(w_nm_dead,7,'recovery','time',180,'hr',1),
(w_nm_dead,8,'interval','time',300,'hr',4),
(w_nm_dead,9,'interval','time',300,'hr',4),
(w_nm_dead,10,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Run Form Off Bike: Cadence Over 175spm','Immediately off the bike, run at cadence over 175spm for first 10min. High cadence minimizes quad loading and reduces brick effect. Then settle into natural race cadence. Reference: Millet & Vleck (2000).','hr','other','moderate',true,60,68,ARRAY['neuromuscular','cadence','run-form','technique'])
RETURNING id INTO w_nm_cad;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_nm_cad,1,'warmup','time',600,'hr',2),
(w_nm_cad,2,'steady','time',1800,'hr',3),
(w_nm_cad,3,'steady','time',600,'hr',3),
(w_nm_cad,4,'steady','time',600,'hr',3),
(w_nm_cad,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Swim-to-Bike Aerobic Bridge','800m aerobic swim to minimal T1 to 25km aerobic bike. No rest between disciplines. Trains cardiovascular system to maintain Z2-Z3 output through the discipline change. Reference: Peeling et al. (2005).','hr','endurance','moderate',true,80,98,ARRAY['swim-bike','aerobic-bridge','endurance','pacing'])
RETURNING id INTO w_nm_bridge;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_nm_bridge,1,'warmup','time',360,'hr',2),
(w_nm_bridge,2,'steady','time',4200,'hr',3),
(w_nm_bridge,3,'cooldown','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Three-Discipline Aerobic Brick Z2','1000m swim + 30km bike + 8km run — all at Z2 aerobic intensity. Trains fat oxidation and pacing discipline across all three disciplines. Core long-course aerobic session. Reference: Couzens (2008).','hr','endurance','moderate',true,130,175,ARRAY['full-triathlon','aerobic','z2','long-course'])
RETURNING id INTO w_nm_aero;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_nm_aero,1,'warmup','time',360,'hr',2),
(w_nm_aero,2,'steady','time',6840,'hr',2),
(w_nm_aero,3,'cooldown','time',600,'hr',1);

-- =====================================================================
-- RACE PREPARATION & TAPER BRICKS
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Pre-Race Sprint Activation Brick','Race-eve activation for sprint triathlon. 200m swim + T1 + 5km bike + T2 + 1km run at race pace. Flush legs, confirm transitions, build confidence. Keep total effort under 30 min.','rpe','other','easy',true,35,30,ARRAY['pre-race','activation','sprint','taper'])
RETURNING id INTO w_rp_sprint_act;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_rp_sprint_act,1,'warmup','time',300,'hr',1),
(w_rp_sprint_act,2,'steady','time',1200,'hr',4),
(w_rp_sprint_act,3,'cooldown','time',900,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Pre-Race Olympic Activation Brick','Race-eve Olympic activation. 400m easy swim + T1 + 10km moderate bike + T2 + 2km easy run. Remove accumulated fatigue, feel transitions, prime neuromuscular system. Keep effort at Z2.','hr','other','easy',true,50,42,ARRAY['pre-race','activation','olympic','taper'])
RETURNING id INTO w_rp_olympic_act;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_rp_olympic_act,1,'warmup','time',300,'hr',1),
(w_rp_olympic_act,2,'steady','time',2400,'hr',2),
(w_rp_olympic_act,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Race-Week Brick: Short but Sharp','Midweek race-week session to maintain sharpness. 300m fast swim + T1 + 5km bike with 3x30s surges + T2 + 1km run with 2x30s strides. Short, punchy, confidence-building.','hr','other','easy',true,40,38,ARRAY['race-week','taper','sharpening','activation'])
RETURNING id INTO w_rp_sharp;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_rp_sharp,1,'warmup','time',300,'hr',1),
(w_rp_sharp,2,'steady','time',1800,'hr',3),
(w_rp_sharp,3,'cooldown','time',600,'hr',1);

-- =====================================================================
-- TRANSITION ZONE SPEED DRILLS
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T1 Time Trial: Sub-60s Challenge','Isolated T1 speed work. 10 reps of full T1 sequence (simulate wet exit, wetsuit off, helmet buckled, mount, ride 50m, return). Target average under 60s per rep. Track weekly improvement.','rpe','other','moderate',true,25,18,ARRAY['t1','time-trial','sub-60','transition-speed'])
RETURNING id INTO w_td_t1tt;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_td_t1tt,1,'warmup','time',300,'hr',1),
(w_td_t1tt,2,'interval','time',60,'hr',4),
(w_td_t1tt,3,'recovery','time',120,'hr',1),
(w_td_t1tt,4,'interval','time',540,'hr',4),
(w_td_t1tt,5,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','T2 Time Trial: Sub-45s Challenge','Isolated T2 speed work. 10 reps: flying dismount, rack, helmet off, elastic laces shoes, race belt, run 50m. Target sub-45s per rep. Expert target sub-30s. Track weekly improvement.','rpe','other','moderate',true,25,18,ARRAY['t2','time-trial','sub-45','transition-speed'])
RETURNING id INTO w_td_t2tt;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_td_t2tt,1,'warmup','time',300,'hr',1),
(w_td_t2tt,2,'interval','time',1050,'hr',4),
(w_td_t2tt,3,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Transition Zone Walk-Through','Mental and physical preparation. Walk swim exit to T1, rack location, bike path, T2, run exit. Count steps, landmarks, visualize race-pace sequence. Non-fatiguing confidence session before race day.','rpe','other','easy',true,20,8,ARRAY['transition','walk-through','mental','preparation'])
RETURNING id INTO w_td_walkthru;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_td_walkthru,1,'warmup','time',300,'hr',1),
(w_td_walkthru,2,'steady','time',900,'hr',1),
(w_td_walkthru,3,'steady','time',300,'hr',1),
(w_td_walkthru,4,'cooldown','time',180,'hr',1);

-- =====================================================================
-- OPEN WATER SPECIFIC BRICKS
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Open Water + Immediate Bike Brick','1000m open water swim (buoy navigation, sighting every 8-10 strokes) + T1 + 20km bike. Wetsuit worn. Trains real race-day swim conditions leading into bike. Reference: Open water triathlon preparation.','hr','endurance','moderate',true,75,95,ARRAY['open-water','swim-bike','brick','sighting'])
RETURNING id INTO w_ow_basic;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ow_basic,1,'warmup','time',360,'hr',2),
(w_ow_basic,2,'steady','time',3600,'hr',3),
(w_ow_basic,3,'cooldown','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Open Water Mass Start + Bike Brick','Simulates mass start: 200m sprint swim (Z5, simulate body contact), 600m moderate recovery swim, then T1 + 15km bike. Manages lactic buildup from swim start on the bike. Reference: Mass start triathlon physiology.','hr','vo2max','hard',true,55,72,ARRAY['open-water','mass-start','race-simulation','vo2max'])
RETURNING id INTO w_ow_surge;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ow_surge,1,'warmup','time',360,'hr',2),
(w_ow_surge,2,'interval','time',180,'hr',5),
(w_ow_surge,3,'steady','time',2700,'hr',3),
(w_ow_surge,4,'cooldown','time',300,'hr',2);

-- =====================================================================
-- IRONMAN SPECIFIC BRICKS
-- =====================================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Ironman Pacing Brick: 3hr Bike + 45min Run','Ironman-specific pacing. 3hr steady Z2 bike at Ironman target HR + 45min easy Z2 run. Learn to run well on very fatigued legs at conservative effort. Never go above Z3. Reference: Laursen & Rhodes (2001).','hr','endurance','very_hard',true,225,315,ARRAY['ironman','pacing','brick','long-course'])
RETURNING id INTO w_im_pace;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_im_pace,1,'warmup','time',600,'hr',2),
(w_im_pace,2,'steady','time',10800,'hr',2),
(w_im_pace,3,'steady','time',2700,'hr',2),
(w_im_pace,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('triathlon','Ironman Run-Tolerance: 2hr Bike + 2hr Walk-Run','Builds marathon capacity on Ironman-depleted legs. 2hr bike Z2 + 2hr run alternating Z1-Z2 (8 min run / 2 min walk). Replicates Ironman finish conditions. Reference: Couzens (2008) Ironman marathon management.','hr','endurance','very_hard',true,255,355,ARRAY['ironman','run-tolerance','walk-run','long-course'])
RETURNING id INTO w_im_run;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_im_run,1,'warmup','time',600,'hr',2),
(w_im_run,2,'steady','time',7200,'hr',2),
(w_im_run,3,'steady','time',7200,'hr',2),
(w_im_run,4,'cooldown','time',600,'hr',1);

END $$;
