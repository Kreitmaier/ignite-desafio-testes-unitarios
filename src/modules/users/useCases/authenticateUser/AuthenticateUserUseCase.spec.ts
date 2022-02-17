import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    });

    it("should be able to authenticate a user", async () => {
        const user = {
            name: "Test Authenticate",
            email: "Authenticate@gmail.com",
            password: "auth123"
        };

        await createUserUseCase.execute(user);

        const authenticatedUser = await authenticateUserUseCase.execute({
            email: user.email ,
            password: user.password
        });

        expect(authenticatedUser).toHaveProperty("token");
        expect(authenticatedUser).toHaveProperty("user");
    });

    it("should not be able to authenticate a user with incorrect password", async () => {
        expect(async () => {
            const user = {
                name: "Test Authenticate 2",
                email: "Authenticate_test@gmail.com",
                password: "auth123"
            };
    
            await createUserUseCase.execute(user);
            
            await authenticateUserUseCase.execute({
                email: user.email ,
                password: "incorrectPassword"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate a user with incorrect email", async () => {
        expect(async () => {
            const user = {
                name: "Test Authenticate 3",
                email: "Authenticate_test3@gmail.com",
                password: "auth123"
            };
    
            await createUserUseCase.execute(user);
            
            await authenticateUserUseCase.execute({
                email: "incorrectEmail" ,
                password: user.password
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});