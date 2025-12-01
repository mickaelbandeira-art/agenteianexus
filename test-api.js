import { GoogleGenerativeAI } from "@google/generative-ai";

// Chave fornecida pelo usuário
const API_KEY = "AIzaSyAJfjuS5IHLRQD3IMQxi5HxVloqIHGPyNU";

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log("Listando modelos disponíveis...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Tentar uma chamada simples para ver se conecta
        console.log("Testando gemini-1.5-flash...");
        const result = await model.generateContent("Olá, isso é um teste.");
        console.log("Resposta gemini-1.5-flash:", result.response.text());

    } catch (error) {
        console.error("Erro ao testar gemini-1.5-flash:", error.message);
    }

    try {
        console.log("\nTestando gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Olá, isso é um teste.");
        console.log("Resposta gemini-pro:", resultPro.response.text());
    } catch (error) {
        console.error("Erro ao testar gemini-pro:", error.message);
    }
}

listModels();
