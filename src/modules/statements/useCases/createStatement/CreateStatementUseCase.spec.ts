import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

describe("Create Statements Deposit", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be able to create a statement type deposit", async () => {
        const user = await createUserUseCase.execute({
            name: "Test_Deposit",
            email: "test.deposit@gmail.com",
            password: "test123"
        });

        const deposit = await createStatementUseCase.execute({
            user_id: `${user.id}` ,
            type: "deposit" as OperationType,
            amount: 100,
            description: "testDeposit"
        });

        expect(deposit).toBeInstanceOf(Statement);
        expect(deposit).toHaveProperty("id");
        expect(deposit.type).toEqual("deposit");
    });

    it("should not be able to create a statement when user not found", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "Test_Deposit",
                email: "test.deposit@gmail.com",
                password: "test123"
            });
    
            await createStatementUseCase.execute({
                user_id: "incorrectUserId" ,
                type: "deposit" as OperationType,
                amount: 100,
                description: "testDeposit"
            });

        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });
});

describe("Create Statements Withdraw", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    })

    it("should be able to create a statement type withdraw", async () => {
        const user = await createUserUseCase.execute({
            name: "Test_withdraw",
            email: "test.withdraw@gmail.com",
            password: "test123"
        });

        await createStatementUseCase.execute({
            user_id: `${user.id}` ,
            type: "deposit" as OperationType,
            amount: 200,
            description: "testDeposit"
        });
        
        const withdraw = await createStatementUseCase.execute({
            user_id: `${user.id}` ,
            type: "withdraw" as OperationType,
            amount: 100,
            description: "testwithdraw"
        });

        expect(withdraw).toBeInstanceOf(Statement);
        expect(withdraw).toHaveProperty("id");
        expect(withdraw.type).toEqual("withdraw");
    });

    it("should not be able to create a statement type withdraw if user don't have funds", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "Test_withdraw_insufficient_funds",
                email: "test.withdraw.insufficient.funds@gmail.com",
                password: "test123"
            });
    
            await createStatementUseCase.execute({
                user_id: `${user.id}` ,
                type: "withdraw" as OperationType,
                amount: 100,
                description: "testWithdrawInsufficientFunds"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});