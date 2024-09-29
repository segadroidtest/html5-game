var MetaManager = function(canLog){
  this.meta = {
    data: {
    },
  };

  this.defaultlb = 'default';
  //this.coinLb = 'coins';

  if(canLog == true){
	  this.trace = console.log;
  } else {
	  this.trace = function(){};
  }

  //this.sync();
}

MetaManager.prototype.sync = function(){
  if (gamezop.data && gamezop.data.metadata){
		// this.meta.highScore = gamezop.data.metadata['highScore'] || 0;
		this.meta.data = gamezop.data.metadata['data'] || {};
  }
}

MetaManager.prototype.updateHighScore = function(newScore){
  if(newScore > this.meta.highscore) this.meta.highscore = newScore;
}

MetaManager.prototype.setData = function(dat){
  this.meta.data = dat;
}

MetaManager.prototype.dataExists = function(){
  if('metadata' in gamezop.data && 'data' in gamezop.data.metadata){
    return true;
  } else {
    return false;
  }
}

MetaManager.prototype.localHasOwnProperty = function(key) {
	this.meta.data.hasOwnProperty(key);
}

MetaManager.prototype.localSetItem = function(key, item){
	this.trace("SETTING ITEM");
	this.trace("KEY: ", key);
	this.trace("ITEM: ", item);

  this.meta.data[key] = item;

	//gamezop.setState({state: "playing", metadata: oMetaManager.meta, leaderboard: oMetaManager.defaultlb, score: levels});

  //this.trace("Best Score: ", JSON.parse(this.meta.data).bestScore);

  //gamezop.setState({state: "playing", metadata: oMetaManager.meta, leaderboard: oMetaManager.defaultlb, score: JSON.parse(this.meta.data).bestScore});
}

MetaManager.prototype.localGetItem = function(key){
	this.trace("GETTING ITEM");
	this.trace("KEY: ", key);
  this.trace(this.meta.data[key]);

	return this.meta.data[key];
  //return window.localStorage.getItem(key);
}
MetaManager.prototype.localRemoveItem=function(key){

  delete this.meta.data[key];
}

// var oMetaManager = null;
oMetaManager = new MetaManager(false);
//gamezop.setState({state: 'loaded'});

