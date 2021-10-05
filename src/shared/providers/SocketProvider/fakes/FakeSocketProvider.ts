import ISocketProvider from '../models/ISocketProvider';

export default class FakeSocketProvider implements ISocketProvider {
  private sockets: { eventName: string; args: any[] }[] = [];

  public emit(eventName: string, ...args: any[]): void {
    this.sockets.push({ eventName, args });
  }
}
