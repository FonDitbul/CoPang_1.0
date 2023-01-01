import { Injectable } from '@nestjs/common';
import { IPasswordEncryptor } from '../../../../domain/service/auth/encrypt/password.encryptor';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordBcryptEncryptor implements IPasswordEncryptor {
  async encrypt(rawPassword: string): Promise<string> {
    const salt = await PasswordBcryptEncryptor.generateSalt();
    return await bcrypt.hash(rawPassword, salt);
  }

  async compare(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }

  private static async generateSalt(): Promise<string> {
    const saltRound = 8;
    return await bcrypt.genSalt(saltRound);
  }
}
