import React, { useState } from 'react';
import { Plus, Trash2, TrendingDown, CreditCard } from 'lucide-react';
import { Debt, DebtCategory } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui';

interface DebtManagerProps {
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, 'id'>) => void;
  onRemoveDebt: (id: string) => void;
}

export const DebtManager: React.FC<DebtManagerProps> = ({ debts, onAddDebt, onRemoveDebt }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '',
    amount: 0,
    interestRate: 0,
    category: DebtCategory.CREDIT_CARD,
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDebt.name && newDebt.amount && newDebt.interestRate) {
      onAddDebt({
        name: newDebt.name,
        amount: Number(newDebt.amount),
        interestRate: Number(newDebt.interestRate),
        category: newDebt.category as DebtCategory,
        dueDate: newDebt.dueDate || new Date().toISOString()
      });
      setIsAdding(false);
      setNewDebt({ name: '', amount: 0, interestRate: 0, category: DebtCategory.CREDIT_CARD, dueDate: '' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
           <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
             <CreditCard className="text-cyan-400 w-6 h-6" /> Carteira de Passivos
           </h2>
           <p className="text-slate-400 text-sm mt-1">Gerencie suas obrigações financeiras.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2" variant="neon">
          <Plus className="w-4 h-4" />
          {isAdding ? 'Cancelar' : 'Nova Dívida'}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-cyan-500/20 bg-slate-900/80 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <CardHeader>
            <CardTitle className="text-cyan-400">Cadastrar Nova Dívida</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Nome</label>
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Ex: Cartão Visa"
                  value={newDebt.name}
                  onChange={e => setNewDebt({...newDebt, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Valor Atual (R$)</label>
                <input 
                  type="number" 
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  value={newDebt.amount || ''}
                  onChange={e => setNewDebt({...newDebt, amount: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Juros Mensal (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="0.0"
                  value={newDebt.interestRate || ''}
                  onChange={e => setNewDebt({...newDebt, interestRate: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Categoria</label>
                 <select 
                    className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    value={newDebt.category}
                    onChange={e => setNewDebt({...newDebt, category: e.target.value as DebtCategory})}
                 >
                    {Object.values(DebtCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                 </select>
              </div>
              <div className="lg:col-span-4 flex justify-end">
                <Button type="submit" variant="primary" className="w-full md:w-auto">Confirmar Registro</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-xs font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Dívida</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Saldo Devedor</th>
                  <th className="p-4">Juros (a.m.)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {debts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="p-4 font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">{debt.name}</td>
                    <td className="p-4 text-slate-500">{debt.category}</td>
                    <td className="p-4 font-mono font-bold text-slate-200">R$ {debt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4">
                      <Badge variant={debt.interestRate > 5 ? 'danger' : 'warning'}>
                        {debt.interestRate}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      {debt.interestRate > 8 ? (
                         <div className="flex items-center text-rose-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                           <TrendingDown className="w-3 h-3 mr-1" /> Crítica
                         </div>
                      ) : (
                        <span className="text-slate-500 text-xs">Controlado</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => onRemoveDebt(debt.id)}
                        className="text-slate-600 hover:text-rose-500 transition-colors p-2 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {debts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500">
                      Nenhum passivo registrado no sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
