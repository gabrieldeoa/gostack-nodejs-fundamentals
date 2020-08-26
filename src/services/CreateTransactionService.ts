import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestTransaction): Transaction {
    const isValidType = ['income', 'outcome'].includes(type);

    if (!isValidType) {
      throw Error('Transaction type is invalid');
    }

    const isTypeOutcome = type === 'outcome';

    if (isTypeOutcome) {
      const { total } = this.transactionsRepository.getBalance();
      const hasEnoughBalance = total > value;

      if (!hasEnoughBalance) {
        throw Error('You do not have enough balance');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
