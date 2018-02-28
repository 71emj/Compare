const SwitchCase = require("./SwitchCase");

class SwitchInterface extends SwitchCase {
  // interfaces can be extracted from object, and defined as 
  // wrapper methods
  _init(isSimple, rules) {
    this.rules = rules;
    this.simpleExp = true;
    return this;
  }

  toCase(singleExp, values, fn) {
    this.match(this._interpret(singleExp), values, fn, "SIMPLE");
    return this;
  }

  toCaseOR(exprs, values, fn) {
    this.match(this._interpret(exprs), values, fn, "OR");
    return this;
  }

  toCaseAND(exprs, values, fn) {
    this.match(this._interpret(exprs), values, fn, "AND");
    return this;
  }

  toAllOther(values, fn) {
    this.match("true", values, fn, "SIMPLE");
    return this;
  }

  Ended(fn) {
    const debug = options => {
      const targets = this.testTargets;
      console.log(options ? targets[options] : targets);
    }
    return fn(debug, this.result);
  }

  _interpret(exprs) {
    if (this._screen(exprs)) {
      throw new Error(
        `individual expression must not exceed more than ${rules.limit} characters ` +
        `and must not contain keywords such as ${rules.keywords.join(", ")} etc.`
      );
    }
    return this.simpleExp ? this._verbose(exprs) : exprs;
  }

  _screen(exprs) {
    if (!Array.isArray(exprs)) {
      exprs = [exprs];
    }
    const pattern = `${this.rules.keywords.join("|")}|.{${this.rules.limit},}`;
    const regexp = new RegExp(pattern);
    for (let i = 0, len = exprs.length; i < len; i++) {
      if (typeof exprs[i] === "function") {
        continue;
      }
      if (regexp.test(exprs[i])) {
        return true;
      }
    }
    return false;
  }

  _verbose(exprs) {
    if (typeof exprs === "function") {
      return exprs;
    }
    if (!Array.isArray(exprs)) {
      exprs = [exprs];
    }
    const name = this.testTargets.args[0];
    const mapping = expression => { // mathcing "value", "operator", "followed value"
      const simple = expression.toString().match(/^\b([\w]+)\b$|^([><=]={0,2})([\s.\d]+)$/);
      return simple ? `${name} ${simple[2] || "==="} "${simple[1] || simple[3]}"` : expression;
    };
    return exprs.map(mapping);
  }
}

module.exports = SwitchInterface;