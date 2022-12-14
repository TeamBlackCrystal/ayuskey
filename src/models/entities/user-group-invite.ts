import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { UserGroup } from './user-group';
import { id } from '../id';

@Entity()
@Index(['userId', 'userGroupId'], { unique: true })
export class UserGroupInvite {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the UserGroupInvite.',
	})
	public createdAt: Date;

	@Index()
	@Column({
		...id(),
		comment: 'The user ID.',
	})
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: User | null;

	@Index()
	@Column({
		...id(),
		comment: 'The group ID.',
	})
	public userGroupId: UserGroup['id'];

	@ManyToOne(type => UserGroup, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public userGroup: UserGroup | null;
}
