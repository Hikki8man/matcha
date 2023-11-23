import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user_id?: number;
}
