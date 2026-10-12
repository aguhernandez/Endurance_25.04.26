# Asciende Cycling Satellite

A minimal cycling training management platform for coaches and athletes.

## Overview

This app is the **Endurance Planner** satellite module of the Asciende platform. User authentication is handled by the Hub. Planner-to-Hub session analysis and review data are exchanged through Hub Edge Function actions using the `X-Planner-Token` header; the Planner does not read wearable tables or raw activity payloads.

## Key Features

### For Athletes
- View cycling sessions (planned and completed)
- Log completed sessions with objective and subjective metrics
- Track FTP (Functional Threshold Power)
- View zone distribution analysis
- Monitor training load and intensity

### For Coaches
- View all athletes
- Plan cycling sessions for athletes
- Track athlete progress and training load
- Update athlete FTP values
- View session history and metrics

## Database Structure

### Tables Created
1. **profiles** - User profiles with role (athlete/coach)
2. **athlete_ftp** - Current FTP for each athlete (one per athlete)
3. **cycling_sessions** - Raw session data only (no derived metrics)

### Design Philosophy: Raw Data + On-the-Fly Calculations

**What we STORE (immutable raw data):**
- Duration, distance, average power
- Perceived effort, fatigue level
- Session metadata (date, name, notes, status)

**What we CALCULATE (runtime, never stored):**
- **Relative Intensity**: (Avg Power / FTP) × 100
- **Session Load**: Duration × (Avg Power / FTP)
- **Power Zone**: Based on % of current FTP

**Why this design is correct:**
When FTP changes, all historical sessions automatically reflect the new zones and intensities. No stale data. No database updates. No squared values. Simple, interpretable, retroactive.

### Power Zones (Based on FTP)
- Z1: 0-55% (Recovery)
- Z2: 56-75% (Endurance)
- Z3: 76-90% (Tempo)
- Z4: 91-105% (Threshold)
- Z5: >105% (VO2max)

## Design

- Primary color: `#fdda36` (Yellow)
- Secondary color: `#514163` (Purple)
- Clean, COROS-style simplicity
- Responsive design for all devices

## Integration with HUB

The Planner and Hub have separate Supabase projects. The Hub owns login, access checks, session analysis, timeseries, and review storage. Configure the Hub project URL with `VITE_HUB_API_URL`; the session review Edge Function defaults to the existing `endurance-satellite-bridge` and can be overridden with `VITE_HUB_SESSION_REVIEW_FUNCTION`. The Planner sends `get-session-analysis`, `get-session-timeseries`, `list-review-inbox`, and `save-review` actions using its configured `X-Planner-Token`.

The analysis view accepts `?view=session-analysis&athlete=<id>&planned=<id|none>&executed=<id|none>`. When no Hub session is present, it redirects to Hub login with the full Planner URL as the return address.

### Session analysis tests

Run `npm test` to render the capability blocks against synthetic fixtures. Fixtures live under `tests/fixtures` and are not imported into the production app.

## Getting Started

1. Sign in with your existing Asciende Hub account
2. Continue planning and reviewing sessions in the Planner; Hub permissions control access to Hub session data

## Technical Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase client (Planner data; Hub auth and session actions are accessed through the Hub API)
- Lucide React (Icons)
