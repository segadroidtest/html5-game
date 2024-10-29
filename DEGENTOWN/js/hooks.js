var SD_Hooks = {
    debug: true,

    getLanguage: function(supportedLanguages) {
        return SD.initLangs(supportedLanguages);
    },

    start: function() {
        SD_Hooks.debug && console.log('game started');
        SD.trigger({
            type: 'start'
        });
        gdsdk.showAd();
    },

    levelUp: function(level, score, callback) {
        SD_Hooks.debug && console.log('level up:' + level + '/' + score);
        SD.trigger({
            type: 'levelUp',
            level: level,
            lastLevelScore: score
        }, callback);
        // updateShare(level+1,score); 
        // Play68.setRankingLevelScoreDesc(level+1,score);
    },

    gameOver: function(level, score, callback) {
        SD_Hooks.debug && console.log('game over:' + level + '/' + score);
        SD.trigger({
            type: 'gameOver',
            score: score
        }, callback);
    },

    gameCompleted: function(score, callback) {
        SD_Hooks.debug && console.log('game completed:' + score);
        SD.trigger({
            type: 'gameCompleted',
            score: score
        }, callback);
    },

    gamePause: function(state, callback) { // state: on|off
        SD_Hooks.debug && console.log('game pause:' + state);
        SD.trigger({
            type: 'gamePause',
            state: state
        }, callback);
    },

    gameRestart: function(callback) {
        SD_Hooks.debug && console.log('game restart:');
        SD.trigger({
            type: 'gameRestart'
        }, callback);
        gdsdk.showAd();
    },

    selectMainMenu: function(callback) {
        SD_Hooks.debug && console.log('selectMainMenu:');
        SD.trigger({
            type: 'selectMainMenu'
        }, callback);
    },

    selectLevel: function(level, callback) {
        SD_Hooks.debug && console.log('selectLevel:' + level);
        SD.trigger({
            type: 'selectLevel',
            level: level
        }, callback);
    },

    setSound: function(state, callback) { // state: on|off
        SD_Hooks.debug && console.log('setSound:' + state);
        SD.trigger({
            type: 'gameCompleted',
            state: state
        }, callback);
    },

    setOrientationHandler: function(f) {
        SD.setOrientationHandler(f);
    },

    setResizeHandler: function(f) {
        SD.setResizeHandler(f);
    }
};