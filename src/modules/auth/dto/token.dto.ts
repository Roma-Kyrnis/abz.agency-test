export type CreateTokenDTO = {
  id: string;
  token: string;
};

type DefaultJWTPayload = {
  /** JWT default values: Create time and expired time */
  iat: number;
  exp: number;
};

export type SignTokenJWTPayload = {
  /** Token's ID */
  sub: string;
};

export type VerifyTokenJWTPayload = SignTokenJWTPayload & DefaultJWTPayload;
