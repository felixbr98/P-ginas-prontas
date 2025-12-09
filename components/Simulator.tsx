import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Debt } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui';
import { Calculator, Snowflake, Flame, Activity } from 'lucide-react';

interface SimulatorProps {
  debts: Debt[];
}

export const Simulator: React.FC<SimulatorProps> = ({ debts }) => {
  const totalDebt = debts.reduce((acc, d) => acc + d.amount, 0);
  const avgInterest = debts.reduce((acc, d) => acc + (d.interestRate * d.amount), 0) / (totalDebt || 1);
  
  const [monthlyPayment, setMonthlyPayment] = useState<number>(Math.ceil(totalDebt * 0.05));
  const [projection, setProjection] = useState<{ month: number; balance: number }[]>([]);
  const [monthsToPayoff, setMonthsToPayoff] = useState(0);
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');

  useEffect(() => {
    if (totalDebt === 0) {
      setProjection([]);
      return;
    }

    let balance = totalDebt;
    const data = [];
    let month = 0;
    
    while (balance > 0 && month < 120) {
      data.push({ month, balance: Math.max(0, balance) });
      const interest = balance * (avgInterest / 100);
      balance = balance + interest - monthlyPayment;
      month++;
    }
    data.push({ month, balance: Math.max(0, balance) });
    setProjection(data);
    setMonthsToPayoff(month >= 120 ? -1 : month);
  }, [totalDebt, avgInterest, monthlyPayment]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <Card className="bg-slate-900/80 border-cyan-900/50 shadow-[0_0_30px_rgba(8,145,178,0.1)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Calculator className="w-5 h-5" /> SIMULADOR PREDITIVO
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Projete o impacto do aumento de aporte mensal na liquidação de passivos.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex justify-between">
                  <span>Aporte Mensal</span>
                  <span className="text-cyan-400">R$ {monthlyPayment}</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={Math.ceil(totalDebt * (avgInterest/100))}
                    max={totalDebt}
                    step={50}
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Mínimo (juros): <span className="text-rose-400">R$ {Math.ceil(totalDebt * (avgInterest/100)).toLocaleString()}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                   <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tempo Estimado</p>
                   <p className="text-3xl font-bold text-emerald-400 font-mono">
                     {monthsToPayoff === -1 ? '>10a' : `${monthsToPayoff}`} <span className="text-sm text-emerald-600/70">meses</span>
                   </p>
                 </div>
                 <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors"></div>
                   <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Custo de Juros</p>
                   <p className="text-3xl font-bold text-rose-400 font-mono">
                     <span className="text-lg">R$</span> {(projection.length * monthlyPayment - totalDebt).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                   </p>
                 </div>
              </div>
            </div>

            <div className="h-[250px] w-full text-slate-900">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection}>
                  <defs>
                    <linearGradient id="colorBalanceSim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 10}} />
                  <YAxis stroke="#64748b" tickFormatter={(val) => `R$${val/1000}k`} tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorBalanceSim)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-300">Algoritmo de Priorização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <p className="text-slate-500 text-sm flex-1 leading-relaxed">
              O sistema utiliza dois modelos matemáticos principais para otimização de fluxo de caixa. Selecione o modelo desejado para recalcular o plano de ataque.
            </p>
            <div className="flex gap-4 w-full md:w-auto">
              
              {/* Snowball Button with Tooltip */}
              <div className="group relative flex-1 md:flex-none">
                <Button 
                  variant={strategy === 'snowball' ? 'neon' : 'secondary'} 
                  onClick={() => setStrategy('snowball')}
                  className="gap-2 w-full"
                >
                  <Snowflake className="w-4 h-4" />
                  Snowball
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg text-xs text-slate-300 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 text-center transform group-hover:-translate-y-1">
                  <div className="font-bold text-cyan-400 mb-1 tracking-wide">FOCO PSICOLÓGICO</div>
                  Prioriza eliminar dívidas de <span className="text-white font-semibold">MENOR VALOR</span> para gerar vitórias rápidas e motivação.
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/90 border-r border-b border-slate-700 rotate-45"></div>
                </div>
              </div>

              {/* Avalanche Button with Tooltip */}
              <div className="group relative flex-1 md:flex-none">
                <Button 
                  variant={strategy === 'avalanche' ? 'neon' : 'secondary'} 
                  onClick={() => setStrategy('avalanche')}
                  className="gap-2 w-full"
                >
                  <Flame className="w-4 h-4" />
                  Avalanche
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg text-xs text-slate-300 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 text-center transform group-hover:-translate-y-1">
                  <div className="font-bold text-indigo-400 mb-1 tracking-wide">FOCO MATEMÁTICO</div>
                  Prioriza eliminar dívidas com <span className="text-white font-semibold">MAIOR JUROS</span> para máxima economia financeira.
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/90 border-r border-b border-slate-700 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
