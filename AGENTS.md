# AGENTS.md - Developer & Agent Guide

## System Overview
MediCare Hospital Appointment Booking System is a full-featured web application built with:
- **Framework**: TanStack Start (Nitro + Vite + React 19)
- **Styling**: Tailwind CSS v4 + Creative Tim UI components
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`
- **Design Reference**: Dashboard V14 visual design language (slim vertical icon sidebar, horizontal pill navigation, cool lavender-grey background `#ECEBF4`, rounded-3xl white cards, signature coral-red `#FF5A36` accent).
- **Persistence**: `localStorage` (SSR-safe hydration guards).

## Key Architectural Rules
1. **Never re-run `@tanstack/create-start create .`** or delete the existing Vite/Nitro setup.
2. **SSR Safety**: Use hydration guards (`typeof window !== 'undefined'` or `useEffect`) when accessing `localStorage` to prevent server/client mismatch.
3. **Double Booking Prevention**: Always check `date` + `doctorId` + `timeSlot` against confirmed/pending appointments in `medicare_appointments`.
4. **No Past Dates**: Disallow booking on dates prior to today (`2026-11-06` / current local date).
5. **Creative Tim UI Styling**: Adapt Creative Tim UI components to match Dashboard V14's rounded curves (`rounded-2xl` / `rounded-3xl`), coral accents (`#FF5A36`), and sleek dark pills (`bg-zinc-900`).
6. **Role Switching**: Users can seamlessly switch between `Patient` and `Admin` personas via the header pill or quick switcher to test all workflows.
