import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Channel } from 'src/modules/channels/channel.entity';
import { Membership } from 'src/modules/serverMemberships/membership.entity';

@Entity({ name: 'servers' })
export class Server {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Channel, (channel) => channel.server)
    channels: Channel[];

    @OneToMany(() => Membership, (membership) => membership.server)
    memberships: Membership[];

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    icon_url: string;
}
