const cors = require('cors')({ origin: true });
exports.runWithCors = (req, res, fn) => cors(req, res, () => fn(req, res).catch(e => { 
    console.error(e); res.status(500).json({error: e.message}); 
}));
