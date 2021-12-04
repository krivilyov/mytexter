import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('/api')
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @Post('/users')
  create(@Body() userDto: CreateUserDto) {
    return this.usersServise.createUser(userDto);
  }

  @Get('/users')
  getAllUsers() {
    return this.usersServise.getAllUsers();
  }
}
