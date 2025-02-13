import * as TelegramUI from "@telegram-apps/telegram-ui"
import { PropsWithChildren, useEffect } from "react"
const { AppRoot } = TelegramUI

import "@telegram-apps/telegram-ui/dist/styles.css"

// Mock the environment in case, we are outside Telegram.
import {
  initData,
  postEvent,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react"
import { init } from "./miniAppEnv/init"
import "./miniAppEnv/mock-env"

function TelegramProvider({ children }: PropsWithChildren) {
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV)
  useEffect(() => {
    try {
      if (initData) {
        if (!["macos", "tdesktop"].includes(retrieveLaunchParams().platform)) {
          postEvent("web_app_expand")
          postEvent("web_app_request_fullscreen")
          postEvent("web_app_setup_swipe_behavior", {
            allow_vertical_swipe: false,
          })
        }
      }
    } catch (e) {
      console.log("ERROR TG", e)
      console.log("The app runs outside of the telegram")
    }
  }, [])
  return (
    <AppRoot appearance={"dark"} platform={"base"}>
      {children}
    </AppRoot>
  )
}

export default TelegramProvider
