import { createFileRoute } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

// TODO: need way to get mocked initData
// and in prod work as usual too
function RouteComponent() {
  const lp = useLaunchParams()
  // TODO: maybe no need for useMemo?
  const telegramId = useMemo(
    () => lp.initData!.user!.id.toString(),
    [lp.initData],
  )
  const telegramUsername = useMemo(
    () => lp.initData!.user!.username,
    [lp.initData],
  )
  console.log(telegramId, telegramUsername)

  return (
    <>
      <div></div>
    </>
  )
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
})
