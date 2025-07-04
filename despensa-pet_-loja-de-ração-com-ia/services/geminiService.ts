import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatModel = 'gemini-2.5-flash-preview-04-17';

let chatInstance: Chat | null = null;

const getChatInstance = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: chatModel,
      config: {
        systemInstruction: `Você é 'Patitas', um assistente de IA amigável e experiente da 'Despensa Pet', uma loja online de ração para animais de estimação. Seu objetivo é fornecer um excelente atendimento ao cliente.
- Você pode ajudar os usuários a encontrar produtos, responder a perguntas sobre nutrição de pets e fornecer informações sobre seus pedidos.
- Seja alegre, empático e use trocadilhos relacionados a animais de estimação ocasionalmente.
- Não forneça conselhos médicos, mas você pode sugerir a consulta a um veterinário.
- Quando perguntado sobre pedidos, informe que você pode verificar o status, mas não pode fazer alterações diretamente.
- Mantenha as respostas concisas e fáceis de entender.
- Não invente informações sobre produtos; se você não souber, diga que perguntará a um colega humano.`,
      },
    });
  }
  return chatInstance;
};

export const getChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const chat = getChatInstance();
    const result: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Error getting chat response from Gemini:", error);
    return "Estou com um pouco de dificuldade para me conectar ao meu cérebro agora. Por favor, tente novamente em um momento.";
  }
};

export const generateProductDescription = async (productName: string, keywords: string): Promise<string> => {
    const prompt = `Gere uma descrição de produto de e-commerce atraente, amigável e informativa para uma ração de pet chamada "${productName}". 
    Incorpore as seguintes palavras-chave: ${keywords}. 
    A descrição deve ter cerca de 50-70 palavras. Destaque os principais benefícios para o pet.
    Faça com que pareça delicioso e saudável para os animais de estimação.
    Não use markdown. Apenas retorne o texto.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating product description:", error);
        return "Falha ao gerar a descrição. Por favor, tente novamente.";
    }
};