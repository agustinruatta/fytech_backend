import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/Users/UsersService';
import { Repository } from 'typeorm';
import { User } from '../../../src/Users/Entities/User';
import { InvalidArgumentException } from '../../../src/Shared/Exceptions/InvalidArgumentException';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useFactory: () => {
            userRepository =
              jest.createMockFromModule<Repository<User>>('typeorm');
            userRepository.save = jest.fn();

            return new UsersService(userRepository);
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  function withNoPreviousUser() {
    userRepository.countBy = () => Promise.resolve(0);
  }

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('fails if email is invalid', () => {
      withNoPreviousUser();

      expect(() =>
        usersService.createUser('invalid', 'password'),
      ).rejects.toThrow(
        new InvalidArgumentException('Invalid email', 'Invalid email'),
      );
    });

    it('fails if there is a previous user with provided email', () => {
      userRepository.countBy = () => Promise.resolve(1);

      expect(() =>
        usersService.createUser('existent_user@gmail.com', 'password'),
      ).rejects.toThrow(
        new InvalidArgumentException(
          'This email is already associated with another account',
          'This email is already associated with another account',
        ),
      );
    });

    it('calls repository when user is created', async () => {
      withNoPreviousUser();

      await usersService.createUser('email@gmail.com', 'password');
      expect(userRepository.save).toBeCalledTimes(1);
    });
  });
});
