import { EventEmitter } from 'eventemitter3';

const DEFAULT_CONCURRENCE = 1;

export interface options {
    concurrence?: number;
    finishCb?: Function;
}

export default class TaksQueue {
    private tasks: Function[];
    private concurrence: number;

    private isRuning: boolean;
    private finishCb: Function;

    constructor(param: options) {
        this.concurrence = param.concurrence || DEFAULT_CONCURRENCE;
        this.tasks = [];
        this.isRuning = false;
        this.finishCb = param.finishCb || (() => {});
    }

    enqueue(tasks: Function[] | Function) {
        if (Array.isArray(tasks)) {
            this.tasks.push(...tasks);
        } else {
            this.tasks.push(tasks);
        }
    }

    start() {
        if (this.isRuning) {
            console.log('still running');
            return;
        }
        this.isRuning = true;
        this.excute();
    }

    stop() {
        if (!this.isRuning) {
            console.log('already stop');
            return;
        }
        this.isRuning = false;
    }

    private async excute() {
        if (this.isRuning && this.tasks.length > 0) {
            const task = this.tasks.shift();
            const realConcurrence = Math.max(
                this.concurrence,
                this.tasks.length
            );

            const promisefy = function(func: Function) {
                func();
            };

            const promises = [];
            for (let i = 0; i < realConcurrence; i++) {
                promises.push(promisefy(this.tasks.shift()));
            }

            await Promise.all(promises);
            this.excute();
        } else {
            this.isRuning = false;
            this.finishCb();
        }
    }
}
