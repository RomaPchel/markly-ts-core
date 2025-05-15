import { MikroORM } from '@mikro-orm/core';
import { Log } from '../../classes/Logger.js';
import config from '../config/mikro-orm.config.js';

const logger = Log.getInstance().extend('migrations');

export async function runMigrations(): Promise<void> {
    if (process.env.ENVIRONMENT !== 'production') {
        logger.info('Skipping migrations: Not in production environment');
        return;
    }

    logger.info('🔄 Running pending MikroORM migrations...');

    let orm: MikroORM | undefined;

    try {
        orm = await MikroORM.init(config);

        const migrator = orm.getMigrator();

        await migrator.createMigration();
        await migrator.up();

    } catch (error) {
        logger.error('❌ Migration failed:', error);
        process.exitCode = 1;
        throw error;
    } finally {
        if (orm) {
            await orm.close(true);
        }
    }
}
