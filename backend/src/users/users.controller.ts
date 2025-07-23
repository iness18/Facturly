import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtenir le profil de l'utilisateur connecté
  @Get('profile')
  async getProfile(@Request() req: any) {
    // TODO: Récupérer l'ID depuis le token JWT
    const userId = 'temp-user-id';
    return this.usersService.findById(userId);
  }

  // Mettre à jour le profil de l'utilisateur connecté
  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body() updateData: { name?: string; company?: string },
  ) {
    // TODO: Récupérer l'ID depuis le token JWT
    const userId = 'temp-user-id';
    return this.usersService.update(userId, updateData);
  }

  // Obtenir un utilisateur par ID (pour admin)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
