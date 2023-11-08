import { Injectable, Scope } from '@nestjs/common';
import { Account } from '../Account/Entities/Account';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';

@Injectable({ scope: Scope.REQUEST })
export class CurrentAccountService {
  private currentAccount: Account = null;

  setCurrentAccount(currentAccount: Account) {
    if (this.currentAccount !== null) {
      throw new Error('Trying to re-set current account');
    }

    this.currentAccount = currentAccount;
  }

  getCurrentAccountOrFail(): Account {
    if (this.currentAccount) {
      return this.currentAccount;
    } else {
      throw new InvalidArgumentException(
        'Trying to get current account but is not provided',
        "You don't have permissions to use provided account id",
      );
    }
  }
}
