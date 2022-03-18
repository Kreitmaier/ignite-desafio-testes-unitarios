import { Statement } from "../../entities/Statement"

export type ICreateTransferStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'sender_id' |
  'amount' |
  'type'
>

