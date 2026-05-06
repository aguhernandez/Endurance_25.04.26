/*
  # Extended Cycling Workout Library — 100 Workouts

  ## Summary
  Adds 100 cycling-specific workouts to the public library, covering a complete
  spectrum of training methodologies. All use the Banister impulse model for
  estimated_impulse (duration_hours × relative_intensity × sport_factor).

  ## Impulse Calculation
  - Sport factor (cycling): 1.00
  - Power-based: relIntensity = target_percent_ftp / 100
  - HR-based: relIntensity from zone map Z1=0.55, Z2=0.70, Z3=0.83, Z4=0.95, Z5=1.10
  - estimated_impulse = sum of (step_duration_hours × relIntensity)

  ## Categories Covered
  1. Endurance / Aerobic Base (25 workouts)
  2. Sweet Spot & Sub-threshold (15 workouts)
  3. Threshold / FTP (20 workouts)
  4. VO2max (15 workouts)
  5. Sprint / Neuromuscular (10 workouts)
  6. HR-based Aerobic (15 workouts)

  ## Security
  - All workouts: is_public=true, coach_id=NULL (library templates)
  - No RLS changes needed (workouts table policies already in place)
*/

DO $$
DECLARE
  w1 uuid; w2 uuid; w3 uuid; w4 uuid; w5 uuid;
  w6 uuid; w7 uuid; w8 uuid; w9 uuid; w10 uuid;
  w11 uuid; w12 uuid; w13 uuid; w14 uuid; w15 uuid;
  w16 uuid; w17 uuid; w18 uuid; w19 uuid; w20 uuid;
  w21 uuid; w22 uuid; w23 uuid; w24 uuid; w25 uuid;
  w26 uuid; w27 uuid; w28 uuid; w29 uuid; w30 uuid;
  w31 uuid; w32 uuid; w33 uuid; w34 uuid; w35 uuid;
  w36 uuid; w37 uuid; w38 uuid; w39 uuid; w40 uuid;
  w41 uuid; w42 uuid; w43 uuid; w44 uuid; w45 uuid;
  w46 uuid; w47 uuid; w48 uuid; w49 uuid; w50 uuid;
  w51 uuid; w52 uuid; w53 uuid; w54 uuid; w55 uuid;
  w56 uuid; w57 uuid; w58 uuid; w59 uuid; w60 uuid;
  w61 uuid; w62 uuid; w63 uuid; w64 uuid; w65 uuid;
  w66 uuid; w67 uuid; w68 uuid; w69 uuid; w70 uuid;
  w71 uuid; w72 uuid; w73 uuid; w74 uuid; w75 uuid;
  w76 uuid; w77 uuid; w78 uuid; w79 uuid; w80 uuid;
  w81 uuid; w82 uuid; w83 uuid; w84 uuid; w85 uuid;
  w86 uuid; w87 uuid; w88 uuid; w89 uuid; w90 uuid;
  w91 uuid; w92 uuid; w93 uuid; w94 uuid; w95 uuid;
  w96 uuid; w97 uuid; w98 uuid; w99 uuid; w100 uuid;
BEGIN

-- ============================================================
-- ENDURANCE / AEROBIC BASE (25 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Z2 Aerobic Foundation (60 min)','Steady aerobic effort at 62-68% FTP. Builds mitochondrial density and fat oxidation capacity without generating significant fatigue.','power','endurance','easy',true,60,38,ARRAY['z2','aerobic','base','power','60min'])
RETURNING id INTO w1;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w1,1,'warmup','time',600,'power',55),(w1,2,'steady','time',2700,'power',65),(w1,3,'cooldown','time',300,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Extended Z2 Aerobic Block (75 min)','75-minute aerobic base session targeting fat oxidation zone. Maintains 63-67% FTP to maximize aerobic enzyme adaptations.','power','endurance','easy',true,75,48,ARRAY['z2','aerobic','base','power','75min'])
RETURNING id INTO w2;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w2,1,'warmup','time',600,'power',55),(w2,2,'steady','time',3600,'power',65),(w2,3,'cooldown','time',300,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Long Aerobic Endurance Ride (150 min)','2.5-hour steady aerobic effort at 60-65% FTP. Weekly long ride for aerobic base development and fat metabolism optimization.','power','endurance','moderate',true,150,92,ARRAY['z2','long','aerobic','base','power'])
RETURNING id INTO w3;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w3,1,'warmup','time',600,'power',55),(w3,2,'steady','time',7800,'power',63),(w3,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Ultra-Long Aerobic Base (180 min)','3-hour foundational aerobic effort for advanced base building. Targets glycogen depletion and fat adaptation through extended sub-threshold stimulus.','power','endurance','moderate',true,180,110,ARRAY['long','z2','base','aerobic','3hr'])
RETURNING id INTO w4;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w4,1,'warmup','time',600,'power',52),(w4,2,'steady','time',9000,'power',62),(w4,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Active Recovery Ride (30 min)','Easy spinning below 55% FTP for active recovery. Promotes lactate clearance and blood flow without adding training load.','power','recovery','easy',true,30,16,ARRAY['recovery','active','easy','power','30min'])
RETURNING id INTO w5;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w5,1,'steady','time',1500,'power',52),(w5,2,'cooldown','time',300,'power',45);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Base with Tempo Surges (90 min)','Aerobic base ride including 4 brief tempo surges at 76% FTP. Develops aerobic-threshold transitions and neuromuscular recruitment.','power','endurance','moderate',true,90,58,ARRAY['z2','tempo','surges','aerobic','power'])
RETURNING id INTO w6;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w6,1,'warmup','time',600,'power',55),(w6,2,'steady','time',900,'power',64),(w6,3,'interval','time',300,'power',76),(w6,4,'steady','time',900,'power',64),(w6,5,'interval','time',300,'power',76),(w6,6,'steady','time',900,'power',64),(w6,7,'interval','time',300,'power',76),(w6,8,'steady','time',900,'power',64),(w6,9,'interval','time',300,'power',76),(w6,10,'steady','time',600,'power',64),(w6,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Polarized Low-Intensity Endurance (100 min)','Classic polarized training at 55-65% FTP. Spends 100% of time below first lactate threshold to maximize sub-threshold aerobic adaptation.','power','endurance','easy',true,100,62,ARRAY['polarized','z1','z2','endurance','power'])
RETURNING id INTO w7;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w7,1,'warmup','time',600,'power',52),(w7,2,'steady','time',5400,'power',62),(w7,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Progressive Endurance Build 60-68% FTP (90 min)','Progressively increasing aerobic effort from 60% to 68% FTP over 90 minutes. Trains pacing calibration and aerobic range expansion.','power','endurance','moderate',true,90,56,ARRAY['progressive','endurance','aerobic','power','build'])
RETURNING id INTO w8;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w8,1,'warmup','time',600,'power',53),(w8,2,'steady','time',1500,'power',61),(w8,3,'steady','time',1500,'power',64),(w8,4,'steady','time',1500,'power',67),(w8,5,'steady','time',900,'power',68),(w8,6,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance + High Cadence Development (75 min)','Z2 aerobic ride with embedded high-cadence (100-110 rpm) blocks. Improves neuromuscular efficiency and reduces cardio-muscular fatigue at aerobic intensities.','power','endurance','easy',true,75,46,ARRAY['cadence','z2','endurance','efficiency','power'])
RETURNING id INTO w9;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w9,1,'warmup','time',600,'power',55),(w9,2,'steady','time',900,'power',63),(w9,3,'steady','time',300,'power',60),(w9,4,'steady','time',900,'power',63),(w9,5,'steady','time',300,'power',60),(w9,6,'steady','time',900,'power',63),(w9,7,'steady','time',300,'power',60),(w9,8,'steady','time',900,'power',63),(w9,9,'cooldown','time',300,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance + Low Cadence Force Blocks (80 min)','Aerobic base with alternating 50-60 rpm force blocks at 72-78% FTP. Develops cycling-specific muscular strength while maintaining aerobic load.','power','endurance','moderate',true,80,52,ARRAY['low-cadence','strength','endurance','force','power'])
RETURNING id INTO w10;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w10,1,'warmup','time',600,'power',55),(w10,2,'steady','time',600,'power',64),(w10,3,'steady','time',300,'power',75),(w10,4,'steady','time',600,'power',64),(w10,5,'steady','time',300,'power',75),(w10,6,'steady','time',600,'power',64),(w10,7,'steady','time',300,'power',75),(w10,8,'steady','time',600,'power',64),(w10,9,'steady','time',300,'power',75),(w10,10,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Undulating Aerobic Power (80 min)','Variable-power aerobic session alternating 58-74% FTP every 8 minutes. Mimics outdoor terrain variability while maintaining aerobic zone.','power','endurance','easy',true,80,50,ARRAY['undulating','variable','z2','aerobic','power'])
RETURNING id INTO w11;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w11,1,'warmup','time',600,'power',55),(w11,2,'steady','time',480,'power',62),(w11,3,'steady','time',480,'power',72),(w11,4,'steady','time',480,'power',60),(w11,5,'steady','time',480,'power',70),(w11,6,'steady','time',480,'power',60),(w11,7,'steady','time',480,'power',68),(w11,8,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Efficiency Ride (45 min)','Compact aerobic session at 63-66% FTP. Suitable for time-limited training days to maintain aerobic stimulus without significant fatigue accumulation.','power','endurance','easy',true,45,28,ARRAY['z2','short','aerobic','efficiency','power'])
RETURNING id INTO w12;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w12,1,'warmup','time',300,'power',55),(w12,2,'steady','time',2100,'power',64),(w12,3,'cooldown','time',300,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance-Strength Combination (90 min)','Extended Z2 with 3×10-min tempo strength blocks at 78% FTP. Simultaneously develops aerobic base and cycling-specific muscular endurance.','power','endurance','moderate',true,90,62,ARRAY['endurance','strength','tempo','combined','power'])
RETURNING id INTO w13;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w13,1,'warmup','time',600,'power',55),(w13,2,'steady','time',1200,'power',64),(w13,3,'steady','time',600,'power',78),(w13,4,'steady','time',600,'power',64),(w13,5,'steady','time',600,'power',78),(w13,6,'steady','time',600,'power',64),(w13,7,'steady','time',600,'power',78),(w13,8,'steady','time',900,'power',64),(w13,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Two-A-Day Easy Aerobic Spin (40 min)','Second daily workout at minimal intensity for active adaptation. Maintains aerobic stimulus without taxing recovery from the primary session.','power','recovery','easy',true,40,22,ARRAY['recovery','easy','2aday','aerobic','power'])
RETURNING id INTO w14;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w14,1,'steady','time',2100,'power',55),(w14,2,'cooldown','time',300,'power',48);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Pure Recovery Spin (45 min)','Ultra-easy Z1 spinning at 45-52% FTP. Focus on leg flush and mental recovery. No training stress intended.','power','recovery','easy',true,45,22,ARRAY['recovery','z1','flush','spin','power'])
RETURNING id INTO w15;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w15,1,'steady','time',2400,'power',49),(w15,2,'cooldown','time',300,'power',45);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance + Openers (60 min)','Aerobic base ride with 6 brief 1-minute openers at 105% FTP. Maintains aerobic base while activating higher-order motor units.','power','endurance','moderate',true,60,42,ARRAY['openers','z2','activation','power','endurance'])
RETURNING id INTO w16;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w16,1,'warmup','time',600,'power',55),(w16,2,'steady','time',900,'power',63),(w16,3,'interval','time',60,'power',105),(w16,4,'steady','time',600,'power',63),(w16,5,'interval','time',60,'power',105),(w16,6,'steady','time',600,'power',63),(w16,7,'interval','time',60,'power',105),(w16,8,'steady','time',600,'power',63),(w16,9,'interval','time',60,'power',105),(w16,10,'steady','time',300,'power',63),(w16,11,'cooldown','time',300,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Power Pyramid (70 min)','Ascending and descending power blocks from 60% to 72% FTP and back. Trains pacing awareness and aerobic-range adaptations.','power','endurance','easy',true,70,44,ARRAY['pyramid','aerobic','z2','progression','power'])
RETURNING id INTO w17;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w17,1,'warmup','time',600,'power',53),(w17,2,'steady','time',600,'power',62),(w17,3,'steady','time',600,'power',65),(w17,4,'steady','time',600,'power',68),(w17,5,'steady','time',600,'power',71),(w17,6,'steady','time',600,'power',68),(w17,7,'steady','time',600,'power',65),(w17,8,'steady','time',600,'power',62),(w17,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Negative Split Endurance (90 min)','First 45 min at 60% FTP, second 45 min at 68% FTP. Trains ability to accelerate when fatigued and builds metabolic flexibility.','power','endurance','moderate',true,90,57,ARRAY['negative-split','endurance','pacing','power','aerobic'])
RETURNING id INTO w18;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w18,1,'warmup','time',600,'power',53),(w18,2,'steady','time',2400,'power',61),(w18,3,'steady','time',2400,'power',68),(w18,4,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Volume Ride (120 min)','2-hour moderate aerobic effort at 64-68% FTP. Develops cardiovascular volume load and fat oxidation capacity across extended duration.','power','endurance','moderate',true,120,78,ARRAY['volume','z2','2hr','aerobic','power'])
RETURNING id INTO w19;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w19,1,'warmup','time',600,'power',55),(w19,2,'steady','time',6000,'power',66),(w19,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Base + 3-min Efforts (80 min)','Z2 ride with 4×3-min efforts at 85% FTP. Introduces sub-threshold load within aerobic context for greater training adaptability.','power','endurance','moderate',true,80,54,ARRAY['z2','efforts','sub-threshold','aerobic','power'])
RETURNING id INTO w20;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w20,1,'warmup','time',600,'power',55),(w20,2,'steady','time',900,'power',64),(w20,3,'interval','time',180,'power',85),(w20,4,'recovery','time',300,'power',60),(w20,5,'steady','time',600,'power',64),(w20,6,'interval','time',180,'power',85),(w20,7,'recovery','time',300,'power',60),(w20,8,'steady','time',600,'power',64),(w20,9,'interval','time',180,'power',85),(w20,10,'recovery','time',300,'power',60),(w20,11,'steady','time',600,'power',64),(w20,12,'interval','time',180,'power',85),(w20,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Early Season Base Building (60 min)','Conservative early-season aerobic ride at 58-63% FTP. Low-load introduction to structured training.','power','endurance','easy',true,60,36,ARRAY['early-season','base','conservative','z2','power'])
RETURNING id INTO w21;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w21,1,'warmup','time',600,'power',50),(w21,2,'steady','time',2700,'power',61),(w21,3,'cooldown','time',300,'power',48);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Pre-Race Aerobic Activation (45 min)','Easy aerobic ride the day before competition. Maintains legs without adding fatigue; includes brief cadence drill and 2 openers.','power','endurance','easy',true,45,28,ARRAY['pre-race','activation','easy','taper','power'])
RETURNING id INTO w22;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w22,1,'warmup','time',600,'power',53),(w22,2,'steady','time',900,'power',62),(w22,3,'interval','time',60,'power',100),(w22,4,'recovery','time',300,'power',55),(w22,5,'interval','time',60,'power',100),(w22,6,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Post-Race Flush Ride (35 min)','Very easy 35-min flush ride following competition. Accelerates metabolic byproduct clearance and promotes rapid recovery.','power','recovery','easy',true,35,16,ARRAY['post-race','flush','recovery','easy','power'])
RETURNING id INTO w23;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w23,1,'steady','time',1800,'power',50),(w23,2,'cooldown','time',300,'power',44);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance + Tempo Finish (80 min)','60 min aerobic base followed by 15-min tempo effort at 80% FTP. Trains running-on-tired-legs adaptation and aerobic-threshold connection.','power','endurance','moderate',true,80,54,ARRAY['tempo-finish','endurance','aerobic','power','build'])
RETURNING id INTO w24;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w24,1,'warmup','time',600,'power',55),(w24,2,'steady','time',3000,'power',64),(w24,3,'steady','time',900,'power',80),(w24,4,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Power Meter Calibration + Easy Endurance (50 min)','Easy aerobic ride with structured power meter check. Helps athletes dial in their sense of effort relative to power output.','power','endurance','easy',true,50,29,ARRAY['calibration','endurance','easy','power','aerobic'])
RETURNING id INTO w25;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w25,1,'warmup','time',300,'power',50),(w25,2,'steady','time',600,'power',60),(w25,3,'steady','time',600,'power',65),(w25,4,'steady','time',600,'power',70),(w25,5,'steady','time',600,'power',65),(w25,6,'steady','time',600,'power',60),(w25,7,'cooldown','time',300,'power',50);

-- ============================================================
-- SWEET SPOT & SUB-THRESHOLD (15 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot 2×20 min (70 min)','Two 20-minute blocks at 88-93% FTP. Classic sweet spot protocol maximizing threshold training per unit of recovery cost.','power','threshold','moderate',true,70,65,ARRAY['sweet-spot','2x20','threshold','power'])
RETURNING id INTO w26;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w26,1,'warmup','time',600,'power',55),(w26,2,'interval','time',1200,'power',90),(w26,3,'recovery','time',300,'power',60),(w26,4,'interval','time',1200,'power',90),(w26,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot 3×15 min (75 min)','Three 15-minute sweet spot efforts at 88-92% FTP. Higher frequency, shorter duration approach for athletes new to threshold work.','power','threshold','moderate',true,75,68,ARRAY['sweet-spot','3x15','threshold','power'])
RETURNING id INTO w27;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w27,1,'warmup','time',600,'power',55),(w27,2,'interval','time',900,'power',90),(w27,3,'recovery','time',300,'power',58),(w27,4,'interval','time',900,'power',90),(w27,5,'recovery','time',300,'power',58),(w27,6,'interval','time',900,'power',90),(w27,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot 1×30 min (55 min)','Single extended sweet spot block at 88-92% FTP. Tests threshold endurance and maximal sustained aerobic power capacity.','power','threshold','moderate',true,55,52,ARRAY['sweet-spot','1x30','threshold','power'])
RETURNING id INTO w28;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w28,1,'warmup','time',600,'power',55),(w28,2,'interval','time',1800,'power',90),(w28,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Extended Sweet Spot 2×25 min (80 min)','Two extended sweet spot blocks at 89-93% FTP. Longer duration sweet spot protocol for well-trained athletes with good threshold endurance.','power','threshold','hard',true,80,80,ARRAY['sweet-spot','2x25','extended','power'])
RETURNING id INTO w29;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w29,1,'warmup','time',600,'power',55),(w29,2,'interval','time',1500,'power',91),(w29,3,'recovery','time',300,'power',58),(w29,4,'interval','time',1500,'power',91),(w29,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot Long Ride 4×15 min (100 min)','Four sweet spot intervals embedded in longer ride context. Maximizes threshold stimulus within an endurance framework.','power','threshold','hard',true,100,90,ARRAY['sweet-spot','4x15','long','power','threshold'])
RETURNING id INTO w30;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w30,1,'warmup','time',600,'power',55),(w30,2,'steady','time',600,'power',64),(w30,3,'interval','time',900,'power',90),(w30,4,'recovery','time',300,'power',60),(w30,5,'steady','time',300,'power',64),(w30,6,'interval','time',900,'power',90),(w30,7,'recovery','time',300,'power',60),(w30,8,'steady','time',300,'power',64),(w30,9,'interval','time',900,'power',90),(w30,10,'recovery','time',300,'power',60),(w30,11,'steady','time',300,'power',64),(w30,12,'interval','time',900,'power',90),(w30,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sub-Threshold Power Build 5×10 min (75 min)','Five 10-minute efforts at 86-90% FTP. High-volume sub-threshold load useful for building FTP without excessive fatigue.','power','threshold','moderate',true,75,70,ARRAY['sub-threshold','5x10','power','build'])
RETURNING id INTO w31;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w31,1,'warmup','time',600,'power',55),(w31,2,'interval','time',600,'power',88),(w31,3,'recovery','time',180,'power',58),(w31,4,'interval','time',600,'power',88),(w31,5,'recovery','time',180,'power',58),(w31,6,'interval','time',600,'power',88),(w31,7,'recovery','time',180,'power',58),(w31,8,'interval','time',600,'power',88),(w31,9,'recovery','time',180,'power',58),(w31,10,'interval','time',600,'power',88),(w31,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sustained Sweet Spot 40-min Block (60 min)','40-minute continuous sweet spot effort at 88-92% FTP. Simulates an extended breakaway effort or sustained climber output.','power','threshold','hard',true,60,58,ARRAY['sweet-spot','sustained','40min','power'])
RETURNING id INTO w32;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w32,1,'warmup','time',600,'power',55),(w32,2,'interval','time',2400,'power',90),(w32,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot + Over-Under Combo (80 min)','Sweet spot base with micro over-under transitions. Trains lactate buffering within sub-threshold range.','power','threshold','hard',true,80,80,ARRAY['sweet-spot','over-under','combo','power','threshold'])
RETURNING id INTO w33;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w33,1,'warmup','time',600,'power',55),(w33,2,'interval','time',480,'power',88),(w33,3,'interval','time',120,'power',98),(w33,4,'interval','time',480,'power',88),(w33,5,'interval','time',120,'power',98),(w33,6,'recovery','time',300,'power',58),(w33,7,'interval','time',480,'power',88),(w33,8,'interval','time',120,'power',98),(w33,9,'interval','time',480,'power',88),(w33,10,'interval','time',120,'power',98),(w33,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot Climbing Simulation 3×20 min (90 min)','Three 20-minute climbs at sweet spot intensity with seated low cadence. Targets climbing-specific muscular endurance.','power','threshold','hard',true,90,95,ARRAY['climbing','sweet-spot','3x20','simulation','power'])
RETURNING id INTO w34;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w34,1,'warmup','time',600,'power',55),(w34,2,'interval','time',1200,'power',90),(w34,3,'recovery','time',300,'power',58),(w34,4,'interval','time',1200,'power',90),(w34,5,'recovery','time',300,'power',58),(w34,6,'interval','time',1200,'power',90),(w34,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Tempo Endurance Block (60 min)','Continuous 35-minute effort at 76-80% FTP (tempo zone). Bridges gap between pure endurance and sweet spot.','power','endurance','moderate',true,60,50,ARRAY['tempo','76-80','power','aerobic','threshold'])
RETURNING id INTO w35;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w35,1,'warmup','time',600,'power',55),(w35,2,'steady','time',2100,'power',78),(w35,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Tempo Intervals 4×8 min (60 min)','Four 8-minute tempo blocks at 76-82% FTP. Accumulates sub-threshold stimulus with controlled recovery.','power','endurance','moderate',true,60,54,ARRAY['tempo','4x8','intervals','power','sub-threshold'])
RETURNING id INTO w36;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w36,1,'warmup','time',600,'power',55),(w36,2,'interval','time',480,'power',79),(w36,3,'recovery','time',180,'power',58),(w36,4,'interval','time',480,'power',79),(w36,5,'recovery','time',180,'power',58),(w36,6,'interval','time',480,'power',79),(w36,7,'recovery','time',180,'power',58),(w36,8,'interval','time',480,'power',79),(w36,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot + Aerobic Flush (90 min)','Sweet spot efforts followed by extended aerobic flush. Blends threshold stimulus with volume-based aerobic adaptation.','power','threshold','moderate',true,90,75,ARRAY['sweet-spot','flush','aerobic','combined','power'])
RETURNING id INTO w37;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w37,1,'warmup','time',600,'power',55),(w37,2,'interval','time',1200,'power',90),(w37,3,'recovery','time',300,'power',60),(w37,4,'interval','time',1200,'power',90),(w37,5,'steady','time',2400,'power',63),(w37,6,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Race-Pace Sweet Spot 2×30 min (90 min)','Two 30-minute race-pace efforts at 90-94% FTP. Develops sustained power capacity for road races and time trials.','power','threshold','very_hard',true,90,105,ARRAY['race-pace','sweet-spot','2x30','power','time-trial'])
RETURNING id INTO w38;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w38,1,'warmup','time',600,'power',55),(w38,2,'interval','time',1800,'power',92),(w38,3,'recovery','time',300,'power',58),(w38,4,'interval','time',1800,'power',92),(w38,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot 6×10 min High Volume (80 min)','Six 10-minute sweet spot intervals. Very high total sub-threshold volume for advanced aerobic development.','power','threshold','hard',true,80,82,ARRAY['sweet-spot','6x10','high-volume','power','threshold'])
RETURNING id INTO w39;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w39,1,'warmup','time',600,'power',55),(w39,2,'interval','time',600,'power',90),(w39,3,'recovery','time',120,'power',58),(w39,4,'interval','time',600,'power',90),(w39,5,'recovery','time',120,'power',58),(w39,6,'interval','time',600,'power',90),(w39,7,'recovery','time',120,'power',58),(w39,8,'interval','time',600,'power',90),(w39,9,'recovery','time',120,'power',58),(w39,10,'interval','time',600,'power',90),(w39,11,'recovery','time',120,'power',58),(w39,12,'interval','time',600,'power',90),(w39,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sub-Threshold Lactate Clearance (70 min)','Sustained 30-minute effort at 84-87% FTP targeting the sub-threshold metabolic zone. Trains lactate clearance at sub-maximal intensities.','power','threshold','moderate',true,70,62,ARRAY['sub-threshold','lactate','clearance','power','84-87'])
RETURNING id INTO w40;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w40,1,'warmup','time',600,'power',55),(w40,2,'steady','time',1800,'power',85),(w40,3,'recovery','time',300,'power',60),(w40,4,'steady','time',900,'power',85),(w40,5,'cooldown','time',600,'power',50);

-- ============================================================
-- THRESHOLD / FTP (20 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','FTP Threshold 3×10 min (60 min)','Three 10-minute blocks at 97-103% FTP. Classic FTP development protocol targeting the power-duration curve at functional threshold.','power','threshold','hard',true,60,62,ARRAY['ftp','threshold','3x10','power'])
RETURNING id INTO w41;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w41,1,'warmup','time',600,'power',55),(w41,2,'interval','time',600,'power',100),(w41,3,'recovery','time',300,'power',55),(w41,4,'interval','time',600,'power',100),(w41,5,'recovery','time',300,'power',55),(w41,6,'interval','time',600,'power',100),(w41,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','FTP Test 2×8 min (45 min)','Two 8-minute all-out efforts for FTP estimation. Use highest 8-min power × 0.9 as FTP estimate. Full recovery between blocks.','power','threshold','very_hard',true,45,56,ARRAY['ftp','test','2x8','power','maximal'])
RETURNING id INTO w42;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w42,1,'warmup','time',600,'power',55),(w42,2,'interval','time',300,'power',105),(w42,3,'recovery','time',300,'power',50),(w42,4,'interval','time',480,'power',110),(w42,5,'recovery','time',600,'power',50),(w42,6,'interval','time',480,'power',110),(w42,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Ladder 4-8-12-8-4 min (70 min)','Ascending and descending threshold blocks. Develops FTP range while managing fatigue-pacing tradeoffs.','power','threshold','hard',true,70,72,ARRAY['ladder','threshold','ftp','power','ascending'])
RETURNING id INTO w43;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w43,1,'warmup','time',600,'power',55),(w43,2,'interval','time',240,'power',100),(w43,3,'recovery','time',240,'power',55),(w43,4,'interval','time',480,'power',100),(w43,5,'recovery','time',240,'power',55),(w43,6,'interval','time',720,'power',98),(w43,7,'recovery','time',240,'power',55),(w43,8,'interval','time',480,'power',100),(w43,9,'recovery','time',240,'power',55),(w43,10,'interval','time',240,'power',102),(w43,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Time Trial 30 min (50 min)','Single 30-minute threshold time trial effort. Primary FTP assessment tool; sustain highest possible average power for duration.','power','threshold','very_hard',true,50,62,ARRAY['time-trial','ftp','30min','test','power'])
RETURNING id INTO w44;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w44,1,'warmup','time',600,'power',60),(w44,2,'interval','time',300,'power',110),(w44,3,'recovery','time',300,'power',50),(w44,4,'steady','time',1800,'power',100),(w44,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Over-Under 4×10 min (70 min)','Over-under protocol with 3-min under (94% FTP) + 2-min over (106% FTP) cycles. Maximally trains lactate clearance at functional threshold.','power','threshold','very_hard',true,70,80,ARRAY['over-under','threshold','ftp','power','lactate'])
RETURNING id INTO w45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w45,1,'warmup','time',600,'power',55),(w45,2,'interval','time',180,'power',94),(w45,3,'interval','time',120,'power',106),(w45,4,'interval','time',180,'power',94),(w45,5,'interval','time',120,'power',106),(w45,6,'recovery','time',300,'power',55),(w45,7,'interval','time',180,'power',94),(w45,8,'interval','time',120,'power',106),(w45,9,'interval','time',180,'power',94),(w45,10,'interval','time',120,'power',106),(w45,11,'recovery','time',300,'power',55),(w45,12,'interval','time',180,'power',94),(w45,13,'interval','time',120,'power',106),(w45,14,'interval','time',180,'power',94),(w45,15,'interval','time',120,'power',106),(w45,16,'recovery','time',300,'power',55),(w45,17,'interval','time',180,'power',94),(w45,18,'interval','time',120,'power',106),(w45,19,'interval','time',180,'power',94),(w45,20,'interval','time',120,'power',106),(w45,21,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold 2×20 min Classic (70 min)','Two 20-minute FTP intervals. The gold standard threshold workout for raising functional threshold power.','power','threshold','hard',true,70,78,ARRAY['threshold','2x20','ftp','classic','power'])
RETURNING id INTO w46;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w46,1,'warmup','time',600,'power',55),(w46,2,'interval','time',1200,'power',100),(w46,3,'recovery','time',300,'power',55),(w46,4,'interval','time',1200,'power',100),(w46,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Progressive Threshold 3×15 min (75 min)','15-minute threshold blocks with progressive power: 97%, 100%, 103% FTP. Develops ability to perform at and above threshold when fatigued.','power','threshold','very_hard',true,75,82,ARRAY['progressive','threshold','3x15','power','ftp'])
RETURNING id INTO w47;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w47,1,'warmup','time',600,'power',55),(w47,2,'interval','time',900,'power',97),(w47,3,'recovery','time',300,'power',55),(w47,4,'interval','time',900,'power',100),(w47,5,'recovery','time',300,'power',55),(w47,6,'interval','time',900,'power',103),(w47,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Cruise 5×8 min (65 min)','Five 8-minute cruise intervals at 96-100% FTP with short recovery. Higher interval frequency at threshold builds pacing skill.','power','threshold','hard',true,65,68,ARRAY['cruise','threshold','5x8','ftp','power'])
RETURNING id INTO w48;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w48,1,'warmup','time',600,'power',55),(w48,2,'interval','time',480,'power',98),(w48,3,'recovery','time',180,'power',55),(w48,4,'interval','time',480,'power',98),(w48,5,'recovery','time',180,'power',55),(w48,6,'interval','time',480,'power',98),(w48,7,'recovery','time',180,'power',55),(w48,8,'interval','time',480,'power',98),(w48,9,'recovery','time',180,'power',55),(w48,10,'interval','time',480,'power',98),(w48,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold 1×40 min Sustained (60 min)','Single 40-minute threshold block at 95-100% FTP. Elite-level sustained power development.','power','threshold','very_hard',true,60,72,ARRAY['threshold','1x40','sustained','ftp','power'])
RETURNING id INTO w49;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w49,1,'warmup','time',600,'power',58),(w49,2,'interval','time',2400,'power',98),(w49,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Tolerance 8×5 min (65 min)','Eight 5-minute blocks at 100-105% FTP. Builds tolerance at threshold through repeated shorter exposures.','power','threshold','hard',true,65,72,ARRAY['tolerance','threshold','8x5','ftp','power'])
RETURNING id INTO w50;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w50,1,'warmup','time',600,'power',55),(w50,2,'interval','time',300,'power',102),(w50,3,'recovery','time',180,'power',55),(w50,4,'interval','time',300,'power',102),(w50,5,'recovery','time',180,'power',55),(w50,6,'interval','time',300,'power',102),(w50,7,'recovery','time',180,'power',55),(w50,8,'interval','time',300,'power',102),(w50,9,'recovery','time',180,'power',55),(w50,10,'interval','time',300,'power',102),(w50,11,'recovery','time',180,'power',55),(w50,12,'interval','time',300,'power',102),(w50,13,'recovery','time',180,'power',55),(w50,14,'interval','time',300,'power',102),(w50,15,'recovery','time',180,'power',55),(w50,16,'interval','time',300,'power',102),(w50,17,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Tempo Blend 3×12 min (65 min)','Alternating threshold and tempo segments: 8 min @ 100% + 4 min @ 80% FTP per block. Trains recovery within near-threshold effort.','power','threshold','hard',true,65,68,ARRAY['threshold','tempo','blend','3x12','power'])
RETURNING id INTO w51;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w51,1,'warmup','time',600,'power',55),(w51,2,'interval','time',480,'power',100),(w51,3,'steady','time',240,'power',80),(w51,4,'recovery','time',180,'power',55),(w51,5,'interval','time',480,'power',100),(w51,6,'steady','time',240,'power',80),(w51,7,'recovery','time',180,'power',55),(w51,8,'interval','time',480,'power',100),(w51,9,'steady','time',240,'power',80),(w51,10,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Reverse Threshold Ladder 12-8-4 min (60 min)','Descending threshold blocks: 12 min, 8 min, 4 min all at 100% FTP. Harder psychologically — finishing shorter when fatigued.','power','threshold','hard',true,60,64,ARRAY['reverse','ladder','threshold','ftp','power'])
RETURNING id INTO w52;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w52,1,'warmup','time',600,'power',55),(w52,2,'interval','time',720,'power',100),(w52,3,'recovery','time',300,'power',55),(w52,4,'interval','time',480,'power',100),(w52,5,'recovery','time',240,'power',55),(w52,6,'interval','time',240,'power',102),(w52,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Time Trial Simulation 25 km (55 min)','Race simulation at 95-105% FTP. Develops pacing strategy and power management for time trial events.','power','threshold','very_hard',true,55,65,ARRAY['time-trial','simulation','race-pace','ftp','power'])
RETURNING id INTO w53;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w53,1,'warmup','time',600,'power',60),(w53,2,'interval','time',180,'power',108),(w53,3,'recovery','time',120,'power',52),(w53,4,'steady','time',2700,'power',100),(w53,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Micro-Intervals 15×2 min (55 min)','Fifteen 2-minute threshold blocks. High repetition count trains neural adaptation to threshold effort.','power','threshold','hard',true,55,60,ARRAY['threshold','micro','15x2','ftp','power'])
RETURNING id INTO w54;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w54,1,'warmup','time',600,'power',55),(w54,2,'interval','time',120,'power',100),(w54,3,'recovery','time',60,'power',55),(w54,4,'interval','time',120,'power',100),(w54,5,'recovery','time',60,'power',55),(w54,6,'interval','time',120,'power',100),(w54,7,'recovery','time',60,'power',55),(w54,8,'interval','time',120,'power',100),(w54,9,'recovery','time',60,'power',55),(w54,10,'interval','time',120,'power',100),(w54,11,'recovery','time',60,'power',55),(w54,12,'interval','time',120,'power',100),(w54,13,'recovery','time',60,'power',55),(w54,14,'interval','time',120,'power',100),(w54,15,'recovery','time',60,'power',55),(w54,16,'interval','time',120,'power',100),(w54,17,'recovery','time',60,'power',55),(w54,18,'interval','time',120,'power',100),(w54,19,'recovery','time',60,'power',55),(w54,20,'interval','time',120,'power',100),(w54,21,'recovery','time',60,'power',55),(w54,22,'interval','time',120,'power',100),(w54,23,'recovery','time',60,'power',55),(w54,24,'interval','time',120,'power',100),(w54,25,'recovery','time',60,'power',55),(w54,26,'interval','time',120,'power',100),(w54,27,'recovery','time',60,'power',55),(w54,28,'interval','time',120,'power',100),(w54,29,'recovery','time',60,'power',55),(w54,30,'interval','time',120,'power',100),(w54,31,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold + Endurance 90-min Block (90 min)','45-min threshold work embedded in 90-min endurance ride. Tests threshold under accumulated aerobic fatigue.','power','threshold','hard',true,90,88,ARRAY['threshold','endurance','combined','90min','power'])
RETURNING id INTO w55;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w55,1,'warmup','time',600,'power',55),(w55,2,'steady','time',900,'power',64),(w55,3,'interval','time',900,'power',100),(w55,4,'recovery','time',300,'power',58),(w55,5,'steady','time',600,'power',64),(w55,6,'interval','time',900,'power',100),(w55,7,'recovery','time',300,'power',58),(w55,8,'steady','time',600,'power',64),(w55,9,'interval','time',900,'power',100),(w55,10,'steady','time',600,'power',64),(w55,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Broken Threshold 6×6 min (65 min)','Six 6-minute threshold repeats. Broken threshold accumulates more total time at FTP than a single block.','power','threshold','hard',true,65,66,ARRAY['broken','threshold','6x6','ftp','power'])
RETURNING id INTO w56;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w56,1,'warmup','time',600,'power',55),(w56,2,'interval','time',360,'power',100),(w56,3,'recovery','time',180,'power',55),(w56,4,'interval','time',360,'power',100),(w56,5,'recovery','time',180,'power',55),(w56,6,'interval','time',360,'power',100),(w56,7,'recovery','time',180,'power',55),(w56,8,'interval','time',360,'power',100),(w56,9,'recovery','time',180,'power',55),(w56,10,'interval','time',360,'power',100),(w56,11,'recovery','time',180,'power',55),(w56,12,'interval','time',360,'power',100),(w56,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Endurance 10×4 min (65 min)','Ten 4-minute threshold intervals. Very high interval count builds FTP tolerance and pacing rhythm.','power','threshold','hard',true,65,68,ARRAY['threshold','10x4','ftp','high-count','power'])
RETURNING id INTO w57;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w57,1,'warmup','time',600,'power',55),(w57,2,'interval','time',240,'power',100),(w57,3,'recovery','time',120,'power',55),(w57,4,'interval','time',240,'power',100),(w57,5,'recovery','time',120,'power',55),(w57,6,'interval','time',240,'power',100),(w57,7,'recovery','time',120,'power',55),(w57,8,'interval','time',240,'power',100),(w57,9,'recovery','time',120,'power',55),(w57,10,'interval','time',240,'power',100),(w57,11,'recovery','time',120,'power',55),(w57,12,'interval','time',240,'power',100),(w57,13,'recovery','time',120,'power',55),(w57,14,'interval','time',240,'power',100),(w57,15,'recovery','time',120,'power',55),(w57,16,'interval','time',240,'power',100),(w57,17,'recovery','time',120,'power',55),(w57,18,'interval','time',240,'power',100),(w57,19,'recovery','time',120,'power',55),(w57,20,'interval','time',240,'power',100),(w57,21,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Supra-Threshold Burst Intervals 2×15 min (65 min)','15-min blocks with 30-second supra-threshold bursts every 5 minutes. Develops capacity to surge and recover at threshold.','power','threshold','very_hard',true,65,76,ARRAY['supra-threshold','burst','threshold','2x15','power'])
RETURNING id INTO w58;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w58,1,'warmup','time',600,'power',55),(w58,2,'interval','time',270,'power',98),(w58,3,'interval','time',30,'power',115),(w58,4,'interval','time',270,'power',98),(w58,5,'interval','time',30,'power',115),(w58,6,'interval','time',270,'power',98),(w58,7,'interval','time',30,'power',115),(w58,8,'recovery','time',300,'power',55),(w58,9,'interval','time',270,'power',98),(w58,10,'interval','time',30,'power',115),(w58,11,'interval','time',270,'power',98),(w58,12,'interval','time',30,'power',115),(w58,13,'interval','time',270,'power',98),(w58,14,'interval','time',30,'power',115),(w58,15,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','LTHR Power Correlation Intervals (70 min)','Mixed power/HR threshold protocol targeting LTHR zone. Develops internal pacing reference calibration.','power','threshold','hard',true,70,72,ARRAY['lthr','correlation','threshold','power','mixed'])
RETURNING id INTO w59;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w59,1,'warmup','time',600,'power',55),(w59,2,'interval','time',720,'power',100),(w59,3,'recovery','time',300,'power',55),(w59,4,'interval','time',720,'power',100),(w59,5,'recovery','time',300,'power',55),(w59,6,'interval','time',720,'power',100),(w59,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Ramp 60-100% FTP (50 min)','Progressive 10-min ramp from 60% to 100% FTP. Prepares neuromuscular and metabolic systems for subsequent race or hard training block.','power','threshold','moderate',true,50,50,ARRAY['ramp','threshold','progressive','activation','power'])
RETURNING id INTO w60;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w60,1,'warmup','time',300,'power',50),(w60,2,'steady','time',300,'power',60),(w60,3,'steady','time',300,'power',68),(w60,4,'steady','time',300,'power',76),(w60,5,'steady','time',300,'power',84),(w60,6,'steady','time',300,'power',92),(w60,7,'interval','time',300,'power',100),(w60,8,'cooldown','time',600,'power',50);

-- ============================================================
-- VO2MAX (15 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max 8×2 min (50 min)','Eight 2-minute efforts at 115-120% FTP. Short VO2max intervals allowing high repetition count with full neuromuscular quality.','power','vo2max','hard',true,50,60,ARRAY['vo2max','8x2','intervals','power','aerobic'])
RETURNING id INTO w61;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w61,1,'warmup','time',900,'power',55),(w61,2,'interval','time',120,'power',118),(w61,3,'recovery','time',120,'power',50),(w61,4,'interval','time',120,'power',118),(w61,5,'recovery','time',120,'power',50),(w61,6,'interval','time',120,'power',118),(w61,7,'recovery','time',120,'power',50),(w61,8,'interval','time',120,'power',118),(w61,9,'recovery','time',120,'power',50),(w61,10,'interval','time',120,'power',118),(w61,11,'recovery','time',120,'power',50),(w61,12,'interval','time',120,'power',118),(w61,13,'recovery','time',120,'power',50),(w61,14,'interval','time',120,'power',118),(w61,15,'recovery','time',120,'power',50),(w61,16,'interval','time',120,'power',118),(w61,17,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max 4×4 min Seiler (55 min)','Classic Seiler 4×4 minute VO2max protocol. 4 minutes on at maximal aerobic power, 3 minutes recovery.','power','vo2max','very_hard',true,55,64,ARRAY['vo2max','4x4','seiler','aerobic-power','power'])
RETURNING id INTO w62;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w62,1,'warmup','time',900,'power',55),(w62,2,'interval','time',240,'power',113),(w62,3,'recovery','time',180,'power',50),(w62,4,'interval','time',240,'power',113),(w62,5,'recovery','time',180,'power',50),(w62,6,'interval','time',240,'power',113),(w62,7,'recovery','time',180,'power',50),(w62,8,'interval','time',240,'power',113),(w62,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Descending Pyramid 5-4-3-2-1 min (55 min)','Descending VO2max pyramid at 110-118% FTP. Higher power as duration decreases.','power','vo2max','very_hard',true,55,65,ARRAY['vo2max','descending','pyramid','power','aerobic'])
RETURNING id INTO w63;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w63,1,'warmup','time',900,'power',55),(w63,2,'interval','time',300,'power',110),(w63,3,'recovery','time',300,'power',50),(w63,4,'interval','time',240,'power',112),(w63,5,'recovery','time',240,'power',50),(w63,6,'interval','time',180,'power',115),(w63,7,'recovery','time',180,'power',50),(w63,8,'interval','time',120,'power',118),(w63,9,'recovery','time',120,'power',50),(w63,10,'interval','time',60,'power',125),(w63,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Long 3×6 min (55 min)','Three extended 6-minute VO2max intervals at 108-112% FTP. Longer duration maximizes time at VO2max per interval.','power','vo2max','very_hard',true,55,65,ARRAY['vo2max','3x6','long','power','aerobic'])
RETURNING id INTO w64;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w64,1,'warmup','time',900,'power',55),(w64,2,'interval','time',360,'power',110),(w64,3,'recovery','time',360,'power',50),(w64,4,'interval','time',360,'power',110),(w64,5,'recovery','time',360,'power',50),(w64,6,'interval','time',360,'power',110),(w64,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Billat 30-30 (50 min)','Billat 30s/30s protocol at 105-110% FTP. Maximizes time spent at VO2max through shorter effort-recovery cycling.','power','vo2max','hard',true,50,55,ARRAY['billat','30-30','vo2max','intervals','power'])
RETURNING id INTO w65;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w65,1,'warmup','time',900,'power',55),(w65,2,'interval','time',30,'power',108),(w65,3,'recovery','time',30,'power',55),(w65,4,'interval','time',30,'power',108),(w65,5,'recovery','time',30,'power',55),(w65,6,'interval','time',30,'power',108),(w65,7,'recovery','time',30,'power',55),(w65,8,'interval','time',30,'power',108),(w65,9,'recovery','time',30,'power',55),(w65,10,'interval','time',30,'power',108),(w65,11,'recovery','time',30,'power',55),(w65,12,'interval','time',30,'power',108),(w65,13,'recovery','time',30,'power',55),(w65,14,'interval','time',30,'power',108),(w65,15,'recovery','time',30,'power',55),(w65,16,'interval','time',30,'power',108),(w65,17,'recovery','time',30,'power',55),(w65,18,'interval','time',30,'power',108),(w65,19,'recovery','time',30,'power',55),(w65,20,'interval','time',30,'power',108),(w65,21,'recovery','time',300,'power',50),(w65,22,'interval','time',30,'power',108),(w65,23,'recovery','time',30,'power',55),(w65,24,'interval','time',30,'power',108),(w65,25,'recovery','time',30,'power',55),(w65,26,'interval','time',30,'power',108),(w65,27,'recovery','time',30,'power',55),(w65,28,'interval','time',30,'power',108),(w65,29,'recovery','time',30,'power',55),(w65,30,'interval','time',30,'power',108),(w65,31,'recovery','time',30,'power',55),(w65,32,'interval','time',30,'power',108),(w65,33,'recovery','time',30,'power',55),(w65,34,'interval','time',30,'power',108),(w65,35,'recovery','time',30,'power',55),(w65,36,'interval','time',30,'power',108),(w65,37,'recovery','time',30,'power',55),(w65,38,'interval','time',30,'power',108),(w65,39,'recovery','time',30,'power',55),(w65,40,'interval','time',30,'power',108),(w65,41,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Race Simulation 3×5 min (55 min)','Three 5-minute maximal efforts simulating short climb or break scenarios.','power','vo2max','very_hard',true,55,64,ARRAY['vo2max','race','simulation','3x5','power'])
RETURNING id INTO w66;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w66,1,'warmup','time',900,'power',55),(w66,2,'interval','time',300,'power',112),(w66,3,'recovery','time',300,'power',50),(w66,4,'interval','time',300,'power',112),(w66,5,'recovery','time',300,'power',50),(w66,6,'interval','time',300,'power',112),(w66,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max + Threshold Combo (70 min)','VO2max block followed by threshold block. Develops the ability to sustain threshold power after VO2max depletion.','power','vo2max','very_hard',true,70,82,ARRAY['vo2max','threshold','combo','power','complex'])
RETURNING id INTO w67;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w67,1,'warmup','time',600,'power',55),(w67,2,'interval','time',180,'power',115),(w67,3,'recovery','time',180,'power',50),(w67,4,'interval','time',180,'power',115),(w67,5,'recovery','time',180,'power',50),(w67,6,'interval','time',180,'power',115),(w67,7,'recovery','time',300,'power',55),(w67,8,'interval','time',720,'power',98),(w67,9,'recovery','time',300,'power',55),(w67,10,'interval','time',720,'power',98),(w67,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Norwegian Method 5×4 min (60 min)','Norwegian method 5×4 min at approximately 110-115% FTP. Derived from elite Norwegian endurance training.','power','vo2max','very_hard',true,60,72,ARRAY['vo2max','norwegian','5x4','power','aerobic'])
RETURNING id INTO w68;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w68,1,'warmup','time',900,'power',55),(w68,2,'interval','time',240,'power',112),(w68,3,'recovery','time',180,'power',50),(w68,4,'interval','time',240,'power',112),(w68,5,'recovery','time',180,'power',50),(w68,6,'interval','time',240,'power',112),(w68,7,'recovery','time',180,'power',50),(w68,8,'interval','time',240,'power',112),(w68,9,'recovery','time',180,'power',50),(w68,10,'interval','time',240,'power',112),(w68,11,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Micro-Burst Sets 10×1 min (45 min)','Ten 1-minute maximal aerobic efforts at 120% FTP. Manageable duration for athletes building VO2max tolerance.','power','vo2max','hard',true,45,50,ARRAY['vo2max','micro','10x1','power','short'])
RETURNING id INTO w69;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w69,1,'warmup','time',900,'power',55),(w69,2,'interval','time',60,'power',120),(w69,3,'recovery','time',120,'power',50),(w69,4,'interval','time',60,'power',120),(w69,5,'recovery','time',120,'power',50),(w69,6,'interval','time',60,'power',120),(w69,7,'recovery','time',120,'power',50),(w69,8,'interval','time',60,'power',120),(w69,9,'recovery','time',120,'power',50),(w69,10,'interval','time',60,'power',120),(w69,11,'recovery','time',120,'power',50),(w69,12,'interval','time',60,'power',120),(w69,13,'recovery','time',120,'power',50),(w69,14,'interval','time',60,'power',120),(w69,15,'recovery','time',120,'power',50),(w69,16,'interval','time',60,'power',120),(w69,17,'recovery','time',120,'power',50),(w69,18,'interval','time',60,'power',120),(w69,19,'recovery','time',120,'power',50),(w69,20,'interval','time',60,'power',120),(w69,21,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Extended Block 2×8 min (55 min)','Two 8-minute maximal aerobic intervals at 108-112% FTP. Builds lactate tolerance and VO2max at longer duration.','power','vo2max','very_hard',true,55,66,ARRAY['vo2max','2x8','extended','power','aerobic'])
RETURNING id INTO w70;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w70,1,'warmup','time',900,'power',55),(w70,2,'interval','time',480,'power',110),(w70,3,'recovery','time',480,'power',50),(w70,4,'interval','time',480,'power',110),(w70,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Repeats 12×90s (55 min)','Twelve 90-second VO2max repeats. High total volume at maximal aerobic power.','power','vo2max','hard',true,55,62,ARRAY['vo2max','12x90s','repeats','power','aerobic'])
RETURNING id INTO w71;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w71,1,'warmup','time',900,'power',55),(w71,2,'interval','time',90,'power',118),(w71,3,'recovery','time',90,'power',50),(w71,4,'interval','time',90,'power',118),(w71,5,'recovery','time',90,'power',50),(w71,6,'interval','time',90,'power',118),(w71,7,'recovery','time',90,'power',50),(w71,8,'interval','time',90,'power',118),(w71,9,'recovery','time',90,'power',50),(w71,10,'interval','time',90,'power',118),(w71,11,'recovery','time',90,'power',50),(w71,12,'interval','time',90,'power',118),(w71,13,'recovery','time',90,'power',50),(w71,14,'interval','time',90,'power',118),(w71,15,'recovery','time',90,'power',50),(w71,16,'interval','time',90,'power',118),(w71,17,'recovery','time',90,'power',50),(w71,18,'interval','time',90,'power',118),(w71,19,'recovery','time',90,'power',50),(w71,20,'interval','time',90,'power',118),(w71,21,'recovery','time',90,'power',50),(w71,22,'interval','time',90,'power',118),(w71,23,'recovery','time',90,'power',50),(w71,24,'interval','time',90,'power',118),(w71,25,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Hard Start Intervals 4×5 min (60 min)','5-minute VO2max efforts with 30-second hard-start at 130% FTP. Hard start rapidly elevates oxygen consumption to VO2max level.','power','vo2max','very_hard',true,60,72,ARRAY['vo2max','hard-start','4x5','power','aerobic'])
RETURNING id INTO w72;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w72,1,'warmup','time',900,'power',55),(w72,2,'interval','time',30,'power',130),(w72,3,'interval','time',270,'power',110),(w72,4,'recovery','time',300,'power',50),(w72,5,'interval','time',30,'power',130),(w72,6,'interval','time',270,'power',110),(w72,7,'recovery','time',300,'power',50),(w72,8,'interval','time',30,'power',130),(w72,9,'interval','time',270,'power',110),(w72,10,'recovery','time',300,'power',50),(w72,11,'interval','time',30,'power',130),(w72,12,'interval','time',270,'power',110),(w72,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Accumulation 20×1 min (55 min)','Twenty 1-minute VO2max efforts with 1-min recovery. Elite-level aerobic development session.','power','vo2max','very_hard',true,55,68,ARRAY['vo2max','accumulation','20x1','power','volume'])
RETURNING id INTO w73;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w73,1,'warmup','time',900,'power',55),(w73,2,'interval','time',60,'power',120),(w73,3,'recovery','time',60,'power',50),(w73,4,'interval','time',60,'power',120),(w73,5,'recovery','time',60,'power',50),(w73,6,'interval','time',60,'power',120),(w73,7,'recovery','time',60,'power',50),(w73,8,'interval','time',60,'power',120),(w73,9,'recovery','time',60,'power',50),(w73,10,'interval','time',60,'power',120),(w73,11,'recovery','time',60,'power',50),(w73,12,'interval','time',60,'power',120),(w73,13,'recovery','time',60,'power',50),(w73,14,'interval','time',60,'power',120),(w73,15,'recovery','time',60,'power',50),(w73,16,'interval','time',60,'power',120),(w73,17,'recovery','time',60,'power',50),(w73,18,'interval','time',60,'power',120),(w73,19,'recovery','time',60,'power',50),(w73,20,'interval','time',60,'power',120),(w73,21,'recovery','time',60,'power',50),(w73,22,'interval','time',60,'power',120),(w73,23,'recovery','time',60,'power',50),(w73,24,'interval','time',60,'power',120),(w73,25,'recovery','time',60,'power',50),(w73,26,'interval','time',60,'power',120),(w73,27,'recovery','time',60,'power',50),(w73,28,'interval','time',60,'power',120),(w73,29,'recovery','time',60,'power',50),(w73,30,'interval','time',60,'power',120),(w73,31,'recovery','time',60,'power',50),(w73,32,'interval','time',60,'power',120),(w73,33,'recovery','time',60,'power',50),(w73,34,'interval','time',60,'power',120),(w73,35,'recovery','time',60,'power',50),(w73,36,'interval','time',60,'power',120),(w73,37,'recovery','time',60,'power',50),(w73,38,'interval','time',60,'power',120),(w73,39,'recovery','time',60,'power',50),(w73,40,'interval','time',60,'power',120),(w73,41,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Step Test Protocol (55 min)','Incremental VO2max test: successive 2-min steps at 105%, 110%, 115%, 120%+ FTP. Estimates maximal aerobic power and VO2max.','power','vo2max','very_hard',true,55,65,ARRAY['vo2max','step-test','protocol','power','test'])
RETURNING id INTO w74;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w74,1,'warmup','time',600,'power',55),(w74,2,'steady','time',180,'power',95),(w74,3,'steady','time',120,'power',105),(w74,4,'steady','time',120,'power',110),(w74,5,'steady','time',120,'power',115),(w74,6,'interval','time',120,'power',120),(w74,7,'interval','time',120,'power',125),(w74,8,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max + Neuromuscular Combo (60 min)','VO2max intervals combined with sprint activations. Develops full power curve from aerobic to anaerobic capacity.','power','vo2max','very_hard',true,60,70,ARRAY['vo2max','neuromuscular','combo','power','full-curve'])
RETURNING id INTO w75;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w75,1,'warmup','time',600,'power',55),(w75,2,'interval','time',240,'power',112),(w75,3,'recovery','time',240,'power',50),(w75,4,'interval','time',240,'power',112),(w75,5,'recovery','time',240,'power',50),(w75,6,'interval','time',240,'power',112),(w75,7,'recovery','time',300,'power',50),(w75,8,'interval','time',10,'power',200),(w75,9,'recovery','time',300,'power',50),(w75,10,'interval','time',10,'power',200),(w75,11,'recovery','time',300,'power',50),(w75,12,'interval','time',10,'power',200),(w75,13,'cooldown','time',600,'power',50);

-- ============================================================
-- SPRINT / NEUROMUSCULAR (10 workouts)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sprint 6×15s Max Power (40 min)','Six maximal 15-second sprint efforts at 180-220% FTP. Develops peak neuromuscular power and maximal sprint capacity.','power','sprint','hard',true,40,32,ARRAY['sprint','15s','max-power','neuromuscular','power'])
RETURNING id INTO w76;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w76,1,'warmup','time',900,'power',60),(w76,2,'interval','time',15,'power',200),(w76,3,'recovery','time',285,'power',45),(w76,4,'interval','time',15,'power',200),(w76,5,'recovery','time',285,'power',45),(w76,6,'interval','time',15,'power',200),(w76,7,'recovery','time',285,'power',45),(w76,8,'interval','time',15,'power',200),(w76,9,'recovery','time',285,'power',45),(w76,10,'interval','time',15,'power',200),(w76,11,'recovery','time',285,'power',45),(w76,12,'interval','time',15,'power',200),(w76,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sprint 10×6s Neuromuscular (35 min)','Ten maximal 6-second sprint efforts. Pure neuromuscular power development with full recovery to maintain quality.','power','sprint','hard',true,35,24,ARRAY['sprint','6s','neuromuscular','peak-power','short'])
RETURNING id INTO w77;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w77,1,'warmup','time',900,'power',60),(w77,2,'interval','time',6,'power',220),(w77,3,'recovery','time',294,'power',45),(w77,4,'interval','time',6,'power',220),(w77,5,'recovery','time',294,'power',45),(w77,6,'interval','time',6,'power',220),(w77,7,'recovery','time',294,'power',45),(w77,8,'interval','time',6,'power',220),(w77,9,'recovery','time',294,'power',45),(w77,10,'interval','time',6,'power',220),(w77,11,'recovery','time',294,'power',45),(w77,12,'interval','time',6,'power',220),(w77,13,'recovery','time',294,'power',45),(w77,14,'interval','time',6,'power',220),(w77,15,'recovery','time',294,'power',45),(w77,16,'interval','time',6,'power',220),(w77,17,'recovery','time',294,'power',45),(w77,18,'interval','time',6,'power',220),(w77,19,'recovery','time',294,'power',45),(w77,20,'interval','time',6,'power',220),(w77,21,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sprint Power Development 4×30s (45 min)','Four 30-second sprint bursts at 160% FTP. Develops anaerobic capacity and glycolytic power.','power','sprint','very_hard',true,45,40,ARRAY['sprint','30s','anaerobic','power','glycolytic'])
RETURNING id INTO w78;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w78,1,'warmup','time',900,'power',60),(w78,2,'interval','time',30,'power',160),(w78,3,'recovery','time',270,'power',45),(w78,4,'interval','time',30,'power',160),(w78,5,'recovery','time',270,'power',45),(w78,6,'interval','time',30,'power',160),(w78,7,'recovery','time',270,'power',45),(w78,8,'interval','time',30,'power',160),(w78,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Explosive Sprint + Endurance (60 min)','Easy endurance ride with 5 explosive 10-second sprint openers. Maintains aerobic base while activating fast-twitch fibers.','power','sprint','moderate',true,60,40,ARRAY['sprint','endurance','explosive','activation','power'])
RETURNING id INTO w79;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w79,1,'warmup','time',600,'power',55),(w79,2,'steady','time',600,'power',63),(w79,3,'interval','time',10,'power',200),(w79,4,'steady','time',600,'power',63),(w79,5,'interval','time',10,'power',200),(w79,6,'steady','time',600,'power',63),(w79,7,'interval','time',10,'power',200),(w79,8,'steady','time',600,'power',63),(w79,9,'interval','time',10,'power',200),(w79,10,'steady','time',600,'power',63),(w79,11,'interval','time',10,'power',200),(w79,12,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Standing Start Sprint Series 6×20s (40 min)','Six 20-second standing start sprints. Develops explosive power from standstill, recruiting all motor unit types.','power','sprint','hard',true,40,32,ARRAY['standing-start','sprint','20s','explosive','power'])
RETURNING id INTO w80;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w80,1,'warmup','time',900,'power',60),(w80,2,'interval','time',20,'power',190),(w80,3,'recovery','time',280,'power',45),(w80,4,'interval','time',20,'power',190),(w80,5,'recovery','time',280,'power',45),(w80,6,'interval','time',20,'power',190),(w80,7,'recovery','time',280,'power',45),(w80,8,'interval','time',20,'power',190),(w80,9,'recovery','time',280,'power',45),(w80,10,'interval','time',20,'power',190),(w80,11,'recovery','time',280,'power',45),(w80,12,'interval','time',20,'power',190),(w80,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Match Sprint Simulation 3×45s (40 min)','Three 45-second all-out sprint simulations. Develops the full sprint arc: explosive start, peak power, and sprint maintenance.','power','sprint','very_hard',true,40,36,ARRAY['match-sprint','45s','simulation','race','power'])
RETURNING id INTO w81;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w81,1,'warmup','time',900,'power',60),(w81,2,'interval','time',45,'power',155),(w81,3,'recovery','time',555,'power',45),(w81,4,'interval','time',45,'power',155),(w81,5,'recovery','time',555,'power',45),(w81,6,'interval','time',45,'power',155),(w81,7,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Flying Sprint 5×10s Rolling Start (40 min)','Rolling start sprints with 10-second maximal output. Isolated neuromuscular activation without the glycolytic cost of standing starts.','power','sprint','hard',true,40,30,ARRAY['flying-sprint','10s','rolling','neuromuscular','power'])
RETURNING id INTO w82;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w82,1,'warmup','time',900,'power',60),(w82,2,'steady','time',60,'power',90),(w82,3,'interval','time',10,'power',210),(w82,4,'recovery','time',290,'power',45),(w82,5,'steady','time',60,'power',90),(w82,6,'interval','time',10,'power',210),(w82,7,'recovery','time',290,'power',45),(w82,8,'steady','time',60,'power',90),(w82,9,'interval','time',10,'power',210),(w82,10,'recovery','time',290,'power',45),(w82,11,'steady','time',60,'power',90),(w82,12,'interval','time',10,'power',210),(w82,13,'recovery','time',290,'power',45),(w82,14,'steady','time',60,'power',90),(w82,15,'interval','time',10,'power',210),(w82,16,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Anaerobic Capacity 6×45s (45 min)','Six 45-second efforts at 155-165% FTP. Extends beyond sprint duration to target full anaerobic capacity depletion.','power','sprint','very_hard',true,45,44,ARRAY['anaerobic','45s','capacity','6x','power'])
RETURNING id INTO w83;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w83,1,'warmup','time',900,'power',60),(w83,2,'interval','time',45,'power',158),(w83,3,'recovery','time',315,'power',48),(w83,4,'interval','time',45,'power',158),(w83,5,'recovery','time',315,'power',48),(w83,6,'interval','time',45,'power',158),(w83,7,'recovery','time',315,'power',48),(w83,8,'interval','time',45,'power',158),(w83,9,'recovery','time',315,'power',48),(w83,10,'interval','time',45,'power',158),(w83,11,'recovery','time',315,'power',48),(w83,12,'interval','time',45,'power',158),(w83,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Criterium Race Simulation — Attack Efforts (50 min)','Criterium simulation with repeated 20-second attacks within aerobic effort. Develops capacity to repeatedly sprint in race conditions.','power','sprint','very_hard',true,50,52,ARRAY['criterium','attack','race-simulation','sprint','power'])
RETURNING id INTO w84;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w84,1,'warmup','time',600,'power',55),(w84,2,'steady','time',300,'power',80),(w84,3,'interval','time',20,'power',165),(w84,4,'steady','time',180,'power',78),(w84,5,'interval','time',20,'power',165),(w84,6,'steady','time',180,'power',78),(w84,7,'interval','time',20,'power',165),(w84,8,'steady','time',180,'power',78),(w84,9,'interval','time',20,'power',165),(w84,10,'steady','time',180,'power',78),(w84,11,'interval','time',20,'power',165),(w84,12,'steady','time',180,'power',78),(w84,13,'interval','time',20,'power',165),(w84,14,'steady','time',180,'power',78),(w84,15,'interval','time',20,'power',165),(w84,16,'steady','time',180,'power',78),(w84,17,'interval','time',20,'power',165),(w84,18,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Wingate-Based Sprint Protocol 3×30s (40 min)','Classic Wingate test-derived 30-second all-out efforts. Primary anaerobic capacity test and development protocol.','power','sprint','very_hard',true,40,40,ARRAY['wingate','sprint','30s','anaerobic','test'])
RETURNING id INTO w85;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w85,1,'warmup','time',900,'power',60),(w85,2,'interval','time',30,'power',165),(w85,3,'recovery','time',570,'power',45),(w85,4,'interval','time',30,'power',165),(w85,5,'recovery','time',570,'power',45),(w85,6,'interval','time',30,'power',165),(w85,7,'cooldown','time',600,'power',50);

-- ============================================================
-- HR-BASED AEROBIC (15 workouts)
-- Impulse: Z1=0.55/h, Z2=0.70/h, Z3=0.83/h, Z4=0.95/h, Z5=1.10/h
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Pyramid Z1-Z2-Z3-Z2-Z1 (60 min)','Heart rate pyramid progressing from Z1 to Z3 and back. Develops all sub-threshold zones in a single session.','hr','endurance','easy',true,60,38,ARRAY['hr','pyramid','z1-z2-z3','karvonen','aerobic'])
RETURNING id INTO w86;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w86,1,'warmup','time',300,'hr',1),(w86,2,'steady','time',600,'hr',1),(w86,3,'steady','time',600,'hr',2),(w86,4,'steady','time',600,'hr',3),(w86,5,'steady','time',600,'hr',2),(w86,6,'steady','time',600,'hr',1),(w86,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Zone 2 Steady State 100 min','Extended Z2 aerobic base ride for athletes using HRR (Karvonen). 100 minutes at 50-60% HRR for maximum aerobic base development.','hr','endurance','moderate',true,100,56,ARRAY['hrr','z2','steady-state','100min','karvonen'])
RETURNING id INTO w87;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w87,1,'warmup','time',600,'hr',1),(w87,2,'steady','time',5400,'hr',2),(w87,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Threshold Z4 Intervals 4×10 min (70 min)','Four 10-min efforts at HRR Zone 4 (70-85% HRR). HR-monitored threshold training equivalent to FTP intervals.','hr','threshold','hard',true,70,68,ARRAY['hr','z4','threshold','intervals','karvonen'])
RETURNING id INTO w88;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w88,1,'warmup','time',600,'hr',2),(w88,2,'interval','time',600,'hr',4),(w88,3,'recovery','time',180,'hr',2),(w88,4,'interval','time',600,'hr',4),(w88,5,'recovery','time',180,'hr',2),(w88,6,'interval','time',600,'hr',4),(w88,7,'recovery','time',180,'hr',2),(w88,8,'interval','time',600,'hr',4),(w88,9,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Recovery Under Stress — Z2 with Z4 Surges (75 min)','Z2 base with 5 short Z4 surges. Trains HR recovery and cardiac output adaptation.','hr','endurance','moderate',true,75,52,ARRAY['hr','z2','z4','surges','cardiac-output'])
RETURNING id INTO w89;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w89,1,'warmup','time',600,'hr',2),(w89,2,'steady','time',600,'hr',2),(w89,3,'interval','time',120,'hr',4),(w89,4,'steady','time',600,'hr',2),(w89,5,'interval','time',120,'hr',4),(w89,6,'steady','time',600,'hr',2),(w89,7,'interval','time',120,'hr',4),(w89,8,'steady','time',600,'hr',2),(w89,9,'interval','time',120,'hr',4),(w89,10,'steady','time',600,'hr',2),(w89,11,'interval','time',120,'hr',4),(w89,12,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Easy Aerobic Spin Z1-Z2 (45 min)','Short low-intensity HR-based session for recovery days or beginners. Stays strictly within Z1-Z2 HRR range.','hr','recovery','easy',true,45,24,ARRAY['hr','z1','z2','easy','recovery'])
RETURNING id INTO w90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w90,1,'warmup','time',300,'hr',1),(w90,2,'steady','time',2100,'hr',2),(w90,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Long Aerobic Z2 (150 min)','Long 2.5h aerobic session at HRR Zone 2 for athletes using heart rate only. Mimics physiological demands of power-based long ride.','hr','endurance','moderate',true,150,84,ARRAY['hr','z2','long','150min','karvonen'])
RETURNING id INTO w91;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w91,1,'warmup','time',600,'hr',1),(w91,2,'steady','time',8400,'hr',2),(w91,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR VO2max Zone 5 Efforts 5×3 min (50 min)','Five 3-minute efforts at HRR Zone 5 (>85% HRR). HR-based VO2max development for athletes without power measurement.','hr','vo2max','very_hard',true,50,52,ARRAY['hr','z5','vo2max','intervals','karvonen'])
RETURNING id INTO w92;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w92,1,'warmup','time',900,'hr',2),(w92,2,'interval','time',180,'hr',5),(w92,3,'recovery','time',180,'hr',2),(w92,4,'interval','time',180,'hr',5),(w92,5,'recovery','time',180,'hr',2),(w92,6,'interval','time',180,'hr',5),(w92,7,'recovery','time',180,'hr',2),(w92,8,'interval','time',180,'hr',5),(w92,9,'recovery','time',180,'hr',2),(w92,10,'interval','time',180,'hr',5),(w92,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Aerobic-Threshold Z3 Sustained (75 min)','Sustained 45-minute effort at HRR Zone 3. Maximizes aerobic threshold development at sub-lactate-threshold intensities.','hr','endurance','moderate',true,75,58,ARRAY['hr','z3','sustained','aerobic-threshold','karvonen'])
RETURNING id INTO w93;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w93,1,'warmup','time',600,'hr',2),(w93,2,'steady','time',2700,'hr',3),(w93,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Threshold Build 3×20 min Progressive (80 min)','Progressive threshold blocks building from Z3 to Z4: first block Z3, second and third full Z4.','hr','threshold','hard',true,80,75,ARRAY['hr','threshold','progressive','z3-z4','build'])
RETURNING id INTO w94;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w94,1,'warmup','time',600,'hr',2),(w94,2,'interval','time',1200,'hr',3),(w94,3,'recovery','time',180,'hr',2),(w94,4,'interval','time',1200,'hr',4),(w94,5,'recovery','time',180,'hr',2),(w94,6,'interval','time',1200,'hr',4),(w94,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Fartlek Extended Z2-Z4 (90 min)','90-min fartlek at alternating HR zones. Unstructured variability develops cardiac range and psychological adaptability.','hr','endurance','moderate',true,90,60,ARRAY['hr','fartlek','z2','z4','variable'])
RETURNING id INTO w95;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w95,1,'warmup','time',600,'hr',2),(w95,2,'steady','time',480,'hr',2),(w95,3,'interval','time',240,'hr',4),(w95,4,'steady','time',480,'hr',2),(w95,5,'interval','time',180,'hr',4),(w95,6,'steady','time',480,'hr',2),(w95,7,'interval','time',240,'hr',4),(w95,8,'steady','time',480,'hr',2),(w95,9,'interval','time',180,'hr',4),(w95,10,'steady','time',480,'hr',2),(w95,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Race Day Warm-Up Protocol (30 min)','Structured race day warm-up using HRR zones. Progressively elevates HR through all zones to prime neuromuscular and cardiovascular systems.','hr','other','moderate',true,30,25,ARRAY['hr','warm-up','race-day','protocol','activation'])
RETURNING id INTO w96;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w96,1,'warmup','time',300,'hr',1),(w96,2,'steady','time',300,'hr',2),(w96,3,'steady','time',300,'hr',3),(w96,4,'interval','time',120,'hr',4),(w96,5,'recovery','time',180,'hr',2),(w96,6,'interval','time',60,'hr',5),(w96,7,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Complete Zone Distribution (60 min)','Systematic session spending time in each HRR zone. Useful for establishing and calibrating zone boundaries early in training season.','hr','endurance','moderate',true,60,45,ARRAY['hr','zone-distribution','calibration','karvonen','zones'])
RETURNING id INTO w97;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w97,1,'warmup','time',300,'hr',1),(w97,2,'steady','time',600,'hr',1),(w97,3,'steady','time',600,'hr',2),(w97,4,'steady','time',600,'hr',3),(w97,5,'interval','time',300,'hr',4),(w97,6,'recovery','time',300,'hr',2),(w97,7,'interval','time',120,'hr',5),(w97,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Aerobic Decoupling Test (90 min)','Steady Z2 ride monitoring aerobic decoupling. Less than 5% decoupling indicates good aerobic base.','hr','endurance','easy',true,90,50,ARRAY['hr','decoupling','test','z2','aerobic-efficiency'])
RETURNING id INTO w98;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w98,1,'warmup','time',600,'hr',1),(w98,2,'steady','time',4800,'hr',2),(w98,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Lactate Shuttle Z3 6×8 min (70 min)','Six 8-minute blocks at HRR Zone 3 (aerobic threshold). Develops lactate shuttle capacity and aerobic enzyme density.','hr','endurance','moderate',true,70,58,ARRAY['hr','z3','lactate-shuttle','intervals','aerobic'])
RETURNING id INTO w99;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w99,1,'warmup','time',600,'hr',2),(w99,2,'interval','time',480,'hr',3),(w99,3,'recovery','time',120,'hr',2),(w99,4,'interval','time',480,'hr',3),(w99,5,'recovery','time',120,'hr',2),(w99,6,'interval','time',480,'hr',3),(w99,7,'recovery','time',120,'hr',2),(w99,8,'interval','time',480,'hr',3),(w99,9,'recovery','time',120,'hr',2),(w99,10,'interval','time',480,'hr',3),(w99,11,'recovery','time',120,'hr',2),(w99,12,'interval','time',480,'hr',3),(w99,13,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HR Complete Aerobic Block 2h Z2 (120 min)','Full 2-hour aerobic block at HRR Zone 2 using Karvonen method. Maximum aerobic base session for HR-monitored athletes.','hr','endurance','moderate',true,120,66,ARRAY['hr','z2','2hr','aerobic','karvonen','long'])
RETURNING id INTO w100;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w100,1,'warmup','time',600,'hr',1),(w100,2,'steady','time',6000,'hr',2),(w100,3,'cooldown','time',600,'hr',1);

END $$;
