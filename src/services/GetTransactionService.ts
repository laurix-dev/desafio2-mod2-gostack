import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

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
    const categoriesRepository = getRepository(Category);

    const transactions = await transactionsRepository.find();

    // provavelmente esse n eh o jeito mais otimo de se fazer mas n consegui pensar em
    // outro modo
    const category = await categoriesRepository.find();

    if (!category) {
      throw new AppError('No category was found!', 500);
    }

    // nesse for aninhado procuramos pelo category_id dentro da tabela category pra ver se ela existe
    // e se existir ela coloca no campo category
    for (let i = 0; i < transactions.length; i += 1) {
      for (let j = 0; j < category.length; j += 1) {
        if (transactions[i].category_id === category[j].id) {
          transactions[i].category = category[j];
        }
      }
    }

    const balanceResult: BalanceResult = {
      transactions,
      balance: await transactionsRepository.getBalance(),
    };

    return balanceResult;
  }
}
