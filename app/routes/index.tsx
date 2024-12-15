import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <>
      <div className="text-red-500">test</div>
    </>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
