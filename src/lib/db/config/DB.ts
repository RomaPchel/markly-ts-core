import { MikroORM, EntityManager } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

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
        entities: ["./dist/lib/entities/*.js"],
        entitiesTs: ["./src/lib/entities/*.ts"],
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
