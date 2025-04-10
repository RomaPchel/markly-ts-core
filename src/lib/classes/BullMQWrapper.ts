import { Queue, Worker, Job, JobScheduler, JobsOptions } from 'bullmq';
import type { Redis } from 'ioredis';
import type { ReportJobData } from '../interfaces/ReportsInterfaces.js';
import { Log } from './Logger.js';

const logger = Log.getInstance().extend('BullMQ');

export type JobProcessorMap = {
  [jobName: string]: (data: ReportJobData) => Promise<any>;
};

export class BullMQWrapper {
  private queue: Queue;
  private worker: Worker;
  private scheduler: JobScheduler;
  private jobProcessors: JobProcessorMap;

  constructor(
      queueName: string,
      connection: Redis,
      jobProcessors: JobProcessorMap,
  ) {
    this.jobProcessors = jobProcessors;

    this.queue = new Queue(queueName, { connection });
    this.scheduler = new JobScheduler(queueName, { connection });

    this.worker = new Worker(
        queueName,
        async (job: Job) => this.processJob(job),
        { connection },
    );

    this.worker.on('completed', (job) => {
      logger.info(`Job ${job.id} of type "${job.name}" completed.`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id ?? 'unknown'} failed: ${err.message}`);
    });
  }

  private async processJob(job: Job): Promise<any> {
    logger.info(`▶Processing job "${job.name}" with data: ${JSON.stringify(job.data)}`);
    const processor = this.jobProcessors[job.name];
    if (!processor) {
      throw new Error(`No processor defined for job type "${job.name}"`);
    }
    return await processor(job.data);
  }

  async addJob(name: string, data: any, options?: JobsOptions): Promise<Job> {
    return await this.queue.add(name, data, options);
  }

  async addScheduledJob(name: string, data: any, cron: string): Promise<Job> {
    return await this.queue.add(name, data, { repeat: { pattern: cron } });
  }

  // async removeScheduledJob(name: string, cron: string, jobId?: string): Promise<void> {
  //   // Use scheduler's removeRepeatable method
  //   await this.scheduler.remov(name, { cron, jobId });
  // }

  async listScheduledJobs(): Promise<any[]> {
    return await this.queue.getJobs();
  }

  async getJob(jobId: string): Promise<Job | null> {
    return await this.queue.getJob(jobId);
  }

  async removeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  async drainAndClean(): Promise<void> {
    await this.queue.drain();
    await this.queue.clean(0, 1000, 'completed');
    await this.queue.clean(0, 1000, 'failed');
    await this.queue.clean(0, 1000, 'delayed');
    await this.queue.clean(0, 1000, 'wait');
    await this.queue.clean(0, 1000, 'active');
    logger.info('🧹 All jobs have been cleaned up.');
  }

  async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
    await this.scheduler.close();
  }
}
