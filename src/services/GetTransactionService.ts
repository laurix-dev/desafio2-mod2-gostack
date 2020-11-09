import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

export default class GetTransactionService {
  public async excute(): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactions = await transactionRepository.find();

    return transactions;
  }
}
