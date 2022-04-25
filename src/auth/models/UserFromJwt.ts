export interface UserFromJwt {
  id: number;
  email: string;
  name?: string;
  refreshToken?: string;
}
