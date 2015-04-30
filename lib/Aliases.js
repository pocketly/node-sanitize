/**
 * @author Adam Jaso <ajaso@pocketly.com>
 */

"use strict";

class Aliases {

  constructor() {
    this.isAliases = true; // duck typing
    this.b = 'bool';
    this.bool = 'bool';

    this.f = 'float';
    this.flo = 'float';
    this.float = 'float';

    this.i = 'integer';
    this.int = 'integer';
    this.integer = 'integer';

    this.phone = 'phone';

    this.email = 'email';

    this.url = 'url';

    this.re = 'regex';
    this.regex = 'regex';

    this.fun = 'func';
    this.func = 'func';
    this.function = 'func';

    this.str = 'string';
    this.string = 'string';

    this.arr = 'array';
    this.array = 'array';

    this.obj = 'object';
    this.object = 'object';
    this.pojo = 'pojo';
  }

  lookup(alias) {
    return this[alias] || alias;
  }
}

module.exports = exports = Aliases;