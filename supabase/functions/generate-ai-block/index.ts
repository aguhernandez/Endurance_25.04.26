import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TrainingSession {
  session_date: string;
  sport: string;
  duration_minutes: number;
  perceived_effort?: number;
  fatigue_level?: number;
  avg_heart_rate?: number;
  avg_power_watts?: number;
  notes?: string;
  status: string;
}

interface ATPPlan {
  ca_start: number;
  al_start: number;
  tau_chronic: number;
  tau_acute: number;
  rb_min: number;
  rb_peak_target: number;
  ca_target_main_event: number;
  plan_start_date: string;
  plan_name: string;
}

interface ATPEvent {
  event_name: string;
  event_date: string;
  priority: "A" | "B" | "C";
}

interface AthletePhysiology {
  hr_max?: number;
  hr_rest?: number;
  vo2max?: number;
  lactate_threshold_hr?: number;
}

interface GenerateBlockRequest {
  athlete_id: string;
  coach_id?: string;
  requested_by_role: "athlete" | "coach";
  block_weeks?: number;
  block_start_date?: string;
  focus?: string;
  additional_context?: string;
  sessions_per_week?: number;
  sport?: string;
  sub_disciplines?: string[];
  session_duration_hours?: number;
  weekly_hours?: number;
}

interface LibraryWorkout {
  id: string;
  name: string;
  sport: string;
  sub_discipline?: string;
  estimated_duration_minutes?: number;
  estimated_impulse?: number;
  description?: string;
  intensity_basis?: string;
  difficulty_color?: string;
}

interface WeekBlock {
  week_number: number;
  week_start_date: string;
  microcycle_type: "load" | "load_peak" | "deload";
  target_impulse: number;
  sessions: SessionBlock[];
  weekly_notes: string;
}

interface SessionBlock {
  day_of_week: number;
  sport: string;
  session_name: string;
  description: string;
  intensity_basis: string;
  estimated_duration_minutes: number;
  estimated_impulse: number;
  target_zone?: number;
  target_percent_ftp?: number;
  category: string;
  key_points: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: GenerateBlockRequest = await req.json();
    const {
      athlete_id,
      coach_id,
      requested_by_role,
      block_weeks = 4,
      block_start_date,
      focus,
      additional_context,
      sessions_per_week = 4,
      sport = "cycling",
      sub_disciplines = [],
      session_duration_hours,
      weekly_hours,
    } = body;

    if (!athlete_id) {
      return new Response(JSON.stringify({ error: "athlete_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: aiSettings } = await supabase
      .from("ai_feature_settings")
      .select("*")
      .single();

    if (!aiSettings?.ai_enabled) {
      return new Response(
        JSON.stringify({ error: "AI block generation is currently disabled by the administrator." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const startDate = block_start_date || new Date().toISOString().split("T")[0];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + block_weeks * 7 - 1);
    const blockEndDate = endDate.toISOString().split("T")[0];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const [sessionsRes, atpPlanRes, physiologyRes, ftpRes] = await Promise.all([
      supabase
        .from("training_sessions")
        .select("session_date, sport, duration_minutes, perceived_effort, fatigue_level, avg_heart_rate, avg_power_watts, notes, status")
        .eq("athlete_id", athlete_id)
        .gte("session_date", thirtyDaysAgoStr)
        .order("session_date", { ascending: false })
        .limit(20),
      supabase
        .from("atp_plans")
        .select("*, atp_events(*)")
        .eq("athlete_id", athlete_id)
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("athlete_physiology")
        .select("hr_max, hr_rest, vo2max, lactate_threshold_hr")
        .eq("athlete_id", athlete_id)
        .maybeSingle(),
      supabase
        .from("athlete_ftp")
        .select("current_ftp_watts")
        .eq("athlete_id", athlete_id)
        .maybeSingle(),
    ]);

    const recentSessions: TrainingSession[] = sessionsRes.data || [];
    const atpPlan: ATPPlan | null = atpPlanRes.data;
    const events: ATPEvent[] = atpPlanRes.data?.atp_events || [];
    const physiology: AthletePhysiology | null = physiologyRes.data;
    const ftp: number | null = ftpRes.data?.current_ftp_watts || null;

    // Fetch library workouts for the selected sport
    const libraryQuery = supabase
      .from("workouts")
      .select("id, name, sport, sub_discipline, estimated_duration_minutes, estimated_impulse, description, intensity_basis, difficulty_color")
      .eq("is_library", true)
      .eq("sport", sport === "triathlon" ? "cycling" : sport)
      .limit(60);

    const libraryQuery2 = sport === "triathlon"
      ? supabase
          .from("workouts")
          .select("id, name, sport, sub_discipline, estimated_duration_minutes, estimated_impulse, description, intensity_basis, difficulty_color")
          .eq("is_library", true)
          .in("sport", ["running", "swimming"])
          .limit(40)
      : null;

    const [libraryRes, libraryRes2] = await Promise.all([libraryQuery, libraryQuery2]);
    const libraryWorkouts: LibraryWorkout[] = [
      ...(libraryRes.data || []),
      ...(libraryRes2?.data || []),
    ];

    const avgRPE = recentSessions.filter((s) => s.perceived_effort).length > 0
      ? (recentSessions.filter((s) => s.perceived_effort).reduce((sum, s) => sum + (s.perceived_effort || 0), 0) /
          recentSessions.filter((s) => s.perceived_effort).length).toFixed(1)
      : "N/A";

    const avgFatigue = recentSessions.filter((s) => s.fatigue_level).length > 0
      ? (recentSessions.filter((s) => s.fatigue_level).reduce((sum, s) => sum + (s.fatigue_level || 0), 0) /
          recentSessions.filter((s) => s.fatigue_level).length).toFixed(1)
      : "N/A";

    const totalRecentLoad = recentSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const sportDistribution = recentSessions.reduce((acc, s) => {
      acc[s.sport] = (acc[s.sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const upcomingEvents = events
      .filter((e) => new Date(e.event_date) >= new Date(startDate))
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 3);

    const isSingleSession = block_weeks === 1 && session_duration_hours !== undefined;
    const targetDurationMin = session_duration_hours ? Math.round(session_duration_hours * 60) : null;
    const targetWeeklyMin = weekly_hours ? Math.round(weekly_hours * 60) : null;

    const contextSummary = {
      sessions_last_30_days: recentSessions.length,
      total_load_last_30_days: totalRecentLoad,
      avg_rpe: avgRPE,
      avg_fatigue: avgFatigue,
      sport_distribution: sportDistribution,
      ftp_watts: ftp,
      hr_max: physiology?.hr_max,
      hr_rest: physiology?.hr_rest,
      vo2max: physiology?.vo2max,
      atp_plan: atpPlan
        ? {
            name: atpPlan.plan_name,
            ca_current: atpPlan.ca_start,
            al_current: atpPlan.al_start,
            rb_min: atpPlan.rb_min,
            rb_peak_target: atpPlan.rb_peak_target,
            ca_target: atpPlan.ca_target_main_event,
          }
        : null,
      upcoming_events: upcomingEvents,
      block_weeks,
      block_start_date: startDate,
      focus: focus || "general",
      sport,
      sub_disciplines,
      sessions_per_week,
      weekly_hours,
      session_duration_hours,
      library_workouts_available: libraryWorkouts.length,
    };

    const libraryWorkoutsList = libraryWorkouts
      .slice(0, 80)
      .map((w) =>
        `- [${w.sport}] "${w.name}"${w.sub_discipline ? ` (${w.sub_discipline})` : ""} | ${w.estimated_duration_minutes || "?"}min | impulse:${w.estimated_impulse || "?"} | ${w.difficulty_color || "?"} | ${w.intensity_basis || "?"}`
      )
      .join("\n");

    const systemPrompt = `You are an expert endurance sports coach and exercise physiologist specializing in the Banister Fitness-Fatigue model.
Your role is to build training plans EXCLUSIVELY using workouts from the provided training library. You MUST NOT invent workouts.

BANISTER MODEL CONTEXT:
- CA (Chronic Adaptation): Long-term fitness indicator (tau = 28 days decay)
- AL (Acute Load): Short-term fatigue indicator (tau = 7 days decay)
- RB (Readiness Balance): CA - AL (positive = fresh, negative = fatigued)
- Impulse: Daily training load unit

TRAINING ZONES (HRR Karvonen):
- Z1 Recovery: <50% HRR | Z2 Aerobic Base: 50-60% | Z3 Tempo: 60-70% | Z4 Threshold: 70-85% | Z5 VO2max: >85%

POWER ZONES (%FTP):
- Z1: <55% | Z2: 56-75% | Z3: 76-90% | Z4: 91-105% | Z5: 106-120%

MICROCYCLE STRUCTURE: 3 build weeks + 1 deload week (~75% load)

CRITICAL RULE: Every session you include MUST be taken directly from the TRAINING LIBRARY provided in the user prompt. Use the exact name, duration, impulse and intensity_basis from the library entry. You may only pick sessions whose sport matches the requested sport.

You must return a JSON object with this exact structure:
{
  "block_name": "string",
  "rationale": "string (2-3 sentences)",
  "weeks": [
    {
      "week_number": 1,
      "week_start_date": "YYYY-MM-DD",
      "microcycle_type": "load|load_peak|deload",
      "target_impulse": number,
      "weekly_notes": "string",
      "sessions": [
        {
          "day_of_week": 1-7,
          "sport": "cycling|running|swimming|triathlon",
          "session_name": "string (exact name from library)",
          "description": "string",
          "intensity_basis": "power|hr|pace|rpe",
          "estimated_duration_minutes": number,
          "estimated_impulse": number,
          "target_zone": 1-5,
          "target_percent_ftp": number,
          "category": "endurance|threshold|vo2max|sprint|recovery|other",
          "key_points": ["string", "string"]
        }
      ]
    }
  ]
}

RULES:
- Use ONLY workouts from the provided library
- Match session duration to athlete's volume constraints
- Rest days are NOT listed
- Day numbers: 1=Monday ... 7=Sunday
- Deload week: ~75% of peak week load
- For triathlon: distribute across cycling, running, swimming`;

    const userPrompt = `${isSingleSession ? `Generate a SINGLE training session of ~${targetDurationMin} minutes` : `Generate a ${block_weeks}-week training block starting ${startDate}`} for this athlete.

SPORT: ${sport}${sub_disciplines.length > 0 ? ` | Disciplines: ${sub_disciplines.join(", ")}` : ""}
SESSIONS PER WEEK: ${sessions_per_week}
${isSingleSession ? `TARGET DURATION: ~${targetDurationMin} minutes` : `WEEKLY VOLUME TARGET: ~${targetWeeklyMin || "not specified"} minutes/week (${weekly_hours || "?"}h)`}
BLOCK FOCUS: ${focus || "General fitness development"}

ATHLETE DATA (last 30 days):
- Sessions: ${recentSessions.length} | Total time: ${totalRecentLoad} min | Avg RPE: ${avgRPE}/10 | Avg fatigue: ${avgFatigue}/10

CURRENT FITNESS:
- FTP: ${ftp ? `${ftp}W` : "Not set"} | HR Max: ${physiology?.hr_max || "?"} | HR Rest: ${physiology?.hr_rest || "?"} | VO2max: ${physiology?.vo2max ? `${physiology.vo2max} ml/kg/min` : "?"}

BANISTER MODEL STATE:
${atpPlan ? `CA: ${atpPlan.ca_start} | AL: ${atpPlan.al_start} | RB: ${(atpPlan.ca_start - atpPlan.al_start).toFixed(1)} | RB target: ${atpPlan.rb_peak_target}` : "No ATP plan"}

UPCOMING EVENTS:
${upcomingEvents.length > 0 ? upcomingEvents.map((e) => `- ${e.event_name} (${e.event_date}, Priority ${e.priority})`).join("\n") : "No upcoming events"}

${additional_context ? `COACH/ATHLETE NOTES: ${additional_context}\n` : ""}
TRAINING LIBRARY (use ONLY these workouts):
${libraryWorkoutsList || "No library workouts found — use best judgment"}

${isSingleSession ? "Return a block with exactly 1 week containing exactly 1 session." : ""}
Respond ONLY with the JSON object.`;

    let generatedBlock: { block_name: string; rationale: string; weeks: WeekBlock[] };
    let aiResponseRaw = "";

    if (openaiApiKey) {
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API failed: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      aiResponseRaw = openaiData.choices[0].message.content;
      generatedBlock = JSON.parse(aiResponseRaw);
    } else {
      generatedBlock = generateFallbackBlock(startDate, block_weeks, contextSummary, sportDistribution);
      aiResponseRaw = JSON.stringify(generatedBlock);
    }

    const blockName = generatedBlock.block_name || `AI Training Block — ${startDate}`;

    const { data: savedBlock, error: saveError } = await supabase
      .from("ai_generated_blocks")
      .insert({
        athlete_id,
        coach_id: coach_id || null,
        block_name: blockName,
        block_weeks,
        block_start_date: startDate,
        block_end_date: blockEndDate,
        ai_prompt: userPrompt,
        ai_response_raw: aiResponseRaw,
        status: "pending",
        context_summary: contextSummary,
        weeks: generatedBlock.weeks,
        requested_by_role,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Save error:", saveError);
      throw saveError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        block: savedBlock,
        rationale: generatedBlock.rationale,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-ai-block:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateFallbackBlock(
  startDate: string,
  blockWeeks: number,
  context: Record<string, unknown>,
  sportDistribution: Record<string, number>
) {
  const primarySport = Object.entries(sportDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || "cycling";

  const weeks = [];
  for (let w = 0; w < blockWeeks; w++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + w * 7);
    const weekStartStr = weekStart.toISOString().split("T")[0];
    const isDeload = (w + 1) % 4 === 0;
    const microcycleType = isDeload ? "deload" : w === 2 ? "load_peak" : "load";
    const loadMultiplier = isDeload ? 0.75 : w === 2 ? 1.1 : 1.0;

    const sessions = [];

    sessions.push({
      day_of_week: 1,
      sport: primarySport,
      session_name: isDeload ? "Recovery Ride / Easy Run" : "Aerobic Base",
      description: isDeload
        ? "Easy aerobic session at Z1-Z2. Focus on active recovery, keep HR well below threshold. Enjoy the process."
        : "Classic aerobic base session. Maintain Z2 effort throughout. This is the foundation of your fitness.",
      intensity_basis: primarySport === "cycling" ? "power" : "hr",
      estimated_duration_minutes: Math.round(60 * loadMultiplier),
      estimated_impulse: Math.round(55 * loadMultiplier),
      target_zone: isDeload ? 1 : 2,
      target_percent_ftp: primarySport === "cycling" ? 65 : undefined,
      category: isDeload ? "recovery" : "endurance",
      key_points: ["Stay aerobic", "Breathing conversational", "Consistent cadence/pace"],
    });

    sessions.push({
      day_of_week: 3,
      sport: primarySport,
      session_name: isDeload ? "Tempo Maintenance" : "Threshold Intervals",
      description: isDeload
        ? "Moderate tempo effort to maintain sharpness. 20min at Z3, keep it controlled."
        : "Classic 2x20min threshold intervals at 95-100% FTP / Z4 HR. Core session for fitness building.",
      intensity_basis: primarySport === "cycling" ? "power" : "hr",
      estimated_duration_minutes: Math.round(65 * loadMultiplier),
      estimated_impulse: Math.round(72 * loadMultiplier),
      target_zone: isDeload ? 3 : 4,
      target_percent_ftp: primarySport === "cycling" ? (isDeload ? 85 : 97) : undefined,
      category: isDeload ? "endurance" : "threshold",
      key_points: isDeload
        ? ["Keep HR controlled", "Not a hard effort", "Flush legs"]
        : ["Hold steady power/pace", "Control breathing", "Mental focus"],
    });

    sessions.push({
      day_of_week: 6,
      sport: primarySport,
      session_name: isDeload ? "Easy Long Ride/Run" : "Long Aerobic Endurance",
      description: isDeload
        ? "Easy 90min session at Z1-Z2. No pressure, enjoy movement. Preparation for next block."
        : "Long aerobic session at Z2. Build aerobic capacity and fat oxidation. Fuel every 45min.",
      intensity_basis: "hr",
      estimated_duration_minutes: Math.round(90 * loadMultiplier),
      estimated_impulse: Math.round(80 * loadMultiplier),
      target_zone: 2,
      category: "endurance",
      key_points: ["Aerobic intensity only", "Consistent effort", "Nutrition on longer sessions"],
    });

    if (!isDeload) {
      sessions.push({
        day_of_week: 5,
        sport: primarySport,
        session_name: "VO2max Intervals",
        description: "Short high-intensity intervals at VO2max. 5x4min at Z5 with 4min recovery. Develops aerobic ceiling.",
        intensity_basis: primarySport === "cycling" ? "power" : "hr",
        estimated_duration_minutes: 55,
        estimated_impulse: 68,
        target_zone: 5,
        target_percent_ftp: primarySport === "cycling" ? 115 : undefined,
        category: "vo2max",
        key_points: ["Full recovery between reps", "Last rep as hard as first", "Rate of perceived effort: very hard"],
      });
    }

    const totalImpulse = sessions.reduce((sum, s) => sum + s.estimated_impulse, 0);

    weeks.push({
      week_number: w + 1,
      week_start_date: weekStartStr,
      microcycle_type: microcycleType,
      target_impulse: totalImpulse,
      weekly_notes: isDeload
        ? "Recovery week. Prioritize sleep and nutrition. Let adaptations consolidate before next build block."
        : w === 2
        ? "Peak load week. This is the hardest week of the block. Trust the process."
        : `Build week ${w + 1}. Progressive overload, stay consistent.`,
      sessions,
    });
  }

  return {
    block_name: `AI Training Block — ${primarySport.charAt(0).toUpperCase() + primarySport.slice(1)} Focus`,
    rationale: `This ${blockWeeks}-week block follows a 3:1 load:deload structure based on your recent training history. Progressive overload is applied across weeks 1-3 with a recovery deload in week 4 to consolidate adaptations in the Banister CA model.`,
    weeks,
  };
}
