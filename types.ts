export enum DebtCategory {
  CREDIT_CARD = 'Cartão de Crédito',
  LOAN = 'Empréstimo Pessoal',
  FINANCING = 'Financiamento',
  OVERDRAFT = 'Cheque Especial',
  OTHER = 'Outros'
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number; // Monthly interest rate in %
  category: DebtCategory;
  dueDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  monthlyIncome: number;
  financialScore: number; // 0 to 1000
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewState = 'dashboard' | 'debts' | 'advisor' | 'simulator' | 'settings';
