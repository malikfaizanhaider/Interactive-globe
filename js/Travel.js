(function() {

	Travel = function() {};

	var p = Travel.prototype;

	p.getBranch = function(id) {
		var branch;
		switch(id) {
			case "gameboard":
				branch = new Gameboard();
				break;
			case "outro":
				branch = new Outro();
				break;
			default:
				branch = new FlyToDestination(id);
				break;
		}
		return branch;
	};

	p.hide = function() {
		//this.root.globe.deselectCountries();
	};

}());