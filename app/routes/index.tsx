import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <>
      <div>landing page</div>
    </>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
