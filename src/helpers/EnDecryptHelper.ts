import { app } from "../app"
import { createCipheriv, createDecipheriv } from "crypto"

export class EnDecryptHelper {
  /**
   * 암호화 하기 -> base64 encode -> return
   * @param message
   */
  public static async encrypt(message) {
    const cipher = createCipheriv(app().config.crypto.cipher, app().config.crypto.secret, app().config.crypto.iv)
    const encryptedText = Buffer.concat([cipher.update(message), cipher.final()]).toString("base64")

    return decodeURIComponent(btoa(encryptedText))
  }

  /**
   * 암호화된 값 복호화 하기
   * @param encryptedMessage
   */
  public static async decrypt(encryptedMessage) {
    const decryptedText = atob(decodeURIComponent(encryptedMessage))

    const decryptedBuffer = Buffer.from(decryptedText, "base64")
    const decipher = createDecipheriv(app().config.crypto.cipher, app().config.crypto.secret, app().config.crypto.iv)
    return Buffer.concat([decipher.update(decryptedBuffer), decipher.final()]).toString("binary")
  }
}
