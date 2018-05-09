/*
 * @Author: buji 
 * @Date: 2018-05-08 12:49:41 
 * @Last Modified by: buji
 * @Last Modified time: 2018-05-08 14:00:03
 */
const DEFAULT_CONCURRENCE = 1;

export interface options {
    concurrence?: number;
    finishCb?: Function;
}

interface TaskItem {
    task: Function;
    cb?: Function;
}

export default class TaksQueue {
    private tasks: TaskItem[];
    private concurrence: number;

    private isRuning: boolean;
    private finishCb: Function;

    constructor(param: options) {
        this.concurrence = param.concurrence || DEFAULT_CONCURRENCE;
        this.tasks = [];
        this.isRuning = false;
        this.finishCb = param.finishCb || (() => {});
    }

    enqueue(task: Function, cb?: Function) {
        this.tasks.push({
            task: task,
            cb: cb ? cb : () => {}
        });
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

            const promisefy = function(item: TaskItem) {
                return Promise.resolve()
                    .then(() => {
                        return item.task();
                    })
                    .then((value: any) => {
                        return item.cb(value);
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
