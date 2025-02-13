import { createServerFn } from "@tanstack/start"
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.TELEGRAM_API_SERVER_ORIGIN,
})

export const $getTelegramPhoto = createServerFn({
  method: "GET",
})
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const response = await axiosInstance.get(`getUserAvatar/${ctx.data}`, {
      responseType: "arraybuffer",
    })

    return response.data
  })

export const $getTelegramUserByUsername = createServerFn({
  method: "GET",
})
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const response = await axiosInstance.get(`getUserByUsername/${ctx.data}`)

    return response.data
  })
