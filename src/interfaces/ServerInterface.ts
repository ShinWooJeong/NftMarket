import { ServerBaseConfigInterface } from "./ServerBaseConfigInterface";


export interface ServerInterface {
  onceStarted: boolean
  config: ServerBaseConfigInterface

  resume()
  stop(issue, detail)
}
