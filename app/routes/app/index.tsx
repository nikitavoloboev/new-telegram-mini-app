import { createFileRoute } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"

function RouteComponent() {
  const lp = useLaunchParams()
  const startParam = lp.initData!.startParam
  console.log(startParam, "start param")
  return (
    <>
      <div className="text-white-500">mini app</div>
    </>
  )
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
})
