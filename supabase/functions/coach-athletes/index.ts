import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Planner-Token, X-Hub-Token",
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const plannerToken = req.headers.get("X-Planner-Token") || "";
    if (!plannerToken) {
      return new Response(JSON.stringify({ error: "Missing X-Planner-Token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const coachId = url.searchParams.get("coach_id") || "";
    const hubToken = req.headers.get("X-Hub-Token") || "";

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let assignedAthletes: string[] | null = null;

    if (hubToken) {
      const payload = decodeJwtPayload(hubToken);
      if (payload && Array.isArray(payload.assigned_athletes)) {
        assignedAthletes = payload.assigned_athletes as string[];
      }
    }

    let query = serviceClient
      .from("profiles")
      .select("id, email, full_name, role, hub_user_id, created_at")
      .eq("role", "athlete")
      .order("full_name");

    if (assignedAthletes && assignedAthletes.length > 0) {
      query = query.in("hub_user_id", assignedAthletes);
    }

    const { data: athletes, error } = await query;

    if (error) throw error;

    if (assignedAthletes && assignedAthletes.length > 0) {
      const existingIds = new Set((athletes || []).map((a: any) => a.hub_user_id));
      const missingIds = assignedAthletes.filter(id => !existingIds.has(id));
      if (missingIds.length > 0) {
        const { data: stubs } = await serviceClient
          .from("profiles")
          .select("id, email, full_name, role, hub_user_id, created_at")
          .in("id", missingIds)
          .eq("role", "athlete");
        if (stubs && stubs.length > 0) {
          athletes.push(...stubs);
        }
      }
    }

    return new Response(JSON.stringify({ athletes: athletes || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
