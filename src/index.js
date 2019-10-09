const errorMessages = {
	divisionByZero: 'TypeError: Division by zero.',
	bracketsInvalid: 'ExpressionError: Brackets must be paired',
	invalidInput: 'ExpressionError: Expression is not valid'
};

const StringEmpty = '';

const OperatorPriority = {
	Low: 1,
	Normal: 2,
	High: 3
};

const Symbols = {
	Space: ' ',
	Addition: '+',
	Subtraction: '-',
	Multiply: '*',
	Division: '/',
	OpenedBracket: '(',
	ClosedBracket: ')'
};

const SymbolsHash = {
	[Symbols.Space]: true,
	[Symbols.Addition]: true,
	[Symbols.Subtraction]: true,
	[Symbols.Multiply]: true,
	[Symbols.Division]: true,
	[Symbols.OpenedBracket]: true,
	[Symbols.ClosedBracket]: true
};

const OperatorsInfo = {
	[Symbols.Addition]: OperatorPriority.Low,
	[Symbols.Subtraction]: OperatorPriority.Low,
	[Symbols.Multiply]: OperatorPriority.Normal,
	[Symbols.Division]: OperatorPriority.Normal
	// brackets
};

const convertToPostfixPolishNotation = (exp) => {
	let result = StringEmpty;
	let stack = [];
	let operand = StringEmpty;

	for (let i = 0; i < exp.length; i++) {
		const currentSymbol = exp[i];
		if (currentSymbol === Symbols.Space) {
			continue;
		}
		// const expr = ' 11 - (22 + 33 * ( 44 - 55 ) / 66 + 77 ) ';
		// should : 11 22 33 44 55 - * 66 / + 77 + -
		// reality: 11 22 33 44 55 - * 66 / + 77 + 
		if (SymbolsHash[currentSymbol]) {
			if (operand) {
				result += operand;
				operand = StringEmpty;
			}

			const currentOperator = OperatorsInfo[currentSymbol];

			if (currentOperator) {
				const previousSymbol = (stack.length > 0 && stack[stack.length - 1]) || null;
				const previousOperator = previousSymbol && OperatorsInfo[previousSymbol];

				if (previousOperator) {
					if (currentOperator === previousOperator) {
						const operatorFromStack = stack.pop();
						result += operatorFromStack;
					} else {
						if (currentOperator < previousOperator) {
							let operatorFromStack = stack.pop();
							while (operatorFromStack) {
								result += operatorFromStack;

								const previousSymbol = (stack.length > 0 && stack[stack.length - 1]) || null;

								if (previousSymbol === Symbols.OpenedBracket || stack.length === 0) {
									break;
								}
								operatorFromStack = stack.pop();
							}
						}
					}

					stack.push(currentSymbol);
					continue;
				}
			} else {
				if (currentSymbol === Symbols.ClosedBracket) {
					let symbolFromStack = stack.pop();
					while (symbolFromStack != Symbols.OpenedBracket) {
						result += symbolFromStack;
						symbolFromStack = stack.pop();
					}
					continue;
				} else {
				}
			}

			stack.push(currentSymbol);
			continue;
		}

		const convertedDigit = Number(currentSymbol);

		if (isNaN(convertedDigit)) {
			throw new Error(errorMessages.invalidInput);
		} else {
			operand += currentSymbol;
		}
	}

	if(stack.length > 0){
		let element = stack.pop();
		while(element){
			result += element;
			element = stack.pop();
		}
	}

	return result;
};

const expressionCalculator = (expr) => {
	// step 1 - get expression from the given expression in postfix polish notation (remove brackets at all from the given expression)
	const polishExpr = convertToPostfixPolishNotation(expr);
	console.log(polishExpr);

	// step 2 - calculate expression
	let result = 0;

	return result;
};

// 11 22 33 44 55 + * 66 / + 77 + +
const expr = ' 11 - (22 + 33 * ( 44 - 55 ) / 66 + 77 ) ';
// const expr = " 59 - 13 + (  25 * 22 / (  47 / 38 * (  64 / 93 - 91 + 72  ) * 66  ) + 43 - 5  ) * 39 / 55 ";

const result = convertToPostfixPolishNotation(expr);
console.log(result);

module.exports = {
	expressionCalculator
};
