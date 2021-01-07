import { EventEmitter } from 'events';

export default class AppStore extends EventEmitter {
    listen(event, callback) {
        this.on(event, callback);
    }

    unlisten(event, callback) {
        this.removeListener(event, callback);
    }
}
