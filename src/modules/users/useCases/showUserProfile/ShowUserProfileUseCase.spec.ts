import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { User } from "../../entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe("Show User Profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to show user profile", async () => {
        const user = await createUserUseCase.execute({
            name: "Test",
            email: "test@gmail.com",
            password: "test123"
        });

        const profileUser = await showUserProfileUseCase.execute(`${user.id}`);

        expect(profileUser).toBeInstanceOf(User);
        expect(profileUser).toHaveProperty("id");
    });

    it("should not be able to show user profile if user not exists", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "Test2",
                email: "test2@gmail.com",
                password: "test123"
            });
    
            await showUserProfileUseCase.execute("incorrectId");
            
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});
