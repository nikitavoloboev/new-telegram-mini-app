import { createFileRoute } from "@tanstack/react-router"
import { retrieveLaunchParams } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

// TODO: need way to get mocked initData
// and in prod work as usual too
function RouteComponent() {
  const lp = useMemo(() => retrieveLaunchParams(true), [])
  console.log(lp)

  return (
    <>
      <div></div>
    </>
  )
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
})
