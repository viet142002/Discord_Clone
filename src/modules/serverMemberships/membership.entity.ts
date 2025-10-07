import { Server } from 'src/modules/servers/server.entity';
import { User } from 'src/modules/users/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'server_memberships' })
export class Membership {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.memberships)
    user: User;

    @ManyToOne(() => Server, (server) => server.memberships)
    server: Server;

    @Column({ default: 'member' })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
