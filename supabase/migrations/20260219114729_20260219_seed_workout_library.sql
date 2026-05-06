/*
  # Workout Library — Scientific Reference Collection

  ## Summary
  Inserts 55 structured workouts organized by sport and intensity metric.
  All workouts are public library templates (coach_id=NULL, is_public=true).

  ## Design Decisions

  ### Metric System
  - All training loads use `estimated_impulse` (Banister model: duration × relative intensity)
  - NO TSS/CTL/ATL references — this platform uses CA/AL/RB (Chronic Adaptation, Acute Load, Recovery Balance)
  - Heart Rate targets use Heart Rate Reserve zones (Karvonen method: %HRR = (target - HRrest) / (HRmax - HRrest))
  - Power targets use %FTP (Functional Threshold Power)

  ### Sports Coverage
  1. Cycling — Power-based (15 workouts): target_type='power', target_percent_ftp
  2. Cycling — HR Reserve-based (12 workouts): target_type='hr', target_zone (HRR zones 1–5)
  3. Running (14 workouts): target_type='pace' and target_type='hr' (HRR zones)
  4. Swimming (10 workouts): target_type='pace', target_zone
  5. Multi-sport / Strength (4 workouts): target_type='rpe'

  ### Zone Reference (HRR — Karvonen)
  Z1 < 50% HRR | Z2 = 50–60% HRR | Z3 = 60–70% HRR | Z4 = 70–85% HRR | Z5 > 85% HRR
*/

DO $$
DECLARE
  w_cp_z2_90 uuid; w_cp_sst uuid; w_cp_thresh uuid; w_cp_vo2_3m uuid; w_cp_vo2_5m uuid;
  w_cp_ott uuid; w_cp_mmp20 uuid; w_cp_tabata uuid; w_cp_40_20 uuid; w_cp_cadence uuid;
  w_cp_sweet uuid; w_cp_frc uuid; w_cp_neuro uuid; w_cp_ramp uuid; w_cp_trad uuid;
  w_ch_z2_90 uuid; w_ch_tempo uuid; w_ch_lthr uuid; w_ch_ez60 uuid; w_ch_fartlek uuid;
  w_ch_base45 uuid; w_ch_z3z4 uuid; w_ch_z2long uuid; w_ch_recov uuid; w_ch_hrz2_45 uuid;
  w_ch_hrz3 uuid; w_ch_hrz4 uuid;
  w_r_z2_60 uuid; w_r_tempo uuid; w_r_lt_cr uuid; w_r_vo2_1k uuid; w_r_400rep uuid;
  w_r_1mile uuid; w_r_hills uuid; w_r_prog uuid; w_r_fartlek uuid; w_r_long90 uuid;
  w_r_easy45 uuid; w_r_strides uuid; w_r_vo2_800 uuid; w_r_mlt uuid;
  w_sw_ez uuid; w_sw_css uuid; w_sw_thresh uuid; w_sw_short uuid; w_sw_long uuid;
  w_sw_neg uuid; w_sw_drill uuid; w_sw_sprint uuid; w_sw_ez2 uuid; w_sw_vol uuid;
  w_ms_core uuid; w_ms_str uuid; w_ms_mob uuid; w_ms_plyom uuid;
BEGIN

-- ============================================================
-- CYCLING — POWER-BASED (15)
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Zone 2 Aerobic Endurance (90 min)','Sustained aerobic base development at moderate power output. Primary stimulus for mitochondrial biogenesis and fat oxidation enhancement.','power','endurance','easy',true,90,54,ARRAY['z2','aerobic','base','power'])
RETURNING id INTO w_cp_z2_90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_z2_90,1,'warmup','time',600,'power',55),(w_cp_z2_90,2,'steady','time',4200,'power',65),(w_cp_z2_90,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot Sustained Effort (75 min)','High-volume sub-threshold work at 88–93% FTP. Maximizes metabolic adaptation per unit of time, balancing training load with recovery demand.','power','threshold','moderate',true,75,68,ARRAY['sweet-spot','threshold','power'])
RETURNING id INTO w_cp_sst;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_sst,1,'warmup','time',600,'power',55),(w_cp_sst,2,'interval','time',1800,'power',90),(w_cp_sst,3,'recovery','time',300,'power',60),(w_cp_sst,4,'interval','time',1800,'power',90),(w_cp_sst,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Lactate Threshold Intervals 4×10 min','Classic lactate threshold blocks at 95–100% FTP. Elevates functional threshold through sustained high-intensity aerobic stress.','power','threshold','hard',true,70,72,ARRAY['threshold','FTP','lactate','power'])
RETURNING id INTO w_cp_thresh;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_thresh,1,'warmup','time',600,'power',55),(w_cp_thresh,2,'interval','time',600,'power',97),(w_cp_thresh,3,'recovery','time',300,'power',55),(w_cp_thresh,4,'interval','time',600,'power',97),(w_cp_thresh,5,'recovery','time',300,'power',55),(w_cp_thresh,6,'interval','time',600,'power',97),(w_cp_thresh,7,'recovery','time',300,'power',55),(w_cp_thresh,8,'interval','time',600,'power',97),(w_cp_thresh,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Short Intervals 6×3 min','Repeated maximal aerobic power efforts at 110–120% FTP. Targets cardiac output and oxygen extraction at VO2max.','power','vo2max','hard',true,60,66,ARRAY['vo2max','intervals','power'])
RETURNING id INTO w_cp_vo2_3m;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_vo2_3m,1,'warmup','time',900,'power',55),(w_cp_vo2_3m,2,'interval','time',180,'power',115),(w_cp_vo2_3m,3,'recovery','time',180,'power',50),(w_cp_vo2_3m,4,'interval','time',180,'power',115),(w_cp_vo2_3m,5,'recovery','time',180,'power',50),(w_cp_vo2_3m,6,'interval','time',180,'power',115),(w_cp_vo2_3m,7,'recovery','time',180,'power',50),(w_cp_vo2_3m,8,'interval','time',180,'power',115),(w_cp_vo2_3m,9,'recovery','time',180,'power',50),(w_cp_vo2_3m,10,'interval','time',180,'power',115),(w_cp_vo2_3m,11,'recovery','time',180,'power',50),(w_cp_vo2_3m,12,'interval','time',180,'power',115),(w_cp_vo2_3m,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Long Intervals 4×5 min','Extended VO2max exposure intervals. Five-minute blocks sustain oxygen uptake at maximal aerobic power for greater cumulative stimulus.','power','vo2max','very_hard',true,65,78,ARRAY['vo2max','5min','power'])
RETURNING id INTO w_cp_vo2_5m;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_vo2_5m,1,'warmup','time',900,'power',55),(w_cp_vo2_5m,2,'interval','time',300,'power',112),(w_cp_vo2_5m,3,'recovery','time',300,'power',50),(w_cp_vo2_5m,4,'interval','time',300,'power',112),(w_cp_vo2_5m,5,'recovery','time',300,'power',50),(w_cp_vo2_5m,6,'interval','time',300,'power',112),(w_cp_vo2_5m,7,'recovery','time',300,'power',50),(w_cp_vo2_5m,8,'interval','time',300,'power',112),(w_cp_vo2_5m,9,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Over-Under Threshold Intervals 3×12 min','Alternating sub- and supra-threshold micro-intervals. Trains lactate clearance and buffering capacity at the threshold transition.','power','threshold','hard',true,70,80,ARRAY['over-under','threshold','lactate','power'])
RETURNING id INTO w_cp_ott;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_ott,1,'warmup','time',600,'power',55),(w_cp_ott,2,'interval','time',240,'power',95),(w_cp_ott,3,'interval','time',60,'power',105),(w_cp_ott,4,'interval','time',240,'power',95),(w_cp_ott,5,'interval','time',60,'power',105),(w_cp_ott,6,'interval','time',240,'power',95),(w_cp_ott,7,'recovery','time',300,'power',55),(w_cp_ott,8,'interval','time',240,'power',95),(w_cp_ott,9,'interval','time',60,'power',105),(w_cp_ott,10,'interval','time',240,'power',95),(w_cp_ott,11,'interval','time',60,'power',105),(w_cp_ott,12,'interval','time',240,'power',95),(w_cp_ott,13,'recovery','time',300,'power',55),(w_cp_ott,14,'interval','time',240,'power',95),(w_cp_ott,15,'interval','time',60,'power',105),(w_cp_ott,16,'interval','time',240,'power',95),(w_cp_ott,17,'interval','time',60,'power',105),(w_cp_ott,18,'interval','time',240,'power',95),(w_cp_ott,19,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','20-min Maximal Mean Power Protocol','Standardized 20-minute all-out effort for FTP estimation (x0.95). Used for periodic physiological benchmarking.','power','threshold','very_hard',true,55,90,ARRAY['test','FTP','MMP','power'])
RETURNING id INTO w_cp_mmp20;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_mmp20,1,'warmup','time',600,'power',60),(w_cp_mmp20,2,'interval','time',300,'power',110),(w_cp_mmp20,3,'recovery','time',300,'power',50),(w_cp_mmp20,4,'steady','time',1200,'power',100),(w_cp_mmp20,5,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Tabata Maximal Power Protocol (4 blocks)','Wingate-derived 20s/10s maximal effort intervals. Four complete blocks targeting anaerobic capacity and glycolytic power output.','power','sprint','very_hard',true,35,45,ARRAY['tabata','anaerobic','sprint','power'])
RETURNING id INTO w_cp_tabata;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_tabata,1,'warmup','time',600,'power',60),(w_cp_tabata,2,'interval','time',20,'power',170),(w_cp_tabata,3,'recovery','time',10,'power',40),(w_cp_tabata,4,'interval','time',20,'power',170),(w_cp_tabata,5,'recovery','time',10,'power',40),(w_cp_tabata,6,'interval','time',20,'power',170),(w_cp_tabata,7,'recovery','time',10,'power',40),(w_cp_tabata,8,'interval','time',20,'power',170),(w_cp_tabata,9,'recovery','time',10,'power',40),(w_cp_tabata,10,'interval','time',20,'power',170),(w_cp_tabata,11,'recovery','time',10,'power',40),(w_cp_tabata,12,'interval','time',20,'power',170),(w_cp_tabata,13,'recovery','time',10,'power',40),(w_cp_tabata,14,'interval','time',20,'power',170),(w_cp_tabata,15,'recovery','time',10,'power',40),(w_cp_tabata,16,'interval','time',20,'power',170),(w_cp_tabata,17,'recovery','time',180,'power',40),(w_cp_tabata,18,'interval','time',20,'power',170),(w_cp_tabata,19,'recovery','time',10,'power',40),(w_cp_tabata,20,'interval','time',20,'power',170),(w_cp_tabata,21,'recovery','time',10,'power',40),(w_cp_tabata,22,'interval','time',20,'power',170),(w_cp_tabata,23,'recovery','time',10,'power',40),(w_cp_tabata,24,'interval','time',20,'power',170),(w_cp_tabata,25,'recovery','time',10,'power',40),(w_cp_tabata,26,'interval','time',20,'power',170),(w_cp_tabata,27,'recovery','time',10,'power',40),(w_cp_tabata,28,'interval','time',20,'power',170),(w_cp_tabata,29,'recovery','time',10,'power',40),(w_cp_tabata,30,'interval','time',20,'power',170),(w_cp_tabata,31,'recovery','time',180,'power',40),(w_cp_tabata,32,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Neuromuscular Power 40s/20s Intervals x10','Short supra-maximal repetitions targeting fast-twitch recruitment and peak power output. 40 seconds at 130%+ FTP with 20s recovery.','power','sprint','hard',true,40,42,ARRAY['neuromuscular','sprint','40-20','power'])
RETURNING id INTO w_cp_40_20;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_40_20,1,'warmup','time',600,'power',60),(w_cp_40_20,2,'interval','time',40,'power',135),(w_cp_40_20,3,'recovery','time',20,'power',45),(w_cp_40_20,4,'interval','time',40,'power',135),(w_cp_40_20,5,'recovery','time',20,'power',45),(w_cp_40_20,6,'interval','time',40,'power',135),(w_cp_40_20,7,'recovery','time',20,'power',45),(w_cp_40_20,8,'interval','time',40,'power',135),(w_cp_40_20,9,'recovery','time',20,'power',45),(w_cp_40_20,10,'interval','time',40,'power',135),(w_cp_40_20,11,'recovery','time',20,'power',45),(w_cp_40_20,12,'interval','time',40,'power',135),(w_cp_40_20,13,'recovery','time',20,'power',45),(w_cp_40_20,14,'interval','time',40,'power',135),(w_cp_40_20,15,'recovery','time',20,'power',45),(w_cp_40_20,16,'interval','time',40,'power',135),(w_cp_40_20,17,'recovery','time',20,'power',45),(w_cp_40_20,18,'interval','time',40,'power',135),(w_cp_40_20,19,'recovery','time',20,'power',45),(w_cp_40_20,20,'interval','time',40,'power',135),(w_cp_40_20,21,'recovery','time',20,'power',45),(w_cp_40_20,22,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','High-Cadence Aerobic Efficiency (60 min)','Aerobic endurance session at 95–105 rpm cadence with low-moderate power. Trains neuromuscular efficiency and reduces reliance on muscular force production.','power','endurance','easy',true,60,36,ARRAY['cadence','efficiency','z2','power'])
RETURNING id INTO w_cp_cadence;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_cadence,1,'warmup','time',600,'power',55),(w_cp_cadence,2,'steady','time',2400,'power',62),(w_cp_cadence,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Polarized Aerobic Base — Long (120 min)','Long steady-state effort at 60–70% FTP following a polarized training model. Spends 80% of time below the first lactate threshold.','power','endurance','moderate',true,120,72,ARRAY['polarized','base','long','power'])
RETURNING id INTO w_cp_sweet;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_sweet,1,'warmup','time',600,'power',55),(w_cp_sweet,2,'steady','time',6000,'power',66),(w_cp_sweet,3,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Functional Reserve Capacity Depletion Series','Targets supra-threshold energy reserves (W prime). Brief explosive efforts at 150%+ FTP designed to repeatedly deplete and replenish anaerobic capacity.','power','vo2max','very_hard',true,50,55,ARRAY['FRC','w-prime','anaerobic','power'])
RETURNING id INTO w_cp_frc;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_frc,1,'warmup','time',900,'power',60),(w_cp_frc,2,'interval','time',30,'power',150),(w_cp_frc,3,'recovery','time',150,'power',50),(w_cp_frc,4,'interval','time',30,'power',150),(w_cp_frc,5,'recovery','time',150,'power',50),(w_cp_frc,6,'interval','time',30,'power',150),(w_cp_frc,7,'recovery','time',150,'power',50),(w_cp_frc,8,'interval','time',30,'power',150),(w_cp_frc,9,'recovery','time',150,'power',50),(w_cp_frc,10,'interval','time',30,'power',150),(w_cp_frc,11,'recovery','time',150,'power',50),(w_cp_frc,12,'interval','time',30,'power',150),(w_cp_frc,13,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sprint Neuromuscular Activation (8x10s)','Maximal 10-second sprint efforts for peak power and fast-twitch fiber activation. Full recovery between efforts preserves neuromuscular quality.','power','sprint','hard',true,45,32,ARRAY['sprint','neuromuscular','peak-power','power'])
RETURNING id INTO w_cp_neuro;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_neuro,1,'warmup','time',900,'power',60),(w_cp_neuro,2,'interval','time',10,'power',200),(w_cp_neuro,3,'recovery','time',350,'power',45),(w_cp_neuro,4,'interval','time',10,'power',200),(w_cp_neuro,5,'recovery','time',350,'power',45),(w_cp_neuro,6,'interval','time',10,'power',200),(w_cp_neuro,7,'recovery','time',350,'power',45),(w_cp_neuro,8,'interval','time',10,'power',200),(w_cp_neuro,9,'recovery','time',350,'power',45),(w_cp_neuro,10,'interval','time',10,'power',200),(w_cp_neuro,11,'recovery','time',350,'power',45),(w_cp_neuro,12,'interval','time',10,'power',200),(w_cp_neuro,13,'recovery','time',350,'power',45),(w_cp_neuro,14,'interval','time',10,'power',200),(w_cp_neuro,15,'recovery','time',350,'power',45),(w_cp_neuro,16,'interval','time',10,'power',200),(w_cp_neuro,17,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Progressive Ramp Protocol to VO2max','Incremental stepped ramp at 5-min stages adding 10% FTP. Used for VO2max estimation and zone calibration through a maximal incremental test.','power','vo2max','very_hard',true,55,65,ARRAY['ramp','test','vo2max','power'])
RETURNING id INTO w_cp_ramp;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_ramp,1,'warmup','time',600,'power',50),(w_cp_ramp,2,'steady','time',300,'power',60),(w_cp_ramp,3,'steady','time',300,'power',70),(w_cp_ramp,4,'steady','time',300,'power',80),(w_cp_ramp,5,'steady','time',300,'power',90),(w_cp_ramp,6,'interval','time',300,'power',100),(w_cp_ramp,7,'interval','time',300,'power',110),(w_cp_ramp,8,'interval','time',300,'power',120),(w_cp_ramp,9,'interval','time',300,'power',130),(w_cp_ramp,10,'cooldown','time',600,'power',50);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Low-Cadence Muscular Force Development (60 min)','Force-application training at 50–60 rpm cadence targeting neuromuscular recruitment and cycling-specific strength. Alternate 5-min blocks at low cadence with normal recovery.','power','strength','moderate',true,60,45,ARRAY['force','strength','low-cadence','power'])
RETURNING id INTO w_cp_trad;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w_cp_trad,1,'warmup','time',600,'power',55),(w_cp_trad,2,'steady','time',300,'power',80),(w_cp_trad,3,'recovery','time',180,'power',60),(w_cp_trad,4,'steady','time',300,'power',80),(w_cp_trad,5,'recovery','time',180,'power',60),(w_cp_trad,6,'steady','time',300,'power',80),(w_cp_trad,7,'recovery','time',180,'power',60),(w_cp_trad,8,'steady','time',300,'power',80),(w_cp_trad,9,'cooldown','time',600,'power',50);

-- ============================================================
-- CYCLING — HEART RATE RESERVE (HRR / KARVONEN) — 12 WORKOUTS
-- Zone reference: Z1<50%HRR | Z2=50-60%HRR | Z3=60-70%HRR | Z4=70-85%HRR | Z5>85%HRR
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Endurance Base HRR Z2 (90 min)','Foundation aerobic session sustained at HRR Zone 2 (50-60% HRR, Karvonen). Prioritizes fat metabolism and cardiac stroke volume development. Ideal for athletes without power meters.','hr','endurance','easy',true,90,50,ARRAY['z2','hrr','aerobic','hr-based'])
RETURNING id INTO w_ch_z2_90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_z2_90,1,'warmup','time',600,'hr',1),(w_ch_z2_90,2,'steady','time',4200,'hr',2),(w_ch_z2_90,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Tempo HRR Z3 (60 min)','Sustained aerobic tempo at HRR Zone 3 (60-70% HRR). Builds capacity at the first lactate turn-point and improves lactate clearance at sub-threshold intensities.','hr','endurance','moderate',true,60,48,ARRAY['z3','hrr','tempo','hr-based'])
RETURNING id INTO w_ch_tempo;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_tempo,1,'warmup','time',600,'hr',2),(w_ch_tempo,2,'steady','time',2400,'hr',3),(w_ch_tempo,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Lactate Threshold HR Intervals 3x15 min','Sustained blocks at HRR Zone 4 (70-85% HRR), corresponding to the second lactate threshold. Classic LTHR training for athletes relying on HR-based monitoring.','hr','threshold','hard',true,75,72,ARRAY['threshold','lthr','hrr','z4','hr-based'])
RETURNING id INTO w_ch_lthr;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_lthr,1,'warmup','time',600,'hr',2),(w_ch_lthr,2,'interval','time',900,'hr',4),(w_ch_lthr,3,'recovery','time',300,'hr',2),(w_ch_lthr,4,'interval','time',900,'hr',4),(w_ch_lthr,5,'recovery','time',300,'hr',2),(w_ch_lthr,6,'interval','time',900,'hr',4),(w_ch_lthr,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Active Recovery Spin HRR Z1 (45 min)','Low-stress active recovery maintaining movement below 50% HRR. Promotes lactate clearance and glycogen resynthesis without adding meaningful training load.','hr','recovery','easy',true,45,18,ARRAY['recovery','z1','hrr','hr-based'])
RETURNING id INTO w_ch_ez60;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_ez60,1,'warmup','time',300,'hr',1),(w_ch_ez60,2,'steady','time',2100,'hr',1),(w_ch_ez60,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Cardiac Output Fartlek — Variable HR Effort','Unstructured fartlek session alternating between HRR Z2 (aerobic) and Z4 (threshold). Develops cardiac output adaptations through heart rate variation without rigid interval structure.','hr','endurance','moderate',true,60,54,ARRAY['fartlek','cardiac-output','hrr','hr-based'])
RETURNING id INTO w_ch_fartlek;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_fartlek,1,'warmup','time',600,'hr',2),(w_ch_fartlek,2,'steady','time',600,'hr',2),(w_ch_fartlek,3,'interval','time',300,'hr',4),(w_ch_fartlek,4,'steady','time',600,'hr',2),(w_ch_fartlek,5,'interval','time',300,'hr',4),(w_ch_fartlek,6,'steady','time',600,'hr',2),(w_ch_fartlek,7,'interval','time',300,'hr',4),(w_ch_fartlek,8,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Base Build HRR Z2 (45 min)','Shorter aerobic base session for recovery days or early-season training. Maintains aerobic stimulus without accumulating significant fatigue.','hr','endurance','easy',true,45,27,ARRAY['z2','base','hrr','hr-based'])
RETURNING id INTO w_ch_base45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_base45,1,'warmup','time',300,'hr',1),(w_ch_base45,2,'steady','time',2100,'hr',2),(w_ch_base45,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic-Threshold Transition Intervals Z3-Z4','Alternating intervals between Z3 (first lactate threshold) and Z4 (second lactate threshold) using HRR. Trains the metabolic transition zone and improves lactate buffering capacity.','hr','threshold','moderate',true,60,60,ARRAY['z3-z4','threshold','transition','hrr','hr-based'])
RETURNING id INTO w_ch_z3z4;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_z3z4,1,'warmup','time',600,'hr',2),(w_ch_z3z4,2,'steady','time',480,'hr',3),(w_ch_z3z4,3,'interval','time',480,'hr',4),(w_ch_z3z4,4,'steady','time',480,'hr',3),(w_ch_z3z4,5,'interval','time',480,'hr',4),(w_ch_z3z4,6,'steady','time',480,'hr',3),(w_ch_z3z4,7,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Long Aerobic Volume HRR Z2 (120 min)','Two-hour steady-state aerobic session at HRR Z2. Primary tool for building aerobic volume in HR-monitored athletes. Consistent pacing guided by Karvonen zone 2 heart rate.','hr','endurance','moderate',true,120,66,ARRAY['long','z2','volume','hrr','hr-based'])
RETURNING id INTO w_ch_z2long;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_z2long,1,'warmup','time',600,'hr',1),(w_ch_z2long,2,'steady','time',6000,'hr',2),(w_ch_z2long,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Post-Exertion Active Recovery HRR Z1 (30 min)','Ultra-low intensity recovery ride strictly below 50% HRR. Indicated after high-load training days to facilitate metabolic recovery without additional physiological stress.','hr','recovery','easy',true,30,9,ARRAY['recovery','z1','post-exertion','hrr','hr-based'])
RETURNING id INTO w_ch_recov;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_recov,1,'steady','time',1800,'hr',1),(w_ch_recov,2,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Progressive HR Z2 Aerobic Build (45 min)','Progressively increasing aerobic intensity from low Z2 to high Z2 (Karvonen). Trains pacing calibration and builds aerobic capacity through gradual cardiac loading.','hr','endurance','easy',true,45,30,ARRAY['progressive','z2','hrr','hr-based'])
RETURNING id INTO w_ch_hrz2_45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_hrz2_45,1,'warmup','time',300,'hr',1),(w_ch_hrz2_45,2,'steady','time',600,'hr',2),(w_ch_hrz2_45,3,'steady','time',600,'hr',2),(w_ch_hrz2_45,4,'steady','time',900,'hr',2),(w_ch_hrz2_45,5,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Threshold Stimulus HRR Z3 (60 min)','Extended continuous effort at the top of HRR Zone 3. Maximally stimulates the aerobic threshold without crossing into lactate-accumulating territory.','hr','endurance','moderate',true,60,45,ARRAY['z3','aerobic-threshold','hrr','hr-based'])
RETURNING id INTO w_ch_hrz3;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_hrz3,1,'warmup','time',600,'hr',2),(w_ch_hrz3,2,'steady','time',2400,'hr',3),(w_ch_hrz3,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','LTHR Development Blocks HRR Z4 (4x12 min)','Four sustained intervals at HRR Zone 4, targeting the second lactate threshold. Equivalent to FTP training guided by Karvonen heart rate for athletes without power meters.','hr','threshold','hard',true,80,78,ARRAY['lthr','z4','threshold','hrr','hr-based'])
RETURNING id INTO w_ch_hrz4;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ch_hrz4,1,'warmup','time',600,'hr',2),(w_ch_hrz4,2,'interval','time',720,'hr',4),(w_ch_hrz4,3,'recovery','time',240,'hr',2),(w_ch_hrz4,4,'interval','time',720,'hr',4),(w_ch_hrz4,5,'recovery','time',240,'hr',2),(w_ch_hrz4,6,'interval','time',720,'hr',4),(w_ch_hrz4,7,'recovery','time',240,'hr',2),(w_ch_hrz4,8,'interval','time',720,'hr',4),(w_ch_hrz4,9,'cooldown','time',600,'hr',1);

-- ============================================================
-- RUNNING — 14 WORKOUTS
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Aerobic Run HRR Z2 (60 min)','Conversational-pace aerobic run maintained at HRR Zone 2 (Karvonen). Primary aerobic base builder for running. Protects against overtraining while accumulating volume.','hr','endurance','easy',true,60,36,ARRAY['z2','easy','hrr','aerobic'])
RETURNING id INTO w_r_z2_60;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_z2_60,1,'warmup','time',300,'hr',1),(w_r_z2_60,2,'steady','time',3000,'hr',2),(w_r_z2_60,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Lactate Threshold Tempo Run (35 min continuous)','Comfortably hard continuous run at LTHR (HRR Zone 4, Karvonen). Classic threshold development session; improves lactate clearance rate and running economy at race pace.','hr','threshold','moderate',true,50,55,ARRAY['tempo','lthr','z4','threshold'])
RETURNING id INTO w_r_tempo;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_tempo,1,'warmup','time',600,'hr',2),(w_r_tempo,2,'steady','time',2100,'hr',4),(w_r_tempo,3,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Cruise Intervals at LTHR 5x8 min','Broken-tempo format targeting HRR Zone 4. Short recovery intervals allow accumulation of higher total threshold volume compared to continuous tempo runs.','hr','threshold','hard',true,70,70,ARRAY['cruise','lthr','intervals','threshold','hrr'])
RETURNING id INTO w_r_lt_cr;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_lt_cr,1,'warmup','time',600,'hr',2),(w_r_lt_cr,2,'interval','time',480,'hr',4),(w_r_lt_cr,3,'recovery','time',90,'hr',2),(w_r_lt_cr,4,'interval','time',480,'hr',4),(w_r_lt_cr,5,'recovery','time',90,'hr',2),(w_r_lt_cr,6,'interval','time',480,'hr',4),(w_r_lt_cr,7,'recovery','time',90,'hr',2),(w_r_lt_cr,8,'interval','time',480,'hr',4),(w_r_lt_cr,9,'recovery','time',90,'hr',2),(w_r_lt_cr,10,'interval','time',480,'hr',4),(w_r_lt_cr,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Running Intervals 5x1 km','Repeated 1 km efforts at VO2max pace (HRR Zone 5). Maximizes time at maximal aerobic speed (MAS). Jack Daniels-derived I-pace sessions.','hr','vo2max','very_hard',true,55,65,ARRAY['vo2max','1km','intervals','MAS'])
RETURNING id INTO w_r_vo2_1k;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_vo2_1k,1,'warmup','time',600,'hr',2),(w_r_vo2_1k,2,'interval','time',240,'hr',5),(w_r_vo2_1k,3,'recovery','time',180,'hr',2),(w_r_vo2_1k,4,'interval','time',240,'hr',5),(w_r_vo2_1k,5,'recovery','time',180,'hr',2),(w_r_vo2_1k,6,'interval','time',240,'hr',5),(w_r_vo2_1k,7,'recovery','time',180,'hr',2),(w_r_vo2_1k,8,'interval','time',240,'hr',5),(w_r_vo2_1k,9,'recovery','time',180,'hr',2),(w_r_vo2_1k,10,'interval','time',240,'hr',5),(w_r_vo2_1k,11,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Track Repetitions 400 m x12','Classic track repetitions at 5 km race pace. High-speed running stimulus for lactate tolerance, running economy, and neuromuscular power. Based on Billat and Daniels R-pace methodology.','pace','vo2max','hard',true,60,60,ARRAY['track','400m','repetitions','speed'])
RETURNING id INTO w_r_400rep;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_400rep,1,'warmup','time',600,'pace',1),(w_r_400rep,2,'interval','time',90,'pace',5),(w_r_400rep,3,'recovery','time',90,'pace',1),(w_r_400rep,4,'interval','time',90,'pace',5),(w_r_400rep,5,'recovery','time',90,'pace',1),(w_r_400rep,6,'interval','time',90,'pace',5),(w_r_400rep,7,'recovery','time',90,'pace',1),(w_r_400rep,8,'interval','time',90,'pace',5),(w_r_400rep,9,'recovery','time',90,'pace',1),(w_r_400rep,10,'interval','time',90,'pace',5),(w_r_400rep,11,'recovery','time',90,'pace',1),(w_r_400rep,12,'interval','time',90,'pace',5),(w_r_400rep,13,'recovery','time',90,'pace',1),(w_r_400rep,14,'interval','time',90,'pace',5),(w_r_400rep,15,'recovery','time',90,'pace',1),(w_r_400rep,16,'interval','time',90,'pace',5),(w_r_400rep,17,'recovery','time',90,'pace',1),(w_r_400rep,18,'interval','time',90,'pace',5),(w_r_400rep,19,'recovery','time',90,'pace',1),(w_r_400rep,20,'interval','time',90,'pace',5),(w_r_400rep,21,'recovery','time',90,'pace',1),(w_r_400rep,22,'interval','time',90,'pace',5),(w_r_400rep,23,'recovery','time',90,'pace',1),(w_r_400rep,24,'interval','time',90,'pace',5),(w_r_400rep,25,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Mile Repetitions at VO2max 3x1 mile','Long speed repetitions at mile race pace (close to MAS). Balances high-intensity stimulus with sufficient volume. Based on Daniels I-pace (VDOT).','pace','vo2max','hard',true,60,65,ARRAY['mile','repetitions','vo2max','vdot'])
RETURNING id INTO w_r_1mile;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_1mile,1,'warmup','time',600,'pace',1),(w_r_1mile,2,'interval','time',360,'pace',5),(w_r_1mile,3,'recovery','time',300,'pace',1),(w_r_1mile,4,'interval','time',360,'pace',5),(w_r_1mile,5,'recovery','time',300,'pace',1),(w_r_1mile,6,'interval','time',360,'pace',5),(w_r_1mile,7,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Hill Repetitions — Neuromuscular Power (8x90s)','Short steep-grade hill repetitions targeting running-specific neuromuscular power, gluteal and calf recruitment, and stride mechanics. Based on Lydiard hill bounding principles.','hr','strength','hard',true,50,52,ARRAY['hills','neuromuscular','strength','running'])
RETURNING id INTO w_r_hills;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_hills,1,'warmup','time',600,'hr',2),(w_r_hills,2,'interval','time',90,'hr',5),(w_r_hills,3,'recovery','time',90,'hr',1),(w_r_hills,4,'interval','time',90,'hr',5),(w_r_hills,5,'recovery','time',90,'hr',1),(w_r_hills,6,'interval','time',90,'hr',5),(w_r_hills,7,'recovery','time',90,'hr',1),(w_r_hills,8,'interval','time',90,'hr',5),(w_r_hills,9,'recovery','time',90,'hr',1),(w_r_hills,10,'interval','time',90,'hr',5),(w_r_hills,11,'recovery','time',90,'hr',1),(w_r_hills,12,'interval','time',90,'hr',5),(w_r_hills,13,'recovery','time',90,'hr',1),(w_r_hills,14,'interval','time',90,'hr',5),(w_r_hills,15,'recovery','time',90,'hr',1),(w_r_hills,16,'interval','time',90,'hr',5),(w_r_hills,17,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Progressive Long Run (75 min)','Long run with deliberate progression from aerobic base (HRR Z2) to aerobic threshold (HRR Z3) in the final third. Trains pace-and-effort calibration and metabolic flexibility.','hr','endurance','moderate',true,75,60,ARRAY['long-run','progressive','z2','z3'])
RETURNING id INTO w_r_prog;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_prog,1,'warmup','time',300,'hr',1),(w_r_prog,2,'steady','time',2400,'hr',2),(w_r_prog,3,'steady','time',1200,'hr',3),(w_r_prog,4,'cooldown','time',600,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Fartlek Running HRR Z2-Z4 (45 min)','Unstructured speed play alternating aerobic and threshold intensities. Develops aerobic range and reduces psychological rigidity of interval training.','hr','endurance','moderate',true,45,45,ARRAY['fartlek','z2','z4','hrr'])
RETURNING id INTO w_r_fartlek;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_fartlek,1,'warmup','time',300,'hr',1),(w_r_fartlek,2,'steady','time',300,'hr',2),(w_r_fartlek,3,'interval','time',120,'hr',4),(w_r_fartlek,4,'steady','time',300,'hr',2),(w_r_fartlek,5,'interval','time',120,'hr',4),(w_r_fartlek,6,'steady','time',300,'hr',2),(w_r_fartlek,7,'interval','time',120,'hr',4),(w_r_fartlek,8,'steady','time',300,'hr',2),(w_r_fartlek,9,'interval','time',120,'hr',4),(w_r_fartlek,10,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Aerobic Long Run HRR Z2 (90 min)','Primary weekly long run at aerobic base intensity (HRR Z2, Karvonen). Fundamental for building mitochondrial density, fat oxidation, and running-specific musculoskeletal resilience.','hr','endurance','moderate',true,90,63,ARRAY['long-run','z2','aerobic','hrr'])
RETURNING id INTO w_r_long90;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_long90,1,'warmup','time',300,'hr',1),(w_r_long90,2,'steady','time',4800,'hr',2),(w_r_long90,3,'cooldown','time',300,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Easy Recovery Run HRR Z1 (45 min)','Very easy post-exertion run strictly below 50% HRR. Active recovery promoting blood flow, metabolic byproduct clearance, and tissue repair. Run slowly enough that conversation is effortless.','hr','recovery','easy',true,45,18,ARRAY['recovery','z1','easy','hrr'])
RETURNING id INTO w_r_easy45;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_easy45,1,'steady','time',2700,'hr',1),(w_r_easy45,2,'cooldown','time',180,'hr',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Running Strides — Neuromuscular Activation (10x100 m)','Short accelerations at mile pace or faster. Improves running economy, stride mechanics, and neuromuscular coordination without accumulating aerobic fatigue.','pace','sprint','easy',true,30,18,ARRAY['strides','neuromuscular','economy','speed'])
RETURNING id INTO w_r_strides;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_strides,1,'warmup','time',600,'pace',2),(w_r_strides,2,'interval','time',20,'pace',5),(w_r_strides,3,'recovery','time',60,'pace',1),(w_r_strides,4,'interval','time',20,'pace',5),(w_r_strides,5,'recovery','time',60,'pace',1),(w_r_strides,6,'interval','time',20,'pace',5),(w_r_strides,7,'recovery','time',60,'pace',1),(w_r_strides,8,'interval','time',20,'pace',5),(w_r_strides,9,'recovery','time',60,'pace',1),(w_r_strides,10,'interval','time',20,'pace',5),(w_r_strides,11,'recovery','time',60,'pace',1),(w_r_strides,12,'interval','time',20,'pace',5),(w_r_strides,13,'recovery','time',60,'pace',1),(w_r_strides,14,'interval','time',20,'pace',5),(w_r_strides,15,'recovery','time',60,'pace',1),(w_r_strides,16,'interval','time',20,'pace',5),(w_r_strides,17,'recovery','time',60,'pace',1),(w_r_strides,18,'interval','time',20,'pace',5),(w_r_strides,19,'recovery','time',60,'pace',1),(w_r_strides,20,'interval','time',20,'pace',5),(w_r_strides,21,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','VO2max Running Intervals 6x800 m','Shorter VO2max repetitions allowing for more total repetitions at maximal aerobic speed. Develops peak aerobic power.','pace','vo2max','very_hard',true,50,60,ARRAY['vo2max','800m','MAS','intervals'])
RETURNING id INTO w_r_vo2_800;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_vo2_800,1,'warmup','time',600,'pace',2),(w_r_vo2_800,2,'interval','time',200,'pace',5),(w_r_vo2_800,3,'recovery','time',200,'pace',1),(w_r_vo2_800,4,'interval','time',200,'pace',5),(w_r_vo2_800,5,'recovery','time',200,'pace',1),(w_r_vo2_800,6,'interval','time',200,'pace',5),(w_r_vo2_800,7,'recovery','time',200,'pace',1),(w_r_vo2_800,8,'interval','time',200,'pace',5),(w_r_vo2_800,9,'recovery','time',200,'pace',1),(w_r_vo2_800,10,'interval','time',200,'pace',5),(w_r_vo2_800,11,'recovery','time',200,'pace',1),(w_r_vo2_800,12,'interval','time',200,'pace',5),(w_r_vo2_800,13,'cooldown','time',600,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('running','Marathon Lactate Threshold Run (60 min progression)','Medium-long run with progressive increase from aerobic (Z2) to marathon-specific pace (Z3-Z4). Builds glycogen conservation, fatigue resistance, and metabolic efficiency at race-relevant intensities.','hr','threshold','hard',true,60,66,ARRAY['marathon','progressive','threshold'])
RETURNING id INTO w_r_mlt;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_r_mlt,1,'warmup','time',300,'hr',1),(w_r_mlt,2,'steady','time',1200,'hr',2),(w_r_mlt,3,'steady','time',1200,'hr',3),(w_r_mlt,4,'interval','time',900,'hr',4),(w_r_mlt,5,'cooldown','time',300,'hr',1);

-- ============================================================
-- SWIMMING — 10 WORKOUTS
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Aerobic Swim Z1-Z2 (45 min)','Low-intensity continuous swim at aerobic base pace (Z1-Z2). Focus on technique and stroke efficiency. Builds swim-specific mitochondrial density with minimal load.','pace','endurance','easy',true,45,27,ARRAY['z1','easy','aerobic','technique'])
RETURNING id INTO w_sw_ez;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_ez,1,'warmup','time',300,'pace',1),(w_sw_ez,2,'steady','time',2100,'pace',2),(w_sw_ez,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Critical Swim Speed Threshold Sets 4x400 m','Sustained sets at Critical Swim Speed (CSS), the swim-specific equivalent of functional threshold pace. Stimulates aerobic enzyme activity and sustains swim-specific lactate threshold.','pace','threshold','moderate',true,55,55,ARRAY['css','threshold','400m','swim-specific'])
RETURNING id INTO w_sw_css;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_css,1,'warmup','time',300,'pace',1),(w_sw_css,2,'interval','time',360,'pace',4),(w_sw_css,3,'recovery','time',60,'pace',1),(w_sw_css,4,'interval','time',360,'pace',4),(w_sw_css,5,'recovery','time',60,'pace',1),(w_sw_css,6,'interval','time',360,'pace',4),(w_sw_css,7,'recovery','time',60,'pace',1),(w_sw_css,8,'interval','time',360,'pace',4),(w_sw_css,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','T-Pace Threshold Swim 10x100 m','Broken threshold sets at T-pace with 10-second rest. Classic USMS/Daniels-adapted threshold volume accumulation method.','pace','threshold','hard',true,50,55,ARRAY['t-pace','threshold','100m','swim'])
RETURNING id INTO w_sw_thresh;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_thresh,1,'warmup','time',300,'pace',1),(w_sw_thresh,2,'interval','time',90,'pace',4),(w_sw_thresh,3,'recovery','time',10,'pace',1),(w_sw_thresh,4,'interval','time',90,'pace',4),(w_sw_thresh,5,'recovery','time',10,'pace',1),(w_sw_thresh,6,'interval','time',90,'pace',4),(w_sw_thresh,7,'recovery','time',10,'pace',1),(w_sw_thresh,8,'interval','time',90,'pace',4),(w_sw_thresh,9,'recovery','time',10,'pace',1),(w_sw_thresh,10,'interval','time',90,'pace',4),(w_sw_thresh,11,'recovery','time',10,'pace',1),(w_sw_thresh,12,'interval','time',90,'pace',4),(w_sw_thresh,13,'recovery','time',10,'pace',1),(w_sw_thresh,14,'interval','time',90,'pace',4),(w_sw_thresh,15,'recovery','time',10,'pace',1),(w_sw_thresh,16,'interval','time',90,'pace',4),(w_sw_thresh,17,'recovery','time',10,'pace',1),(w_sw_thresh,18,'interval','time',90,'pace',4),(w_sw_thresh,19,'recovery','time',10,'pace',1),(w_sw_thresh,20,'interval','time',90,'pace',4),(w_sw_thresh,21,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Short Sprint Power Sets 20x50 m','Maximal-speed short repetitions targeting peak glycolytic and neuromuscular power output in swimming. Full rest ensures quality over fatigue adaptation.','pace','sprint','very_hard',true,45,40,ARRAY['sprint','50m','anaerobic','speed'])
RETURNING id INTO w_sw_short;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_short,1,'warmup','time',600,'pace',2),(w_sw_short,2,'interval','time',30,'pace',5),(w_sw_short,3,'recovery','time',90,'pace',1),(w_sw_short,4,'interval','time',30,'pace',5),(w_sw_short,5,'recovery','time',90,'pace',1),(w_sw_short,6,'interval','time',30,'pace',5),(w_sw_short,7,'recovery','time',90,'pace',1),(w_sw_short,8,'interval','time',30,'pace',5),(w_sw_short,9,'recovery','time',90,'pace',1),(w_sw_short,10,'interval','time',30,'pace',5),(w_sw_short,11,'recovery','time',90,'pace',1),(w_sw_short,12,'interval','time',30,'pace',5),(w_sw_short,13,'recovery','time',90,'pace',1),(w_sw_short,14,'interval','time',30,'pace',5),(w_sw_short,15,'recovery','time',90,'pace',1),(w_sw_short,16,'interval','time',30,'pace',5),(w_sw_short,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Long Continuous Aerobic Swim Z2 (60 min)','Extended continuous swim at aerobic pace. Targets stroke efficiency at volume, swimming economy, and lactate clearance capacity.','pace','endurance','moderate',true,60,42,ARRAY['long','continuous','z2','volume'])
RETURNING id INTO w_sw_long;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_long,1,'warmup','time',300,'pace',1),(w_sw_long,2,'steady','time',3000,'pace',2),(w_sw_long,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Negative-Split Pyramid Swim (100-400-100 m)','Ascending and descending distance pyramid ensuring negative-split pacing. Develops pacing judgment, aerobic range, and lactate tolerance management.','pace','endurance','moderate',true,45,45,ARRAY['pyramid','negative-split','pacing','swim'])
RETURNING id INTO w_sw_neg;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_neg,1,'warmup','time',300,'pace',1),(w_sw_neg,2,'interval','time',90,'pace',4),(w_sw_neg,3,'recovery','time',20,'pace',1),(w_sw_neg,4,'interval','time',180,'pace',3),(w_sw_neg,5,'recovery','time',30,'pace',1),(w_sw_neg,6,'interval','time',360,'pace',3),(w_sw_neg,7,'recovery','time',30,'pace',1),(w_sw_neg,8,'interval','time',180,'pace',4),(w_sw_neg,9,'recovery','time',20,'pace',1),(w_sw_neg,10,'interval','time',90,'pace',5),(w_sw_neg,11,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Stroke Mechanics Drill Set (45 min)','Structured drill sequence targeting stroke mechanics, body position, and underwater phase. Low physiological load; high neuromotor training value.','pace','other','easy',true,45,20,ARRAY['drills','technique','stroke','mechanics'])
RETURNING id INTO w_sw_drill;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_drill,1,'warmup','time',300,'pace',1),(w_sw_drill,2,'steady','time',300,'pace',2),(w_sw_drill,3,'steady','time',300,'pace',1),(w_sw_drill,4,'steady','time',300,'pace',2),(w_sw_drill,5,'steady','time',300,'pace',1),(w_sw_drill,6,'steady','time',300,'pace',2),(w_sw_drill,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max Swim Intervals 8x200 m','Hard-effort 200 m repeats at or above CSS, targeting VO2max-level cardiovascular stimulus in swimming. Standard distance-event speed-endurance development.','pace','vo2max','hard',true,55,55,ARRAY['vo2max','200m','speed-endurance','swim'])
RETURNING id INTO w_sw_sprint;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_sprint,1,'warmup','time',300,'pace',1),(w_sw_sprint,2,'interval','time',180,'pace',5),(w_sw_sprint,3,'recovery','time',60,'pace',1),(w_sw_sprint,4,'interval','time',180,'pace',5),(w_sw_sprint,5,'recovery','time',60,'pace',1),(w_sw_sprint,6,'interval','time',180,'pace',5),(w_sw_sprint,7,'recovery','time',60,'pace',1),(w_sw_sprint,8,'interval','time',180,'pace',5),(w_sw_sprint,9,'recovery','time',60,'pace',1),(w_sw_sprint,10,'interval','time',180,'pace',5),(w_sw_sprint,11,'recovery','time',60,'pace',1),(w_sw_sprint,12,'interval','time',180,'pace',5),(w_sw_sprint,13,'recovery','time',60,'pace',1),(w_sw_sprint,14,'interval','time',180,'pace',5),(w_sw_sprint,15,'recovery','time',60,'pace',1),(w_sw_sprint,16,'interval','time',180,'pace',5),(w_sw_sprint,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Easy Recovery Swim Z1 (30 min)','Very easy low-stroke-rate swim below aerobic threshold. Active recovery using water buoyancy to facilitate tissue recovery.','pace','recovery','easy',true,30,12,ARRAY['recovery','z1','easy','swim'])
RETURNING id INTO w_sw_ez2;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_ez2,1,'steady','time',1620,'pace',1),(w_sw_ez2,2,'cooldown','time',180,'pace',1);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Volume Swim — Mixed Effort (60 min)','Volume-oriented swim mixing aerobic and sub-threshold sets. Develops swim fitness foundation through accumulated distance at controlled intensity.','pace','endurance','moderate',true,60,45,ARRAY['volume','mixed','aerobic','swim'])
RETURNING id INTO w_sw_vol;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_sw_vol,1,'warmup','time',300,'pace',1),(w_sw_vol,2,'steady','time',600,'pace',2),(w_sw_vol,3,'steady','time',600,'pace',3),(w_sw_vol,4,'steady','time',600,'pace',2),(w_sw_vol,5,'steady','time',600,'pace',3),(w_sw_vol,6,'cooldown','time',300,'pace',1);

-- ============================================================
-- STRENGTH / FUNCTIONAL / OTHER — 4 WORKOUTS
-- ============================================================

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Functional Core Stability Circuit','Plank progressions, anti-rotation, and hip stability exercises targeting lumbopelvic control. Evidence-based injury prevention and power transfer efficiency for all endurance sports.','rpe','strength','moderate',true,30,15,ARRAY['core','stability','functional','injury-prevention'])
RETURNING id INTO w_ms_core;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ms_core,1,'warmup','time',300,'rpe',3),(w_ms_core,2,'interval','time',60,'rpe',6),(w_ms_core,3,'recovery','time',30,'rpe',2),(w_ms_core,4,'interval','time',60,'rpe',6),(w_ms_core,5,'recovery','time',30,'rpe',2),(w_ms_core,6,'interval','time',60,'rpe',7),(w_ms_core,7,'recovery','time',30,'rpe',2),(w_ms_core,8,'interval','time',60,'rpe',7),(w_ms_core,9,'recovery','time',30,'rpe',2),(w_ms_core,10,'interval','time',60,'rpe',8),(w_ms_core,11,'cooldown','time',300,'rpe',3);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Maximal Strength — Lower Body Compound Movements','Single-leg squat, hip hinge, and deadlift patterns at high force output. Targets maximal strength development for improved power-to-weight ratio and cycling/running force application.','rpe','strength','hard',true,60,30,ARRAY['strength','lower-body','compound','force'])
RETURNING id INTO w_ms_str;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ms_str,1,'warmup','time',600,'rpe',4),(w_ms_str,2,'interval','time',120,'rpe',8),(w_ms_str,3,'recovery','time',180,'rpe',2),(w_ms_str,4,'interval','time',120,'rpe',8),(w_ms_str,5,'recovery','time',180,'rpe',2),(w_ms_str,6,'interval','time',120,'rpe',9),(w_ms_str,7,'recovery','time',180,'rpe',2),(w_ms_str,8,'interval','time',120,'rpe',9),(w_ms_str,9,'cooldown','time',600,'rpe',3);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Dynamic Mobility and Flexibility Protocol','Systematic mobility routine combining dynamic warm-up, PNF stretching, and myofascial release. Maintains range of motion, reduces injury risk, and facilitates recovery.','rpe','recovery','easy',true,30,6,ARRAY['mobility','flexibility','recovery','prehab'])
RETURNING id INTO w_ms_mob;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ms_mob,1,'warmup','time',300,'rpe',3),(w_ms_mob,2,'steady','time',1200,'rpe',4),(w_ms_mob,3,'cooldown','time',300,'rpe',2);

INSERT INTO workouts (sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('other','Plyometric Reactive Power Circuit','Explosive jumping and bounding exercises targeting stretch-shortening cycle efficiency. Develops reactive strength and improves running economy and neuromuscular power output in cycling sprints.','rpe','strength','hard',true,40,28,ARRAY['plyometrics','reactive','explosive','power'])
RETURNING id INTO w_ms_plyom;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w_ms_plyom,1,'warmup','time',600,'rpe',4),(w_ms_plyom,2,'interval','time',30,'rpe',9),(w_ms_plyom,3,'recovery','time',90,'rpe',2),(w_ms_plyom,4,'interval','time',30,'rpe',9),(w_ms_plyom,5,'recovery','time',90,'rpe',2),(w_ms_plyom,6,'interval','time',30,'rpe',9),(w_ms_plyom,7,'recovery','time',90,'rpe',2),(w_ms_plyom,8,'interval','time',30,'rpe',9),(w_ms_plyom,9,'recovery','time',90,'rpe',2),(w_ms_plyom,10,'interval','time',30,'rpe',9),(w_ms_plyom,11,'recovery','time',90,'rpe',2),(w_ms_plyom,12,'interval','time',30,'rpe',9),(w_ms_plyom,13,'cooldown','time',600,'rpe',3);

END $$;
