//      
const SwitchInterface = require("./Interface");

function Compare(config    ) {
	"use strict";
	// Match should take in a config object 
	// and return an wrapper function for minimal interface 	
	// @ Wrapper provides interface to utilize full power of the SwitchCase
	// such as interpreting simple expression to more verbose (accepted format of SwitchCase) expression 
	const securityConfig = {
		limit: 50,
		keywords: ["document", "window", "process"]
	};
	const rules = Object.assign(securityConfig, config);

	function Factory(args    ) {
		if (!args) { 
			throw new Error("Argument cannot be empty");
		}
		if (typeof arguments[0] !== "object") { 
			throw new TypeError("Variable must be an object, or an array of objects"); 
		}
		
		const switchCase = new SwitchInterface();
		const targets = Array.isArray(args) ? args : Array.from(arguments);
		const argIsSimple = Object.keys(args).length === 1;
		return (
			switchCase
				._init(argIsSimple, rules)
				.setTargets(...targets)
		);
	}

	return Factory;
}

module.exports = Compare;