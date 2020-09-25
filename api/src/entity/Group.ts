import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToMany(() => User, (user) => user.groups)
    public users: User[];

    @ManyToOne(() => User, (user) => user.createdGroups)
    public creator: User;
}
