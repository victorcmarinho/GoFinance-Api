import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository, In } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);


    const contactsReadStream = fs.createReadStream(filePath);
    const parsers = csvParse({
      delimiter: ',',
      from_line: 2
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim());
      if (!title || !type || !value) return;
      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title
    );

    const addCategoryTitles = categories.filter(
      (category) => !existentCategoriesTitles.includes(category)
    ).filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
          title
      }))
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map( t => ({
        title: t.title,
        type: t.type,
        value: t.value,
        category: finalCategories.find(f => f.title === t.category)
      }))
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;

  }


}

export default ImportTransactionsService;
