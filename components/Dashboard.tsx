import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle, BrainCircuit, Activity } from 'lucide-react';
import { Debt, UserProfile, ViewState } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Badge, cn } from './ui';

interface DashboardProps {
  debts: Debt[];
  user: UserProfile;
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ debts, user, onNavigate }) => {
  const totalDebt = useMemo(() => debts.reduce((acc, debt) => acc + debt.amount, 0), [debts]);
  const debtToIncomeRatio = (totalDebt / user.monthlyIncome) * 100;
  
  // Simulated projection data
  const data = [
    { name: 'Jan', divida: totalDebt * 1.1 },
    { name: 'Fev', divida: totalDebt * 1.05 },
    { name: 'Mar', divida: totalDebt },
    { name: 'Abr', divida: totalDebt * 0.95 },
    { name: 'Mai', divida: totalDebt * 0.88 },
    { name: 'Jun', divida: totalDebt * 0.80 },
  ];

  const getHealthStatus = () => {
    if (user.financialScore > 800) return { label: 'SISTEMA ÓTIMO', color: 'text-emerald-400', icon: CheckCircle };
    if (user.financialScore > 600) return { label: 'ESTÁVEL', color: 'text-cyan-400', icon: TrendingUp };
    return { label: 'CRÍTICO', color: 'text-rose-500', icon: AlertTriangle };
  };

  const status = getHealthStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Activity className="w-16 h-16 text-indigo-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Dívida Total</CardTitle>
            <span className="text-indigo-400 text-xs font-mono border border-indigo-500/30 px-1 rounded">BRL</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight drop-shadow-md">R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-rose-400 flex items-center mt-2 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.5% vs. ciclo anterior
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-cyan-900/50">
           <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Score FinCore</CardTitle>
            <BrainCircuit className="h-4 w-4 text-cyan-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{user.financialScore}</div>
            <p className={cn("text-xs flex items-center mt-2 font-bold tracking-wider", status.color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Comprometimento</CardTitle>
            <span className="text-slate-500 text-xs font-mono">% RENDA</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{debtToIncomeRatio.toFixed(1)}%</div>
            <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${Math.min(debtToIncomeRatio, 100)}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Limite ideal: 30%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Próximo Vencimento</CardTitle>
            <span className="text-rose-500/80 text-xs font-mono">ALERT</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">5 <span className="text-sm font-normal text-slate-400">dias</span></div>
            <p className="text-xs text-slate-400 mt-2 truncate">Nubank (R$ 450,00)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-slate-200">Projeção de Quitação</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorDivida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#f1f5f9' }}
                    itemStyle={{ color: '#22d3ee' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Saldo Devedor']}
                  />
                  <Area type="monotone" dataKey="divida" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorDivida)" activeDot={{ r: 6, fill: "#fff", stroke: "#22d3ee" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-slate-200">Dívidas Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {debts.sort((a, b) => b.interestRate - a.interestRate).slice(0, 3).map((debt) => (
                <div key={debt.id} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0 group">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-200 group-hover:text-cyan-400 transition-colors">{debt.name}</p>
                    <p className="text-xs text-slate-500">{debt.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-200 font-mono">R$ {debt.amount.toLocaleString()}</p>
                    <Badge variant="danger" >{debt.interestRate}% a.m.</Badge>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <button 
                  onClick={() => onNavigate('advisor')}
                  className="text-sm text-cyan-500 hover:text-cyan-400 font-medium w-full text-center transition-colors border border-cyan-500/20 py-2 rounded-lg hover:bg-cyan-500/10 uppercase tracking-widest text-xs"
                >
                  Ativar Consultor IA &rarr;
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
