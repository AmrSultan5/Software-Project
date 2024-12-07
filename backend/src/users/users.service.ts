import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  addUser(): string {
    return 'User added!';
  }
}
