import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface BalanceResult {
  transactions: Array<Transaction>;
  balance: Balance;
}

export default class GetTransactionService {
  public async execute(): Promise<BalanceResult> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();

    const balanceResult: BalanceResult = {
      transactions,
      balance: await transactionsRepository.getBalance(),
    };

    return balanceResult;
  }
}
