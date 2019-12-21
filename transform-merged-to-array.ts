import { parse as acronParse, Node as AcornNode } from "acorn";
import { simple as acornWalkSimple } from "acorn-walk";
import {
  traverseTreelikeStructure,
  SplitDefinition,
  splitString,
  weakIsIdentifier
} from "./util";
import {
  constructShadowError,
  constructReassignemntError
} from "./error-helper";

export interface ExtendedAcornNode extends AcornNode {
  [key: string]: any;
}

const getIdentifierNodes = (rootNode, nameFilter = (name: string) => true) => {
  const identifierPositions = [];

  acornWalkSimple(rootNode, {
    Identifier(node) {
      if (nameFilter(node.name)) identifierPositions.push(node);
    }
  });

  return identifierPositions.sort((a, b) => a.start - b.start);
};

const mightBeNode = (val: any): val is ExtendedAcornNode =>
  typeof val == "object" && val !== null && typeof val.type == "string";

const parseFunction = (fnc: string | Function): ExtendedAcornNode => {
  const parsed = (acronParse("const fnc = " + fnc) as any).body[0]
    .declarations[0].init;

  const offset = parsed.start;

  traverseTreelikeStructure(parsed, item => {
    // shifting the positions if this is a node
    if (mightBeNode(item.value)) {
      item.value.start -= offset;
      item.value.end -= offset;
    }
  });

  return parsed;
};

interface SplittedFunctionInformation {
  head: string[];
  body: (string | { name: string })[];
}

const splitFunctionIntoArray = (
  fnc: string | string
): SplittedFunctionInformation => {
  const functionString = "" + fnc;
  const functionParsed = parseFunction(fnc);

  const idNodes = getIdentifierNodes(functionParsed.body);

  const fncBody = functionParsed.body;

  let lastEndPosition = fncBody.start + 1;
  const result: (string | { name: string })[] = [];
  for (const node of idNodes) {
    if (lastEndPosition < node.start) {
      const prepending = functionString.substring(lastEndPosition, node.start);
      result.push(prepending);
    }

    result.push({ name: node.name });
    lastEndPosition = node.end;
  }

  if (lastEndPosition != fncBody.end - 1)
    result.push(functionString.substring(lastEndPosition, fncBody.end - 1));

  return {
    head: functionParsed.params.map(n => n.name) as string[],
    body: result
  };
};

const splitIntoIdentifierNodesAndStrings = (
  functionString: string,
  fncBody: SplitDefinition,
  identifierNodes: (SplitDefinition & { name: string })[]
) =>
  splitString(
    functionString,
    identifierNodes,
    split => ({ name: split.name }),
    fncBody.start + 1,
    fncBody.end - 1
  );

const getAllOccurencesOfIdentifersReferencingArguments = (
  parsed: ExtendedAcornNode,
  parameterNames: string[],
  errorOnAssignment = false
): ExtendedAcornNode[] => {
  // only those identifier nodes are relevant which are referencing the arguments which were given
  const relevantIdNodes = [];

  traverseTreelikeStructure(parsed, item => {
    const node = item.value;
    if (mightBeNode(node))
      switch (node.type) {
        case "Identifier":
          if (parameterNames.includes(node.name)) {
            const grandfather = item.parents[item.parents.length - 3];
            const parent = item.parents[item.parents.length - 1];

            if (
              !(
                parent.type == "Property" &&
                grandfather.type == "ObjectExpression"
              ) &&
              !(parent.type == "MemberExpression") &&
              !(parent.type == "MethodDefinition")
            )
              relevantIdNodes.push(node);
          }
          break;
        case "AssignmentExpression":
          if (
            errorOnAssignment &&
            node.left.type == "Identifier" &&
            parameterNames.includes(node.left.name)
          )
            throw { type: "REWRITING", identifier: node.left };
          break;
        // errorOnAssignment
        // TODO one day one might want to fix this
        // the main idea is to enable shadowing, if the variable is shadowed discard the descendents and siblings
        // but this is more complex and needs context understanding, maybe you want to build this FunctionForge one day
        /*
          case "VariableDeclarator":
          const variableDeclarationNode = item.parents[item.parents.length - 1];

          // if you declare a variable with the var keyword you can reference the shadowing variable withing its initialising part
          // therefore we want to visit its children but not if another keyword was used
          if (variableDeclarationNode.kind != "var") skipDescendents();

          // not only skipping the other declarations but the other sibling beside the VariableDesclaration node aswell
          skipSiblings(1);
          break;
        */
        // in the meantime just throw an error
        case "FunctionDeclaration":
        case "VariableDeclarator":
          if (parameterNames.includes(node.id.name))
            throw { type: "SHADOWING", identifier: node.id };
          break;
      }
  });

  return relevantIdNodes;
};

const getAllParametersThrowIfNonIdentifierFound = (
  parsed: ExtendedAcornNode
): string[] =>
  parsed.params.map(identifier => {
    // there might be a deconstruct or spread or varargs node in there, we can't handle those
    if (identifier.type != "Identifier")
      throw new Error(
        "param was not an identifier but an " +
          identifier.type +
          " " +
          JSON.stringify(identifier)
      );

    return identifier.name;
  });

const splitFunctionIntoArrayOnlyParams = (
  functionString: string,
  functionParsed: ExtendedAcornNode,
  parameters: string[],
  errorOnAssignment = false
): SplittedFunctionInformation => {
  try {
    const fncBody = functionParsed.body;

    const relevantIdNodes = getAllOccurencesOfIdentifersReferencingArguments(
      fncBody,
      parameters,
      errorOnAssignment
    );

    const bodySplit = splitIntoIdentifierNodesAndStrings(
      functionString,
      fncBody,
      relevantIdNodes as any[]
    );

    return {
      head: parameters,
      body: bodySplit
    };
  } catch (err) {
    if (typeof err == "object" && err !== null)
      if (err.type == "SHADOWING") {
        const comprehensiveError = constructShadowError(
          functionString,
          functionParsed,
          err.identifier
        );

        throw comprehensiveError;
      } else if (err.type == "REWRITING") {
        const comprehensiveError = constructReassignemntError(
          functionString,
          functionParsed,
          err.identifier
        );

        throw comprehensiveError;
      }

    throw err;
  }
};

interface JoinedFunctionInformation {
  head: string[];
  body: string;
}

const createSafeMap = mappingFnc => (name: string) => {
  const mappingRes = mappingFnc(name);
  if (typeof mappingRes != "string")
    throw new Error(
      `the mapping function did not return a string for the input "${name}" but ${mappingRes}`
    );

  return mappingRes;
};

const joinWithOtherNames = (
  splitted: SplittedFunctionInformation,
  mappingFnc = (name: string) => name
) => (
  (mappingFnc = createSafeMap(mappingFnc)),
  {
    head: splitted.head.map(mappingFnc),
    body: splitted.body
      .map(v => (typeof v == "string" ? v : mappingFnc(v.name)))
      .join("")
  }
);

const buildFunctionString = (
  joined: JoinedFunctionInformation,
  name: null | string = null,
  asType: "FUNCTION" | "ARROW" | "CLASS" = "FUNCTION"
) => {
  const joinedArgs = joined.head.join(", ");
  const joinedBody = "{" + joined.body + ";}";
  switch (asType) {
    case "FUNCTION":
      return `function ${
        typeof name == "string" ? name : ""
      }(${joinedArgs}) ${joinedBody}`;
    case "ARROW":
      return `(${joinedArgs}) => ${joinedBody}`;
    case "CLASS":
      return `class ${name} {
          constructor(${joinedArgs}) ${joinedBody}`;
    default:
      throw new Error("type " + asType + " is unknown");
  }
};

const buildFunction = (
  joined: JoinedFunctionInformation,
  name: null | string = null,
  asType: "FUNCTION" | "ARROW" | "CLASS" = "FUNCTION"
) => {
  return Function(
    "return " + buildFunctionString(joined, name, asType) + ";"
  )();
};

type Mapper =
  | [string, string][]
  | { [key: string]: string }
  | { get: (name: string) => string }
  | ((name: string) => string);

const transformToMappingFunction = (
  mapper: Mapper
): ((name: string) => string) => {
  if (mapper instanceof Array)
    return name => (mapper as []).find(v => v[0] == name)[1];
  else if (typeof mapper == "function") return mapper;
  else if (typeof (mapper as any).get == "function")
    return name => (mapper as any).get(name);
  else return name => mapper[name];
};

const guessNameFromFunction = (fnc: string | Function): string | undefined => {
  if (typeof fnc == "function") {
    const name = fnc.name;
    return name == "" ? null : name;
  } else {
    const matcherRes = /^.*?(?:function|class)\s+([^\r\n\t\f\v (]+)/.exec(fnc);
    return matcherRes ? matcherRes[1] : null;
  }
};

const USE_OLD = Symbol("USE_OLD");
const USE_NONE = Symbol("USE_NONE");

export function createNewBodyWithParamsReplaced(
  fnc: string | Function,
  mapping: Mapper
) {
  const functionString = "" + fnc;
  const functionParsed = parseFunction(fnc);

  const parameters = getAllParametersThrowIfNonIdentifierFound(functionParsed);

  const mappingFnc = transformToMappingFunction(mapping);
  const newMapping = parameters.map(
    p => [p, mappingFnc(p)] as [string, string]
  );

  // determine wether one of the mappings maps to a non identifier, if so error on reassignment to this identifier
  // the identifier checker is weak and will error fast
  const hasNonIdentifier =
    newMapping.find(([, mapped]) => !weakIsIdentifier(mapped)) !== undefined;

  const splitted = splitFunctionIntoArrayOnlyParams(
    functionString,
    functionParsed,
    parameters,
    hasNonIdentifier
  );

  const joined = joinWithOtherNames(
    splitted,
    transformToMappingFunction(newMapping)
  );

  return joined.body;
}

export function replaceIdentifierNames(
  fnc: string | Function,
  mapping: Mapper,
  asFnc: boolean = false,
  name: symbol | string = USE_OLD,
  ensureIsCompileable: boolean = true
): Function | string {
  const functionString = typeof fnc == "string" ? fnc : "" + fnc;
  const splitted = splitFunctionIntoArray(functionString);
  const joined = joinWithOtherNames(
    splitted,
    transformToMappingFunction(mapping)
  );

  const newName =
    typeof name == "string"
      ? name
      : name == USE_NONE
      ? null
      : name == USE_OLD
      ? guessNameFromFunction(fnc)
      : null;

  if (asFnc) return buildFunction(joined, newName);
  else if (ensureIsCompileable) return "" + buildFunction(joined, newName);
  else return buildFunctionString(joined, newName);
}
