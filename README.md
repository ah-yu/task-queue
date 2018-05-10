# task-queue

a light weight task queue

## Introduce

`@buji/task-queue` is a node package for manager your task by queue

## Install

```bash
$ npm install @buji/task-queue --save
```

## Usage

```js
const TQ = require('@buji/task-queue');

const tq = new TQ({ concurrency: 1, finishCb: finish_callback });
tq.enqueue(some_function); //push your task in the queue
tq.start();
tq.stop();
```
