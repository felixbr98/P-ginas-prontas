import { GoogleGenAI } from "@google/genai";
import { Debt, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o "FinCore Advisor", um consultor financeiro especialista em gestão de dívidas e recuperação financeira do Brasil.
Sua missão é ajudar o usuário a sair das dívidas com estratégias matemáticas e comportamentais.
Adote um tom profissional, empático, mas direto e focado em ação.
Use formatação Markdown para listas e negrito.
Seja conciso.
Baseie-se nos dados financeiros fornecidos no contexto (dívidas, renda, score).
Se o usuário perguntar sobre investimentos, lembre-o que o foco agora é eliminar dívidas caras.
`;

export const analyzeFinancialHealth = async (user: UserProfile, debts: Debt[]): Promise<string> => {
  const totalDebt = debts.reduce((acc, curr) => acc + curr.amount, 0);
  const context = `
    Perfil do Usuário:
    Nome: ${user.name}
    Renda Mensal: R$ ${user.monthlyIncome}
    Score de Crédito Interno: ${user.financialScore}
    
    Dívidas Atuais:
    ${debts.map(d => `- ${d.name} (${d.category}): R$ ${d.amount.toFixed(2)} (Juros: ${d.interestRate}% a.m.)`).join('\n')}
    
    Total de Dívida: R$ ${totalDebt.toFixed(2)}
    Razão Dívida/Renda: ${((totalDebt / user.monthlyIncome) * 100).toFixed(1)}%
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Faça um diagnóstico rápido e aponte 3 ações imediatas para melhorar minha situação. Responda em português. Contexto: ${context}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro na análise financeira:", error);
    return "Erro ao conectar com o consultor IA. Verifique sua chave de API.";
  }
};

export const sendChatMessage = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[],
  user: UserProfile, 
  debts: Debt[]
) => {
  const totalDebt = debts.reduce((acc, curr) => acc + curr.amount, 0);
  const contextInfo = `
    [DADOS DO SISTEMA]
    Total Dívidas: R$ ${totalDebt}
    Renda: R$ ${user.monthlyIncome}
    Lista Dívidas: ${debts.map(d => `${d.name} (${d.interestRate}%)`).join(', ')}
  `;

  try {
    // We create a new chat for each turn in this simple implementation, 
    // strictly enabling the context injection every time.
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\nContexto Atualizado: ${contextInfo}`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};
