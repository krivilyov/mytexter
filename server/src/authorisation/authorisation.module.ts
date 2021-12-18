import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthorisationController } from './authorisation.controller';
import { AuthorisationService } from './authorisation.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthorisationController],
  providers: [AuthorisationService, JwtStrategy],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: 'zG0xgap4IcgZy104vmN3jJZhmz1',
      signOptions: { expiresIn: '2m' },
    }),
  ],
  exports: [AuthorisationService, JwtModule],
})
export class AuthorisationModule {}
