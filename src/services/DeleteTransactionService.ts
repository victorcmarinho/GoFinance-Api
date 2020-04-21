// import AppError from '../errors/AppError';

import { getRepository } from "typeorm";
import Transaction from "../models/Transaction";

interface RequestDTO {
  id: string
}
class DeleteTransactionService {
  public async execute({id}: RequestDTO): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
