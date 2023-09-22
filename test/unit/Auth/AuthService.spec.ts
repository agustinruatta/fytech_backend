import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/Auth/AuthService';
import { Repository } from 'typeorm';
import { User } from '../../../src/Users/Entities/User';
import { InvalidArgumentException } from '../../../src/Shared/Exceptions/InvalidArgumentException';
import InvalidCredentialsException from '../../../src/Shared/Exceptions/InvalidCredentialsException';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useFactory: () => {
            userRepository =
              jest.createMockFromModule<Repository<User>>('typeorm');
            userRepository.save = jest.fn();

            return new AuthService(userRepository);
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

    it('returns user if password is correct', async () => {
      const user = new User('email@email.com', 'password');
      userRepository.findOneBy = () => Promise.resolve(user);

      expect(await authService.signIn('email@email.com', 'password')).toBe(
        user,
      );
    });
  });
});
