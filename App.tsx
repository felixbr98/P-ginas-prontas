import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  WalletCards, 
  MessageSquareText, 
  Calculator, 
  Settings, 
  Menu, 
  LogOut,
  Bell,
  Cpu,
  Search
} from 'lucide-react';
import { Debt, DebtCategory, UserProfile, ViewState } from './types';
import { Dashboard } from './components/Dashboard';
import { DebtManager } from './components/DebtManager';
import { AIAdvisor } from './components/AIAdvisor';
import { Simulator } from './components/Simulator';
import { cn, Button } from './components/ui';

// Mock Data
const INITIAL_USER: UserProfile = {
  name: "Carlos Silva",
  email: "carlos@exemplo.com",
  monthlyIncome: 4500,
  financialScore: 645
};

const INITIAL_DEBTS: Debt[] = [
  {
    id: '1',
    name: 'Cartão Nubank',
    amount: 3450.00,
    interestRate: 14.5,
    category: DebtCategory.CREDIT_CARD,
    dueDate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Empréstimo Pessoal Itaú',
    amount: 12000.00,
    interestRate: 4.5,
    category: DebtCategory.LOAN,
    dueDate: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Cheque Especial',
    amount: 800.00,
    interestRate: 12.0,
    category: DebtCategory.OVERDRAFT,
    dueDate: new Date().toISOString()
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);
  const [user] = useState<UserProfile>(INITIAL_USER);

  const addDebt = (newDebt: Omit<Debt, 'id'>) => {
    const debt = { ...newDebt, id: Math.random().toString(36).substr(2, 9) };
    setDebts([...debts, debt]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const handleLogout = () => {
    if (confirm("Encerrar sessão segura?")) {
      window.location.reload();
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={cn(
        "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group",
        currentView === view 
          ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
      )}
    >
      <Icon className={cn("w-5 h-5 mr-3 transition-colors", currentView === view ? "text-indigo-400" : "text-slate-500 group-hover:text-white")} />
      {label}
      {currentView === view && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,1)]"></div>}
    </button>
  );

  return (
    <div className="min-h-screen flex font-sans text-slate-200 cyber-grid">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">FinCore<span className="text-cyan-400">.ai</span></span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em] ml-1">System v2.5.0</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="debts" icon={WalletCards} label="Passivos" />
          <NavItem view="simulator" icon={Calculator} label="Simulador" />
          <NavItem view="advisor" icon={MessageSquareText} label="IA Advisor" />
          
          <div className="pt-8 pb-2">
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sistema</p>
          </div>
          <NavItem view="settings" icon={Settings} label="Configurações" />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors hover:bg-rose-900/10 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Desconectar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Background glow effects */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 z-10 border-b border-slate-800/50 glass-panel sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-md text-slate-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-700 rounded-full px-4 py-1.5">
               <Search className="w-4 h-4 text-slate-500 mr-2" />
               <input type="text" placeholder="Buscar no sistema..." className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-48" />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-slate-400 hover:text-cyan-400"
                onClick={() => alert("Sistema atualizado. Sem novas notificações.")}
             >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>
             </Button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-200">{user.name}</p>
                 <p className="text-[10px] text-cyan-400 font-mono">PREMIUM USER</p>
               </div>
               <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-600 p-0.5 shadow-lg">
                 <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full object-cover rounded-md opacity-80 hover:opacity-100 transition-opacity" />
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-6 lg:p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto">
             <div className="mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight uppercase font-mono mb-1">
                   {currentView === 'aiAdvisor' ? 'Consultor Neural' : currentView}
                </h1>
                <div className="h-0.5 w-12 bg-indigo-500 rounded-full"></div>
             </div>

            {currentView === 'dashboard' && <Dashboard debts={debts} user={user} onNavigate={setCurrentView} />}
            {currentView === 'debts' && <DebtManager debts={debts} onAddDebt={addDebt} onRemoveDebt={removeDebt} />}
            {currentView === 'advisor' && <AIAdvisor user={user} debts={debts} />}
            {currentView === 'simulator' && <Simulator debts={debts} />}
            {currentView === 'settings' && (
              <div className="flex items-center justify-center h-[50vh] text-slate-500 flex-col gap-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                <Settings className="w-16 h-16 stroke-1 text-slate-700" />
                <p className="font-mono text-sm">MÓDULO DE CONFIGURAÇÃO EM DESENVOLVIMENTO...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
