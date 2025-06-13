import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity.js';

@Entity()
export class ActivityLog extends BaseEntity {
    @Property()
    organizationUuid!: string;

    @Property()
    userUuid!: string;

    @Property({ nullable: true })
    clientUuid?: string;

    @Property()
    action!: string; // "created_report", "paused_schedule", "added_collaborator" etc

    @Property({ nullable: true })
    targetType?: string; // "report", "user", "subscription" etc

    @Property({ nullable: true })
    targetUuid?: string; // UUID of the target entity (report, user, etc.)

    @Property({ type: 'json', nullable: true })
    metadata?: Record<string, any>;
}
