import chalk from "chalk";
import {
  SplitDefinition,
  splitString,
  Transformer,
  regExpOcurrences
} from "./util";
import { ExtendedAcornNode } from "./transform-merged-to-array";

const defaultLineNumberGenerator = (nr: number, maxNumberDimension: number) =>
  " " + ("" + nr).padStart(maxNumberDimension, " ") + " | ";

export const generateCodeStringWithMarker = (
  stringified: string,
  marker: (SplitDefinition & Transformer<string, string>)[] = [],
  lineMarker: (Transformer<string, string> & { position: number })[] = [],
  lineNumberGenerator = defaultLineNumberGenerator
) => {
  const withAppliedMarker = splitString(stringified, marker, (s, str) =>
    s.transformer(str)
  ).join("");

  const maxNumberDimension =
    Math.floor(Math.log10(regExpOcurrences(stringified, /\n/g) + 1)) + 1;

  let currentLine = 2;
  const withLineNumbers =
    lineNumberGenerator(1, maxNumberDimension) +
    withAppliedMarker.replace(/\r?\n/g, () => {
      const lineNumber = currentLine++;
      const marker = lineMarker.find(v => v.position == lineNumber);

      const genLineNumber = lineNumberGenerator(lineNumber, maxNumberDimension);

      return (
        "\n" + (marker ? marker.transformer(genLineNumber) : genLineNumber)
      );
    });

  return withLineNumbers;
};

const getLineForPosition = (str: string, postion: number) =>
  regExpOcurrences(str.slice(0, postion), /\n/g) + 1;

export interface ErrorHightlights extends SplitDefinition {
  color: string;
  hightlightLine: boolean;
}

const constructCodeWithPointer = (
  stringFunction: string,
  parsedFunction: ExtendedAcornNode,
  highlights: ErrorHightlights[]
) => {
  const niceStringified = generateCodeStringWithMarker(
    stringFunction,
    highlights.map(er => ({ ...er, transformer: chalk[er.color] })),
    highlights
      .filter(er => er.hightlightLine)
      .map(er => ({
        position: getLineForPosition(stringFunction, er.start),
        transformer: chalk[er.color]
      }))
  );

  return niceStringified;
};

const constructIdentifierParamsCode = (
  stringFunction: string,
  parsedFunction: ExtendedAcornNode,
  identifierNode: ExtendedAcornNode
) =>
  constructCodeWithPointer(
    stringFunction,
    parsedFunction,

    [
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
    ]
  );

const constructIdentifierParameterError = (
  stringFunction: string,
  parsedFunction: ExtendedAcornNode,
  identifier: ExtendedAcornNode,
  errorMessage: string
) => {
  const replacements = [
    ["NAME", identifier.name],
    ["LINENUMBER", getLineForPosition(stringFunction, identifier.start)],
    [
      "CODEBLOCK",
      constructIdentifierParamsCode(stringFunction, parsedFunction, identifier)
    ]
  ];

  const replaced = errorMessage.replace(
    new RegExp(replacements.map(v => v[0]).join("|"), "g"),
    name => replacements.find(v => v[0] == name)[1]
  );

  return new Error(replaced);
};

export const constructReassignemntError = (
  stringFunction: string,
  parsedFunction: ExtendedAcornNode,
  duplicateIdentifierNode: ExtendedAcornNode
) =>
  constructIdentifierParameterError(
    stringFunction,
    parsedFunction,
    duplicateIdentifierNode,
    "parameter 'NAME' is reassigned in line LINENUMBER, please create another variable instead of reassigning\nCODEBLOCK"
  );
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

export const constructShadowError = (
  stringFunction: string,
  parsedFunction: ExtendedAcornNode,
  duplicateIdentifierNode: ExtendedAcornNode
) =>
  constructIdentifierParameterError(
    stringFunction,
    parsedFunction,
    duplicateIdentifierNode,
    "parameter 'NAME' is shadowed in line LINENUMBER, please rename this identifier\nCODEBLOCK"
  );
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
