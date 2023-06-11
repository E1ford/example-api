import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { hashSync } from 'bcryptjs';

import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    const hashPassword = hashSync(event.entity.password);
    event.entity.password = hashPassword;
  }
}
