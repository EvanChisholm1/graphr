type token = string | number;

const ops = {
    "(": 0,
    ")": 0,
    "^": 3,
    "*": 2,
    "/": 2,
    "-": 1,
    "+": 1,
};

function tokenize(text: string): Array<token> {
    const tokens = [];

    let current = "";

    for (const nextTok of text.split("")) {
        if (nextTok === " ") continue;
        else if (Object.keys(ops).includes(nextTok)) {
            if (current !== "") {
                tokens.push(parseFloat(current));
                current = "";
            }
            tokens.push(nextTok);
        } else {
            current = `${current}${nextTok}`;
        }
    }

    if (current !== "") tokens.push(parseFloat(current));

    return tokens;
}

const order = Object.entries(ops)
    .sort((a, b) => a[1] - b[1])
    .map(([x]) => x);

type AST = {
    op: string;
    operands: Array<number | AST>;
};

type parensList = Array<token | parensList>;

function parens(tokens: parensList) {
    const openings: number[] = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "(") openings.push(i);
        if (tokens[i] === ")") {
            const openerIndex = openings.pop()!;
            const subArray = tokens.splice(openerIndex, i - openerIndex + 1);

            tokens.splice(
                openerIndex,
                0,
                subArray.filter((x) => (x === "(" || x === ")" ? false : true))
            );

            i = openerIndex;
        }
    }
    return tokens;
}

function parse(tokens: parensList): AST | number {
    if (tokens.length === 1 && typeof tokens[0] === "number") return tokens[0];
    if (tokens.length === 1 && Array.isArray(tokens[0]))
        return parse(tokens[0]);

    for (const op of order) {
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i] !== op) continue;

            const left = tokens.slice(0, i);
            const right = tokens.slice(i + 1);

            return {
                op,
                operands: [parse(left), parse(right)],
            };
        }
    }

    return 0;
}

const operatorFuncs: {
    [key: string]: (a: number, b: number) => number;
} = {
    "*": (a: number, b: number) => a * b,
    "/": (a: number, b: number) => a / b,
    "+": (a: number, b: number) => a + b,
    "-": (a: number, b: number) => a - b,
    "^": Math.pow,
};

function evaluate(ast: AST | number): number {
    if (typeof ast === "number") return ast;

    return operatorFuncs[ast.op](
        evaluate(ast.operands[0]),
        evaluate(ast.operands[1])
    );
}

export const run = (equation: string) => {
    return evaluate(parse(parens(tokenize(equation))));
};

export const f = (equation: string, x: number) => {
    const fixed = equation.replaceAll("x", `(${x})`);
    return run(fixed);
};
