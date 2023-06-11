import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { hashSync } from 'bcryptjs';

import { Users } from '../entities';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<Users> {
  listenTo() {
    return Users;
  }

  beforeInsert(event: InsertEvent<Users>) {
    const hashPassword = hashSync(event.entity.password);
    event.entity.password = hashPassword;
  }
}
