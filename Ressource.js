var Ressource = function(block, x, y, type) {
	var self = this;
	var game = block.map.game;

	this.quantity = 0;

	this.update = function(quantity) {
		self.quantity = quantity;
		refresh();
	}

	this.add = function(quantity) {
		self.quantity += quantity;
		refresh();
	}

	this.remove = function(quantity) {
		self.quantity -= quantity;
		refresh();
	}
}

module.exports = Ressource;
