const login = require("./controllers/login")
const register = require("./controllers/registration")
const logger = require("./config/logger").logger;
const validateJWT = require("./controllers/jwtSignValidate").verification;
const tokenExtractor = require("./controllers/tokenExtractor");
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('UP');
    });
    // TODO: Add JOI Validation
    app.post('/login', async function(req, res) {
        // just send the username password combo to the login controller.
        let response = await login(req.body.username, req.body.password);
        if (response !== false) {
            // successful validation and json token
            res.status(200).json({"token": response})

        } else {
        res.json({"Error": "Either user does not exist or wrong password."});
        }
    });

    app.post('/register', async function(req, res) {
        let response = await register(req.body.username, req.body.password, "user");
        if (response !== false) {
            res.status(200).json({"object": response})
        } else {res.status(500).json({"Message": "Failed to create user"})}
        
    });

    app.post('/validate', async function(req, res) {
        let token = await tokenExtractor(req.headers.authorization);
        if (token !== false) {
            let response = await validateJWT(token);
            if (response !== false) {
                res.status(200).json({"token": response});
            } else {
                res.status(403).json({"message": "decoding failed"})
            }
        } else {
            res.status(403).json({"message": "Failed Extraction"})
        }
    })
    return app;
}