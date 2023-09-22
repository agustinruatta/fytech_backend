import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/Auth/AuthService';
import { Repository } from 'typeorm';
import { User } from '../../../src/Users/Entities/User';
import InvalidCredentialsException from '../../../src/Shared/Exceptions/InvalidCredentialsException';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useFactory: () => {
            userRepository =
              jest.createMockFromModule<Repository<User>>('typeorm');
            userRepository.save = jest.fn();
            jwtService = jest.createMockFromModule<JwtService>('@nestjs/jwt');

            return new AuthService(userRepository, jwtService);
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login process', () => {
    it('fails if user is not found', async () => {
      userRepository.findOneBy = () => Promise.resolve(null);

      await expect(
        async () => await authService.signIn('invalid', 'password'),
      ).rejects.toThrow(new InvalidCredentialsException());
    });

    it('fails if password is wrong', async () => {
      userRepository.findOneBy = () =>
        Promise.resolve(new User('email@email.com', 'password'));

      await expect(
        async () => await authService.signIn('email@email.com', 'invalid'),
      ).rejects.toThrow(new InvalidCredentialsException());
    });

    it('returns access token if password is correct', async () => {
      const user = new User('email@email.com', 'password');

      userRepository.findOneBy = () => Promise.resolve(user);
      jwtService.sign = () => 'token_123';

      expect(
        await authService.signIn('email@email.com', 'password'),
      ).toStrictEqual({
        accessToken: 'token_123',
      });
    });
  });
});
