const express = require('express');
const bodyParser = require('body-parser');
const rsLib = require('./services/response.service');

class Main {

    constructor() {
        this._app = express();
        this.initEndpoints();
    }

    initEndpoints() {
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.post('/bot', rsLib.ResponseParserService.postRequestHandler)
        this._app.use(() => {

        });
        const port = process.env.PORT;
        this.executeListener(port);
    }

    executeListener(port = 4202) {
       this._app.listen(port, () => {
           console.log(`The bot-node working on port: ${port}.`)
       }); 
    }

}

module.exports.main = new Main();