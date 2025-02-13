import { createFileRoute, Outlet } from "@tanstack/react-router"
import TelegramProvider from "~/lib/telegram/telegram-provider"

function RouteComponent() {
  return (
    <>
      <TelegramProvider>
        <Outlet />
      </TelegramProvider>
    </>
  )
}

export const Route = createFileRoute("/app")({
  component: RouteComponent,
})
