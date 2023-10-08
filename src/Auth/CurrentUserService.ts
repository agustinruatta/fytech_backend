import { Injectable, Scope } from '@nestjs/common';
import { User } from '../Users/Entities/User';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  private static currentUser: User = null;

  static init(currentUser: User) {
    CurrentUserService.currentUser = currentUser;
  }

  getCurrentUser(): User | null {
    return CurrentUserService.currentUser;
  }
}
