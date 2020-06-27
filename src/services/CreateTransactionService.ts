import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Response {
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
  }: Response): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const categoryRepos = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError("You don't enough balance for this transection", 400);
    }

    let transectionCategory = await categoryRepos.findOne({
      where: {
        title: category,
      },
    });

    if (!transectionCategory) {
      transectionCategory = categoryRepos.create({
        title: category,
      });

      await categoryRepos.save(transectionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transectionCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
