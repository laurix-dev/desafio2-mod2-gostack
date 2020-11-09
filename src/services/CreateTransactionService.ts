import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // pegando os repositorios que vamos usar e em seguida calculando o balance
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type !== 'outcome' && type !== 'income') {
      throw new AppError('Invalid value for type!', 500);
    }
    if (value < 0) {
      throw new AppError('Invalid value for value!', 500);
    }

    // checando se a transação for de outcome e a soma do balanco dele for menor que zero então não podemos permitir a transação ser concluida
    console.log(`total ${total} < value ${value} = ${total < value}`);
    if (type === 'outcome' && total < value) {
      throw new AppError(
        'Eiita essa transação ae ta deixando sua conta negativa! N permitiremos isso',
        500,
      );
    }
    // falta checar se existe a categoria no banco, caso sim usar o mesmo id pra essa transaction
    const searchForCategoriesById = await categoriesRepository.findOne({
      title: category,
    });

    // Se entrar no if eh pq nao existe essa categoria e precisamos cria-la
    if (!searchForCategoriesById) {
      const newCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(newCategory);

      const newTransaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });
      await transactionsRepository.save(newTransaction);

      return newTransaction;
    }

    // Com a categoria encontrada
    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: searchForCategoriesById.id,
    });
    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
