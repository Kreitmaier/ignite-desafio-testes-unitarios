import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferStatementError } from "./CreateTransferStatementError";
import { ICreateTransferStatementDTO } from "./ICreateTransferStatementDTO";

@injectable()
class CreateTransferStatementUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ){}

    async execute({ 
        user_id, 
        amount, 
        description, 
        sender_id,
        type
    }:ICreateTransferStatementDTO): Promise<Statement>{
        const user = await this.usersRepository.findById(user_id).catch(() => {
            throw new CreateTransferStatementError.IsNotAnUuid();
        });
        
        const senderUser = await this.usersRepository.findById(sender_id).catch(() => {
            throw new CreateTransferStatementError.IsNotAnUuid();
        });

        if(!user){
            throw new CreateTransferStatementError.UserNotFound();
        }

        if(!senderUser){
            throw new CreateTransferStatementError.UserNotFound();
        }

        if(user_id === sender_id){
            throw new CreateTransferStatementError.UnableToTransferToSameAccount();
        }

        const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

        if(balance < amount) {
            throw new CreateTransferStatementError.InsufficientFunds();
        }

        const transferStatement = await this.statementsRepository.createTransfer({
            user_id,
            sender_id,
            amount,
            description,
            type
        });

        return transferStatement;
    }
}

export { CreateTransferStatementUseCase }