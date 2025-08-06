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
import { UsersMongoService } from './users-mongo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersMongoService) {}

  // Obtenir le profil de l'utilisateur connecté
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  // Mettre à jour le profil de l'utilisateur connecté
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.update(req.user.userId, updateData);
  }

  // Obtenir un utilisateur par ID (pour admin)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
