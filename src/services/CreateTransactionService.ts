import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface ResponseDTO {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: ResponseDTO): Promise<Transaction> {

    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const categoryFind = await categoryRepository.findOne({
      where: {category}
    });

    if (!categoryFind) {
      const categorySave = categoryRepository.create({ title: category });
      var { id: category_id } = await categoryRepository.save(categorySave);
    } else {
      var { id: category_id } = categoryFind;
    }

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total)
      throw new AppError('Valor de retirada maior que o total na conta', 400)

    const transaction = await transactionRepository.create({ title, value, type, category_id });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
