const tsquery = require("@phenomnomnominal/tsquery").tsquery;
const ts = require('typescript');

let id = 0;

module.exports = function(content) {
    const ast = tsquery.ast(content,undefined,2); // tsx
    const allTsxNodes =
        [
            ...tsquery(ast, `JsxOpeningElement`),
            ...tsquery(ast, `JsxSelfClosingElement`),
        ];
    allTsxNodes.forEach(node=>{
        const factory = ts.factory;
        if (node.attributes.properties.find(it=>it?.name?.escapedText==='___id')) {
            return;
        }
        node.attributes.properties.push(
            // https://ts-ast-viewer.com/#code/G4QwTgBCELwQPAEwJbAgZxgbwMwF8A+eAehWAKA
            factory.createJsxAttribute(
                factory.createIdentifier("__id"),
                factory.createJsxExpression(
                    undefined,
                    factory.createNumericLiteral(`${id}`)
                )
            )
        );
        id++;
    });
    return ts.createPrinter().printFile(ast);
}
