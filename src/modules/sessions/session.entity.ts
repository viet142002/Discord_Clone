import { User } from 'src/modules/users/users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sessions' })
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    platform: string;

    @Column({ type: 'varchar', length: 255 })
    device: string;

    @OneToMany(() => User, (user) => user.sessions)
    user: User;
}
