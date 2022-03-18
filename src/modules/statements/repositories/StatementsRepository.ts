import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { OperationType } from "../useCases/createStatement/CreateStatementController";

import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferStatementDTO } from "../useCases/createTransferStatement/ICreateTransferStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transfer') {
        return acc += Number(operation.amount);
      } else {
        return acc -= Number(operation.amount);
      }
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async createTransfer({ 
    user_id, 
    sender_id, 
    description, 
    amount,
    type
     
  }: ICreateTransferStatementDTO): Promise<Statement>{
    const transferStatement = this.repository.create({
      user_id,
      sender_id,
      description,
      amount,
      type
    });
    
    await this.repository.save(transferStatement);

    const withdrawSenderStatement = this.repository.create({
      user_id: sender_id,
      description: 'automatic withdraw by transfer',
      amount,
      type: 'withdraw' as OperationType
    });

    await this.repository.save(withdrawSenderStatement);

    return transferStatement;
  }
}
