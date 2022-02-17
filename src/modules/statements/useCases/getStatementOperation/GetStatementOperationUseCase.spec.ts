import { error } from "console";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be able to get statement operation by id", async () => {
        const user = await createUserUseCase.execute({
            name: "Test_Deposit",
            email: "test.deposit@gmail.com",
            password: "test123"
        });

        const statement = await createStatementUseCase.execute({
            user_id: `${user.id}`,
            type: "deposit" as OperationType,
            amount: 100,
            description: "testDeposit"
        });
        
        const statementFound = await getStatementOperationUseCase.execute({ 
            user_id: `${user.id}`,
            statement_id: `${statement.id}`
        });

        expect(statementFound).toBeInstanceOf(Statement);
    });

    it("should not be able to get statement operation if user not exists", async () => {
        const user = await createUserUseCase.execute({
            name: "Test_Deposit",
            email: "test.deposit@gmail.com",
            password: "test123"
        });

        const statement = await createStatementUseCase.execute({
            user_id: `${user.id}`,
            type: "deposit" as OperationType,
            amount: 100,
            description: "testDeposit"
        });

        await getStatementOperationUseCase.execute({ 
            user_id: "incorrectUserId",
            statement_id: `${statement.id}`
        }).catch(error => expect(error).toBeInstanceOf(GetStatementOperationError.UserNotFound));
    });

    it("should not be able to get statement operation if statement not exists", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "Test_Deposit",
                email: "test.deposit@gmail.com",
                password: "test123"
            });
    
            await createStatementUseCase.execute({
                user_id: `${user.id}`,
                type: "deposit" as OperationType,
                amount: 100,
                description: "testDeposit"
            });
            
            await getStatementOperationUseCase.execute({ 
                user_id: `${user.id}`,
                statement_id: "incorrectStatementId"
            });
            
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});