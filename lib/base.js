// Tips obtenidos de Douglas Crockford en su libro JavaScript: The Good Parts

Function.prototype.method = function(name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

Function.method('inherits', function(Parent) {
    this.prototype = new Parent();
    return this;
});