import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Cpu } from 'lucide-react';
import { Debt, UserProfile, ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';

interface AIAdvisorProps {
  user: UserProfile;
  debts: Debt[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ user, debts }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Olá ${user.name}. Sistema FinCore AI inicializado. \nProcessei suas ${debts.length} obrigações financeiras. \n\nEstou pronto para traçar estratégias de liquidação ou análise orçamentária. Como prosseguir?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const executeSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(userMsg.text, history, user, debts);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Erro no processamento neural. Tente novamente.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Falha na conexão segura. Verifique suas credenciais de API.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = () => {
    executeSendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-140px)] min-h-[500px]">
      <div className="lg:col-span-2 flex flex-col h-full">
        <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-indigo-500/20 bg-slate-900/80 backdrop-blur-md h-full relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 tracking-wide font-mono">FinCore AI <span className="text-xs text-indigo-400">v2.5</span></h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center">
                Conexão Segura
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' ? 'bg-slate-800 border-slate-600' : 'bg-indigo-950 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-slate-400" /> : <Cpu className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className={`max-w-[85%] rounded-lg px-5 py-4 text-sm leading-relaxed border backdrop-blur-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-800/60 text-slate-200 border-slate-700' 
                    : 'bg-indigo-950/40 text-indigo-100 border-indigo-500/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  <div className={`text-[10px] mt-2 opacity-50 text-right font-mono uppercase tracking-wider ${msg.role === 'user' ? 'text-slate-400' : 'text-indigo-300'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
                <div className="bg-indigo-950/30 text-indigo-300 rounded-lg border border-indigo-500/10 px-4 py-3 text-xs flex items-center gap-1 font-mono">
                  PROCESSANDO DADOS...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-xl">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Insira comando ou pergunta..."
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all font-mono"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendClick} 
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-lg p-0 flex items-center justify-center shrink-0"
                variant="neon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-2 font-mono">
              IA GENERATIVA - VERIFIQUE INFORMAÇÕES CRÍTICAS
            </p>
          </div>
        </Card>
      </div>

      <div className="hidden lg:flex flex-col gap-4">
        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
          <CardHeader>
            <CardTitle className="text-indigo-200 text-sm uppercase tracking-widest">Protocolos Sugeridos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-xs text-indigo-100">
              <li className="flex gap-3 items-start">
                <span className="bg-indigo-500/20 text-indigo-300 w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0 font-mono border border-indigo-500/30">01</span>
                <span>Negocie passivos com CET > 10% a.m. imediatamente.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-indigo-500/20 text-indigo-300 w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0 font-mono border border-indigo-500/30">02</span>
                <span>Ative o modo "Snowball" no simulador para vitórias rápidas.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-indigo-500/20 text-indigo-300 w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0 font-mono border border-indigo-500/30">03</span>
                <span>Reduza custos fixos em 15% para aumentar aporte.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="text-sm text-slate-400 uppercase tracking-widest">Comandos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <button 
                onClick={() => executeSendMessage("Qual dívida devo pagar primeiro?")}
                className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 transition-all border border-slate-700 font-mono group"
             >
               <span className="text-cyan-500 mr-2 group-hover:animate-pulse">></span> "Priorizar dívidas"
             </button>
             <button 
                onClick={() => executeSendMessage("Crie um plano para quitar tudo em 12 meses.")}
                className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 transition-all border border-slate-700 font-mono group"
             >
               <span className="text-cyan-500 mr-2 group-hover:animate-pulse">></span> "Plano 12 meses"
             </button>
             <button 
                onClick={() => executeSendMessage("Como melhorar meu score?")}
                className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 transition-all border border-slate-700 font-mono group"
             >
               <span className="text-cyan-500 mr-2 group-hover:animate-pulse">></span> "Otimizar Score"
             </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
