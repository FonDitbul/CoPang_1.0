export interface IAuthService {
  login(): Promise<void>;
  signIn(rawPassword: string, hashedPassword: string): Promise<boolean>;
}
