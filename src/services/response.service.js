const actionLib = require('./actions.logic.service');


class ResponseParserService {

    constructor() {
        this._requestProperties = {
            playerAction:     "playerAction", 
            playerLife:       "playerLife",
            playerBlock:      "playerBlock",
            opponentAction:   "opponentAction",
            opponentLife:     "opponentLife",
            opponentBlock:    "opponentBlock",
            result:           "result",
            game:             "game",
        }
        console.log(`Response Parser Service working.`);       
    }

    async postRequestHandler(req, res) {
        const body = req.body;
        const isGame = body['game'];
        if (isGame) {
            const action = isGame === 'begin' ? await  actionLib.ActionsLogicService.startGame() : await actionLib.ActionsLogicService.gameOver();
            res.json({ action });
        } else {
            const action =  await actionLib.ActionsLogicService.makeDecision(body);
            res.json({ action });
        }
    }

    get requestProperties() {
        return this._requestProperties;
    }


}

module.exports.ResponseParserService = new ResponseParserService();