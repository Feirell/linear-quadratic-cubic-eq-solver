"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const util_1 = require("./util");
const defaultLineNumberGenerator = (nr, maxNumberDimension) => " " + ("" + nr).padStart(maxNumberDimension, " ") + " | ";
exports.generateCodeStringWithMarker = (stringified, marker = [], lineMarker = [], lineNumberGenerator = defaultLineNumberGenerator) => {
    const withAppliedMarker = util_1.splitString(stringified, marker, (s, str) => s.transformer(str)).join("");
    const maxNumberDimension = Math.floor(Math.log10(util_1.regExpOcurrences(stringified, /\n/g) + 1)) + 1;
    let currentLine = 2;
    const withLineNumbers = lineNumberGenerator(1, maxNumberDimension) +
        withAppliedMarker.replace(/\r?\n/g, () => {
            const lineNumber = currentLine++;
            const marker = lineMarker.find(v => v.position == lineNumber);
            const genLineNumber = lineNumberGenerator(lineNumber, maxNumberDimension);
            return ("\n" + (marker ? marker.transformer(genLineNumber) : genLineNumber));
        });
    return withLineNumbers;
};
const getLineForPosition = (str, postion) => util_1.regExpOcurrences(str.slice(0, postion), /\n/g) + 1;
const constructCodeWithPointer = (stringFunction, parsedFunction, highlights) => {
    const niceStringified = exports.generateCodeStringWithMarker(stringFunction, highlights.map(er => ({ ...er, transformer: chalk_1.default[er.color] })), highlights
        .filter(er => er.hightlightLine)
        .map(er => ({
        position: getLineForPosition(stringFunction, er.start),
        transformer: chalk_1.default[er.color]
    })));
    return niceStringified;
};
const constructIdentifierParamsCode = (stringFunction, parsedFunction, identifierNode) => constructCodeWithPointer(stringFunction, parsedFunction, [
    {
        start: identifierNode.start,
        end: identifierNode.end,
        color: "red",
        hightlightLine: true
    },
    {
        ...parsedFunction.params.find(n => n.name == identifierNode.name),
        color: "blue",
        hightlightLine: false
    }
]);
const constructIdentifierParameterError = (stringFunction, parsedFunction, identifier, errorMessage) => {
    const replacements = [
        ["NAME", identifier.name],
        ["LINENUMBER", getLineForPosition(stringFunction, identifier.start)],
        [
            "CODEBLOCK",
            constructIdentifierParamsCode(stringFunction, parsedFunction, identifier)
        ]
    ];
    const replaced = errorMessage.replace(new RegExp(replacements.map(v => v[0]).join("|"), "g"), name => replacements.find(v => v[0] == name)[1]);
    return new Error(replaced);
};
exports.constructReassignemntError = (stringFunction, parsedFunction, duplicateIdentifierNode) => constructIdentifierParameterError(stringFunction, parsedFunction, duplicateIdentifierNode, "parameter 'NAME' is reassigned in line LINENUMBER, please create another variable instead of reassigning\nCODEBLOCK");
// constructIdentifierParameterError()
// {
//   const comprehensiveError = new Error(
//     "parameter '" +
//       duplicateIdentifierNode.name +
//       "' is reassignt in line " +
//       getLineForPosition(stringFunction, duplicateIdentifierNode.start) +
//       ", please create new identifier\n" +
//       constructIdentifierParamsCode(
//         stringFunction,
//         parsedFunction,
//         duplicateIdentifierNode
//       )
//   );
//   return comprehensiveError;
// };
exports.constructShadowError = (stringFunction, parsedFunction, duplicateIdentifierNode) => constructIdentifierParameterError(stringFunction, parsedFunction, duplicateIdentifierNode, "parameter 'NAME' is shadowed in line LINENUMBER, please rename this identifier\nCODEBLOCK");
// {
//   const comprehensiveError = new Error(
//     "parameter '" +
//       duplicateIdentifierNode.name +
//       "' is shadowed in line " +
//       getLineForPosition(stringFunction, duplicateIdentifierNode.start) +
//       ", please rename this identifier\n" +
//       constructIdentifierParamsCode(
//         stringFunction,
//         parsedFunction,
//         duplicateIdentifierNode
//       )
//   );
//   return comprehensiveError;
// };
