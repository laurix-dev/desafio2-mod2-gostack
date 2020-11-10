// import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';
import readFile from '../config/readFIle';

interface TransactionDTO {
  title: string;
  type: 'outcome' | 'income';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(fileInfo: Express.Multer.File): Promise<Transaction[]> {
    // const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions: Transaction[] = [];

    const transactionsFromFile = await readFile(fileInfo.path);
    for (let i = 0; i < transactionsFromFile.length; i += 1) {
      const transaction: TransactionDTO = {
        title: '',
        type: 'income',
        value: 0,
        category: '',
      };
      for (let j = 0; j < transactionsFromFile[i].length; j += 1) {
        if (j === 0) {
          transaction.title = transactionsFromFile[i][j];
        }
        if (j === 1) {
          transaction.type = transactionsFromFile[i][j];
        }
        if (j === 2) {
          transaction.value = transactionsFromFile[i][j];
        }
        if (j === 3) {
          transaction.category = transactionsFromFile[i][j];
        }
      }
      const createTransaction = new CreateTransactionService();
      // eslint-disable-next-line no-await-in-loop
      const createdTransaction = await createTransaction.execute(transaction);
      transactions[i] = createdTransaction;
    }
    return transactions;
  }
}

export default ImportTransactionsService;
