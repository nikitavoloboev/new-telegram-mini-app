import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <>
      <div>pls show..</div>
    </>
  )
}

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
})