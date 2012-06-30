// Tips obtenidos de Douglas Crockford en su libro JavaScript: The Good Parts

// Mediante esta función podemos añadir métodos a un objeto de forma
// segura y simple.
Function.prototype.method = function(name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

// Este bloque permite "añadir" la función create sobre un objeto de
// forma que se puede crear una nueva "instancia" de cualquier objeto
// que estemos usando (var otherObject = Object.create(initialObject);)
if (typeof Object.create !== 'function') {
    Object.create = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    };
}

// Esta nueva función permite crear herencia de forma similar a los
// lenguajes clásicos, pero está DESACONSEJADA
Function.method('inherits', function(Parent) {
    this.prototype = new Parent();
    return this;
});