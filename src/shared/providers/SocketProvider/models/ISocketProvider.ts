export default interface ISocketProvider {
  emit(eventName: string, ...args: any[]): void;
}
