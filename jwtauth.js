var jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
	console.log('Authenticating...')
	var token = req.get("Authentication")
	if(token == null) return res.status(401).send('Unauthorized');
	try {
		var decoded = jwt.decode(token);
		if (decoded === null) return res.status(401).send('Unauthorized');
		if (decoded.exp >= Date.now()) return next()
	} catch (err) {			
		return next()
	}
}