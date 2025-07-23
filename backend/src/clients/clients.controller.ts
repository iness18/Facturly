import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // Créer un nouveau client
  @Post()
  async create(@Request() req: any, @Body() createClientDto: CreateClientDto) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'temp-user-id';
    return this.clientsService.create(userId, createClientDto);
  }

  // Obtenir tous les clients de l'utilisateur
  @Get()
  async findAll(@Request() req: any, @Query('search') search?: string) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'temp-user-id';

    if (search) {
      return this.clientsService.search(userId, search);
    }

    return this.clientsService.findAll(userId);
  }

  // Obtenir un client par ID
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'temp-user-id';
    return this.clientsService.findOne(userId, id);
  }

  // Obtenir les statistiques d'un client
  @Get(':id/stats')
  async getStats(@Request() req: any, @Param('id') id: string) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'temp-user-id';
    return this.clientsService.getClientStats(userId, id);
  }

  // Mettre à jour un client
  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'temp-user-id';
    return this.clientsService.update(userId, id, updateClientDto);
  }

  // Supprimer un client
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'temp-user-id';
    return this.clientsService.remove(userId, id);
  }
}
