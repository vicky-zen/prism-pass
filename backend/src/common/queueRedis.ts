import { Processor, Queue, RedisOptions, RepeatOptions, Worker } from "bullmq";

const activeWorkers: unknown[] = [];

export class QueueRedis {
  readonly connection: RedisOptions;
  readonly queueName: string;
  constructor(connection: RedisOptions, queueName: string) {
    this.connection = connection;
    this.queueName = queueName;
  }
  public addJob(jobId: string, job: unknown, scheduledDate?: Date) {
    /********************scheduled date ? */
    let delayed: number | undefined = undefined;
    if (scheduledDate) {
      delayed = this.diffMilliSeconds(scheduledDate, new Date());
    }
    /********************scheduled date ? */

    const queue = new Queue(this.queueName, {
      connection: this.connection
    });
    queue.add(jobId, job, {
      removeOnComplete: true,
      lifo: false,
      delay: delayed,
      attempts: 3
    });
  }

  /**
   *
   * @param jobId
   * @param job
   * @param repeatOption  Object reference https://docs.bullmq.io/guide/jobs/repeatable
   *  repeat: { cron: '15 3 * * *'     } // Repeat job once every day at 3:15 (am)
   *  repeat: { every: 10000, limit: 100    } //Repeat job 100 times every 10 seconds.
   */
  public addRepeatableJob(
    jobId: string,
    job: unknown,
    repeatOption: RepeatOptions
  ) {
    const queue = new Queue(this.queueName, {
      connection: this.connection
    });
    queue.add(jobId, job, {
      removeOnComplete: true,
      lifo: false,
      repeat: repeatOption
    });
  }

  public async getRepeatableJobs() {
    const queue = new Queue(this.queueName, {
      connection: this.connection
    });
    return await queue.getJobSchedulers();
  }

  private diffMilliSeconds(dt2: Date, dt1: Date) {
    const diff = dt2.getTime() - dt1.getTime();
    return Math.abs(Math.round(diff));
  }

  public addWorker<T, R, N extends string = string>(
    processor: string | Processor<T, R, N>,
    rateLimiterPerSec = 100,
    concurrency = 1
  ) {
    let queue = new Queue(this.queueName, { connection: this.connection });
    let worker = new Worker(this.queueName, processor, {
      connection: this.connection,
      limiter: {
        max: rateLimiterPerSec,
        duration: 1000 //1 sec
      },
      concurrency: concurrency
    });
    activeWorkers.push({ queue, worker });
  }
}
