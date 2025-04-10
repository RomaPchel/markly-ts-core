import { Queue, Worker, Job, JobScheduler } from "bullmq";
import { Log } from "./Logger.js";
import type { ReportJobData } from "../interfaces/ReportsInterfaces.js";
import { Redis } from "ioredis";

const logger: Log = Log.getInstance().extend("service");

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
      async (job: Job) => {
        return this.processJob(job);
      },
      { connection },
    );

    this.worker.on("failed", (job, err) => {
      if (job) {
        logger.error(`Job ${job.id} failed: ${err.message}`);
      } else {
        logger.error(`An undefined job failed: ${err.message}`);
      }
    });
  }

  private async processJob(job: Job): Promise<any> {
    logger.info(
      `Processing job ${job.id} of type "${job.name}" with data: ${JSON.stringify(job.data)}`,
    );

    const data: ReportJobData = job.data;
    const processor = this.jobProcessors[job.name];

    if (!processor) {
      throw new Error(`No processor defined for job type "${job.name}"`);
    }

    return await processor(data);
  }

  public async addScheduledJob(
    jobName: string,
    data: any,
    cron: string,
  ): Promise<Job> {
    return await this.queue.add(jobName, data, { repeat: { pattern: cron } });
  }

  public async addJob(jobName: string, data: any): Promise<Job> {
    return await this.queue.add(jobName, data);
  }

  public async getJob(jobId: string): Promise<Job | null> {
    return await this.queue.getJob(jobId);
  }

  public async removeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  public async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
    await this.scheduler.close();
  }
}
