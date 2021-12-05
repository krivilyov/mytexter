import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/authorisation/roles.decorator';
import { RolesGuard } from 'src/authorisation/roles.guard';

@Controller('/api')
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @Post('/users')
  create(@Body() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/users')
  getAllUsers() {
    return this.usersServise.getAllUsers();
  }
}
