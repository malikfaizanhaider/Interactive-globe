var globe = Globe(document.querySelector(".globe"));

var router = new tsunami.Router(globe);
router.addEventListener("complete", this.routerComplete.bind(this));

function routerComplete() {
	console.log("routerComplete", router.getLocation());
};

router.setLocation("branding-interstitial");

var globeButtons = document.querySelectorAll(".globe-button");
for (var i =0; i < globeButtons.length; i++) {
	var button = globeButtons.item(i);
	button.onclick = function(e) {
		var path = e.currentTarget.getAttribute("data-path");
		router.setLocation(path);
	};
}

resizeHandler = function() {
	/*document.body.style.fontSize = (globe.offsetHeight * 16 / 1080) + "px";*/
};

window.addEventListener("resize", this.resizeHandler.bind(this));
resizeHandler();
