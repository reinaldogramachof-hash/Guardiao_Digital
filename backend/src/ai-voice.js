const speech = require('@google-cloud/speech').SpeechClient; 
const client = new speech(); 
const Busboy = require('busboy'); 
const { analyzeMessage } = require('./ai-text'); 

exports.analyzeVoice = (req, res) => { 
    const busboy = Busboy({ headers: req.headers }); 
    let audioData = []; 
    busboy.on('file', (_, file) => file.on('data', d => audioData.push(d))); 
    busboy.on('finish', async () => { 
        const audio = Buffer.concat(audioData).toString('base64'); 
        const [response] = await client.recognize({ audio: { content: audio }, config: { encoding: 'WEBM_OPUS', sampleRateHertz: 48000, languageCode: 'pt-BR', model: 'latest_long' }}); 
        const text = response.results.map(r => r.alternatives[0].transcript).join('\n'); 
        if(!text) return res.json({ status: 'warning', summary: 'Áudio inaudível', reasons: [], tips: [] }); 
        req.body = { text }; 
        analyzeMessage(req, res); 
    }); 
    busboy.end(req.rawBody); 
};
