import { Injectable, Scope } from '@nestjs/common';
import { Account } from '../Account/Entities/Account';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';

@Injectable({ scope: Scope.REQUEST })
export class CurrentAccountService {
  private static currentAccount: Account = null;

  static init(currentAccount: Account) {
    CurrentAccountService.currentAccount = currentAccount;
  }

  getCurrentAccountOrFail(): Account {
    if (CurrentAccountService.currentAccount) {
      return CurrentAccountService.currentAccount;
    } else {
      throw new InvalidArgumentException(
        'Trying to get current account but is not provided',
        "You don't have permissions to use provided account id",
      );
    }
  }
}
