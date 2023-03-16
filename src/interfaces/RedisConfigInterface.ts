export interface RedisConfigConfig {
  name?: string
  host: string
  port: number
  password: string
  select?: number
  subscribe?: any[]
  prefix?: any
  ttl?: number
}
