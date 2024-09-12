import { EventEmitter } from 'events';

let eventEmitter: EventEmitter;
export default function useEvents() {
  if (!eventEmitter) {
    eventEmitter = new EventEmitter();
  }

  return {
    emit: eventEmitter.emit.bind(eventEmitter),
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
    once: eventEmitter.once.bind(eventEmitter),
  }
}