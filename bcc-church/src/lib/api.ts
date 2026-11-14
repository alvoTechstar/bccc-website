/**
 * Backwards-compatible barrel: the API surface lives in ONE place —
 * "@/utilities/Endpoints" (base URL + paths + fetch helpers + types).
 *
 * Existing `import ... from "@/lib/api"` statements keep working unchanged.
 */
export * from "@/utilities/Endpoints";
