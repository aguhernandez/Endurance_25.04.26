/*
  # Triathlon & Transitions Extended Workout Library

  ## Summary
  Adds 100 triathlon-specific workouts to the public workout library covering
  brick sessions, transition drills, multi-sport simulations, and race prep.
  Uses sport='other' for multi-discipline workouts, or individual sports for
  single-discipline race prep. Intensity is HR-based (target_zone) for
  multi-discipline workouts and pace/power-based for discipline-specific ones.

  ## Categories
  1. T1 Transition Drills - Swim to Bike (t1–t15): 15 workouts
  2. T2 Transition Drills - Bike to Run (t16–t30): 15 workouts
  3. Bike-Run Brick Sessions (t31–t50): 20 workouts
  4. Swim-Bike Brick Sessions (t51–t65): 15 workouts
  5. Full Triathlon Simulations (t66–t78): 13 workouts
  6. Multi-Sport Conditioning (t79–t90): 12 workouts
  7. Race Prep & Taper (t91–t100): 10 workouts

  ## Notes
  - Multi-discipline workouts use sport='other' and HR-based zones
  - Impulse calculated using HR zone intensities: Z1=0.55, Z2=0.70, Z3=0.83, Z4=0.95, Z5=1.10
  - All have is_public=true, coach_id=null
*/

DO $$ DECLARE
  t1 uuid; t2 uuid; t3 uuid; t4 uuid; t5 uuid;
  t6 uuid; t7 uuid; t8 uuid; t9 uuid; t10 uuid;
  t11 uuid; t12 uuid; t13 uuid; t14 uuid; t15 uuid;
  t16 uuid; t17 uuid; t18 uuid; t19 uuid; t20 uuid;
  t21 uuid; t22 uuid; t23 uuid; t24 uuid; t25 uuid;
  t26 uuid; t27 uuid; t28 uuid; t29 uuid; t30 uuid;
  t31 uuid; t32 uuid; t33 uuid; t34 uuid; t35 uuid;
  t36 uuid; t37 uuid; t38 uuid; t39 uuid; t40 uuid;
  t41 uuid; t42 uuid; t43 uuid; t44 uuid; t45 uuid;
  t46 uuid; t47 uuid; t48 uuid; t49 uuid; t50 uuid;
  t51 uuid; t52 uuid; t53 uuid; t54 uuid; t55 uuid;
  t56 uuid; t57 uuid; t58 uuid; t59 uuid; t60 uuid;
  t61 uuid; t62 uuid; t63 uuid; t64 uuid; t65 uuid;
  t66 uuid; t67 uuid; t68 uuid; t69 uuid; t70 uuid;
  t71 uuid; t72 uuid; t73 uuid; t74 uuid; t75 uuid;
  t76 uuid; t77 uuid; t78 uuid; t79 uuid; t80 uuid;
  t81 uuid; t82 uuid; t83 uuid; t84 uuid; t85 uuid;
  t86 uuid; t87 uuid; t88 uuid; t89 uuid; t90 uuid;
  t91 uuid; t92 uuid; t93 uuid; t94 uuid; t95 uuid;
  t96 uuid; t97 uuid; t98 uuid; t99 uuid; t100 uuid;
BEGIN

-- ============================================================
-- CATEGORY 1: T1 TRANSITION DRILLS - SWIM TO BIKE (t1-t15)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Bike Activation Post-Swim (20 min)','First 20 min on bike after swim. Focus on finding legs and settling cadence.',
'hr','race-prep','easy',true,20,8,ARRAY['t1','transition','bike','activation','20min'])
RETURNING id INTO t1;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t1,1,'warmup','time',300,'hr',1),
(t1,2,'steady','time',600,'hr',2),
(t1,3,'steady','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Swim-Bike Transition Practice (30 min)','Practice wet-to-bike transition repeatedly. Quick exit from water, mount and go.',
'hr','race-prep','easy',true,30,14,ARRAY['t1','transition','swim-bike','practice','30min'])
RETURNING id INTO t2;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t2,1,'warmup','time',300,'hr',1),
(t2,2,'steady','time',600,'hr',2),
(t2,3,'interval','time',300,'hr',3),
(t2,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Cold Legs Bike Start (25 min)','Start bike immediately hard like a race: simulate legs coming from cold water.',
'hr','race-prep','moderate',true,25,12,ARRAY['t1','cold-legs','race-start','bike','25min'])
RETURNING id INTO t3;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t3,1,'interval','time',300,'hr',3),
(t3,2,'steady','time',600,'hr',2),
(t3,3,'steady','time',600,'hr',3),
(t3,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 High Cadence Spin Out (15 min)','After swim, immediately spin very high cadence to activate cycling muscles.',
'hr','race-prep','easy',true,15,6,ARRAY['t1','high-cadence','spin','activation','15min'])
RETURNING id INTO t4;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t4,1,'warmup','time',300,'hr',1),
(t4,2,'steady','time',300,'hr',2),
(t4,3,'interval','time',300,'hr',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Olympic Distance Bike Start (40 min)','Simulate Olympic tri bike leg start: 10 min race pace from cold water exit.',
'hr','race-prep','hard',true,40,22,ARRAY['t1','olympic','bike-start','race-pace','40min'])
RETURNING id INTO t5;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t5,1,'interval','time',600,'hr',3),
(t5,2,'steady','time',1200,'hr',3),
(t5,3,'steady','time',600,'hr',2),
(t5,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Wetsuit Removal + Bike Mount Drill (20 min)','Timed drill: wetsuit off and mount bike as fast as possible, repeated 5x.',
'hr','race-prep','easy',true,20,8,ARRAY['t1','wetsuit','mount','drill','20min'])
RETURNING id INTO t6;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t6,1,'warmup','time',300,'hr',1),
(t6,2,'interval','time',120,'hr',2),
(t6,3,'recovery','time',180,'hr',1),
(t6,4,'interval','time',120,'hr',2),
(t6,5,'recovery','time',180,'hr',1),
(t6,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Half-IM Bike Activation (30 min)','HIM bike start: 10 min build from Z2 to race Z3 after swim simulation.',
'hr','race-prep','moderate',true,30,16,ARRAY['t1','half-ironman','bike-activation','30min'])
RETURNING id INTO t7;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t7,1,'warmup','time',300,'hr',2),
(t7,2,'steady','time',600,'hr',2),
(t7,3,'steady','time',600,'hr',3),
(t7,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Goggles & Cap to Helmet Fast (20 min)','Equipment swap speed drill: practice removing goggles, cap, donning helmet.',
'hr','race-prep','easy',true,20,8,ARRAY['t1','equipment','helmet','drill','20min'])
RETURNING id INTO t8;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t8,1,'warmup','time',300,'hr',1),
(t8,2,'interval','time',120,'hr',2),
(t8,3,'recovery','time',120,'hr',1),
(t8,4,'interval','time',120,'hr',2),
(t8,5,'recovery','time',120,'hr',1),
(t8,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Open Water Entry & Exit Drill (30 min)','Practice running into water, swimming, and exiting to T1 repeatedly.',
'hr','race-prep','moderate',true,30,16,ARRAY['t1','open-water','entry','exit','30min'])
RETURNING id INTO t9;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t9,1,'warmup','time',300,'hr',2),
(t9,2,'interval','time',300,'hr',3),
(t9,3,'recovery','time',300,'hr',1),
(t9,4,'interval','time',300,'hr',3),
(t9,5,'recovery','time',300,'hr',1),
(t9,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Sprint Tri Full Rehearsal (25 min)','Full T1 rehearsal for sprint tri: swim, run to transition, bike away.',
'hr','race-prep','moderate',true,25,12,ARRAY['t1','sprint-tri','rehearsal','full','25min'])
RETURNING id INTO t10;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t10,1,'warmup','time',300,'hr',2),
(t10,2,'interval','time',300,'hr',4),
(t10,3,'recovery','time',120,'hr',1),
(t10,4,'steady','time',600,'hr',3),
(t10,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Breathing Control During Chaos (20 min)','Practice controlled breathing during high-stress T1 actions.',
'hr','race-prep','easy',true,20,9,ARRAY['t1','breathing','mental','control','20min'])
RETURNING id INTO t11;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t11,1,'warmup','time',300,'hr',1),
(t11,2,'interval','time',300,'hr',3),
(t11,3,'recovery','time',300,'hr',1),
(t11,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Nutrition Strategy Session (30 min)','Practice taking on nutrition and hydration immediately post-swim on bike.',
'hr','race-prep','easy',true,30,14,ARRAY['t1','nutrition','hydration','strategy','30min'])
RETURNING id INTO t12;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t12,1,'warmup','time',300,'hr',1),
(t12,2,'steady','time',1200,'hr',2),
(t12,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Ironman Checklist Walkthrough (45 min)','Full Ironman T1 rehearsal: bag layout, special needs, all equipment practice.',
'hr','race-prep','easy',true,45,20,ARRAY['t1','ironman','checklist','rehearsal','45min'])
RETURNING id INTO t13;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t13,1,'warmup','time',600,'hr',1),
(t13,2,'steady','time',1200,'hr',2),
(t13,3,'steady','time',600,'hr',2),
(t13,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Mental Visualization Ride (20 min)','Easy spin while mentally rehearsing each T1 action in race order.',
'hr','race-prep','easy',true,20,8,ARRAY['t1','mental','visualization','easy','20min'])
RETURNING id INTO t14;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t14,1,'warmup','time',300,'hr',1),
(t14,2,'steady','time',600,'hr',1),
(t14,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','T1 Race Pace Bike Acceleration (35 min)','After T1 practice, accelerate to race pace within 2 min and hold for 15 min.',
'hr','race-prep','hard',true,35,20,ARRAY['t1','acceleration','race-pace','bike','35min'])
RETURNING id INTO t15;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t15,1,'warmup','time',300,'hr',2),
(t15,2,'interval','time',120,'hr',4),
(t15,3,'steady','time',900,'hr',3),
(t15,4,'cooldown','time',600,'hr',1);

-- ============================================================
-- CATEGORY 2: T2 TRANSITION DRILLS - BIKE TO RUN (t16-t30)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Run Activation Post-Bike (20 min)','First 20 min run off the bike. Focus on finding run legs and cadence.',
'hr','race-prep','easy',true,20,9,ARRAY['t2','transition','run','activation','20min'])
RETURNING id INTO t16;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t16,1,'warmup','time',300,'hr',2),
(t16,2,'steady','time',600,'hr',2),
(t16,3,'steady','time',300,'hr',3);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Bike-Run Feel Finder (30 min)','Classic T2 run: first 5 min feel awful, then settle into race pace.',
'hr','race-prep','moderate',true,30,17,ARRAY['t2','feel-finder','run','brick','30min'])
RETURNING id INTO t17;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t17,1,'warmup','time',300,'hr',3),
(t17,2,'steady','time',600,'hr',2),
(t17,3,'steady','time',600,'hr',3),
(t17,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Sprint Tri Off-Bike Run (25 min)','Sprint triathlon run simulation: 5km at race effort off the bike.',
'hr','race-prep','hard',true,25,16,ARRAY['t2','sprint-tri','5km','run','25min'])
RETURNING id INTO t18;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t18,1,'warmup','time',300,'hr',3),
(t18,2,'steady','time',900,'hr',4),
(t18,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Helmet-to-Run Shoe Speed (20 min)','Timed drill: helmet off, rack bike, shoes on and running as fast as possible.',
'hr','race-prep','easy',true,20,8,ARRAY['t2','helmet','shoes','speed','20min'])
RETURNING id INTO t19;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t19,1,'warmup','time',300,'hr',1),
(t19,2,'interval','time',120,'hr',3),
(t19,3,'recovery','time',180,'hr',1),
(t19,4,'interval','time',120,'hr',3),
(t19,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Mental Reset Between Disciplines (30 min)','Practice the mental switch from cycling to running mindset.',
'hr','race-prep','moderate',true,30,16,ARRAY['t2','mental','reset','run','30min'])
RETURNING id INTO t20;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t20,1,'warmup','time',300,'hr',2),
(t20,2,'steady','time',900,'hr',2),
(t20,3,'steady','time',300,'hr',3),
(t20,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Olympic 10km Run Start (45 min)','Olympic tri run leg simulation: 10km off the bike at race effort.',
'hr','race-prep','hard',true,45,30,ARRAY['t2','olympic','10km','run','45min'])
RETURNING id INTO t21;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t21,1,'warmup','time',300,'hr',3),
(t21,2,'steady','time',1800,'hr',3),
(t21,3,'steady','time',600,'hr',4),
(t21,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Cadence Focus Run (25 min)','Off bike, focus on quick cadence (90spm) to overcome heavy legs.',
'hr','race-prep','moderate',true,25,14,ARRAY['t2','cadence','run','90spm','25min'])
RETURNING id INTO t22;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t22,1,'warmup','time',300,'hr',2),
(t22,2,'steady','time',900,'hr',3),
(t22,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 HIM Run Brick (45 min)','Half-Ironman run start simulation: 21km off bike at Z3 sustained pace.',
'hr','race-prep','hard',true,45,30,ARRAY['t2','half-ironman','21km','run-brick','45min'])
RETURNING id INTO t23;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t23,1,'warmup','time',300,'hr',2),
(t23,2,'steady','time',1800,'hr',3),
(t23,3,'steady','time',600,'hr',3),
(t23,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Elastic Laces & Fast Exit (20 min)','Practice fastest possible T2 exit with elastic laces and race-ready shoes.',
'hr','race-prep','easy',true,20,9,ARRAY['t2','elastic-laces','fast-exit','equipment','20min'])
RETURNING id INTO t24;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t24,1,'warmup','time',300,'hr',1),
(t24,2,'interval','time',120,'hr',3),
(t24,3,'recovery','time',300,'hr',1),
(t24,4,'interval','time',120,'hr',3),
(t24,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Negative Split Run (35 min)','Off bike run with negative split: second half faster. Builds race pacing.',
'hr','race-prep','hard',true,35,22,ARRAY['t2','negative-split','run','pacing','35min'])
RETURNING id INTO t25;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t25,1,'warmup','time',300,'hr',2),
(t25,2,'steady','time',900,'hr',3),
(t25,3,'steady','time',600,'hr',4),
(t25,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Race Walk to Run Activation (15 min)','Walk 30s then run to allow quads to open. Classic early run strategy.',
'hr','race-prep','easy',true,15,7,ARRAY['t2','walk-run','activation','quads','15min'])
RETURNING id INTO t26;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t26,1,'warmup','time',300,'hr',2),
(t26,2,'steady','time',300,'hr',2),
(t26,3,'steady','time',300,'hr',3);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Strong Finish Simulation (30 min)','Practice finishing run strong after fatigue. Last 5 min at Z4-Z5.',
'hr','race-prep','hard',true,30,20,ARRAY['t2','strong-finish','z4','z5','30min'])
RETURNING id INTO t27;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t27,1,'warmup','time',300,'hr',2),
(t27,2,'steady','time',900,'hr',3),
(t27,3,'interval','time',300,'hr',4),
(t27,4,'interval','time',300,'hr',5);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Full Ironman Run Start (60 min)','IM marathon run start off the bike. Build conservatively: start Z2, settle Z3.',
'hr','race-prep','hard',true,60,38,ARRAY['t2','ironman','marathon','run-start','60min'])
RETURNING id INTO t28;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t28,1,'warmup','time',300,'hr',2),
(t28,2,'steady','time',1800,'hr',2),
(t28,3,'steady','time',1200,'hr',3),
(t28,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Hot Conditions Run (30 min)','Practice running off bike in heat: slow start, conserve, finish strong.',
'hr','race-prep','moderate',true,30,17,ARRAY['t2','heat','conditions','run','30min'])
RETURNING id INTO t29;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t29,1,'warmup','time',300,'hr',2),
(t29,2,'steady','time',900,'hr',2),
(t29,3,'steady','time',600,'hr',3),
(t29,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','T2 Full Rehearsal Sprint Tri (35 min)','Complete T2 rehearsal: bike racked, shoes on, race out of transition.',
'hr','race-prep','hard',true,35,22,ARRAY['t2','rehearsal','sprint-tri','full','35min'])
RETURNING id INTO t30;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t30,1,'warmup','time',300,'hr',3),
(t30,2,'interval','time',120,'hr',4),
(t30,3,'steady','time',1200,'hr',3),
(t30,4,'steady','time',300,'hr',4),
(t30,5,'cooldown','time',300,'hr',1);

-- ============================================================
-- CATEGORY 3: BIKE-RUN BRICK SESSIONS (t31-t50)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Bike-Run Brick 30+15 min (45 min)','Classic short brick: 30 min Z2 bike then 15 min Z3 run. Entry brick.',
'hr','race-prep','moderate',true,45,26,ARRAY['brick','bike-run','30min','15min','45min'])
RETURNING id INTO t31;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t31,1,'warmup','time',300,'hr',1),
(t31,2,'steady','time',1500,'hr',2),
(t31,3,'steady','time',300,'hr',2),
(t31,4,'steady','time',900,'hr',3),
(t31,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Bike-Run Brick 45+20 min (65 min)','Medium brick: 45 min steady bike then 20 min progressive run.',
'hr','race-prep','moderate',true,65,38,ARRAY['brick','bike-run','45min','20min','65min'])
RETURNING id INTO t32;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t32,1,'warmup','time',600,'hr',1),
(t32,2,'steady','time',2100,'hr',2),
(t32,3,'steady','time',300,'hr',2),
(t32,4,'steady','time',600,'hr',2),
(t32,5,'steady','time',600,'hr',3),
(t32,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Bike-Run Brick 60+30 min (90 min)','Solid brick: 60 min threshold bike then 30 min race pace run.',
'hr','race-prep','hard',true,90,56,ARRAY['brick','bike-run','60min','30min','90min'])
RETURNING id INTO t33;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t33,1,'warmup','time',600,'hr',1),
(t33,2,'steady','time',2400,'hr',3),
(t33,3,'steady','time',600,'hr',2),
(t33,4,'steady','time',1200,'hr',3),
(t33,5,'steady','time',600,'hr',4),
(t33,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Speed Build 40+15 min (55 min)','Build speed through brick: Z3 bike then Z4 run off bike.',
'hr','race-prep','hard',true,55,36,ARRAY['brick','speed','z3','z4','55min'])
RETURNING id INTO t34;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t34,1,'warmup','time',600,'hr',1),
(t34,2,'steady','time',1800,'hr',3),
(t34,3,'steady','time',300,'hr',2),
(t34,4,'interval','time',600,'hr',4),
(t34,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Multiple 3x (20+10 min) (90 min)','3 x (20 min bike + 10 min run). High brick frequency stimulus.',
'hr','race-prep','hard',true,90,54,ARRAY['brick','multiple','3x','bike-run','90min'])
RETURNING id INTO t35;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t35,1,'warmup','time',300,'hr',1),
(t35,2,'steady','time',1200,'hr',3),
(t35,3,'steady','time',600,'hr',3),
(t35,4,'steady','time',1200,'hr',3),
(t35,5,'steady','time',600,'hr',3),
(t35,6,'steady','time',1200,'hr',3),
(t35,7,'steady','time',600,'hr',3),
(t35,8,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Olympic Distance Brick 40+10km (80 min)','Olympic race simulation: 40km bike pace then 10km run.',
'hr','race-prep','hard',true,80,50,ARRAY['brick','olympic','40km','10km','80min'])
RETURNING id INTO t36;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t36,1,'warmup','time',600,'hr',1),
(t36,2,'steady','time',3000,'hr',3),
(t36,3,'steady','time',300,'hr',2),
(t36,4,'steady','time',2400,'hr',3),
(t36,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','HIM Brick 90+30 min (120 min)','Half-Ironman brick: 90 min bike at race pace then 30 min run.',
'hr','race-prep','hard',true,120,74,ARRAY['brick','half-ironman','90min','run','120min'])
RETURNING id INTO t37;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t37,1,'warmup','time',600,'hr',1),
(t37,2,'steady','time',4200,'hr',3),
(t37,3,'steady','time',300,'hr',2),
(t37,4,'steady','time',1500,'hr',3),
(t37,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Negative Split (60 min)','Brick where run is faster than equivalent standalone: bike conserve, run strong.',
'hr','race-prep','hard',true,60,38,ARRAY['brick','negative-split','pacing','60min'])
RETURNING id INTO t38;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t38,1,'warmup','time',600,'hr',1),
(t38,2,'steady','time',1800,'hr',2),
(t38,3,'steady','time',300,'hr',2),
(t38,4,'steady','time',600,'hr',3),
(t38,5,'steady','time',900,'hr',4),
(t38,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Intervals Bike 5x5 + Run (75 min)','5 x 5 min Z4 bike intervals then 20 min run. VO2max to threshold.',
'hr','race-prep','hard',true,75,50,ARRAY['brick','intervals','vo2max','5x5','75min'])
RETURNING id INTO t39;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t39,1,'warmup','time',600,'hr',1),
(t39,2,'interval','time',300,'hr',4),
(t39,3,'recovery','time',180,'hr',1),
(t39,4,'interval','time',300,'hr',4),
(t39,5,'recovery','time',180,'hr',1),
(t39,6,'interval','time',300,'hr',4),
(t39,7,'recovery','time',180,'hr',1),
(t39,8,'interval','time',300,'hr',4),
(t39,9,'recovery','time',180,'hr',1),
(t39,10,'interval','time',300,'hr',4),
(t39,11,'steady','time',300,'hr',2),
(t39,12,'steady','time',1200,'hr',3),
(t39,13,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Easy Recovery (45 min)','Very easy brick: 30 min Z1-Z2 bike then 15 min Z1-Z2 run. Active recovery.',
'hr','recovery','easy',true,45,22,ARRAY['brick','recovery','easy','z1-z2','45min'])
RETURNING id INTO t40;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t40,1,'warmup','time',300,'hr',1),
(t40,2,'steady','time',1800,'hr',2),
(t40,3,'steady','time',900,'hr',2),
(t40,4,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Climb + Run (70 min)','Include climbing on bike then hard run off bike to simulate hilly courses.',
'hr','race-prep','hard',true,70,46,ARRAY['brick','climb','hilly','run','70min'])
RETURNING id INTO t41;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t41,1,'warmup','time',600,'hr',1),
(t41,2,'steady','time',1200,'hr',2),
(t41,3,'interval','time',600,'hr',4),
(t41,4,'steady','time',1200,'hr',2),
(t41,5,'interval','time',600,'hr',4),
(t41,6,'steady','time',300,'hr',2),
(t41,7,'steady','time',1200,'hr',3),
(t41,8,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Sprint Brick (20+5 min) x3 (75 min)','3 mini sprint bricks: 20 min hard bike, 5 min fast run. Very high turnover.',
'hr','race-prep','hard',true,75,50,ARRAY['brick','sprint','20min','5min','75min'])
RETURNING id INTO t42;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t42,1,'warmup','time',600,'hr',1),
(t42,2,'steady','time',1200,'hr',4),
(t42,3,'interval','time',300,'hr',4),
(t42,4,'recovery','time',300,'hr',1),
(t42,5,'steady','time',1200,'hr',4),
(t42,6,'interval','time',300,'hr',4),
(t42,7,'recovery','time',300,'hr',1),
(t42,8,'steady','time',1200,'hr',4),
(t42,9,'interval','time',300,'hr',4),
(t42,10,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Ironman Brick 180+20km (240 min)','Ironman simulation brick: 180km bike pace effort then 20km run.',
'hr','race-prep','hard',true,240,150,ARRAY['brick','ironman','180km','marathon','240min'])
RETURNING id INTO t43;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t43,1,'warmup','time',600,'hr',1),
(t43,2,'steady','time',7200,'hr',2),
(t43,3,'steady','time',3600,'hr',3),
(t43,4,'steady','time',2400,'hr',2),
(t43,5,'steady','time',300,'hr',2),
(t43,6,'steady','time',3600,'hr',2),
(t43,7,'steady','time',1800,'hr',3),
(t43,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Power Endurance 90+45 (135 min)','Race-specific brick: 90 min bike at threshold then 45 min race-pace run.',
'hr','race-prep','hard',true,135,86,ARRAY['brick','power-endurance','90min','45min','135min'])
RETURNING id INTO t44;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t44,1,'warmup','time',600,'hr',1),
(t44,2,'steady','time',4200,'hr',3),
(t44,3,'steady','time',600,'hr',2),
(t44,4,'steady','time',2400,'hr',3),
(t44,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Pace Finder 50+20 min (70 min)','Find race pace brick: 50 min bike then 20 min run at target race pace.',
'hr','race-prep','moderate',true,70,42,ARRAY['brick','pace-finder','race-pace','50min','70min'])
RETURNING id INTO t45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t45,1,'warmup','time',600,'hr',1),
(t45,2,'steady','time',2400,'hr',3),
(t45,3,'steady','time',300,'hr',2),
(t45,4,'steady','time',1200,'hr',3),
(t45,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Descend Run (60 min)','Brick with descending run pace: each km faster. Tests ability to build speed.',
'hr','race-prep','hard',true,60,40,ARRAY['brick','descend','run-pace','60min'])
RETURNING id INTO t46;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t46,1,'warmup','time',600,'hr',1),
(t46,2,'steady','time',1800,'hr',3),
(t46,3,'steady','time',300,'hr',2),
(t46,4,'steady','time',600,'hr',2),
(t46,5,'steady','time',600,'hr',3),
(t46,6,'interval','time',600,'hr',4),
(t46,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Taper Pre-Race (45 min)','Short quality brick: 30 min easy bike + 15 min race pace run. Race week.',
'hr','race-prep','moderate',true,45,26,ARRAY['brick','taper','pre-race','quality','45min'])
RETURNING id INTO t47;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t47,1,'warmup','time',600,'hr',1),
(t47,2,'steady','time',1200,'hr',2),
(t47,3,'steady','time',300,'hr',2),
(t47,4,'interval','time',600,'hr',3),
(t47,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick with Nutrition Test (90 min)','Long brick: test race nutrition and hydration strategy during effort.',
'hr','race-prep','hard',true,90,56,ARRAY['brick','nutrition','strategy','test','90min'])
RETURNING id INTO t48;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t48,1,'warmup','time',600,'hr',1),
(t48,2,'steady','time',3000,'hr',3),
(t48,3,'steady','time',300,'hr',2),
(t48,4,'steady','time',1800,'hr',3),
(t48,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Long Steady 120+30 min (150 min)','Peak training week brick: 120 min bike then 30 min run.',
'hr','race-prep','hard',true,150,92,ARRAY['brick','long','peak','120min','30min','150min'])
RETURNING id INTO t49;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t49,1,'warmup','time',600,'hr',1),
(t49,2,'steady','time',5400,'hr',2),
(t49,3,'steady','time',1800,'hr',3),
(t49,4,'steady','time',300,'hr',2),
(t49,5,'steady','time',1800,'hr',3),
(t49,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Brick Race Simulation OLY (95 min)','Olympic distance simulation: 40km bike + 10km run at race effort.',
'hr','race-prep','hard',true,95,60,ARRAY['brick','olympic','race-simulation','95min'])
RETURNING id INTO t50;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t50,1,'warmup','time',600,'hr',1),
(t50,2,'steady','time',3000,'hr',3),
(t50,3,'steady','time',300,'hr',2),
(t50,4,'steady','time',2400,'hr',3),
(t50,5,'steady','time',600,'hr',4),
(t50,6,'cooldown','time',300,'hr',1);

-- ============================================================
-- CATEGORY 4: SWIM-BIKE BRICK SESSIONS (t51-t65)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Brick 750m+30 min (55 min)','Sprint triathlon swim-bike: 750m swim then 30 min bike.',
'hr','race-prep','moderate',true,55,32,ARRAY['brick','swim-bike','750m','30min','55min'])
RETURNING id INTO t51;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t51,1,'warmup','time',300,'hr',1),
(t51,2,'steady','time',900,'hr',3),
(t51,3,'steady','time',300,'hr',2),
(t51,4,'steady','time',1800,'hr',3),
(t51,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Brick 1500m+45 min (75 min)','Olympic swim-bike: 1500m swim then 45 min bike.',
'hr','race-prep','hard',true,75,46,ARRAY['brick','swim-bike','1500m','45min','75min'])
RETURNING id INTO t52;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t52,1,'warmup','time',300,'hr',1),
(t52,2,'steady','time',1500,'hr',3),
(t52,3,'steady','time',300,'hr',2),
(t52,4,'steady','time',2700,'hr',3),
(t52,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike HIM 1900m+60 min (90 min)','Half-IM swim-bike: 1900m swim then 60 min bike at race intensity.',
'hr','race-prep','hard',true,90,56,ARRAY['brick','swim-bike','half-ironman','1900m','90min'])
RETURNING id INTO t53;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t53,1,'warmup','time',300,'hr',1),
(t53,2,'steady','time',1800,'hr',3),
(t53,3,'steady','time',300,'hr',2),
(t53,4,'steady','time',3600,'hr',3),
(t53,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Power Start (50 min)','Hard 400m swim then immediate race-power bike start. Transition power.',
'hr','race-prep','hard',true,50,34,ARRAY['brick','swim-bike','power-start','400m','50min'])
RETURNING id INTO t54;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t54,1,'warmup','time',300,'hr',2),
(t54,2,'interval','time',600,'hr',4),
(t54,3,'interval','time',300,'hr',4),
(t54,4,'steady','time',1800,'hr',3),
(t54,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Easy Base (60 min)','Easy swim-bike base builder: Z2 throughout both disciplines.',
'hr','endurance','easy',true,60,30,ARRAY['brick','swim-bike','base','z2','60min'])
RETURNING id INTO t55;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t55,1,'warmup','time',300,'hr',1),
(t55,2,'steady','time',1800,'hr',2),
(t55,3,'steady','time',300,'hr',1),
(t55,4,'steady','time',1800,'hr',2),
(t55,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike With Sighting (65 min)','Open water sighting swim then steady bike. Full race simulation.',
'hr','race-prep','moderate',true,65,38,ARRAY['brick','swim-bike','sighting','open-water','65min'])
RETURNING id INTO t56;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t56,1,'warmup','time',300,'hr',1),
(t56,2,'steady','time',1500,'hr',2),
(t56,3,'steady','time',300,'hr',2),
(t56,4,'steady','time',2700,'hr',3),
(t56,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','CSS Swim + Threshold Bike (75 min)','CSS swim session then threshold bike. High quality multi-sport.',
'hr','threshold','hard',true,75,50,ARRAY['brick','css','threshold','swim-bike','75min'])
RETURNING id INTO t57;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t57,1,'warmup','time',300,'hr',1),
(t57,2,'interval','time',1200,'hr',3),
(t57,3,'recovery','time',300,'hr',1),
(t57,4,'steady','time',300,'hr',2),
(t57,5,'steady','time',2700,'hr',3),
(t57,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Multiple Swim-Bike Repeats (90 min)','3 x (swim 10 min + bike 20 min) repeats. High transition density.',
'hr','race-prep','hard',true,90,56,ARRAY['brick','swim-bike','multiple','repeats','90min'])
RETURNING id INTO t58;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t58,1,'warmup','time',300,'hr',1),
(t58,2,'steady','time',600,'hr',3),
(t58,3,'steady','time',1200,'hr',3),
(t58,4,'steady','time',600,'hr',3),
(t58,5,'steady','time',1200,'hr',3),
(t58,6,'steady','time',600,'hr',3),
(t58,7,'steady','time',1200,'hr',3),
(t58,8,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Ironman Pace (120 min)','Full IM swim-bike pace simulation: 3800m swim effort then Z3 bike.',
'hr','race-prep','hard',true,120,74,ARRAY['brick','swim-bike','ironman','3800m','120min'])
RETURNING id INTO t59;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t59,1,'warmup','time',600,'hr',1),
(t59,2,'steady','time',4200,'hr',2),
(t59,3,'steady','time',600,'hr',2),
(t59,4,'steady','time',3600,'hr',3),
(t59,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim Sprint + Bike Power (55 min)','Sprint swim then high-power bike start. Neuromuscular activation.',
'hr','race-prep','hard',true,55,38,ARRAY['brick','swim-sprint','bike-power','neuromuscular','55min'])
RETURNING id INTO t60;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t60,1,'warmup','time',300,'hr',1),
(t60,2,'interval','time',600,'hr',4),
(t60,3,'interval','time',300,'hr',4),
(t60,4,'steady','time',300,'hr',2),
(t60,5,'steady','time',1500,'hr',3),
(t60,6,'interval','time',300,'hr',4),
(t60,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Pacing Practice (70 min)','Alternate slow/fast pace in swim and bike. Develop pacing awareness.',
'hr','race-prep','moderate',true,70,42,ARRAY['brick','swim-bike','pacing','moderate','70min'])
RETURNING id INTO t61;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t61,1,'warmup','time',300,'hr',1),
(t61,2,'steady','time',1200,'hr',2),
(t61,3,'interval','time',600,'hr',3),
(t61,4,'steady','time',300,'hr',2),
(t61,5,'steady','time',1800,'hr',2),
(t61,6,'interval','time',600,'hr',3),
(t61,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Recovery Brick (40 min)','Recovery swim-bike: Z1 throughout. Active recovery between hard days.',
'hr','recovery','easy',true,40,18,ARRAY['brick','swim-bike','recovery','z1','40min'])
RETURNING id INTO t62;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t62,1,'warmup','time',300,'hr',1),
(t62,2,'steady','time',900,'hr',1),
(t62,3,'steady','time',300,'hr',1),
(t62,4,'steady','time',900,'hr',1),
(t62,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Race Rehearsal (80 min)','Complete race rehearsal including all gear and nutrition timing.',
'hr','race-prep','hard',true,80,50,ARRAY['brick','swim-bike','race-rehearsal','gear','80min'])
RETURNING id INTO t63;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t63,1,'warmup','time',300,'hr',1),
(t63,2,'steady','time',1800,'hr',3),
(t63,3,'steady','time',300,'hr',2),
(t63,4,'steady','time',2700,'hr',3),
(t63,5,'steady','time',300,'hr',4),
(t63,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Taper (40 min)','Race week swim-bike taper: short, quality, race-pace touches.',
'hr','race-prep','moderate',true,40,22,ARRAY['brick','swim-bike','taper','race-week','40min'])
RETURNING id INTO t64;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t64,1,'warmup','time',300,'hr',1),
(t64,2,'interval','time',600,'hr',3),
(t64,3,'recovery','time',300,'hr',1),
(t64,4,'interval','time',600,'hr',3),
(t64,5,'recovery','time',300,'hr',1),
(t64,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Bike Aerobic Build 8 Weeks (60 min)','Progressive swim-bike aerobic builder for base phase training.',
'hr','endurance','moderate',true,60,34,ARRAY['brick','swim-bike','aerobic','build','60min'])
RETURNING id INTO t65;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t65,1,'warmup','time',300,'hr',1),
(t65,2,'steady','time',1200,'hr',2),
(t65,3,'steady','time',300,'hr',2),
(t65,4,'steady','time',2100,'hr',2),
(t65,5,'steady','time',600,'hr',3),
(t65,6,'cooldown','time',300,'hr',1);

-- ============================================================
-- CATEGORY 5: FULL TRIATHLON SIMULATIONS (t66-t78)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Sprint Triathlon Full Sim (75 min)','Complete sprint triathlon: 750m swim + 20km bike + 5km run.',
'hr','race-prep','hard',true,75,50,ARRAY['full-tri','sprint','750m','20km','5km','75min'])
RETURNING id INTO t66;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t66,1,'warmup','time',300,'hr',1),
(t66,2,'steady','time',900,'hr',3),
(t66,3,'steady','time',300,'hr',2),
(t66,4,'steady','time',1800,'hr',3),
(t66,5,'steady','time',300,'hr',2),
(t66,6,'steady','time',1200,'hr',3),
(t66,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Olympic Triathlon Full Sim (120 min)','Complete Olympic triathlon: 1500m swim + 40km bike + 10km run.',
'hr','race-prep','hard',true,120,78,ARRAY['full-tri','olympic','1500m','40km','10km','120min'])
RETURNING id INTO t67;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t67,1,'warmup','time',300,'hr',1),
(t67,2,'steady','time',1500,'hr',3),
(t67,3,'steady','time',300,'hr',2),
(t67,4,'steady','time',3600,'hr',3),
(t67,5,'steady','time',300,'hr',2),
(t67,6,'steady','time',2400,'hr',3),
(t67,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Half-Ironman Full Sim (270 min)','Complete 70.3 triathlon: 1900m swim + 90km bike + 21km run.',
'hr','race-prep','hard',true,270,166,ARRAY['full-tri','half-ironman','1900m','90km','21km','270min'])
RETURNING id INTO t68;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t68,1,'warmup','time',600,'hr',1),
(t68,2,'steady','time',2400,'hr',2),
(t68,3,'steady','time',300,'hr',2),
(t68,4,'steady','time',7200,'hr',3),
(t68,5,'steady','time',1800,'hr',3),
(t68,6,'steady','time',300,'hr',2),
(t68,7,'steady','time',4800,'hr',3),
(t68,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Super Sprint Full Sim (45 min)','Super sprint triathlon: 400m swim + 10km bike + 2.5km run.',
'hr','race-prep','hard',true,45,32,ARRAY['full-tri','super-sprint','400m','10km','2.5km','45min'])
RETURNING id INTO t69;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t69,1,'warmup','time',300,'hr',1),
(t69,2,'interval','time',600,'hr',4),
(t69,3,'steady','time',300,'hr',2),
(t69,4,'steady','time',1200,'hr',4),
(t69,5,'steady','time',300,'hr',2),
(t69,6,'interval','time',600,'hr',4),
(t69,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Swim-Run Aquathlon (45 min)','Aquathlon simulation: 1000m swim + 5km run. Popular gateway race.',
'hr','race-prep','moderate',true,45,30,ARRAY['aquathlon','swim-run','1000m','5km','45min'])
RETURNING id INTO t70;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t70,1,'warmup','time',300,'hr',1),
(t70,2,'steady','time',1200,'hr',3),
(t70,3,'steady','time',300,'hr',2),
(t70,4,'steady','time',1800,'hr',3),
(t70,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Duathlon Sim Run-Bike-Run (60 min)','Duathlon: 5km run + 20km bike + 2.5km run.',
'hr','race-prep','hard',true,60,40,ARRAY['duathlon','run-bike-run','5km','20km','60min'])
RETURNING id INTO t71;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t71,1,'warmup','time',300,'hr',1),
(t71,2,'steady','time',1200,'hr',3),
(t71,3,'steady','time',300,'hr',2),
(t71,4,'steady','time',1800,'hr',3),
(t71,5,'steady','time',300,'hr',2),
(t71,6,'steady','time',600,'hr',3),
(t71,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Triathlon A-Race Simulation (150 min)','Peak A-race Olympic triathlon full simulation. Race-intensity throughout.',
'hr','race-prep','hard',true,150,98,ARRAY['full-tri','a-race','olympic','simulation','150min'])
RETURNING id INTO t72;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t72,1,'warmup','time',600,'hr',1),
(t72,2,'steady','time',1800,'hr',3),
(t72,3,'steady','time',600,'hr',2),
(t72,4,'steady','time',4200,'hr',3),
(t72,5,'steady','time',600,'hr',2),
(t72,6,'steady','time',2700,'hr',3),
(t72,7,'steady','time',600,'hr',4),
(t72,8,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Triathlon Negative Split Sim (120 min)','Tri simulation where each discipline paced conservatively to negative split.',
'hr','race-prep','hard',true,120,76,ARRAY['full-tri','negative-split','pacing','120min'])
RETURNING id INTO t73;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t73,1,'warmup','time',600,'hr',1),
(t73,2,'steady','time',1500,'hr',2),
(t73,3,'steady','time',900,'hr',3),
(t73,4,'steady','time',300,'hr',2),
(t73,5,'steady','time',2400,'hr',2),
(t73,6,'steady','time',1200,'hr',3),
(t73,7,'steady','time',300,'hr',2),
(t73,8,'steady','time',1200,'hr',3),
(t73,9,'steady','time',600,'hr',4),
(t73,10,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Xterra Off-Road Tri Sim (100 min)','Off-road triathlon simulation: open water swim + mountain bike + trail run.',
'hr','race-prep','hard',true,100,66,ARRAY['xterra','off-road','tri-sim','trail','100min'])
RETURNING id INTO t74;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t74,1,'warmup','time',300,'hr',1),
(t74,2,'steady','time',1800,'hr',3),
(t74,3,'steady','time',300,'hr',2),
(t74,4,'steady','time',2400,'hr',3),
(t74,5,'interval','time',600,'hr',4),
(t74,6,'steady','time',300,'hr',2),
(t74,7,'steady','time',1800,'hr',3),
(t74,8,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Ironman Full Simulation Long (360 min)','Full Ironman simulation day: 3800m swim + 180km bike + 10km run walk.',
'hr','race-prep','hard',true,360,220,ARRAY['full-tri','ironman','simulation','3800m','180km','360min'])
RETURNING id INTO t75;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t75,1,'warmup','time',600,'hr',1),
(t75,2,'steady','time',4800,'hr',2),
(t75,3,'steady','time',600,'hr',1),
(t75,4,'steady','time',10800,'hr',2),
(t75,5,'steady','time',3600,'hr',3),
(t75,6,'steady','time',600,'hr',2),
(t75,7,'steady','time',1800,'hr',2),
(t75,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Sprint Tri Race Day Prep (35 min)','Day before sprint tri: short swim, spin, easy jog. Activate without fatigue.',
'hr','race-prep','easy',true,35,16,ARRAY['sprint-tri','pre-race','activation','easy','35min'])
RETURNING id INTO t76;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t76,1,'steady','time',600,'hr',1),
(t76,2,'interval','time',120,'hr',3),
(t76,3,'steady','time',600,'hr',1),
(t76,4,'interval','time',120,'hr',3),
(t76,5,'steady','time',300,'hr',1),
(t76,6,'interval','time',120,'hr',3),
(t76,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Olympic Tri Pre-Race Day (30 min)','Pre-race Olympic tri: swim activation + spin + easy jog. Stay fresh.',
'hr','race-prep','easy',true,30,14,ARRAY['olympic-tri','pre-race','activation','easy','30min'])
RETURNING id INTO t77;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t77,1,'steady','time',600,'hr',1),
(t77,2,'interval','time',120,'hr',3),
(t77,3,'steady','time',300,'hr',1),
(t77,4,'interval','time',120,'hr',3),
(t77,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Triathlon Post-Race Recovery (45 min)','Post-race recovery: easy swim + easy bike + walk. Flush out soreness.',
'hr','recovery','easy',true,45,18,ARRAY['post-race','recovery','tri','easy','45min'])
RETURNING id INTO t78;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t78,1,'steady','time',900,'hr',1),
(t78,2,'steady','time',300,'hr',1),
(t78,3,'steady','time',900,'hr',1),
(t78,4,'steady','time',300,'hr',1),
(t78,5,'steady','time',900,'hr',1),
(t78,6,'cooldown','time',300,'hr',1);

-- ============================================================
-- CATEGORY 6: MULTI-SPORT CONDITIONING (t79-t90)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Multi-Sport Endurance Base (90 min)','90 min even split between swim, bike, run. Pure aerobic base development.',
'hr','endurance','moderate',true,90,52,ARRAY['multi-sport','endurance','base','aerobic','90min'])
RETURNING id INTO t79;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t79,1,'warmup','time',300,'hr',1),
(t79,2,'steady','time',1800,'hr',2),
(t79,3,'steady','time',300,'hr',1),
(t79,4,'steady','time',1800,'hr',2),
(t79,5,'steady','time',300,'hr',1),
(t79,6,'steady','time',1800,'hr',2),
(t79,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Triathlon Strength Conditioning (60 min)','Core strength exercises between swim, bike, and run segments.',
'hr','strength','moderate',true,60,36,ARRAY['strength','conditioning','core','multi-sport','60min'])
RETURNING id INTO t80;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t80,1,'warmup','time',600,'hr',1),
(t80,2,'steady','time',1200,'hr',2),
(t80,3,'interval','time',600,'hr',3),
(t80,4,'steady','time',1200,'hr',2),
(t80,5,'interval','time',600,'hr',3),
(t80,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Triathlon Speed Work Multi (75 min)','Speed-focused multi-sport: short Z4-Z5 intervals in each discipline.',
'hr','vo2max','hard',true,75,52,ARRAY['speed','vo2max','multi-sport','intervals','75min'])
RETURNING id INTO t81;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t81,1,'warmup','time',600,'hr',1),
(t81,2,'interval','time',300,'hr',5),
(t81,3,'recovery','time',300,'hr',1),
(t81,4,'interval','time',300,'hr',5),
(t81,5,'recovery','time',300,'hr',1),
(t81,6,'steady','time',300,'hr',2),
(t81,7,'interval','time',300,'hr',5),
(t81,8,'recovery','time',300,'hr',1),
(t81,9,'interval','time',300,'hr',5),
(t81,10,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Pyramid Volume Build (90 min)','Multi-sport pyramid: build duration each discipline in ascending order.',
'hr','endurance','hard',true,90,54,ARRAY['pyramid','volume','multi-sport','build','90min'])
RETURNING id INTO t82;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t82,1,'warmup','time',300,'hr',1),
(t82,2,'steady','time',900,'hr',2),
(t82,3,'steady','time',300,'hr',1),
(t82,4,'steady','time',1800,'hr',2),
(t82,5,'steady','time',300,'hr',1),
(t82,6,'steady','time',2700,'hr',2),
(t82,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Triathlon Lactate Tolerance (70 min)','High intensity multi-sport: Z4 efforts in each discipline for lactate training.',
'hr','threshold','hard',true,70,50,ARRAY['lactate','threshold','multi-sport','z4','70min'])
RETURNING id INTO t83;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t83,1,'warmup','time',600,'hr',1),
(t83,2,'interval','time',600,'hr',4),
(t83,3,'recovery','time',300,'hr',1),
(t83,4,'interval','time',600,'hr',4),
(t83,5,'recovery','time',300,'hr',1),
(t83,6,'interval','time',600,'hr',4),
(t83,7,'recovery','time',300,'hr',1),
(t83,8,'interval','time',600,'hr',4),
(t83,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Swim-Run Conditioning (60 min)','Swim-run pairs: swim 400m then run 1km, repeated 3x. Aquathlon base.',
'hr','endurance','moderate',true,60,36,ARRAY['swim-run','aquathlon','conditioning','3x','60min'])
RETURNING id INTO t84;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t84,1,'warmup','time',300,'hr',1),
(t84,2,'steady','time',900,'hr',3),
(t84,3,'steady','time',900,'hr',3),
(t84,4,'steady','time',900,'hr',3),
(t84,5,'steady','time',900,'hr',3),
(t84,6,'steady','time',900,'hr',3),
(t84,7,'steady','time',900,'hr',3),
(t84,8,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Metabolic Test Day (90 min)','Testing day: CSS swim, FTP bike, threshold run back to back.',
'hr','assessment','hard',true,90,60,ARRAY['test','metabolic','css','ftp','threshold','90min'])
RETURNING id INTO t85;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t85,1,'warmup','time',600,'hr',1),
(t85,2,'interval','time',1200,'hr',3),
(t85,3,'recovery','time',600,'hr',1),
(t85,4,'interval','time',1200,'hr',4),
(t85,5,'recovery','time',600,'hr',1),
(t85,6,'interval','time',1200,'hr',4),
(t85,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Multi-Sport Long Easy (120 min)','LSD multi-sport: 40 min swim + 40 min bike + 40 min run. All Z1-Z2.',
'hr','endurance','moderate',true,120,66,ARRAY['lsd','multi-sport','long','z1-z2','120min'])
RETURNING id INTO t86;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t86,1,'warmup','time',600,'hr',1),
(t86,2,'steady','time',2400,'hr',2),
(t86,3,'steady','time',600,'hr',1),
(t86,4,'steady','time',2400,'hr',2),
(t86,5,'steady','time',600,'hr',1),
(t86,6,'steady','time',2400,'hr',2),
(t86,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Neuromuscular Multi (50 min)','Short explosive efforts in each discipline to fire fast-twitch fibers.',
'hr','sprint','hard',true,50,38,ARRAY['neuromuscular','sprint','multi-sport','explosive','50min'])
RETURNING id INTO t87;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t87,1,'warmup','time',600,'hr',1),
(t87,2,'interval','time',120,'hr',5),
(t87,3,'recovery','time',300,'hr',1),
(t87,4,'interval','time',120,'hr',5),
(t87,5,'recovery','time',300,'hr',1),
(t87,6,'interval','time',120,'hr',5),
(t87,7,'recovery','time',300,'hr',1),
(t87,8,'interval','time',120,'hr',5),
(t87,9,'recovery','time',300,'hr',1),
(t87,10,'interval','time',120,'hr',5),
(t87,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Overreach Block Day 1 (75 min)','Day 1 of 2-day overreach block. High volume multi-sport stimulus.',
'hr','endurance','hard',true,75,46,ARRAY['overreach','block','day1','multi-sport','75min'])
RETURNING id INTO t88;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t88,1,'warmup','time',600,'hr',1),
(t88,2,'steady','time',1800,'hr',2),
(t88,3,'steady','time',600,'hr',3),
(t88,4,'steady','time',600,'hr',2),
(t88,5,'steady','time',1800,'hr',2),
(t88,6,'steady','time',600,'hr',3),
(t88,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Overreach Block Day 2 (90 min)','Day 2 of overreach block. Higher intensity multi-sport.',
'hr','endurance','hard',true,90,58,ARRAY['overreach','block','day2','multi-sport','90min'])
RETURNING id INTO t89;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t89,1,'warmup','time',600,'hr',1),
(t89,2,'steady','time',1200,'hr',3),
(t89,3,'steady','time',300,'hr',2),
(t89,4,'steady','time',1200,'hr',3),
(t89,5,'steady','time',300,'hr',2),
(t89,6,'steady','time',1200,'hr',3),
(t89,7,'steady','time',300,'hr',2),
(t89,8,'steady','time',1200,'hr',3),
(t89,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Multi-Sport Heart Rate Calibration (60 min)','Establish HR zones across all three sports. Low intensity, data collection.',
'hr','assessment','easy',true,60,30,ARRAY['assessment','hr-calibration','zones','multi-sport','60min'])
RETURNING id INTO t90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t90,1,'warmup','time',300,'hr',1),
(t90,2,'steady','time',600,'hr',2),
(t90,3,'interval','time',300,'hr',3),
(t90,4,'interval','time',300,'hr',4),
(t90,5,'recovery','time',300,'hr',1),
(t90,6,'steady','time',600,'hr',2),
(t90,7,'interval','time',300,'hr',3),
(t90,8,'interval','time',300,'hr',4),
(t90,9,'recovery','time',300,'hr',1),
(t90,10,'steady','time',600,'hr',2),
(t90,11,'interval','time',300,'hr',3),
(t90,12,'cooldown','time',300,'hr',1);

-- ============================================================
-- CATEGORY 7: RACE PREP & TAPER (t91-t100)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Race Week Short Activation (30 min)','Race week multi-sport: a few race-pace bursts in each discipline.',
'hr','race-prep','easy',true,30,16,ARRAY['race-week','activation','taper','multi-sport','30min'])
RETURNING id INTO t91;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t91,1,'warmup','time',300,'hr',1),
(t91,2,'interval','time',120,'hr',3),
(t91,3,'steady','time',300,'hr',1),
(t91,4,'interval','time',120,'hr',3),
(t91,5,'steady','time',300,'hr',1),
(t91,6,'interval','time',120,'hr',3),
(t91,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Race Morning Warm-Up Multi (20 min)','Pre-race morning warm-up: easy swim + brief bike + jog. Activates system.',
'hr','race-prep','easy',true,20,8,ARRAY['race-morning','warm-up','activation','easy','20min'])
RETURNING id INTO t92;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t92,1,'steady','time',300,'hr',1),
(t92,2,'interval','time',120,'hr',3),
(t92,3,'steady','time',300,'hr',1),
(t92,4,'interval','time',120,'hr',3),
(t92,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Peak Week Long Tri Simulation (150 min)','Peak week simulation: race-pace multi-sport at full race distances.',
'hr','race-prep','hard',true,150,96,ARRAY['peak-week','simulation','race-pace','full','150min'])
RETURNING id INTO t93;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t93,1,'warmup','time',600,'hr',1),
(t93,2,'steady','time',2400,'hr',3),
(t93,3,'steady','time',600,'hr',2),
(t93,4,'steady','time',3600,'hr',3),
(t93,5,'steady','time',600,'hr',2),
(t93,6,'steady','time',2700,'hr',3),
(t93,7,'steady','time',600,'hr',4),
(t93,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','2 Weeks Out Race Prep (90 min)','2 weeks pre-race: maintain intensity, reduce volume. Race-pace efforts.',
'hr','race-prep','hard',true,90,56,ARRAY['taper','2-weeks-out','race-prep','intensity','90min'])
RETURNING id INTO t94;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t94,1,'warmup','time',600,'hr',1),
(t94,2,'interval','time',600,'hr',3),
(t94,3,'recovery','time',300,'hr',1),
(t94,4,'interval','time',600,'hr',3),
(t94,5,'steady','time',300,'hr',2),
(t94,6,'interval','time',600,'hr',3),
(t94,7,'recovery','time',300,'hr',1),
(t94,8,'interval','time',600,'hr',3),
(t94,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','1 Week Out Sharpener (45 min)','Race week sharpener: high quality but short multi-sport. Stay fresh.',
'hr','race-prep','moderate',true,45,26,ARRAY['taper','race-week','sharpener','quality','45min'])
RETURNING id INTO t95;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t95,1,'warmup','time',600,'hr',1),
(t95,2,'interval','time',300,'hr',3),
(t95,3,'recovery','time',300,'hr',1),
(t95,4,'interval','time',300,'hr',3),
(t95,5,'recovery','time',300,'hr',1),
(t95,6,'interval','time',300,'hr',3),
(t95,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Post-Race Active Recovery Tri (50 min)','Day after race active recovery: very easy swim, bike, jog to flush legs.',
'hr','recovery','easy',true,50,22,ARRAY['post-race','recovery','tri','active-recovery','50min'])
RETURNING id INTO t96;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t96,1,'steady','time',900,'hr',1),
(t96,2,'steady','time',300,'hr',1),
(t96,3,'steady','time',900,'hr',1),
(t96,4,'steady','time',300,'hr',1),
(t96,5,'steady','time',900,'hr',1),
(t96,6,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Off-Season Intro Multi-Sport (45 min)','Re-entry into multi-sport after off-season. Easy all three disciplines.',
'hr','endurance','easy',true,45,20,ARRAY['off-season','intro','easy','multi-sport','45min'])
RETURNING id INTO t97;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t97,1,'warmup','time',300,'hr',1),
(t97,2,'steady','time',900,'hr',1),
(t97,3,'steady','time',300,'hr',1),
(t97,4,'steady','time',900,'hr',2),
(t97,5,'steady','time',300,'hr',1),
(t97,6,'steady','time',900,'hr',2),
(t97,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Race Strategy Rehearsal OLY (90 min)','Full rehearsal of race strategy, nutrition, pacing, and mental cues.',
'hr','race-prep','hard',true,90,56,ARRAY['race-strategy','rehearsal','olympic','mental','90min'])
RETURNING id INTO t98;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t98,1,'warmup','time',600,'hr',1),
(t98,2,'steady','time',1500,'hr',3),
(t98,3,'steady','time',300,'hr',2),
(t98,4,'steady','time',3600,'hr',3),
(t98,5,'steady','time',300,'hr',2),
(t98,6,'steady','time',2400,'hr',3),
(t98,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Tri Training Season Opener (60 min)','Start of season multi-sport test day. Establishes season baselines.',
'hr','assessment','moderate',true,60,36,ARRAY['season-opener','assessment','baseline','multi-sport','60min'])
RETURNING id INTO t99;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t99,1,'warmup','time',600,'hr',1),
(t99,2,'interval','time',600,'hr',3),
(t99,3,'recovery','time',300,'hr',1),
(t99,4,'interval','time',600,'hr',3),
(t99,5,'recovery','time',300,'hr',1),
(t99,6,'interval','time',600,'hr',3),
(t99,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Final Pre-Race Tune-Up (25 min)','Day before race: easy swim + 10 min bike + 5 min jog. Pure activation.',
'hr','race-prep','easy',true,25,10,ARRAY['pre-race','tune-up','activation','day-before','25min'])
RETURNING id INTO t100;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(t100,1,'steady','time',600,'hr',1),
(t100,2,'interval','time',120,'hr',3),
(t100,3,'steady','time',600,'hr',1),
(t100,4,'interval','time',120,'hr',3),
(t100,5,'cooldown','time',300,'hr',1);

END $$;
