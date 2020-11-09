import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

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
    const balance = this.transactionsRepository.getBalance();

    // aqui calculamos balanco total menos o valor da transacao que o usario esta tentando fazer
    const total = balance.total - value;

    // checando se a transação for de outcome e a soma do balanco dele for menor que zero então não podemos permitir a transação ser concluida
    if (type === 'outcome' && total < 0) {
      throw new AppError(
        'Eiita essa transação ae ta deixando sua conta negativa! N permitiremos isso',
        400,
      );
    }
    // falta checar se existe a categoria no banco, caso sim usar o mesmo id pra essa transaction

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category,
    });

    return transaction;
  }
}

export default CreateTransactionService;
