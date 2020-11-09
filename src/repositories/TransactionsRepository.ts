import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const transactionRepository = getRepository(Transaction);

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // Pega os transactions do banco para fazer o balance
    const transactions = await transactionRepository.find();

    // Instancia uma variavel do tipo balance
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    // n sabia usar o reduce entao acabei usando um for mesmo ehehehe
    for (let i = 0; i < transactions.length; i += 1) {
      if (transactions[i].type === 'income') {
        balance.income += transactions[i].value;
        balance.total += transactions[i].value;
      }
      if (transactions[i].type === 'outcome') {
        balance.outcome += transactions[i].value;
        balance.total -= transactions[i].value;
      }
    }

    return balance;
  }
}

export default TransactionsRepository;
