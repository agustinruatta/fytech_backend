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

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('fails if email is invalid', () => {
      expect(() => usersService.createUser('invalid', 'password')).toThrow(
        new InvalidArgumentException('Invalid email'),
      );
    });

    it('creates user', () => {
      usersService.createUser('email@gmail.com', 'password');
      expect(userRepository.save).toBeCalledTimes(1);
    });
  });
});
