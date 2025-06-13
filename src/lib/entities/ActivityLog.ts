import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity.js';

@Entity()
export class ActivityLog extends BaseEntity {
    @Property()
    organizationUuid!: string;

    @Property({ nullable: true })
    userUuid?: string | null;

    @Property({ nullable: true })
    clientUuid?: string | null;

    @Property()
    action!: string; // e.g., "created_report", "sent_scheduled_report"

    @Property({ nullable: true })
    targetType?: string | null; // e.g., "report", "user", "subscription"

    @Property({ nullable: true })
    targetUuid?: string | null;

    @Property({ type: 'json', nullable: true })
    metadata?: Record<string, any>;

    @Property({ default: 'user' })
    actor!: 'user' | 'system';
}
