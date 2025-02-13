import { Api, TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import bigInt from "big-integer"
import Photo = Api.Photo
import { Buffer } from "buffer"

class TelegramApiClient {
  private static instance: TelegramApiClient

  private client: TelegramClient
  private apiId: number
  private apiHash: string
  private botToken: string

  private avatarsQueue: (() => Promise<void>)[] = []
  private downloadedAvatars = 0
  private isProcessingInAvatarQueue = false
  private inFlightAvatarPromises: Map<string, Promise<Buffer>> = new Map()

  private constructor(
    api_id: number,
    api_hash: string,
    string_session: string,
    bot_token: string,
  ) {
    this.apiId = api_id
    this.apiHash = api_hash
    this.botToken = bot_token

    this.client = new TelegramClient(
      new StringSession(string_session),
      api_id,
      api_hash,
      {
        connectionRetries: 5,
      },
    )
  }

  public async initialize(): Promise<void> {
    try {
      if (!this.client.connected) {
        await this.client.start({
          botAuthToken: this.botToken,
        })
        console.log("Telegram client connected.")
      }
    } catch (error) {
      console.error("Failed to connect Telegram client:", error)
      throw error
    }
  }

  public async sendSignInCode(phoneNumber: string): Promise<void> {
    await this.initialize()
    await this.client.sendCode(
      {
        apiId: this.apiId,
        apiHash: this.apiHash,
      },
      phoneNumber,
    )
  }

  public async signIn(
    phoneNumber: string,
    password: string,
    phoneCode: string,
  ): Promise<void> {
    try {
      return await this.client.start({
        phoneNumber,
        password: userAuthParamCallback(password),
        phoneCode: userAuthParamCallback(phoneCode),
        onError: (e) => {
          console.log(e)
          return
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  public getSession(): string {
    return JSON.stringify(this.client.session.save())
  }

  async getPhoto(username: string): Promise<Buffer> {
    if (this.inFlightAvatarPromises.has(username)) {
      return this.inFlightAvatarPromises.get(username)!
    }

    const avatarPromise = new Promise<Buffer>((resolve, reject) => {
      const task = async () => {
        try {
          await this.initialize()

          if (this.downloadedAvatars % 4 === 0 && this.downloadedAvatars !== 0)
            // TODO: sometime api return api rate limit exceed, catch time to wait before retry, 10 seconds is a default
            await new Promise((resolve) => setTimeout(resolve, 0))
          this.downloadedAvatars += 1
          const result = await this.client.invoke(
            new Api.photos.GetUserPhotos({
              userId: username,
            }),
          )

          const photo = result.photos[0] as Photo
          const fr = photo.fileReference

          const res = await this.client.downloadFile(
            new Api.InputPhotoFileLocation({
              id: photo.id,
              accessHash: photo.accessHash,
              fileReference: fr,
              thumbSize: "c",
            }),
            {
              dcId: photo.dcId,
              fileSize: bigInt(829542),
            },
          )

          if (Buffer.isBuffer(res)) {
            resolve(res)
          } else {
            throw new Error("Failed to download photo as a Buffer")
          }
        } catch (error) {
          reject(error)
        } finally {
          this.inFlightAvatarPromises.delete(username)
          this.processQueue()
        }
      }
      this.avatarsQueue.push(task)

      if (!this.isProcessingInAvatarQueue) {
        this.processQueue()
      }
    })

    this.inFlightAvatarPromises.set(username, avatarPromise)

    return avatarPromise
  }

  async getUserByUsername(username: string) {
    await this.initialize()
    const result = await this.client.invoke(
      new Api.users.GetUsers({
        id: [username],
      }),
    )
    return result
  }

  private async processQueue(): Promise<void> {
    if (this.avatarsQueue.length === 0) {
      this.isProcessingInAvatarQueue = false
      return
    }

    this.isProcessingInAvatarQueue = true
    const nextTask = this.avatarsQueue.shift()
    if (nextTask) {
      await nextTask()
    }
  }

  public static getInstance(
    api_id: number,
    api_hash: string,
    string_session: string,
    bot_token: string,
  ) {
    if (!TelegramApiClient.instance) {
      TelegramApiClient.instance = new TelegramApiClient(
        api_id,
        api_hash,
        string_session,
        bot_token,
      )
    }
    return TelegramApiClient.instance
  }
}

function userAuthParamCallback<T>(param: T): () => Promise<T> {
  return async function () {
    return await new Promise<T>((resolve) => {
      resolve(param)
    })
  }
}

export default TelegramApiClient
