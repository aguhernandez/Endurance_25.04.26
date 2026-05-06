/*
  # Cycling Library — Extended Scientific Collection

  ## Summary
  Adds 120+ structured cycling workouts based on peer-reviewed exercise physiology literature:
  - Coggan & Allen (Training and Racing with a Power Meter)
  - Friel (The Cyclist's Training Bible)
  - Seiler (polarized training research)
  - Billat (VO2max interval research)
  - Gibala (high-intensity interval research)
  - Laursen & Jenkins (HIIT systematic reviews)

  ## Categories Covered
  Aerobic base, sweet spot, threshold, VO2max, anaerobic, sprint/neuromuscular,
  muscular endurance, cadence/technique, recovery, testing protocols, periodization blocks

  ## Metrics
  - Power-based: target_percent_ftp (% of FTP)
  - HR-based: target_zone (HRR Karvonen zones 1-5)
  - Impulse = estimated_impulse (Banister model)
*/

DO $$
DECLARE w uuid;
BEGIN

-- ==================================================================
-- AEROBIC BASE / ENDURANCE — POWER (15 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Z2 Foundation Ride (60 min)','Pure aerobic base ride at 60-65% FTP. Fat oxidation and mitochondrial development stimulus.','power','endurance','easy',true,60,36,ARRAY['z2','base','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',2400,'power',62),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Tempo Endurance (2x20 min at Z3)','Two 20-minute blocks at 76-80% FTP (zone 3 tempo). Builds aerobic power at the crossover point between fat and carbohydrate metabolism.','power','endurance','moderate',true,70,70,ARRAY['z3','tempo','muscular-endurance','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1200,'power',78),(w,3,'recovery','time',300,'power',60),(w,4,'steady','time',1200,'power',78),(w,5,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Continuous Tempo (40 min)','Unbroken 40-minute effort at 76-82% FTP. Builds aerobic engine at sub-threshold pacing. Coggan Zone 3 training.','power','endurance','moderate',true,60,60,ARRAY['z3','tempo','continuous','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',2400,'power',79),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Z2 Long Ride (150 min)','Extended 2.5-hour aerobic base ride. Maximum aerobic volume session at 60-68% FTP. Best performed fasted for metabolic adaptation.','power','endurance','moderate',true,150,90,ARRAY['z2','long','volume','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',7800,'power',63),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance with Tempo Pickups (90 min)','Base ride with 4x5-minute tempo surges at 82% FTP inserted into Z2. Introduces metabolic flexibility into otherwise purely aerobic session.','power','endurance','moderate',true,90,70,ARRAY['z2','tempo-pickups','mixed','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',600,'power',62),(w,3,'interval','time',300,'power',82),(w,4,'steady','time',600,'power',62),(w,5,'interval','time',300,'power',82),(w,6,'steady','time',600,'power',62),(w,7,'interval','time',300,'power',82),(w,8,'steady','time',600,'power',62),(w,9,'interval','time',300,'power',82),(w,10,'steady','time',600,'power',62),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Pyramid (45/60/45 min blocks)','Progressive aerobic effort building from low to mid Z2 then returning. Tests aerobic stability across duration changes.','power','endurance','moderate',true,90,63,ARRAY['pyramid','z2','aerobic','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1200,'power',60),(w,3,'steady','time',1200,'power',65),(w,4,'steady','time',1200,'power',60),(w,5,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Muscular Endurance Tempo 3x15 min','Three 15-minute blocks at 76-84% FTP building muscular endurance. Friel ME protocol.','power','endurance','hard',true,80,80,ARRAY['muscular-endurance','tempo','3x15','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',900,'power',80),(w,3,'recovery','time',300,'power',60),(w,4,'steady','time',900,'power',80),(w,5,'recovery','time',300,'power',60),(w,6,'steady','time',900,'power',80),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Zone 2 Intervals (4x15 min)','Four 15-minute Z2 blocks with 5-minute active recoveries. Maintains aerobic signal while adding structural variation.','power','endurance','easy',true,90,54,ARRAY['z2','intervals','aerobic','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',900,'power',63),(w,3,'recovery','time',300,'power',50),(w,4,'steady','time',900,'power',63),(w,5,'recovery','time',300,'power',50),(w,6,'steady','time',900,'power',63),(w,7,'recovery','time',300,'power',50),(w,8,'steady','time',900,'power',63),(w,9,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Endurance-Tempo Blend (2 hr)','2-hour ride spending 70% in Z2 and 30% in Z3. Foundation block for competitive endurance athletes.','power','endurance','moderate',true,120,84,ARRAY['z2','z3','blend','endurance','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',2400,'power',62),(w,3,'steady','time',1200,'power',78),(w,4,'steady','time',1200,'power',62),(w,5,'steady','time',600,'power',78),(w,6,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Openers Activation (30 min)','Short pre-race day activation ride with short intensity openers. Prepares neuromuscular and cardiovascular systems for competition the following day.','power','recovery','easy',true,30,20,ARRAY['openers','activation','pre-race','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',30,'power',130),(w,3,'recovery','time',120,'power',50),(w,4,'interval','time',30,'power',130),(w,5,'recovery','time',120,'power',50),(w,6,'interval','time',30,'power',130),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Base Building Block Week 1 (75 min)','First session of base-building block. Conservative Z2 effort establishing training rhythm and baseline aerobic conditioning.','power','endurance','easy',true,75,45,ARRAY['base-building','week1','z2','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',3300,'power',61),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aerobic Power Intervals 5x8 min','Five 8-minute blocks at 88-90% FTP. Aerobic power development at maximal aerobic conditioning zone.','power','endurance','hard',true,85,82,ARRAY['aerobic-power','5x8','88pct','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',480,'power',89),(w,3,'recovery','time',240,'power',55),(w,4,'interval','time',480,'power',89),(w,5,'recovery','time',240,'power',55),(w,6,'interval','time',480,'power',89),(w,7,'recovery','time',240,'power',55),(w,8,'interval','time',480,'power',89),(w,9,'recovery','time',240,'power',55),(w,10,'interval','time',480,'power',89),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot 3x20 min','Three 20-minute sweet spot blocks at 88-93% FTP. High-volume sub-threshold training for maximum aerobic adaptations. Classic TrainingPeaks protocol adapted to Banister metrics.','power','threshold','hard',true,100,100,ARRAY['sweet-spot','3x20','sst','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',1200,'power',91),(w,3,'recovery','time',300,'power',60),(w,4,'interval','time',1200,'power',91),(w,5,'recovery','time',300,'power',60),(w,6,'interval','time',1200,'power',91),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Sweet Spot Over-Unders 4x12 min','Four 12-minute blocks alternating 90% FTP and 96% FTP within each block. Refines metabolic control at sweet spot boundary.','power','threshold','hard',true,85,88,ARRAY['sweet-spot','over-under','4x12','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',360,'power',90),(w,3,'interval','time',360,'power',96),(w,4,'recovery','time',300,'power',60),(w,5,'interval','time',360,'power',90),(w,6,'interval','time',360,'power',96),(w,7,'recovery','time',300,'power',60),(w,8,'interval','time',360,'power',90),(w,9,'interval','time',360,'power',96),(w,10,'recovery','time',300,'power',60),(w,11,'interval','time',360,'power',90),(w,12,'interval','time',360,'power',96),(w,13,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Race Simulation Endurance (3 hr)','Three-hour simulation of race pacing conditions: steady base with 4 threshold surges simulating attack responses.','power','endurance','very_hard',true,180,126,ARRAY['race-simulation','long','threshold-surges','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',2400,'power',62),(w,3,'interval','time',300,'power',100),(w,4,'steady','time',1800,'power',65),(w,5,'interval','time',300,'power',100),(w,6,'steady','time',1800,'power',65),(w,7,'interval','time',300,'power',100),(w,8,'steady','time',1800,'power',65),(w,9,'interval','time',300,'power',100),(w,10,'steady','time',1800,'power',65),(w,11,'cooldown','time',600,'power',50);

-- ==================================================================
-- THRESHOLD — POWER (18 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold 2x20 min','Two 20-minute threshold blocks at 95-100% FTP. Classic threshold volume accumulation session. Allen and Coggan gold standard.','power','threshold','hard',true,65,78,ARRAY['threshold','2x20','FTP','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',1200,'power',97),(w,3,'recovery','time',300,'power',55),(w,4,'interval','time',1200,'power',97),(w,5,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold 30 min Continuous','Thirty-minute unbroken threshold effort at 96-100% FTP. More demanding than split intervals due to removal of rest benefit.','power','threshold','very_hard',true,55,70,ARRAY['threshold','30min','continuous','FTP','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1800,'power',98),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold 5x8 min','Five shorter threshold blocks allowing higher quality sustained output. Good entry-level threshold protocol for athletes new to structured training.','power','threshold','hard',true,75,76,ARRAY['threshold','5x8','FTP','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',480,'power',97),(w,3,'recovery','time',300,'power',55),(w,4,'interval','time',480,'power',97),(w,5,'recovery','time',300,'power',55),(w,6,'interval','time',480,'power',97),(w,7,'recovery','time',300,'power',55),(w,8,'interval','time',480,'power',97),(w,9,'recovery','time',300,'power',55),(w,10,'interval','time',480,'power',97),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','FTP Progressive Build 20 min','Progressive 20-minute effort starting at 90% FTP and climbing to 103% in the final 5 minutes. Trains pacing strategy and threshold ceiling.','power','threshold','hard',true,45,55,ARRAY['threshold','progressive','FTP-build','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',300,'power',90),(w,3,'steady','time',300,'power',94),(w,4,'steady','time',300,'power',97),(w,5,'steady','time',300,'power',100),(w,6,'steady','time',300,'power',103),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Micro-Burst Threshold 3x(8x1min)','Three sets of 8 one-minute efforts at 110% FTP with 30s recovery. Accumulates threshold-zone lactate while maintaining sustained power output. Seiler-inspired microburst protocol.','power','threshold','very_hard',true,75,85,ARRAY['microburst','threshold','3x8','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',60,'power',110),(w,3,'recovery','time',30,'power',55),(w,4,'interval','time',60,'power',110),(w,5,'recovery','time',30,'power',55),(w,6,'interval','time',60,'power',110),(w,7,'recovery','time',30,'power',55),(w,8,'interval','time',60,'power',110),(w,9,'recovery','time',30,'power',55),(w,10,'interval','time',60,'power',110),(w,11,'recovery','time',30,'power',55),(w,12,'interval','time',60,'power',110),(w,13,'recovery','time',30,'power',55),(w,14,'interval','time',60,'power',110),(w,15,'recovery','time',30,'power',55),(w,16,'interval','time',60,'power',110),(w,17,'recovery','time',300,'power',55),(w,18,'interval','time',60,'power',110),(w,19,'recovery','time',30,'power',55),(w,20,'interval','time',60,'power',110),(w,21,'recovery','time',30,'power',55),(w,22,'interval','time',60,'power',110),(w,23,'recovery','time',30,'power',55),(w,24,'interval','time',60,'power',110),(w,25,'recovery','time',30,'power',55),(w,26,'interval','time',60,'power',110),(w,27,'recovery','time',30,'power',55),(w,28,'interval','time',60,'power',110),(w,29,'recovery','time',30,'power',55),(w,30,'interval','time',60,'power',110),(w,31,'recovery','time',30,'power',55),(w,32,'interval','time',60,'power',110),(w,33,'recovery','time',300,'power',55),(w,34,'interval','time',60,'power',110),(w,35,'recovery','time',30,'power',55),(w,36,'interval','time',60,'power',110),(w,37,'recovery','time',30,'power',55),(w,38,'interval','time',60,'power',110),(w,39,'recovery','time',30,'power',55),(w,40,'interval','time',60,'power',110),(w,41,'recovery','time',30,'power',55),(w,42,'interval','time',60,'power',110),(w,43,'recovery','time',30,'power',55),(w,44,'interval','time',60,'power',110),(w,45,'recovery','time',30,'power',55),(w,46,'interval','time',60,'power',110),(w,47,'recovery','time',30,'power',55),(w,48,'interval','time',60,'power',110),(w,49,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Ladder 5/10/15/10/5 min','Ascending-descending threshold ladder with equal rest between each block. Tests threshold pacing across varied durations.','power','threshold','hard',true,90,88,ARRAY['threshold','ladder','ascending','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',300,'power',97),(w,3,'recovery','time',300,'power',55),(w,4,'interval','time',600,'power',97),(w,5,'recovery','time',300,'power',55),(w,6,'interval','time',900,'power',97),(w,7,'recovery','time',300,'power',55),(w,8,'interval','time',600,'power',97),(w,9,'recovery','time',300,'power',55),(w,10,'interval','time',300,'power',97),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Aerobic Combination (90 min)','90-minute session combining threshold work (2x10 min) within an endurance ride. Reflects race conditions where surges occur during long efforts.','power','threshold','moderate',true,90,78,ARRAY['threshold','combination','90min','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1800,'power',65),(w,3,'interval','time',600,'power',97),(w,4,'steady','time',1200,'power',65),(w,5,'interval','time',600,'power',97),(w,6,'steady','time',1200,'power',65),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','ITT Pacing Protocol 40 min','Individual time trial simulation at 97-103% FTP. 40 minutes negative-split: first 20 min at 97%, last 20 min at 102%.','power','threshold','very_hard',true,55,75,ARRAY['ITT','time-trial','pacing','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1200,'power',97),(w,3,'steady','time',1200,'power',102),(w,4,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Crit Simulation (3x10 min)','Three 10-minute threshold efforts with surge responses: 2x15s sprint to 130% FTP embedded in each block. Simulates criterium surge-recover demands.','power','threshold','very_hard',true,75,80,ARRAY['threshold','criterium','surge','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',240,'power',97),(w,3,'interval','time',15,'power',130),(w,4,'steady','time',225,'power',97),(w,5,'interval','time',15,'power',130),(w,6,'steady','time',105,'power',97),(w,7,'recovery','time',300,'power',55),(w,8,'steady','time',240,'power',97),(w,9,'interval','time',15,'power',130),(w,10,'steady','time',225,'power',97),(w,11,'interval','time',15,'power',130),(w,12,'steady','time',105,'power',97),(w,13,'recovery','time',300,'power',55),(w,14,'steady','time',240,'power',97),(w,15,'interval','time',15,'power',130),(w,16,'steady','time',225,'power',97),(w,17,'interval','time',15,'power',130),(w,18,'steady','time',105,'power',97),(w,19,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','3x30 min Sweet Spot w/ Cadence Focus','Three 30-minute sweet spot blocks with deliberate high-cadence (95+ rpm) requirement. Combines neuromuscular efficiency with metabolic adaptation.','power','threshold','hard',true,120,110,ARRAY['sweet-spot','3x30','cadence','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',1800,'power',90),(w,3,'recovery','time',300,'power',60),(w,4,'interval','time',1800,'power',90),(w,5,'recovery','time',300,'power',60),(w,6,'interval','time',1800,'power',90),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Extended Sweet Spot 60 min','Single unbroken 60-minute sweet spot effort at 88-93% FTP. Advanced muscular endurance development.','power','threshold','very_hard',true,80,90,ARRAY['sweet-spot','60min','muscular-endurance','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',3600,'power',91),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Plyometric Combo','Threshold intervals with embedded 10-second sprint outs (neuromuscular recruitment during fatigue). Classic Van der Zwaard et al. combo protocol.','power','threshold','very_hard',true,65,78,ARRAY['threshold','sprint-outs','plyometric','combo','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',600,'power',97),(w,3,'interval','time',10,'power',160),(w,4,'steady','time',590,'power',97),(w,5,'interval','time',10,'power',160),(w,6,'steady','time',200,'power',97),(w,7,'recovery','time',300,'power',55),(w,8,'steady','time',600,'power',97),(w,9,'interval','time',10,'power',160),(w,10,'steady','time',590,'power',97),(w,11,'interval','time',10,'power',160),(w,12,'steady','time',200,'power',97),(w,13,'recovery','time',300,'power',55),(w,14,'steady','time',600,'power',97),(w,15,'interval','time',10,'power',160),(w,16,'steady','time',590,'power',97),(w,17,'interval','time',10,'power',160),(w,18,'steady','time',200,'power',97),(w,19,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold with Descending Rest 4x10','Four 10-minute threshold efforts with descending recovery: 5min, 4min, 3min, 2min. Progressive overload on lactate clearance system.','power','threshold','very_hard',true,75,80,ARRAY['threshold','descending-rest','4x10','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',600,'power',97),(w,3,'recovery','time',300,'power',55),(w,4,'interval','time',600,'power',97),(w,5,'recovery','time',240,'power',55),(w,6,'interval','time',600,'power',97),(w,7,'recovery','time',180,'power',55),(w,8,'interval','time',600,'power',97),(w,9,'recovery','time',120,'power',55),(w,10,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','60-min Steady State Test','One-hour maximum sustainable effort. True best-effort 60-minute test for direct FTP calculation. Reference: Burnley & Jones 2018.','power','threshold','very_hard',true,75,100,ARRAY['test','60min','FTP','steady-state','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'steady','time',3600,'power',100),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Ramp Test (1 min increments)','One-minute ramp test for rapid FTP estimation. Start at 50% FTP, increase 6% per minute until failure. FTP = 75% of peak 1-min power.','power','threshold','very_hard',true,35,40,ARRAY['ramp','test','FTP','1min','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',50),(w,2,'steady','time',60,'power',50),(w,3,'steady','time',60,'power',56),(w,4,'steady','time',60,'power',62),(w,5,'steady','time',60,'power',68),(w,6,'steady','time',60,'power',74),(w,7,'steady','time',60,'power',80),(w,8,'steady','time',60,'power',86),(w,9,'steady','time',60,'power',92),(w,10,'steady','time',60,'power',98),(w,11,'steady','time',60,'power',104),(w,12,'steady','time',60,'power',110),(w,13,'steady','time',60,'power',116),(w,14,'steady','time',60,'power',122),(w,15,'cooldown','time',300,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Threshold Descending Intervals 20/15/10/5','Descending threshold block sizes: 20, 15, 10, 5 minutes with equal recovery. Teaches threshold pacing under accumulating fatigue.','power','threshold','hard',true,90,85,ARRAY['threshold','descending','4x','ladder','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',1200,'power',97),(w,3,'recovery','time',360,'power',55),(w,4,'interval','time',900,'power',97),(w,5,'recovery','time',270,'power',55),(w,6,'interval','time',600,'power',97),(w,7,'recovery','time',180,'power',55),(w,8,'interval','time',300,'power',97),(w,9,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','L4 Block 3x20 Ascending Power','Three 20-minute threshold efforts with slight power increase: 92%, 95%, 98% FTP. Develops ability to execute negative-split threshold pacing.','power','threshold','hard',true,100,96,ARRAY['threshold','3x20','ascending','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',1200,'power',92),(w,3,'recovery','time',300,'power',55),(w,4,'interval','time',1200,'power',95),(w,5,'recovery','time',300,'power',55),(w,6,'interval','time',1200,'power',98),(w,7,'cooldown','time',600,'power',50);

-- ==================================================================
-- VO2MAX — POWER (18 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Billat 30/30 VO2max (12 min sets x3)','30 seconds at 130% FTP / 30 seconds at 60% FTP. Billat''s landmark VO2max interval protocol. Three 12-minute sets with 5-min inter-set recovery.','power','vo2max','hard',true,65,72,ARRAY['billat','30-30','vo2max','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',30,'power',130),(w,3,'recovery','time',30,'power',60),(w,4,'interval','time',30,'power',130),(w,5,'recovery','time',30,'power',60),(w,6,'interval','time',30,'power',130),(w,7,'recovery','time',30,'power',60),(w,8,'interval','time',30,'power',130),(w,9,'recovery','time',30,'power',60),(w,10,'interval','time',30,'power',130),(w,11,'recovery','time',30,'power',60),(w,12,'interval','time',30,'power',130),(w,13,'recovery','time',30,'power',60),(w,14,'interval','time',30,'power',130),(w,15,'recovery','time',30,'power',60),(w,16,'interval','time',30,'power',130),(w,17,'recovery','time',30,'power',60),(w,18,'interval','time',30,'power',130),(w,19,'recovery','time',30,'power',60),(w,20,'interval','time',30,'power',130),(w,21,'recovery','time',30,'power',60),(w,22,'interval','time',30,'power',130),(w,23,'recovery','time',30,'power',60),(w,24,'interval','time',30,'power',130),(w,25,'recovery','time',300,'power',55),(w,26,'interval','time',30,'power',130),(w,27,'recovery','time',30,'power',60),(w,28,'interval','time',30,'power',130),(w,29,'recovery','time',30,'power',60),(w,30,'interval','time',30,'power',130),(w,31,'recovery','time',30,'power',60),(w,32,'interval','time',30,'power',130),(w,33,'recovery','time',30,'power',60),(w,34,'interval','time',30,'power',130),(w,35,'recovery','time',30,'power',60),(w,36,'interval','time',30,'power',130),(w,37,'recovery','time',30,'power',60),(w,38,'interval','time',30,'power',130),(w,39,'recovery','time',30,'power',60),(w,40,'interval','time',30,'power',130),(w,41,'recovery','time',30,'power',60),(w,42,'interval','time',30,'power',130),(w,43,'recovery','time',30,'power',60),(w,44,'interval','time',30,'power',130),(w,45,'recovery','time',300,'power',55),(w,46,'interval','time',30,'power',130),(w,47,'recovery','time',30,'power',60),(w,48,'interval','time',30,'power',130),(w,49,'recovery','time',30,'power',60),(w,50,'interval','time',30,'power',130),(w,51,'recovery','time',30,'power',60),(w,52,'interval','time',30,'power',130),(w,53,'recovery','time',30,'power',60),(w,54,'interval','time',30,'power',130),(w,55,'recovery','time',30,'power',60),(w,56,'interval','time',30,'power',130),(w,57,'recovery','time',30,'power',60),(w,58,'interval','time',30,'power',130),(w,59,'recovery','time',30,'power',60),(w,60,'interval','time',30,'power',130),(w,61,'recovery','time',30,'power',60),(w,62,'interval','time',30,'power',130),(w,63,'recovery','time',30,'power',60),(w,64,'interval','time',30,'power',130),(w,65,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Crisscross VO2max 3x7 min','Three 7-minute efforts at 105-120% FTP using zigzag pattern through VO2max range. Maximizes time at VO2max with varied stimulus to prevent adaptation plateau.','power','vo2max','hard',true,60,68,ARRAY['crisscross','vo2max','3x7','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',60,'power',105),(w,3,'interval','time',60,'power',115),(w,4,'interval','time',60,'power',108),(w,5,'interval','time',60,'power',120),(w,6,'interval','time',60,'power',110),(w,7,'interval','time',60,'power',118),(w,8,'interval','time',60,'power',112),(w,9,'recovery','time',300,'power',50),(w,10,'interval','time',60,'power',105),(w,11,'interval','time',60,'power',115),(w,12,'interval','time',60,'power',108),(w,13,'interval','time',60,'power',120),(w,14,'interval','time',60,'power',110),(w,15,'interval','time',60,'power',118),(w,16,'interval','time',60,'power',112),(w,17,'recovery','time',300,'power',50),(w,18,'interval','time',60,'power',105),(w,19,'interval','time',60,'power',115),(w,20,'interval','time',60,'power',108),(w,21,'interval','time',60,'power',120),(w,22,'interval','time',60,'power',110),(w,23,'interval','time',60,'power',118),(w,24,'interval','time',60,'power',112),(w,25,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max 2x8 min (Long)','Two 8-minute VO2max efforts at 108-114% FTP. Longer duration maximizes VO2 ceiling exposure. Reference: Laursen & Jenkins 2002 SMPR.','power','vo2max','very_hard',true,50,60,ARRAY['vo2max','2x8','long','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',480,'power',111),(w,3,'recovery','time',480,'power',50),(w,4,'interval','time',480,'power',111),(w,5,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Gibala Sprint Intervals 6x1min','Wingate-derived 60-second all-out efforts with 4-minute recoveries. Gibala et al. 2006 landmark SIT protocol inducing VO2max adaptations in 6 sessions.','power','vo2max','very_hard',true,40,48,ARRAY['gibala','SIT','all-out','vo2max','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',60,'power',160),(w,3,'recovery','time',240,'power',45),(w,4,'interval','time',60,'power',160),(w,5,'recovery','time',240,'power',45),(w,6,'interval','time',60,'power',160),(w,7,'recovery','time',240,'power',45),(w,8,'interval','time',60,'power',160),(w,9,'recovery','time',240,'power',45),(w,10,'interval','time',60,'power',160),(w,11,'recovery','time',240,'power',45),(w,12,'interval','time',60,'power',160),(w,13,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Pyramid 2/3/4/3/2 min','Ascending-descending VO2max pyramid. Allows progressive engagement of maximal oxygen consumption across varying interval lengths.','power','vo2max','very_hard',true,55,65,ARRAY['vo2max','pyramid','2-3-4','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',120,'power',115),(w,3,'recovery','time',120,'power',50),(w,4,'interval','time',180,'power',113),(w,5,'recovery','time',180,'power',50),(w,6,'interval','time',240,'power',111),(w,7,'recovery','time',240,'power',50),(w,8,'interval','time',180,'power',113),(w,9,'recovery','time',180,'power',50),(w,10,'interval','time',120,'power',115),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Power Test — 5 min Max','Maximal 5-minute all-out effort for MAP (Maximal Aerobic Power) measurement. Gold standard MAP test. Used for zone prescription and physiological assessment.','power','vo2max','very_hard',true,30,38,ARRAY['test','MAP','5min-max','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',300,'power',130),(w,3,'recovery','time',300,'power',50),(w,4,'interval','time',300,'power',150),(w,5,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Tolerated Intensity VO2max 4x4 min','Norwegian 4x4 protocol adapted to cycling. Four 4-minute intervals at 106-110% FTP with 3-minute recoveries. Wisloff et al. research foundation.','power','vo2max','very_hard',true,55,66,ARRAY['4x4','norwegian','vo2max','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',240,'power',108),(w,3,'recovery','time',180,'power',50),(w,4,'interval','time',240,'power',108),(w,5,'recovery','time',180,'power',50),(w,6,'interval','time',240,'power',108),(w,7,'recovery','time',180,'power',50),(w,8,'interval','time',240,'power',108),(w,9,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Cluster Sets 3x(3x2min)','Three clusters of three 2-minute efforts separated by 2-min within-cluster rest and 5-min between-cluster rest. Cluster set method for high-quality VO2max exposures.','power','vo2max','hard',true,65,70,ARRAY['cluster-sets','vo2max','3x3','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',120,'power',115),(w,3,'recovery','time',120,'power',50),(w,4,'interval','time',120,'power',115),(w,5,'recovery','time',120,'power',50),(w,6,'interval','time',120,'power',115),(w,7,'recovery','time',300,'power',50),(w,8,'interval','time',120,'power',115),(w,9,'recovery','time',120,'power',50),(w,10,'interval','time',120,'power',115),(w,11,'recovery','time',120,'power',50),(w,12,'interval','time',120,'power',115),(w,13,'recovery','time',300,'power',50),(w,14,'interval','time',120,'power',115),(w,15,'recovery','time',120,'power',50),(w,16,'interval','time',120,'power',115),(w,17,'recovery','time',120,'power',50),(w,18,'interval','time',120,'power',115),(w,19,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','MAP Intervals 8x2 min','Eight 2-minute efforts at 115-120% FTP with equal recovery. High accumulation of supra-threshold work targeting maximal aerobic power ceiling.','power','vo2max','hard',true,60,68,ARRAY['MAP','8x2','115pct','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',120,'power',117),(w,3,'recovery','time',120,'power',50),(w,4,'interval','time',120,'power',117),(w,5,'recovery','time',120,'power',50),(w,6,'interval','time',120,'power',117),(w,7,'recovery','time',120,'power',50),(w,8,'interval','time',120,'power',117),(w,9,'recovery','time',120,'power',50),(w,10,'interval','time',120,'power',117),(w,11,'recovery','time',120,'power',50),(w,12,'interval','time',120,'power',117),(w,13,'recovery','time',120,'power',50),(w,14,'interval','time',120,'power',117),(w,15,'recovery','time',120,'power',50),(w,16,'interval','time',120,'power',117),(w,17,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','High-Low VO2max Alternations 5x6 min','Six-minute efforts alternating between 105% and 120% FTP every 90 seconds. Exploits cardiac inertia to spend more time at VO2max. Reference: Ferguson et al. 2013.','power','vo2max','very_hard',true,70,80,ARRAY['high-low','vo2max','alternation','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',90,'power',105),(w,3,'interval','time',90,'power',120),(w,4,'interval','time',90,'power',105),(w,5,'interval','time',90,'power',120),(w,6,'recovery','time',300,'power',50),(w,7,'interval','time',90,'power',105),(w,8,'interval','time',90,'power',120),(w,9,'interval','time',90,'power',105),(w,10,'interval','time',90,'power',120),(w,11,'recovery','time',300,'power',50),(w,12,'interval','time',90,'power',105),(w,13,'interval','time',90,'power',120),(w,14,'interval','time',90,'power',105),(w,15,'interval','time',90,'power',120),(w,16,'recovery','time',300,'power',50),(w,17,'interval','time',90,'power',105),(w,18,'interval','time',90,'power',120),(w,19,'interval','time',90,'power',105),(w,20,'interval','time',90,'power',120),(w,21,'recovery','time',300,'power',50),(w,22,'interval','time',90,'power',105),(w,23,'interval','time',90,'power',120),(w,24,'interval','time',90,'power',105),(w,25,'interval','time',90,'power',120),(w,26,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Seiler 4x8 min VO2max','Seiler polarized training: four 8-minute efforts at HIT zone (106-110% FTP) with full 2:1 recovery ratio. Paradigmatic high-intensity polarized training session.','power','vo2max','hard',true,80,85,ARRAY['seiler','4x8','polarized','vo2max','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',480,'power',108),(w,3,'recovery','time',960,'power',50),(w,4,'interval','time',480,'power',108),(w,5,'recovery','time',960,'power',50),(w,6,'interval','time',480,'power',108),(w,7,'recovery','time',960,'power',50),(w,8,'interval','time',480,'power',108),(w,9,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Aerobic Capacity Maximal Test','Graded exercise test to VO2max exhaustion. Classic incremental protocol from 100W to maximal sustained output. Used in lab and field assessment.','power','vo2max','very_hard',true,40,55,ARRAY['GXT','test','vo2max','capacity','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',50),(w,2,'steady','time',180,'power',65),(w,3,'steady','time',180,'power',75),(w,4,'steady','time',180,'power',85),(w,5,'steady','time',180,'power',95),(w,6,'steady','time',180,'power',105),(w,7,'steady','time',180,'power',115),(w,8,'steady','time',180,'power',125),(w,9,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Development Block 3x5 min','Three 5-minute VO2max intervals at 108-115% FTP. Standard intermediate protocol for VO2max development between 30-30 and longer intervals.','power','vo2max','hard',true,55,62,ARRAY['vo2max','3x5','development','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',300,'power',112),(w,3,'recovery','time',300,'power',50),(w,4,'interval','time',300,'power',112),(w,5,'recovery','time',300,'power',50),(w,6,'interval','time',300,'power',112),(w,7,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Supra-Threshold Capacity 5x4 min','Five 4-minute efforts at 110-115% FTP. Targets anaerobic capacity while maintaining aerobic ceiling. Higher repetitions than traditional VO2max for greater volume.','power','vo2max','hard',true,65,72,ARRAY['supra-threshold','5x4','capacity','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',55),(w,2,'interval','time',240,'power',112),(w,3,'recovery','time',240,'power',50),(w,4,'interval','time',240,'power',112),(w,5,'recovery','time',240,'power',50),(w,6,'interval','time',240,'power',112),(w,7,'recovery','time',240,'power',50),(w,8,'interval','time',240,'power',112),(w,9,'recovery','time',240,'power',50),(w,10,'interval','time',240,'power',112),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','VO2max Blocks with Aerobic Primer','Short VO2max blocks preceded by 20-minute aerobic primer to pre-fatigue aerobic system and enhance VO2 kinetics. Reference: Burnley et al. 2011 priming effect.','power','vo2max','very_hard',true,65,75,ARRAY['vo2max','aerobic-primer','priming','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1200,'power',75),(w,3,'recovery','time',600,'power',50),(w,4,'interval','time',180,'power',115),(w,5,'recovery','time',180,'power',50),(w,6,'interval','time',180,'power',115),(w,7,'recovery','time',180,'power',50),(w,8,'interval','time',180,'power',115),(w,9,'recovery','time',180,'power',50),(w,10,'interval','time',180,'power',115),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','HIIT 10x1min with 2min Rest','Ten 1-minute all-out intervals with 2 minutes active rest. High total anaerobic work volume. Reference: Little et al. HIIT meta-analysis.','power','vo2max','very_hard',true,50,58,ARRAY['HIIT','10x1','vo2max','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',60,'power',150),(w,3,'recovery','time',120,'power',50),(w,4,'interval','time',60,'power',150),(w,5,'recovery','time',120,'power',50),(w,6,'interval','time',60,'power',150),(w,7,'recovery','time',120,'power',50),(w,8,'interval','time',60,'power',150),(w,9,'recovery','time',120,'power',50),(w,10,'interval','time',60,'power',150),(w,11,'recovery','time',120,'power',50),(w,12,'interval','time',60,'power',150),(w,13,'recovery','time',120,'power',50),(w,14,'interval','time',60,'power',150),(w,15,'recovery','time',120,'power',50),(w,16,'interval','time',60,'power',150),(w,17,'recovery','time',120,'power',50),(w,18,'interval','time',60,'power',150),(w,19,'recovery','time',120,'power',50),(w,20,'interval','time',60,'power',150),(w,21,'cooldown','time',600,'power',50);

-- ==================================================================
-- SPRINT / ANAEROBIC — POWER (12 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Alactic Power Sprints 10x6s','Ten maximal 6-second sprints targeting peak alactic ATP-PCr system. Full 5-minute rest between sprints for complete phosphocreatine resynthesis.','power','sprint','hard',true,60,28,ARRAY['alactic','6s','PCr','sprint','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',60),(w,2,'interval','time',6,'power',250),(w,3,'recovery','time',294,'power',45),(w,4,'interval','time',6,'power',250),(w,5,'recovery','time',294,'power',45),(w,6,'interval','time',6,'power',250),(w,7,'recovery','time',294,'power',45),(w,8,'interval','time',6,'power',250),(w,9,'recovery','time',294,'power',45),(w,10,'interval','time',6,'power',250),(w,11,'recovery','time',294,'power',45),(w,12,'interval','time',6,'power',250),(w,13,'recovery','time',294,'power',45),(w,14,'interval','time',6,'power',250),(w,15,'recovery','time',294,'power',45),(w,16,'interval','time',6,'power',250),(w,17,'recovery','time',294,'power',45),(w,18,'interval','time',6,'power',250),(w,19,'recovery','time',294,'power',45),(w,20,'interval','time',6,'power',250),(w,21,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Standing Start Power (5x30s)','Five maximal 30-second efforts from a standing start at 180%+ FTP. Simulates race-start neuromuscular demands. Targets peak anaerobic power output.','power','sprint','very_hard',true,35,30,ARRAY['standing-start','30s','anaerobic','sprint','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',60),(w,2,'interval','time',30,'power',185),(w,3,'recovery','time',570,'power',45),(w,4,'interval','time',30,'power',185),(w,5,'recovery','time',570,'power',45),(w,6,'interval','time',30,'power',185),(w,7,'recovery','time',570,'power',45),(w,8,'interval','time',30,'power',185),(w,9,'recovery','time',570,'power',45),(w,10,'interval','time',30,'power',185),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Repeated Sprint Fatigue 6x15s','Six 15-second maximal sprints with only 45 seconds rest. Tests anaerobic fatigue resistance. Decline in peak power across efforts is a valid measure of anaerobic capacity.','power','sprint','very_hard',true,30,32,ARRAY['repeated-sprint','fatigue','6x15s','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',15,'power',200),(w,3,'recovery','time',45,'power',45),(w,4,'interval','time',15,'power',200),(w,5,'recovery','time',45,'power',45),(w,6,'interval','time',15,'power',200),(w,7,'recovery','time',45,'power',45),(w,8,'interval','time',15,'power',200),(w,9,'recovery','time',45,'power',45),(w,10,'interval','time',15,'power',200),(w,11,'recovery','time',45,'power',45),(w,12,'interval','time',15,'power',200),(w,13,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Match Burning Simulation 5x20s','Five 20-second maximal sprint-recovery sequences simulating competition match burning. Trains glycolytic power in specific race context.','power','sprint','very_hard',true,40,35,ARRAY['match-burning','20s','race-specific','sprint','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'steady','time',600,'power',62),(w,3,'interval','time',20,'power',190),(w,4,'recovery','time',100,'power',50),(w,5,'interval','time',20,'power',190),(w,6,'recovery','time',100,'power',50),(w,7,'interval','time',20,'power',190),(w,8,'recovery','time',100,'power',50),(w,9,'interval','time',20,'power',190),(w,10,'recovery','time',100,'power',50),(w,11,'interval','time',20,'power',190),(w,12,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Anaerobic Capacity Test — 3min Max','Three-minute maximal all-out effort for Anaerobic Capacity Estimation. Vanhatalo et al. 2007 critical power 3-min test. Yields W'' (anaerobic reserve) estimation.','power','sprint','very_hard',true,25,32,ARRAY['test','3min-max','W-prime','anaerobic-capacity','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',180,'power',160),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Rolling Sprint Series 8x30s','Eight rolling 30-second sprints on brief descent profile. Exploits gravitational assistance to reach higher absolute power values for neuromuscular development.','power','sprint','hard',true,55,42,ARRAY['rolling-sprint','8x30s','downhill','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',60),(w,2,'interval','time',30,'power',175),(w,3,'recovery','time',270,'power',50),(w,4,'interval','time',30,'power',175),(w,5,'recovery','time',270,'power',50),(w,6,'interval','time',30,'power',175),(w,7,'recovery','time',270,'power',50),(w,8,'interval','time',30,'power',175),(w,9,'recovery','time',270,'power',50),(w,10,'interval','time',30,'power',175),(w,11,'recovery','time',270,'power',50),(w,12,'interval','time',30,'power',175),(w,13,'recovery','time',270,'power',50),(w,14,'interval','time',30,'power',175),(w,15,'recovery','time',270,'power',50),(w,16,'interval','time',30,'power',175),(w,17,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Peak Power Seated vs Standing Comparison','Five seated + five standing 10s sprints with measurement comparison. Tests sprint power generation in two different neuromuscular positions.','power','sprint','hard',true,50,35,ARRAY['peak-power','seated','standing','neuromuscular','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',60),(w,2,'interval','time',10,'power',200),(w,3,'recovery','time',350,'power',45),(w,4,'interval','time',10,'power',200),(w,5,'recovery','time',350,'power',45),(w,6,'interval','time',10,'power',200),(w,7,'recovery','time',350,'power',45),(w,8,'interval','time',10,'power',200),(w,9,'recovery','time',350,'power',45),(w,10,'interval','time',10,'power',200),(w,11,'recovery','time',300,'power',45),(w,12,'interval','time',10,'power',220),(w,13,'recovery','time',350,'power',45),(w,14,'interval','time',10,'power',220),(w,15,'recovery','time',350,'power',45),(w,16,'interval','time',10,'power',220),(w,17,'recovery','time',350,'power',45),(w,18,'interval','time',10,'power',220),(w,19,'recovery','time',350,'power',45),(w,20,'interval','time',10,'power',220),(w,21,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Criterium Sprint Build 4x(5x10s)','Four sets of five 10-second sprint repetitions with 20s intra-set rest and 5-min inter-set rest. Simulates criterium final lap sprint demands.','power','sprint','hard',true,55,40,ARRAY['criterium','sprint-build','4x5x10s','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',60),(w,2,'interval','time',10,'power',210),(w,3,'recovery','time',20,'power',45),(w,4,'interval','time',10,'power',210),(w,5,'recovery','time',20,'power',45),(w,6,'interval','time',10,'power',210),(w,7,'recovery','time',20,'power',45),(w,8,'interval','time',10,'power',210),(w,9,'recovery','time',20,'power',45),(w,10,'interval','time',10,'power',210),(w,11,'recovery','time',300,'power',45),(w,12,'interval','time',10,'power',210),(w,13,'recovery','time',20,'power',45),(w,14,'interval','time',10,'power',210),(w,15,'recovery','time',20,'power',45),(w,16,'interval','time',10,'power',210),(w,17,'recovery','time',20,'power',45),(w,18,'interval','time',10,'power',210),(w,19,'recovery','time',20,'power',45),(w,20,'interval','time',10,'power',210),(w,21,'recovery','time',300,'power',45),(w,22,'interval','time',10,'power',210),(w,23,'recovery','time',20,'power',45),(w,24,'interval','time',10,'power',210),(w,25,'recovery','time',20,'power',45),(w,26,'interval','time',10,'power',210),(w,27,'recovery','time',20,'power',45),(w,28,'interval','time',10,'power',210),(w,29,'recovery','time',20,'power',45),(w,30,'interval','time',10,'power',210),(w,31,'recovery','time',300,'power',45),(w,32,'interval','time',10,'power',210),(w,33,'recovery','time',20,'power',45),(w,34,'interval','time',10,'power',210),(w,35,'recovery','time',20,'power',45),(w,36,'interval','time',10,'power',210),(w,37,'recovery','time',20,'power',45),(w,38,'interval','time',10,'power',210),(w,39,'recovery','time',20,'power',45),(w,40,'interval','time',10,'power',210),(w,41,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Wingate 30s All-Out Test','Classic Wingate Anaerobic Test adapted to cycling ergometer. 30-second maximal effort yielding peak power, mean power, fatigue index, and anaerobic work capacity.','power','sprint','very_hard',true,20,25,ARRAY['wingate','test','anaerobic','30s','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',30,'power',200),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Road Sprint Efforts 6x45s','Six 45-second maximal road sprint efforts targeting the junction of anaerobic and aerobic power systems. Used in cross-country and mountain biking preparation.','power','sprint','hard',true,45,40,ARRAY['road-sprint','45s','6x','anaerobic-aerobic','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',900,'power',60),(w,2,'interval','time',45,'power',155),(w,3,'recovery','time',315,'power',50),(w,4,'interval','time',45,'power',155),(w,5,'recovery','time',315,'power',50),(w,6,'interval','time',45,'power',155),(w,7,'recovery','time',315,'power',50),(w,8,'interval','time',45,'power',155),(w,9,'recovery','time',315,'power',50),(w,10,'interval','time',45,'power',155),(w,11,'recovery','time',315,'power',50),(w,12,'interval','time',45,'power',155),(w,13,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Explosive Power 3x(10x5s)','Three sets of ten ultra-short 5-second explosive maximal sprints targeting pure neuromuscular power and rate of force development. Complete intra-set rest.','power','sprint','hard',true,40,25,ARRAY['explosive','5s','neuromuscular','peak-force','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',5,'power',280),(w,3,'recovery','time',55,'power',45),(w,4,'interval','time',5,'power',280),(w,5,'recovery','time',55,'power',45),(w,6,'interval','time',5,'power',280),(w,7,'recovery','time',55,'power',45),(w,8,'interval','time',5,'power',280),(w,9,'recovery','time',55,'power',45),(w,10,'interval','time',5,'power',280),(w,11,'recovery','time',55,'power',45),(w,12,'interval','time',5,'power',280),(w,13,'recovery','time',55,'power',45),(w,14,'interval','time',5,'power',280),(w,15,'recovery','time',55,'power',45),(w,16,'interval','time',5,'power',280),(w,17,'recovery','time',55,'power',45),(w,18,'interval','time',5,'power',280),(w,19,'recovery','time',55,'power',45),(w,20,'interval','time',5,'power',280),(w,21,'recovery','time',300,'power',45),(w,22,'interval','time',5,'power',280),(w,23,'recovery','time',55,'power',45),(w,24,'interval','time',5,'power',280),(w,25,'recovery','time',55,'power',45),(w,26,'interval','time',5,'power',280),(w,27,'recovery','time',55,'power',45),(w,28,'interval','time',5,'power',280),(w,29,'recovery','time',55,'power',45),(w,30,'interval','time',5,'power',280),(w,31,'recovery','time',55,'power',45),(w,32,'interval','time',5,'power',280),(w,33,'recovery','time',55,'power',45),(w,34,'interval','time',5,'power',280),(w,35,'recovery','time',55,'power',45),(w,36,'interval','time',5,'power',280),(w,37,'recovery','time',55,'power',45),(w,38,'interval','time',5,'power',280),(w,39,'recovery','time',55,'power',45),(w,40,'interval','time',5,'power',280),(w,41,'recovery','time',300,'power',45),(w,42,'interval','time',5,'power',280),(w,43,'recovery','time',55,'power',45),(w,44,'interval','time',5,'power',280),(w,45,'recovery','time',55,'power',45),(w,46,'interval','time',5,'power',280),(w,47,'recovery','time',55,'power',45),(w,48,'interval','time',5,'power',280),(w,49,'recovery','time',55,'power',45),(w,50,'interval','time',5,'power',280),(w,51,'recovery','time',55,'power',45),(w,52,'interval','time',5,'power',280),(w,53,'recovery','time',55,'power',45),(w,54,'interval','time',5,'power',280),(w,55,'recovery','time',55,'power',45),(w,56,'interval','time',5,'power',280),(w,57,'recovery','time',55,'power',45),(w,58,'interval','time',5,'power',280),(w,59,'recovery','time',55,'power',45),(w,60,'interval','time',5,'power',280),(w,61,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Anaerobic Threshold Staircase 5x3min','Five 3-minute steps ascending from threshold to anaerobic capacity (97%, 105%, 115%, 125%, 135% FTP). Maps anaerobic response curve.','power','sprint','very_hard',true,50,58,ARRAY['staircase','ascending','anaerobic','threshold','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',180,'power',97),(w,3,'recovery','time',180,'power',50),(w,4,'interval','time',180,'power',105),(w,5,'recovery','time',180,'power',50),(w,6,'interval','time',180,'power',115),(w,7,'recovery','time',180,'power',50),(w,8,'interval','time',180,'power',125),(w,9,'recovery','time',180,'power',50),(w,10,'interval','time',180,'power',135),(w,11,'cooldown','time',600,'power',50);

-- ==================================================================
-- CADENCE / TECHNIQUE — POWER (10 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','One-Leg Pedaling Drills (30 min)','Alternating single-leg pedaling blocks to identify and correct pedaling dead spots. Improves force application symmetry and 360-degree stroke efficiency.','power','other','easy',true,30,18,ARRAY['one-leg','technique','pedaling','drill'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',300,'power',55),(w,2,'steady','time',60,'power',45),(w,3,'steady','time',60,'power',45),(w,4,'recovery','time',60,'power',55),(w,5,'steady','time',60,'power',45),(w,6,'steady','time',60,'power',45),(w,7,'recovery','time',60,'power',55),(w,8,'steady','time',60,'power',45),(w,9,'steady','time',60,'power',45),(w,10,'recovery','time',60,'power',55),(w,11,'steady','time',60,'power',45),(w,12,'steady','time',60,'power',45),(w,13,'cooldown','time',300,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Cadence Pyramid 60-70-80-90-100-90-80-70-60 rpm','Cadence pyramid forcing adaptation across full rpm range. Each cadence held for 5 minutes at constant moderate power. Neuromuscular range-of-motion training.','power','other','moderate',true,55,33,ARRAY['cadence','pyramid','rpm-range','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',300,'power',60),(w,3,'steady','time',300,'power',62),(w,4,'steady','time',300,'power',63),(w,5,'steady','time',300,'power',65),(w,6,'steady','time',300,'power',63),(w,7,'steady','time',300,'power',62),(w,8,'steady','time',300,'power',60),(w,9,'cooldown','time',300,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Aero Position Endurance (60 min)','60-minute aerobic ride held in full aero position. Trains positional adaptation and back musculature endurance for time trialists and triathletes.','power','endurance','moderate',true,60,36,ARRAY['aero','position','endurance','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',2400,'power',60),(w,3,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Pedaling Efficiency Test (30/30 at low cadence)','Alternating 30-second normal cadence vs 30-second low cadence (55 rpm) at identical power. Trains torque development and measures efficiency delta.','power','other','moderate',true,40,24,ARRAY['efficiency','low-cadence','torque','test'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',30,'power',75),(w,3,'steady','time',30,'power',75),(w,4,'steady','time',30,'power',75),(w,5,'steady','time',30,'power',75),(w,6,'steady','time',30,'power',75),(w,7,'steady','time',30,'power',75),(w,8,'steady','time',30,'power',75),(w,9,'steady','time',30,'power',75),(w,10,'steady','time',30,'power',75),(w,11,'steady','time',30,'power',75),(w,12,'recovery','time',300,'power',55),(w,13,'steady','time',30,'power',75),(w,14,'steady','time',30,'power',75),(w,15,'steady','time',30,'power',75),(w,16,'steady','time',30,'power',75),(w,17,'steady','time',30,'power',75),(w,18,'steady','time',30,'power',75),(w,19,'steady','time',30,'power',75),(w,20,'steady','time',30,'power',75),(w,21,'steady','time',30,'power',75),(w,22,'steady','time',30,'power',75),(w,23,'cooldown','time',300,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Big Gear Strength-Endurance (4x10 min)','Four 10-minute blocks at high resistance and low cadence (50-55 rpm) at moderate power. Strength-endurance specific to mountain pass climbing.','power','strength','moderate',true,70,52,ARRAY['big-gear','strength-endurance','climbing','low-cadence'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',600,'power',76),(w,3,'recovery','time',180,'power',60),(w,4,'steady','time',600,'power',76),(w,5,'recovery','time',180,'power',60),(w,6,'steady','time',600,'power',76),(w,7,'recovery','time',180,'power',60),(w,8,'steady','time',600,'power',76),(w,9,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Micro-Acceleration Drills (20x5s accelerations)','Twenty 5-second maximal accelerations from stable pedaling. Trains neuromuscular explosive engagement and acceleration mechanics essential for breakaway response.','power','sprint','easy',true,35,20,ARRAY['acceleration','drills','micro','neuromuscular'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',60),(w,2,'interval','time',5,'power',200),(w,3,'recovery','time',55,'power',55),(w,4,'interval','time',5,'power',200),(w,5,'recovery','time',55,'power',55),(w,6,'interval','time',5,'power',200),(w,7,'recovery','time',55,'power',55),(w,8,'interval','time',5,'power',200),(w,9,'recovery','time',55,'power',55),(w,10,'interval','time',5,'power',200),(w,11,'recovery','time',55,'power',55),(w,12,'interval','time',5,'power',200),(w,13,'recovery','time',55,'power',55),(w,14,'interval','time',5,'power',200),(w,15,'recovery','time',55,'power',55),(w,16,'interval','time',5,'power',200),(w,17,'recovery','time',55,'power',55),(w,18,'interval','time',5,'power',200),(w,19,'recovery','time',55,'power',55),(w,20,'interval','time',5,'power',200),(w,21,'cooldown','time',300,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Group Riding Skills (Endurance + Accelerations)','Endurance ride simulating group riding dynamics with periodic sprint efforts representing wheel surges and attacks. Reactive power training in aerobic context.','power','endurance','moderate',true,75,55,ARRAY['group-riding','reactive','endurance','skills'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',600,'power',62),(w,3,'interval','time',15,'power',160),(w,4,'steady','time',600,'power',62),(w,5,'interval','time',15,'power',160),(w,6,'steady','time',600,'power',62),(w,7,'interval','time',15,'power',160),(w,8,'steady','time',600,'power',62),(w,9,'interval','time',15,'power',160),(w,10,'steady','time',600,'power',62),(w,11,'interval','time',15,'power',160),(w,12,'steady','time',600,'power',62),(w,13,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Pacing Strategy Test (4x10 min varied)','Four 10-minute threshold efforts each using a different pacing strategy: even, positive-split, negative-split, ramp. Objective learning about pacing physiology.','power','threshold','moderate',true,70,68,ARRAY['pacing','strategy','test','4x10'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',600,'power',97),(w,3,'recovery','time',300,'power',55),(w,4,'steady','time',300,'power',102),(w,5,'steady','time',300,'power',92),(w,6,'recovery','time',300,'power',55),(w,7,'steady','time',300,'power',92),(w,8,'steady','time',300,'power',102),(w,9,'recovery','time',300,'power',55),(w,10,'steady','time',180,'power',90),(w,11,'steady','time',180,'power',97),(w,12,'steady','time',240,'power',102),(w,13,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Climbing Simulation Seated (5x5 min)','Five 5-minute seated threshold climbing efforts. Constant moderate-high power at low cadence simulating sustained mountain grade.','power','strength','hard',true,65,65,ARRAY['climbing','seated','simulation','5x5','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',300,'power',95),(w,3,'recovery','time',180,'power',55),(w,4,'steady','time',300,'power',95),(w,5,'recovery','time',180,'power',55),(w,6,'steady','time',300,'power',95),(w,7,'recovery','time',180,'power',55),(w,8,'steady','time',300,'power',95),(w,9,'recovery','time',180,'power',55),(w,10,'steady','time',300,'power',95),(w,11,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Standing Climb Power Development (3x8 min)','Three 8-minute out-of-saddle climbing efforts targeting standing-position power development. Trains gluteal and hip extensor recruitment specific to steep gradients.','power','strength','hard',true,60,62,ARRAY['standing','climbing','out-of-saddle','3x8','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'interval','time',480,'power',93),(w,3,'recovery','time',240,'power',55),(w,4,'interval','time',480,'power',93),(w,5,'recovery','time',240,'power',55),(w,6,'interval','time',480,'power',93),(w,7,'cooldown','time',600,'power',50);

-- ==================================================================
-- RECOVERY — POWER (5 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Active Recovery Spin (20 min)','Ultra-light 20-minute recovery spin at 40-50% FTP. Maintains circulation and lactate clearance between hard training days with minimal additional stress.','power','recovery','easy',true,20,8,ARRAY['recovery','20min','active-recovery','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'steady','time',1200,'power',45),(w,2,'cooldown','time',60,'power',40);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Recovery Flush Ride (45 min)','45-minute recovery ride with 3x30s activation jumps mid-session. Clears metabolic waste while maintaining neuromuscular readiness.','power','recovery','easy',true,45,20,ARRAY['recovery','flush','45min','activation'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',300,'power',45),(w,2,'steady','time',600,'power',48),(w,3,'interval','time',30,'power',110),(w,4,'steady','time',600,'power',48),(w,5,'interval','time',30,'power',110),(w,6,'steady','time',600,'power',48),(w,7,'interval','time',30,'power',110),(w,8,'cooldown','time',300,'power',45);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Taper Week Ride (60 min)','Competition taper ride with quality maintained at reduced volume. 60% normal duration with 3x1-minute threshold efforts to maintain neuromuscular sharpness.','power','recovery','easy',true,60,30,ARRAY['taper','pre-race','60min','quality'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'warmup','time',600,'power',55),(w,2,'steady','time',1200,'power',62),(w,3,'interval','time',60,'power',100),(w,4,'steady','time',600,'power',62),(w,5,'interval','time',60,'power',100),(w,6,'steady','time',600,'power',62),(w,7,'interval','time',60,'power',100),(w,8,'cooldown','time',600,'power',50);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Post-Race Recovery (40 min)','Gentle post-competition recovery ride at 40-50% FTP. Facilitates muscle repair and glycogen resynthesis by maintaining perfusion without stress.','power','recovery','easy',true,40,16,ARRAY['post-race','recovery','40min','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'steady','time',2400,'power',45),(w,2,'cooldown','time',60,'power',40);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('cycling','Rest Day Active Recovery (30 min)','Minimal-effort active recovery pedaling. Prescribed as substitute for complete rest to maintain circadian rhythm and light cardiovascular stimulus.','power','recovery','easy',true,30,10,ARRAY['rest-day','active-recovery','30min','power'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_percent_ftp) VALUES
(w,1,'steady','time',1800,'power',42),(w,2,'cooldown','time',60,'power',38);

END $$;
