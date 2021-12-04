import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthorisationController } from './authorisation.controller';
import { AuthorisationService } from './authorisation.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthorisationController],
  providers: [AuthorisationService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET_2021',
      signOptions: { expiresIn: '24h' },
    }),
  ],
})
export class AuthorisationModule {}
