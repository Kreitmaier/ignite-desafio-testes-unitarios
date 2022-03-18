import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer',
  }

class CreateTransferStatementController{
    async execute(request: Request, response: Response): Promise<Response>{
        const { id: user_id } = request.user;
        const { amount, description } = request.body;
        const { receiver_id } = request.params;
        const type = 'transfer' as OperationType;

        const createTransferStatementUseCase = container.resolve(CreateTransferStatementUseCase);
        
        const transferStatement = await createTransferStatementUseCase.execute({
            user_id: receiver_id,
            amount,
            description,
            sender_id: user_id,
            type
        });

        return response.status(201).json(transferStatement);
    }
}

export { CreateTransferStatementController }