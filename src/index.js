const errorMessages = {
	divisionByZero: 'TypeError: Division by zero.',
	bracketsInvalid: 'ExpressionError: Brackets must be paired',
	invalidInput: 'ExpressionError: Expression is not valid'
};

const EmptyString = '';

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
};

const convertToPostfixPolishNotation = (exp) => {
	let result = EmptyString;
	let stack = [];
	let operand = EmptyString;

	for (let i = 0; i < exp.length; i++) {
		const currentSymbol = exp[i];
		if (currentSymbol === Symbols.Space) {
			continue;
		}
		if (SymbolsHash[currentSymbol]) {
			if (operand) {
				result += ` ${operand}`;
				operand = EmptyString;
			}

			const currentOperator = OperatorsInfo[currentSymbol];

			if (currentOperator) {
				const previousSymbol = (stack.length > 0 && stack[stack.length - 1]) || null;
				const previousOperator = previousSymbol && OperatorsInfo[previousSymbol];

				if (previousOperator) {
					if (currentOperator === previousOperator) {
						const operatorFromStack = stack.pop();
						result += ` ${operatorFromStack}`;
					} else {
						if (currentOperator < previousOperator) {
							let operatorFromStack = stack.pop();
							while (operatorFromStack) {
								result += ` ${operatorFromStack}`;

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
						if(!symbolFromStack){
							throw new Error(errorMessages.bracketsInvalid);
						}

						result +=` ${symbolFromStack}` ;
						symbolFromStack = stack.pop();
					}
					continue;
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

	result += ` ${operand}`;;

	if(stack.length > 0){
		let element = stack.pop();
		while(element){
			result += ` ${element}`;
			if(element === Symbols.ClosedBracket || element === Symbols.OpenedBracket){
				throw new Error(errorMessages.bracketsInvalid);
			}
			element = stack.pop();
		}
	}

	return result;
};

const expressionCalculator = (expr) => {
	// step 1 - get expression from the given expression in postfix polish notation (remove brackets at all from the given expression)
	const polishExpr = convertToPostfixPolishNotation(expr);

	// step 2 - calculate expression
	const stack = [];
	let number = EmptyString;


	for(let i = 0; i < polishExpr.length; i++) {
		const currentSymbol = polishExpr[i];
		
		if(currentSymbol === Symbols.Space){
			number && stack.push(number);
			number = EmptyString;
			continue;
		}

		if (SymbolsHash[currentSymbol]) {
			number && stack.push(number);
			number = EmptyString;

			const rightOperand = Number(stack.pop());
			const leftOperand = Number(stack.pop());
			let resultOperation;

			switch(currentSymbol){
				case Symbols.Multiply:
					resultOperation = leftOperand * rightOperand;
					break;
				case Symbols.Division: 
					if(rightOperand === 0){
						throw new Error(errorMessages.divisionByZero);
					}
					resultOperation = leftOperand / rightOperand;		
					break;
				case Symbols.Subtraction: 
					resultOperation = leftOperand - rightOperand;
					break;
				case Symbols.Addition: 
					resultOperation = leftOperand + rightOperand;
					break;
				default:
					throw new Error('The passed operator is not valid');
			}

			stack.push(resultOperation);
		} else {
			number += currentSymbol;
		}
	}

	return stack.pop();
};

// const expr = '1 + 2) * 3';
// const reesult = expressionCalculator(expr);

module.exports = {
	expressionCalculator
};