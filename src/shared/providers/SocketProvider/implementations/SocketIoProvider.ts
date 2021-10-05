import { Server } from 'socket.io';
import { inject, injectable } from 'tsyringe';

import ISocketProvider from '../models/ISocketProvider';

@injectable()
export default class SocketIoProvider implements ISocketProvider {
  constructor(
    @inject('SocketIo')
    private socketIo: Server,
  ) {}

  public emit(eventName: string, ...args: any[]): void {
    this.socketIo.emit(eventName, ...args);
  }
}
