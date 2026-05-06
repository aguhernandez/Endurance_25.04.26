/*
  # Extended Running Workout Library — 100 Workouts

  ## Summary
  Adds 100 running-specific workouts to the public library.
  All use the Banister impulse model (sport_factor for running = 1.15).

  ## Impulse Calculation
  - Sport factor (running): 1.15 — applied by the client engine
  - stored estimated_impulse = duration_h × relIntensity (pre-sport-factor)
  - HR-based: Z1=0.55, Z2=0.70, Z3=0.83, Z4=0.95, Z5=1.10
  - Pace-based: Z1=0.55, Z2=0.70, Z3=0.83, Z4=0.95, Z5=1.10

  ## Categories
  1. Easy / Recovery (15 workouts)
  2. Aerobic Endurance (20 workouts)
  3. Tempo / Threshold (20 workouts)
  4. Interval / VO2max (20 workouts)
  5. Long Run Variants (10 workouts)
  6. Hills / Strength (8 workouts)
  7. Sprint / Speed (7 workouts)
*/

DO $$
DECLARE
  r1 uuid; r2 uuid; r3 uuid; r4 uuid; r5 uuid;
  r6 uuid; r7 uuid; r8 uuid; r9 uuid; r10 uuid;
  r11 uuid; r12 uuid; r13 uuid; r14 uuid; r15 uuid;
  r16 uuid; r17 uuid; r18 uuid; r19 uuid; r20 uuid;
  r21 uuid; r22 uuid; r23 uuid; r24 uuid; r25 uuid;
  r26 uuid; r27 uuid; r28 uuid; r29 uuid; r30 uuid;
  r31 uuid; r32 uuid; r33 uuid; r34 uuid; r35 uuid;
  r36 uuid; r37 uuid; r38 uuid; r39 uuid; r40 uuid;
  r41 uuid; r42 uuid; r43 uuid; r44 uuid; r45 uuid;
  r46 uuid; r47 uuid; r48 uuid; r49 uuid; r50 uuid;
  r51 uuid; r52 uuid; r53 uuid; r54 uuid; r55 uuid;
  r56 uuid; r57 uuid; r58 uuid; r59 uuid; r60 uuid;
  r61 uuid; r62 uuid; r63 uuid; r64 uuid; r65 uuid;
  r66 uuid; r67 uuid; r68 uuid; r69 uuid; r70 uuid;
  r71 uuid; r72 uuid; r73 uuid; r74 uuid; r75 uuid;
  r76 uuid; r77 uuid; r78 uuid; r79 uuid; r80 uuid;
  r81 uuid; r82 uuid; r83 uuid; r84 uuid; r85 uuid;
  r86 uuid; r87 uuid; r88 uuid; r89 uuid; r90 uuid;
  r91 uuid; r92 uuid; r93 uuid; r94 uuid; r95 uuid;
  r96 uuid; r97 uuid; r98 uuid; r99 uuid; r100 uuid;
BEGIN

-- ============================================================
-- EASY / RECOVERY RUNS (15 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Recovery Run (30 min)','Very easy 30-min run in HRR Zone 1. Promotes blood flow, clears metabolic byproducts, and facilitates tissue repair without adding training stress.','hr','recovery','easy',true,30,12,ARRAY['recovery','z1','easy','30min'])
RETURNING id INTO r1;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r1,1,'steady','time',1620,'hr',1),(r1,2,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Active Recovery Jog (40 min)','Very easy jogging at conversational pace (HRR Z1). Active recovery between hard training sessions.','hr','recovery','easy',true,40,16,ARRAY['recovery','z1','jog','easy'])
RETURNING id INTO r2;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r2,1,'steady','time',2220,'hr',1),(r2,2,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Post-Race Flush Run (20 min)','20-min very easy run immediately after competition. Accelerates lactate clearance and promotes metabolic recovery.','hr','recovery','easy',true,20,8,ARRAY['post-race','flush','recovery','z1'])
RETURNING id INTO r3;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r3,1,'steady','time',1080,'hr',1),(r3,2,'cooldown','time',120,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Run + Drills (45 min)','Easy aerobic run incorporating running drills (A-skips, B-skips, high knees) for neuromuscular activation without load.','hr','recovery','easy',true,45,22,ARRAY['easy','drills','neuromuscular','activation','z1'])
RETURNING id INTO r4;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r4,1,'warmup','time',300,'hr',1),(r4,2,'steady','time',1800,'hr',1),(r4,3,'steady','time',300,'hr',1),(r4,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Pre-Race Easy Activation (30 min)','Easy run the day before competition. Maintains leg freshness and activates movement patterns without accumulated fatigue.','hr','recovery','easy',true,30,14,ARRAY['pre-race','activation','easy','taper','z1'])
RETURNING id INTO r5;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r5,1,'warmup','time',300,'hr',1),(r5,2,'steady','time',1200,'hr',1),(r5,3,'steady','time',120,'hr',2),(r5,4,'recovery','time',120,'hr',1),(r5,5,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Ultra-Easy Jog (25 min)','Minimal-stress movement session for days requiring active rest. Barely above walking pace.','hr','recovery','easy',true,25,10,ARRAY['ultra-easy','recovery','z1','minimal-stress'])
RETURNING id INTO r6;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r6,1,'steady','time',1380,'hr',1),(r6,2,'cooldown','time',120,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Recovery Run + Strides (35 min)','Easy recovery run with 4 short 20-second strides at the end. Neuromuscular activation without aerobic fatigue load.','hr','recovery','easy',true,35,18,ARRAY['recovery','strides','z1','neuromuscular'])
RETURNING id INTO r7;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r7,1,'steady','time',1500,'hr',1),(r7,2,'interval','time',20,'pace',5),(r7,3,'recovery','time',60,'hr',1),(r7,4,'interval','time',20,'pace',5),(r7,5,'recovery','time',60,'hr',1),(r7,6,'interval','time',20,'pace',5),(r7,7,'recovery','time',60,'hr',1),(r7,8,'interval','time',20,'pace',5),(r7,9,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Morning Easy Run (50 min)','Easy morning run at purely aerobic pace. 50 minutes at HRR Zone 1-2 for daily aerobic stimulus.','hr','recovery','easy',true,50,26,ARRAY['morning','easy','z1','z2','daily'])
RETURNING id INTO r8;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r8,1,'warmup','time',300,'hr',1),(r8,2,'steady','time',2400,'hr',2),(r8,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Return From Injury Easy Run (20 min)','Gentle 20-min run for return-to-training. Sub-conversational pace. Monitor for any discomfort and stop immediately if pain occurs.','hr','recovery','easy',true,20,8,ARRAY['return-to-run','injury','easy','z1','rehab'])
RETURNING id INTO r9;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r9,1,'steady','time',1080,'hr',1),(r9,2,'cooldown','time',120,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Two-a-Day Easy Second Run (30 min)','Light second daily run for high-volume training blocks. Accumulates volume without significant neuromuscular load.','hr','recovery','easy',true,30,14,ARRAY['2aday','easy','z1','volume','double'])
RETURNING id INTO r10;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r10,1,'steady','time',1620,'hr',1),(r10,2,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Z2 Run (45 min)','Comfortable 45-min run at Z2 (50-60% HRR). Foundation run for building aerobic base.','hr','recovery','easy',true,45,22,ARRAY['z2','easy','45min','aerobic','base'])
RETURNING id INTO r11;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r11,1,'warmup','time',300,'hr',1),(r11,2,'steady','time',2100,'hr',2),(r11,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Week 1 Easy Introductory Run (25 min)','Introductory easy run for beginners or early training blocks. Building run tolerance gradually.','hr','recovery','easy',true,25,11,ARRAY['beginner','introductory','easy','z1','start'])
RETURNING id INTO r12;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r12,1,'warmup','time',180,'hr',1),(r12,2,'steady','time',1200,'hr',1),(r12,3,'cooldown','time',120,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Post-Long Run Recovery Jog (30 min)','Very easy jog the day after a long run. Maintains movement while facilitating glycogen replenishment and muscle repair.','hr','recovery','easy',true,30,12,ARRAY['post-long-run','recovery','jog','z1'])
RETURNING id INTO r13;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r13,1,'steady','time',1620,'hr',1),(r13,2,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Run + Breathing Focus (40 min)','Easy aerobic run emphasizing nasal breathing. Restricts intensity naturally to ensure true Zone 1-2 effort.','hr','recovery','easy',true,40,18,ARRAY['easy','breathing','nasal','z1','relaxed'])
RETURNING id INTO r14;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r14,1,'steady','time',2100,'hr',1),(r14,2,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Shakeout Run (15 min)','Very short pre-race morning shakeout. Loosens legs, activates nervous system, without any fatigue accumulation.','hr','recovery','easy',true,15,6,ARRAY['shakeout','pre-race','morning','z1','race-day'])
RETURNING id INTO r15;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r15,1,'steady','time',780,'hr',1),(r15,2,'cooldown','time',120,'hr',1);

-- ============================================================
-- AEROBIC ENDURANCE (20 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Base Run (60 min)','60-minute run at HRR Zone 2. Core aerobic development session for building running-specific mitochondrial density.','hr','endurance','easy',true,60,34,ARRAY['z2','aerobic','60min','base','hr'])
RETURNING id INTO r16;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r16,1,'warmup','time',300,'hr',1),(r16,2,'steady','time',3000,'hr',2),(r16,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Zone 2 Run (75 min)','Extended 75-min aerobic base run. Medium-distance foundation run for weekly training structure.','hr','endurance','easy',true,75,42,ARRAY['z2','aerobic','75min','endurance','hr'])
RETURNING id INTO r17;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r17,1,'warmup','time',300,'hr',1),(r17,2,'steady','time',3900,'hr',2),(r17,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Steady Aerobic Run (50 min)','50-min steady aerobic run at comfortable conversational pace. Building aerobic volume.','hr','endurance','easy',true,50,28,ARRAY['z2','steady','50min','aerobic','base'])
RETURNING id INTO r18;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r18,1,'warmup','time',300,'hr',1),(r18,2,'steady','time',2400,'hr',2),(r18,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Progressive Aerobic Build (60 min)','60-min run with progressive increase: first 20 min at Z1, middle 20 min at low Z2, last 20 min at upper Z2.','hr','endurance','easy',true,60,34,ARRAY['progressive','aerobic','build','z2','hr'])
RETURNING id INTO r19;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r19,1,'warmup','time',300,'hr',1),(r19,2,'steady','time',1200,'hr',1),(r19,3,'steady','time',1200,'hr',2),(r19,4,'steady','time',1200,'hr',2),(r19,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Run with Pickups (55 min)','Aerobic base run with 6 brief 1-min accelerations to Z3. Develops aerobic-threshold connection without threshold load.','hr','endurance','moderate',true,55,34,ARRAY['aerobic','pickups','z2','z3','hr'])
RETURNING id INTO r20;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r20,1,'warmup','time',300,'hr',1),(r20,2,'steady','time',600,'hr',2),(r20,3,'interval','time',60,'hr',3),(r20,4,'steady','time',600,'hr',2),(r20,5,'interval','time',60,'hr',3),(r20,6,'steady','time',600,'hr',2),(r20,7,'interval','time',60,'hr',3),(r20,8,'steady','time',600,'hr',2),(r20,9,'interval','time',60,'hr',3),(r20,10,'steady','time',600,'hr',2),(r20,11,'interval','time',60,'hr',3),(r20,12,'steady','time',600,'hr',2),(r20,13,'interval','time',60,'hr',3),(r20,14,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Mid-Week Aerobic Base (65 min)','Mid-week maintenance run at Z2. Provides aerobic stimulus between key sessions without excessive fatigue.','hr','endurance','easy',true,65,36,ARRAY['mid-week','z2','maintenance','aerobic','hr'])
RETURNING id INTO r21;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r21,1,'warmup','time',300,'hr',1),(r21,2,'steady','time',3300,'hr',2),(r21,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Negative Split Run (60 min)','First 30 min at lower Z2, second 30 min at upper Z2. Negative split format trains pace calibration and metabolic flexibility.','hr','endurance','moderate',true,60,36,ARRAY['negative-split','z2','aerobic','pacing','hr'])
RETURNING id INTO r22;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r22,1,'warmup','time',300,'hr',1),(r22,2,'steady','time',1500,'hr',2),(r22,3,'steady','time',1500,'hr',2),(r22,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Run With Strides (50 min)','Easy aerobic base with 8 × 20-sec strides after. Builds running economy and neuromuscular sharpness within aerobic context.','hr','endurance','easy',true,50,30,ARRAY['aerobic','strides','z2','economy','hr'])
RETURNING id INTO r23;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r23,1,'warmup','time',300,'hr',1),(r23,2,'steady','time',2100,'hr',2),(r23,3,'interval','time',20,'pace',5),(r23,4,'recovery','time',50,'hr',1),(r23,5,'interval','time',20,'pace',5),(r23,6,'recovery','time',50,'hr',1),(r23,7,'interval','time',20,'pace',5),(r23,8,'recovery','time',50,'hr',1),(r23,9,'interval','time',20,'pace',5),(r23,10,'recovery','time',50,'hr',1),(r23,11,'interval','time',20,'pace',5),(r23,12,'recovery','time',50,'hr',1),(r23,13,'interval','time',20,'pace',5),(r23,14,'recovery','time',50,'hr',1),(r23,15,'interval','time',20,'pace',5),(r23,16,'recovery','time',50,'hr',1),(r23,17,'interval','time',20,'pace',5),(r23,18,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Tempo Transition Run (55 min)','Aerobic run escalating to Z3 in the final 15 minutes. Trains the physiological shift from fat-burning to lactate-clearing metabolism.','hr','endurance','moderate',true,55,34,ARRAY['aerobic','z3','transition','tempo-end','hr'])
RETURNING id INTO r24;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r24,1,'warmup','time',300,'hr',1),(r24,2,'steady','time',2100,'hr',2),(r24,3,'steady','time',900,'hr',3),(r24,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Polarized Easy Run (80 min)','Long easy run strictly at or below Z2 following polarized model. 80% of polarized training should be at this intensity.','hr','endurance','moderate',true,80,46,ARRAY['polarized','easy','z2','80min','aerobic'])
RETURNING id INTO r25;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r25,1,'warmup','time',300,'hr',1),(r25,2,'steady','time',4200,'hr',2),(r25,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Endurance Run Z2 (90 min)','90-minute aerobic base run. Extended aerobic stimulus for building mitochondrial density and fat-oxidation capacity.','hr','endurance','moderate',true,90,54,ARRAY['z2','90min','aerobic','endurance','hr'])
RETURNING id INTO r26;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r26,1,'warmup','time',300,'hr',1),(r26,2,'steady','time',5100,'hr',2),(r26,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Fartlek Run (50 min)','Unstructured fartlek with spontaneous accelerations within aerobic range. Develops aerobic range and reduces training monotony.','hr','endurance','moderate',true,50,30,ARRAY['fartlek','aerobic','z2','unstructured','hr'])
RETURNING id INTO r27;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r27,1,'warmup','time',300,'hr',1),(r27,2,'steady','time',480,'hr',2),(r27,3,'interval','time',120,'hr',3),(r27,4,'steady','time',480,'hr',2),(r27,5,'interval','time',90,'hr',3),(r27,6,'steady','time',480,'hr',2),(r27,7,'interval','time',150,'hr',3),(r27,8,'steady','time',480,'hr',2),(r27,9,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Double Easy Run (2×30 min)','Two 30-minute easy runs in the same day. Builds volume through frequency rather than single-session load.','hr','endurance','easy',true,60,26,ARRAY['double','easy','z1','volume','frequency'])
RETURNING id INTO r28;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r28,1,'warmup','time',180,'hr',1),(r28,2,'steady','time',1440,'hr',1),(r28,3,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Conversational Pace Long Aerobic (100 min)','100-min easy to moderate aerobic run. Strictly conversational; partner can easily hold full sentences throughout.','hr','endurance','moderate',true,100,60,ARRAY['conversational','aerobic','long','z2','100min'])
RETURNING id INTO r29;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r29,1,'warmup','time',300,'hr',1),(r29,2,'steady','time',5400,'hr',2),(r29,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Variable Pace Aerobic Run (60 min)','60-min aerobic run with 4 deliberate 4-min pushes to Z3. Develops capacity to vary pace within an aerobic context.','hr','endurance','moderate',true,60,36,ARRAY['variable','z2','z3','aerobic','60min'])
RETURNING id INTO r30;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r30,1,'warmup','time',300,'hr',1),(r30,2,'steady','time',600,'hr',2),(r30,3,'steady','time',240,'hr',3),(r30,4,'steady','time',600,'hr',2),(r30,5,'steady','time',240,'hr',3),(r30,6,'steady','time',600,'hr',2),(r30,7,'steady','time',240,'hr',3),(r30,8,'steady','time',600,'hr',2),(r30,9,'steady','time',240,'hr',3),(r30,10,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Hill Walk-Run (60 min)','Easy aerobic run on hilly terrain. Walk uphills to maintain HR in Z2; run the flat and downhills. Builds leg strength with aerobic stimulus.','hr','endurance','easy',true,60,32,ARRAY['hills','walk-run','aerobic','z2','terrain'])
RETURNING id INTO r31;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r31,1,'warmup','time',300,'hr',1),(r31,2,'steady','time',3000,'hr',2),(r31,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Trail Run (75 min)','Easy trail run at aerobic pace. Natural terrain variation provides proprioceptive training and lower-body strengthening within low HR context.','hr','endurance','easy',true,75,40,ARRAY['trail','aerobic','z2','terrain','75min'])
RETURNING id INTO r32;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r32,1,'warmup','time',300,'hr',1),(r32,2,'steady','time',3900,'hr',2),(r32,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Heart Rate Cap Run (70 min)','70-min run with strict HR cap at Z2 ceiling. Deliberately slow on uphills to stay aerobic. Measures fitness by pace at given HR over time.','hr','endurance','easy',true,70,38,ARRAY['hr-cap','z2','aerobic','pacing','discipline'])
RETURNING id INTO r33;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r33,1,'warmup','time',300,'hr',1),(r33,2,'steady','time',3600,'hr',2),(r33,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','General Aerobic Run (55 min)','General purpose aerobic run at comfortable but purposeful pace. Suitable for most training days in moderate training blocks.','hr','endurance','easy',true,55,32,ARRAY['general','aerobic','z2','comfortable','55min'])
RETURNING id INTO r34;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r34,1,'warmup','time',300,'hr',1),(r34,2,'steady','time',2700,'hr',2),(r34,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Early Season Aerobic Base (40 min)','Short early-season aerobic run. Conservative approach to building run tolerance and aerobic base.','hr','endurance','easy',true,40,20,ARRAY['early-season','base','z2','conservative','40min'])
RETURNING id INTO r35;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r35,1,'warmup','time',300,'hr',1),(r35,2,'steady','time',1800,'hr',2),(r35,3,'cooldown','time',300,'hr',1);

-- ============================================================
-- TEMPO / THRESHOLD (20 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Run 20 min Continuous (40 min)','20-min continuous tempo at LTHR Zone 4. Classic lactate threshold development session.','hr','threshold','moderate',true,40,40,ARRAY['tempo','z4','lthr','20min','threshold'])
RETURNING id INTO r36;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r36,1,'warmup','time',600,'hr',2),(r36,2,'steady','time',1200,'hr',4),(r36,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Run 25 min Continuous (50 min)','25-min continuous tempo. Extended version for more experienced threshold runners.','hr','threshold','moderate',true,50,48,ARRAY['tempo','z4','lthr','25min','threshold'])
RETURNING id INTO r37;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r37,1,'warmup','time',600,'hr',2),(r37,2,'steady','time',1500,'hr',4),(r37,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Run 30 min Continuous (55 min)','30-min continuous tempo at LTHR. Develops sustained threshold capacity.','hr','threshold','hard',true,55,56,ARRAY['tempo','z4','30min','lthr','sustained'])
RETURNING id INTO r38;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r38,1,'warmup','time',600,'hr',2),(r38,2,'steady','time',1800,'hr',4),(r38,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Cruise Intervals 4×8 min (55 min)','Four 8-min cruise intervals at threshold HR. Short rest allows higher total threshold volume.','hr','threshold','hard',true,55,54,ARRAY['cruise','intervals','z4','threshold','4x8'])
RETURNING id INTO r39;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r39,1,'warmup','time',600,'hr',2),(r39,2,'interval','time',480,'hr',4),(r39,3,'recovery','time',90,'hr',2),(r39,4,'interval','time',480,'hr',4),(r39,5,'recovery','time',90,'hr',2),(r39,6,'interval','time',480,'hr',4),(r39,7,'recovery','time',90,'hr',2),(r39,8,'interval','time',480,'hr',4),(r39,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Cruise 3×12 min (60 min)','Three 12-min threshold cruise intervals. Builds total threshold volume with structured recovery.','hr','threshold','hard',true,60,58,ARRAY['cruise','3x12','threshold','z4','hr'])
RETURNING id INTO r40;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r40,1,'warmup','time',600,'hr',2),(r40,2,'interval','time',720,'hr',4),(r40,3,'recovery','time',120,'hr',2),(r40,4,'interval','time',720,'hr',4),(r40,5,'recovery','time',120,'hr',2),(r40,6,'interval','time',720,'hr',4),(r40,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Lactate Threshold Progression Run (60 min)','Start Z2, build progressively to reach full Z4 in the final 15 min. Trains the physiological progression into and through threshold.','hr','threshold','hard',true,60,54,ARRAY['threshold','progression','z2-z4','lactate','hr'])
RETURNING id INTO r41;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r41,1,'warmup','time',300,'hr',1),(r41,2,'steady','time',1200,'hr',2),(r41,3,'steady','time',900,'hr',3),(r41,4,'steady','time',900,'hr',4),(r41,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Broken Tempo 6×6 min (60 min)','Six 6-min tempo blocks with 2-min jog recovery. High total threshold volume through broken-tempo format.','hr','threshold','hard',true,60,58,ARRAY['broken-tempo','6x6','threshold','z4','hr'])
RETURNING id INTO r42;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r42,1,'warmup','time',600,'hr',2),(r42,2,'interval','time',360,'hr',4),(r42,3,'recovery','time',120,'hr',2),(r42,4,'interval','time',360,'hr',4),(r42,5,'recovery','time',120,'hr',2),(r42,6,'interval','time',360,'hr',4),(r42,7,'recovery','time',120,'hr',2),(r42,8,'interval','time',360,'hr',4),(r42,9,'recovery','time',120,'hr',2),(r42,10,'interval','time',360,'hr',4),(r42,11,'recovery','time',120,'hr',2),(r42,12,'interval','time',360,'hr',4),(r42,13,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Marathon Pace Run 40 min (60 min)','40-min sustained marathon pace at low Z4 / high Z3 HRR. Develops the metabolic adaptations needed for marathon racing.','hr','threshold','moderate',true,60,52,ARRAY['marathon','z3-z4','40min','pace','threshold'])
RETURNING id INTO r43;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r43,1,'warmup','time',600,'hr',2),(r43,2,'steady','time',2400,'hr',3),(r43,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Tempo Ladder 5-10-15-10-5 min (70 min)','Ascending and descending tempo blocks. Develops range within threshold zone and teaches pacing adjustment while fatigued.','hr','threshold','hard',true,70,64,ARRAY['tempo','ladder','threshold','z4','hr'])
RETURNING id INTO r44;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r44,1,'warmup','time',600,'hr',2),(r44,2,'interval','time',300,'hr',4),(r44,3,'recovery','time',120,'hr',2),(r44,4,'interval','time',600,'hr',4),(r44,5,'recovery','time',150,'hr',2),(r44,6,'interval','time',900,'hr',4),(r44,7,'recovery','time',150,'hr',2),(r44,8,'interval','time',600,'hr',4),(r44,9,'recovery','time',120,'hr',2),(r44,10,'interval','time',300,'hr',4),(r44,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Threshold Z3 Block (50 min)','Continuous 30-min run at HRR Zone 3 (aerobic threshold). Improves lactate clearance at sub-LTHR intensities.','hr','threshold','moderate',true,50,44,ARRAY['aerobic-threshold','z3','30min','hr','sustained'])
RETURNING id INTO r45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r45,1,'warmup','time',600,'hr',2),(r45,2,'steady','time',1800,'hr',3),(r45,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Half Marathon Pace Run 35 min (55 min)','35-min run at half marathon race pace (HRR Z3-Z4 boundary). Race-specific stimulus for half marathon development.','hr','threshold','moderate',true,55,50,ARRAY['half-marathon','race-pace','z3-z4','35min','hr'])
RETURNING id INTO r46;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r46,1,'warmup','time',600,'hr',2),(r46,2,'steady','time',2100,'hr',4),(r46,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold 5-min Repeats 6× (55 min)','Six 5-min threshold repeats with 90-sec jog recovery. Develops LTHR and running economy simultaneously.','hr','threshold','hard',true,55,54,ARRAY['threshold','5min','6x','z4','hr'])
RETURNING id INTO r47;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r47,1,'warmup','time',600,'hr',2),(r47,2,'interval','time',300,'hr',4),(r47,3,'recovery','time',90,'hr',2),(r47,4,'interval','time',300,'hr',4),(r47,5,'recovery','time',90,'hr',2),(r47,6,'interval','time',300,'hr',4),(r47,7,'recovery','time',90,'hr',2),(r47,8,'interval','time',300,'hr',4),(r47,9,'recovery','time',90,'hr',2),(r47,10,'interval','time',300,'hr',4),(r47,11,'recovery','time',90,'hr',2),(r47,12,'interval','time',300,'hr',4),(r47,13,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Over-Under Fartlek (50 min)','Alternating efforts above and below LTHR in a fartlek format. Trains lactate buffering and clearance simultaneously.','hr','threshold','hard',true,50,48,ARRAY['over-under','fartlek','threshold','z4','hr'])
RETURNING id INTO r48;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r48,1,'warmup','time',600,'hr',2),(r48,2,'interval','time',360,'hr',4),(r48,3,'steady','time',120,'hr',3),(r48,4,'interval','time',360,'hr',4),(r48,5,'steady','time',120,'hr',3),(r48,6,'interval','time',360,'hr',4),(r48,7,'steady','time',120,'hr',3),(r48,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Z3 Steady + Z4 Tempo (60 min)','Warm aerobic effort followed by sharp tempo block. Transitions between aerobic threshold (Z3) and lactate threshold (Z4).','hr','threshold','hard',true,60,52,ARRAY['z3','z4','combo','threshold','hr'])
RETURNING id INTO r49;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r49,1,'warmup','time',300,'hr',1),(r49,2,'steady','time',1200,'hr',3),(r49,3,'interval','time',1200,'hr',4),(r49,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','10K Race Pace Run 20 min (45 min)','20-min sustained 10K race pace effort. Develops the specific physiological adaptations required for 10 km racing.','hr','threshold','hard',true,45,44,ARRAY['10k','race-pace','z4-z5','20min','hr'])
RETURNING id INTO r50;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r50,1,'warmup','time',600,'hr',2),(r50,2,'steady','time',1200,'hr',5),(r50,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Endurance Combo 2×15 min (55 min)','Two 15-min threshold blocks with 4-min jog between. Classic dual-block threshold workout.','hr','threshold','hard',true,55,54,ARRAY['threshold','2x15','z4','combo','hr'])
RETURNING id INTO r51;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r51,1,'warmup','time',600,'hr',2),(r51,2,'interval','time',900,'hr',4),(r51,3,'recovery','time',240,'hr',2),(r51,4,'interval','time',900,'hr',4),(r51,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic + Threshold Long Combo (70 min)','35 min aerobic followed by 20 min threshold. Tests threshold power under aerobic pre-fatigue.','hr','threshold','hard',true,70,62,ARRAY['threshold','aerobic','combo','z2-z4','70min'])
RETURNING id INTO r52;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r52,1,'warmup','time',300,'hr',1),(r52,2,'steady','time',2100,'hr',2),(r52,3,'interval','time',1200,'hr',4),(r52,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Half Marathon Simulation Run (75 min)','75-min run simulating half marathon effort distribution: Z2 for first 50 min, building to Z3-Z4 finish.','hr','threshold','hard',true,75,62,ARRAY['half-marathon','simulation','z2-z4','75min','race'])
RETURNING id INTO r53;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r53,1,'warmup','time',300,'hr',1),(r53,2,'steady','time',2400,'hr',2),(r53,3,'steady','time',900,'hr',3),(r53,4,'steady','time',600,'hr',4),(r53,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold Mile Repeats 5×1 mile (65 min)','Five 1-mile threshold repeats at LTHR. Classic threshold development format emphasizing sustained high-aerobic effort.','hr','threshold','hard',true,65,62,ARRAY['mile','threshold','5x','z4','hr'])
RETURNING id INTO r54;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r54,1,'warmup','time',600,'hr',2),(r54,2,'interval','time',360,'hr',4),(r54,3,'recovery','time',120,'hr',2),(r54,4,'interval','time',360,'hr',4),(r54,5,'recovery','time',120,'hr',2),(r54,6,'interval','time',360,'hr',4),(r54,7,'recovery','time',120,'hr',2),(r54,8,'interval','time',360,'hr',4),(r54,9,'recovery','time',120,'hr',2),(r54,10,'interval','time',360,'hr',4),(r54,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Threshold + Aerobic Finish (65 min)','Threshold block early in the run while fresh, followed by extended aerobic volume.','hr','threshold','moderate',true,65,56,ARRAY['threshold','aerobic-finish','z4','z2','combo'])
RETURNING id INTO r55;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r55,1,'warmup','time',600,'hr',2),(r55,2,'interval','time',1200,'hr',4),(r55,3,'recovery','time',300,'hr',2),(r55,4,'steady','time',1800,'hr',2),(r55,5,'cooldown','time',600,'hr',1);

-- ============================================================
-- INTERVAL / VO2MAX (20 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max 3×3 min (40 min)','Three 3-min VO2max efforts at HRR Z5. Entry-level VO2max session with full recovery between efforts.','hr','vo2max','hard',true,40,40,ARRAY['vo2max','3x3','z5','intervals','hr'])
RETURNING id INTO r56;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r56,1,'warmup','time',600,'hr',2),(r56,2,'interval','time',180,'hr',5),(r56,3,'recovery','time',300,'hr',2),(r56,4,'interval','time',180,'hr',5),(r56,5,'recovery','time',300,'hr',2),(r56,6,'interval','time',180,'hr',5),(r56,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max 5×3 min Short Rest (50 min)','Five 3-min VO2max efforts with 3-min recovery. Classic VO2max interval session targeting maximal aerobic power.','hr','vo2max','very_hard',true,50,52,ARRAY['vo2max','5x3','z5','intervals','hr'])
RETURNING id INTO r57;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r57,1,'warmup','time',600,'hr',2),(r57,2,'interval','time',180,'hr',5),(r57,3,'recovery','time',180,'hr',2),(r57,4,'interval','time',180,'hr',5),(r57,5,'recovery','time',180,'hr',2),(r57,6,'interval','time',180,'hr',5),(r57,7,'recovery','time',180,'hr',2),(r57,8,'interval','time',180,'hr',5),(r57,9,'recovery','time',180,'hr',2),(r57,10,'interval','time',180,'hr',5),(r57,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max 4×4 min Seiler Running (55 min)','Four 4-min VO2max efforts at HRR Z5 with 3-min active recovery. Running adaptation of Seiler 4×4 protocol.','hr','vo2max','very_hard',true,55,56,ARRAY['vo2max','4x4','seiler','z5','hr'])
RETURNING id INTO r58;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r58,1,'warmup','time',600,'hr',2),(r58,2,'interval','time',240,'hr',5),(r58,3,'recovery','time',180,'hr',2),(r58,4,'interval','time',240,'hr',5),(r58,5,'recovery','time',180,'hr',2),(r58,6,'interval','time',240,'hr',5),(r58,7,'recovery','time',180,'hr',2),(r58,8,'interval','time',240,'hr',5),(r58,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','1000m Track Repeats 5×1000m (55 min)','Five 1000m track repeats at 5K race pace or VO2max pace. Classic Jack Daniels interval format.','pace','vo2max','hard',true,55,58,ARRAY['1000m','track','5x','pace','vo2max'])
RETURNING id INTO r59;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r59,1,'warmup','time',600,'pace',2),(r59,2,'interval','time',240,'pace',5),(r59,3,'recovery','time',180,'pace',1),(r59,4,'interval','time',240,'pace',5),(r59,5,'recovery','time',180,'pace',1),(r59,6,'interval','time',240,'pace',5),(r59,7,'recovery','time',180,'pace',1),(r59,8,'interval','time',240,'pace',5),(r59,9,'recovery','time',180,'pace',1),(r59,10,'interval','time',240,'pace',5),(r59,11,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','400m Track Repeats 8×400m (45 min)','Eight 400m repeats at 5K pace or faster. Develops speed-endurance, lactate tolerance, and running economy.','pace','vo2max','hard',true,45,46,ARRAY['400m','track','8x','pace','speed-endurance'])
RETURNING id INTO r60;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r60,1,'warmup','time',600,'pace',2),(r60,2,'interval','time',90,'pace',5),(r60,3,'recovery','time',90,'pace',1),(r60,4,'interval','time',90,'pace',5),(r60,5,'recovery','time',90,'pace',1),(r60,6,'interval','time',90,'pace',5),(r60,7,'recovery','time',90,'pace',1),(r60,8,'interval','time',90,'pace',5),(r60,9,'recovery','time',90,'pace',1),(r60,10,'interval','time',90,'pace',5),(r60,11,'recovery','time',90,'pace',1),(r60,12,'interval','time',90,'pace',5),(r60,13,'recovery','time',90,'pace',1),(r60,14,'interval','time',90,'pace',5),(r60,15,'recovery','time',90,'pace',1),(r60,16,'interval','time',90,'pace',5),(r60,17,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','800m Repeats 6×800m (50 min)','Six 800m repeats at VO2max pace (MAS). Develops maximal aerobic speed in a high-quality format.','pace','vo2max','hard',true,50,52,ARRAY['800m','repeats','6x','vo2max','pace'])
RETURNING id INTO r61;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r61,1,'warmup','time',600,'pace',2),(r61,2,'interval','time',200,'pace',5),(r61,3,'recovery','time',200,'pace',1),(r61,4,'interval','time',200,'pace',5),(r61,5,'recovery','time',200,'pace',1),(r61,6,'interval','time',200,'pace',5),(r61,7,'recovery','time',200,'pace',1),(r61,8,'interval','time',200,'pace',5),(r61,9,'recovery','time',200,'pace',1),(r61,10,'interval','time',200,'pace',5),(r61,11,'recovery','time',200,'pace',1),(r61,12,'interval','time',200,'pace',5),(r61,13,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Billat 30-30 Running (40 min)','Billat 30s/30s VO2max intervals at 110% MAS with 30s active recovery at 60% MAS. Maximizes time at VO2max.','pace','vo2max','hard',true,40,44,ARRAY['billat','30-30','vo2max','pace','MAS'])
RETURNING id INTO r62;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r62,1,'warmup','time',600,'pace',2),(r62,2,'interval','time',30,'pace',5),(r62,3,'recovery','time',30,'pace',2),(r62,4,'interval','time',30,'pace',5),(r62,5,'recovery','time',30,'pace',2),(r62,6,'interval','time',30,'pace',5),(r62,7,'recovery','time',30,'pace',2),(r62,8,'interval','time',30,'pace',5),(r62,9,'recovery','time',30,'pace',2),(r62,10,'interval','time',30,'pace',5),(r62,11,'recovery','time',30,'pace',2),(r62,12,'interval','time',30,'pace',5),(r62,13,'recovery','time',30,'pace',2),(r62,14,'interval','time',30,'pace',5),(r62,15,'recovery','time',30,'pace',2),(r62,16,'interval','time',30,'pace',5),(r62,17,'recovery','time',30,'pace',2),(r62,18,'interval','time',30,'pace',5),(r62,19,'recovery','time',30,'pace',2),(r62,20,'interval','time',30,'pace',5),(r62,21,'recovery','time',300,'pace',1),(r62,22,'interval','time',30,'pace',5),(r62,23,'recovery','time',30,'pace',2),(r62,24,'interval','time',30,'pace',5),(r62,25,'recovery','time',30,'pace',2),(r62,26,'interval','time',30,'pace',5),(r62,27,'recovery','time',30,'pace',2),(r62,28,'interval','time',30,'pace',5),(r62,29,'recovery','time',30,'pace',2),(r62,30,'interval','time',30,'pace',5),(r62,31,'recovery','time',30,'pace',2),(r62,32,'interval','time',30,'pace',5),(r62,33,'recovery','time',30,'pace',2),(r62,34,'interval','time',30,'pace',5),(r62,35,'recovery','time',30,'pace',2),(r62,36,'interval','time',30,'pace',5),(r62,37,'recovery','time',30,'pace',2),(r62,38,'interval','time',30,'pace',5),(r62,39,'recovery','time',30,'pace',2),(r62,40,'interval','time',30,'pace',5),(r62,41,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max 2 km Repeats 3×2 km (50 min)','Three 2 km repeats at VO2max pace. Extended distance per repeat maximizes time at VO2max per interval.','pace','vo2max','very_hard',true,50,54,ARRAY['2km','3x','vo2max','pace','long-repeats'])
RETURNING id INTO r63;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r63,1,'warmup','time',600,'pace',2),(r63,2,'interval','time',480,'pace',5),(r63,3,'recovery','time',360,'pace',1),(r63,4,'interval','time',480,'pace',5),(r63,5,'recovery','time',360,'pace',1),(r63,6,'interval','time',480,'pace',5),(r63,7,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','5K Race Simulation (30 min)','Simulate complete 5K race effort. Start controlled and build to maximal sustainable pace over the last 2 km.','pace','vo2max','very_hard',true,30,34,ARRAY['5k','race','simulation','pace','vo2max'])
RETURNING id INTO r64;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r64,1,'warmup','time',300,'pace',2),(r64,2,'interval','time',600,'pace',4),(r64,3,'interval','time',600,'pace',5),(r64,4,'interval','time',300,'pace',5),(r64,5,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Norwegian Double Threshold Run (60 min)','Two threshold blocks separated by easy running. Norwegian elite approach to doubling threshold stimulus.','hr','vo2max','hard',true,60,56,ARRAY['norwegian','double-threshold','z4','hr','elite'])
RETURNING id INTO r65;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r65,1,'warmup','time',600,'hr',2),(r65,2,'interval','time',1200,'hr',4),(r65,3,'recovery','time',480,'hr',2),(r65,4,'interval','time',1200,'hr',4),(r65,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','200m Speed Repeats 10×200m (40 min)','Ten 200m very fast repeats. Develops speed, neuromuscular efficiency, and running economy at high velocity.','pace','vo2max','hard',true,40,40,ARRAY['200m','10x','speed','pace','economy'])
RETURNING id INTO r66;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r66,1,'warmup','time',600,'pace',2),(r66,2,'interval','time',40,'pace',5),(r66,3,'recovery','time',120,'pace',1),(r66,4,'interval','time',40,'pace',5),(r66,5,'recovery','time',120,'pace',1),(r66,6,'interval','time',40,'pace',5),(r66,7,'recovery','time',120,'pace',1),(r66,8,'interval','time',40,'pace',5),(r66,9,'recovery','time',120,'pace',1),(r66,10,'interval','time',40,'pace',5),(r66,11,'recovery','time',120,'pace',1),(r66,12,'interval','time',40,'pace',5),(r66,13,'recovery','time',120,'pace',1),(r66,14,'interval','time',40,'pace',5),(r66,15,'recovery','time',120,'pace',1),(r66,16,'interval','time',40,'pace',5),(r66,17,'recovery','time',120,'pace',1),(r66,18,'interval','time',40,'pace',5),(r66,19,'recovery','time',120,'pace',1),(r66,20,'interval','time',40,'pace',5),(r66,21,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Track Pyramid 200-400-600-800-600-400-200 m (50 min)','Distance pyramid on track at 3-5 km pace. Develops speed-endurance, lactate tolerance, and mental toughness.','pace','vo2max','very_hard',true,50,54,ARRAY['track','pyramid','pace','speed-endurance','vo2max'])
RETURNING id INTO r67;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r67,1,'warmup','time',600,'pace',2),(r67,2,'interval','time',40,'pace',5),(r67,3,'recovery','time',40,'pace',1),(r67,4,'interval','time',90,'pace',5),(r67,5,'recovery','time',90,'pace',1),(r67,6,'interval','time',150,'pace',5),(r67,7,'recovery','time',150,'pace',1),(r67,8,'interval','time',200,'pace',5),(r67,9,'recovery','time',200,'pace',1),(r67,10,'interval','time',150,'pace',5),(r67,11,'recovery','time',150,'pace',1),(r67,12,'interval','time',90,'pace',5),(r67,13,'recovery','time',90,'pace',1),(r67,14,'interval','time',40,'pace',5),(r67,15,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Ascending 1-2-3-4-3-2-1 min (55 min)','VO2max pyramid ascending then descending. Develops full range of aerobic-to-VO2max intensity spectrum.','hr','vo2max','very_hard',true,55,56,ARRAY['vo2max','pyramid','ascending','z5','hr'])
RETURNING id INTO r68;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r68,1,'warmup','time',600,'hr',2),(r68,2,'interval','time',60,'hr',5),(r68,3,'recovery','time',60,'hr',2),(r68,4,'interval','time',120,'hr',5),(r68,5,'recovery','time',120,'hr',2),(r68,6,'interval','time',180,'hr',5),(r68,7,'recovery','time',180,'hr',2),(r68,8,'interval','time',240,'hr',5),(r68,9,'recovery','time',240,'hr',2),(r68,10,'interval','time',180,'hr',5),(r68,11,'recovery','time',180,'hr',2),(r68,12,'interval','time',120,'hr',5),(r68,13,'recovery','time',120,'hr',2),(r68,14,'interval','time',60,'hr',5),(r68,15,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max 3×5 min Long (50 min)','Three 5-minute maximal aerobic efforts. Excellent time-at-VO2max per interval.','hr','vo2max','very_hard',true,50,52,ARRAY['vo2max','3x5','z5','hr','long-intervals'])
RETURNING id INTO r69;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r69,1,'warmup','time',600,'hr',2),(r69,2,'interval','time',300,'hr',5),(r69,3,'recovery','time',300,'hr',2),(r69,4,'interval','time',300,'hr',5),(r69,5,'recovery','time',300,'hr',2),(r69,6,'interval','time',300,'hr',5),(r69,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','8×600m Speed Endurance (55 min)','Eight 600m repeats at 3K-5K race pace. Excellent speed-endurance development for 5K-10K runners.','pace','vo2max','hard',true,55,56,ARRAY['600m','8x','speed-endurance','pace','3-5k'])
RETURNING id INTO r70;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r70,1,'warmup','time',600,'pace',2),(r70,2,'interval','time',130,'pace',5),(r70,3,'recovery','time',130,'pace',1),(r70,4,'interval','time',130,'pace',5),(r70,5,'recovery','time',130,'pace',1),(r70,6,'interval','time',130,'pace',5),(r70,7,'recovery','time',130,'pace',1),(r70,8,'interval','time',130,'pace',5),(r70,9,'recovery','time',130,'pace',1),(r70,10,'interval','time',130,'pace',5),(r70,11,'recovery','time',130,'pace',1),(r70,12,'interval','time',130,'pace',5),(r70,13,'recovery','time',130,'pace',1),(r70,14,'interval','time',130,'pace',5),(r70,15,'recovery','time',130,'pace',1),(r70,16,'interval','time',130,'pace',5),(r70,17,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max + Threshold Combo Run (65 min)','VO2max intervals followed by threshold block. Develops both VO2max and lactate threshold in one session.','hr','vo2max','very_hard',true,65,64,ARRAY['vo2max','threshold','combo','z5-z4','hr'])
RETURNING id INTO r71;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r71,1,'warmup','time',600,'hr',2),(r71,2,'interval','time',180,'hr',5),(r71,3,'recovery','time',180,'hr',2),(r71,4,'interval','time',180,'hr',5),(r71,5,'recovery','time',180,'hr',2),(r71,6,'interval','time',180,'hr',5),(r71,7,'recovery','time',300,'hr',2),(r71,8,'interval','time',720,'hr',4),(r71,9,'recovery','time',300,'hr',2),(r71,10,'interval','time',720,'hr',4),(r71,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Hard Negative Split 4×4 min (55 min)','Four 4-min VO2max efforts with deliberately negative-split pacing (second half faster). Builds finishing kick.','hr','vo2max','very_hard',true,55,56,ARRAY['vo2max','negative-split','4x4','z5','hr'])
RETURNING id INTO r72;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r72,1,'warmup','time',600,'hr',2),(r72,2,'interval','time',240,'hr',5),(r72,3,'recovery','time',240,'hr',2),(r72,4,'interval','time',240,'hr',5),(r72,5,'recovery','time',240,'hr',2),(r72,6,'interval','time',240,'hr',5),(r72,7,'recovery','time',240,'hr',2),(r72,8,'interval','time',240,'hr',5),(r72,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Multistage VO2max Buildup (50 min)','Sequential VO2max buildup from short to long efforts: 2 min, 3 min, 4 min, 5 min at VO2max pace.','hr','vo2max','very_hard',true,50,52,ARRAY['vo2max','buildup','multistage','z5','hr'])
RETURNING id INTO r73;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r73,1,'warmup','time',600,'hr',2),(r73,2,'interval','time',120,'hr',5),(r73,3,'recovery','time',180,'hr',2),(r73,4,'interval','time',180,'hr',5),(r73,5,'recovery','time',240,'hr',2),(r73,6,'interval','time',240,'hr',5),(r73,7,'recovery','time',300,'hr',2),(r73,8,'interval','time',300,'hr',5),(r73,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Speed Work 6×90s Fast (45 min)','Six 90-second hard efforts at faster than 5K pace. Pure speed work for developing fast running mechanics.','pace','vo2max','hard',true,45,44,ARRAY['speed','6x90s','fast','pace','5k'])
RETURNING id INTO r74;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r74,1,'warmup','time',600,'pace',2),(r74,2,'interval','time',90,'pace',5),(r74,3,'recovery','time',180,'pace',1),(r74,4,'interval','time',90,'pace',5),(r74,5,'recovery','time',180,'pace',1),(r74,6,'interval','time',90,'pace',5),(r74,7,'recovery','time',180,'pace',1),(r74,8,'interval','time',90,'pace',5),(r74,9,'recovery','time',180,'pace',1),(r74,10,'interval','time',90,'pace',5),(r74,11,'recovery','time',180,'pace',1),(r74,12,'interval','time',90,'pace',5),(r74,13,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Tolerance Builder 8×2 min (50 min)','Eight 2-minute VO2max efforts. High repetition count builds psychological and physiological tolerance for hard running.','hr','vo2max','hard',true,50,52,ARRAY['vo2max','8x2','tolerance','z5','hr'])
RETURNING id INTO r75;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r75,1,'warmup','time',600,'hr',2),(r75,2,'interval','time',120,'hr',5),(r75,3,'recovery','time',120,'hr',2),(r75,4,'interval','time',120,'hr',5),(r75,5,'recovery','time',120,'hr',2),(r75,6,'interval','time',120,'hr',5),(r75,7,'recovery','time',120,'hr',2),(r75,8,'interval','time',120,'hr',5),(r75,9,'recovery','time',120,'hr',2),(r75,10,'interval','time',120,'hr',5),(r75,11,'recovery','time',120,'hr',2),(r75,12,'interval','time',120,'hr',5),(r75,13,'recovery','time',120,'hr',2),(r75,14,'interval','time',120,'hr',5),(r75,15,'recovery','time',120,'hr',2),(r75,16,'interval','time',120,'hr',5),(r75,17,'cooldown','time',600,'hr',1);

-- ============================================================
-- LONG RUN VARIANTS (10 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Classic Long Run (105 min)','Standard long run for marathon and ultra training. Steady aerobic pace throughout builds glycogen depletion adaptation.','hr','endurance','moderate',true,105,58,ARRAY['long-run','aerobic','105min','z2','marathon'])
RETURNING id INTO r76;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r76,1,'warmup','time',300,'hr',1),(r76,2,'steady','time',5700,'hr',2),(r76,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run with Aerobic Finish (120 min)','90 min easy aerobic + 25 min at Z3. Teaches running on tired legs and builds aerobic resilience.','hr','endurance','hard',true,120,72,ARRAY['long-run','aerobic-finish','z3','120min','marathon'])
RETURNING id INTO r77;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r77,1,'warmup','time',300,'hr',1),(r77,2,'steady','time',5400,'hr',2),(r77,3,'steady','time',1500,'hr',3),(r77,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run Progressive Finish (110 min)','75 min at Z2 building progressively to Z3 finish over last 25 min. Excellent marathon-specific stimulus.','hr','endurance','hard',true,110,66,ARRAY['long-run','progressive','z2-z3','110min','marathon'])
RETURNING id INTO r78;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r78,1,'warmup','time',300,'hr',1),(r78,2,'steady','time',4200,'hr',2),(r78,3,'steady','time',900,'hr',3),(r78,4,'steady','time',600,'hr',3),(r78,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Easy Run 90 min Steady (90 min)','Classic 90-min easy long run. Primary weekly endurance stimulus for mid-distance runners.','hr','endurance','moderate',true,90,50,ARRAY['long-run','easy','z2','90min','weekly'])
RETURNING id INTO r79;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r79,1,'warmup','time',300,'hr',1),(r79,2,'steady','time',4800,'hr',2),(r79,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run with Mid-Run Tempo (120 min)','60 min easy + 20 min tempo (Z4) + 30 min easy. Classic long run with embedded quality work.','hr','endurance','hard',true,120,76,ARRAY['long-run','tempo','embedded','120min','z2-z4'])
RETURNING id INTO r80;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r80,1,'warmup','time',300,'hr',1),(r80,2,'steady','time',3300,'hr',2),(r80,3,'interval','time',1200,'hr',4),(r80,4,'steady','time',1800,'hr',2),(r80,5,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run 2hr Easy (120 min)','2-hour easy long run for advanced base building. High aerobic volume in a single session.','hr','endurance','moderate',true,120,66,ARRAY['long-run','2hr','easy','z2','volume'])
RETURNING id INTO r81;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r81,1,'warmup','time',300,'hr',1),(r81,2,'steady','time',6600,'hr',2),(r81,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run Fartlek (110 min)','Long run with embedded fartlek surges. Natural variation prevents monotony and builds aerobic range.','hr','endurance','moderate',true,110,64,ARRAY['long-run','fartlek','aerobic','z2','surges'])
RETURNING id INTO r82;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r82,1,'warmup','time',300,'hr',1),(r82,2,'steady','time',1800,'hr',2),(r82,3,'interval','time',180,'hr',3),(r82,4,'steady','time',1800,'hr',2),(r82,5,'interval','time',180,'hr',3),(r82,6,'steady','time',1800,'hr',2),(r82,7,'interval','time',180,'hr',3),(r82,8,'steady','time',1200,'hr',2),(r82,9,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Ultra-Long Base Run (150 min)','2.5-hour base-building long run for ultra-marathon preparation. Very slow pace; focus on time on feet and glycogen depletion.','hr','endurance','hard',true,150,82,ARRAY['ultra-long','z1-z2','150min','ultra-marathon','base'])
RETURNING id INTO r83;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r83,1,'warmup','time',300,'hr',1),(r83,2,'steady','time',8400,'hr',2),(r83,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Long Run with Race Pace Surge (100 min)','80 min easy + 4×5-min race-pace efforts within the final 25 min. Marathon-specific strength work embedded in long run.','hr','endurance','hard',true,100,68,ARRAY['long-run','race-pace','surge','z4','100min'])
RETURNING id INTO r84;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r84,1,'warmup','time',300,'hr',1),(r84,2,'steady','time',4500,'hr',2),(r84,3,'interval','time',300,'hr',4),(r84,4,'recovery','time',120,'hr',2),(r84,5,'interval','time',300,'hr',4),(r84,6,'recovery','time',120,'hr',2),(r84,7,'interval','time',300,'hr',4),(r84,8,'recovery','time',120,'hr',2),(r84,9,'interval','time',300,'hr',4),(r84,10,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Back-to-Back Long Run (85 min)','85-min second-day long run in back-to-back weekend long run format. Trains glycogen-depleted adaptation and fatigue resistance.','hr','endurance','moderate',true,85,46,ARRAY['back-to-back','long-run','z2','85min','depletion'])
RETURNING id INTO r85;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r85,1,'warmup','time',300,'hr',1),(r85,2,'steady','time',4500,'hr',2),(r85,3,'cooldown','time',300,'hr',1);

-- ============================================================
-- HILLS / STRENGTH (8 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Repeats Short 6×1 min (40 min)','Six 1-minute uphill efforts. Develops running power and recruits glutes and hip flexors maximally.','hr','strength','hard',true,40,40,ARRAY['hills','6x1min','strength','power','hr'])
RETURNING id INTO r86;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r86,1,'warmup','time',600,'hr',2),(r86,2,'interval','time',60,'hr',5),(r86,3,'recovery','time',120,'hr',1),(r86,4,'interval','time',60,'hr',5),(r86,5,'recovery','time',120,'hr',1),(r86,6,'interval','time',60,'hr',5),(r86,7,'recovery','time',120,'hr',1),(r86,8,'interval','time',60,'hr',5),(r86,9,'recovery','time',120,'hr',1),(r86,10,'interval','time',60,'hr',5),(r86,11,'recovery','time',120,'hr',1),(r86,12,'interval','time',60,'hr',5),(r86,13,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Repeats Long 8×2 min (50 min)','Eight 2-minute uphill repeats at hard effort. Builds running-specific strength endurance and aerobic power on incline.','hr','strength','hard',true,50,52,ARRAY['hills','8x2min','strength','endurance','hard'])
RETURNING id INTO r87;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r87,1,'warmup','time',600,'hr',2),(r87,2,'interval','time',120,'hr',5),(r87,3,'recovery','time',90,'hr',1),(r87,4,'interval','time',120,'hr',5),(r87,5,'recovery','time',90,'hr',1),(r87,6,'interval','time',120,'hr',5),(r87,7,'recovery','time',90,'hr',1),(r87,8,'interval','time',120,'hr',5),(r87,9,'recovery','time',90,'hr',1),(r87,10,'interval','time',120,'hr',5),(r87,11,'recovery','time',90,'hr',1),(r87,12,'interval','time',120,'hr',5),(r87,13,'recovery','time',90,'hr',1),(r87,14,'interval','time',120,'hr',5),(r87,15,'recovery','time',90,'hr',1),(r87,16,'interval','time',120,'hr',5),(r87,17,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Tempo — Continuous Uphill 20 min (40 min)','20-min continuous uphill run at Z3-Z4 effort. Simulates mountain race conditions and develops hill-specific strength-aerobic capacity.','hr','strength','hard',true,40,40,ARRAY['hill-tempo','continuous','z3-z4','uphill','strength'])
RETURNING id INTO r88;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r88,1,'warmup','time',600,'hr',2),(r88,2,'steady','time',1200,'hr',4),(r88,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Stair Running Intervals 10× (35 min)','Ten stair-climbing repeats for explosive leg power. Targets quadriceps, glutes, and calves with high neuromotor demand.','hr','strength','hard',true,35,36,ARRAY['stairs','explosive','power','strength','intervals'])
RETURNING id INTO r89;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r89,1,'warmup','time',600,'hr',2),(r89,2,'interval','time',45,'hr',5),(r89,3,'recovery','time',90,'hr',1),(r89,4,'interval','time',45,'hr',5),(r89,5,'recovery','time',90,'hr',1),(r89,6,'interval','time',45,'hr',5),(r89,7,'recovery','time',90,'hr',1),(r89,8,'interval','time',45,'hr',5),(r89,9,'recovery','time',90,'hr',1),(r89,10,'interval','time',45,'hr',5),(r89,11,'recovery','time',90,'hr',1),(r89,12,'interval','time',45,'hr',5),(r89,13,'recovery','time',90,'hr',1),(r89,14,'interval','time',45,'hr',5),(r89,15,'recovery','time',90,'hr',1),(r89,16,'interval','time',45,'hr',5),(r89,17,'recovery','time',90,'hr',1),(r89,18,'interval','time',45,'hr',5),(r89,19,'recovery','time',90,'hr',1),(r89,20,'interval','time',45,'hr',5),(r89,21,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Rolling Hills Aerobic Run (70 min)','70-min run on rolling terrain. Natural variation in grade provides strength-aerobic stimulus while maintaining aerobic HR range.','hr','strength','moderate',true,70,38,ARRAY['rolling','hills','aerobic','z2','terrain'])
RETURNING id INTO r90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r90,1,'warmup','time',300,'hr',1),(r90,2,'steady','time',3600,'hr',2),(r90,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Lydiard Hill Bounding Circuit (35 min)','Hill bounding exercises (high knees, skipping, bounding uphill) for explosive neuromuscular power development.','hr','strength','hard',true,35,36,ARRAY['lydiard','bounding','hills','neuromuscular','power'])
RETURNING id INTO r91;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r91,1,'warmup','time',600,'hr',2),(r91,2,'interval','time',60,'hr',5),(r91,3,'recovery','time',60,'hr',1),(r91,4,'interval','time',60,'hr',5),(r91,5,'recovery','time',60,'hr',1),(r91,6,'interval','time',60,'hr',5),(r91,7,'recovery','time',60,'hr',1),(r91,8,'interval','time',60,'hr',5),(r91,9,'recovery','time',60,'hr',1),(r91,10,'interval','time',60,'hr',5),(r91,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Mountain Simulation 4×4 min Uphill (50 min)','Four 4-minute uphill efforts at strong Z4-Z5 HR. Simulates mountain race climbs.','hr','strength','very_hard',true,50,52,ARRAY['mountain','uphill','4x4','z4-z5','simulation'])
RETURNING id INTO r92;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r92,1,'warmup','time',600,'hr',2),(r92,2,'interval','time',240,'hr',5),(r92,3,'recovery','time',300,'hr',1),(r92,4,'interval','time',240,'hr',5),(r92,5,'recovery','time',300,'hr',1),(r92,6,'interval','time',240,'hr',5),(r92,7,'recovery','time',300,'hr',1),(r92,8,'interval','time',240,'hr',5),(r92,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Downhill Running + Strength (55 min)','Alternating downhill repeats (eccentric strength) with easy flat running. Builds quadriceps eccentric strength for marathon finishing strength.','hr','strength','moderate',true,55,30,ARRAY['downhill','eccentric','strength','quad','marathon'])
RETURNING id INTO r93;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r93,1,'warmup','time',600,'hr',2),(r93,2,'interval','time',180,'hr',3),(r93,3,'recovery','time',180,'hr',2),(r93,4,'interval','time',180,'hr',3),(r93,5,'recovery','time',180,'hr',2),(r93,6,'interval','time',180,'hr',3),(r93,7,'recovery','time',180,'hr',2),(r93,8,'interval','time',180,'hr',3),(r93,9,'cooldown','time',600,'hr',1);

-- ============================================================
-- SPRINT / SPEED (7 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Sprint Strides 10×100m (30 min)','Ten 100m strides at near-maximum effort. Classic neuromuscular activation and running economy development.','pace','sprint','easy',true,30,18,ARRAY['strides','100m','10x','neuromuscular','economy'])
RETURNING id INTO r94;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r94,1,'warmup','time',600,'pace',2),(r94,2,'interval','time',20,'pace',5),(r94,3,'recovery','time',60,'pace',1),(r94,4,'interval','time',20,'pace',5),(r94,5,'recovery','time',60,'pace',1),(r94,6,'interval','time',20,'pace',5),(r94,7,'recovery','time',60,'pace',1),(r94,8,'interval','time',20,'pace',5),(r94,9,'recovery','time',60,'pace',1),(r94,10,'interval','time',20,'pace',5),(r94,11,'recovery','time',60,'pace',1),(r94,12,'interval','time',20,'pace',5),(r94,13,'recovery','time',60,'pace',1),(r94,14,'interval','time',20,'pace',5),(r94,15,'recovery','time',60,'pace',1),(r94,16,'interval','time',20,'pace',5),(r94,17,'recovery','time',60,'pace',1),(r94,18,'interval','time',20,'pace',5),(r94,19,'recovery','time',60,'pace',1),(r94,20,'interval','time',20,'pace',5),(r94,21,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Flying 30m Sprints 8× (30 min)','Eight flying 30m sprints. Pure speed development with full recovery to maintain maximum neuromuscular quality.','pace','sprint','hard',true,30,24,ARRAY['sprint','flying','30m','8x','neuromuscular'])
RETURNING id INTO r95;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r95,1,'warmup','time',600,'pace',2),(r95,2,'steady','time',30,'pace',3),(r95,3,'interval','time',10,'pace',5),(r95,4,'recovery','time',240,'pace',1),(r95,5,'steady','time',30,'pace',3),(r95,6,'interval','time',10,'pace',5),(r95,7,'recovery','time',240,'pace',1),(r95,8,'steady','time',30,'pace',3),(r95,9,'interval','time',10,'pace',5),(r95,10,'recovery','time',240,'pace',1),(r95,11,'steady','time',30,'pace',3),(r95,12,'interval','time',10,'pace',5),(r95,13,'recovery','time',240,'pace',1),(r95,14,'steady','time',30,'pace',3),(r95,15,'interval','time',10,'pace',5),(r95,16,'recovery','time',240,'pace',1),(r95,17,'steady','time',30,'pace',3),(r95,18,'interval','time',10,'pace',5),(r95,19,'recovery','time',240,'pace',1),(r95,20,'steady','time',30,'pace',3),(r95,21,'interval','time',10,'pace',5),(r95,22,'recovery','time',240,'pace',1),(r95,23,'steady','time',30,'pace',3),(r95,24,'interval','time',10,'pace',5),(r95,25,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Acceleration Runs 8×60m (30 min)','Eight 60m acceleration runs building from easy to sprint. Teaches proper acceleration mechanics and drive phase.','pace','sprint','moderate',true,30,20,ARRAY['acceleration','60m','8x','mechanics','speed'])
RETURNING id INTO r96;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r96,1,'warmup','time',600,'pace',2),(r96,2,'interval','time',12,'pace',5),(r96,3,'recovery','time',180,'pace',1),(r96,4,'interval','time',12,'pace',5),(r96,5,'recovery','time',180,'pace',1),(r96,6,'interval','time',12,'pace',5),(r96,7,'recovery','time',180,'pace',1),(r96,8,'interval','time',12,'pace',5),(r96,9,'recovery','time',180,'pace',1),(r96,10,'interval','time',12,'pace',5),(r96,11,'recovery','time',180,'pace',1),(r96,12,'interval','time',12,'pace',5),(r96,13,'recovery','time',180,'pace',1),(r96,14,'interval','time',12,'pace',5),(r96,15,'recovery','time',180,'pace',1),(r96,16,'interval','time',12,'pace',5),(r96,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Neuro Activation Speed Circuit (35 min)','Short maximal sprints (6-8 sec) with full recovery. Activates fast-twitch fibers and trains peak running velocity.','pace','sprint','hard',true,35,28,ARRAY['neuromuscular','activation','speed','circuit','sprints'])
RETURNING id INTO r97;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r97,1,'warmup','time',600,'pace',2),(r97,2,'interval','time',8,'pace',5),(r97,3,'recovery','time',270,'pace',1),(r97,4,'interval','time',8,'pace',5),(r97,5,'recovery','time',270,'pace',1),(r97,6,'interval','time',8,'pace',5),(r97,7,'recovery','time',270,'pace',1),(r97,8,'interval','time',8,'pace',5),(r97,9,'recovery','time',270,'pace',1),(r97,10,'interval','time',8,'pace',5),(r97,11,'recovery','time',270,'pace',1),(r97,12,'interval','time',8,'pace',5),(r97,13,'recovery','time',270,'pace',1),(r97,14,'interval','time',8,'pace',5),(r97,15,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Sprint + Aerobic Alternating (40 min)','Aerobic base with 6 maximum sprints of 15 seconds. Maintains aerobic base while activating neuromuscular pathways.','hr','sprint','moderate',true,40,26,ARRAY['sprint','aerobic','alternating','neuromuscular','z2'])
RETURNING id INTO r98;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r98,1,'warmup','time',300,'hr',1),(r98,2,'steady','time',360,'hr',2),(r98,3,'interval','time',15,'pace',5),(r98,4,'steady','time',360,'hr',2),(r98,5,'interval','time',15,'pace',5),(r98,6,'steady','time',360,'hr',2),(r98,7,'interval','time',15,'pace',5),(r98,8,'steady','time',360,'hr',2),(r98,9,'interval','time',15,'pace',5),(r98,10,'steady','time',360,'hr',2),(r98,11,'interval','time',15,'pace',5),(r98,12,'steady','time',360,'hr',2),(r98,13,'interval','time',15,'pace',5),(r98,14,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Speed Development 4×150m (30 min)','Four 150m speed repeats. Develops maximal speed endurance and train the ability to maintain top speed.','pace','sprint','hard',true,30,24,ARRAY['speed','150m','4x','development','sprints'])
RETURNING id INTO r99;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r99,1,'warmup','time',600,'pace',2),(r99,2,'interval','time',25,'pace',5),(r99,3,'recovery','time',375,'pace',1),(r99,4,'interval','time',25,'pace',5),(r99,5,'recovery','time',375,'pace',1),(r99,6,'interval','time',25,'pace',5),(r99,7,'recovery','time',375,'pace',1),(r99,8,'interval','time',25,'pace',5),(r99,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Pre-Competition Speed Sharpener (30 min)','Final speed sharpener 2-3 days before competition. Short sharp efforts to prime neuromuscular system without fatigue.','pace','sprint','easy',true,30,20,ARRAY['pre-competition','speed','sharpener','z1','taper'])
RETURNING id INTO r100;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(r100,1,'warmup','time',600,'pace',2),(r100,2,'steady','time',300,'hr',2),(r100,3,'interval','time',20,'pace',5),(r100,4,'recovery','time',90,'hr',1),(r100,5,'interval','time',20,'pace',5),(r100,6,'recovery','time',90,'hr',1),(r100,7,'interval','time',20,'pace',5),(r100,8,'recovery','time',90,'hr',1),(r100,9,'interval','time',20,'pace',5),(r100,10,'recovery','time',90,'hr',1),(r100,11,'cooldown','time',300,'pace',1);

END $$;
