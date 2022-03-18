import { Statement } from "../../entities/Statement";
import { OperationType } from "../../useCases/createStatement/CreateStatementController";
import { ICreateStatementDTO } from "../../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferStatementDTO } from "../../useCases/createTransferStatement/ICreateTransferStatementDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "../IStatementsRepository";

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = [];

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement();

    Object.assign(statement, data);

    this.statements.push(statement);

    return statement;
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(operation => (
      operation.id === statement_id &&
      operation.user_id === user_id
    ));
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = this.statements.filter(operation => operation.user_id === user_id);

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0)

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
    amount, 
    description, 
    type 
  }: ICreateTransferStatementDTO): Promise<Statement>{
    
    const transferStatement = new Statement();

    Object.assign(transferStatement, {
      user_id, 
      sender_id, 
      amount, 
      description, 
      type 
    });    

    this.statements.push(transferStatement);

    const withdrawSenderStatement = new Statement();

    Object.assign(withdrawSenderStatement, {
      user_id: sender_id,
      amount, 
      description: 'automatic withdraw by transfer', 
      type: 'withdraw' as OperationType 
    });

    this.statements.push(withdrawSenderStatement);

    return transferStatement;
  }
}
