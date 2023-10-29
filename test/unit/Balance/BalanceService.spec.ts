import { BalanceService } from '../../../src/Balance/BalanceService';
import { Test } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';
import { Account } from '../../../src/Account/Entities/Account';
import UnitTestsHelpers from '../UnitTestsHelpers';
import BuyInvestmentTransaction from '../../../src/InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../../../src/InvestmentTransaction/Entities/SellInvestmentTransaction';
import { CurrentUserService } from '../../../src/Auth/CurrentUserService';
import { User } from '../../../src/Users/Entities/User';
import { InvalidArgumentException } from '../../../src/Shared/Exceptions/InvalidArgumentException';

describe('BalanceService', () => {
  let balanceService: BalanceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: UnitTestsHelpers.getRepositoriesToMock([
        Account,
        BuyInvestmentTransaction,
        SellInvestmentTransaction,
      ]).concat([BalanceService, CurrentUserService]),
    }).compile();

    balanceService = await moduleRef.resolve<BalanceService>(BalanceService);

    jest
      .spyOn(balanceService.currentUserService, 'getCurrentUser')
      .mockReturnValue(new User('email@email.com', ''));
  });

  describe('getAllAssetsBalance', () => {
    it('fails if no account is found', async () => {
      jest
        .spyOn(balanceService.accountRepository, 'findOneByOrFail')
        .mockImplementationOnce(() => {
          throw new EntityNotFoundError(Account, '');
        });

      await expect(
        balanceService.getAllAssetsBalance('incorrect'),
      ).rejects.toThrow(InvalidArgumentException);
    });
  });
});
