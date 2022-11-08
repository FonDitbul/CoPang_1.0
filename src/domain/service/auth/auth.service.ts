export interface IAuthService {
  signIn(rawPassword: string, hashedPassword: string): Promise<boolean>;
}
