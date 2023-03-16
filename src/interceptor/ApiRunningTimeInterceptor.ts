import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { LogHelper } from "../helpers/LogHelper"

@Injectable()
export class ApiRunningTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("----------------------------------------------")
    const methodKey = context.getHandler().name
    const className = context.getClass().name
    const request = context.switchToHttp().getRequest()
    let start = process.hrtime()

    return next.handle().pipe(
      tap(function() {
        let stop = process.hrtime(start)
        LogHelper.info(`[${request.method}]\t ${request.url}\t | ${className} - ${methodKey} \t | Execute Time : ${(stop[0] * 1e9 + stop[1]) / 1e9}`)
      })
    )
  }
}
