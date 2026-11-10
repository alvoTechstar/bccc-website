/**
 * Endpoint path builders for the standalone bccc-backend API.
 * Re-exported from "@/lib/api" so existing imports from
 * "@/utilities/Endpoints" keep working.
 *
 * Set VITE_API_URL to point at the backend, e.g.
 * VITE_API_URL=https://bccc-backend.onrender.com
 * Leave empty for same-origin (Vite proxy / same-host deploy).
 */
export { Endpoints, API_BASE, api } from "@/lib/api";
export type {
  GivingCreateResponse,
  GivingStatusResponse,
  MpesaStatusResponse,
  ContactCreateResponse,
} from "@/lib/api";
