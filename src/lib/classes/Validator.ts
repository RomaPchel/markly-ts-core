import { match } from "path-to-regexp";
import type { Context } from "koa";
import type { MatchFunction } from "path-to-regexp";
import { ZodSchema } from "zod";
import {
  AdAccountsBusinessesRequestSchema,
  LoginRequestSchema,
  RefreshRequestSchema,
  RegistrationRequestSchema,
  ReportsQueryParamsSchema,
  ScheduleReportsRequestSchema,
  SetActiveOrganizationSchema,
  UpdateNameRequestSchema,
  SaveAnswerRequestSchema,
  CreateOrganizationRequestSchema,
  UseInviteCodeRequestSchema,
  HandleFacebookLoginRequestSchema,
  CreateClientRequestSchema,
  CreateClientFacebookAdAccountRequestSchema,
  DeleteClientFacebookAdAccountRequestSchema,
  HandleSlackLoginRequestSchema,
  SetSlackConversationIdRequestSchema,
  SendMessageToSlackRequestSchema,
  SetSlackWorkspaceTokenRequestSchema,
  SendMessageWithFileToSlackRequestSchema,
  UpdateClientRequestSchema,
} from "../schemas/ZodSchemas.js";

type SchemaEntry = {
  pattern: string;
  matcher: MatchFunction<Record<string, string>>;
  schema: ZodSchema<any>;
};

const schemaMap: SchemaEntry[] = [
  {
    pattern: "/api/auth/register",
    matcher: match("/api/auth/register", { decode: decodeURIComponent }),
    schema: RegistrationRequestSchema,
  },
  {
    pattern: "/api/auth/login",
    matcher: match("/api/auth/login", { decode: decodeURIComponent }),
    schema: LoginRequestSchema,
  },
  {
    pattern: "/api/auth/refresh",
    matcher: match("/api/auth/refresh", { decode: decodeURIComponent }),
    schema: RefreshRequestSchema,
  },
  {
    pattern: "/api/reports/schedule",
    matcher: match("/api/reports/schedule", { decode: decodeURIComponent }),
    schema: ScheduleReportsRequestSchema,
  },
  {
    pattern: "/api/reports",
    matcher: match("/api/reports", { decode: decodeURIComponent }),
    schema: ReportsQueryParamsSchema,
  },
  {
    pattern: "/api/ad-accounts/businesses",
    matcher: match("/api/ad-accounts/businesses", { decode: decodeURIComponent }),
    schema: AdAccountsBusinessesRequestSchema,
  },
  {
    pattern: "/api/user/active-organization",
    matcher: match("/api/user/active-organization", { decode: decodeURIComponent }),
    schema: SetActiveOrganizationSchema,
  },
  {
    pattern: "/api/user/name",
    matcher: match("/api/user/name", { decode: decodeURIComponent }),
    schema: UpdateNameRequestSchema,
  },
  {
    pattern: "/api/user/handle-facebook-login",
    matcher: match("/api/user/handle-facebook-login", { decode: decodeURIComponent }),
    schema: HandleFacebookLoginRequestSchema,
  },
  {
    pattern: "/api/user/handle-slack-login",
    matcher: match("/api/user/handle-slack-login", { decode: decodeURIComponent }),
    schema: HandleSlackLoginRequestSchema,
  },
  {
    pattern: "/api/onboarding/answer",
    matcher: match("/api/onboarding/answer", { decode: decodeURIComponent }),
    schema: SaveAnswerRequestSchema,
  },
  {
    pattern: "/api/organizations",
    matcher: match("/api/organizations", { decode: decodeURIComponent }),
    schema: CreateOrganizationRequestSchema,
  },
  {
    pattern: "/api/organizations/invite-code",
    matcher: match("/api/organizations/invite-code", { decode: decodeURIComponent }),
    schema: UseInviteCodeRequestSchema,
  },
  {
    pattern: "/api/clients",
    matcher: match("/api/clients", { decode: decodeURIComponent }),
    schema: CreateClientRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid",
    matcher: match("/api/clients/:clientUuid", { decode: decodeURIComponent }),
    schema: UpdateClientRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid/ad-accounts",
    matcher: match("/api/clients/:clientUuid/ad-accounts", { decode: decodeURIComponent }),
    schema: CreateClientFacebookAdAccountRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid/ad-accounts/:adAccountId",
    matcher: match("/api/clients/:clientUuid/ad-accounts/:adAccountId", { decode: decodeURIComponent }),
    schema: DeleteClientFacebookAdAccountRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid/slack/conversation-id",
    matcher: match("/api/clients/:clientUuid/slack/conversation-id", { decode: decodeURIComponent }),
    schema: SetSlackConversationIdRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid/slack/send-message",
    matcher: match("/api/clients/:clientUuid/slack/send-message", { decode: decodeURIComponent }),
    schema: SendMessageToSlackRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid/slack/workspace-token",
    matcher: match("/api/clients/:clientUuid/slack/workspace-token", { decode: decodeURIComponent }),
    schema: SetSlackWorkspaceTokenRequestSchema,
  },
  {
    pattern: "/api/clients/:clientUuid/slack/send-message-with-file",
    matcher: match("/api/clients/:clientUuid/slack/send-message-with-file", { decode: decodeURIComponent }),
    schema: SendMessageWithFileToSlackRequestSchema,
  },
];

export class Validator {
  private static findSchema(path: string) {
    for (const entry of schemaMap) {
      const matched = entry.matcher(path);
      if (matched) {
        return { schema: entry.schema, params: matched.params };
      }
    }
    return null;
  }

  public static validateBody(ctx: Context) {
    const path = ctx.request.path;
    const hit = this.findSchema(path);
    if (!hit) {
      throw new Error(`No validation schema defined for URL ${path}`);
    }
    hit.schema.parse((ctx.request as any).body);
  }

  public static validateQuery(ctx: Context) {
    const path = ctx.request.path;
    const hit = this.findSchema(path);
    if (!hit) {
      throw new Error(`No validation schema defined for URL ${path}`);
    }
    hit.schema.parse(ctx.request.query);
  }

  public static validateRequest(ctx: Context) {
    // body for non‑GET
    if (ctx.request.method !== "GET") {
      this.validateBody(ctx);
    }
    // query if any
    if (ctx.request.querystring) {
      this.validateQuery(ctx);
    }
  }
}