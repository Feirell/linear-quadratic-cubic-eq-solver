"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weakIsIdentifier = (() => {
    const matcher = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    return (v) => matcher.test(v);
})();
exports.isInteger = (() => {
    const matcher = /^(?:[1-9][0-9]*)|(?:[0-9])$/;
    return (v) => matcher.test(v);
})();
exports.transformPathToReadable = (path, rootName = "root") => {
    let pathString = rootName;
    for (const part of path)
        if (exports.weakIsIdentifier(part))
            pathString += "." + part;
        else if (exports.isInteger(part))
            pathString += "[" + part + "]";
        else
            pathString += "['" + part + "']";
    return pathString;
};
const arrayEqual = (arrA, arrB, comp = (a, b) => a === b) => {
    if (arrA.length != arrB.length)
        return false;
    for (let i = 0; i < arrA.length; i++)
        if (!comp(arrA[i], arrB[i]))
            return false;
    return true;
};
const arrayContains = (arrA, arrB, comp = (a, b) => a === b) => {
    if (arrA.length > arrB.length)
        return false;
    for (let i = 0; i < arrA.length; i++)
        if (!comp(arrA[i], arrB[i]))
            return false;
    return true;
};
// TODO make this more efficent
const getParents = (stack, path) => stack.filter(v => {
    // console.log(v.path, path);
    arrayContains(v.path, path);
});
const findLastIndex = (arr, test) => {
    let last = arr.length - 1;
    while (last > 0) {
        if (test(arr[last]))
            return last;
        last--;
    }
    return undefined;
};
const indexOfLastElementWithPathLength = (stack, pathlength) => findLastIndex(stack, v => v.path.length == pathlength);
const lazyValue = (obj, key, initiliser) => {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            const value = initiliser();
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
            });
            return value;
        }
    });
    return obj;
};
exports.traverseTreelikeStructure = (root, cb, duplicateBehaivor = "SKIP", circularBehaivor = "SKIP") => {
    const alreadyVisited = new WeakSet();
    let stack = [{ parents: [], path: [], value: root }];
    for (let current = stack.pop(); current != undefined; current = stack.pop()) {
        const value = current.value;
        const path = current.path;
        const parents = current.parents;
        const valueIsObject = typeof value == "object" && value !== null;
        let isCircular = null;
        let isDuplicate = null;
        if (valueIsObject) {
            // check if there is circular reference
            for (const parent of parents)
                if (parent === value) {
                    isCircular = true;
                    break;
                }
            isCircular = isCircular || false;
            if (isCircular) {
                isDuplicate = true;
            }
            else {
                if (duplicateBehaivor == "SKIP") {
                    // already visited this specific object
                    if (alreadyVisited.has(value))
                        isDuplicate = true;
                    else
                        alreadyVisited.add(value);
                }
                isDuplicate = isDuplicate || false;
            }
        }
        if (isDuplicate && duplicateBehaivor == "SKIP")
            continue;
        if (isCircular && circularBehaivor == "SKIP")
            continue;
        const item = {
            value,
            parents: [...parents],
            path: [...path]
        };
        // lazyValue(item, "parents", () => getParents(stack, path));
        if (valueIsObject) {
            item.isCircular = isCircular;
            item.isDuplicate = isDuplicate;
        }
        let skipDescendents = false;
        let skipSiblings = false;
        let siblingLevel = undefined;
        let abort = false;
        cb(item, () => (skipDescendents = true), (level = 0) => ((siblingLevel = level), (skipSiblings = true)), () => (abort = true));
        if (abort)
            return;
        if (skipSiblings) {
            // searching for the last element which has a shorter path, this item is not a sibling
            stack = stack.slice(0, indexOfLastElementWithPathLength(stack, path.length - siblingLevel));
        }
        if (isCircular || skipDescendents)
            continue;
        if (valueIsObject) {
            const subStack = [];
            const onlyViable = Object.entries(value);
            for (const [key, childValue] of onlyViable)
                subStack.unshift({
                    parents: [...parents, value],
                    path: [...path, key],
                    value: childValue
                });
            stack = [...stack, ...subStack];
        }
    }
};
exports.regExpOcurrences = (str, regExp) => {
    let occ = 0;
    if (!regExp.global)
        throw new Error("to count the occurences you need to enable the global flag " + regExp);
    const lastIndexBackup = regExp.lastIndex;
    regExp.lastIndex = 0;
    while (regExp.exec(str) !== null)
        occ++;
    regExp.lastIndex = lastIndexBackup;
    return occ;
};
exports.defaultMapper = (s, str) => ({
    start: s.start,
    end: s.end,
    str: str
});
exports.splitString = (str, splits, mapper = exports.defaultMapper, clampStart = 0, clampEnd = str.length) => {
    // validity checking
    for (const split of splits)
        if (split.start >= split.end)
            throw new Error("split start was after its end" + JSON.stringify(split));
    const sortedSplits = splits.sort((a, b) => a.end - b.end);
    let lastEnd = undefined;
    for (const split of sortedSplits) {
        if (lastEnd === undefined)
            lastEnd = split.end;
        else if (split.start < lastEnd)
            throw new Error("overlapping split" + JSON.stringify(sortedSplits));
    }
    // splitting
    let lastEndPosition = clampStart;
    const result = [];
    for (const split of splits) {
        if (lastEndPosition < split.start) {
            result.push(str.substring(lastEndPosition, split.start));
        }
        const subString = str.substring(split.start, split.end);
        const mappedResult = mapper(split, subString);
        result.push(mappedResult);
        lastEndPosition = split.end;
    }
    if (lastEndPosition != clampEnd)
        result.push(str.substring(lastEndPosition, clampEnd));
    return result;
};
