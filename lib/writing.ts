import { unstable_cache } from "next/cache";
import { fetchWriting } from "./feed";

// Throw inside the cache callback: failed refreshes must not replace real cached posts.
export const getWriting = unstable_cache(async () => {
  try {
    return await fetchWriting();
  } catch (error) {
    console.warn("[writing] RSS refresh failed:", error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
}, ["substack-writing-v1"], { revalidate: 3600 });
