// commonMethods should be factory function set

export function Ended(self, debug) {
  debug = debug || function (opts) {
    var targets = opts ? self.testTargets[opts] : self.testTargets;
    console.log({ targets: targets, cases: self.history });
  };
  return function (fn) {
    return fn(debug, self.result);
  };
}

export function toCase(self, flag, interpret) {
  interpret = interpret || function (exprs) {
    return exprs;
  };
  return function (exprs, vals, fn) {
    self.match(interpret(exprs), vals, fn, flag);
    return this;
  };
}