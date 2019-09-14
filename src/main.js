const express = require('express');

class Main {

    constructor() {
        this._app = express();
        this.initRouting();
    }

    initRouting = () => {
        this._app.use();
        const port = process.env.PORT;
        this.executeListener(port);
    }

    executeListener = (port = 4202) => {
       this._app.listen(port, () => {
           console.log(`The bot-node working on port: ${port}.`)
       }); 
    }

}

module.exports.main = new Main();