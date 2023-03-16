export interface NewAccount {
  email: string
  pw: string
  user_code: string
  set_date: string
  created_at: number
}

export interface MailVerification {
  code: string
  at: number
}

export interface Email {
  email: string
}

export interface EmailOptions {
  from: string
  to: Email
  subject: string
  html: string
}

export interface LoginDto {
  email: string
  pw: string
}

export interface payload {
  idx: number
  email: string
  token_type: string
  iat: number
  exp: number
}
