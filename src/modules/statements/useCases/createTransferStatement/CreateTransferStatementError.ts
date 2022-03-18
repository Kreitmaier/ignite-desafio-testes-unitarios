import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferStatementError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class IsNotAnUuid extends AppError {
    constructor() {
      super('It is not a valid id type uuid', 400);
    }
  }

  export class UnableToTransferToSameAccount extends AppError {
    constructor() {
      super('Unable to tranfer to same account', 400);
    }
  }
}