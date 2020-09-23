import * as bcrypt from "bcryptjs";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Group } from "./Group";

@Entity()
@Unique(["username"])
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public username: string;

    @Column()
    public email: string;

    @JoinTable()
    @ManyToMany(() => Group, (group) => group.users)
    public groups: Group[];

    @Column({ select: false })
    public password: string;

    // @Column({ select: false, nullable: true })
    // public passwordResetToken: string;

    @Column("json", { default: "null" })
    public data: any;

    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    public hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
        if (unencryptedPassword) {
            return bcrypt.compareSync(unencryptedPassword, this.password);
        }
        return false;
    }
}
