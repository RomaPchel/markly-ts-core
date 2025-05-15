import { MikroORM, EntityManager } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import {User} from "../../entities/User.js";
import {Organization} from "../../entities/Organization.js";
import {OrganizationClient} from "../../entities/OrganizationClient.js";
import {OrganizationMember} from "../../entities/OrganizationMember.js";
import {SchedulingOption} from "../../entities/SchedulingOption.js";
import {
  CommunicationChannel,
  EmailChannel,
  SlackChannel,
  WhatsAppChannel
} from "../../entities/ClientCommunicationChannel.js";
import {OrganizationToken} from "../../entities/OrganizationToken.js";
import { OnboardingQuestionAnswer } from "lib/entities/OnboardingQuestionAnswer.js";
import { OrganizationInvite } from "lib/entities/OrganizationInvite.js";
import {Report} from "../../entities/Report.js";

import { ClientFacebookAdAccount } from "lib/entities/ClientFacebookAdAccount.js";
import { ClientToken } from "lib/entities/ClientToken.js";
import { ChangeEmailToken } from "lib/entities/ChangeEmailToken.js";
import { Migrator, TSMigrationGenerator } from "@mikro-orm/migrations";

export class Database {
  private static instance: Database;
  public orm: MikroORM;
  public em: EntityManager;

  private constructor(orm: MikroORM) {
    this.orm = orm;
    this.em = orm.em.fork() as EntityManager;
  }

  public static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      const orm = await MikroORM.init({
        metadataProvider: TsMorphMetadataProvider,
        extensions: [Migrator],
        migrations: {
          tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
          path: 'dist/migrations',
          pathTs: 'src/migrations',
          glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
          transactional: true, // wrap each migration in a transaction
          disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
          allOrNothing: true, // wrap all migrations in master transaction
          dropTables: true, // allow to disable table dropping
          safe: false, // allow to disable table and column dropping
          snapshot: true, // save snapshot when creating new migrations
          emit: 'ts', // migration generation mode
          generator: TSMigrationGenerator, // migration genera
        },
        entities: [
            User,
          Organization,
          OrganizationClient,
          OrganizationMember,
          OrganizationToken,
          SchedulingOption,
          CommunicationChannel,
          EmailChannel,
          SlackChannel,
          WhatsAppChannel,
          OnboardingQuestionAnswer,
          Report,
          OrganizationInvite,
          ClientFacebookAdAccount,
          ClientToken,
          ChangeEmailToken
        ],
        dbName: process.env.DATABASE_NAME || "saas",
        port: Number(process.env.DATABASE_PORT) || 5432,
        user: process.env.DATABASE_USER || "postgres",
        password: process.env.DATABASE_PASSWORD || "password",
        host: process.env.DATABASE_HOST || "localhost",
      });
      Database.instance = new Database(orm);
    }
    return Database.instance;
  }
}
