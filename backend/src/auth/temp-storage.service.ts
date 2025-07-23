import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface TempUser {
  id: string;
  email: string;
  password: string;
  name: string;
  company?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

@Injectable()
export class TempStorageService {
  private users: TempUser[] = [];

  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }): Promise<Omit<TempUser, 'password'>> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = this.users.find(
      (user) => user.email === userData.email,
    );
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const user: TempUser = {
      id: 'temp-user-' + Date.now(),
      email: userData.email,
      password: userData.password, // Déjà haché
      name: userData.name,
      company: userData.company,
      role: 'USER',
      createdAt: new Date(),
    };

    this.users.push(user);
    console.log(
      `👤 User stored in memory: ${user.email} (Total: ${this.users.length})`,
    );

    // Retourner sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findUserByEmail(email: string): Promise<TempUser | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<TempUser, 'password'> | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  getAllUsers(): Omit<TempUser, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }
}
