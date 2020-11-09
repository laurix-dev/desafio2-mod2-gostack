/* eslint-disable no-await-in-loop */
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
    for (let i = 0; i < transactions.length; i += 1) {
      const category = await categoriesRepository.findOne(
        transactions[i].category_id,
      );
      if (!category) {
        throw new AppError('No category was found!', 400);
      }
      transactions[i].category = category;
    }

    const balanceResult: BalanceResult = {
      transactions,
      balance: await transactionsRepository.getBalance(),
    };

    return balanceResult;
  }
}
