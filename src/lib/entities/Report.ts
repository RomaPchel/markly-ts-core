import {
    Entity,
    Property,
    ManyToOne,
    LoadStrategy,
} from '@mikro-orm/core';
import { Organization } from './Organization.js';
import {BaseEntity} from "./BaseEntity.js";
import {OrganizationClient} from "./OrganizationClient.js";

@Entity()
export class Report extends BaseEntity{
    @ManyToOne(() => Organization, { strategy: LoadStrategy.SELECT_IN })
    organization!: Organization;

    @ManyToOne(() => OrganizationClient, { strategy: LoadStrategy.SELECT_IN })
    client!: OrganizationClient;

    @Property()
    reportType!: string;

    @Property({ type: 'text' })
    gcsUrl!: string;

    @Property({ type: 'jsonb' })
    data!: Record<string, any>;

    @Property({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

}
