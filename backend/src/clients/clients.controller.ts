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
  UseGuards,
} from '@nestjs/common';
import { ClientsMongoService } from './clients-mongo.service';
import { CreateClientMongoDto } from './dto/create-client-mongo.dto';
import { UpdateClientMongoDto } from './dto/update-client-mongo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsMongoService) {}

  // Créer un nouveau client
  @Post()
  async create(
    @Request() req: any,
    @Body() createClientDto: CreateClientMongoDto,
  ) {
    return this.clientsService.create(req.user.userId, createClientDto);
  }

  // Obtenir tous les clients de l'utilisateur
  @Get()
  async findAll(@Request() req: any, @Query('search') search?: string) {
    if (search) {
      return this.clientsService.search(req.user.userId, search);
    }

    return this.clientsService.findByUserId(req.user.userId);
  }

  // Obtenir un client par ID
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.clientsService.findByIdAndUserId(id, req.user.userId);
  }

  // Obtenir les statistiques d'un client
  @Get(':id/stats')
  async getStats(@Request() req: any, @Param('id') id: string) {
    // TODO: Implémenter les statistiques client avec MongoDB
    const client = await this.clientsService.findByIdAndUserId(
      id,
      req.user.userId,
    );
    return { client, stats: { invoiceCount: 0, totalAmount: 0 } };
  }

  // Mettre à jour un client
  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientMongoDto,
  ) {
    return this.clientsService.update(id, req.user.userId, updateClientDto);
  }

  // Supprimer un client
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.clientsService.delete(id, req.user.userId);
  }
}
