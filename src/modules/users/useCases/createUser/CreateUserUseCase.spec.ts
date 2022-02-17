import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";
import { User } from "../../entities/User";

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create a User", () => {
    beforeEach( ()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a user", async () => {
        const user = {
            name: "Test",
            email: "test@gmail.com",
            password: "test123"
        };

       const createdUser = await createUserUseCase.execute(user);
       
       expect(createdUser).toHaveProperty("id");
       expect(createdUser.name).toEqual("Test");
       expect(createdUser.email).toEqual("test@gmail.com");   
       expect(createdUser).toBeInstanceOf(User);
    });

    it("should not be able to create a user if email alredy exists", async() => {
        expect(async () => {
            const user = {
                name: "Test",
                email: "test@gmail.com",
                password: "test123"
            };

            await createUserUseCase.execute(user);

            await createUserUseCase.execute(user);

        }).rejects.toBeInstanceOf(CreateUserError);
    });
});