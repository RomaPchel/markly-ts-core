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
import { Migrator } from "@mikro-orm/migrations";
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
        host: process.env.INSTANCE_CONNECTION_NAME
            ? `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
            : process.env.DATABASE_HOST || "localhost",
      });
      Database.instance = new Database(orm);
    }
    return Database.instance;
  }
}
