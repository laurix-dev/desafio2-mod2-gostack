import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import CreateTransactionService from '../services/CreateTransactionService';
import GetTransactionService from '../services/GetTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const getTransaction = new GetTransactionService();

  const resultTransactions = await getTransaction.execute();

  return response.json(resultTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const createTransaction = new CreateTransactionService();
  const { title, value, type, category } = request.body;

  const createdTransaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(createdTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionId = request.params.id;
  const transactionRepository = getCustomRepository(TransactionsRepository);

  await transactionRepository.delete(transactionId);

  return response.json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const planilhaFile = request.file;

    const importTransaction = new ImportTransactionsService();

    const transactions = await importTransaction.execute(planilhaFile);

    return response.status(200).json(transactions);
  },
);

export default transactionsRouter;
