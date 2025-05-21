import { ClientTokenType } from "../enums/enums.js";
import { ClientToken } from "../entities/ClientToken.js";
import { Database } from "../db/config/DB.js";
import { OrganizationClient } from "../entities/OrganizationClient.js";

const database = await Database.getInstance();

export class TokenService {
  async createOrUpdateToken(
    client: OrganizationClient,
    token: string,
    type: ClientTokenType,
  ) {
    const existing = await database.em.findOne(ClientToken, {
      organizationClient: client.uuid,
      type,
    });

    const tokenEntity = existing ?? new ClientToken();
    tokenEntity.token = token;
    tokenEntity.type = type;
    tokenEntity.organizationClient = client;
    tokenEntity.organization = client.organization;

    await database.em.persistAndFlush(tokenEntity);
  }

  async hasSlackToken(clientUuid: string) {
    const token = await database.em.findOne(ClientToken, {
      organizationClient: clientUuid,
      type: ClientTokenType.SLACK,
    });
    return !!token;
  }

  async getSlackToken(clientUuid: string) {
    const token = await database.em.findOne(ClientToken, {
      organizationClient: clientUuid,
      type: ClientTokenType.SLACK,
    });

    if (!token) throw new Error("No Slack token found");

    return token.token;
  }
}
