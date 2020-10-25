import { User } from "./user";
import { Contact } from "./contact";
import { BankAccount } from "./bankaccount";
import { Transaction } from "./transaction";
import { Like } from "./like";
import { BankTransfer } from "./banktransfer";
import { NotificationType } from "./notification";
import { Comment } from "./comment";
import { Stock } from "./stockmarket";

export interface DbSchema {
  users: User[];
  contacts: Contact[];
  bankaccounts: BankAccount[];
  transactions: Transaction[];
  likes: Like[];
  comments: Comment[];
  notifications: NotificationType[];
  banktransfers: BankTransfer[];
}


export interface SmSchema {
stocks: Stock[]
}
