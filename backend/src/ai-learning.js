const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
// Note: Ensure GOOGLE_CLOUD_PROJECT_ID and GOOGLE_CLOUD_LOCATION are set in .env
const vertex = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID || 'guardiao-digital-dev', // Fallback for dev
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
});

const model = vertex.preview.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
    generationConfig: { responseMimeType: "application/json" }
});

exports.generateQuiz = async (req, res) => {
    try {
        const prompt = `
            Gere uma pergunta de múltipla escolha sobre segurança digital focada em idosos.
            Temas possíveis: Phishing, Senhas, Fake News, Golpes do WhatsApp, Falso Parente.
            A linguagem deve ser simples, direta e educativa.
            
            Retorne APENAS um JSON no seguinte formato:
            {
                "question": "A pergunta aqui",
                "options": ["Opção A (Errada)", "Opção B (Correta)", "Opção C (Errada)"],
                "correctIndex": 1,
                "explanation": "Explicação curta e educativa sobre por que a resposta está correta."
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.candidates[0].content.parts[0].text;
        res.json(JSON.parse(responseText));
    } catch (error) {
        console.error('Quiz Error:', error);
        res.status(500).json({ error: 'Erro ao gerar quiz' });
    }
};

exports.startSimulation = async (req, res) => {
    try {
        const prompt = `
            Você é um simulador de golpes para treinamento de idosos.
            Escolha aleatoriamente um destes cenários:
            1. Falso Filho (pedindo dinheiro/ajuda)
            2. Falso Gerente de Banco (alerta de invasão)
            3. Falso Prêmo/Sorteio
            4. Falso Suporte Técnico
            
            Gere a PRIMEIRA mensagem que o golpista enviaria. Seja convincente mas use táticas comuns (urgência, autoridade, oportunidade).
            
            Retorne APENAS um JSON no seguinte formato:
            {
                "scamType": "Nome do Golpe (ex: Falso Filho)",
                "message": "A mensagem do golpista aqui"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.candidates[0].content.parts[0].text;
        res.json(JSON.parse(responseText));
    } catch (error) {
        console.error('Sim Start Error:', error);
        res.status(500).json({ error: 'Erro ao iniciar simulação' });
    }
};

exports.replySimulation = async (req, res) => {
    try {
        const { history, userMessage, scamType } = req.body;

        const prompt = `
            Você é um simulador de golpes (${scamType}) treinando um idoso.
            
            Histórico da conversa:
            ${JSON.stringify(history)}
            
            Nova resposta do usuário (idoso): "${userMessage}"
            
            Analise a resposta do usuário:
            1. Se ele desconfiou, fez perguntas de segurança ou se recusou a pagar/dar dados -> STATUS: 'success' (O usuário venceu).
            2. Se ele acreditou, concordou em pagar, passou dados ou mostrou vulnerabilidade crítica -> STATUS: 'failed' (O usuário perdeu).
            3. Se a conversa ainda está desenrolando e não há definição clara -> STATUS: 'ongoing'.
            
            Se 'ongoing', gere a próxima resposta do golpista (insista, crie mais urgência ou dê uma desculpa).
            Se 'success' ou 'failed', gere um feedback educativo curto explicando o resultado.
            
            Retorne APENAS um JSON no seguinte formato:
            {
                "status": "ongoing|success|failed",
                "message": "Sua resposta de golpista (se ongoing) OU Feedback educativo (se success/failed)",
                "feedback": "Feedback educativo adicional (opcional, preencha se success/failed)"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.candidates[0].content.parts[0].text;
        res.json(JSON.parse(responseText));
    } catch (error) {
        console.error('Sim Reply Error:', error);
        res.status(500).json({ error: 'Erro ao processar resposta' });
    }
};
