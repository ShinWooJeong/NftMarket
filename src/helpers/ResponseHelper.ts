/**
 *
 * @param objectData
 */
export class Response {
  static success<T>(objectData: T = null): { code: number; message: string; data?: T } {
    const payloadData: any = {}
    payloadData.code = 200
    payloadData.message = "Success"

    if (objectData != null) {
      payloadData.data = objectData
    }

    return payloadData
  }

  static failure<T>(objectData: T = null): { code: number; message: string; data?: T } {
    const payloadData: any = {}
    payloadData.code = 400
    payloadData.message = "Fail"

    if (objectData != null) {
      payloadData.description = objectData
    }

    return payloadData
  }

  static rejection<T>(objectData: T = null): { code: number; message: string; data?: T } {
    const payloadData: any = {}
    payloadData.code = 202
    payloadData.message = "Rejection"

    if (objectData != null) {
      payloadData.description = objectData
    }

    return payloadData
  }
}
