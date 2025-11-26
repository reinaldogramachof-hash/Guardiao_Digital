const { VertexAI } = require('@google-cloud/vertexai'); 
const vertex = new VertexAI({ project: process.env.GOOGLE_CLOUD_PROJECT_ID, location: process.env.GOOGLE_CLOUD_LOCATION }); 
const model = vertex.preview.getGenerativeModel({ model: 'gemini-1.5-flash-001', generationConfig: { responseMimeType: "application/json" } }); 

exports.analyzeMessage = async (req, res) => { 
    const { text } = req.body; 
    const prompt = `Analise esta mensagem para idosos: "${text}". Identifique urgência, ameaça, pedido de dinheiro/dados. Responda JSON: { "status": "safe|warning|danger", "summary": "Resumo curto", "reasons": ["Motivo 1", "Motivo 2"], "tips": ["Dica prática"] }`; 
    const result = await model.generateContent(prompt); 
    res.json(JSON.parse(result.response.candidates[0].content.parts[0].text)); 
};
