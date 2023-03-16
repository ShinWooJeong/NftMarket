import { HttpException } from "@nestjs/common";


export class JwtException extends HttpException {
  constructor(errorMessage : string = '', code : number = 1004, errorDetailMessage = null, status: number = 400) {
    const responseJson: any = {}

    responseJson.code = code
    responseJson.message = errorMessage
    if (errorDetailMessage) {
      responseJson.detail = errorDetailMessage
    }
    super(responseJson, status)
  }
}
