/*
 * @Author: buji 
 * @Date: 2018-05-10 11:25:30 
 * @Last Modified by: buji
 * @Last Modified time: 2018-05-11 17:05:36
 */
import * as assert from 'assert';
import TaskQueue from '../src/index';

const tq = new TaskQueue({
    concurrence: 1,
    finishCb: () => {
        console.log('finished!');
    }
});

let logger = [];
describe('check task-queue', () => {
    beforeEach(() => {
        tq.enqueue(() => {
            logger.push('task_1 finished!');
        });

        tq.enqueue(() => {
            logger.push('task_2 finished');
        });
    });

    afterEach(() => {
        tq.clear();
        logger = [];
    });

    it('check start', () => {});
});
