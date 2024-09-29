var SD_Lang = 'en';

var SD = {
    loaded: false,
    debug: false,
    lang: 'en',
    gameJS: [],
    d: document,
    loadScrnTimer: 10,

    boot: function() {
        SD.initLangs(window.gameLangs);

        if (SD_exists()) {
            window.segadroid.gameInitCallback = SD.startGame;
            window.segadroid.getReady();
        } else {
            SD.startGame();
        }
    },

    startGame: function() {
        if (SD.loaded) return;
        SD.loaded = true;

        SD.showSpinner();

        if (typeof window.gamePreLoader == "function") {
            window.gamePreLoader();
        }

        SD.loadJsFiles(window.gameJS, function() {
            SD.hideLoadScrn();
            if (window.gameOnLoadScript) {
                eval(window.gameOnLoadScript); // dear future me, i am deeply sorry!
            }
        });

    },

    showSpinner: function() {
        //SD.d.getElementById('SD-spinner').setAttribute('class','');
    },

    showLoadingBar: function() {
        return (SD.getUrlParameters()['disableLoadingBar'] === undefined || SD.getUrlParameters()['disableLoadingBar'] !== "true")
    },

    showLoadScrn: function() {
        var loadScrn = SD.d.createElement('div');
        loadScrn.setAttribute('id', 'SD-loadscrn');

        if (SD.showLoadingBar()) {
            var spin = SD.d.createElement('div');
            spin.setAttribute('id', 'SD-spinner');
            loadScrn.appendChild(spin);
        }

        if (window.location.href.indexOf("adultcontent") != -1) {
            var text = SD.d.createElement('div');
            text.setAttribute('id', 'SD-loadtext');
            text.innerHTML = 'One moment please...<br>Your site is almost loaded!';
            loadScrn.appendChild(text);
        }

        var displayLoadScrn = function() {
            var body = SD.d.getElementsByTagName('body')[0];
            if (typeof body != "undefined") {
                if (SD.d.getElementById('SD-loadscrn') == null) {
                    SD.debug && console.log('show load-screen: complete');
                    body.appendChild(loadScrn);
                }
                SD.loadVoyager();
            } else {
                if (SD.debug) console.log('show load-screen: body-tag not ready. retrying in ' + SD.loadScrnTimer + 'ms');
                setTimeout(displayLoadScrn, SD.loadScrnTimer);
            }
        };

        displayLoadScrn();
    },

    hideLoadScrn: function() {
        var loadscrn = SD.d.getElementById('SD-loadscrn');
        if (loadscrn)
            loadscrn.parentNode.removeChild(loadscrn);
    },

    loadJsFiles: function(files, callback) {
        var head = SD.d.getElementsByTagName('head')[0] || document.documentElement,
            loaded = [],
            callbacksUntilFinish = files.length;

        if (files.length > 0) {
            var script = document.createElement('script'),
                loaded = false;
            script.type = 'text/javascript';
            script.src = files[0];
            files.shift();

            var done = false;
            script.onreadystatechange = script.onload = function() {
                if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    if (head && script.parentNode) {
                        head.removeChild(script);
                    }

                    SD.loadJsFiles(files, callback);
                }
            };

            head.insertBefore(script, head.firstChild);
            if (SD.debug) console.log('loading ' + script.src + ', ' + files.length + ' files left.');
        } else if (typeof callback == 'function') {
            if (SD.debug) console.log('calling callback: ' + callback);
            callback();
        }
    },

    loadCSSFiles: function(files) {
        if (files.length == 0) return;
        var head = SD.d.getElementsByTagName('head')[0] || document.documentElement;

        for (var i = 0; i < files.length; i++) {
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = files[i];
            head.insertBefore(css, head.firstChild);
        }
    },

    trigger: function(data, callback) {
        if (!SD_exists()) return false;

        switch (data.type) {
            case 'start':
                d = {
                    type: window.segadroid.eventStartingGame
                };
                break;
            case 'levelUp':
                d = {
                    type: window.segadroid.eventLevelUp,
                    level: data.level
                };
                break;
            case 'gameOver':
                d = {
                    type: window.segadroid.eventGameOver,
                    score: data.score
                };
                break;
            case 'gameCompleted':
                d = {
                    type: window.segadroid.eventGameCompleted,
                    score: data.score
                };
                break;
            case 'gamePause':
                d = {
                    type: window.segadroid.eventGamePause,
                    state: data.state
                };
                break;
            case 'gameRestart':
                d = {
                    type: window.segadroid.eventGameRestart
                };
                break;
            case 'selectLevel':
                d = {
                    type: window.segadroid.eventSelectLevel,
                    level: data.level
                };
                break;
            case 'selectMainMenu':
                d = {
                    type: window.segadroid.eventSelectMainMenu
                };
                break;
            case 'setSound':
                d = {
                    type: window.segadroid.eventSound,
                    state: data.state
                };
                break;
        }

        window.segadroid.trigger(d, callback);

        return true;
    },

    initLangs: function(supported_languages) {
        var tmp_lang = typeof SD_getLang == 'function' ? SD_getLang() : 'en';
        var hasLanguages = (Object.prototype.toString.call(supported_languages)).toLowerCase() == "[object array]";
        if (hasLanguages && supported_languages.indexOf(tmp_lang) >= 0)
            SD.lang = tmp_lang;

        SD_Lang = SD.lang; // support for old versions, that still use SD_Lang
        return SD.lang;
    },

    getLang: function() {
        return SD.lang;
    },

    setOrientationHandler: function(handler) {
        if (SD_exists())
            window.segadroid.changeScreenOrientation = handler;

        // handler();
    },

    setResizeHandler: function(handler) {
        if (SD_exists())
            window.segadroid.changeScreenSize = handler;
    },

    // because some games just don't...
    hideAddressBar: function() {
        setTimeout("window.scrollTo(0, 1)", 10);
    },

    loadVoyager: function() {
        var SDc = document.createElement('script');
        SDc.type = 'text/javascript';
        SDc.async = true;
        var random = Math.floor((Math.random() * 100000000) + 1);

        SD.boot();
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(SDc, s);
    },
    redirectToPortal: function() {
        Play68.goHome();
    },

    detectPortalUrl: function() {
        var url = segadroid.back_url;
        if (typeof url !== "string") url = segadroid.subplatform;

        if (typeof url !== "string") {
            url = "";
        } else {
            if (url.match(/^https:\/\//) == false) {
                url = "";
            }
        }

        SD.portalURL = url;

    },
    getLogoUrl: function(size) {

    },

    getUrlParameters: function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
};



function SD_exists() {
    return typeof window.segadroid != "undefined" && window.segadroid != null;
}

/* Support old functions, that are used by games from previous connecting */
function SD_initAPI(supported_languages) {
    return SD.initLangs(supported_languages);
}

function SD_hideAddressBar() {
    SD.hideAddressBar();
}

function SD_OrientationHandler(orientationHandler, resizeHandler) {
    if (typeof orientationHandler != "undefined" && orientationHandler != null)
        SD.setOrientationHandler(orientationHandler);

    if (typeof resizeHandler != "undefined" && resizeHandler != null)
        SD.setResizeHandler(resizeHandler);
}

SD.showLoadScrn();