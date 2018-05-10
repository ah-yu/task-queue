/*
 * @Author: buji 
 * @Date: 2018-05-08 12:49:41 
 * @Last Modified by: buji
 * @Last Modified time: 2018-05-10 11:41:50
 */
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

    //allow func and async func
    enqueue(task: Function) {
        this.tasks.push(task);
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

    clear() {
        this.tasks = [];
        this.isRuning = false;
    }

    private async excute() {
        if (this.isRuning && this.tasks.length > 0) {
            const realConcurrence = Math.max(
                this.concurrence,
                this.tasks.length
            );

            const promisefy = function(func: Function) {
                return Promise.resolve().then(() => {
                    func();
                });
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
