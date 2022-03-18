import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateTransferStatementError } from "./CreateTransferStatementError";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createTransferStatementUseCase: CreateTransferStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Create Transfer Statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();

        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository
        );

        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );

        createTransferStatementUseCase = new CreateTransferStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    });

    it("should be able to create a transfer statement", async () => {
        const senderUser = await createUserUseCase.execute({
            name: "Sender User",
            email: "senderuser@gmail.com",
            password: "1234"
        });

        const receiverUser = await createUserUseCase.execute({
            name: "Receiver User",
            email: "receiveruser@gmail.com",
            password: "1234"
        });

        await createStatementUseCase.execute({
            user_id: `${senderUser.id}`,
            type: "deposit" as OperationType,
            amount: 200,
            description: "first deposit to have funds"
        });

        const transferStatement = await createTransferStatementUseCase.execute({
            user_id: `${receiverUser.id}`,
            amount: 50,
            description: "Transfer to receiver receiver user",
            type: "transfer" as OperationType,
            sender_id: `${senderUser.id}`
        });

        const balanceUserSender = await getBalanceUseCase.execute({
            user_id: `${senderUser.id}`
        })

        expect(transferStatement).toBeInstanceOf(Statement);
        expect(transferStatement.sender_id).toEqual(senderUser.id);
        expect(transferStatement.user_id).toEqual(receiverUser.id);
        expect(transferStatement.type).toEqual("transfer");
        expect(transferStatement.amount).toEqual(50);
        expect(transferStatement.description).toEqual("Transfer to receiver receiver user");

        expect(balanceUserSender.balance).toEqual(150);
        expect(balanceUserSender.statement[1]).toBeInstanceOf(Statement);
        expect(balanceUserSender.statement[1].user_id).toEqual(senderUser.id);
        expect(balanceUserSender.statement[1].type).toEqual("withdraw");
        expect(balanceUserSender.statement[1].amount).toEqual(50);
    });

    it("should not be able to create a transfer statement when a user's id is not exists", async () => {
        const senderUser = await createUserUseCase.execute({
            name: "Sender User",
            email: "senderuser@gmail.com",
            password: "1234"
        });

        const receiverUser = await createUserUseCase.execute({
            name: "Receiver User",
            email: "receiveruser@gmail.com",
            password: "1234"
        });

        await createStatementUseCase.execute({
            user_id: `${senderUser.id}`,
            type: "deposit" as OperationType,
            amount: 200,
            description: "first deposit to have funds"
        });

        await expect(
            createTransferStatementUseCase.execute({
                user_id: `${receiverUser.id}`,
                amount: 50,
                description: "Transfer to receiver receiver user",
                type: "transfer" as OperationType,
                sender_id: `incorrectTypeId`
            })
        ).rejects.toEqual(new CreateTransferStatementError.UserNotFound());
        
        await expect(
            createTransferStatementUseCase.execute({
                user_id: `incorrectTypeId`,
                amount: 50,
                description: "Transfer to receiver receiver user",
                type: "transfer" as OperationType,
                sender_id: `${senderUser.id}`
            })
        ).rejects.toEqual(new CreateTransferStatementError.UserNotFound());
    });

    it("should not be able to create a transfer statement to same user's id", async () => {
        const senderUser = await createUserUseCase.execute({
            name: "Sender User",
            email: "senderuser@gmail.com",
            password: "1234"
        });

        const receiverUser = await createUserUseCase.execute({
            name: "Receiver User",
            email: "receiveruser@gmail.com",
            password: "1234"
        });

        await createStatementUseCase.execute({
            user_id: `${senderUser.id}`,
            type: "deposit" as OperationType,
            amount: 200,
            description: "first deposit to have funds"
        });

        const sameId = senderUser.id;

        await expect(
            createTransferStatementUseCase.execute({
                user_id: `${sameId}`,
                amount: 50,
                description: "Transfer to receiver receiver user",
                type: "transfer" as OperationType,
                sender_id: `${senderUser.id}`
            })
        ).rejects.toEqual(new CreateTransferStatementError.UnableToTransferToSameAccount());
    });

    it("should not be able to create a transfer statement when sender user's balace is less than amount to transfer", async () => {
        const senderUser = await createUserUseCase.execute({
            name: "Sender User",
            email: "senderuser@gmail.com",
            password: "1234"
        });

        const receiverUser = await createUserUseCase.execute({
            name: "Receiver User",
            email: "receiveruser@gmail.com",
            password: "1234"
        });

        await createStatementUseCase.execute({
            user_id: `${senderUser.id}`,
            type: "deposit" as OperationType,
            amount: 200,
            description: "first deposit to have funds"
        });
    
        await expect(
            createTransferStatementUseCase.execute({
                user_id: `${receiverUser.id}`,
                amount: 250,
                description: "Transfer to receiver receiver user",
                type: "transfer" as OperationType,
                sender_id: `${senderUser.id}`
            })
        ).rejects.toEqual(new CreateTransferStatementError.InsufficientFunds());
    });
});