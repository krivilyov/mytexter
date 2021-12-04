import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthorisationService } from './authorisation.service';

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
}
