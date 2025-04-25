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
          ClientFacebookAdAccount
        ],
        dbName: process.env.DATABASE_NAME || "saas",
        host: process.env.DATABASE_HOST || "localhost",
        port: Number(process.env.DATABASE_PORT) || 5432,
        user: process.env.DATABASE_USER || "postgres",
        password: process.env.DATABASE_PASSWORD || "password",
      });
      Database.instance = new Database(orm);
    }
    return Database.instance;
  }
}
