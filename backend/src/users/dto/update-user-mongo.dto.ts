import { PartialType } from '@nestjs/mapped-types';
import { CreateUserMongoDto } from './create-user-mongo.dto';

export class UpdateUserMongoDto extends PartialType(CreateUserMongoDto) {}
