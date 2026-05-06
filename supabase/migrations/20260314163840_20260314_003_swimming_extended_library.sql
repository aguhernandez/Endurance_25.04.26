/*
  # Swimming Extended Workout Library

  ## Summary
  Adds 100 swimming workouts to the public workout library across 7 categories.
  All workouts use pace-based zone targeting consistent with the existing physiology
  system. Impulse values calculated as sum(duration_hours × relIntensity) where
  sport_factor=0.85 is applied client-side (stored values are pre-factor).

  ## Categories
  1. Technique & Drill Focus (s1–s15): 15 workouts
  2. Easy Aerobic & Recovery (s16–s30): 15 workouts
  3. CSS / Threshold (s31–s50): 20 workouts
  4. VO2max / Lactate (s51–s65): 15 workouts
  5. Sprint & Speed (s66–s75): 10 workouts
  6. Endurance / Distance (s76–s88): 13 workouts
  7. Open Water / Race Prep (s89–s100): 12 workouts

  ## Zone Intensity Map (pace zones)
  Z1=0.55, Z2=0.70, Z3=0.83, Z4=0.95, Z5=1.10

  ## Notes
  - All workouts: is_public=true, coach_id=null (library entries)
  - Category 'mixed' replaced with valid values per workouts_category_check constraint
  - Valid categories: endurance, threshold, vo2max, sprint, recovery, strength, other,
    climbing, technique, assessment, race-prep
*/

DO $$ DECLARE
  s1 uuid; s2 uuid; s3 uuid; s4 uuid; s5 uuid;
  s6 uuid; s7 uuid; s8 uuid; s9 uuid; s10 uuid;
  s11 uuid; s12 uuid; s13 uuid; s14 uuid; s15 uuid;
  s16 uuid; s17 uuid; s18 uuid; s19 uuid; s20 uuid;
  s21 uuid; s22 uuid; s23 uuid; s24 uuid; s25 uuid;
  s26 uuid; s27 uuid; s28 uuid; s29 uuid; s30 uuid;
  s31 uuid; s32 uuid; s33 uuid; s34 uuid; s35 uuid;
  s36 uuid; s37 uuid; s38 uuid; s39 uuid; s40 uuid;
  s41 uuid; s42 uuid; s43 uuid; s44 uuid; s45 uuid;
  s46 uuid; s47 uuid; s48 uuid; s49 uuid; s50 uuid;
  s51 uuid; s52 uuid; s53 uuid; s54 uuid; s55 uuid;
  s56 uuid; s57 uuid; s58 uuid; s59 uuid; s60 uuid;
  s61 uuid; s62 uuid; s63 uuid; s64 uuid; s65 uuid;
  s66 uuid; s67 uuid; s68 uuid; s69 uuid; s70 uuid;
  s71 uuid; s72 uuid; s73 uuid; s74 uuid; s75 uuid;
  s76 uuid; s77 uuid; s78 uuid; s79 uuid; s80 uuid;
  s81 uuid; s82 uuid; s83 uuid; s84 uuid; s85 uuid;
  s86 uuid; s87 uuid; s88 uuid; s89 uuid; s90 uuid;
  s91 uuid; s92 uuid; s93 uuid; s94 uuid; s95 uuid;
  s96 uuid; s97 uuid; s98 uuid; s99 uuid; s100 uuid;
BEGIN

-- ============================================================
-- CATEGORY 1: TECHNIQUE & DRILL FOCUS (s1-s15)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Technique Foundations (30 min)','Basic drill sets focusing on catch, pull, and kick mechanics. Low intensity, high focus.',
'pace','technique','easy',true,30,12,ARRAY['technique','drills','beginner','30min','form'])
RETURNING id INTO s1;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s1,1,'warmup','distance',200,'pace',1),
(s1,2,'steady','distance',400,'pace',1),
(s1,3,'steady','distance',200,'pace',1),
(s1,4,'cooldown','distance',100,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Catch & Pull Drill Session (40 min)','Fingertip drag, fist drill, and catch-up drill sets to improve arm mechanics.',
'pace','technique','easy',true,40,16,ARRAY['technique','catch','pull','drills','40min'])
RETURNING id INTO s2;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s2,1,'warmup','distance',300,'pace',1),
(s2,2,'steady','distance',200,'pace',1),
(s2,3,'steady','distance',200,'pace',1),
(s2,4,'steady','distance',200,'pace',1),
(s2,5,'cooldown','distance',100,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Kick Mechanics Session (35 min)','Kickboard sets with fins and without to develop ankle flexibility and kick power.',
'pace','technique','easy',true,35,14,ARRAY['technique','kick','kickboard','fins','35min'])
RETURNING id INTO s3;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s3,1,'warmup','distance',200,'pace',1),
(s3,2,'steady','distance',300,'pace',1),
(s3,3,'steady','distance',300,'pace',1),
(s3,4,'cooldown','distance',100,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Body Rotation Drill Set (45 min)','Side kick, 6-3-6, and 10-2 drills to improve body rotation and balance.',
'pace','technique','easy',true,45,18,ARRAY['technique','rotation','balance','drills','45min'])
RETURNING id INTO s4;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s4,1,'warmup','distance',300,'pace',1),
(s4,2,'steady','distance',400,'pace',1),
(s4,3,'steady','distance',300,'pace',2),
(s4,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Breathing Pattern Drill (40 min)','Bilateral breathing every 3, 5, and 7 strokes. Improves CO2 tolerance and balance.',
'pace','technique','easy',true,40,16,ARRAY['technique','breathing','bilateral','drills','40min'])
RETURNING id INTO s5;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s5,1,'warmup','distance',200,'pace',1),
(s5,2,'steady','distance',400,'pace',1),
(s5,3,'steady','distance',400,'pace',1),
(s5,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Head Position & Sighting Drill (35 min)','Open water sighting practice and head position optimization sets.',
'pace','technique','easy',true,35,14,ARRAY['technique','sighting','open-water','head-position','35min'])
RETURNING id INTO s6;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s6,1,'warmup','distance',200,'pace',1),
(s6,2,'steady','distance',300,'pace',1),
(s6,3,'steady','distance',300,'pace',1),
(s6,4,'cooldown','distance',100,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Pull Buoy Technique (50 min)','Pull buoy focused session to isolate upper body mechanics and build arm strength.',
'pace','technique','easy',true,50,22,ARRAY['technique','pull-buoy','upper-body','isolation','50min'])
RETURNING id INTO s7;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s7,1,'warmup','distance',300,'pace',1),
(s7,2,'steady','distance',600,'pace',2),
(s7,3,'steady','distance',400,'pace',2),
(s7,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Stroke Count & DPS Focus (45 min)','Distance-per-stroke sets with focus on maximizing glide and reducing drag.',
'pace','technique','easy',true,45,18,ARRAY['technique','dps','stroke-count','efficiency','45min'])
RETURNING id INTO s8;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s8,1,'warmup','distance',200,'pace',1),
(s8,2,'steady','distance',500,'pace',1),
(s8,3,'steady','distance',300,'pace',2),
(s8,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Turns & Walls Technique (45 min)','Flip turn mechanics, open turns, and push-off technique focus sets.',
'pace','technique','easy',true,45,18,ARRAY['technique','turns','flip-turn','walls','45min'])
RETURNING id INTO s9;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s9,1,'warmup','distance',300,'pace',1),
(s9,2,'steady','distance',400,'pace',1),
(s9,3,'steady','distance',400,'pace',2),
(s9,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Mixed Drill Medley (60 min)','Combination of all major drills: catch-up, fingertip drag, side kick, fist drill.',
'pace','technique','easy',true,60,26,ARRAY['technique','drills','medley','mixed','60min'])
RETURNING id INTO s10;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s10,1,'warmup','distance',300,'pace',1),
(s10,2,'steady','distance',400,'pace',1),
(s10,3,'steady','distance',400,'pace',1),
(s10,4,'steady','distance',400,'pace',2),
(s10,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Underwater Dolphin Kick (40 min)','Streamline and underwater kick sets to maximize push-off efficiency.',
'pace','technique','easy',true,40,16,ARRAY['technique','dolphin-kick','underwater','streamline','40min'])
RETURNING id INTO s11;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s11,1,'warmup','distance',200,'pace',1),
(s11,2,'steady','distance',300,'pace',1),
(s11,3,'steady','distance',300,'pace',2),
(s11,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Paddles & Technique (50 min)','Hand paddle sets alternating with drill sets for power and technique development.',
'pace','technique','moderate',true,50,24,ARRAY['technique','paddles','power','drill','50min'])
RETURNING id INTO s12;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s12,1,'warmup','distance',300,'pace',1),
(s12,2,'steady','distance',400,'pace',2),
(s12,3,'steady','distance',400,'pace',2),
(s12,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Hypoxic Drill Sets (45 min)','Breathing restriction sets (every 5, 7 strokes) to build CO2 tolerance.',
'pace','technique','moderate',true,45,20,ARRAY['technique','hypoxic','co2','breathing','45min'])
RETURNING id INTO s13;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s13,1,'warmup','distance',300,'pace',1),
(s13,2,'steady','distance',300,'pace',2),
(s13,3,'steady','distance',400,'pace',2),
(s13,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','IM Drill Session (55 min)','Individual medley technique drills: butterfly, backstroke, breaststroke, freestyle.',
'pace','technique','moderate',true,55,24,ARRAY['technique','IM','medley','all-strokes','55min'])
RETURNING id INTO s14;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s14,1,'warmup','distance',300,'pace',1),
(s14,2,'steady','distance',400,'pace',2),
(s14,3,'steady','distance',400,'pace',2),
(s14,4,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Fingertip & High Elbow Drill (45 min)','High elbow catch and fingertip drag combinations for front quadrant technique.',
'pace','technique','easy',true,45,18,ARRAY['technique','high-elbow','catch','front-quadrant','45min'])
RETURNING id INTO s15;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s15,1,'warmup','distance',200,'pace',1),
(s15,2,'steady','distance',500,'pace',1),
(s15,3,'steady','distance',300,'pace',2),
(s15,4,'cooldown','distance',200,'pace',1);

-- ============================================================
-- CATEGORY 2: EASY AEROBIC & RECOVERY (s16-s30)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Recovery Swim (20 min)','Very gentle recovery swim, no intensity. Pure blood flow and loosening.',
'pace','recovery','easy',true,20,8,ARRAY['recovery','easy','z1','20min','active-recovery'])
RETURNING id INTO s16;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s16,1,'warmup','distance',100,'pace',1),
(s16,2,'steady','distance',400,'pace',1),
(s16,3,'cooldown','distance',100,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Base Z2 (30 min)','Continuous Z2 swimming to build aerobic base. Focus on form.',
'pace','endurance','easy',true,30,14,ARRAY['aerobic','z2','base','30min','continuous'])
RETURNING id INTO s17;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s17,1,'warmup','distance',200,'pace',1),
(s17,2,'steady','distance',600,'pace',2),
(s17,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Z1/Z2 Continuous (40 min)','Long easy continuous swim alternating Z1 and Z2 for aerobic development.',
'pace','endurance','easy',true,40,18,ARRAY['aerobic','z1','z2','continuous','40min'])
RETURNING id INTO s18;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s18,1,'warmup','distance',200,'pace',1),
(s18,2,'steady','distance',400,'pace',1),
(s18,3,'steady','distance',400,'pace',2),
(s18,4,'steady','distance',400,'pace',1),
(s18,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Fartlek Swim (45 min)','Mostly Z2 with occasional 50m Z3 surges every 200m. Gentle aerobic variety.',
'pace','endurance','easy',true,45,22,ARRAY['aerobic','fartlek','z2','z3','45min'])
RETURNING id INTO s19;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s19,1,'warmup','distance',300,'pace',1),
(s19,2,'steady','distance',200,'pace',2),
(s19,3,'interval','distance',50,'pace',3),
(s19,4,'steady','distance',200,'pace',2),
(s19,5,'interval','distance',50,'pace',3),
(s19,6,'steady','distance',200,'pace',2),
(s19,7,'interval','distance',50,'pace',3),
(s19,8,'steady','distance',200,'pace',2),
(s19,9,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Recovery Swim with Drills (35 min)','Easy recovery swim mixed with technique drills. Perfect post-hard session.',
'pace','recovery','easy',true,35,14,ARRAY['recovery','drills','easy','35min','active-recovery'])
RETURNING id INTO s20;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s20,1,'warmup','distance',200,'pace',1),
(s20,2,'steady','distance',200,'pace',1),
(s20,3,'steady','distance',200,'pace',2),
(s20,4,'steady','distance',200,'pace',1),
(s20,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Z2 Build (45 min)','Progressive Z2 session starting easy, building to top of Z2 by end.',
'pace','endurance','easy',true,45,22,ARRAY['aerobic','z2','progressive','build','45min'])
RETURNING id INTO s21;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s21,1,'warmup','distance',300,'pace',1),
(s21,2,'steady','distance',400,'pace',2),
(s21,3,'steady','distance',400,'pace',2),
(s21,4,'steady','distance',300,'pace',2),
(s21,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','1000m Easy Swim (30 min)','Simple 1000m at easy Z2 pace. Ideal for building base volume.',
'pace','endurance','easy',true,30,14,ARRAY['aerobic','z2','1000m','volume','30min'])
RETURNING id INTO s22;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s22,1,'warmup','distance',200,'pace',1),
(s22,2,'steady','distance',800,'pace',2),
(s22,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy 1500m Aerobic (45 min)','1500m at Z2 with short rest breaks. Builds aerobic endurance.',
'pace','endurance','easy',true,45,24,ARRAY['aerobic','z2','1500m','45min','endurance'])
RETURNING id INTO s23;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s23,1,'warmup','distance',300,'pace',1),
(s23,2,'steady','distance',500,'pace',2),
(s23,3,'recovery','distance',100,'pace',1),
(s23,4,'steady','distance',500,'pace',2),
(s23,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Pyramid Easy Aerobic (50 min)','Easy distance pyramid: 100-200-300-400-300-200-100m all at Z2.',
'pace','endurance','easy',true,50,26,ARRAY['aerobic','pyramid','z2','50min','endurance'])
RETURNING id INTO s24;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s24,1,'warmup','distance',200,'pace',1),
(s24,2,'steady','distance',100,'pace',2),
(s24,3,'steady','distance',200,'pace',2),
(s24,4,'steady','distance',300,'pace',2),
(s24,5,'steady','distance',400,'pace',2),
(s24,6,'steady','distance',300,'pace',2),
(s24,7,'steady','distance',200,'pace',2),
(s24,8,'steady','distance',100,'pace',2),
(s24,9,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Negative Split (40 min)','Swim 2nd half of each interval faster than first. Develops pacing awareness.',
'pace','endurance','easy',true,40,18,ARRAY['aerobic','negative-split','pacing','z2','40min'])
RETURNING id INTO s25;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s25,1,'warmup','distance',200,'pace',1),
(s25,2,'steady','distance',400,'pace',2),
(s25,3,'recovery','distance',100,'pace',1),
(s25,4,'steady','distance',400,'pace',2),
(s25,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Mix Z1/Z2/Z3 Aerobic (50 min)','Alternating easy, aerobic, and moderate zones for balanced aerobic development.',
'pace','endurance','moderate',true,50,26,ARRAY['aerobic','mixed-zones','z1','z2','z3','50min'])
RETURNING id INTO s26;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s26,1,'warmup','distance',300,'pace',1),
(s26,2,'steady','distance',300,'pace',2),
(s26,3,'steady','distance',200,'pace',3),
(s26,4,'steady','distance',300,'pace',2),
(s26,5,'steady','distance',200,'pace',3),
(s26,6,'steady','distance',300,'pace',2),
(s26,7,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Pre-Race Easy Swim (25 min)','Light pre-competition activation swim. Just enough to loosen up without fatigue.',
'pace','recovery','easy',true,25,10,ARRAY['pre-race','activation','easy','25min','warm-up'])
RETURNING id INTO s27;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s27,1,'warmup','distance',200,'pace',1),
(s27,2,'steady','distance',300,'pace',2),
(s27,3,'steady','distance',100,'pace',3),
(s27,4,'cooldown','distance',100,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Continuous 2000m Easy (55 min)','Unbroken 2000m at Z2. Pure aerobic endurance base building.',
'pace','endurance','moderate',true,55,30,ARRAY['aerobic','z2','2000m','continuous','55min'])
RETURNING id INTO s28;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s28,1,'warmup','distance',300,'pace',1),
(s28,2,'steady','distance',1800,'pace',2),
(s28,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Long Slow Distance (65 min)','LSD swim: 2500m continuous at Z1-Z2. Pure base building volume.',
'pace','endurance','moderate',true,65,34,ARRAY['lsd','easy','z1','z2','2500m','65min'])
RETURNING id INTO s29;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s29,1,'warmup','distance',300,'pace',1),
(s29,2,'steady','distance',1000,'pace',2),
(s29,3,'steady','distance',1000,'pace',2),
(s29,4,'steady','distance',500,'pace',1),
(s29,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Z2 Endurance with Surges (55 min)','Mostly Z2 with 10 x 25m Z4 sprint surges to activate fast-twitch fibers.',
'pace','endurance','moderate',true,55,32,ARRAY['aerobic','z2','surges','z4','55min'])
RETURNING id INTO s30;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s30,1,'warmup','distance',300,'pace',1),
(s30,2,'steady','distance',200,'pace',2),
(s30,3,'interval','distance',25,'pace',4),
(s30,4,'steady','distance',200,'pace',2),
(s30,5,'interval','distance',25,'pace',4),
(s30,6,'steady','distance',200,'pace',2),
(s30,7,'interval','distance',25,'pace',4),
(s30,8,'steady','distance',200,'pace',2),
(s30,9,'interval','distance',25,'pace',4),
(s30,10,'steady','distance',200,'pace',2),
(s30,11,'interval','distance',25,'pace',4),
(s30,12,'steady','distance',300,'pace',2),
(s30,13,'cooldown','distance',200,'pace',1);

-- ============================================================
-- CATEGORY 3: CSS / THRESHOLD (s31-s50)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Intro 8 x 100m (45 min)','Introduction to Critical Swim Speed training. 8 x 100m at CSS pace with 15s rest.',
'pace','threshold','moderate',true,45,28,ARRAY['css','threshold','100m','intervals','45min'])
RETURNING id INTO s31;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s31,1,'warmup','distance',400,'pace',1),
(s31,2,'interval','distance',100,'pace',3),
(s31,3,'recovery','distance',25,'pace',1),
(s31,4,'interval','distance',100,'pace',3),
(s31,5,'recovery','distance',25,'pace',1),
(s31,6,'interval','distance',100,'pace',3),
(s31,7,'recovery','distance',25,'pace',1),
(s31,8,'interval','distance',100,'pace',3),
(s31,9,'recovery','distance',25,'pace',1),
(s31,10,'interval','distance',100,'pace',3),
(s31,11,'recovery','distance',25,'pace',1),
(s31,12,'interval','distance',100,'pace',3),
(s31,13,'recovery','distance',25,'pace',1),
(s31,14,'interval','distance',100,'pace',3),
(s31,15,'recovery','distance',25,'pace',1),
(s31,16,'interval','distance',100,'pace',3),
(s31,17,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 4 x 200m (45 min)','Threshold 4 x 200m at CSS pace with 30s rest. Sustained aerobic capacity.',
'pace','threshold','moderate',true,45,30,ARRAY['css','threshold','200m','intervals','45min'])
RETURNING id INTO s32;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s32,1,'warmup','distance',400,'pace',1),
(s32,2,'interval','distance',200,'pace',3),
(s32,3,'recovery','distance',50,'pace',1),
(s32,4,'interval','distance',200,'pace',3),
(s32,5,'recovery','distance',50,'pace',1),
(s32,6,'interval','distance',200,'pace',3),
(s32,7,'recovery','distance',50,'pace',1),
(s32,8,'interval','distance',200,'pace',3),
(s32,9,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 2 x 400m (45 min)','Two long threshold sets at CSS. High lactate clearance training.',
'pace','threshold','moderate',true,45,30,ARRAY['css','threshold','400m','45min','sustained'])
RETURNING id INTO s33;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s33,1,'warmup','distance',400,'pace',1),
(s33,2,'interval','distance',400,'pace',3),
(s33,3,'recovery','distance',100,'pace',1),
(s33,4,'interval','distance',400,'pace',3),
(s33,5,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 10 x 100m (50 min)','Higher volume CSS session. 10 x 100m threshold with 15s rest.',
'pace','threshold','hard',true,50,36,ARRAY['css','threshold','100m','volume','50min'])
RETURNING id INTO s34;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s34,1,'warmup','distance',400,'pace',1),
(s34,2,'interval','distance',100,'pace',3),
(s34,3,'recovery','distance',25,'pace',1),
(s34,4,'interval','distance',100,'pace',3),
(s34,5,'recovery','distance',25,'pace',1),
(s34,6,'interval','distance',100,'pace',3),
(s34,7,'recovery','distance',25,'pace',1),
(s34,8,'interval','distance',100,'pace',3),
(s34,9,'recovery','distance',25,'pace',1),
(s34,10,'interval','distance',100,'pace',3),
(s34,11,'recovery','distance',25,'pace',1),
(s34,12,'interval','distance',100,'pace',3),
(s34,13,'recovery','distance',25,'pace',1),
(s34,14,'interval','distance',100,'pace',3),
(s34,15,'recovery','distance',25,'pace',1),
(s34,16,'interval','distance',100,'pace',3),
(s34,17,'recovery','distance',25,'pace',1),
(s34,18,'interval','distance',100,'pace',3),
(s34,19,'recovery','distance',25,'pace',1),
(s34,20,'interval','distance',100,'pace',3),
(s34,21,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 1500m TT Simulation (45 min)','1500m time trial simulation at CSS/Z3 effort. Race prep.',
'pace','threshold','hard',true,45,32,ARRAY['css','threshold','1500m','time-trial','45min'])
RETURNING id INTO s35;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s35,1,'warmup','distance',400,'pace',1),
(s35,2,'interval','distance',1500,'pace',3),
(s35,3,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Broken Threshold 800m (45 min)','800m broken into 4 x 200m with 10s rest. Higher quality than straight 800.',
'pace','threshold','hard',true,45,32,ARRAY['threshold','broken','800m','200m','45min'])
RETURNING id INTO s36;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s36,1,'warmup','distance',400,'pace',1),
(s36,2,'interval','distance',200,'pace',4),
(s36,3,'recovery','distance',25,'pace',1),
(s36,4,'interval','distance',200,'pace',4),
(s36,5,'recovery','distance',25,'pace',1),
(s36,6,'interval','distance',200,'pace',4),
(s36,7,'recovery','distance',25,'pace',1),
(s36,8,'interval','distance',200,'pace',4),
(s36,9,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Tempo 6 x 150m (50 min)','6 x 150m at CSS+5s/100m. Slightly above threshold for lactate production.',
'pace','threshold','hard',true,50,36,ARRAY['css','tempo','150m','threshold','50min'])
RETURNING id INTO s37;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s37,1,'warmup','distance',400,'pace',1),
(s37,2,'interval','distance',150,'pace',3),
(s37,3,'recovery','distance',50,'pace',1),
(s37,4,'interval','distance',150,'pace',3),
(s37,5,'recovery','distance',50,'pace',1),
(s37,6,'interval','distance',150,'pace',3),
(s37,7,'recovery','distance',50,'pace',1),
(s37,8,'interval','distance',150,'pace',3),
(s37,9,'recovery','distance',50,'pace',1),
(s37,10,'interval','distance',150,'pace',3),
(s37,11,'recovery','distance',50,'pace',1),
(s37,12,'interval','distance',150,'pace',3),
(s37,13,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Race Pace 400m + 800m (50 min)','Descending distance threshold: 400m hard, rest, 800m at CSS.',
'pace','threshold','hard',true,50,36,ARRAY['css','threshold','race-pace','400m','800m','50min'])
RETURNING id INTO s38;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s38,1,'warmup','distance',400,'pace',1),
(s38,2,'interval','distance',400,'pace',4),
(s38,3,'recovery','distance',200,'pace',1),
(s38,4,'interval','distance',800,'pace',3),
(s38,5,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Ladder CSS 50-100-200-300 (50 min)','Ascending distance CSS ladder with equal rest. Progressive threshold work.',
'pace','threshold','hard',true,50,34,ARRAY['css','ladder','progressive','threshold','50min'])
RETURNING id INTO s39;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s39,1,'warmup','distance',400,'pace',1),
(s39,2,'interval','distance',50,'pace',3),
(s39,3,'recovery','distance',50,'pace',1),
(s39,4,'interval','distance',100,'pace',3),
(s39,5,'recovery','distance',100,'pace',1),
(s39,6,'interval','distance',200,'pace',3),
(s39,7,'recovery','distance',100,'pace',1),
(s39,8,'interval','distance',300,'pace',3),
(s39,9,'recovery','distance',100,'pace',1),
(s39,10,'interval','distance',200,'pace',3),
(s39,11,'recovery','distance',100,'pace',1),
(s39,12,'interval','distance',100,'pace',3),
(s39,13,'recovery','distance',50,'pace',1),
(s39,14,'interval','distance',50,'pace',3),
(s39,15,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 3 x 500m (55 min)','3 x 500m at CSS with 60s rest. High volume threshold training.',
'pace','threshold','hard',true,55,40,ARRAY['css','threshold','500m','volume','55min'])
RETURNING id INTO s40;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s40,1,'warmup','distance',400,'pace',1),
(s40,2,'interval','distance',500,'pace',3),
(s40,3,'recovery','distance',100,'pace',1),
(s40,4,'interval','distance',500,'pace',3),
(s40,5,'recovery','distance',100,'pace',1),
(s40,6,'interval','distance',500,'pace',3),
(s40,7,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Double 400m Test (45 min)','Classic CSS test set: 400m hard then 200m hard. CSS = (T400 - T200) / 200.',
'pace','assessment','hard',true,45,32,ARRAY['css','test','400m','200m','threshold','45min'])
RETURNING id INTO s41;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s41,1,'warmup','distance',400,'pace',1),
(s41,2,'interval','distance',400,'pace',4),
(s41,3,'recovery','distance',200,'pace',1),
(s41,4,'interval','distance',200,'pace',4),
(s41,5,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold Continuous 1200m (45 min)','Unbroken 1200m at Z3-threshold. Builds lactate buffering capacity.',
'pace','threshold','hard',true,45,32,ARRAY['threshold','continuous','1200m','z3','45min'])
RETURNING id INTO s42;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s42,1,'warmup','distance',400,'pace',1),
(s42,2,'interval','distance',1200,'pace',3),
(s42,3,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 5 x 300m (55 min)','5 x 300m at CSS with 45s rest. Medium-long threshold intervals.',
'pace','threshold','hard',true,55,40,ARRAY['css','threshold','300m','55min','intervals'])
RETURNING id INTO s43;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s43,1,'warmup','distance',400,'pace',1),
(s43,2,'interval','distance',300,'pace',3),
(s43,3,'recovery','distance',75,'pace',1),
(s43,4,'interval','distance',300,'pace',3),
(s43,5,'recovery','distance',75,'pace',1),
(s43,6,'interval','distance',300,'pace',3),
(s43,7,'recovery','distance',75,'pace',1),
(s43,8,'interval','distance',300,'pace',3),
(s43,9,'recovery','distance',75,'pace',1),
(s43,10,'interval','distance',300,'pace',3),
(s43,11,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Tempo Z3 Continuous 2000m (60 min)','2000m continuous at Z3 tempo. Sustained threshold endurance.',
'pace','threshold','hard',true,60,44,ARRAY['tempo','z3','threshold','2000m','60min'])
RETURNING id INTO s44;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s44,1,'warmup','distance',400,'pace',1),
(s44,2,'interval','distance',2000,'pace',3),
(s44,3,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Broken 1000m (50 min)','1000m broken into 10 x 100m at CSS with 10s rest. Very high quality.',
'pace','threshold','hard',true,50,38,ARRAY['css','broken','1000m','100m','threshold','50min'])
RETURNING id INTO s45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s45,1,'warmup','distance',400,'pace',1),
(s45,2,'interval','distance',100,'pace',3),
(s45,3,'recovery','distance',25,'pace',1),
(s45,4,'interval','distance',100,'pace',3),
(s45,5,'recovery','distance',25,'pace',1),
(s45,6,'interval','distance',100,'pace',3),
(s45,7,'recovery','distance',25,'pace',1),
(s45,8,'interval','distance',100,'pace',3),
(s45,9,'recovery','distance',25,'pace',1),
(s45,10,'interval','distance',100,'pace',3),
(s45,11,'recovery','distance',25,'pace',1),
(s45,12,'interval','distance',100,'pace',3),
(s45,13,'recovery','distance',25,'pace',1),
(s45,14,'interval','distance',100,'pace',3),
(s45,15,'recovery','distance',25,'pace',1),
(s45,16,'interval','distance',100,'pace',3),
(s45,17,'recovery','distance',25,'pace',1),
(s45,18,'interval','distance',100,'pace',3),
(s45,19,'recovery','distance',25,'pace',1),
(s45,20,'interval','distance',100,'pace',3),
(s45,21,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Descending CSS 400-300-200-100 (45 min)','Descending threshold ladder with decreasing rest. Intensity rises as distance drops.',
'pace','threshold','hard',true,45,34,ARRAY['css','descending','ladder','threshold','45min'])
RETURNING id INTO s46;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s46,1,'warmup','distance',400,'pace',1),
(s46,2,'interval','distance',400,'pace',3),
(s46,3,'recovery','distance',100,'pace',1),
(s46,4,'interval','distance',300,'pace',3),
(s46,5,'recovery','distance',75,'pace',1),
(s46,6,'interval','distance',200,'pace',4),
(s46,7,'recovery','distance',50,'pace',1),
(s46,8,'interval','distance',100,'pace',4),
(s46,9,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 8 x 150m (50 min)','8 x 150m at CSS with 20s rest. Mid-volume threshold development.',
'pace','threshold','hard',true,50,38,ARRAY['css','150m','threshold','volume','50min'])
RETURNING id INTO s47;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s47,1,'warmup','distance',400,'pace',1),
(s47,2,'interval','distance',150,'pace',3),
(s47,3,'recovery','distance',25,'pace',1),
(s47,4,'interval','distance',150,'pace',3),
(s47,5,'recovery','distance',25,'pace',1),
(s47,6,'interval','distance',150,'pace',3),
(s47,7,'recovery','distance',25,'pace',1),
(s47,8,'interval','distance',150,'pace',3),
(s47,9,'recovery','distance',25,'pace',1),
(s47,10,'interval','distance',150,'pace',3),
(s47,11,'recovery','distance',25,'pace',1),
(s47,12,'interval','distance',150,'pace',3),
(s47,13,'recovery','distance',25,'pace',1),
(s47,14,'interval','distance',150,'pace',3),
(s47,15,'recovery','distance',25,'pace',1),
(s47,16,'interval','distance',150,'pace',3),
(s47,17,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS + Zone 2 Combo (55 min)','Alternates CSS blocks with Z2 recovery swims for sustained threshold training.',
'pace','threshold','hard',true,55,38,ARRAY['css','z2','combo','threshold','55min'])
RETURNING id INTO s48;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s48,1,'warmup','distance',300,'pace',1),
(s48,2,'interval','distance',200,'pace',3),
(s48,3,'steady','distance',200,'pace',2),
(s48,4,'interval','distance',200,'pace',3),
(s48,5,'steady','distance',200,'pace',2),
(s48,6,'interval','distance',200,'pace',3),
(s48,7,'steady','distance',200,'pace',2),
(s48,8,'interval','distance',200,'pace',3),
(s48,9,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold Hold 6 x 200m (50 min)','6 x 200m all at exactly CSS. 30s rest. Discipline of pace control.',
'pace','threshold','hard',true,50,38,ARRAY['css','200m','threshold','pace-control','50min'])
RETURNING id INTO s49;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s49,1,'warmup','distance',400,'pace',1),
(s49,2,'interval','distance',200,'pace',3),
(s49,3,'recovery','distance',50,'pace',1),
(s49,4,'interval','distance',200,'pace',3),
(s49,5,'recovery','distance',50,'pace',1),
(s49,6,'interval','distance',200,'pace',3),
(s49,7,'recovery','distance',50,'pace',1),
(s49,8,'interval','distance',200,'pace',3),
(s49,9,'recovery','distance',50,'pace',1),
(s49,10,'interval','distance',200,'pace',3),
(s49,11,'recovery','distance',50,'pace',1),
(s49,12,'interval','distance',200,'pace',3),
(s49,13,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 400m + 8 x 50m (45 min)','400m at CSS then 8 x 50m faster. Tests ability to maintain speed when fatigued.',
'pace','threshold','hard',true,45,34,ARRAY['css','400m','50m','fatigue','threshold','45min'])
RETURNING id INTO s50;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s50,1,'warmup','distance',400,'pace',1),
(s50,2,'interval','distance',400,'pace',3),
(s50,3,'recovery','distance',100,'pace',1),
(s50,4,'interval','distance',50,'pace',4),
(s50,5,'recovery','distance',25,'pace',1),
(s50,6,'interval','distance',50,'pace',4),
(s50,7,'recovery','distance',25,'pace',1),
(s50,8,'interval','distance',50,'pace',4),
(s50,9,'recovery','distance',25,'pace',1),
(s50,10,'interval','distance',50,'pace',4),
(s50,11,'recovery','distance',25,'pace',1),
(s50,12,'interval','distance',50,'pace',4),
(s50,13,'recovery','distance',25,'pace',1),
(s50,14,'interval','distance',50,'pace',4),
(s50,15,'recovery','distance',25,'pace',1),
(s50,16,'interval','distance',50,'pace',4),
(s50,17,'recovery','distance',25,'pace',1),
(s50,18,'interval','distance',50,'pace',4),
(s50,19,'cooldown','distance',300,'pace',1);

-- ============================================================
-- CATEGORY 4: VO2MAX / LACTATE (s51-s65)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 8 x 50m (40 min)','8 x 50m at Z5 full effort with 45s rest. Maximum aerobic power development.',
'pace','vo2max','hard',true,40,30,ARRAY['vo2max','z5','50m','intervals','40min'])
RETURNING id INTO s51;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s51,1,'warmup','distance',400,'pace',1),
(s51,2,'interval','distance',50,'pace',5),
(s51,3,'recovery','distance',50,'pace',1),
(s51,4,'interval','distance',50,'pace',5),
(s51,5,'recovery','distance',50,'pace',1),
(s51,6,'interval','distance',50,'pace',5),
(s51,7,'recovery','distance',50,'pace',1),
(s51,8,'interval','distance',50,'pace',5),
(s51,9,'recovery','distance',50,'pace',1),
(s51,10,'interval','distance',50,'pace',5),
(s51,11,'recovery','distance',50,'pace',1),
(s51,12,'interval','distance',50,'pace',5),
(s51,13,'recovery','distance',50,'pace',1),
(s51,14,'interval','distance',50,'pace',5),
(s51,15,'recovery','distance',50,'pace',1),
(s51,16,'interval','distance',50,'pace',5),
(s51,17,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 6 x 75m (40 min)','6 x 75m at Z5 effort with 60s rest. Longer VO2max intervals.',
'pace','vo2max','hard',true,40,30,ARRAY['vo2max','z5','75m','intervals','40min'])
RETURNING id INTO s52;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s52,1,'warmup','distance',400,'pace',1),
(s52,2,'interval','distance',75,'pace',5),
(s52,3,'recovery','distance',75,'pace',1),
(s52,4,'interval','distance',75,'pace',5),
(s52,5,'recovery','distance',75,'pace',1),
(s52,6,'interval','distance',75,'pace',5),
(s52,7,'recovery','distance',75,'pace',1),
(s52,8,'interval','distance',75,'pace',5),
(s52,9,'recovery','distance',75,'pace',1),
(s52,10,'interval','distance',75,'pace',5),
(s52,11,'recovery','distance',75,'pace',1),
(s52,12,'interval','distance',75,'pace',5),
(s52,13,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 10 x 50m (45 min)','10 x 50m at Z5 with 45s rest. High intensity volume development.',
'pace','vo2max','hard',true,45,34,ARRAY['vo2max','z5','50m','volume','45min'])
RETURNING id INTO s53;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s53,1,'warmup','distance',400,'pace',1),
(s53,2,'interval','distance',50,'pace',5),
(s53,3,'recovery','distance',50,'pace',1),
(s53,4,'interval','distance',50,'pace',5),
(s53,5,'recovery','distance',50,'pace',1),
(s53,6,'interval','distance',50,'pace',5),
(s53,7,'recovery','distance',50,'pace',1),
(s53,8,'interval','distance',50,'pace',5),
(s53,9,'recovery','distance',50,'pace',1),
(s53,10,'interval','distance',50,'pace',5),
(s53,11,'recovery','distance',50,'pace',1),
(s53,12,'interval','distance',50,'pace',5),
(s53,13,'recovery','distance',50,'pace',1),
(s53,14,'interval','distance',50,'pace',5),
(s53,15,'recovery','distance',50,'pace',1),
(s53,16,'interval','distance',50,'pace',5),
(s53,17,'recovery','distance',50,'pace',1),
(s53,18,'interval','distance',50,'pace',5),
(s53,19,'recovery','distance',50,'pace',1),
(s53,20,'interval','distance',50,'pace',5),
(s53,21,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 5 x 100m (45 min)','5 x 100m at near-maximum effort. Builds top-end aerobic power.',
'pace','vo2max','hard',true,45,34,ARRAY['vo2max','z5','100m','max-effort','45min'])
RETURNING id INTO s54;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s54,1,'warmup','distance',400,'pace',1),
(s54,2,'interval','distance',100,'pace',5),
(s54,3,'recovery','distance',100,'pace',1),
(s54,4,'interval','distance',100,'pace',5),
(s54,5,'recovery','distance',100,'pace',1),
(s54,6,'interval','distance',100,'pace',5),
(s54,7,'recovery','distance',100,'pace',1),
(s54,8,'interval','distance',100,'pace',5),
(s54,9,'recovery','distance',100,'pace',1),
(s54,10,'interval','distance',100,'pace',5),
(s54,11,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max Pyramid 25-50-75-100 (50 min)','Distance pyramid all at Z5 effort with full rest between.',
'pace','vo2max','hard',true,50,36,ARRAY['vo2max','pyramid','z5','50min','lactate'])
RETURNING id INTO s55;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s55,1,'warmup','distance',400,'pace',1),
(s55,2,'interval','distance',25,'pace',5),
(s55,3,'recovery','distance',50,'pace',1),
(s55,4,'interval','distance',50,'pace',5),
(s55,5,'recovery','distance',75,'pace',1),
(s55,6,'interval','distance',75,'pace',5),
(s55,7,'recovery','distance',100,'pace',1),
(s55,8,'interval','distance',100,'pace',5),
(s55,9,'recovery','distance',100,'pace',1),
(s55,10,'interval','distance',75,'pace',5),
(s55,11,'recovery','distance',75,'pace',1),
(s55,12,'interval','distance',50,'pace',5),
(s55,13,'recovery','distance',50,'pace',1),
(s55,14,'interval','distance',25,'pace',5),
(s55,15,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Lactate 3 x 400m Fast (55 min)','3 x 400m at Z4 (above CSS). Lactate production and clearance training.',
'pace','vo2max','hard',true,55,42,ARRAY['lactate','z4','400m','intensity','55min'])
RETURNING id INTO s56;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s56,1,'warmup','distance',400,'pace',1),
(s56,2,'interval','distance',400,'pace',4),
(s56,3,'recovery','distance',200,'pace',1),
(s56,4,'interval','distance',400,'pace',4),
(s56,5,'recovery','distance',200,'pace',1),
(s56,6,'interval','distance',400,'pace',4),
(s56,7,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Max Aerobic 12 x 50m (45 min)','12 x 50m building from Z4 to Z5 across the set. Max aerobic power.',
'pace','vo2max','hard',true,45,36,ARRAY['vo2max','50m','z4','z5','12x','45min'])
RETURNING id INTO s57;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s57,1,'warmup','distance',400,'pace',1),
(s57,2,'interval','distance',50,'pace',4),
(s57,3,'recovery','distance',50,'pace',1),
(s57,4,'interval','distance',50,'pace',4),
(s57,5,'recovery','distance',50,'pace',1),
(s57,6,'interval','distance',50,'pace',4),
(s57,7,'recovery','distance',50,'pace',1),
(s57,8,'interval','distance',50,'pace',4),
(s57,9,'recovery','distance',50,'pace',1),
(s57,10,'interval','distance',50,'pace',5),
(s57,11,'recovery','distance',50,'pace',1),
(s57,12,'interval','distance',50,'pace',5),
(s57,13,'recovery','distance',50,'pace',1),
(s57,14,'interval','distance',50,'pace',5),
(s57,15,'recovery','distance',50,'pace',1),
(s57,16,'interval','distance',50,'pace',5),
(s57,17,'recovery','distance',50,'pace',1),
(s57,18,'interval','distance',50,'pace',5),
(s57,19,'recovery','distance',50,'pace',1),
(s57,20,'interval','distance',50,'pace',5),
(s57,21,'recovery','distance',50,'pace',1),
(s57,22,'interval','distance',50,'pace',5),
(s57,23,'recovery','distance',50,'pace',1),
(s57,24,'interval','distance',50,'pace',5),
(s57,25,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 8 x 75m (50 min)','8 x 75m at Z5 full effort with 90s rest. High-intensity VO2max block.',
'pace','vo2max','hard',true,50,38,ARRAY['vo2max','z5','75m','8x','50min'])
RETURNING id INTO s58;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s58,1,'warmup','distance',400,'pace',1),
(s58,2,'interval','distance',75,'pace',5),
(s58,3,'recovery','distance',100,'pace',1),
(s58,4,'interval','distance',75,'pace',5),
(s58,5,'recovery','distance',100,'pace',1),
(s58,6,'interval','distance',75,'pace',5),
(s58,7,'recovery','distance',100,'pace',1),
(s58,8,'interval','distance',75,'pace',5),
(s58,9,'recovery','distance',100,'pace',1),
(s58,10,'interval','distance',75,'pace',5),
(s58,11,'recovery','distance',100,'pace',1),
(s58,12,'interval','distance',75,'pace',5),
(s58,13,'recovery','distance',100,'pace',1),
(s58,14,'interval','distance',75,'pace',5),
(s58,15,'recovery','distance',100,'pace',1),
(s58,16,'interval','distance',75,'pace',5),
(s58,17,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Broken 200m Best Effort (45 min)','3 x broken 200m (4 x 50m with 5s rest). Best possible pace for 200m.',
'pace','vo2max','hard',true,45,36,ARRAY['vo2max','broken','200m','best-effort','45min'])
RETURNING id INTO s59;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s59,1,'warmup','distance',400,'pace',1),
(s59,2,'interval','distance',50,'pace',5),
(s59,3,'recovery','distance',10,'pace',1),
(s59,4,'interval','distance',50,'pace',5),
(s59,5,'recovery','distance',10,'pace',1),
(s59,6,'interval','distance',50,'pace',5),
(s59,7,'recovery','distance',10,'pace',1),
(s59,8,'interval','distance',50,'pace',5),
(s59,9,'recovery','distance',200,'pace',1),
(s59,10,'interval','distance',50,'pace',5),
(s59,11,'recovery','distance',10,'pace',1),
(s59,12,'interval','distance',50,'pace',5),
(s59,13,'recovery','distance',10,'pace',1),
(s59,14,'interval','distance',50,'pace',5),
(s59,15,'recovery','distance',10,'pace',1),
(s59,16,'interval','distance',50,'pace',5),
(s59,17,'recovery','distance',200,'pace',1),
(s59,18,'interval','distance',50,'pace',5),
(s59,19,'recovery','distance',10,'pace',1),
(s59,20,'interval','distance',50,'pace',5),
(s59,21,'recovery','distance',10,'pace',1),
(s59,22,'interval','distance',50,'pace',5),
(s59,23,'recovery','distance',10,'pace',1),
(s59,24,'interval','distance',50,'pace',5),
(s59,25,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max Mixed Distance Sets (50 min)','25-50-75-50-25m cycles at Z5. Varied stimulus for maximal aerobic adaptation.',
'pace','vo2max','hard',true,50,38,ARRAY['vo2max','mixed','z5','50min','lactate'])
RETURNING id INTO s60;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s60,1,'warmup','distance',400,'pace',1),
(s60,2,'interval','distance',25,'pace',5),
(s60,3,'recovery','distance',50,'pace',1),
(s60,4,'interval','distance',50,'pace',5),
(s60,5,'recovery','distance',50,'pace',1),
(s60,6,'interval','distance',75,'pace',5),
(s60,7,'recovery','distance',75,'pace',1),
(s60,8,'interval','distance',50,'pace',5),
(s60,9,'recovery','distance',50,'pace',1),
(s60,10,'interval','distance',25,'pace',5),
(s60,11,'recovery','distance',100,'pace',1),
(s60,12,'interval','distance',25,'pace',5),
(s60,13,'recovery','distance',50,'pace',1),
(s60,14,'interval','distance',50,'pace',5),
(s60,15,'recovery','distance',50,'pace',1),
(s60,16,'interval','distance',75,'pace',5),
(s60,17,'recovery','distance',75,'pace',1),
(s60,18,'interval','distance',50,'pace',5),
(s60,19,'recovery','distance',50,'pace',1),
(s60,20,'interval','distance',25,'pace',5),
(s60,21,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Max Aerobic 4 x 100m Descend (45 min)','4 x 100m descending pace from Z3 to Z5. Final rep at absolute max.',
'pace','vo2max','hard',true,45,34,ARRAY['vo2max','descend','100m','max','45min'])
RETURNING id INTO s61;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s61,1,'warmup','distance',400,'pace',1),
(s61,2,'interval','distance',100,'pace',3),
(s61,3,'recovery','distance',100,'pace',1),
(s61,4,'interval','distance',100,'pace',4),
(s61,5,'recovery','distance',100,'pace',1),
(s61,6,'interval','distance',100,'pace',4),
(s61,7,'recovery','distance',100,'pace',1),
(s61,8,'interval','distance',100,'pace',5),
(s61,9,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max Super Sets (55 min)','2 sets of (4 x 50m at Z5 + 100m CSS). Combines VO2max and threshold.',
'pace','vo2max','hard',true,55,44,ARRAY['vo2max','superset','z5','css','55min'])
RETURNING id INTO s62;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s62,1,'warmup','distance',400,'pace',1),
(s62,2,'interval','distance',50,'pace',5),
(s62,3,'recovery','distance',50,'pace',1),
(s62,4,'interval','distance',50,'pace',5),
(s62,5,'recovery','distance',50,'pace',1),
(s62,6,'interval','distance',50,'pace',5),
(s62,7,'recovery','distance',50,'pace',1),
(s62,8,'interval','distance',50,'pace',5),
(s62,9,'recovery','distance',50,'pace',1),
(s62,10,'interval','distance',100,'pace',3),
(s62,11,'recovery','distance',100,'pace',1),
(s62,12,'interval','distance',50,'pace',5),
(s62,13,'recovery','distance',50,'pace',1),
(s62,14,'interval','distance',50,'pace',5),
(s62,15,'recovery','distance',50,'pace',1),
(s62,16,'interval','distance',50,'pace',5),
(s62,17,'recovery','distance',50,'pace',1),
(s62,18,'interval','distance',50,'pace',5),
(s62,19,'recovery','distance',50,'pace',1),
(s62,20,'interval','distance',100,'pace',3),
(s62,21,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Race Pace 200m + 4x50m Kicks (45 min)','200m at race pace then 4 x 50m finishing kicks. Pre-race intensity.',
'pace','vo2max','hard',true,45,34,ARRAY['vo2max','race-pace','200m','50m','45min'])
RETURNING id INTO s63;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s63,1,'warmup','distance',400,'pace',1),
(s63,2,'interval','distance',200,'pace',4),
(s63,3,'recovery','distance',200,'pace',1),
(s63,4,'interval','distance',50,'pace',5),
(s63,5,'recovery','distance',50,'pace',1),
(s63,6,'interval','distance',50,'pace',5),
(s63,7,'recovery','distance',50,'pace',1),
(s63,8,'interval','distance',50,'pace',5),
(s63,9,'recovery','distance',50,'pace',1),
(s63,10,'interval','distance',50,'pace',5),
(s63,11,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Lactate Flush 3 x 400m (50 min)','Hard 400m then recovery, repeated 3x. Trains lactate clearance under fatigue.',
'pace','vo2max','hard',true,50,40,ARRAY['lactate','400m','recovery','hard','50min'])
RETURNING id INTO s64;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s64,1,'warmup','distance',400,'pace',1),
(s64,2,'interval','distance',400,'pace',4),
(s64,3,'recovery','distance',200,'pace',1),
(s64,4,'interval','distance',400,'pace',4),
(s64,5,'recovery','distance',200,'pace',1),
(s64,6,'interval','distance',400,'pace',4),
(s64,7,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 16 x 25m (40 min)','16 x 25m sprints at max effort with full rest. Pure VO2max stimulus.',
'pace','vo2max','hard',true,40,30,ARRAY['vo2max','25m','max','sprints','40min'])
RETURNING id INTO s65;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s65,1,'warmup','distance',400,'pace',1),
(s65,2,'interval','distance',25,'pace',5),
(s65,3,'recovery','distance',75,'pace',1),
(s65,4,'interval','distance',25,'pace',5),
(s65,5,'recovery','distance',75,'pace',1),
(s65,6,'interval','distance',25,'pace',5),
(s65,7,'recovery','distance',75,'pace',1),
(s65,8,'interval','distance',25,'pace',5),
(s65,9,'recovery','distance',75,'pace',1),
(s65,10,'interval','distance',25,'pace',5),
(s65,11,'recovery','distance',75,'pace',1),
(s65,12,'interval','distance',25,'pace',5),
(s65,13,'recovery','distance',75,'pace',1),
(s65,14,'interval','distance',25,'pace',5),
(s65,15,'recovery','distance',75,'pace',1),
(s65,16,'interval','distance',25,'pace',5),
(s65,17,'recovery','distance',75,'pace',1),
(s65,18,'interval','distance',25,'pace',5),
(s65,19,'recovery','distance',75,'pace',1),
(s65,20,'interval','distance',25,'pace',5),
(s65,21,'recovery','distance',75,'pace',1),
(s65,22,'interval','distance',25,'pace',5),
(s65,23,'recovery','distance',75,'pace',1),
(s65,24,'interval','distance',25,'pace',5),
(s65,25,'recovery','distance',75,'pace',1),
(s65,26,'interval','distance',25,'pace',5),
(s65,27,'recovery','distance',75,'pace',1),
(s65,28,'interval','distance',25,'pace',5),
(s65,29,'recovery','distance',75,'pace',1),
(s65,30,'interval','distance',25,'pace',5),
(s65,31,'recovery','distance',75,'pace',1),
(s65,32,'interval','distance',25,'pace',5),
(s65,33,'cooldown','distance',400,'pace',1);

-- ============================================================
-- CATEGORY 5: SPRINT & SPEED (s66-s75)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Power 10 x 25m (35 min)','10 x 25m absolute max effort sprints. Pure power and neuromuscular speed.',
'pace','sprint','hard',true,35,24,ARRAY['sprint','25m','max','power','35min'])
RETURNING id INTO s66;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s66,1,'warmup','distance',400,'pace',1),
(s66,2,'interval','distance',25,'pace',5),
(s66,3,'recovery','distance',100,'pace',1),
(s66,4,'interval','distance',25,'pace',5),
(s66,5,'recovery','distance',100,'pace',1),
(s66,6,'interval','distance',25,'pace',5),
(s66,7,'recovery','distance',100,'pace',1),
(s66,8,'interval','distance',25,'pace',5),
(s66,9,'recovery','distance',100,'pace',1),
(s66,10,'interval','distance',25,'pace',5),
(s66,11,'recovery','distance',100,'pace',1),
(s66,12,'interval','distance',25,'pace',5),
(s66,13,'recovery','distance',100,'pace',1),
(s66,14,'interval','distance',25,'pace',5),
(s66,15,'recovery','distance',100,'pace',1),
(s66,16,'interval','distance',25,'pace',5),
(s66,17,'recovery','distance',100,'pace',1),
(s66,18,'interval','distance',25,'pace',5),
(s66,19,'recovery','distance',100,'pace',1),
(s66,20,'interval','distance',25,'pace',5),
(s66,21,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint 6 x 50m Max (35 min)','6 x 50m at absolute max with full rest. Power over pace.',
'pace','sprint','hard',true,35,26,ARRAY['sprint','50m','max','power','35min'])
RETURNING id INTO s67;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s67,1,'warmup','distance',400,'pace',1),
(s67,2,'interval','distance',50,'pace',5),
(s67,3,'recovery','distance',150,'pace',1),
(s67,4,'interval','distance',50,'pace',5),
(s67,5,'recovery','distance',150,'pace',1),
(s67,6,'interval','distance',50,'pace',5),
(s67,7,'recovery','distance',150,'pace',1),
(s67,8,'interval','distance',50,'pace',5),
(s67,9,'recovery','distance',150,'pace',1),
(s67,10,'interval','distance',50,'pace',5),
(s67,11,'recovery','distance',150,'pace',1),
(s67,12,'interval','distance',50,'pace',5),
(s67,13,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Start & Sprint Drill (40 min)','Explosive start practice from wall + 25m sprint. Mimics race starts.',
'pace','sprint','hard',true,40,28,ARRAY['sprint','start','explosive','race-start','40min'])
RETURNING id INTO s68;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s68,1,'warmup','distance',400,'pace',1),
(s68,2,'interval','distance',25,'pace',5),
(s68,3,'recovery','distance',100,'pace',1),
(s68,4,'interval','distance',25,'pace',5),
(s68,5,'recovery','distance',100,'pace',1),
(s68,6,'interval','distance',50,'pace',5),
(s68,7,'recovery','distance',100,'pace',1),
(s68,8,'interval','distance',50,'pace',5),
(s68,9,'recovery','distance',100,'pace',1),
(s68,10,'interval','distance',25,'pace',5),
(s68,11,'recovery','distance',100,'pace',1),
(s68,12,'interval','distance',25,'pace',5),
(s68,13,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Descend 50-25-25 (35 min)','Sprint descend sets: 50m hard, 25m near max, 25m absolute max.',
'pace','sprint','hard',true,35,26,ARRAY['sprint','descend','50m','25m','35min'])
RETURNING id INTO s69;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s69,1,'warmup','distance',400,'pace',1),
(s69,2,'interval','distance',50,'pace',4),
(s69,3,'recovery','distance',100,'pace',1),
(s69,4,'interval','distance',25,'pace',5),
(s69,5,'recovery','distance',100,'pace',1),
(s69,6,'interval','distance',25,'pace',5),
(s69,7,'recovery','distance',200,'pace',1),
(s69,8,'interval','distance',50,'pace',4),
(s69,9,'recovery','distance',100,'pace',1),
(s69,10,'interval','distance',25,'pace',5),
(s69,11,'recovery','distance',100,'pace',1),
(s69,12,'interval','distance',25,'pace',5),
(s69,13,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Fin Sprints 8 x 25m (35 min)','Using fins for supramaximal sprint sets to develop neuromuscular speed.',
'pace','sprint','hard',true,35,24,ARRAY['sprint','fins','25m','neuromuscular','35min'])
RETURNING id INTO s70;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s70,1,'warmup','distance',400,'pace',1),
(s70,2,'interval','distance',25,'pace',5),
(s70,3,'recovery','distance',100,'pace',1),
(s70,4,'interval','distance',25,'pace',5),
(s70,5,'recovery','distance',100,'pace',1),
(s70,6,'interval','distance',25,'pace',5),
(s70,7,'recovery','distance',100,'pace',1),
(s70,8,'interval','distance',25,'pace',5),
(s70,9,'recovery','distance',100,'pace',1),
(s70,10,'interval','distance',25,'pace',5),
(s70,11,'recovery','distance',100,'pace',1),
(s70,12,'interval','distance',25,'pace',5),
(s70,13,'recovery','distance',100,'pace',1),
(s70,14,'interval','distance',25,'pace',5),
(s70,15,'recovery','distance',100,'pace',1),
(s70,16,'interval','distance',25,'pace',5),
(s70,17,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Race Simulation 4 x 100m Sprint (40 min)','4 x 100m at full race pace with 3min rest. Pure race simulation.',
'pace','sprint','hard',true,40,32,ARRAY['sprint','race-pace','100m','simulation','40min'])
RETURNING id INTO s71;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s71,1,'warmup','distance',400,'pace',1),
(s71,2,'interval','distance',100,'pace',5),
(s71,3,'recovery','distance',200,'pace',1),
(s71,4,'interval','distance',100,'pace',5),
(s71,5,'recovery','distance',200,'pace',1),
(s71,6,'interval','distance',100,'pace',5),
(s71,7,'recovery','distance',200,'pace',1),
(s71,8,'interval','distance',100,'pace',5),
(s71,9,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Touch & Go Sprint Sets (35 min)','Touch wall, immediate push-off sprint. Develops explosive turn speed.',
'pace','sprint','hard',true,35,24,ARRAY['sprint','turns','explosive','wall','35min'])
RETURNING id INTO s72;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s72,1,'warmup','distance',400,'pace',1),
(s72,2,'interval','distance',50,'pace',5),
(s72,3,'recovery','distance',100,'pace',1),
(s72,4,'interval','distance',50,'pace',5),
(s72,5,'recovery','distance',100,'pace',1),
(s72,6,'interval','distance',50,'pace',5),
(s72,7,'recovery','distance',100,'pace',1),
(s72,8,'interval','distance',50,'pace',5),
(s72,9,'recovery','distance',100,'pace',1),
(s72,10,'interval','distance',50,'pace',5),
(s72,11,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Taper Sprint Activation (30 min)','Pre-race taper sprint activation: a few quality sprints, mostly easy.',
'pace','sprint','moderate',true,30,18,ARRAY['sprint','taper','pre-race','activation','30min'])
RETURNING id INTO s73;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s73,1,'warmup','distance',400,'pace',1),
(s73,2,'interval','distance',25,'pace',5),
(s73,3,'recovery','distance',100,'pace',1),
(s73,4,'interval','distance',25,'pace',5),
(s73,5,'recovery','distance',100,'pace',1),
(s73,6,'interval','distance',50,'pace',5),
(s73,7,'recovery','distance',100,'pace',1),
(s73,8,'interval','distance',25,'pace',5),
(s73,9,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Speed Play Fartlek (40 min)','Freeform sprint surges inserted into Z2 swim. No set structure, pure feel.',
'pace','sprint','hard',true,40,30,ARRAY['sprint','fartlek','speed-play','z2','40min'])
RETURNING id INTO s74;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s74,1,'warmup','distance',300,'pace',1),
(s74,2,'steady','distance',100,'pace',2),
(s74,3,'interval','distance',25,'pace',5),
(s74,4,'steady','distance',100,'pace',2),
(s74,5,'interval','distance',50,'pace',5),
(s74,6,'steady','distance',100,'pace',2),
(s74,7,'interval','distance',25,'pace',5),
(s74,8,'steady','distance',200,'pace',2),
(s74,9,'interval','distance',50,'pace',5),
(s74,10,'steady','distance',100,'pace',2),
(s74,11,'interval','distance',25,'pace',5),
(s74,12,'steady','distance',100,'pace',2),
(s74,13,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Max Velocity Sprint 20 x 25m (45 min)','20 x 25m max velocity with full rest. Ultimate speed development.',
'pace','sprint','hard',true,45,32,ARRAY['sprint','max-velocity','25m','20x','45min'])
RETURNING id INTO s75;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s75,1,'warmup','distance',400,'pace',1),
(s75,2,'interval','distance',25,'pace',5),
(s75,3,'recovery','distance',100,'pace',1),
(s75,4,'interval','distance',25,'pace',5),
(s75,5,'recovery','distance',100,'pace',1),
(s75,6,'interval','distance',25,'pace',5),
(s75,7,'recovery','distance',100,'pace',1),
(s75,8,'interval','distance',25,'pace',5),
(s75,9,'recovery','distance',100,'pace',1),
(s75,10,'interval','distance',25,'pace',5),
(s75,11,'recovery','distance',100,'pace',1),
(s75,12,'interval','distance',25,'pace',5),
(s75,13,'recovery','distance',100,'pace',1),
(s75,14,'interval','distance',25,'pace',5),
(s75,15,'recovery','distance',100,'pace',1),
(s75,16,'interval','distance',25,'pace',5),
(s75,17,'recovery','distance',100,'pace',1),
(s75,18,'interval','distance',25,'pace',5),
(s75,19,'recovery','distance',100,'pace',1),
(s75,20,'interval','distance',25,'pace',5),
(s75,21,'recovery','distance',100,'pace',1),
(s75,22,'interval','distance',25,'pace',5),
(s75,23,'recovery','distance',100,'pace',1),
(s75,24,'interval','distance',25,'pace',5),
(s75,25,'recovery','distance',100,'pace',1),
(s75,26,'interval','distance',25,'pace',5),
(s75,27,'recovery','distance',100,'pace',1),
(s75,28,'interval','distance',25,'pace',5),
(s75,29,'recovery','distance',100,'pace',1),
(s75,30,'interval','distance',25,'pace',5),
(s75,31,'recovery','distance',100,'pace',1),
(s75,32,'interval','distance',25,'pace',5),
(s75,33,'recovery','distance',100,'pace',1),
(s75,34,'interval','distance',25,'pace',5),
(s75,35,'recovery','distance',100,'pace',1),
(s75,36,'interval','distance',25,'pace',5),
(s75,37,'recovery','distance',100,'pace',1),
(s75,38,'interval','distance',25,'pace',5),
(s75,39,'recovery','distance',100,'pace',1),
(s75,40,'interval','distance',25,'pace',5),
(s75,41,'cooldown','distance',400,'pace',1);

-- ============================================================
-- CATEGORY 6: ENDURANCE / DISTANCE (s76-s88)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Distance 2500m Z2 (70 min)','2500m continuous at Z2 pace. Long slow distance base building.',
'pace','endurance','moderate',true,70,38,ARRAY['endurance','distance','2500m','z2','70min'])
RETURNING id INTO s76;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s76,1,'warmup','distance',300,'pace',1),
(s76,2,'steady','distance',2500,'pace',2),
(s76,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Volume 3000m Mixed Pace (75 min)','3000m total with 500m blocks alternating Z1-Z2-Z3 pacing.',
'pace','endurance','moderate',true,75,44,ARRAY['endurance','3000m','mixed','volume','75min'])
RETURNING id INTO s77;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s77,1,'warmup','distance',300,'pace',1),
(s77,2,'steady','distance',500,'pace',1),
(s77,3,'steady','distance',500,'pace',2),
(s77,4,'steady','distance',500,'pace',3),
(s77,5,'steady','distance',500,'pace',2),
(s77,6,'steady','distance',500,'pace',3),
(s77,7,'steady','distance',500,'pace',2),
(s77,8,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Ironman Swim 3800m (90 min)','Full Ironman swim distance simulation: 3800m at Z2 race effort.',
'pace','endurance','hard',true,90,54,ARRAY['ironman','3800m','triathlon','race-distance','90min'])
RETURNING id INTO s78;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s78,1,'warmup','distance',400,'pace',1),
(s78,2,'steady','distance',1000,'pace',2),
(s78,3,'steady','distance',1000,'pace',2),
(s78,4,'steady','distance',1000,'pace',2),
(s78,5,'steady','distance',800,'pace',2),
(s78,6,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Half-Ironman Swim 1900m (50 min)','Half-Ironman 1900m swim simulation at Z2-Z3 sustained effort.',
'pace','endurance','moderate',true,50,32,ARRAY['half-ironman','1900m','triathlon','race-distance','50min'])
RETURNING id INTO s79;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s79,1,'warmup','distance',400,'pace',1),
(s79,2,'steady','distance',1900,'pace',2),
(s79,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Olympic Distance 1500m Race Sim (40 min)','Olympic triathlon swim: 1500m at race intensity (Z3).',
'pace','endurance','moderate',true,40,28,ARRAY['olympic','1500m','triathlon','race-sim','40min'])
RETURNING id INTO s80;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s80,1,'warmup','distance',400,'pace',1),
(s80,2,'steady','distance',1500,'pace',3),
(s80,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Triathlon 750m Sim (30 min)','Sprint triathlon swim simulation: 750m at Z3-Z4 effort.',
'pace','endurance','moderate',true,30,20,ARRAY['sprint-triathlon','750m','race-sim','z3','30min'])
RETURNING id INTO s81;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s81,1,'warmup','distance',300,'pace',1),
(s81,2,'steady','distance',750,'pace',3),
(s81,3,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Endurance 5 x 400m (60 min)','5 x 400m at Z2-Z3 with 60s rest. High volume threshold endurance.',
'pace','endurance','hard',true,60,42,ARRAY['endurance','400m','5x','z2-z3','60min'])
RETURNING id INTO s82;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s82,1,'warmup','distance',400,'pace',1),
(s82,2,'steady','distance',400,'pace',2),
(s82,3,'recovery','distance',100,'pace',1),
(s82,4,'steady','distance',400,'pace',3),
(s82,5,'recovery','distance',100,'pace',1),
(s82,6,'steady','distance',400,'pace',2),
(s82,7,'recovery','distance',100,'pace',1),
(s82,8,'steady','distance',400,'pace',3),
(s82,9,'recovery','distance',100,'pace',1),
(s82,10,'steady','distance',400,'pace',2),
(s82,11,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Long Z2 + CSS Finish (65 min)','1500m Z2 base followed by 400m CSS finish. Race-specific fatigue endurance.',
'pace','endurance','hard',true,65,44,ARRAY['endurance','z2','css','finish','65min'])
RETURNING id INTO s83;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s83,1,'warmup','distance',400,'pace',1),
(s83,2,'steady','distance',1500,'pace',2),
(s83,3,'recovery','distance',100,'pace',1),
(s83,4,'interval','distance',400,'pace',3),
(s83,5,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Volume 4000m LSD (95 min)','High volume LSD: 4000m at Z1-Z2. Maximum aerobic base training.',
'pace','endurance','hard',true,95,58,ARRAY['lsd','volume','4000m','z1-z2','95min'])
RETURNING id INTO s84;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s84,1,'warmup','distance',300,'pace',1),
(s84,2,'steady','distance',1000,'pace',2),
(s84,3,'steady','distance',1000,'pace',2),
(s84,4,'steady','distance',1000,'pace',2),
(s84,5,'steady','distance',1000,'pace',2),
(s84,6,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Endurance CSS + VO2max Combo (65 min)','1000m CSS followed by 6x50m VO2max. Tests sustained speed then top-end.',
'pace','endurance','hard',true,65,46,ARRAY['endurance','css','vo2max','combo','65min'])
RETURNING id INTO s85;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s85,1,'warmup','distance',400,'pace',1),
(s85,2,'interval','distance',1000,'pace',3),
(s85,3,'recovery','distance',200,'pace',1),
(s85,4,'interval','distance',50,'pace',5),
(s85,5,'recovery','distance',100,'pace',1),
(s85,6,'interval','distance',50,'pace',5),
(s85,7,'recovery','distance',100,'pace',1),
(s85,8,'interval','distance',50,'pace',5),
(s85,9,'recovery','distance',100,'pace',1),
(s85,10,'interval','distance',50,'pace',5),
(s85,11,'recovery','distance',100,'pace',1),
(s85,12,'interval','distance',50,'pace',5),
(s85,13,'recovery','distance',100,'pace',1),
(s85,14,'interval','distance',50,'pace',5),
(s85,15,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Marathon Swim Prep 5000m (120 min)','Ultra endurance swim: 5000m Z1-Z2. Open water marathon preparation.',
'pace','endurance','hard',true,120,72,ARRAY['marathon','5000m','ultra-endurance','open-water','120min'])
RETURNING id INTO s86;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s86,1,'warmup','distance',400,'pace',1),
(s86,2,'steady','distance',1000,'pace',2),
(s86,3,'steady','distance',1000,'pace',2),
(s86,4,'steady','distance',1000,'pace',2),
(s86,5,'steady','distance',1000,'pace',1),
(s86,6,'steady','distance',1000,'pace',2),
(s86,7,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Progressive Distance 500-1000-500 (55 min)','Progressive distance set: 500 Z3 + 1000 Z2 + 500 Z3. Race simulation.',
'pace','endurance','hard',true,55,38,ARRAY['endurance','progressive','500m','1000m','55min'])
RETURNING id INTO s87;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s87,1,'warmup','distance',400,'pace',1),
(s87,2,'steady','distance',500,'pace',3),
(s87,3,'recovery','distance',100,'pace',1),
(s87,4,'steady','distance',1000,'pace',2),
(s87,5,'recovery','distance',100,'pace',1),
(s87,6,'steady','distance',500,'pace',3),
(s87,7,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Endurance Negative Split 2000m (60 min)','2000m with second km faster than first. Race-specific pacing strategy.',
'pace','endurance','hard',true,60,40,ARRAY['endurance','negative-split','2000m','pacing','60min'])
RETURNING id INTO s88;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s88,1,'warmup','distance',400,'pace',1),
(s88,2,'steady','distance',1000,'pace',2),
(s88,3,'steady','distance',1000,'pace',3),
(s88,4,'cooldown','distance',300,'pace',1);

-- ============================================================
-- CATEGORY 7: OPEN WATER / RACE PREP (s89-s100)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Open Water Sighting Simulation (50 min)','Sighting practice: lift head every 10 strokes during continuous swim.',
'pace','race-prep','moderate',true,50,28,ARRAY['open-water','sighting','simulation','triathlon','50min'])
RETURNING id INTO s89;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s89,1,'warmup','distance',300,'pace',1),
(s89,2,'steady','distance',500,'pace',2),
(s89,3,'recovery','distance',100,'pace',1),
(s89,4,'steady','distance',500,'pace',2),
(s89,5,'recovery','distance',100,'pace',1),
(s89,6,'steady','distance',500,'pace',2),
(s89,7,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Crowded Start Simulation (45 min)','Hard 250m start effort, settle to race pace, sprint finish. Mimics mass start.',
'pace','race-prep','hard',true,45,32,ARRAY['open-water','mass-start','triathlon','race-start','45min'])
RETURNING id INTO s90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s90,1,'warmup','distance',300,'pace',1),
(s90,2,'interval','distance',250,'pace',4),
(s90,3,'steady','distance',500,'pace',3),
(s90,4,'interval','distance',100,'pace',5),
(s90,5,'recovery','distance',200,'pace',1),
(s90,6,'interval','distance',250,'pace',4),
(s90,7,'steady','distance',500,'pace',3),
(s90,8,'interval','distance',100,'pace',5),
(s90,9,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Wetsuit Adaptation Swim (45 min)','Moderate swim to adapt to wetsuit buoyancy: slightly different stroke mechanics.',
'pace','race-prep','moderate',true,45,24,ARRAY['open-water','wetsuit','adaptation','triathlon','45min'])
RETURNING id INTO s91;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s91,1,'warmup','distance',300,'pace',1),
(s91,2,'steady','distance',400,'pace',2),
(s91,3,'steady','distance',400,'pace',2),
(s91,4,'steady','distance',400,'pace',2),
(s91,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','T1 Preparation Swim (40 min)','Simulate swim to transition: finish at race pace then practice quick exit.',
'pace','race-prep','moderate',true,40,26,ARRAY['t1','transition','triathlon','race-pace','40min'])
RETURNING id INTO s92;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s92,1,'warmup','distance',300,'pace',1),
(s92,2,'steady','distance',500,'pace',2),
(s92,3,'steady','distance',500,'pace',3),
(s92,4,'interval','distance',100,'pace',4),
(s92,5,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Medley Endurance Mix (55 min)','IM rotation sets: 100m fly, 200m back, 300m breast, 400m free all at Z2.',
'pace','other','moderate',true,55,32,ARRAY['medley','IM','mixed-strokes','endurance','55min'])
RETURNING id INTO s93;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s93,1,'warmup','distance',400,'pace',1),
(s93,2,'steady','distance',100,'pace',2),
(s93,3,'recovery','distance',50,'pace',1),
(s93,4,'steady','distance',200,'pace',2),
(s93,5,'recovery','distance',50,'pace',1),
(s93,6,'steady','distance',300,'pace',2),
(s93,7,'recovery','distance',50,'pace',1),
(s93,8,'steady','distance',400,'pace',2),
(s93,9,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Hypoxic Endurance Set (50 min)','Long Z2 with breathing restriction every 200m for open water CO2 tolerance.',
'pace','other','moderate',true,50,30,ARRAY['hypoxic','co2','open-water','endurance','50min'])
RETURNING id INTO s94;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s94,1,'warmup','distance',300,'pace',1),
(s94,2,'steady','distance',200,'pace',2),
(s94,3,'steady','distance',200,'pace',2),
(s94,4,'steady','distance',200,'pace',2),
(s94,5,'steady','distance',200,'pace',2),
(s94,6,'steady','distance',200,'pace',2),
(s94,7,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Post-Bike Swim Fatigue Simulation (45 min)','Simulate swimming after cycling: start Z3 immediately from fatigue state.',
'pace','race-prep','hard',true,45,32,ARRAY['triathlon','fatigue','brick','bike-swim','45min'])
RETURNING id INTO s95;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s95,1,'warmup','distance',100,'pace',2),
(s95,2,'steady','distance',400,'pace',3),
(s95,3,'steady','distance',400,'pace',2),
(s95,4,'interval','distance',200,'pace',3),
(s95,5,'steady','distance',400,'pace',2),
(s95,6,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Timed 400m Benchmark Test (30 min)','Time trial 400m: benchmark test for tracking CSS fitness improvements.',
'pace','assessment','hard',true,30,22,ARRAY['test','400m','time-trial','benchmark','30min'])
RETURNING id INTO s96;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s96,1,'warmup','distance',400,'pace',1),
(s96,2,'interval','distance',400,'pace',4),
(s96,3,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Biweekly 200m Fitness Test (25 min)','200m TT benchmark: track CSS fitness every 2 weeks.',
'pace','assessment','hard',true,25,18,ARRAY['test','200m','time-trial','benchmark','25min'])
RETURNING id INTO s97;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s97,1,'warmup','distance',400,'pace',1),
(s97,2,'interval','distance',200,'pace',5),
(s97,3,'cooldown','distance',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Mixed Stroke VO2max (50 min)','Alternating strokes at Z4-Z5 effort: backstroke, breaststroke, freestyle.',
'pace','vo2max','hard',true,50,38,ARRAY['mixed-strokes','vo2max','backstroke','breaststroke','50min'])
RETURNING id INTO s98;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s98,1,'warmup','distance',400,'pace',1),
(s98,2,'interval','distance',100,'pace',4),
(s98,3,'recovery','distance',100,'pace',1),
(s98,4,'interval','distance',100,'pace',4),
(s98,5,'recovery','distance',100,'pace',1),
(s98,6,'interval','distance',100,'pace',4),
(s98,7,'recovery','distance',100,'pace',1),
(s98,8,'interval','distance',100,'pace',4),
(s98,9,'recovery','distance',100,'pace',1),
(s98,10,'interval','distance',100,'pace',4),
(s98,11,'cooldown','distance',400,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Swim-Run Brick Preparation (45 min)','Swim Z3 then high-knee run-out simulation. Triathlon T1 transition prep.',
'pace','race-prep','hard',true,45,32,ARRAY['triathlon','swim-run','brick','t1','45min'])
RETURNING id INTO s99;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s99,1,'warmup','distance',300,'pace',1),
(s99,2,'steady','distance',300,'pace',3),
(s99,3,'interval','distance',100,'pace',4),
(s99,4,'steady','distance',300,'pace',3),
(s99,5,'interval','distance',100,'pace',4),
(s99,6,'steady','distance',300,'pace',3),
(s99,7,'interval','distance',100,'pace',5),
(s99,8,'cooldown','distance',200,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Full Race Simulation Swim (55 min)','Full open water race simulation: mass start effort, mid-race settle, strong finish.',
'pace','race-prep','hard',true,55,40,ARRAY['race-sim','open-water','triathlon','mass-start','finish','55min'])
RETURNING id INTO s100;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(s100,1,'warmup','distance',400,'pace',1),
(s100,2,'interval','distance',200,'pace',4),
(s100,3,'steady','distance',800,'pace',3),
(s100,4,'steady','distance',800,'pace',2),
(s100,5,'interval','distance',200,'pace',4),
(s100,6,'interval','distance',100,'pace',5),
(s100,7,'cooldown','distance',300,'pace',1);

END $$;
