const { WebRiskServiceClient } = require('@google-cloud/web-risk'); 
const { VertexAI } = require('@google-cloud/vertexai'); 
const webRisk = new WebRiskServiceClient(); 
const vertex = new VertexAI({ project: process.env.GOOGLE_CLOUD_PROJECT_ID, location: process.env.GOOGLE_CLOUD_LOCATION }); 
const model = vertex.preview.getGenerativeModel({ model: 'gemini-1.5-flash-001', generationConfig: { responseMimeType: "application/json" } }); 

exports.analyzeLink = async (req, res) => { 
    const { url } = req.body; 
    try { 
        const [result] = await webRisk.searchUris({ uri: url, threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'] }); 
        if (result && Array.isArray(result.threats) && result.threats.length) return res.json({ status: 'danger', summary: 'Site perigoso (Google Web Risk)', reasons: ['Detectado malware/phishing'], tips: ['Não clique!'] }); 
    } catch(e) {} 
    
    const prompt = `Analise a string da URL "${url}" sem acessar. Busque typosquatting ou marcas falsas. JSON: { "status": "safe|warning|danger", "summary": "Análise da URL", "reasons": [], "tips": [] }`; 
    const result = await model.generateContent(prompt); 
    res.json(JSON.parse(result.response.candidates[0].content.parts[0].text)); 
};
