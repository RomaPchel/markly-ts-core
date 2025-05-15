import { MikroORM } from '@mikro-orm/core';
import {Log} from "../../classes/Logger.js";
import config from '../config/mikro-orm.config.js'

const logger = Log.getInstance().extend('migrations');

export async function runMigrations(): Promise<void> {
    logger.info('Running pending migrations...');

    let orm: MikroORM;

    try {
        orm = await MikroORM.init(config);

        const pending = await orm.getMigrator().getPendingMigrations();

        if (pending.length === 0) {
            logger.info('No pending migrations.');
        } else {
            const executed = await orm.getMigrator().up();
            logger.info(`Applied ${executed.length} migration(s):`);
            executed.forEach(m => logger.info(`  - ${m.name}`));
        }

    } catch (error) {
        logger.error(('Migration failed:'), error);
        process.exitCode = 1;
    } finally {
        // @ts-ignore
        if (orm) {
            await orm.close(true);
        }
    }
}
