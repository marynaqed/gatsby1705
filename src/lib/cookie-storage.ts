import { cookieScoringStorage } from "@uniformdev/optimize-tracker"
import { CookiesStatic } from "js-cookie"
export const createCookieStorage = (cookiesApi: CookiesStatic<any>) => {
  const cookieStorage = cookieScoringStorage({
    getCookie: name => {
      return (cookiesApi.get as any)(name, { parseJSON: false })
    },
    setCookie: (name, value) => {
      if (typeof window === "undefined") {
        return
      }

      cookiesApi.set(name, value, {
        expires: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "strict",
        secure: window.location.protocol === "https:",
      })
    },
  })

  return cookieStorage
}
