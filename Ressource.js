var Ressource = function(game, type) {
	var self = this;

	this.quantity = 0;

	this.update = function(quantity) {
		self.quantity = quantity;
	}

	this.add = function(quantity) {
		self.quantity += quantity;
	}

	this.remove = function(quantity) {
		self.quantity -= quantity;
	}
}

module.exports = Ressource;
