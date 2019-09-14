const respLib = require('./response.service');

class ActionsLogicService {

    constructor() {
        this._defaultProperties = {
            shoot: 1,
            block: 0,
        }
    
        this._actions = {
            shoot: 'shoot',
            block: 'block',
            reload: 'reload',
        }
        
        this._state = {
            lives: 3, 
            shoot: 1,
            block: 0,
        }
    
        this._opponentState = {
            lives: 3, 
            shoot: 1,
            block: 0,
        }
    
        /**
         * {
         *      "playerAction": 'block', 'shoot' and 'reload'
         *      "playerLife": number,
         *      "opponentAction": 'block', 'shoot' and 'reload',
         *      "opponentLife": number,
         *      "result": “not hurt”, “hurt”, “killed”.
         * }
         */
        this._previouslyMadeActions = [];
        console.log(`Actions Logic Service working.`);
    }
    
    get state() {
        return this._state;
    }

    set state(s) {
        this._state = s;
    }

    get opponentState() {
        return this._opponentState;
    }

    set opponentState(s) {
        this._opponentState = s;
    }

    updateStateLife() {
        this._state.lives = this._state.lives - 1;
    }

    updateStateShoot(s) {
        this._state.shoot = s;
    }

    updateStateBlock(b) {
        this._state.block = b;
    }


    updateOpponentStateLife() {
        this._opponentState.lives = this._opponentState.lives - 1;
    }

    updateOpponentStateShoot(s) {
        this._opponentState.shoot = s;
    }

    updateOpponentStateBlock(b) {
        this._opponentState.block = b;
    }

    resetStateDefault() {
        const def = {
            lives: 3, 
            shoot: 1,
            block: 0,
        };
        this._state = { ...def };
        this._opponentState = { ...def };
    }

    get action() {
        return this._actions;
    }

    get previousMadeActions() {
        return this._previouslyMadeActions;
    }

    set previousMadeActions(a) {
        if (!!a && this.action[a.playerAction]) {
            this._previouslyMadeActions = this._previouslyMadeActions.concat(a);
        } else {
            console.log(`The action ${ a } cannot be accepted.`);
        }
    }

    startGame() {
        this.resetStateDefault();
        this.previouslyMadeActions = a;
        return this._actions.block;
    }

    gameOver() {
        console.log(`Bot is killed.`);
        // email
        this._previouslyMadeActions = [];
        this.resetStateDefault();
        return;
    }

    makeDecision(a) {
        if (!this._previouslyMadeActions.length) {
            this.previouslyMadeActions = a;
            return this._actions.block;
        }
       
        const requestProps = respLib.ResponseParserService.requestProperties;
        switch (a[requestProps.opponentAction]) {
            case this.action.block: 
                return this.countermeasuresAgainstBlock(a)
            case this.action.reload: 
                return this.countermeasuresAgainstReload(a)
            case this.action.shoot: 
                return this.countermeasuresAgainstShoot(a);
        }
    }

    countermeasuresAgainstShoot(a) {
        
        const state = this.state;
        const oppState = this.opponentState;
        this.updateOpponentStateShoot(oppState.shoot - 1);

        if (!state.shoot) {
            state.reload = state.reload + 1;
            state.shoot = state.shoot + 1;
            this.previouslyMadeActions = a;
            return this._actions.reload;
        }

        if (state.block === 3 && (state.lives > 2)) {
            return this._actions.shoot;
        } else if (state.block === 3 && (state.lives <= 2)) {
            const prevActArr = this.previouslyMadeActions();
            return  state.lives === 2 ? this._actions.block : (state.shoot ? this._actions.shoot : this._actions.block);
        }


        this.previouslyMadeActions = a;
    }

    countermeasuresAgainstBlock(a) {
        const state = this.state;
        const oppState = this.opponentState;
        this.updateOpponentStateBlock(oppState.block + 1);
        return !!state.shoot ? this._actions.shoot : this._actions.reload;
    }

    countermeasuresAgainstReload(a) {
        // const state = this.state;
        // const oppState = this.opponentState;
        this.updateOpponentStateShoot(1);
        this.updateOpponentStateBlock(3);
        return this._actions.block;
    }

}

module.exports.ActionsLogicService = new ActionsLogicService();