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
    // Pour l'instant, on utilise l'utilisateur de test
    const user = await this.usersService.findByEmail('test@facturly.com');
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return this.usersService.findById(user.id);
  }

  // Mettre à jour le profil de l'utilisateur connecté
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    // TODO: Récupérer l'ID depuis le token JWT
    // Pour l'instant, on utilise l'utilisateur de test
    const user = await this.usersService.findByEmail('test@facturly.com');
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return this.usersService.update(user.id, updateData);
  }

  // Obtenir un utilisateur par ID (pour admin)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
