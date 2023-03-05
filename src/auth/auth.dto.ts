export class Tokens {
  //   @IsString()
  //   @IsNotEmpty()
  accessToken: string;

  //   @IsString()
  //   @IsNotEmpty()
  refreshToken: string;
}

export class RefreshToken {
  //   @IsString()
  //   @IsNotEmpty()
  refreshToken: string;
}

export class TokenPayload {
  userId: string;
  login: string;
}
