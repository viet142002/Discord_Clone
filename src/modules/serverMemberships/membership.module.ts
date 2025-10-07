import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from 'src/modules/serverMemberships/membership.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Membership])],
})
export class MembershipModule {}
