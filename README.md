# Asciende Cycling Satellite

A minimal cycling training management platform for coaches and athletes.

## Overview

This app is the **Cycling Satellite** module of the Asciende platform. It integrates with the main Asciende HUB by sharing the same Supabase database, allowing seamless data flow between gym workouts, nutrition tracking, and cycling training.

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

This app shares the same Supabase database as the Asciende HUB, enabling:
- Shared user authentication
- Cross-app visibility of training data
- Unified athlete management
- Coordinated training planning (gym + cycling)

## Getting Started

1. Sign up as an Athlete or Coach
2. (Athletes) Set your FTP and start logging sessions
3. (Coaches) Select an athlete and plan their cycling training

## Technical Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + Database)
- Lucide React (Icons)
