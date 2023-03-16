export namespace JwtInterface {

  export interface Token {
    email: string;
    account_id: string;
    lang: string;
    account_name: string;
    birthday?: string;
    seq?: string;
    iat?: string;  // issue at : token 발급시간
    exp?: string;
    sub?: string;
  }
}
