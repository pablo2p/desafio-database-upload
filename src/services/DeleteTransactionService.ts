import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
/* import Transection from '../models/Transaction'; */

import TransectionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransectionRepository);

    const transection = await repository.findOne(id);

    if (!transection) {
      throw new AppError('Transection does not exist.', 400);
    }

    await repository.remove(transection);
  }
}

export default DeleteTransactionService;
