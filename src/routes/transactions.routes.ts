import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadCsvConfig from '../config/uploadCsv';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadCsvConfig);

transactionsRouter.get('/', async (request, response) => {
  debugger
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({transactions, balance});
  
});

transactionsRouter.post('/', async (request, response) => {
  const {title, value, type, category} = request.body;
  
  const createTransactionService = new CreateTransactionService();
  
  const {id} = await createTransactionService.execute({title, value, type, category});

  return response.json({id,title, value, type, category});
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  deleteTransactionService.execute({id:request.params['id']});
    return response.status(204).send();
});

transactionsRouter.post('/import',upload.single('file'), async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();
  const transactions = await importTransactionsService.execute(request.file.path);
  return response.json(transactions);
});

export default transactionsRouter;
