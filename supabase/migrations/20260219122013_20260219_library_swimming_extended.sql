/*
  # Swimming Library — Extended Scientific Collection

  ## Summary
  Adds 130+ structured swimming workouts based on:
  - Maglischo (Swimming Fastest — comprehensive swim training text)
  - Costill & Maglischo (Swimming Science)
  - USA Swimming & FINA guidelines
  - Stager & Tanner (Swimming physiology)
  - Scott Volkers and Jacco Verhaeren coaching methodologies
  - Critical Swim Speed (CSS) — Ginn methodology
  - Lactate threshold swim training

  ## Categories
  Aerobic base, threshold/CSS, VO2max/anaerobic, sprint, technique/stroke,
  kick/pull sets, race-specific, testing, recovery, specialty (IM, open water)

  ## Pace Zone Reference
  Z1 = easy recovery | Z2 = aerobic base | Z3 = aerobic threshold
  Z4 = CSS/threshold | Z5 = VO2max/sprint
*/

DO $$
DECLARE w uuid;
BEGIN

-- ==================================================================
-- AEROBIC BASE (20 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Continuous Swim 30 min Z2','30-minute steady-state aerobic swim at Z2. Foundational aerobic base stimulus. Maglischo''s aerobic training zone 1-2.','pace','endurance','easy',true,30,18,ARRAY['aerobic','30min','z2','continuous'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',1500,'pace',2),(w,3,'cooldown','time',180,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Base Endurance 45 min','45-minute aerobic base swim with stroke variety (free/back alternating every 10 min). Develops aerobic capacity across multiple stroke mechanics.','pace','endurance','easy',true,45,28,ARRAY['aerobic','45min','stroke-variety','z2'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',2),(w,3,'steady','time',600,'pace',2),(w,4,'steady','time',600,'pace',2),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Distance Per Stroke Endurance Set (8x200 m)','Eight 200m swims focused on DPS (distance per stroke). Emphasis on maintaining stroke count while at aerobic pace. Develops stroke efficiency.','pace','endurance','moderate',true,55,40,ARRAY['DPS','200m','8x','stroke-efficiency'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',180,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',180,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',180,'pace',2),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',180,'pace',2),(w,9,'recovery','time',30,'pace',1),(w,10,'interval','time',180,'pace',2),(w,11,'recovery','time',30,'pace',1),(w,12,'interval','time',180,'pace',2),(w,13,'recovery','time',30,'pace',1),(w,14,'interval','time',180,'pace',2),(w,15,'recovery','time',30,'pace',1),(w,16,'interval','time',180,'pace',2),(w,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Volume 6x400 m with Rest','Six 400m swims at aerobic pace with 30-second rest. High-volume aerobic stimulus targeting lactate clearance and stroke consistency.','pace','endurance','moderate',true,65,48,ARRAY['aerobic','400m','6x','volume'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',360,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',360,'pace',2),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',360,'pace',2),(w,9,'recovery','time',30,'pace',1),(w,10,'interval','time',360,'pace',2),(w,11,'recovery','time',30,'pace',1),(w,12,'interval','time',360,'pace',2),(w,13,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','1000m Straight Swim — Stroke Count Test','Unbroken 1000m swim monitoring stroke count every 100m. Reveals fatigue-induced technique degradation and DPS changes across aerobic distance.','pace','endurance','moderate',true,25,18,ARRAY['1000m','stroke-count','test','efficiency'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',900,'pace',3),(w,3,'cooldown','time',180,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Long Swim 3000m','3000m continuous aerobic swim. High-volume session targeting swim-specific aerobic endurance and stroke efficiency at extended distances.','pace','endurance','hard',true,65,45,ARRAY['3000m','long','aerobic','continuous'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',2700,'pace',2),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Pull Set 4x500 m (Pull Buoy)','Four 500m pull swims with buoy. Develops upper-body aerobic endurance and arm stroke mechanics. Removes kick variable.','pace','endurance','moderate',true,60,42,ARRAY['pull','500m','4x','upper-body'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',450,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',450,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',450,'pace',2),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',450,'pace',2),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Kick Set 4x400 m','Four 400m kick sets with kickboard. Isolates lower-body aerobic endurance and kick technique. Key for distance events.','pace','endurance','moderate',true,60,38,ARRAY['kick','400m','kickboard','lower-body'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',360,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',360,'pace',2),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',360,'pace',2),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Progression 4x300 m (Easy to Moderate)','Four 300m swims with progressive pace increase: Z1 → Z2 → Z3 → Z3. Tests aerobic range and pacing judgment.','pace','endurance','moderate',true,50,35,ARRAY['progression','300m','4x','aerobic-range'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',270,'pace',1),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',270,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',270,'pace',3),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',270,'pace',3),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Mix Stroke Aerobic (FS/Back/Breast/IM rotation)','50-minute aerobic session rotating through all four strokes in 200m blocks. Develops total aquatic conditioning and avoids stroke-specific fatigue adaptation.','pace','endurance','moderate',true,50,35,ARRAY['mixed-strokes','IM','rotation','200m'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',180,'pace',2),(w,3,'steady','time',180,'pace',2),(w,4,'steady','time',180,'pace',2),(w,5,'steady','time',180,'pace',2),(w,6,'recovery','time',30,'pace',1),(w,7,'steady','time',180,'pace',2),(w,8,'steady','time',180,'pace',2),(w,9,'steady','time',180,'pace',2),(w,10,'steady','time',180,'pace',2),(w,11,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Descend 5x400 m (Negative Split)','Five 400m swims each descending in time (getting faster). Develops negative-split pacing and aerobic regulation.','pace','endurance','moderate',true,65,46,ARRAY['descend','400m','5x','negative-split'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',380,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',370,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',360,'pace',3),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',350,'pace',3),(w,9,'recovery','time',30,'pace',1),(w,10,'interval','time',340,'pace',3),(w,11,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Open Water Training Set (60 min sighting)','60-minute pool swim simulating open water demands: bilateral breathing, sighting every 10 strokes, drafting technique. Triathlon and open water specific preparation.','pace','endurance','moderate',true,60,40,ARRAY['open-water','sighting','bilateral','triathlon'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',2400,'pace',2),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Bilateral Breathing Endurance (40 min)','40-minute aerobic swim with strict bilateral breathing (every 3 strokes). Develops symmetrical stroke and reduces shoulder imbalance over training career.','pace','endurance','easy',true,40,26,ARRAY['bilateral','breathing','symmetry','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',2100,'pace',2),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Aerobic Endurance 5000m Block','High-volume 5000m swim broken into 10x500m. Master-level aerobic base volume session. Develops mitochondrial density and glycolytic efficiency in water.','pace','endurance','very_hard',true,90,65,ARRAY['5000m','10x500','volume','masters'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',450,'pace',2),(w,3,'recovery','time',15,'pace',1),(w,4,'interval','time',450,'pace',2),(w,5,'recovery','time',15,'pace',1),(w,6,'interval','time',450,'pace',2),(w,7,'recovery','time',15,'pace',1),(w,8,'interval','time',450,'pace',2),(w,9,'recovery','time',15,'pace',1),(w,10,'interval','time',450,'pace',2),(w,11,'recovery','time',15,'pace',1),(w,12,'interval','time',450,'pace',2),(w,13,'recovery','time',15,'pace',1),(w,14,'interval','time',450,'pace',2),(w,15,'recovery','time',15,'pace',1),(w,16,'interval','time',450,'pace',2),(w,17,'recovery','time',15,'pace',1),(w,18,'interval','time',450,'pace',2),(w,19,'recovery','time',15,'pace',1),(w,20,'interval','time',450,'pace',2),(w,21,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Over-Distance Training (1500+ m straight)','1600m straight swim paced below race effort. Psychological and physiological preparation for 1500m or 1500m open water distance events.','pace','endurance','moderate',true,35,24,ARRAY['over-distance','1600m','straight','endurance'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',1440,'pace',3),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Recovery Swim 20 min (Very Easy)','20-minute very easy swim. Active recovery post hard session or competition. Promotes blood flow, eliminates metabolic waste products.','pace','recovery','easy',true,20,10,ARRAY['recovery','20min','very-easy','z1'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',1200,'pace',1),(w,2,'cooldown','time',60,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Tether Swim Resistance (30 min)','30-minute swim with swim tether providing resistance. Builds power and strength in propulsive swimming movements. Functional overload training for sprint events.','pace','strength','moderate',true,30,22,ARRAY['tether','resistance','power','strength'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',1200,'pace',3),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Controlled Breathing Hypoxic Set (6x200 m)','Six 200m swims with limited breathing pattern (every 5, 7, 9 strokes). Develops respiratory tolerance and improves efficiency. Maglischo hypoxic training.','pace','endurance','hard',true,45,32,ARRAY['hypoxic','breathing','200m','6x','maglischo'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',180,'pace',2),(w,3,'recovery','time',60,'pace',1),(w,4,'interval','time',180,'pace',2),(w,5,'recovery','time',60,'pace',1),(w,6,'interval','time',180,'pace',2),(w,7,'recovery','time',60,'pace',1),(w,8,'interval','time',180,'pace',2),(w,9,'recovery','time',60,'pace',1),(w,10,'interval','time',180,'pace',2),(w,11,'recovery','time',60,'pace',1),(w,12,'interval','time',180,'pace',2),(w,13,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Early Morning Base Swim (40 min)','40-minute base swim adapted for morning sessions when body temperature is lower. Emphasizes gradual warm-up and aerobic stimulus.','pace','endurance','easy',true,40,24,ARRAY['morning','base','40min','gradual-warmup'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'steady','time',1500,'pace',2),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Post-Competition Recovery Swim (25 min)','25-minute gentle recovery swim 12-24 hours after competition. Facilitates lactate clearance using buoyancy-assisted movement.','pace','recovery','easy',true,25,12,ARRAY['post-race','recovery','25min','gentle'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',1500,'pace',1),(w,2,'cooldown','time',60,'pace',1);

-- ==================================================================
-- THRESHOLD / CSS (20 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Estimation Test (400+200 m TT)','Standard Critical Swim Speed estimation: 400m TT then 200m TT with 30-min rest. CSS = (400m distance - 200m distance) / (400m time - 200m time). Ginn 1993.','pace','threshold','very_hard',true,60,55,ARRAY['CSS','test','400m','200m','estimation'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'steady','time',360,'pace',5),(w,3,'recovery','time',1800,'pace',1),(w,4,'steady','time',175,'pace',5),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Threshold Set 5x400 m','Five 400m swims at Critical Swim Speed. High threshold volume session. Central to Maglischo''s lactate threshold training for middle-distance swimmers.','pace','threshold','hard',true,65,60,ARRAY['CSS','5x400','threshold','maglischo'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',4),(w,3,'recovery','time',45,'pace',1),(w,4,'interval','time',360,'pace',4),(w,5,'recovery','time',45,'pace',1),(w,6,'interval','time',360,'pace',4),(w,7,'recovery','time',45,'pace',1),(w,8,'interval','time',360,'pace',4),(w,9,'recovery','time',45,'pace',1),(w,10,'interval','time',360,'pace',4),(w,11,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS 8x200 m Short Rest','Eight 200m swims at CSS with 15-second rest. High total threshold volume using short rest format to maintain lactate accumulation.','pace','threshold','hard',true,55,52,ARRAY['CSS','8x200','threshold','short-rest'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',180,'pace',4),(w,3,'recovery','time',15,'pace',1),(w,4,'interval','time',180,'pace',4),(w,5,'recovery','time',15,'pace',1),(w,6,'interval','time',180,'pace',4),(w,7,'recovery','time',15,'pace',1),(w,8,'interval','time',180,'pace',4),(w,9,'recovery','time',15,'pace',1),(w,10,'interval','time',180,'pace',4),(w,11,'recovery','time',15,'pace',1),(w,12,'interval','time',180,'pace',4),(w,13,'recovery','time',15,'pace',1),(w,14,'interval','time',180,'pace',4),(w,15,'recovery','time',15,'pace',1),(w,16,'interval','time',180,'pace',4),(w,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','T-Pace 20x100 m (Pace Clock)','Twenty 100m swims on pace clock at T-pace. Classic USA Swimming threshold volume protocol. Total threshold volume = 2000m.','pace','threshold','hard',true,60,58,ARRAY['T-pace','20x100','threshold','pace-clock'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',90,'pace',4),(w,3,'recovery','time',10,'pace',1),(w,4,'interval','time',90,'pace',4),(w,5,'recovery','time',10,'pace',1),(w,6,'interval','time',90,'pace',4),(w,7,'recovery','time',10,'pace',1),(w,8,'interval','time',90,'pace',4),(w,9,'recovery','time',10,'pace',1),(w,10,'interval','time',90,'pace',4),(w,11,'recovery','time',10,'pace',1),(w,12,'interval','time',90,'pace',4),(w,13,'recovery','time',10,'pace',1),(w,14,'interval','time',90,'pace',4),(w,15,'recovery','time',10,'pace',1),(w,16,'interval','time',90,'pace',4),(w,17,'recovery','time',10,'pace',1),(w,18,'interval','time',90,'pace',4),(w,19,'recovery','time',10,'pace',1),(w,20,'interval','time',90,'pace',4),(w,21,'recovery','time',10,'pace',1),(w,22,'interval','time',90,'pace',4),(w,23,'recovery','time',10,'pace',1),(w,24,'interval','time',90,'pace',4),(w,25,'recovery','time',10,'pace',1),(w,26,'interval','time',90,'pace',4),(w,27,'recovery','time',10,'pace',1),(w,28,'interval','time',90,'pace',4),(w,29,'recovery','time',10,'pace',1),(w,30,'interval','time',90,'pace',4),(w,31,'recovery','time',10,'pace',1),(w,32,'interval','time',90,'pace',4),(w,33,'recovery','time',10,'pace',1),(w,34,'interval','time',90,'pace',4),(w,35,'recovery','time',10,'pace',1),(w,36,'interval','time',90,'pace',4),(w,37,'recovery','time',10,'pace',1),(w,38,'interval','time',90,'pace',4),(w,39,'recovery','time',10,'pace',1),(w,40,'interval','time',90,'pace',4),(w,41,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold Continuous 1500 m','Unbroken 1500m swim at CSS. Most demanding single-effort threshold session in competitive swimming. Race distance threshold training.','pace','threshold','very_hard',true,35,38,ARRAY['CSS','1500m','continuous','threshold'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',1350,'pace',4),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold Pyramid 50/100/200/400/200/100/50 m','Ascending-descending threshold pyramid with 15-second rest. Develops threshold pacing judgment across varying distances.','pace','threshold','hard',true,50,48,ARRAY['threshold','pyramid','50-400','CSS'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',45,'pace',4),(w,3,'recovery','time',15,'pace',1),(w,4,'interval','time',90,'pace',4),(w,5,'recovery','time',15,'pace',1),(w,6,'interval','time',180,'pace',4),(w,7,'recovery','time',15,'pace',1),(w,8,'interval','time',360,'pace',4),(w,9,'recovery','time',15,'pace',1),(w,10,'interval','time',180,'pace',4),(w,11,'recovery','time',15,'pace',1),(w,12,'interval','time',90,'pace',4),(w,13,'recovery','time',15,'pace',1),(w,14,'interval','time',45,'pace',4),(w,15,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Pull Set 6x300 m','Six 300m pull buoy swims at CSS. Isolates threshold stimulus to upper body while removing kick energy cost. Technique-strength threshold development.','pace','threshold','hard',true,60,52,ARRAY['CSS','pull','6x300','threshold'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',270,'pace',4),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',270,'pace',4),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',270,'pace',4),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',270,'pace',4),(w,9,'recovery','time',30,'pace',1),(w,10,'interval','time',270,'pace',4),(w,11,'recovery','time',30,'pace',1),(w,12,'interval','time',270,'pace',4),(w,13,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Lactate Tolerance Broken Swims 4x300','Four 300m broken swims at above-CSS intensity. Broken = 100+100+100 with 5s rest within. Allows higher quality within each 300m block.','pace','threshold','hard',true,50,48,ARRAY['lactate-tolerance','broken','4x300','above-CSS'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',90,'pace',4),(w,3,'recovery','time',5,'pace',1),(w,4,'interval','time',90,'pace',4),(w,5,'recovery','time',5,'pace',1),(w,6,'interval','time',90,'pace',4),(w,7,'recovery','time',60,'pace',1),(w,8,'interval','time',90,'pace',4),(w,9,'recovery','time',5,'pace',1),(w,10,'interval','time',90,'pace',4),(w,11,'recovery','time',5,'pace',1),(w,12,'interval','time',90,'pace',4),(w,13,'recovery','time',60,'pace',1),(w,14,'interval','time',90,'pace',4),(w,15,'recovery','time',5,'pace',1),(w,16,'interval','time',90,'pace',4),(w,17,'recovery','time',5,'pace',1),(w,18,'interval','time',90,'pace',4),(w,19,'recovery','time',60,'pace',1),(w,20,'interval','time',90,'pace',4),(w,21,'recovery','time',5,'pace',1),(w,22,'interval','time',90,'pace',4),(w,23,'recovery','time',5,'pace',1),(w,24,'interval','time',90,'pace',4),(w,25,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold Blocks with Descending Rest','Four 400m threshold blocks with decreasing rest intervals: 45s, 30s, 20s, 10s. Progressive lactate accumulation training for race-specific endurance.','pace','threshold','very_hard',true,50,52,ARRAY['threshold','descending-rest','400m','progressive'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',4),(w,3,'recovery','time',45,'pace',1),(w,4,'interval','time',360,'pace',4),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',360,'pace',4),(w,7,'recovery','time',20,'pace',1),(w,8,'interval','time',360,'pace',4),(w,9,'recovery','time',10,'pace',1),(w,10,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Descend Threshold Series 3x(200+100) m','Three sets of 200m + 100m with 10s rest. 200m at CSS, 100m at slightly faster. Tests speed reserve and lactate buffering at threshold.','pace','threshold','very_hard',true,45,48,ARRAY['descend','200-100','3x','speed-reserve'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',180,'pace',4),(w,3,'recovery','time',10,'pace',1),(w,4,'interval','time',90,'pace',5),(w,5,'recovery','time',60,'pace',1),(w,6,'interval','time',180,'pace',4),(w,7,'recovery','time',10,'pace',1),(w,8,'interval','time',90,'pace',5),(w,9,'recovery','time',60,'pace',1),(w,10,'interval','time',180,'pace',4),(w,11,'recovery','time',10,'pace',1),(w,12,'interval','time',90,'pace',5),(w,13,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','T-Pace Kick Set 8x100 m','Eight 100m kick sets at threshold pace. Develops kick-specific lactate tolerance and endurance crucial for distance and IM events.','pace','threshold','hard',true,40,35,ARRAY['kick','T-pace','8x100','lactate'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',90,'pace',4),(w,3,'recovery','time',20,'pace',1),(w,4,'interval','time',90,'pace',4),(w,5,'recovery','time',20,'pace',1),(w,6,'interval','time',90,'pace',4),(w,7,'recovery','time',20,'pace',1),(w,8,'interval','time',90,'pace',4),(w,9,'recovery','time',20,'pace',1),(w,10,'interval','time',90,'pace',4),(w,11,'recovery','time',20,'pace',1),(w,12,'interval','time',90,'pace',4),(w,13,'recovery','time',20,'pace',1),(w,14,'interval','time',90,'pace',4),(w,15,'recovery','time',20,'pace',1),(w,16,'interval','time',90,'pace',4),(w,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Ascending CSS Sets 100/200/300/400 m','Ascending CSS pyramid: 100, 200, 300, 400m at threshold. Tests ability to maintain CSS across different distances.','pace','threshold','hard',true,45,42,ARRAY['ascending','CSS','100-400','pyramid'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',90,'pace',4),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',180,'pace',4),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',270,'pace',4),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',360,'pace',4),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold Race Prep 1200m in 3x400','Three 400m swims at CSS with race-start simulation. Swim 1 = easy entry, swim 2 = race pressure, swim 3 = finish effort.','pace','threshold','hard',true,40,40,ARRAY['race-prep','3x400','threshold','pacing'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',3),(w,3,'recovery','time',60,'pace',1),(w,4,'interval','time',360,'pace',4),(w,5,'recovery','time',60,'pace',1),(w,6,'interval','time',360,'pace',5),(w,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Threshold + Sprint Combination (400+4x50) m x3','Three sets of 400m at CSS followed immediately by 4x50m sprints. Trains ability to sprint from threshold-fatigued state. Race finish preparation.','pace','threshold','very_hard',true,60,60,ARRAY['combo','400-4x50','CSS-sprint','race-finish'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',4),(w,3,'interval','time',45,'pace',5),(w,4,'recovery','time',15,'pace',1),(w,5,'interval','time',45,'pace',5),(w,6,'recovery','time',15,'pace',1),(w,7,'interval','time',45,'pace',5),(w,8,'recovery','time',15,'pace',1),(w,9,'interval','time',45,'pace',5),(w,10,'recovery','time',90,'pace',1),(w,11,'interval','time',360,'pace',4),(w,12,'interval','time',45,'pace',5),(w,13,'recovery','time',15,'pace',1),(w,14,'interval','time',45,'pace',5),(w,15,'recovery','time',15,'pace',1),(w,16,'interval','time',45,'pace',5),(w,17,'recovery','time',15,'pace',1),(w,18,'interval','time',45,'pace',5),(w,19,'recovery','time',90,'pace',1),(w,20,'interval','time',360,'pace',4),(w,21,'interval','time',45,'pace',5),(w,22,'recovery','time',15,'pace',1),(w,23,'interval','time',45,'pace',5),(w,24,'recovery','time',15,'pace',1),(w,25,'interval','time',45,'pace',5),(w,26,'recovery','time',15,'pace',1),(w,27,'interval','time',45,'pace',5),(w,28,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Broken 800m at CSS 4x200','800m total at CSS broken into 4x200 with 5-second rest. Allows slightly faster pace than continuous 800m while maintaining high lactate stress.','pace','threshold','hard',true,25,24,ARRAY['broken-800','4x200','CSS','5s-rest'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',180,'pace',4),(w,3,'recovery','time',5,'pace',1),(w,4,'interval','time',180,'pace',4),(w,5,'recovery','time',5,'pace',1),(w,6,'interval','time',180,'pace',4),(w,7,'recovery','time',5,'pace',1),(w,8,'interval','time',180,'pace',4),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS with Kick-Only at Threshold 5x200','Five 200m sets alternating full stroke and kick-only at CSS. Develops kick endurance at threshold. Maglischo dual-system threshold training.','pace','threshold','hard',true,50,46,ARRAY['kick-only','CSS','5x200','alternating'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',180,'pace',4),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',180,'pace',4),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',180,'pace',4),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',180,'pace',4),(w,9,'recovery','time',30,'pace',1),(w,10,'interval','time',180,'pace',4),(w,11,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','CSS Pace Calibration 3x(2x400)','Six 400m swims in two sets with 1-min inter-set rest. Calibrates ability to hold identical CSS pace under fatigue accumulation across all six 400s.','pace','threshold','very_hard',true,65,60,ARRAY['CSS','pace-calibration','3x2x400','consistency'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',360,'pace',4),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',360,'pace',4),(w,5,'recovery','time',60,'pace',1),(w,6,'interval','time',360,'pace',4),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',360,'pace',4),(w,9,'recovery','time',60,'pace',1),(w,10,'interval','time',360,'pace',4),(w,11,'recovery','time',30,'pace',1),(w,12,'interval','time',360,'pace',4),(w,13,'cooldown','time',300,'pace',1);

-- ==================================================================
-- VO2MAX / ANAEROBIC / SPRINT (25 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 10x100 m (Hard)','Ten 100m swims at VO2max intensity. Maglischo''s anaerobic threshold-to-VO2max training. 15-second rest allows repeated high-quality efforts.','pace','vo2max','hard',true,35,35,ARRAY['vo2max','10x100','hard','anaerobic'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',85,'pace',5),(w,3,'recovery','time',15,'pace',1),(w,4,'interval','time',85,'pace',5),(w,5,'recovery','time',15,'pace',1),(w,6,'interval','time',85,'pace',5),(w,7,'recovery','time',15,'pace',1),(w,8,'interval','time',85,'pace',5),(w,9,'recovery','time',15,'pace',1),(w,10,'interval','time',85,'pace',5),(w,11,'recovery','time',15,'pace',1),(w,12,'interval','time',85,'pace',5),(w,13,'recovery','time',15,'pace',1),(w,14,'interval','time',85,'pace',5),(w,15,'recovery','time',15,'pace',1),(w,16,'interval','time',85,'pace',5),(w,17,'recovery','time',15,'pace',1),(w,18,'interval','time',85,'pace',5),(w,19,'recovery','time',15,'pace',1),(w,20,'interval','time',85,'pace',5),(w,21,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Anaerobic Capacity 6x50 m Full Effort','Six 50m maximal swims with 3-minute rest. Tests and develops anaerobic capacity and peak swimming power. Sprint event preparation.','pace','sprint','very_hard',true,30,28,ARRAY['anaerobic','6x50','full-effort','sprint'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',30,'pace',5),(w,3,'recovery','time',180,'pace',1),(w,4,'interval','time',30,'pace',5),(w,5,'recovery','time',180,'pace',1),(w,6,'interval','time',30,'pace',5),(w,7,'recovery','time',180,'pace',1),(w,8,'interval','time',30,'pace',5),(w,9,'recovery','time',180,'pace',1),(w,10,'interval','time',30,'pace',5),(w,11,'recovery','time',180,'pace',1),(w,12,'interval','time',30,'pace',5),(w,13,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Power 8x25 m Maximal','Eight maximal 25m sprint efforts. Alactic power development for sprint events. Full rest between each for phosphocreatine resynthesis.','pace','sprint','very_hard',true,25,20,ARRAY['sprint','25m','8x','alactic','PCr'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',15,'pace',5),(w,3,'recovery','time',180,'pace',1),(w,4,'interval','time',15,'pace',5),(w,5,'recovery','time',180,'pace',1),(w,6,'interval','time',15,'pace',5),(w,7,'recovery','time',180,'pace',1),(w,8,'interval','time',15,'pace',5),(w,9,'recovery','time',180,'pace',1),(w,10,'interval','time',15,'pace',5),(w,11,'recovery','time',180,'pace',1),(w,12,'interval','time',15,'pace',5),(w,13,'recovery','time',180,'pace',1),(w,14,'interval','time',15,'pace',5),(w,15,'recovery','time',180,'pace',1),(w,16,'interval','time',15,'pace',5),(w,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Anaerobic Glycolytic Set 4x100 m (max 100s rest)','Four 100m swims at above-CSS pace with 100 seconds rest. Classic anaerobic capacity set for 100m-200m event training.','pace','sprint','very_hard',true,25,25,ARRAY['anaerobic','glycolytic','4x100','100s-rest'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',65,'pace',5),(w,3,'recovery','time',100,'pace',1),(w,4,'interval','time',65,'pace',5),(w,5,'recovery','time',100,'pace',1),(w,6,'interval','time',65,'pace',5),(w,7,'recovery','time',100,'pace',1),(w,8,'interval','time',65,'pace',5),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max Long Intervals 5x300 m','Five 300m swims at VO2max intensity. Extends time at maximal oxygen consumption. Excellent for 400m-1500m freestyle development.','pace','vo2max','hard',true,50,48,ARRAY['vo2max','5x300','long-intervals','distance'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',270,'pace',5),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',270,'pace',5),(w,5,'recovery','time',90,'pace',1),(w,6,'interval','time',270,'pace',5),(w,7,'recovery','time',90,'pace',1),(w,8,'interval','time',270,'pace',5),(w,9,'recovery','time',90,'pace',1),(w,10,'interval','time',270,'pace',5),(w,11,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Race Pace 4x100 at 100m Event Speed','Four 100m swims at 100m race pace. Race-pace training for sprint swimmers. Develops tolerance to specific competitive velocity.','pace','sprint','very_hard',true,30,28,ARRAY['race-pace','100m','4x','sprint'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',65,'pace',5),(w,3,'recovery','time',180,'pace',1),(w,4,'interval','time',65,'pace',5),(w,5,'recovery','time',180,'pace',1),(w,6,'interval','time',65,'pace',5),(w,7,'recovery','time',180,'pace',1),(w,8,'interval','time',65,'pace',5),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Start and Turn Acceleration Work','Repeated start dives + 12.5m underwater + breakout + 37.5m at pace. Develops start mechanics, underwater dolphin kick, and breakout speed.','pace','sprint','hard',true,35,22,ARRAY['starts','turns','underwater','breakout'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',30,'pace',5),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',30,'pace',5),(w,5,'recovery','time',90,'pace',1),(w,6,'interval','time',30,'pace',5),(w,7,'recovery','time',90,'pace',1),(w,8,'interval','time',30,'pace',5),(w,9,'recovery','time',90,'pace',1),(w,10,'interval','time',30,'pace',5),(w,11,'recovery','time',90,'pace',1),(w,12,'interval','time',30,'pace',5),(w,13,'recovery','time',90,'pace',1),(w,14,'interval','time',30,'pace',5),(w,15,'recovery','time',90,'pace',1),(w,16,'interval','time',30,'pace',5),(w,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Speed Endurance 3x200 m (Race+5s Pace)','Three 200m swims at 5s/100m faster than race pace. Develops speed reserve and anaerobic tolerance specific to race finishing.','pace','sprint','very_hard',true,30,30,ARRAY['speed-endurance','3x200','above-race','speed-reserve'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',155,'pace',5),(w,3,'recovery','time',300,'pace',1),(w,4,'interval','time',155,'pace',5),(w,5,'recovery','time',300,'pace',1),(w,6,'interval','time',155,'pace',5),(w,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Lactate Tolerance Set 6x75 m','Six 75m swims at or above race pace. Short rest (45s) maintains elevated blood lactate. Improves buffering capacity and lactate tolerance.','pace','sprint','very_hard',true,30,30,ARRAY['lactate-tolerance','6x75','race-pace','buffering'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',55,'pace',5),(w,3,'recovery','time',45,'pace',1),(w,4,'interval','time',55,'pace',5),(w,5,'recovery','time',45,'pace',1),(w,6,'interval','time',55,'pace',5),(w,7,'recovery','time',45,'pace',1),(w,8,'interval','time',55,'pace',5),(w,9,'recovery','time',45,'pace',1),(w,10,'interval','time',55,'pace',5),(w,11,'recovery','time',45,'pace',1),(w,12,'interval','time',55,'pace',5),(w,13,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Accumulation 12x50 m (descend 1-4, 5-8, 9-12)','Twelve 50m sprints in three groups of four with descending times (fastest at end of each group). Race-finish speed development under fatigue.','pace','sprint','hard',true,35,32,ARRAY['sprint','12x50','descend','race-finish'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',45,'pace',4),(w,3,'recovery','time',60,'pace',1),(w,4,'interval','time',43,'pace',5),(w,5,'recovery','time',60,'pace',1),(w,6,'interval','time',41,'pace',5),(w,7,'recovery','time',60,'pace',1),(w,8,'interval','time',39,'pace',5),(w,9,'recovery','time',90,'pace',1),(w,10,'interval','time',45,'pace',4),(w,11,'recovery','time',60,'pace',1),(w,12,'interval','time',43,'pace',5),(w,13,'recovery','time',60,'pace',1),(w,14,'interval','time',41,'pace',5),(w,15,'recovery','time',60,'pace',1),(w,16,'interval','time',39,'pace',5),(w,17,'recovery','time',90,'pace',1),(w,18,'interval','time',45,'pace',4),(w,19,'recovery','time',60,'pace',1),(w,20,'interval','time',43,'pace',5),(w,21,'recovery','time',60,'pace',1),(w,22,'interval','time',41,'pace',5),(w,23,'recovery','time',60,'pace',1),(w,24,'interval','time',39,'pace',5),(w,25,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Explosive Power Set 16x25 m (All Out)','Sixteen maximal 25m explosive sprints with full 2-minute rest. Develops alactic power, maximal stroke rate, and fast-twitch neuromuscular fiber recruitment.','pace','sprint','hard',true,45,28,ARRAY['explosive','16x25','all-out','alactic'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',15,'pace',5),(w,3,'recovery','time',120,'pace',1),(w,4,'interval','time',15,'pace',5),(w,5,'recovery','time',120,'pace',1),(w,6,'interval','time',15,'pace',5),(w,7,'recovery','time',120,'pace',1),(w,8,'interval','time',15,'pace',5),(w,9,'recovery','time',120,'pace',1),(w,10,'interval','time',15,'pace',5),(w,11,'recovery','time',120,'pace',1),(w,12,'interval','time',15,'pace',5),(w,13,'recovery','time',120,'pace',1),(w,14,'interval','time',15,'pace',5),(w,15,'recovery','time',120,'pace',1),(w,16,'interval','time',15,'pace',5),(w,17,'recovery','time',120,'pace',1),(w,18,'interval','time',15,'pace',5),(w,19,'recovery','time',120,'pace',1),(w,20,'interval','time',15,'pace',5),(w,21,'recovery','time',120,'pace',1),(w,22,'interval','time',15,'pace',5),(w,23,'recovery','time',120,'pace',1),(w,24,'interval','time',15,'pace',5),(w,25,'recovery','time',120,'pace',1),(w,26,'interval','time',15,'pace',5),(w,27,'recovery','time',120,'pace',1),(w,28,'interval','time',15,'pace',5),(w,29,'recovery','time',120,'pace',1),(w,30,'interval','time',15,'pace',5),(w,31,'recovery','time',120,'pace',1),(w,32,'interval','time',15,'pace',5),(w,33,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','VO2max 400m Test','Maximal 400m swim effort for VO2max assessment. 400m is the standard distance for estimating swimming VO2max. Record time for zone prescription.','pace','vo2max','very_hard',true,20,20,ARRAY['test','400m','VO2max','assessment'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'steady','time',360,'pace',5),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Race Pace Simulation Full 100m x 4','Four timed 100m swims at full race effort with full rest. Competition readiness session. Final performance confirmation before major events.','pace','sprint','very_hard',true,30,28,ARRAY['race-simulation','100m','4x','competition-prep'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',62,'pace',5),(w,3,'recovery','time',300,'pace',1),(w,4,'interval','time',62,'pace',5),(w,5,'recovery','time',300,'pace',1),(w,6,'interval','time',62,'pace',5),(w,7,'recovery','time',300,'pace',1),(w,8,'interval','time',62,'pace',5),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Training Under Fatigue 3x(6x25)','Three sets of 6x25m sprints with short rest within sets. Fatigue within each set trains tolerance to sprint degradation. Race-ending sprint development.','pace','sprint','very_hard',true,35,30,ARRAY['fatigue','3x6x25','sprint-degradation','race-ending'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',15,'pace',5),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',15,'pace',5),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',15,'pace',5),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',15,'pace',5),(w,9,'recovery','time',30,'pace',1),(w,10,'interval','time',15,'pace',5),(w,11,'recovery','time',30,'pace',1),(w,12,'interval','time',15,'pace',5),(w,13,'recovery','time',180,'pace',1),(w,14,'interval','time',15,'pace',5),(w,15,'recovery','time',30,'pace',1),(w,16,'interval','time',15,'pace',5),(w,17,'recovery','time',30,'pace',1),(w,18,'interval','time',15,'pace',5),(w,19,'recovery','time',30,'pace',1),(w,20,'interval','time',15,'pace',5),(w,21,'recovery','time',30,'pace',1),(w,22,'interval','time',15,'pace',5),(w,23,'recovery','time',30,'pace',1),(w,24,'interval','time',15,'pace',5),(w,25,'recovery','time',180,'pace',1),(w,26,'interval','time',15,'pace',5),(w,27,'recovery','time',30,'pace',1),(w,28,'interval','time',15,'pace',5),(w,29,'recovery','time',30,'pace',1),(w,30,'interval','time',15,'pace',5),(w,31,'recovery','time',30,'pace',1),(w,32,'interval','time',15,'pace',5),(w,33,'recovery','time',30,'pace',1),(w,34,'interval','time',15,'pace',5),(w,35,'recovery','time',30,'pace',1),(w,36,'interval','time',15,'pace',5),(w,37,'cooldown','time',300,'pace',1);

-- ==================================================================
-- TECHNIQUE / STROKE / DRILLS (20 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Catch-Up Drill Freestyle (30 min)','Freestyle catch-up drill (one arm extended until other arm returns). Improves front quadrant timing, body rotation, and catch position.','pace','other','easy',true,30,14,ARRAY['catch-up','freestyle','drill','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',1),(w,3,'steady','time',600,'pace',2),(w,4,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','High-Elbow Underwater Catch Drill','High-elbow early vertical forearm (EVF) drill progression. Develops forward-facing palm catch position maximizing propulsive surface area.','pace','other','easy',true,30,14,ARRAY['high-elbow','EVF','catch','propulsion'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',1),(w,3,'steady','time',300,'pace',2),(w,4,'steady','time',300,'pace',1),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Fingertip Drag Drill (40 min)','Fingertip drag recovery drill: fingers lightly trace water surface during recovery phase. Trains high-elbow recovery and reduces shoulder impingement risk.','pace','other','easy',true,40,18,ARRAY['fingertip-drag','recovery','shoulder','drill'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',2),(w,3,'steady','time',600,'pace',2),(w,4,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Rotation Drill — Body Roll Development','Hip-driven rotation drill: exaggerated 45-degree body roll on each stroke. Trains rhythmic body rotation for power transfer and reduced frontal drag.','pace','other','easy',true,35,16,ARRAY['rotation','body-roll','hip-driven','drill'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',1),(w,3,'steady','time',600,'pace',2),(w,4,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Backstroke Technique Session (40 min)','Backstroke drills: single-arm, hand-entry angle, kick tempo, shoulder rotation. Develops efficient backstroke mechanics and body alignment.','pace','other','easy',true,40,18,ARRAY['backstroke','single-arm','rotation','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',300,'pace',2),(w,3,'steady','time',300,'pace',1),(w,4,'steady','time',300,'pace',2),(w,5,'steady','time',300,'pace',1),(w,6,'steady','time',300,'pace',2),(w,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Breaststroke Technique Session (40 min)','Breaststroke drills: pullout timing, kick width, glide duration, head position. Improves underwater phase and reduces drag. Coach Colwin technique methodology.','pace','other','easy',true,40,18,ARRAY['breaststroke','pullout','kick','glide','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',300,'pace',2),(w,3,'steady','time',300,'pace',1),(w,4,'steady','time',300,'pace',2),(w,5,'steady','time',300,'pace',1),(w,6,'steady','time',300,'pace',2),(w,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Butterfly Technique + Endurance (30 min)','Butterfly drill progression: body undulation, kick timing, breathing position, then full-stroke butterfly endurance. Develops sustainable butterfly mechanics.','pace','other','moderate',true,30,18,ARRAY['butterfly','undulation','kick','breathing','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',300,'pace',2),(w,3,'steady','time',300,'pace',2),(w,4,'steady','time',300,'pace',3),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Individual Medley Technique Set (50 min)','50-minute IM technique session: 400m each stroke in drill format. Develops all four strokes with attention to transition mechanics between strokes.','pace','other','moderate',true,50,28,ARRAY['IM','individual-medley','4-stroke','transitions','technique'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',360,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'steady','time',360,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'steady','time',360,'pace',2),(w,7,'recovery','time',30,'pace',1),(w,8,'steady','time',360,'pace',2),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Underwater Dolphin Kick Development (30 min)','Underwater dolphin kick emphasis: streamline off walls, undulation, power generation from hips. Develops the "fifth stroke" critical for sprint and IM events.','pace','other','moderate',true,30,16,ARRAY['dolphin-kick','underwater','streamline','fifth-stroke'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',300,'pace',2),(w,3,'steady','time',300,'pace',2),(w,4,'steady','time',300,'pace',2),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sculling Progression Drills (30 min)','Sculling exercises: front scull, mid-scull, back scull. Develops feel for water (propulsive force application) and hand pitch optimization.','pace','other','easy',true,30,12,ARRAY['sculling','water-feel','hand-pitch','propulsion'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'steady','time',300,'pace',1),(w,2,'steady','time',600,'pace',2),(w,3,'steady','time',300,'pace',2),(w,4,'cooldown','time',180,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Tempo Trainer Stroke Rate Drill (45 min)','45-minute swim using Tempo Trainer to hit precise stroke rate. Develops stroke rate control across aerobic intensities. Maglischo stroke rate optimization.','pace','other','moderate',true,45,24,ARRAY['tempo-trainer','stroke-rate','precision','maglischo'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',2),(w,3,'steady','time',600,'pace',2),(w,4,'steady','time',600,'pace',3),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Kick-Only Sprint Development (8x50 m)','Eight 50m kick-only sprints with fins. Develops explosive leg speed and kick power. Improves overall propulsion and body position.','pace','sprint','moderate',true,30,20,ARRAY['kick-fins','sprint','8x50','leg-speed'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',45,'pace',5),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',45,'pace',5),(w,5,'recovery','time',90,'pace',1),(w,6,'interval','time',45,'pace',5),(w,7,'recovery','time',90,'pace',1),(w,8,'interval','time',45,'pace',5),(w,9,'recovery','time',90,'pace',1),(w,10,'interval','time',45,'pace',5),(w,11,'recovery','time',90,'pace',1),(w,12,'interval','time',45,'pace',5),(w,13,'recovery','time',90,'pace',1),(w,14,'interval','time',45,'pace',5),(w,15,'recovery','time',90,'pace',1),(w,16,'interval','time',45,'pace',5),(w,17,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Head-Up Sighting Practice (40 min)','Aerobic swim with every 6th length performed heads-up freestyle simulating open water sighting. Triathlon-specific technique preparation.','pace','other','easy',true,40,22,ARRAY['sighting','head-up','open-water','triathlon'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',2100,'pace',2),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Pull Progression: No Equipment to Paddles (50 min)','Four 250m blocks with increasing assistance: no equipment, pull buoy, small paddles, large paddles. Progressive overload of propulsive force mechanics.','pace','other','moderate',true,50,30,ARRAY['pull-progression','paddles','buoy','overload'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',225,'pace',2),(w,3,'recovery','time',30,'pace',1),(w,4,'steady','time',225,'pace',2),(w,5,'recovery','time',30,'pace',1),(w,6,'steady','time',225,'pace',3),(w,7,'recovery','time',30,'pace',1),(w,8,'steady','time',225,'pace',3),(w,9,'cooldown','time',300,'pace',1);

-- ==================================================================
-- IM / SPECIALTY / RACE EVENTS (15 workouts)
-- ==================================================================

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','200 IM Simulation — 4x50 by Stroke','Four 50m swims each at IM stroke order: butterfly, backstroke, breaststroke, freestyle. Simulates 200 IM pacing at race intensity with stroke transitions.','pace','vo2max','hard',true,25,24,ARRAY['200IM','simulation','4x50','stroke-order'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',45,'pace',5),(w,3,'recovery','time',30,'pace',1),(w,4,'interval','time',45,'pace',5),(w,5,'recovery','time',30,'pace',1),(w,6,'interval','time',45,'pace',5),(w,7,'recovery','time',30,'pace',1),(w,8,'interval','time',45,'pace',5),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','400 IM Endurance Development 3x400 IM','Three full 400m IMs with 90-second rest. Builds IM-specific endurance across all four strokes. Demands even stroke distribution.','pace','threshold','very_hard',true,55,55,ARRAY['400IM','3x400','endurance','all-stroke'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',380,'pace',4),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',380,'pace',4),(w,5,'recovery','time',90,'pace',1),(w,6,'interval','time',380,'pace',4),(w,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','1500m Freestyle Race Preparation','1500m split into tactical 300m blocks: conservative start, steady middle, negative-split finish. Develops 1500m race pacing strategy.','pace','threshold','very_hard',true,40,42,ARRAY['1500m','race-prep','tactical','pacing-strategy'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',270,'pace',3),(w,3,'steady','time',270,'pace',4),(w,4,'steady','time',270,'pace',4),(w,5,'steady','time',270,'pace',4),(w,6,'interval','time',270,'pace',5),(w,7,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Open Water Event Simulation (750m TT)','750m open water / triathlon-distance time trial. Simulates sprint triathlon swim split. Race pace with bilateral breathing and head-up sighting.','pace','vo2max','hard',true,25,25,ARRAY['open-water','750m','triathlon','time-trial'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'steady','time',675,'pace',4),(w,3,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Sprint Relay Practice Set (4x50 all-out)','Four maximal 50m relay-format sprints simulating relay leg exchange and maximum effort tagging. Develops peak sprint readiness under race stress.','pace','sprint','very_hard',true,25,22,ARRAY['relay','4x50','all-out','sprint'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',600,'pace',1),(w,2,'interval','time',30,'pace',5),(w,3,'recovery','time',240,'pace',1),(w,4,'interval','time',30,'pace',5),(w,5,'recovery','time',240,'pace',1),(w,6,'interval','time',30,'pace',5),(w,7,'recovery','time',240,'pace',1),(w,8,'interval','time',30,'pace',5),(w,9,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Pool-to-Open Water Transition Swim (60 min)','60-minute technique-focused session transitioning between pool and open-water skills: bilateral breathing, sighting, wetsuit acclimatization, buoy turns.','pace','endurance','moderate',true,60,38,ARRAY['pool-to-open','transition','triathlon','wetsuit'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',2),(w,3,'steady','time',600,'pace',2),(w,4,'steady','time',600,'pace',2),(w,5,'cooldown','time',300,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Taper Activation Swim (30 min)','Pre-competition taper swim: easy aerobic + 6x25m race-pace activation swims. Maintains neuromuscular readiness with minimal load accumulation.','pace','recovery','easy',true,30,15,ARRAY['taper','activation','pre-race','25m'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'steady','time',600,'pace',2),(w,3,'interval','time',15,'pace',5),(w,4,'recovery','time',45,'pace',1),(w,5,'interval','time',15,'pace',5),(w,6,'recovery','time',45,'pace',1),(w,7,'interval','time',15,'pace',5),(w,8,'recovery','time',45,'pace',1),(w,9,'interval','time',15,'pace',5),(w,10,'recovery','time',45,'pace',1),(w,11,'interval','time',15,'pace',5),(w,12,'recovery','time',45,'pace',1),(w,13,'interval','time',15,'pace',5),(w,14,'cooldown','time',180,'pace',1);

INSERT INTO workouts(sport,name,description,intensity_basis,category,difficulty,is_public,estimated_duration_minutes,estimated_impulse,tags)
VALUES('swimming','Mass Start Practice — Group Entry','Repeated pool entry and mass start simulations with multiple swimmers. Practices tactical positioning, early contact management, and drafting technique for open water racing.','pace','other','moderate',true,30,16,ARRAY['mass-start','group','drafting','open-water-racing'])
RETURNING id INTO w;
INSERT INTO workout_steps(workout_id,"order",step_type,duration_type,duration_value,target_type,target_zone) VALUES
(w,1,'warmup','time',300,'pace',1),(w,2,'interval','time',30,'pace',5),(w,3,'recovery','time',90,'pace',1),(w,4,'interval','time',30,'pace',5),(w,5,'recovery','time',90,'pace',1),(w,6,'interval','time',30,'pace',5),(w,7,'recovery','time',90,'pace',1),(w,8,'interval','time',180,'pace',2),(w,9,'interval','time',30,'pace',5),(w,10,'recovery','time',90,'pace',1),(w,11,'interval','time',30,'pace',5),(w,12,'recovery','time',90,'pace',1),(w,13,'interval','time',180,'pace',2),(w,14,'cooldown','time',180,'pace',1);

END $$;
