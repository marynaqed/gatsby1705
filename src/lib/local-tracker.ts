import { addAnalyticsPlugin } from "@uniformdev/optimize-tracker-analytics"
import { createDefaultTracker } from "@uniformdev/optimize-tracker-browser"
import { indexedDbScopeStorage } from "@uniformdev/optimize-tracker-storage-indexeddb"
import { createCookieStorage } from "./cookie-storage"
import { analytics } from "./analytics"
import intentManifest from "./intentManifest.json"
import Cookies from "js-cookie"

export const localTracker = createDefaultTracker({
  intentManifest,
  addPlugins: [addAnalyticsPlugin({ analytics })],
  storage: {
    scopes: indexedDbScopeStorage({
      scoringStorage: createCookieStorage(Cookies),
    }),
  },
  logLevelThreshold: process.env.NODE_ENV === "production" ? "error" : "info",
})
