const { VertexAI } = require('@google-cloud/vertexai');

const vertexAi = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID,
    location: process.env.GOOGLE_CLOUD_LOCATION
});

const model = vertexAi.preview.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
    generationConfig: { responseMimeType: "application/json" }
});

async function analyzeNews(req, res) {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Texto não fornecido' });

    const prompt = `
    Atue como um Verificador de Fatos (Fact Checker) para idosos.
    Analise a manchete ou notícia: "${text}".

    Critérios de Alerta (Danger/Warning):
    - Notícias catastróficas sem fonte (ex: "contas bloqueadas", "confisco", "governo proibiu").
    - Promessas de dinheiro fácil do governo ("resgate seu dinheiro esquecido").
    - Pânico social ou saúde pública sem referência oficial.
    
    Responda JSON:
    {
      "status": "safe" | "warning" | "danger",
      "summary": "Explicação curta se é verdade, mentira ou inconclusivo.",
      "reasons": ["Motivo 1", "Motivo 2"],
      "tips": ["Dica de verificação"]
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const textResp = result.response.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(textResp);
        return res.json(parsed);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: 'warning', summary: 'Erro na análise inteligente.' });
    }
}

module.exports = { analyzeNews };

