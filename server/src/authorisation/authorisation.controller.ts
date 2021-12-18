import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthorisationService } from './authorisation.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/api/auth')
export class AuthorisationController {
  constructor(private authorisationServise: AuthorisationService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authorisationServise.login(userDto);
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authorisationServise.registration(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return this.authorisationServise.getProfile(req.user);
  }
}
