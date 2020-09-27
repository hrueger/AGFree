import { getRepository, MigrationInterface } from "typeorm";
import { User } from "../entity/User";

export class createAdminUser1574018391679 implements MigrationInterface {
    public async up(): Promise<any> {
        const user = new User();
        user.username = "admin";
        user.password = "admin";
        user.isAdmin = true;
        user.hashPassword();
        user.email = "AGFree@hrueger.github.io";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(): Promise<any> {
        //
    }
}
