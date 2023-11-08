import { Injectable, Scope } from '@nestjs/common';
import { User } from '../Users/Entities/User';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  private currentUser: User = null;

  public setCurrentUser(user: User) {
    if (this.currentUser !== null) {
      throw new Error('Trying to re-set current account');
    }

    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
