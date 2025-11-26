require('dotenv').config();
const functions = require('@google-cloud/functions-framework');
const { runWithCors } = require('./src/utils');
const { analyzeMessage } = require('./src/ai-text');
const { analyzeLink } = require('./src/ai-link');
const { analyzeVoice } = require('./src/ai-voice');
const { analyzeNews } = require('./src/ai-news');

// Define a função principal exportada 'api'
functions.http('api', (req, res) => {
  runWithCors(req, res, async (req, res) => {
    
    // Roteamento simples baseado na URL
    // Ex: POST /analyze-message
    const path = req.path;

    switch (path) {
      case '/analyze-message':
        return analyzeMessage(req, res);
        
      case '/analyze-link':
        return analyzeLink(req, res);
        
      case '/analyze-voice':
        return analyzeVoice(req, res);
      
      case '/analyze-news':
        return analyzeNews(req, res);
        
      default:
        res.status(404).json({ error: 'Endpoint não encontrado' });
    }
  });
});
