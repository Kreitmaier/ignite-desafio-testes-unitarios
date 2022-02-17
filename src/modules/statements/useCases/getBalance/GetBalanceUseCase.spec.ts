import { create } from "domain";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getBalenceUseCase: GetBalanceUseCase

describe("Get User's Balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalenceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    });

    it("should be able to get user's balence", async () => {
        const user = await createUserUseCase.execute({
            name: "Test",
            email: "test@gmail.com",
            password: "test123"
        });

        await createStatementUseCase.execute({
            user_id: `${user.id}` ,
            type: "deposit" as OperationType,
            amount: 200,
            description: "testDeposit"
        });
        
        const {balance, statement} = await getBalenceUseCase.execute({user_id: `${user.id}`});
        
        expect(balance).toBe(200);
        expect(statement.length).toEqual(1);
    });

    it("should not be able to get user's balence if user not exists", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "Test",
                email: "test@gmail.com",
                password: "test123"
            });
    
            await createStatementUseCase.execute({
                user_id: `${user.id}` ,
                type: "deposit" as OperationType,
                amount: 200,
                description: "testDeposit"
            });
            
            await getBalenceUseCase.execute({user_id: "incorrectUserId"});

        }).rejects.toBeInstanceOf(GetBalanceError);
    });
})