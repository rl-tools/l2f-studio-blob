var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/typed-function/lib/umd/typed-function.js
var require_typed_function = __commonJS({
  "node_modules/typed-function/lib/umd/typed-function.js"(exports, module) {
    (function(global, factory2) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory2() : typeof define === "function" && define.amd ? define(factory2) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["'typed'"] = factory2());
    })(exports, function() {
      "use strict";
      function ok() {
        return true;
      }
      function notOk() {
        return false;
      }
      function undef() {
        return void 0;
      }
      const NOT_TYPED_FUNCTION = "Argument is not a typed-function.";
      function create() {
        function isPlainObject2(x) {
          return typeof x === "object" && x !== null && x.constructor === Object;
        }
        const _types = [{
          name: "number",
          test: function(x) {
            return typeof x === "number";
          }
        }, {
          name: "string",
          test: function(x) {
            return typeof x === "string";
          }
        }, {
          name: "boolean",
          test: function(x) {
            return typeof x === "boolean";
          }
        }, {
          name: "Function",
          test: function(x) {
            return typeof x === "function";
          }
        }, {
          name: "Array",
          test: Array.isArray
        }, {
          name: "Date",
          test: function(x) {
            return x instanceof Date;
          }
        }, {
          name: "RegExp",
          test: function(x) {
            return x instanceof RegExp;
          }
        }, {
          name: "Object",
          test: isPlainObject2
        }, {
          name: "null",
          test: function(x) {
            return x === null;
          }
        }, {
          name: "undefined",
          test: function(x) {
            return x === void 0;
          }
        }];
        const anyType = {
          name: "any",
          test: ok,
          isAny: true
        };
        let typeMap;
        let typeList;
        let nConversions = 0;
        let typed3 = {
          createCount: 0
        };
        function findType(typeName) {
          const type = typeMap.get(typeName);
          if (type) {
            return type;
          }
          let message = 'Unknown type "' + typeName + '"';
          const name51 = typeName.toLowerCase();
          let otherName;
          for (otherName of typeList) {
            if (otherName.toLowerCase() === name51) {
              message += '. Did you mean "' + otherName + '" ?';
              break;
            }
          }
          throw new TypeError(message);
        }
        function addTypes(types) {
          let beforeSpec = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "any";
          const beforeIndex = beforeSpec ? findType(beforeSpec).index : typeList.length;
          const newTypes = [];
          for (let i = 0; i < types.length; ++i) {
            if (!types[i] || typeof types[i].name !== "string" || typeof types[i].test !== "function") {
              throw new TypeError("Object with properties {name: string, test: function} expected");
            }
            const typeName = types[i].name;
            if (typeMap.has(typeName)) {
              throw new TypeError('Duplicate type name "' + typeName + '"');
            }
            newTypes.push(typeName);
            typeMap.set(typeName, {
              name: typeName,
              test: types[i].test,
              isAny: types[i].isAny,
              index: beforeIndex + i,
              conversionsTo: []
              // Newly added type can't have any conversions to it
            });
          }
          const affectedTypes = typeList.slice(beforeIndex);
          typeList = typeList.slice(0, beforeIndex).concat(newTypes).concat(affectedTypes);
          for (let i = beforeIndex + newTypes.length; i < typeList.length; ++i) {
            typeMap.get(typeList[i]).index = i;
          }
        }
        function clear() {
          typeMap = /* @__PURE__ */ new Map();
          typeList = [];
          nConversions = 0;
          addTypes([anyType], false);
        }
        clear();
        addTypes(_types);
        function clearConversions() {
          let typeName;
          for (typeName of typeList) {
            typeMap.get(typeName).conversionsTo = [];
          }
          nConversions = 0;
        }
        function findTypeNames(value) {
          const matches = typeList.filter((name51) => {
            const type = typeMap.get(name51);
            return !type.isAny && type.test(value);
          });
          if (matches.length) {
            return matches;
          }
          return ["any"];
        }
        function isTypedFunction(entity) {
          return entity && typeof entity === "function" && "_typedFunctionData" in entity;
        }
        function findSignature(fn, signature, options) {
          if (!isTypedFunction(fn)) {
            throw new TypeError(NOT_TYPED_FUNCTION);
          }
          const exact = options && options.exact;
          const stringSignature = Array.isArray(signature) ? signature.join(",") : signature;
          const params = parseSignature(stringSignature);
          const canonicalSignature = stringifyParams(params);
          if (!exact || canonicalSignature in fn.signatures) {
            const match = fn._typedFunctionData.signatureMap.get(canonicalSignature);
            if (match) {
              return match;
            }
          }
          const nParams = params.length;
          let remainingSignatures;
          if (exact) {
            remainingSignatures = [];
            let name51;
            for (name51 in fn.signatures) {
              remainingSignatures.push(fn._typedFunctionData.signatureMap.get(name51));
            }
          } else {
            remainingSignatures = fn._typedFunctionData.signatures;
          }
          for (let i = 0; i < nParams; ++i) {
            const want = params[i];
            const filteredSignatures = [];
            let possibility;
            for (possibility of remainingSignatures) {
              const have = getParamAtIndex(possibility.params, i);
              if (!have || want.restParam && !have.restParam) {
                continue;
              }
              if (!have.hasAny) {
                const haveTypes = paramTypeSet(have);
                if (want.types.some((wtype) => !haveTypes.has(wtype.name))) {
                  continue;
                }
              }
              filteredSignatures.push(possibility);
            }
            remainingSignatures = filteredSignatures;
            if (remainingSignatures.length === 0) break;
          }
          let candidate;
          for (candidate of remainingSignatures) {
            if (candidate.params.length <= nParams) {
              return candidate;
            }
          }
          throw new TypeError("Signature not found (signature: " + (fn.name || "unnamed") + "(" + stringifyParams(params, ", ") + "))");
        }
        function find(fn, signature, options) {
          return findSignature(fn, signature, options).implementation;
        }
        function convert(value, typeName) {
          const type = findType(typeName);
          if (type.test(value)) {
            return value;
          }
          const conversions = type.conversionsTo;
          if (conversions.length === 0) {
            throw new Error("There are no conversions to " + typeName + " defined.");
          }
          for (let i = 0; i < conversions.length; i++) {
            const fromType = findType(conversions[i].from);
            if (fromType.test(value)) {
              return conversions[i].convert(value);
            }
          }
          throw new Error("Cannot convert " + value + " to " + typeName);
        }
        function stringifyParams(params) {
          let separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ",";
          return params.map((p) => p.name).join(separator);
        }
        function parseParam(param) {
          const restParam = param.indexOf("...") === 0;
          const types = !restParam ? param : param.length > 3 ? param.slice(3) : "any";
          const typeDefs = types.split("|").map((s) => findType(s.trim()));
          let hasAny = false;
          let paramName = restParam ? "..." : "";
          const exactTypes = typeDefs.map(function(type) {
            hasAny = type.isAny || hasAny;
            paramName += type.name + "|";
            return {
              name: type.name,
              typeIndex: type.index,
              test: type.test,
              isAny: type.isAny,
              conversion: null,
              conversionIndex: -1
            };
          });
          return {
            types: exactTypes,
            name: paramName.slice(0, -1),
            // remove trailing '|' from above
            hasAny,
            hasConversion: false,
            restParam
          };
        }
        function expandParam(param) {
          const typeNames = param.types.map((t) => t.name);
          const matchingConversions = availableConversions(typeNames);
          let hasAny = param.hasAny;
          let newName = param.name;
          const convertibleTypes = matchingConversions.map(function(conversion) {
            const type = findType(conversion.from);
            hasAny = type.isAny || hasAny;
            newName += "|" + conversion.from;
            return {
              name: conversion.from,
              typeIndex: type.index,
              test: type.test,
              isAny: type.isAny,
              conversion,
              conversionIndex: conversion.index
            };
          });
          return {
            types: param.types.concat(convertibleTypes),
            name: newName,
            hasAny,
            hasConversion: convertibleTypes.length > 0,
            restParam: param.restParam
          };
        }
        function paramTypeSet(param) {
          if (!param.typeSet) {
            param.typeSet = /* @__PURE__ */ new Set();
            param.types.forEach((type) => param.typeSet.add(type.name));
          }
          return param.typeSet;
        }
        function parseSignature(rawSignature) {
          const params = [];
          if (typeof rawSignature !== "string") {
            throw new TypeError("Signatures must be strings");
          }
          const signature = rawSignature.trim();
          if (signature === "") {
            return params;
          }
          const rawParams = signature.split(",");
          for (let i = 0; i < rawParams.length; ++i) {
            const parsedParam = parseParam(rawParams[i].trim());
            if (parsedParam.restParam && i !== rawParams.length - 1) {
              throw new SyntaxError('Unexpected rest parameter "' + rawParams[i] + '": only allowed for the last parameter');
            }
            if (parsedParam.types.length === 0) {
              return null;
            }
            params.push(parsedParam);
          }
          return params;
        }
        function hasRestParam(params) {
          const param = last(params);
          return param ? param.restParam : false;
        }
        function compileTest(param) {
          if (!param || param.types.length === 0) {
            return ok;
          } else if (param.types.length === 1) {
            return findType(param.types[0].name).test;
          } else if (param.types.length === 2) {
            const test0 = findType(param.types[0].name).test;
            const test1 = findType(param.types[1].name).test;
            return function or(x) {
              return test0(x) || test1(x);
            };
          } else {
            const tests = param.types.map(function(type) {
              return findType(type.name).test;
            });
            return function or(x) {
              for (let i = 0; i < tests.length; i++) {
                if (tests[i](x)) {
                  return true;
                }
              }
              return false;
            };
          }
        }
        function compileTests(params) {
          let tests, test0, test1;
          if (hasRestParam(params)) {
            tests = initial(params).map(compileTest);
            const varIndex = tests.length;
            const lastTest = compileTest(last(params));
            const testRestParam = function(args) {
              for (let i = varIndex; i < args.length; i++) {
                if (!lastTest(args[i])) {
                  return false;
                }
              }
              return true;
            };
            return function testArgs(args) {
              for (let i = 0; i < tests.length; i++) {
                if (!tests[i](args[i])) {
                  return false;
                }
              }
              return testRestParam(args) && args.length >= varIndex + 1;
            };
          } else {
            if (params.length === 0) {
              return function testArgs(args) {
                return args.length === 0;
              };
            } else if (params.length === 1) {
              test0 = compileTest(params[0]);
              return function testArgs(args) {
                return test0(args[0]) && args.length === 1;
              };
            } else if (params.length === 2) {
              test0 = compileTest(params[0]);
              test1 = compileTest(params[1]);
              return function testArgs(args) {
                return test0(args[0]) && test1(args[1]) && args.length === 2;
              };
            } else {
              tests = params.map(compileTest);
              return function testArgs(args) {
                for (let i = 0; i < tests.length; i++) {
                  if (!tests[i](args[i])) {
                    return false;
                  }
                }
                return args.length === tests.length;
              };
            }
          }
        }
        function getParamAtIndex(params, index2) {
          return index2 < params.length ? params[index2] : hasRestParam(params) ? last(params) : null;
        }
        function getTypeSetAtIndex(params, index2) {
          const param = getParamAtIndex(params, index2);
          if (!param) {
            return /* @__PURE__ */ new Set();
          }
          return paramTypeSet(param);
        }
        function isExactType(type) {
          return type.conversion === null || type.conversion === void 0;
        }
        function mergeExpectedParams(signatures, index2) {
          const typeSet = /* @__PURE__ */ new Set();
          signatures.forEach((signature) => {
            const paramSet = getTypeSetAtIndex(signature.params, index2);
            let name51;
            for (name51 of paramSet) {
              typeSet.add(name51);
            }
          });
          return typeSet.has("any") ? ["any"] : Array.from(typeSet);
        }
        function createError(name51, args, signatures) {
          let err2, expected;
          const _name = name51 || "unnamed";
          let matchingSignatures = signatures;
          let index2;
          for (index2 = 0; index2 < args.length; index2++) {
            const nextMatchingDefs = [];
            matchingSignatures.forEach((signature) => {
              const param = getParamAtIndex(signature.params, index2);
              const test = compileTest(param);
              if ((index2 < signature.params.length || hasRestParam(signature.params)) && test(args[index2])) {
                nextMatchingDefs.push(signature);
              }
            });
            if (nextMatchingDefs.length === 0) {
              expected = mergeExpectedParams(matchingSignatures, index2);
              if (expected.length > 0) {
                const actualTypes = findTypeNames(args[index2]);
                err2 = new TypeError("Unexpected type of argument in function " + _name + " (expected: " + expected.join(" or ") + ", actual: " + actualTypes.join(" | ") + ", index: " + index2 + ")");
                err2.data = {
                  category: "wrongType",
                  fn: _name,
                  index: index2,
                  actual: actualTypes,
                  expected
                };
                return err2;
              }
            } else {
              matchingSignatures = nextMatchingDefs;
            }
          }
          const lengths = matchingSignatures.map(function(signature) {
            return hasRestParam(signature.params) ? Infinity : signature.params.length;
          });
          if (args.length < Math.min.apply(null, lengths)) {
            expected = mergeExpectedParams(matchingSignatures, index2);
            err2 = new TypeError("Too few arguments in function " + _name + " (expected: " + expected.join(" or ") + ", index: " + args.length + ")");
            err2.data = {
              category: "tooFewArgs",
              fn: _name,
              index: args.length,
              expected
            };
            return err2;
          }
          const maxLength = Math.max.apply(null, lengths);
          if (args.length > maxLength) {
            err2 = new TypeError("Too many arguments in function " + _name + " (expected: " + maxLength + ", actual: " + args.length + ")");
            err2.data = {
              category: "tooManyArgs",
              fn: _name,
              index: args.length,
              expectedLength: maxLength
            };
            return err2;
          }
          const argTypes = [];
          for (let i = 0; i < args.length; ++i) {
            argTypes.push(findTypeNames(args[i]).join("|"));
          }
          err2 = new TypeError('Arguments of type "' + argTypes.join(", ") + '" do not match any of the defined signatures of function ' + _name + ".");
          err2.data = {
            category: "mismatch",
            actual: argTypes
          };
          return err2;
        }
        function getLowestTypeIndex(param) {
          let min2 = typeList.length + 1;
          for (let i = 0; i < param.types.length; i++) {
            if (isExactType(param.types[i])) {
              min2 = Math.min(min2, param.types[i].typeIndex);
            }
          }
          return min2;
        }
        function getLowestConversionIndex(param) {
          let min2 = nConversions + 1;
          for (let i = 0; i < param.types.length; i++) {
            if (!isExactType(param.types[i])) {
              min2 = Math.min(min2, param.types[i].conversionIndex);
            }
          }
          return min2;
        }
        function compareParams(param1, param2) {
          if (param1.hasAny) {
            if (!param2.hasAny) {
              return 1;
            }
          } else if (param2.hasAny) {
            return -1;
          }
          if (param1.restParam) {
            if (!param2.restParam) {
              return 1;
            }
          } else if (param2.restParam) {
            return -1;
          }
          if (param1.hasConversion) {
            if (!param2.hasConversion) {
              return 1;
            }
          } else if (param2.hasConversion) {
            return -1;
          }
          const typeDiff = getLowestTypeIndex(param1) - getLowestTypeIndex(param2);
          if (typeDiff < 0) {
            return -1;
          }
          if (typeDiff > 0) {
            return 1;
          }
          const convDiff = getLowestConversionIndex(param1) - getLowestConversionIndex(param2);
          if (convDiff < 0) {
            return -1;
          }
          if (convDiff > 0) {
            return 1;
          }
          return 0;
        }
        function compareSignatures(signature1, signature2) {
          const pars1 = signature1.params;
          const pars2 = signature2.params;
          const last1 = last(pars1);
          const last2 = last(pars2);
          const hasRest1 = hasRestParam(pars1);
          const hasRest2 = hasRestParam(pars2);
          if (hasRest1 && last1.hasAny) {
            if (!hasRest2 || !last2.hasAny) {
              return 1;
            }
          } else if (hasRest2 && last2.hasAny) {
            return -1;
          }
          let any1 = 0;
          let conv1 = 0;
          let par;
          for (par of pars1) {
            if (par.hasAny) ++any1;
            if (par.hasConversion) ++conv1;
          }
          let any2 = 0;
          let conv2 = 0;
          for (par of pars2) {
            if (par.hasAny) ++any2;
            if (par.hasConversion) ++conv2;
          }
          if (any1 !== any2) {
            return any1 - any2;
          }
          if (hasRest1 && last1.hasConversion) {
            if (!hasRest2 || !last2.hasConversion) {
              return 1;
            }
          } else if (hasRest2 && last2.hasConversion) {
            return -1;
          }
          if (conv1 !== conv2) {
            return conv1 - conv2;
          }
          if (hasRest1) {
            if (!hasRest2) {
              return 1;
            }
          } else if (hasRest2) {
            return -1;
          }
          const lengthCriterion = (pars1.length - pars2.length) * (hasRest1 ? -1 : 1);
          if (lengthCriterion !== 0) {
            return lengthCriterion;
          }
          const comparisons = [];
          let tc = 0;
          for (let i = 0; i < pars1.length; ++i) {
            const thisComparison = compareParams(pars1[i], pars2[i]);
            comparisons.push(thisComparison);
            tc += thisComparison;
          }
          if (tc !== 0) {
            return tc;
          }
          let c;
          for (c of comparisons) {
            if (c !== 0) {
              return c;
            }
          }
          return 0;
        }
        function availableConversions(typeNames) {
          if (typeNames.length === 0) {
            return [];
          }
          const types = typeNames.map(findType);
          if (typeNames.length > 1) {
            types.sort((t1, t2) => t1.index - t2.index);
          }
          let matches = types[0].conversionsTo;
          if (typeNames.length === 1) {
            return matches;
          }
          matches = matches.concat([]);
          const knownTypes = new Set(typeNames);
          for (let i = 1; i < types.length; ++i) {
            let newMatch;
            for (newMatch of types[i].conversionsTo) {
              if (!knownTypes.has(newMatch.from)) {
                matches.push(newMatch);
                knownTypes.add(newMatch.from);
              }
            }
          }
          return matches;
        }
        function compileArgsPreprocessing(params, fn) {
          let fnConvert = fn;
          if (params.some((p) => p.hasConversion)) {
            const restParam = hasRestParam(params);
            const compiledConversions = params.map(compileArgConversion);
            fnConvert = function convertArgs() {
              const args = [];
              const last2 = restParam ? arguments.length - 1 : arguments.length;
              for (let i = 0; i < last2; i++) {
                args[i] = compiledConversions[i](arguments[i]);
              }
              if (restParam) {
                args[last2] = arguments[last2].map(compiledConversions[last2]);
              }
              return fn.apply(this, args);
            };
          }
          let fnPreprocess = fnConvert;
          if (hasRestParam(params)) {
            const offset = params.length - 1;
            fnPreprocess = function preprocessRestParams() {
              return fnConvert.apply(this, slice(arguments, 0, offset).concat([slice(arguments, offset)]));
            };
          }
          return fnPreprocess;
        }
        function compileArgConversion(param) {
          let test0, test1, conversion0, conversion1;
          const tests = [];
          const conversions = [];
          param.types.forEach(function(type) {
            if (type.conversion) {
              tests.push(findType(type.conversion.from).test);
              conversions.push(type.conversion.convert);
            }
          });
          switch (conversions.length) {
            case 0:
              return function convertArg(arg) {
                return arg;
              };
            case 1:
              test0 = tests[0];
              conversion0 = conversions[0];
              return function convertArg(arg) {
                if (test0(arg)) {
                  return conversion0(arg);
                }
                return arg;
              };
            case 2:
              test0 = tests[0];
              test1 = tests[1];
              conversion0 = conversions[0];
              conversion1 = conversions[1];
              return function convertArg(arg) {
                if (test0(arg)) {
                  return conversion0(arg);
                }
                if (test1(arg)) {
                  return conversion1(arg);
                }
                return arg;
              };
            default:
              return function convertArg(arg) {
                for (let i = 0; i < conversions.length; i++) {
                  if (tests[i](arg)) {
                    return conversions[i](arg);
                  }
                }
                return arg;
              };
          }
        }
        function splitParams(params) {
          function _splitParams(params2, index2, paramsSoFar) {
            if (index2 < params2.length) {
              const param = params2[index2];
              let resultingParams = [];
              if (param.restParam) {
                const exactTypes = param.types.filter(isExactType);
                if (exactTypes.length < param.types.length) {
                  resultingParams.push({
                    types: exactTypes,
                    name: "..." + exactTypes.map((t) => t.name).join("|"),
                    hasAny: exactTypes.some((t) => t.isAny),
                    hasConversion: false,
                    restParam: true
                  });
                }
                resultingParams.push(param);
              } else {
                resultingParams = param.types.map(function(type) {
                  return {
                    types: [type],
                    name: type.name,
                    hasAny: type.isAny,
                    hasConversion: type.conversion,
                    restParam: false
                  };
                });
              }
              return flatMap(resultingParams, function(nextParam) {
                return _splitParams(params2, index2 + 1, paramsSoFar.concat([nextParam]));
              });
            } else {
              return [paramsSoFar];
            }
          }
          return _splitParams(params, 0, []);
        }
        function conflicting(params1, params2) {
          const ii = Math.max(params1.length, params2.length);
          for (let i = 0; i < ii; i++) {
            const typeSet1 = getTypeSetAtIndex(params1, i);
            const typeSet2 = getTypeSetAtIndex(params2, i);
            let overlap = false;
            let name51;
            for (name51 of typeSet2) {
              if (typeSet1.has(name51)) {
                overlap = true;
                break;
              }
            }
            if (!overlap) {
              return false;
            }
          }
          const len1 = params1.length;
          const len2 = params2.length;
          const restParam1 = hasRestParam(params1);
          const restParam2 = hasRestParam(params2);
          return restParam1 ? restParam2 ? len1 === len2 : len2 >= len1 : restParam2 ? len1 >= len2 : len1 === len2;
        }
        function clearResolutions(functionList) {
          return functionList.map((fn) => {
            if (isReferToSelf(fn)) {
              return referToSelf(fn.referToSelf.callback);
            }
            if (isReferTo(fn)) {
              return makeReferTo(fn.referTo.references, fn.referTo.callback);
            }
            return fn;
          });
        }
        function collectResolutions(references, functionList, signatureMap) {
          const resolvedReferences = [];
          let reference;
          for (reference of references) {
            let resolution = signatureMap[reference];
            if (typeof resolution !== "number") {
              throw new TypeError('No definition for referenced signature "' + reference + '"');
            }
            resolution = functionList[resolution];
            if (typeof resolution !== "function") {
              return false;
            }
            resolvedReferences.push(resolution);
          }
          return resolvedReferences;
        }
        function resolveReferences(functionList, signatureMap, self2) {
          const resolvedFunctions = clearResolutions(functionList);
          const isResolved = new Array(resolvedFunctions.length).fill(false);
          let leftUnresolved = true;
          while (leftUnresolved) {
            leftUnresolved = false;
            let nothingResolved = true;
            for (let i = 0; i < resolvedFunctions.length; ++i) {
              if (isResolved[i]) continue;
              const fn = resolvedFunctions[i];
              if (isReferToSelf(fn)) {
                resolvedFunctions[i] = fn.referToSelf.callback(self2);
                resolvedFunctions[i].referToSelf = fn.referToSelf;
                isResolved[i] = true;
                nothingResolved = false;
              } else if (isReferTo(fn)) {
                const resolvedReferences = collectResolutions(fn.referTo.references, resolvedFunctions, signatureMap);
                if (resolvedReferences) {
                  resolvedFunctions[i] = fn.referTo.callback.apply(this, resolvedReferences);
                  resolvedFunctions[i].referTo = fn.referTo;
                  isResolved[i] = true;
                  nothingResolved = false;
                } else {
                  leftUnresolved = true;
                }
              }
            }
            if (nothingResolved && leftUnresolved) {
              throw new SyntaxError("Circular reference detected in resolving typed.referTo");
            }
          }
          return resolvedFunctions;
        }
        function validateDeprecatedThis(signaturesMap) {
          const deprecatedThisRegex = /\bthis(\(|\.signatures\b)/;
          Object.keys(signaturesMap).forEach((signature) => {
            const fn = signaturesMap[signature];
            if (deprecatedThisRegex.test(fn.toString())) {
              throw new SyntaxError("Using `this` to self-reference a function is deprecated since typed-function@3. Use typed.referTo and typed.referToSelf instead.");
            }
          });
        }
        function createTypedFunction(name51, rawSignaturesMap) {
          typed3.createCount++;
          if (Object.keys(rawSignaturesMap).length === 0) {
            throw new SyntaxError("No signatures provided");
          }
          if (typed3.warnAgainstDeprecatedThis) {
            validateDeprecatedThis(rawSignaturesMap);
          }
          const parsedParams = [];
          const originalFunctions = [];
          const signaturesMap = {};
          const preliminarySignatures = [];
          let signature;
          for (signature in rawSignaturesMap) {
            if (!Object.prototype.hasOwnProperty.call(rawSignaturesMap, signature)) {
              continue;
            }
            const params = parseSignature(signature);
            if (!params) continue;
            parsedParams.forEach(function(pp) {
              if (conflicting(pp, params)) {
                throw new TypeError('Conflicting signatures "' + stringifyParams(pp) + '" and "' + stringifyParams(params) + '".');
              }
            });
            parsedParams.push(params);
            const functionIndex = originalFunctions.length;
            originalFunctions.push(rawSignaturesMap[signature]);
            const conversionParams = params.map(expandParam);
            let sp;
            for (sp of splitParams(conversionParams)) {
              const spName = stringifyParams(sp);
              preliminarySignatures.push({
                params: sp,
                name: spName,
                fn: functionIndex
              });
              if (sp.every((p) => !p.hasConversion)) {
                signaturesMap[spName] = functionIndex;
              }
            }
          }
          preliminarySignatures.sort(compareSignatures);
          const resolvedFunctions = resolveReferences(originalFunctions, signaturesMap, theTypedFn);
          let s;
          for (s in signaturesMap) {
            if (Object.prototype.hasOwnProperty.call(signaturesMap, s)) {
              signaturesMap[s] = resolvedFunctions[signaturesMap[s]];
            }
          }
          const signatures = [];
          const internalSignatureMap = /* @__PURE__ */ new Map();
          for (s of preliminarySignatures) {
            if (!internalSignatureMap.has(s.name)) {
              s.fn = resolvedFunctions[s.fn];
              signatures.push(s);
              internalSignatureMap.set(s.name, s);
            }
          }
          const ok0 = signatures[0] && signatures[0].params.length <= 2 && !hasRestParam(signatures[0].params);
          const ok1 = signatures[1] && signatures[1].params.length <= 2 && !hasRestParam(signatures[1].params);
          const ok2 = signatures[2] && signatures[2].params.length <= 2 && !hasRestParam(signatures[2].params);
          const ok3 = signatures[3] && signatures[3].params.length <= 2 && !hasRestParam(signatures[3].params);
          const ok4 = signatures[4] && signatures[4].params.length <= 2 && !hasRestParam(signatures[4].params);
          const ok5 = signatures[5] && signatures[5].params.length <= 2 && !hasRestParam(signatures[5].params);
          const allOk = ok0 && ok1 && ok2 && ok3 && ok4 && ok5;
          for (let i = 0; i < signatures.length; ++i) {
            signatures[i].test = compileTests(signatures[i].params);
          }
          const test00 = ok0 ? compileTest(signatures[0].params[0]) : notOk;
          const test10 = ok1 ? compileTest(signatures[1].params[0]) : notOk;
          const test20 = ok2 ? compileTest(signatures[2].params[0]) : notOk;
          const test30 = ok3 ? compileTest(signatures[3].params[0]) : notOk;
          const test40 = ok4 ? compileTest(signatures[4].params[0]) : notOk;
          const test50 = ok5 ? compileTest(signatures[5].params[0]) : notOk;
          const test01 = ok0 ? compileTest(signatures[0].params[1]) : notOk;
          const test11 = ok1 ? compileTest(signatures[1].params[1]) : notOk;
          const test21 = ok2 ? compileTest(signatures[2].params[1]) : notOk;
          const test31 = ok3 ? compileTest(signatures[3].params[1]) : notOk;
          const test41 = ok4 ? compileTest(signatures[4].params[1]) : notOk;
          const test51 = ok5 ? compileTest(signatures[5].params[1]) : notOk;
          for (let i = 0; i < signatures.length; ++i) {
            signatures[i].implementation = compileArgsPreprocessing(signatures[i].params, signatures[i].fn);
          }
          const fn0 = ok0 ? signatures[0].implementation : undef;
          const fn1 = ok1 ? signatures[1].implementation : undef;
          const fn2 = ok2 ? signatures[2].implementation : undef;
          const fn3 = ok3 ? signatures[3].implementation : undef;
          const fn4 = ok4 ? signatures[4].implementation : undef;
          const fn5 = ok5 ? signatures[5].implementation : undef;
          const len0 = ok0 ? signatures[0].params.length : -1;
          const len1 = ok1 ? signatures[1].params.length : -1;
          const len2 = ok2 ? signatures[2].params.length : -1;
          const len3 = ok3 ? signatures[3].params.length : -1;
          const len4 = ok4 ? signatures[4].params.length : -1;
          const len5 = ok5 ? signatures[5].params.length : -1;
          const iStart = allOk ? 6 : 0;
          const iEnd = signatures.length;
          const tests = signatures.map((s2) => s2.test);
          const fns = signatures.map((s2) => s2.implementation);
          const generic = function generic2() {
            for (let i = iStart; i < iEnd; i++) {
              if (tests[i](arguments)) {
                return fns[i].apply(this, arguments);
              }
            }
            return typed3.onMismatch(name51, arguments, signatures);
          };
          function theTypedFn(arg0, arg1) {
            if (arguments.length === len0 && test00(arg0) && test01(arg1)) {
              return fn0.apply(this, arguments);
            }
            if (arguments.length === len1 && test10(arg0) && test11(arg1)) {
              return fn1.apply(this, arguments);
            }
            if (arguments.length === len2 && test20(arg0) && test21(arg1)) {
              return fn2.apply(this, arguments);
            }
            if (arguments.length === len3 && test30(arg0) && test31(arg1)) {
              return fn3.apply(this, arguments);
            }
            if (arguments.length === len4 && test40(arg0) && test41(arg1)) {
              return fn4.apply(this, arguments);
            }
            if (arguments.length === len5 && test50(arg0) && test51(arg1)) {
              return fn5.apply(this, arguments);
            }
            return generic.apply(this, arguments);
          }
          try {
            Object.defineProperty(theTypedFn, "name", {
              value: name51
            });
          } catch (err2) {
          }
          theTypedFn.signatures = signaturesMap;
          theTypedFn._typedFunctionData = {
            signatures,
            signatureMap: internalSignatureMap
          };
          return theTypedFn;
        }
        function _onMismatch(name51, args, signatures) {
          throw createError(name51, args, signatures);
        }
        function initial(arr) {
          return slice(arr, 0, arr.length - 1);
        }
        function last(arr) {
          return arr[arr.length - 1];
        }
        function slice(arr, start, end) {
          return Array.prototype.slice.call(arr, start, end);
        }
        function findInArray(arr, test) {
          for (let i = 0; i < arr.length; i++) {
            if (test(arr[i])) {
              return arr[i];
            }
          }
          return void 0;
        }
        function flatMap(arr, callback) {
          return Array.prototype.concat.apply([], arr.map(callback));
        }
        function referTo() {
          const references = initial(arguments).map((s) => stringifyParams(parseSignature(s)));
          const callback = last(arguments);
          if (typeof callback !== "function") {
            throw new TypeError("Callback function expected as last argument");
          }
          return makeReferTo(references, callback);
        }
        function makeReferTo(references, callback) {
          return {
            referTo: {
              references,
              callback
            }
          };
        }
        function referToSelf(callback) {
          if (typeof callback !== "function") {
            throw new TypeError("Callback function expected as first argument");
          }
          return {
            referToSelf: {
              callback
            }
          };
        }
        function isReferTo(objectOrFn) {
          return objectOrFn && typeof objectOrFn.referTo === "object" && Array.isArray(objectOrFn.referTo.references) && typeof objectOrFn.referTo.callback === "function";
        }
        function isReferToSelf(objectOrFn) {
          return objectOrFn && typeof objectOrFn.referToSelf === "object" && typeof objectOrFn.referToSelf.callback === "function";
        }
        function checkName(nameSoFar, newName) {
          if (!nameSoFar) {
            return newName;
          }
          if (newName && newName !== nameSoFar) {
            const err2 = new Error("Function names do not match (expected: " + nameSoFar + ", actual: " + newName + ")");
            err2.data = {
              actual: newName,
              expected: nameSoFar
            };
            throw err2;
          }
          return nameSoFar;
        }
        function getObjectName(obj) {
          let name51;
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && (isTypedFunction(obj[key]) || typeof obj[key].signature === "string")) {
              name51 = checkName(name51, obj[key].name);
            }
          }
          return name51;
        }
        function mergeSignatures(dest, source) {
          let key;
          for (key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              if (key in dest) {
                if (source[key] !== dest[key]) {
                  const err2 = new Error('Signature "' + key + '" is defined twice');
                  err2.data = {
                    signature: key,
                    sourceFunction: source[key],
                    destFunction: dest[key]
                  };
                  throw err2;
                }
              }
              dest[key] = source[key];
            }
          }
        }
        const saveTyped = typed3;
        typed3 = function(maybeName) {
          const named = typeof maybeName === "string";
          const start = named ? 1 : 0;
          let name51 = named ? maybeName : "";
          const allSignatures = {};
          for (let i = start; i < arguments.length; ++i) {
            const item = arguments[i];
            let theseSignatures = {};
            let thisName;
            if (typeof item === "function") {
              thisName = item.name;
              if (typeof item.signature === "string") {
                theseSignatures[item.signature] = item;
              } else if (isTypedFunction(item)) {
                theseSignatures = item.signatures;
              }
            } else if (isPlainObject2(item)) {
              theseSignatures = item;
              if (!named) {
                thisName = getObjectName(item);
              }
            }
            if (Object.keys(theseSignatures).length === 0) {
              const err2 = new TypeError("Argument to 'typed' at index " + i + " is not a (typed) function, nor an object with signatures as keys and functions as values.");
              err2.data = {
                index: i,
                argument: item
              };
              throw err2;
            }
            if (!named) {
              name51 = checkName(name51, thisName);
            }
            mergeSignatures(allSignatures, theseSignatures);
          }
          return createTypedFunction(name51 || "", allSignatures);
        };
        typed3.create = create;
        typed3.createCount = saveTyped.createCount;
        typed3.onMismatch = _onMismatch;
        typed3.throwMismatchError = _onMismatch;
        typed3.createError = createError;
        typed3.clear = clear;
        typed3.clearConversions = clearConversions;
        typed3.addTypes = addTypes;
        typed3._findType = findType;
        typed3.referTo = referTo;
        typed3.referToSelf = referToSelf;
        typed3.convert = convert;
        typed3.findSignature = findSignature;
        typed3.find = find;
        typed3.isTypedFunction = isTypedFunction;
        typed3.warnAgainstDeprecatedThis = true;
        typed3.addType = function(type, beforeObjectTest) {
          let before = "any";
          if (beforeObjectTest !== false && typeMap.has("Object")) {
            before = "Object";
          }
          typed3.addTypes([type], before);
        };
        function _validateConversion(conversion) {
          if (!conversion || typeof conversion.from !== "string" || typeof conversion.to !== "string" || typeof conversion.convert !== "function") {
            throw new TypeError("Object with properties {from: string, to: string, convert: function} expected");
          }
          if (conversion.to === conversion.from) {
            throw new SyntaxError('Illegal to define conversion from "' + conversion.from + '" to itself.');
          }
        }
        typed3.addConversion = function(conversion) {
          let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
            override: false
          };
          _validateConversion(conversion);
          const to = findType(conversion.to);
          const existing = to.conversionsTo.find((other) => other.from === conversion.from);
          if (existing) {
            if (options && options.override) {
              typed3.removeConversion({
                from: existing.from,
                to: conversion.to,
                convert: existing.convert
              });
            } else {
              throw new Error('There is already a conversion from "' + conversion.from + '" to "' + to.name + '"');
            }
          }
          to.conversionsTo.push({
            from: conversion.from,
            convert: conversion.convert,
            index: nConversions++
          });
        };
        typed3.addConversions = function(conversions, options) {
          conversions.forEach((conversion) => typed3.addConversion(conversion, options));
        };
        typed3.removeConversion = function(conversion) {
          _validateConversion(conversion);
          const to = findType(conversion.to);
          const existingConversion = findInArray(to.conversionsTo, (c) => c.from === conversion.from);
          if (!existingConversion) {
            throw new Error("Attempt to remove nonexistent conversion from " + conversion.from + " to " + conversion.to);
          }
          if (existingConversion.convert !== conversion.convert) {
            throw new Error("Conversion to remove does not match existing conversion");
          }
          const index2 = to.conversionsTo.indexOf(existingConversion);
          to.conversionsTo.splice(index2, 1);
        };
        typed3.resolve = function(tf, argList) {
          if (!isTypedFunction(tf)) {
            throw new TypeError(NOT_TYPED_FUNCTION);
          }
          const sigs = tf._typedFunctionData.signatures;
          for (let i = 0; i < sigs.length; ++i) {
            if (sigs[i].test(argList)) {
              return sigs[i];
            }
          }
          return null;
        };
        return typed3;
      }
      var typedFunction2 = create();
      return typedFunction2;
    });
  }
});

// node_modules/jsfive/dist/esm/index.mjs
function _unpack_struct_from(structure, buf, offset = 0) {
  var output = /* @__PURE__ */ new Map();
  for (let [key, fmt] of structure.entries()) {
    let value = struct.unpack_from("<" + fmt, buf, offset);
    offset += struct.calcsize(fmt);
    if (value.length == 1) {
      value = value[0];
    }
    ;
    output.set(key, value);
  }
  return output;
}
function assert(thing) {
  if (!thing) {
    thing();
  }
}
function _structure_size(structure) {
  var fmt = "<" + Array.from(structure.values()).join("");
  return struct.calcsize(fmt);
}
function _padded_size(size2, padding_multiple = 8) {
  return Math.ceil(size2 / padding_multiple) * padding_multiple;
}
var dtype_to_format = {
  "u": "Uint",
  "i": "Int",
  "f": "Float"
};
function dtype_getter(dtype_str) {
  var big_endian = struct._is_big_endian(dtype_str);
  var getter, nbytes;
  if (/S/.test(dtype_str)) {
    getter = "getString";
    nbytes = ((dtype_str.match(/S(\d*)/) || [])[1] || 1) | 0;
  } else {
    let [_, fstr, bytestr] = dtype_str.match(/[<>=!@]?(i|u|f)(\d*)/);
    nbytes = parseInt(bytestr || 4, 10);
    let nbits = nbytes * 8;
    getter = "get" + dtype_to_format[fstr] + nbits.toFixed();
  }
  return [getter, big_endian, nbytes];
}
var Struct = class {
  constructor() {
    this.big_endian = isBigEndian();
    this.getters = {
      "s": "getUint8",
      "b": "getInt8",
      "B": "getUint8",
      "h": "getInt16",
      "H": "getUint16",
      "i": "getInt32",
      "I": "getUint32",
      "l": "getInt32",
      "L": "getUint32",
      "q": "getInt64",
      "Q": "getUint64",
      "e": "getFloat16",
      "f": "getFloat32",
      "d": "getFloat64"
    };
    this.byte_lengths = {
      "s": 1,
      "b": 1,
      "B": 1,
      "h": 2,
      "H": 2,
      "i": 4,
      "I": 4,
      "l": 4,
      "L": 4,
      "q": 8,
      "Q": 8,
      "e": 2,
      "f": 4,
      "d": 8
    };
    let all_formats = Object.keys(this.byte_lengths).join("");
    this.fmt_size_regex = "(\\d*)([" + all_formats + "])";
  }
  calcsize(fmt) {
    var size2 = 0;
    var match;
    var regex = new RegExp(this.fmt_size_regex, "g");
    while ((match = regex.exec(fmt)) !== null) {
      let n = parseInt(match[1] || 1, 10);
      let f = match[2];
      let subsize = this.byte_lengths[f];
      size2 += n * subsize;
    }
    return size2;
  }
  _is_big_endian(fmt) {
    var big_endian;
    if (/^</.test(fmt)) {
      big_endian = false;
    } else if (/^(!|>)/.test(fmt)) {
      big_endian = true;
    } else {
      big_endian = this.big_endian;
    }
    return big_endian;
  }
  unpack_from(fmt, buffer, offset) {
    var offset = Number(offset || 0);
    var view = new DataView64(buffer, 0);
    var output = [];
    var big_endian = this._is_big_endian(fmt);
    var match;
    var regex = new RegExp(this.fmt_size_regex, "g");
    while ((match = regex.exec(fmt)) !== null) {
      let n = parseInt(match[1] || 1, 10);
      let f = match[2];
      let getter = this.getters[f];
      let size2 = this.byte_lengths[f];
      if (f == "s") {
        output.push(new TextDecoder().decode(buffer.slice(offset, offset + n)));
        offset += n;
      } else {
        for (var i = 0; i < n; i++) {
          output.push(view[getter](offset, !big_endian));
          offset += size2;
        }
      }
    }
    return output;
  }
};
var struct = new Struct();
function isBigEndian() {
  const array = new Uint8Array(4);
  const view = new Uint32Array(array.buffer);
  return !((view[0] = 1) & array[0]);
}
var WARN_OVERFLOW = false;
var MAX_INT64 = 1n << 63n - 1n;
var MIN_INT64 = -1n << 63n;
var MAX_UINT64 = 1n << 64n;
var MIN_UINT64 = 0n;
function decodeFloat16(low, high) {
  let sign3 = (high & 128) >> 7;
  let exponent = (high & 124) >> 2;
  let fraction = ((high & 3) << 8) + low;
  let magnitude;
  if (exponent == 31) {
    magnitude = fraction == 0 ? Infinity : NaN;
  } else if (exponent == 0) {
    magnitude = 2 ** -14 * (fraction / 1024);
  } else {
    magnitude = 2 ** (exponent - 15) * (1 + fraction / 1024);
  }
  return sign3 ? -magnitude : magnitude;
}
var DataView64 = class extends DataView {
  getFloat16(byteOffset, littlEndian) {
    let bytes = [this.getUint8(byteOffset), this.getUint8(byteOffset + 1)];
    if (!littlEndian) bytes.reverse();
    let [low, high] = bytes;
    return decodeFloat16(low, high);
  }
  getUint64(byteOffset, littleEndian) {
    const left = BigInt(this.getUint32(byteOffset, littleEndian));
    const right = BigInt(this.getUint32(byteOffset + 4, littleEndian));
    let combined = littleEndian ? left + (right << 32n) : (left << 32n) + right;
    if (WARN_OVERFLOW && (combined < MIN_UINT64 || combined > MAX_UINT64)) {
      console.warn(combined, "exceeds range of 64-bit unsigned int");
    }
    return Number(combined);
  }
  getInt64(byteOffset, littleEndian) {
    var low, high;
    if (littleEndian) {
      low = this.getUint32(byteOffset, true);
      high = this.getInt32(byteOffset + 4, true);
    } else {
      high = this.getInt32(byteOffset, false);
      low = this.getUint32(byteOffset + 4, false);
    }
    let combined = BigInt(low) + (BigInt(high) << 32n);
    if (WARN_OVERFLOW && (combined < MIN_INT64 || combined > MAX_INT64)) {
      console.warn(combined, "exceeds range of 64-bit signed int");
    }
    return Number(combined);
  }
  getString(byteOffset, littleEndian, length) {
    const str_buffer = this.buffer.slice(byteOffset, byteOffset + length);
    const decoder = new TextDecoder();
    return decoder.decode(str_buffer);
  }
  getVLENStruct(byteOffset, littleEndian, length) {
    let item_size = this.getUint32(byteOffset, littleEndian);
    let collection_address = this.getUint64(byteOffset + 4, littleEndian);
    let object_index = this.getUint32(byteOffset + 12, littleEndian);
    return [item_size, collection_address, object_index];
  }
};
function bitSize(integer) {
  return integer.toString(2).length;
}
function _unpack_integer(nbytes, fh, offset = 0, littleEndian = true) {
  let bytes = new Uint8Array(fh.slice(offset, offset + nbytes));
  if (!littleEndian) {
    bytes.reverse();
  }
  let integer = bytes.reduce((accumulator, currentValue, index2) => accumulator + (currentValue << index2 * 8), 0);
  return integer;
}
var DatatypeMessage = class {
  //""" Representation of a HDF5 Datatype Message. """
  //# Contents and layout defined in IV.A.2.d.
  constructor(buf, offset) {
    this.buf = buf;
    this.offset = offset;
    this.dtype = this.determine_dtype();
  }
  determine_dtype() {
    let datatype_msg = _unpack_struct_from(DATATYPE_MSG, this.buf, this.offset);
    this.offset += DATATYPE_MSG_SIZE;
    let datatype_class = datatype_msg.get("class_and_version") & 15;
    if (datatype_class == DATATYPE_FIXED_POINT) {
      return this._determine_dtype_fixed_point(datatype_msg);
    } else if (datatype_class == DATATYPE_FLOATING_POINT) {
      return this._determine_dtype_floating_point(datatype_msg);
    } else if (datatype_class == DATATYPE_TIME) {
      throw "Time datatype class not supported.";
    } else if (datatype_class == DATATYPE_STRING) {
      return this._determine_dtype_string(datatype_msg);
    } else if (datatype_class == DATATYPE_BITFIELD) {
      throw "Bitfield datatype class not supported.";
    } else if (datatype_class == DATATYPE_OPAQUE) {
      throw "Opaque datatype class not supported.";
    } else if (datatype_class == DATATYPE_COMPOUND) {
      return this._determine_dtype_compound(datatype_msg);
    } else if (datatype_class == DATATYPE_REFERENCE) {
      return ["REFERENCE", datatype_msg.get("size")];
    } else if (datatype_class == DATATYPE_ENUMERATED) {
      return this.determine_dtype();
    } else if (datatype_class == DATATYPE_ARRAY) {
      throw "Array datatype class not supported.";
    } else if (datatype_class == DATATYPE_VARIABLE_LENGTH) {
      let vlen_type = this._determine_dtype_vlen(datatype_msg);
      if (vlen_type[0] == "VLEN_SEQUENCE") {
        let base_type = this.determine_dtype();
        vlen_type = ["VLEN_SEQUENCE", base_type];
      }
      return vlen_type;
    } else {
      throw "Invalid datatype class " + datatype_class;
    }
  }
  _determine_dtype_fixed_point(datatype_msg) {
    let length_in_bytes = datatype_msg.get("size");
    if (![1, 2, 4, 8].includes(length_in_bytes)) {
      throw "Unsupported datatype size";
    }
    let signed = datatype_msg.get("class_bit_field_0") & 8;
    var dtype_char;
    if (signed > 0) {
      dtype_char = "i";
    } else {
      dtype_char = "u";
    }
    let byte_order = datatype_msg.get("class_bit_field_0") & 1;
    var byte_order_char;
    if (byte_order == 0) {
      byte_order_char = "<";
    } else {
      byte_order_char = ">";
    }
    this.offset += 4;
    return byte_order_char + dtype_char + length_in_bytes.toFixed();
  }
  _determine_dtype_floating_point(datatype_msg) {
    let length_in_bytes = datatype_msg.get("size");
    if (![1, 2, 4, 8].includes(length_in_bytes)) {
      throw "Unsupported datatype size";
    }
    let dtype_char = "f";
    let byte_order = datatype_msg.get("class_bit_field_0") & 1;
    var byte_order_char;
    if (byte_order == 0) {
      byte_order_char = "<";
    } else {
      byte_order_char = ">";
    }
    this.offset += 12;
    return byte_order_char + dtype_char + length_in_bytes.toFixed();
  }
  _determine_dtype_string(datatype_msg) {
    return "S" + datatype_msg.get("size").toFixed();
  }
  _determine_dtype_vlen(datatype_msg) {
    let vlen_type = datatype_msg.get("class_bit_field_0") & 1;
    if (vlen_type != 1) {
      return ["VLEN_SEQUENCE", 0, 0];
    }
    let padding_type = datatype_msg.get("class_bit_field_0") >> 4;
    let character_set = datatype_msg.get("class_bit_field_1") & 1;
    return ["VLEN_STRING", padding_type, character_set];
  }
  _determine_dtype_compound(datatype_msg) {
    throw "Compound type not yet implemented!";
  }
};
var DATATYPE_MSG = /* @__PURE__ */ new Map([
  ["class_and_version", "B"],
  ["class_bit_field_0", "B"],
  ["class_bit_field_1", "B"],
  ["class_bit_field_2", "B"],
  ["size", "I"]
]);
var DATATYPE_MSG_SIZE = _structure_size(DATATYPE_MSG);
var COMPOUND_PROP_DESC_V1 = /* @__PURE__ */ new Map([
  ["offset", "I"],
  ["dimensionality", "B"],
  ["reserved_0", "B"],
  ["reserved_1", "B"],
  ["reserved_2", "B"],
  ["permutation", "I"],
  ["reserved_3", "I"],
  ["dim_size_1", "I"],
  ["dim_size_2", "I"],
  ["dim_size_3", "I"],
  ["dim_size_4", "I"]
]);
var COMPOUND_PROP_DESC_V1_SIZE = _structure_size(COMPOUND_PROP_DESC_V1);
var DATATYPE_FIXED_POINT = 0;
var DATATYPE_FLOATING_POINT = 1;
var DATATYPE_TIME = 2;
var DATATYPE_STRING = 3;
var DATATYPE_BITFIELD = 4;
var DATATYPE_OPAQUE = 5;
var DATATYPE_COMPOUND = 6;
var DATATYPE_REFERENCE = 7;
var DATATYPE_ENUMERATED = 8;
var DATATYPE_VARIABLE_LENGTH = 9;
var DATATYPE_ARRAY = 10;
var Z_FIXED$1 = 4;
var Z_BINARY = 0;
var Z_TEXT = 1;
var Z_UNKNOWN$1 = 2;
function zero$1(buf) {
  let len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}
var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
var MIN_MATCH$1 = 3;
var MAX_MATCH$1 = 258;
var LENGTH_CODES$1 = 29;
var LITERALS$1 = 256;
var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
var D_CODES$1 = 30;
var BL_CODES$1 = 19;
var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
var MAX_BITS$1 = 15;
var Buf_size = 16;
var MAX_BL_BITS = 7;
var END_BLOCK = 256;
var REP_3_6 = 16;
var REPZ_3_10 = 17;
var REPZ_11_138 = 18;
var extra_lbits = (
  /* extra bits for each length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
);
var extra_dbits = (
  /* extra bits for each distance code */
  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
);
var extra_blbits = (
  /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
);
var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var DIST_CODE_LEN = 512;
var static_ltree = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
var static_dtree = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
var _dist_code = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
var base_length = new Array(LENGTH_CODES$1);
zero$1(base_length);
var base_dist = new Array(D_CODES$1);
zero$1(base_dist);
function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
  this.static_tree = static_tree;
  this.extra_bits = extra_bits;
  this.extra_base = extra_base;
  this.elems = elems;
  this.max_length = max_length;
  this.has_stree = static_tree && static_tree.length;
}
var static_l_desc;
var static_d_desc;
var static_bl_desc;
function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;
  this.max_code = 0;
  this.stat_desc = stat_desc;
}
var d_code = (dist) => {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};
var put_short = (s, w) => {
  s.pending_buf[s.pending++] = w & 255;
  s.pending_buf[s.pending++] = w >>> 8 & 255;
};
var send_bits = (s, value, length) => {
  if (s.bi_valid > Buf_size - length) {
    s.bi_buf |= value << s.bi_valid & 65535;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> Buf_size - s.bi_valid;
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= value << s.bi_valid & 65535;
    s.bi_valid += length;
  }
};
var send_code = (s, c, tree) => {
  send_bits(
    s,
    tree[c * 2],
    tree[c * 2 + 1]
    /*.Len*/
  );
};
var bi_reverse = (code, len) => {
  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};
var bi_flush = (s) => {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;
  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 255;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};
var gen_bitlen = (s, desc) => {
  const tree = desc.dyn_tree;
  const max_code = desc.max_code;
  const stree = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const extra = desc.stat_desc.extra_bits;
  const base = desc.stat_desc.extra_base;
  const max_length = desc.stat_desc.max_length;
  let h;
  let n, m;
  let bits;
  let xbits;
  let f;
  let overflow = 0;
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }
  tree[s.heap[s.heap_max] * 2 + 1] = 0;
  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1] = bits;
    if (n > max_code) {
      continue;
    }
    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2];
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1] + xbits);
    }
  }
  if (overflow === 0) {
    return;
  }
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) {
      bits--;
    }
    s.bl_count[bits]--;
    s.bl_count[bits + 1] += 2;
    s.bl_count[max_length]--;
    overflow -= 2;
  } while (overflow > 0);
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) {
        continue;
      }
      if (tree[m * 2 + 1] !== bits) {
        s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
        tree[m * 2 + 1] = bits;
      }
      n--;
    }
  }
};
var gen_codes = (tree, max_code, bl_count) => {
  const next_code = new Array(MAX_BITS$1 + 1);
  let code = 0;
  let bits;
  let n;
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = code + bl_count[bits - 1] << 1;
    next_code[bits] = code;
  }
  for (n = 0; n <= max_code; n++) {
    let len = tree[n * 2 + 1];
    if (len === 0) {
      continue;
    }
    tree[n * 2] = bi_reverse(next_code[len]++, len);
  }
};
var tr_static_init = () => {
  let n;
  let bits;
  let length;
  let code;
  let dist;
  const bl_count = new Array(MAX_BITS$1 + 1);
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < 1 << extra_lbits[code]; n++) {
      _length_code[length++] = code;
    }
  }
  _length_code[length - 1] = code;
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < 1 << extra_dbits[code]; n++) {
      _dist_code[dist++] = code;
    }
  }
  dist >>= 7;
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }
  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1] = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1] = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1] = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1] = 8;
    n++;
    bl_count[8]++;
  }
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1] = 5;
    static_dtree[n * 2] = bi_reverse(n, 5);
  }
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
};
var init_block = (s) => {
  let n;
  for (n = 0; n < L_CODES$1; n++) {
    s.dyn_ltree[n * 2] = 0;
  }
  for (n = 0; n < D_CODES$1; n++) {
    s.dyn_dtree[n * 2] = 0;
  }
  for (n = 0; n < BL_CODES$1; n++) {
    s.bl_tree[n * 2] = 0;
  }
  s.dyn_ltree[END_BLOCK * 2] = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};
var bi_windup = (s) => {
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};
var smaller = (tree, n, m, depth) => {
  const _n2 = n * 2;
  const _m2 = m * 2;
  return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
};
var pqdownheap = (s, tree, k) => {
  const v = s.heap[k];
  let j = k << 1;
  while (j <= s.heap_len) {
    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    if (smaller(tree, v, s.heap[j], s.depth)) {
      break;
    }
    s.heap[k] = s.heap[j];
    k = j;
    j <<= 1;
  }
  s.heap[k] = v;
};
var compress_block = (s, ltree, dtree) => {
  let dist;
  let lc;
  let sx = 0;
  let code;
  let extra;
  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 255;
      dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree);
      } else {
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree);
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);
        }
        dist--;
        code = d_code(dist);
        send_code(s, code, dtree);
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);
        }
      }
    } while (sx < s.sym_next);
  }
  send_code(s, END_BLOCK, ltree);
};
var build_tree = (s, desc) => {
  const tree = desc.dyn_tree;
  const stree = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems = desc.stat_desc.elems;
  let n, m;
  let max_code = -1;
  let node2;
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;
  for (n = 0; n < elems; n++) {
    if (tree[n * 2] !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;
    } else {
      tree[n * 2 + 1] = 0;
    }
  }
  while (s.heap_len < 2) {
    node2 = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
    tree[node2 * 2] = 1;
    s.depth[node2] = 0;
    s.opt_len--;
    if (has_stree) {
      s.static_len -= stree[node2 * 2 + 1];
    }
  }
  desc.max_code = max_code;
  for (n = s.heap_len >> 1; n >= 1; n--) {
    pqdownheap(s, tree, n);
  }
  node2 = elems;
  do {
    n = s.heap[
      1
      /*SMALLEST*/
    ];
    s.heap[
      1
      /*SMALLEST*/
    ] = s.heap[s.heap_len--];
    pqdownheap(
      s,
      tree,
      1
      /*SMALLEST*/
    );
    m = s.heap[
      1
      /*SMALLEST*/
    ];
    s.heap[--s.heap_max] = n;
    s.heap[--s.heap_max] = m;
    tree[node2 * 2] = tree[n * 2] + tree[m * 2];
    s.depth[node2] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1] = tree[m * 2 + 1] = node2;
    s.heap[
      1
      /*SMALLEST*/
    ] = node2++;
    pqdownheap(
      s,
      tree,
      1
      /*SMALLEST*/
    );
  } while (s.heap_len >= 2);
  s.heap[--s.heap_max] = s.heap[
    1
    /*SMALLEST*/
  ];
  gen_bitlen(s, desc);
  gen_codes(tree, max_code, s.bl_count);
};
var scan_tree = (s, tree, max_code) => {
  let n;
  let prevlen = -1;
  let curlen;
  let nextlen = tree[0 * 2 + 1];
  let count = 0;
  let max_count = 7;
  let min_count = 4;
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1] = 65535;
  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1];
    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      s.bl_tree[curlen * 2] += count;
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        s.bl_tree[curlen * 2]++;
      }
      s.bl_tree[REP_3_6 * 2]++;
    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]++;
    } else {
      s.bl_tree[REPZ_11_138 * 2]++;
    }
    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};
var send_tree = (s, tree, max_code) => {
  let n;
  let prevlen = -1;
  let curlen;
  let nextlen = tree[0 * 2 + 1];
  let count = 0;
  let max_count = 7;
  let min_count = 4;
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1];
    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      do {
        send_code(s, curlen, s.bl_tree);
      } while (--count !== 0);
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);
    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);
    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }
    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};
var build_bl_tree = (s) => {
  let max_blindex;
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
  build_tree(s, s.bl_desc);
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
      break;
    }
  }
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  return max_blindex;
};
var send_all_trees = (s, lcodes, dcodes, blcodes) => {
  let rank2;
  send_bits(s, lcodes - 257, 5);
  send_bits(s, dcodes - 1, 5);
  send_bits(s, blcodes - 4, 4);
  for (rank2 = 0; rank2 < blcodes; rank2++) {
    send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
  }
  send_tree(s, s.dyn_ltree, lcodes - 1);
  send_tree(s, s.dyn_dtree, dcodes - 1);
};
var detect_data_type = (s) => {
  let block_mask = 4093624447;
  let n;
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
      return Z_BINARY;
    }
  }
  if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2] !== 0) {
      return Z_TEXT;
    }
  }
  return Z_BINARY;
};
var static_init_done = false;
var _tr_init$1 = (s) => {
  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }
  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
  s.bi_buf = 0;
  s.bi_valid = 0;
  init_block(s);
};
var _tr_stored_block$1 = (s, buf, stored_len, last) => {
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
  bi_windup(s);
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};
var _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};
var _tr_flush_block$1 = (s, buf, stored_len, last) => {
  let opt_lenb, static_lenb;
  let max_blindex = 0;
  if (s.level > 0) {
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }
    build_tree(s, s.l_desc);
    build_tree(s, s.d_desc);
    max_blindex = build_bl_tree(s);
    opt_lenb = s.opt_len + 3 + 7 >>> 3;
    static_lenb = s.static_len + 3 + 7 >>> 3;
    if (static_lenb <= opt_lenb) {
      opt_lenb = static_lenb;
    }
  } else {
    opt_lenb = static_lenb = stored_len + 5;
  }
  if (stored_len + 4 <= opt_lenb && buf !== -1) {
    _tr_stored_block$1(s, buf, stored_len, last);
  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);
  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  init_block(s);
  if (last) {
    bi_windup(s);
  }
};
var _tr_tally$1 = (s, dist, lc) => {
  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    s.dyn_ltree[lc * 2]++;
  } else {
    s.matches++;
    dist--;
    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
    s.dyn_dtree[d_code(dist) * 2]++;
  }
  return s.sym_next === s.sym_end;
};
var _tr_init_1 = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1 = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;
var trees = {
  _tr_init: _tr_init_1,
  _tr_stored_block: _tr_stored_block_1,
  _tr_flush_block: _tr_flush_block_1,
  _tr_tally: _tr_tally_1,
  _tr_align: _tr_align_1
};
var adler32 = (adler, buf, len, pos) => {
  let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
  while (len !== 0) {
    n = len > 2e3 ? 2e3 : len;
    len -= n;
    do {
      s1 = s1 + buf[pos++] | 0;
      s2 = s2 + s1 | 0;
    } while (--n);
    s1 %= 65521;
    s2 %= 65521;
  }
  return s1 | s2 << 16 | 0;
};
var adler32_1 = adler32;
var makeTable = () => {
  let c, table = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    table[n] = c;
  }
  return table;
};
var crcTable = new Uint32Array(makeTable());
var crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;
  crc ^= -1;
  for (let i = pos; i < end; i++) {
    crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
  }
  return crc ^ -1;
};
var crc32_1 = crc32;
var messages = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
};
var constants$2 = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
var {
  Z_NO_FLUSH: Z_NO_FLUSH$2,
  Z_PARTIAL_FLUSH,
  Z_FULL_FLUSH: Z_FULL_FLUSH$1,
  Z_FINISH: Z_FINISH$3,
  Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3,
  Z_STREAM_END: Z_STREAM_END$3,
  Z_STREAM_ERROR: Z_STREAM_ERROR$2,
  Z_DATA_ERROR: Z_DATA_ERROR$2,
  Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED,
  Z_HUFFMAN_ONLY,
  Z_RLE,
  Z_FIXED,
  Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;
var MAX_MEM_LEVEL = 9;
var MAX_WBITS$1 = 15;
var DEF_MEM_LEVEL = 8;
var LENGTH_CODES = 29;
var LITERALS = 256;
var L_CODES = LITERALS + 1 + LENGTH_CODES;
var D_CODES = 30;
var BL_CODES = 19;
var HEAP_SIZE = 2 * L_CODES + 1;
var MAX_BITS = 15;
var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
var PRESET_DICT = 32;
var INIT_STATE = 42;
var GZIP_STATE = 57;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;
var BS_NEED_MORE = 1;
var BS_BLOCK_DONE = 2;
var BS_FINISH_STARTED = 3;
var BS_FINISH_DONE = 4;
var OS_CODE = 3;
var err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};
var rank = (f) => {
  return f * 2 - (f > 4 ? 9 : 0);
};
var zero = (buf) => {
  let len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
};
var slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;
  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = m >= wsize ? m - wsize : 0;
  } while (--n);
  n = wsize;
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = m >= wsize ? m - wsize : 0;
  } while (--n);
};
var HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
var HASH = HASH_ZLIB;
var flush_pending = (strm) => {
  const s = strm.state;
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) {
    return;
  }
  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};
var flush_block_only = (s, last) => {
  _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};
var put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};
var putShortMSB = (s, b) => {
  s.pending_buf[s.pending++] = b >>> 8 & 255;
  s.pending_buf[s.pending++] = b & 255;
};
var read_buf = (strm, buf, start, size2) => {
  let len = strm.avail_in;
  if (len > size2) {
    len = size2;
  }
  if (len === 0) {
    return 0;
  }
  strm.avail_in -= len;
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  } else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }
  strm.next_in += len;
  strm.total_in += len;
  return len;
};
var longest_match = (s, cur_match) => {
  let chain_length = s.max_chain_length;
  let scan = s.strstart;
  let match;
  let len;
  let best_len = s.prev_length;
  let nice_match = s.nice_match;
  const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
  const _win = s.window;
  const wmask = s.w_mask;
  const prev = s.prev;
  const strend = s.strstart + MAX_MATCH;
  let scan_end1 = _win[scan + best_len - 1];
  let scan_end = _win[scan + best_len];
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  if (nice_match > s.lookahead) {
    nice_match = s.lookahead;
  }
  do {
    match = cur_match;
    if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
      continue;
    }
    scan += 2;
    match++;
    do {
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;
    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1 = _win[scan + best_len - 1];
      scan_end = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};
var fill_window = (s) => {
  const _w_size = s.w_size;
  let n, more, str;
  do {
    more = s.window_size - s.lookahead - s.strstart;
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
      while (s.insert) {
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
};
var deflate_stored = (s, flush) => {
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    len = 65535;
    have = s.bi_valid + 42 >> 3;
    if (s.strm.avail_out < have) {
      break;
    }
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;
    }
    if (len > have) {
      len = have;
    }
    if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
      break;
    }
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;
    flush_pending(s.strm);
    if (left) {
      if (left > len) {
        left = len;
      }
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);
  used -= s.strm.avail_in;
  if (used) {
    if (used >= s.w_size) {
      s.matches = 2;
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    } else {
      if (s.window_size - s.strstart <= used) {
        s.strstart -= s.w_size;
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }
  if (last) {
    return BS_FINISH_DONE;
  }
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;
    }
    have += s.w_size;
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }
  have = s.bi_valid + 42 >> 3;
  have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};
var deflate_fast = (s, flush) => {
  let hash_head;
  let bflush;
  for (; ; ) {
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    hash_head = 0;
    if (s.lookahead >= MIN_MATCH) {
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
    }
    if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      s.match_length = longest_match(s, hash_head);
    }
    if (s.match_length >= MIN_MATCH) {
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
      s.lookahead -= s.match_length;
      if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
        s.match_length--;
        do {
          s.strstart++;
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        } while (--s.match_length !== 0);
        s.strstart++;
      } else {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
      }
    } else {
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
};
var deflate_slow = (s, flush) => {
  let hash_head;
  let bflush;
  let max_insert;
  for (; ; ) {
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    hash_head = 0;
    if (s.lookahead >= MIN_MATCH) {
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
    }
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;
    if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      s.match_length = longest_match(s, hash_head);
      if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
        s.match_length = MIN_MATCH - 1;
      }
    }
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    } else if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      if (bflush) {
        flush_block_only(s, false);
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  if (s.match_available) {
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
};
var deflate_rle = (s, flush) => {
  let bflush;
  let prev;
  let scan, strend;
  const _win = s.window;
  for (; ; ) {
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
        } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
    }
    if (s.match_length >= MIN_MATCH) {
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
};
var deflate_huff = (s, flush) => {
  let bflush;
  for (; ; ) {
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;
      }
    }
    s.match_length = 0;
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
};
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}
var configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),
  /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),
  /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),
  /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),
  /* 3 */
  new Config(4, 4, 16, 16, deflate_slow),
  /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),
  /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),
  /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),
  /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),
  /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)
  /* 9 max compression */
];
var lm_init = (s) => {
  s.window_size = 2 * s.w_size;
  zero(s.head);
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;
  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};
function DeflateState() {
  this.strm = null;
  this.status = 0;
  this.pending_buf = null;
  this.pending_buf_size = 0;
  this.pending_out = 0;
  this.pending = 0;
  this.wrap = 0;
  this.gzhead = null;
  this.gzindex = 0;
  this.method = Z_DEFLATED$2;
  this.last_flush = -1;
  this.w_size = 0;
  this.w_bits = 0;
  this.w_mask = 0;
  this.window = null;
  this.window_size = 0;
  this.prev = null;
  this.head = null;
  this.ins_h = 0;
  this.hash_size = 0;
  this.hash_bits = 0;
  this.hash_mask = 0;
  this.hash_shift = 0;
  this.block_start = 0;
  this.match_length = 0;
  this.prev_match = 0;
  this.match_available = 0;
  this.strstart = 0;
  this.match_start = 0;
  this.lookahead = 0;
  this.prev_length = 0;
  this.max_chain_length = 0;
  this.max_lazy_match = 0;
  this.level = 0;
  this.strategy = 0;
  this.good_match = 0;
  this.nice_match = 0;
  this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);
  this.l_desc = null;
  this.d_desc = null;
  this.bl_desc = null;
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  this.heap = new Uint16Array(2 * L_CODES + 1);
  zero(this.heap);
  this.heap_len = 0;
  this.heap_max = 0;
  this.depth = new Uint16Array(2 * L_CODES + 1);
  zero(this.depth);
  this.sym_buf = 0;
  this.lit_bufsize = 0;
  this.sym_next = 0;
  this.sym_end = 0;
  this.opt_len = 0;
  this.static_len = 0;
  this.matches = 0;
  this.insert = 0;
  this.bi_buf = 0;
  this.bi_valid = 0;
}
var deflateStateCheck = (strm) => {
  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
  s.status !== GZIP_STATE && //#endif
  s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
    return 1;
  }
  return 0;
};
var deflateResetKeep = (strm) => {
  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }
  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;
  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;
  if (s.wrap < 0) {
    s.wrap = -s.wrap;
  }
  s.status = //#ifdef GZIP
  s.wrap === 2 ? GZIP_STATE : (
    //#endif
    s.wrap ? INIT_STATE : BUSY_STATE
  );
  strm.adler = s.wrap === 2 ? 0 : 1;
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};
var deflateReset = (strm) => {
  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};
var deflateSetHeader = (strm, head) => {
  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};
var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
  if (!strm) {
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;
  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else if (windowBits > 15) {
    wrap = 2;
    windowBits -= 16;
  }
  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
    return err(strm, Z_STREAM_ERROR$2);
  }
  if (windowBits === 8) {
    windowBits = 9;
  }
  const s = new DeflateState();
  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;
  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;
  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);
  s.lit_bufsize = 1 << memLevel + 6;
  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);
  s.sym_buf = s.lit_bufsize;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  s.level = level;
  s.strategy = strategy;
  s.method = method;
  return deflateReset(strm);
};
var deflateInit = (strm, level) => {
  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};
var deflate$2 = (strm, flush) => {
  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }
  const s = strm.state;
  if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
    return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
  }
  const old_flush = s.last_flush;
  s.last_flush = flush;
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$1);
  }
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$1);
  }
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
    let level_flags = -1;
    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= level_flags << 6;
    if (s.strstart !== 0) {
      header |= PRESET_DICT;
    }
    header += 31 - header % 31;
    putShortMSB(s, header);
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    strm.adler = 1;
    s.status = BUSY_STATE;
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
  if (s.status === GZIP_STATE) {
    strm.adler = 0;
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) {
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    } else {
      put_byte(
        s,
        (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 255);
      put_byte(s, s.gzhead.time >> 8 & 255);
      put_byte(s, s.gzhead.time >> 16 & 255);
      put_byte(s, s.gzhead.time >> 24 & 255);
      put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
      put_byte(s, s.gzhead.os & 255);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 255);
        put_byte(s, s.gzhead.extra.length >> 8 & 255);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra) {
      let beg = s.pending;
      let left = (s.gzhead.extra.length & 65535) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name) {
      let beg = s.pending;
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment) {
      let beg = s.pending;
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      strm.adler = 0;
    }
    s.status = BUSY_STATE;
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
  if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
      }
      return Z_OK$3;
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      } else if (flush !== Z_BLOCK$1) {
        _tr_stored_block(s, 0, 0, false);
        if (flush === Z_FULL_FLUSH$1) {
          zero(s.head);
          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
  }
  if (flush !== Z_FINISH$3) {
    return Z_OK$3;
  }
  if (s.wrap <= 0) {
    return Z_STREAM_END$3;
  }
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 255);
    put_byte(s, strm.adler >> 8 & 255);
    put_byte(s, strm.adler >> 16 & 255);
    put_byte(s, strm.adler >> 24 & 255);
    put_byte(s, strm.total_in & 255);
    put_byte(s, strm.total_in >> 8 & 255);
    put_byte(s, strm.total_in >> 16 & 255);
    put_byte(s, strm.total_in >> 24 & 255);
  } else {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 65535);
  }
  flush_pending(strm);
  if (s.wrap > 0) {
    s.wrap = -s.wrap;
  }
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};
var deflateEnd = (strm) => {
  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }
  const status = strm.state.status;
  strm.state = null;
  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};
var deflateSetDictionary = (strm, dictionary) => {
  let dictLength = dictionary.length;
  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }
  const s = strm.state;
  const wrap = s.wrap;
  if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }
  if (wrap === 1) {
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }
  s.wrap = 0;
  if (dictLength >= s.w_size) {
    if (wrap === 0) {
      zero(s.head);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
      s.prev[str & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};
var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = "pako deflate (from Nodeca project)";
var deflate_1$2 = {
  deflateInit: deflateInit_1,
  deflateInit2: deflateInit2_1,
  deflateReset: deflateReset_1,
  deflateResetKeep: deflateResetKeep_1,
  deflateSetHeader: deflateSetHeader_1,
  deflate: deflate_2$1,
  deflateEnd: deflateEnd_1,
  deflateSetDictionary: deflateSetDictionary_1,
  deflateInfo
};
var _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var assign = function(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) {
      continue;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be non-object");
    }
    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }
  return obj;
};
var flattenChunks = (chunks) => {
  let len = 0;
  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }
  const result = new Uint8Array(len);
  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
};
var common = {
  assign,
  flattenChunks
};
var STR_APPLY_UIA_OK = true;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch (__) {
  STR_APPLY_UIA_OK = false;
}
var _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
}
_utf8len[254] = _utf8len[254] = 1;
var string2buf = (str) => {
  if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }
  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 64512) === 56320) {
        c = 65536 + (c - 55296 << 10) + (c2 - 56320);
        m_pos++;
      }
    }
    buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
  }
  buf = new Uint8Array(buf_len);
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 64512) === 56320) {
        c = 65536 + (c - 55296 << 10) + (c2 - 56320);
        m_pos++;
      }
    }
    if (c < 128) {
      buf[i++] = c;
    } else if (c < 2048) {
      buf[i++] = 192 | c >>> 6;
      buf[i++] = 128 | c & 63;
    } else if (c < 65536) {
      buf[i++] = 224 | c >>> 12;
      buf[i++] = 128 | c >>> 6 & 63;
      buf[i++] = 128 | c & 63;
    } else {
      buf[i++] = 240 | c >>> 18;
      buf[i++] = 128 | c >>> 12 & 63;
      buf[i++] = 128 | c >>> 6 & 63;
      buf[i++] = 128 | c & 63;
    }
  }
  return buf;
};
var buf2binstring = (buf, len) => {
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }
  let result = "";
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};
var buf2string = (buf, max2) => {
  const len = max2 || buf.length;
  if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max2));
  }
  let i, out;
  const utf16buf = new Array(len * 2);
  for (out = 0, i = 0; i < len; ) {
    let c = buf[i++];
    if (c < 128) {
      utf16buf[out++] = c;
      continue;
    }
    let c_len = _utf8len[c];
    if (c_len > 4) {
      utf16buf[out++] = 65533;
      i += c_len - 1;
      continue;
    }
    c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
    while (c_len > 1 && i < len) {
      c = c << 6 | buf[i++] & 63;
      c_len--;
    }
    if (c_len > 1) {
      utf16buf[out++] = 65533;
      continue;
    }
    if (c < 65536) {
      utf16buf[out++] = c;
    } else {
      c -= 65536;
      utf16buf[out++] = 55296 | c >> 10 & 1023;
      utf16buf[out++] = 56320 | c & 1023;
    }
  }
  return buf2binstring(utf16buf, out);
};
var utf8border = (buf, max2) => {
  max2 = max2 || buf.length;
  if (max2 > buf.length) {
    max2 = buf.length;
  }
  let pos = max2 - 1;
  while (pos >= 0 && (buf[pos] & 192) === 128) {
    pos--;
  }
  if (pos < 0) {
    return max2;
  }
  if (pos === 0) {
    return max2;
  }
  return pos + _utf8len[buf[pos]] > max2 ? pos : max2;
};
var strings = {
  string2buf,
  buf2string,
  utf8border
};
function ZStream() {
  this.input = null;
  this.next_in = 0;
  this.avail_in = 0;
  this.total_in = 0;
  this.output = null;
  this.next_out = 0;
  this.avail_out = 0;
  this.total_out = 0;
  this.msg = "";
  this.state = null;
  this.data_type = 2;
  this.adler = 0;
}
var zstream = ZStream;
var toString$1 = Object.prototype.toString;
var {
  Z_NO_FLUSH: Z_NO_FLUSH$1,
  Z_SYNC_FLUSH,
  Z_FULL_FLUSH,
  Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2,
  Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;
function Deflate$1(options) {
  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED$1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});
  let opt = this.options;
  if (opt.raw && opt.windowBits > 0) {
    opt.windowBits = -opt.windowBits;
  } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
    opt.windowBits += 16;
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new zstream();
  this.strm.avail_out = 0;
  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );
  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }
  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }
  if (opt.dictionary) {
    let dict;
    if (typeof opt.dictionary === "string") {
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }
    status = deflate_1$2.deflateSetDictionary(this.strm, dict);
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    this._dict_set = true;
  }
}
Deflate$1.prototype.push = function(data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;
  if (this.ended) {
    return false;
  }
  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
  if (typeof data === "string") {
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === "[object ArrayBuffer]") {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }
  strm.next_in = 0;
  strm.avail_in = strm.input.length;
  for (; ; ) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }
    status = deflate_1$2.deflate(strm, _flush_mode);
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }
    if (strm.avail_in === 0) break;
  }
  return true;
};
Deflate$1.prototype.onData = function(chunk) {
  this.chunks.push(chunk);
};
Deflate$1.prototype.onEnd = function(status) {
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);
  deflator.push(input, true);
  if (deflator.err) {
    throw deflator.msg || messages[deflator.err];
  }
  return deflator.result;
}
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}
var Deflate_1$1 = Deflate$1;
var deflate_2 = deflate$1;
var deflateRaw_1$1 = deflateRaw$1;
var gzip_1$1 = gzip$1;
var constants$1 = constants$2;
var deflate_1$1 = {
  Deflate: Deflate_1$1,
  deflate: deflate_2,
  deflateRaw: deflateRaw_1$1,
  gzip: gzip_1$1,
  constants: constants$1
};
var BAD$1 = 16209;
var TYPE$1 = 16191;
var inffast = function inflate_fast(strm, start) {
  let _in;
  let last;
  let _out;
  let beg;
  let end;
  let dmax;
  let wsize;
  let whave;
  let wnext;
  let s_window;
  let hold;
  let bits;
  let lcode;
  let dcode;
  let lmask;
  let dmask;
  let here;
  let op;
  let len;
  let dist;
  let from;
  let from_source;
  let input, output;
  const state = strm.state;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
  dmax = state.dmax;
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;
  top:
    do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen:
        for (; ; ) {
          op = here >>> 24;
          hold >>>= op;
          bits -= op;
          op = here >>> 16 & 255;
          if (op === 0) {
            output[_out++] = here & 65535;
          } else if (op & 16) {
            len = here & 65535;
            op &= 15;
            if (op) {
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
              len += hold & (1 << op) - 1;
              hold >>>= op;
              bits -= op;
            }
            if (bits < 15) {
              hold += input[_in++] << bits;
              bits += 8;
              hold += input[_in++] << bits;
              bits += 8;
            }
            here = dcode[hold & dmask];
            dodist:
              for (; ; ) {
                op = here >>> 24;
                hold >>>= op;
                bits -= op;
                op = here >>> 16 & 255;
                if (op & 16) {
                  dist = here & 65535;
                  op &= 15;
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                  }
                  dist += hold & (1 << op) - 1;
                  if (dist > dmax) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD$1;
                    break top;
                  }
                  hold >>>= op;
                  bits -= op;
                  op = _out - beg;
                  if (dist > op) {
                    op = dist - op;
                    if (op > whave) {
                      if (state.sane) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD$1;
                        break top;
                      }
                    }
                    from = 0;
                    from_source = s_window;
                    if (wnext === 0) {
                      from += wsize - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    } else if (wnext < op) {
                      from += wsize + wnext - op;
                      op -= wnext;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = 0;
                        if (wnext < len) {
                          op = wnext;
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                    } else {
                      from += wnext - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    }
                    while (len > 2) {
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      len -= 3;
                    }
                    if (len) {
                      output[_out++] = from_source[from++];
                      if (len > 1) {
                        output[_out++] = from_source[from++];
                      }
                    }
                  } else {
                    from = _out - dist;
                    do {
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      len -= 3;
                    } while (len > 2);
                    if (len) {
                      output[_out++] = output[from++];
                      if (len > 1) {
                        output[_out++] = output[from++];
                      }
                    }
                  }
                } else if ((op & 64) === 0) {
                  here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                  continue dodist;
                } else {
                  strm.msg = "invalid distance code";
                  state.mode = BAD$1;
                  break top;
                }
                break;
              }
          } else if ((op & 64) === 0) {
            here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
            continue dolen;
          } else if (op & 32) {
            state.mode = TYPE$1;
            break top;
          } else {
            strm.msg = "invalid literal/length code";
            state.mode = BAD$1;
            break top;
          }
          break;
        }
    } while (_in < last && _out < end);
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
  strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  return;
};
var MAXBITS = 15;
var ENOUGH_LENS$1 = 852;
var ENOUGH_DISTS$1 = 592;
var CODES$1 = 0;
var LENS$1 = 1;
var DISTS$1 = 2;
var lbase = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]);
var lext = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]);
var dbase = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]);
var dext = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]);
var inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
  const bits = opts.bits;
  let len = 0;
  let sym = 0;
  let min2 = 0, max2 = 0;
  let root = 0;
  let curr = 0;
  let drop = 0;
  let left = 0;
  let used = 0;
  let huff = 0;
  let incr;
  let fill;
  let low;
  let mask;
  let next;
  let base = null;
  let match;
  const count = new Uint16Array(MAXBITS + 1);
  const offs = new Uint16Array(MAXBITS + 1);
  let extra = null;
  let here_bits, here_op, here_val;
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }
  root = bits;
  for (max2 = MAXBITS; max2 >= 1; max2--) {
    if (count[max2] !== 0) {
      break;
    }
  }
  if (root > max2) {
    root = max2;
  }
  if (max2 === 0) {
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    opts.bits = 1;
    return 0;
  }
  for (min2 = 1; min2 < max2; min2++) {
    if (count[min2] !== 0) {
      break;
    }
  }
  if (root < min2) {
    root = min2;
  }
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }
  }
  if (left > 0 && (type === CODES$1 || max2 !== 1)) {
    return -1;
  }
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }
  if (type === CODES$1) {
    base = extra = work;
    match = 20;
  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;
  } else {
    base = dbase;
    extra = dext;
    match = 0;
  }
  huff = 0;
  sym = 0;
  len = min2;
  next = table_index;
  curr = root;
  drop = 0;
  low = -1;
  used = 1 << root;
  mask = used - 1;
  if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
    return 1;
  }
  for (; ; ) {
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    } else {
      here_op = 32 + 64;
      here_val = 0;
    }
    incr = 1 << len - drop;
    fill = 1 << curr;
    min2 = fill;
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
    } while (fill !== 0);
    incr = 1 << len - 1;
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }
    sym++;
    if (--count[len] === 0) {
      if (len === max2) {
        break;
      }
      len = lens[lens_index + work[sym]];
    }
    if (len > root && (huff & mask) !== low) {
      if (drop === 0) {
        drop = root;
      }
      next += min2;
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max2) {
        left -= count[curr + drop];
        if (left <= 0) {
          break;
        }
        curr++;
        left <<= 1;
      }
      used += 1 << curr;
      if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
        return 1;
      }
      low = huff & mask;
      table[low] = root << 24 | curr << 16 | next - table_index | 0;
    }
  }
  if (huff !== 0) {
    table[next + huff] = len - drop << 24 | 64 << 16 | 0;
  }
  opts.bits = root;
  return 0;
};
var inftrees = inflate_table;
var CODES = 0;
var LENS = 1;
var DISTS = 2;
var {
  Z_FINISH: Z_FINISH$1,
  Z_BLOCK,
  Z_TREES,
  Z_OK: Z_OK$1,
  Z_STREAM_END: Z_STREAM_END$1,
  Z_NEED_DICT: Z_NEED_DICT$1,
  Z_STREAM_ERROR: Z_STREAM_ERROR$1,
  Z_DATA_ERROR: Z_DATA_ERROR$1,
  Z_MEM_ERROR: Z_MEM_ERROR$1,
  Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;
var HEAD = 16180;
var FLAGS = 16181;
var TIME = 16182;
var OS = 16183;
var EXLEN = 16184;
var EXTRA = 16185;
var NAME = 16186;
var COMMENT = 16187;
var HCRC = 16188;
var DICTID = 16189;
var DICT = 16190;
var TYPE = 16191;
var TYPEDO = 16192;
var STORED = 16193;
var COPY_ = 16194;
var COPY = 16195;
var TABLE = 16196;
var LENLENS = 16197;
var CODELENS = 16198;
var LEN_ = 16199;
var LEN = 16200;
var LENEXT = 16201;
var DIST = 16202;
var DISTEXT = 16203;
var MATCH = 16204;
var LIT = 16205;
var CHECK = 16206;
var LENGTH = 16207;
var DONE = 16208;
var BAD = 16209;
var MEM = 16210;
var SYNC = 16211;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
var MAX_WBITS = 15;
var DEF_WBITS = MAX_WBITS;
var zswap32 = (q) => {
  return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
};
function InflateState() {
  this.strm = null;
  this.mode = 0;
  this.last = false;
  this.wrap = 0;
  this.havedict = false;
  this.flags = 0;
  this.dmax = 0;
  this.check = 0;
  this.total = 0;
  this.head = null;
  this.wbits = 0;
  this.wsize = 0;
  this.whave = 0;
  this.wnext = 0;
  this.window = null;
  this.hold = 0;
  this.bits = 0;
  this.length = 0;
  this.offset = 0;
  this.extra = 0;
  this.lencode = null;
  this.distcode = null;
  this.lenbits = 0;
  this.distbits = 0;
  this.ncode = 0;
  this.nlen = 0;
  this.ndist = 0;
  this.have = 0;
  this.next = null;
  this.lens = new Uint16Array(320);
  this.work = new Uint16Array(288);
  this.lendyn = null;
  this.distdyn = null;
  this.sane = 0;
  this.back = 0;
  this.was = 0;
}
var inflateStateCheck = (strm) => {
  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};
var inflateResetKeep = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = "";
  if (state.wrap) {
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null;
  state.hold = 0;
  state.bits = 0;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
  state.sane = 1;
  state.back = -1;
  return Z_OK$1;
};
var inflateReset = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
};
var inflateReset2 = (strm, windowBits) => {
  let wrap;
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};
var inflateInit2 = (strm, windowBits) => {
  if (!strm) {
    return Z_STREAM_ERROR$1;
  }
  const state = new InflateState();
  strm.state = state;
  state.strm = strm;
  state.window = null;
  state.mode = HEAD;
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null;
  }
  return ret;
};
var inflateInit = (strm) => {
  return inflateInit2(strm, DEF_WBITS);
};
var virgin = true;
var lenfix;
var distfix;
var fixedtables = (state) => {
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);
    let sym = 0;
    while (sym < 144) {
      state.lens[sym++] = 8;
    }
    while (sym < 256) {
      state.lens[sym++] = 9;
    }
    while (sym < 280) {
      state.lens[sym++] = 7;
    }
    while (sym < 288) {
      state.lens[sym++] = 8;
    }
    inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
    sym = 0;
    while (sym < 32) {
      state.lens[sym++] = 5;
    }
    inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
    virgin = false;
  }
  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};
var updatewindow = (strm, src, end, copy) => {
  let dist;
  const state = strm.state;
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;
    state.window = new Uint8Array(state.wsize);
  }
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }
      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }
  return 0;
};
var inflate$2 = (strm, flush) => {
  let state;
  let input, output;
  let next;
  let put;
  let have, left;
  let hold;
  let bits;
  let _in, _out;
  let copy;
  let from;
  let from_source;
  let here = 0;
  let here_bits, here_op, here_val;
  let last_bits, last_op, last_val;
  let len;
  let ret;
  const hbuf = new Uint8Array(4);
  let opts;
  let n;
  const order = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.mode === TYPE) {
    state.mode = TYPEDO;
  }
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  _in = have;
  _out = left;
  ret = Z_OK$1;
  inf_leave:
    for (; ; ) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 2 && hold === 35615) {
            if (state.wbits === 0) {
              state.wbits = 15;
            }
            state.check = 0;
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            hold = 0;
            bits = 0;
            state.mode = FLAGS;
            break;
          }
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 255) << 8) + (hold >> 8)) % 31) {
            strm.msg = "incorrect header check";
            state.mode = BAD;
            break;
          }
          if ((hold & 15) !== Z_DEFLATED) {
            strm.msg = "unknown compression method";
            state.mode = BAD;
            break;
          }
          hold >>>= 4;
          bits -= 4;
          len = (hold & 15) + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          if (len > 15 || len > state.wbits) {
            strm.msg = "invalid window size";
            state.mode = BAD;
            break;
          }
          state.dmax = 1 << state.wbits;
          state.flags = 0;
          strm.adler = state.check = 1;
          state.mode = hold & 512 ? DICTID : TYPE;
          hold = 0;
          bits = 0;
          break;
        case FLAGS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.flags = hold;
          if ((state.flags & 255) !== Z_DEFLATED) {
            strm.msg = "unknown compression method";
            state.mode = BAD;
            break;
          }
          if (state.flags & 57344) {
            strm.msg = "unknown header flags set";
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = hold >> 8 & 1;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = TIME;
        /* falls through */
        case TIME:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            hbuf[2] = hold >>> 16 & 255;
            hbuf[3] = hold >>> 24 & 255;
            state.check = crc32_1(state.check, hbuf, 4, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = OS;
        /* falls through */
        case OS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.xflags = hold & 255;
            state.head.os = hold >> 8;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = EXLEN;
        /* falls through */
        case EXLEN:
          if (state.flags & 1024) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
          } else if (state.head) {
            state.head.extra = null;
          }
          state.mode = EXTRA;
        /* falls through */
        case EXTRA:
          if (state.flags & 1024) {
            copy = state.length;
            if (copy > have) {
              copy = have;
            }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(
                  input.subarray(
                    next,
                    // extra field is limited to 65536 bytes
                    // - no need for additional size check
                    next + copy
                  ),
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
              }
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) {
              break inf_leave;
            }
          }
          state.length = 0;
          state.mode = NAME;
        /* falls through */
        case NAME:
          if (state.flags & 2048) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
        /* falls through */
        case COMMENT:
          if (state.flags & 4096) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
        /* falls through */
        case HCRC:
          if (state.flags & 512) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 4 && hold !== (state.check & 65535)) {
              strm.msg = "header crc mismatch";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          if (state.head) {
            state.head.hcrc = state.flags >> 9 & 1;
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE;
          break;
        case DICTID:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          strm.adler = state.check = zswap32(hold);
          hold = 0;
          bits = 0;
          state.mode = DICT;
        /* falls through */
        case DICT:
          if (state.havedict === 0) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1;
          state.mode = TYPE;
        /* falls through */
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case TYPEDO:
          if (state.last) {
            hold >>>= bits & 7;
            bits -= bits & 7;
            state.mode = CHECK;
            break;
          }
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.last = hold & 1;
          hold >>>= 1;
          bits -= 1;
          switch (hold & 3) {
            case 0:
              state.mode = STORED;
              break;
            case 1:
              fixedtables(state);
              state.mode = LEN_;
              if (flush === Z_TREES) {
                hold >>>= 2;
                bits -= 2;
                break inf_leave;
              }
              break;
            case 2:
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = "invalid block type";
              state.mode = BAD;
          }
          hold >>>= 2;
          bits -= 2;
          break;
        case STORED:
          hold >>>= bits & 7;
          bits -= bits & 7;
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
            strm.msg = "invalid stored block lengths";
            state.mode = BAD;
            break;
          }
          state.length = hold & 65535;
          hold = 0;
          bits = 0;
          state.mode = COPY_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case COPY_:
          state.mode = COPY;
        /* falls through */
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) {
              copy = have;
            }
            if (copy > left) {
              copy = left;
            }
            if (copy === 0) {
              break inf_leave;
            }
            output.set(input.subarray(next, next + copy), put);
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          state.mode = TYPE;
          break;
        case TABLE:
          while (bits < 14) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.nlen = (hold & 31) + 257;
          hold >>>= 5;
          bits -= 5;
          state.ndist = (hold & 31) + 1;
          hold >>>= 5;
          bits -= 5;
          state.ncode = (hold & 15) + 4;
          hold >>>= 4;
          bits -= 4;
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = "too many length or distance symbols";
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = LENLENS;
        /* falls through */
        case LENLENS:
          while (state.have < state.ncode) {
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.lens[order[state.have++]] = hold & 7;
            hold >>>= 3;
            bits -= 3;
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          state.lencode = state.lendyn;
          state.lenbits = 7;
          opts = { bits: state.lenbits };
          ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid code lengths set";
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = CODELENS;
        /* falls through */
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_val < 16) {
              hold >>>= here_bits;
              bits -= here_bits;
              state.lens[state.have++] = here_val;
            } else {
              if (here_val === 16) {
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                if (state.have === 0) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 3);
                hold >>>= 2;
                bits -= 2;
              } else if (here_val === 17) {
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 3 + (hold & 7);
                hold >>>= 3;
                bits -= 3;
              } else {
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 11 + (hold & 127);
                hold >>>= 7;
                bits -= 7;
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = "invalid bit length repeat";
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }
          if (state.mode === BAD) {
            break;
          }
          if (state.lens[256] === 0) {
            strm.msg = "invalid code -- missing end-of-block";
            state.mode = BAD;
            break;
          }
          state.lenbits = 9;
          opts = { bits: state.lenbits };
          ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid literal/lengths set";
            state.mode = BAD;
            break;
          }
          state.distbits = 6;
          state.distcode = state.distdyn;
          opts = { bits: state.distbits };
          ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          state.distbits = opts.bits;
          if (ret) {
            strm.msg = "invalid distances set";
            state.mode = BAD;
            break;
          }
          state.mode = LEN_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case LEN_:
          state.mode = LEN;
        /* falls through */
        case LEN:
          if (have >= 6 && left >= 258) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            inffast(strm, _out);
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (; ; ) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (here_op && (here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = "invalid literal/length code";
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
        /* falls through */
        case LENEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          state.was = state.length;
          state.mode = DIST;
        /* falls through */
        case DIST:
          for (; ; ) {
            here = state.distcode[hold & (1 << state.distbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = "invalid distance code";
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = here_op & 15;
          state.mode = DISTEXT;
        /* falls through */
        case DISTEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.offset += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          if (state.offset > state.dmax) {
            strm.msg = "invalid distance too far back";
            state.mode = BAD;
            break;
          }
          state.mode = MATCH;
        /* falls through */
        case MATCH:
          if (left === 0) {
            break inf_leave;
          }
          copy = _out - left;
          if (state.offset > copy) {
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            } else {
              from = state.wnext - copy;
            }
            if (copy > state.length) {
              copy = state.length;
            }
            from_source = state.window;
          } else {
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) {
            copy = left;
          }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) {
            state.mode = LEN;
          }
          break;
        case LIT:
          if (left === 0) {
            break inf_leave;
          }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold |= input[next++] << bits;
              bits += 8;
            }
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (state.wrap & 4 && _out) {
              strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
              state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
            }
            _out = left;
            if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = "incorrect data check";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = LENGTH;
        /* falls through */
        case LENGTH:
          if (state.wrap && state.flags) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
              strm.msg = "incorrect length check";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = DONE;
        /* falls through */
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR$1;
        case SYNC:
        /* falls through */
        default:
          return Z_STREAM_ERROR$1;
      }
    }
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap & 4 && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
    state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};
var inflateEnd = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};
var inflateGetHeader = (strm, head) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  if ((state.wrap & 2) === 0) {
    return Z_STREAM_ERROR$1;
  }
  state.head = head;
  head.done = false;
  return Z_OK$1;
};
var inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;
  let state;
  let dictid;
  let ret;
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }
  if (state.mode === DICT) {
    dictid = 1;
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  return Z_OK$1;
};
var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = "pako inflate (from Nodeca project)";
var inflate_1$2 = {
  inflateReset: inflateReset_1,
  inflateReset2: inflateReset2_1,
  inflateResetKeep: inflateResetKeep_1,
  inflateInit: inflateInit_1,
  inflateInit2: inflateInit2_1,
  inflate: inflate_2$1,
  inflateEnd: inflateEnd_1,
  inflateGetHeader: inflateGetHeader_1,
  inflateSetDictionary: inflateSetDictionary_1,
  inflateInfo
};
function GZheader() {
  this.text = 0;
  this.time = 0;
  this.xflags = 0;
  this.os = 0;
  this.extra = null;
  this.extra_len = 0;
  this.name = "";
  this.comment = "";
  this.hcrc = 0;
  this.done = false;
}
var gzheader = GZheader;
var toString = Object.prototype.toString;
var {
  Z_NO_FLUSH,
  Z_FINISH,
  Z_OK,
  Z_STREAM_END,
  Z_NEED_DICT,
  Z_STREAM_ERROR,
  Z_DATA_ERROR,
  Z_MEM_ERROR
} = constants$2;
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, options || {});
  const opt = this.options;
  if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) {
      opt.windowBits = -15;
    }
  }
  if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
    opt.windowBits += 32;
  }
  if (opt.windowBits > 15 && opt.windowBits < 48) {
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new zstream();
  this.strm.avail_out = 0;
  let status = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );
  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }
  this.header = new gzheader();
  inflate_1$2.inflateGetHeader(this.strm, this.header);
  if (opt.dictionary) {
    if (typeof opt.dictionary === "string") {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) {
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}
Inflate$1.prototype.push = function(data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;
  if (this.ended) return false;
  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
  if (toString.call(data) === "[object ArrayBuffer]") {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }
  strm.next_in = 0;
  strm.avail_in = strm.input.length;
  for (; ; ) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = inflate_1$2.inflate(strm, _flush_mode);
    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);
      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        status = Z_NEED_DICT;
      }
    }
    while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }
    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }
    last_avail_out = strm.avail_out;
    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {
        if (this.options.to === "string") {
          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
          this.onData(utf8str);
        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }
    if (status === Z_OK && last_avail_out === 0) continue;
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }
    if (strm.avail_in === 0) break;
  }
  return true;
};
Inflate$1.prototype.onData = function(chunk) {
  this.chunks.push(chunk);
};
Inflate$1.prototype.onEnd = function(status) {
  if (status === Z_OK) {
    if (this.options.to === "string") {
      this.result = this.chunks.join("");
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);
  inflator.push(input);
  if (inflator.err) throw inflator.msg || messages[inflator.err];
  return inflator.result;
}
function inflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return inflate$1(input, options);
}
var Inflate_1$1 = Inflate$1;
var inflate_2 = inflate$1;
var inflateRaw_1$1 = inflateRaw$1;
var ungzip$1 = inflate$1;
var constants = constants$2;
var inflate_1$1 = {
  Inflate: Inflate_1$1,
  inflate: inflate_2,
  inflateRaw: inflateRaw_1$1,
  ungzip: ungzip$1,
  constants
};
var { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
var { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
var inflate_1 = inflate;
var zlib_decompress = function(buf, itemsize) {
  let input_array = new Uint8Array(buf);
  return inflate_1(input_array).buffer;
};
var unshuffle = function(buf, itemsize) {
  let buffer_size = buf.byteLength;
  let unshuffled_view = new Uint8Array(buffer_size);
  let step = Math.floor(buffer_size / itemsize);
  let shuffled_view = new DataView(buf);
  for (var j = 0; j < itemsize; j++) {
    for (var i = 0; i < step; i++) {
      unshuffled_view[j + i * itemsize] = shuffled_view.getUint8(j * step + i);
    }
  }
  return unshuffled_view.buffer;
};
var fletch32 = function(buf, itemsize) {
  _verify_fletcher32(buf);
  return buf.slice(0, -4);
};
function _verify_fletcher32(chunk_buffer) {
  var odd_chunk_buffer = chunk_buffer.byteLength % 2 != 0;
  var data_length = chunk_buffer.byteLength - 4;
  var view = new DataView(chunk_buffer);
  var sum1 = 0;
  var sum2 = 0;
  for (var offset = 0; offset < data_length - 1; offset += 2) {
    let datum = view.getUint16(offset, true);
    sum1 = (sum1 + datum) % 65535;
    sum2 = (sum2 + sum1) % 65535;
  }
  if (odd_chunk_buffer) {
    let datum = view.getUint8(data_length - 1);
    sum1 = (sum1 + datum) % 65535;
    sum2 = (sum2 + sum1) % 65535;
  }
  var [ref_sum1, ref_sum2] = struct.unpack_from(">HH", chunk_buffer, data_length);
  ref_sum1 = ref_sum1 % 65535;
  ref_sum2 = ref_sum2 % 65535;
  if (sum1 != ref_sum1 || sum2 != ref_sum2) {
    throw 'ValueError("fletcher32 checksum invalid")';
  }
  return true;
}
var GZIP_DEFLATE_FILTER = 1;
var SHUFFLE_FILTER = 2;
var FLETCH32_FILTER = 3;
var Filters = /* @__PURE__ */ new Map([
  [GZIP_DEFLATE_FILTER, zlib_decompress],
  [SHUFFLE_FILTER, unshuffle],
  [FLETCH32_FILTER, fletch32]
]);
var AbstractBTree = class {
  //B_LINK_NODE = null;
  //NODE_TYPE = null;
  constructor(fh, offset) {
    this.fh = fh;
    this.offset = offset;
    this.depth = null;
  }
  init() {
    this.all_nodes = /* @__PURE__ */ new Map();
    this._read_root_node();
    this._read_children();
  }
  _read_children() {
    let node_level = this.depth;
    while (node_level > 0) {
      for (var parent_node of this.all_nodes.get(node_level)) {
        for (var child_addr of parent_node.get("addresses")) {
          this._add_node(this._read_node(child_addr, node_level - 1));
        }
      }
      node_level--;
    }
  }
  _read_root_node() {
    let root_node = this._read_node(this.offset, null);
    this._add_node(root_node);
    this.depth = root_node.get("node_level");
  }
  _add_node(node2) {
    let node_level = node2.get("node_level");
    if (this.all_nodes.has(node_level)) {
      this.all_nodes.get(node_level).push(node2);
    } else {
      this.all_nodes.set(node_level, [node2]);
    }
  }
  _read_node(offset, node_level) {
    node = this._read_node_header(offset, node_level);
    node.set("keys", []);
    node.set("addresses", []);
    return node;
  }
  _read_node_header(offset) {
    throw "NotImplementedError: must define _read_node_header in implementation class";
  }
};
var BTreeV1 = class extends AbstractBTree {
  /*
  """
  HDF5 version 1 B-Tree.
  """
  */
  B_LINK_NODE = /* @__PURE__ */ new Map([
    ["signature", "4s"],
    ["node_type", "B"],
    ["node_level", "B"],
    ["entries_used", "H"],
    ["left_sibling", "Q"],
    // 8 byte addressing
    ["right_sibling", "Q"]
    // 8 byte addressing
  ]);
  _read_node_header(offset, node_level) {
    let node2 = _unpack_struct_from(this.B_LINK_NODE, this.fh, offset);
    if (node_level != null) {
      if (node2.get("node_level") != node_level) {
        throw "node level does not match";
      }
    }
    return node2;
  }
};
var BTreeV1Groups = class extends BTreeV1 {
  /*
  """
  HDF5 version 1 B-Tree storing group nodes (type 0).
  """
  */
  NODE_TYPE = 0;
  constructor(fh, offset) {
    super(fh, offset);
    this.init();
  }
  _read_node(offset, node_level) {
    let node2 = this._read_node_header(offset, node_level);
    offset += _structure_size(this.B_LINK_NODE);
    let keys = [];
    let addresses = [];
    let entries_used = node2.get("entries_used");
    for (var i = 0; i < entries_used; i++) {
      let key = struct.unpack_from("<Q", this.fh, offset)[0];
      offset += 8;
      let address = struct.unpack_from("<Q", this.fh, offset)[0];
      offset += 8;
      keys.push(key);
      addresses.push(address);
    }
    keys.push(struct.unpack_from("<Q", this.fh, offset)[0]);
    node2.set("keys", keys);
    node2.set("addresses", addresses);
    return node2;
  }
  symbol_table_addresses() {
    var all_address = [];
    var root_nodes = this.all_nodes.get(0);
    for (var node2 of root_nodes) {
      all_address = all_address.concat(node2.get("addresses"));
    }
    return all_address;
  }
};
var BTreeV1RawDataChunks = class extends BTreeV1 {
  /*
  HDF5 version 1 B-Tree storing raw data chunk nodes (type 1).
  */
  NODE_TYPE = 1;
  constructor(fh, offset, dims) {
    super(fh, offset);
    this.dims = dims;
    this.init();
  }
  _read_node(offset, node_level) {
    let node2 = this._read_node_header(offset, node_level);
    offset += _structure_size(this.B_LINK_NODE);
    var keys = [];
    var addresses = [];
    let entries_used = node2.get("entries_used");
    for (var i = 0; i < entries_used; i++) {
      let [chunk_size, filter_mask] = struct.unpack_from("<II", this.fh, offset);
      offset += 8;
      let fmt = "<" + this.dims.toFixed() + "Q";
      let fmt_size = struct.calcsize(fmt);
      let chunk_offset = struct.unpack_from(fmt, this.fh, offset);
      offset += fmt_size;
      let chunk_address = struct.unpack_from("<Q", this.fh, offset)[0];
      offset += 8;
      keys.push(/* @__PURE__ */ new Map([
        ["chunk_size", chunk_size],
        ["filter_mask", filter_mask],
        ["chunk_offset", chunk_offset]
      ]));
      addresses.push(chunk_address);
    }
    node2.set("keys", keys);
    node2.set("addresses", addresses);
    return node2;
  }
  construct_data_from_chunks(chunk_shape, data_shape, dtype, filter_pipeline) {
    var true_dtype;
    var item_getter, item_big_endian, item_size;
    if (dtype instanceof Array) {
      true_dtype = dtype;
      let dtype_class = dtype[0];
      if (dtype_class == "REFERENCE") {
        let size2 = dtype[1];
        if (size2 != 8) {
          throw "NotImplementedError('Unsupported Reference type')";
        }
        var dtype = "<u8";
        item_getter = "getUint64";
        item_big_endian = false;
        item_size = 8;
      } else if (dtype_class == "VLEN_STRING" || dtype_class == "VLEN_SEQUENCE") {
        item_getter = "getVLENStruct";
        item_big_endian = false;
        item_size = 16;
      } else {
        throw "NotImplementedError('datatype not implemented')";
      }
    } else {
      true_dtype = null;
      [item_getter, item_big_endian, item_size] = dtype_getter(dtype);
    }
    var data_size = data_shape.reduce(function(a, b) {
      return a * b;
    }, 1);
    var chunk_size = chunk_shape.reduce(function(a, b) {
      return a * b;
    }, 1);
    let dims = data_shape.length;
    var current_stride = 1;
    var chunk_strides = chunk_shape.slice().map(function(d2) {
      let s = current_stride;
      current_stride *= d2;
      return s;
    });
    var current_stride = 1;
    var data_strides = data_shape.slice().reverse().map(function(d2) {
      let s = current_stride;
      current_stride *= d2;
      return s;
    }).reverse();
    var data = new Array(data_size);
    let chunk_buffer_size = chunk_size * item_size;
    for (var node2 of this.all_nodes.get(0)) {
      let node_keys = node2.get("keys");
      let node_addresses = node2.get("addresses");
      let nkeys = node_keys.length;
      for (var ik = 0; ik < nkeys; ik++) {
        let node_key = node_keys[ik];
        let addr = node_addresses[ik];
        var chunk_buffer;
        if (filter_pipeline == null) {
          chunk_buffer = this.fh.slice(addr, addr + chunk_buffer_size);
        } else {
          chunk_buffer = this.fh.slice(addr, addr + node_key.get("chunk_size"));
          let filter_mask = node_key.get("filter_mask");
          chunk_buffer = this._filter_chunk(
            chunk_buffer,
            filter_mask,
            filter_pipeline,
            item_size
          );
        }
        var chunk_offset = node_key.get("chunk_offset").slice();
        var apos = chunk_offset.slice();
        var cpos = apos.map(function() {
          return 0;
        });
        var cview = new DataView64(chunk_buffer);
        for (var ci = 0; ci < chunk_size; ci++) {
          for (var d = dims - 1; d >= 0; d--) {
            if (cpos[d] >= chunk_shape[d]) {
              cpos[d] = 0;
              apos[d] = chunk_offset[d];
              if (d > 0) {
                cpos[d - 1] += 1;
                apos[d - 1] += 1;
              }
            } else {
              break;
            }
          }
          let inbounds = apos.slice(0, -1).every(function(p, d2) {
            return p < data_shape[d2];
          });
          if (inbounds) {
            let cb_offset = ci * item_size;
            let datum = cview[item_getter](cb_offset, !item_big_endian, item_size);
            let ai = apos.slice(0, -1).reduce(function(prev, curr, index2) {
              return curr * data_strides[index2] + prev;
            }, 0);
            data[ai] = datum;
          }
          cpos[dims - 1] += 1;
          apos[dims - 1] += 1;
        }
      }
    }
    return data;
  }
  _filter_chunk(chunk_buffer, filter_mask, filter_pipeline, itemsize) {
    let num_filters = filter_pipeline.length;
    let buf = chunk_buffer.slice();
    for (var filter_index = num_filters - 1; filter_index >= 0; filter_index--) {
      if (filter_mask & 1 << filter_index) {
        continue;
      }
      let pipeline_entry = filter_pipeline[filter_index];
      let filter_id = pipeline_entry.get("filter_id");
      let client_data = pipeline_entry.get("client_data");
      if (Filters.has(filter_id)) {
        buf = Filters.get(filter_id)(buf, itemsize, client_data);
      } else {
        throw 'NotImplementedError("Filter with id:' + filter_id.toFixed() + ' not supported")';
      }
    }
    return buf;
  }
};
var BTreeV2 = class extends AbstractBTree {
  /*
  HDF5 version 2 B-Tree.
  */
  // III.A.2. Disk Format: Level 1A2 - Version 2 B-trees
  B_TREE_HEADER = /* @__PURE__ */ new Map([
    ["signature", "4s"],
    ["version", "B"],
    ["node_type", "B"],
    ["node_size", "I"],
    ["record_size", "H"],
    ["depth", "H"],
    ["split_percent", "B"],
    ["merge_percent", "B"],
    ["root_address", "Q"],
    // 8 byte addressing
    ["root_nrecords", "H"],
    ["total_nrecords", "Q"]
    // 8 byte addressing
  ]);
  B_LINK_NODE = /* @__PURE__ */ new Map([
    ["signature", "4s"],
    ["version", "B"],
    ["node_type", "B"]
  ]);
  constructor(fh, offset) {
    super(fh, offset);
    this.init();
  }
  _read_root_node() {
    let h = this._read_tree_header(this.offset);
    this.address_formats = this._calculate_address_formats(h);
    this.header = h;
    this.depth = h.get("depth");
    let address = [h.get("root_address"), h.get("root_nrecords"), h.get("total_nrecords")];
    let root_node = this._read_node(address, this.depth);
    this._add_node(root_node);
  }
  _read_tree_header(offset) {
    let header = _unpack_struct_from(this.B_TREE_HEADER, this.fh, this.offset);
    return header;
  }
  _calculate_address_formats(header) {
    let node_size = header.get("node_size");
    let record_size = header.get("record_size");
    let nrecords_max = 0;
    let ntotalrecords_max = 0;
    let address_formats = /* @__PURE__ */ new Map();
    let max_depth = header.get("depth");
    for (var node_level = 0; node_level <= max_depth; node_level++) {
      let offset_fmt = "";
      let num1_fmt = "";
      let num2_fmt = "";
      let offset_size, num1_size, num2_size;
      if (node_level == 0) {
        offset_size = 0;
        num1_size = 0;
        num2_size = 0;
      } else if (node_level == 1) {
        offset_size = 8;
        offset_fmt = "<Q";
        num1_size = this._required_bytes(nrecords_max);
        num1_fmt = this._int_format(num1_size);
        num2_size = 0;
      } else {
        offset_size = 8;
        offset_fmt = "<Q";
        num1_size = this._required_bytes(nrecords_max);
        num1_fmt = this._int_format(num1_size);
        num2_size = this._required_bytes(ntotalrecords_max);
        num2_fmt = this._int_format(num2_size);
      }
      address_formats.set(node_level, [
        offset_size,
        num1_size,
        num2_size,
        offset_fmt,
        num1_fmt,
        num2_fmt
      ]);
      if (node_level < max_depth) {
        let addr_size = offset_size + num1_size + num2_size;
        nrecords_max = this._nrecords_max(node_size, record_size, addr_size);
        if (ntotalrecords_max > 0) {
          ntotalrecords_max *= nrecords_max;
        } else {
          ntotalrecords_max = nrecords_max;
        }
      }
    }
    return address_formats;
  }
  _nrecords_max(node_size, record_size, addr_size) {
    return Math.floor((node_size - 10 - addr_size) / (record_size + addr_size));
  }
  _required_bytes(integer) {
    return Math.ceil(bitSize(integer) / 8);
  }
  _int_format(bytelength) {
    return ["<B", "<H", "<I", "<Q"][bytelength - 1];
  }
  _read_node(address, node_level) {
    let [offset, nrecords, ntotalrecords] = address;
    let node2 = this._read_node_header(offset, node_level);
    offset += _structure_size(this.B_LINK_NODE);
    let record_size = this.header.get("record_size");
    let keys = [];
    for (let i = 0; i < nrecords; i++) {
      let record = this._parse_record(this.fh, offset, record_size);
      offset += record_size;
      keys.push(record);
    }
    let addresses = [];
    let fmts = this.address_formats.get(node_level);
    if (node_level != 0) {
      let [offset_size, num1_size, num2_size, offset_fmt, num1_fmt, num2_fmt] = fmts;
      for (let j = 0; j <= nrecords; j++) {
        let address_offset = struct.unpack_from(offset_fmt, this.fh, offset)[0];
        offset += offset_size;
        let num1 = struct.unpack_from(num1_fmt, this.fh, offset)[0];
        offset += num1_size;
        let num2 = num1;
        if (num2_size > 0) {
          num2 = struct.unpack_from(num2_fmt, this.fh, offset)[0];
          offset += num2_size;
        }
        addresses.push([address_offset, num1, num2]);
      }
    }
    node2.set("keys", keys);
    node2.set("addresses", addresses);
    return node2;
  }
  _read_node_header(offset, node_level) {
    let node2 = _unpack_struct_from(this.B_LINK_NODE, this.fh, offset);
    if (node_level > 0) {
    } else {
    }
    node2.set("node_level", node_level);
    return node2;
  }
  *iter_records() {
    for (let nodelist of this.all_nodes.values()) {
      for (let node2 of nodelist) {
        for (let key of node2.get("keys")) {
          yield key;
        }
      }
    }
  }
  _parse_record(record) {
    throw "NotImplementedError";
  }
};
var BTreeV2GroupNames = class extends BTreeV2 {
  /*
  HDF5 version 2 B-Tree storing group names (type 5).
  */
  NODE_TYPE = 5;
  _parse_record(buf, offset, size2) {
    let namehash = struct.unpack_from("<I", buf, offset)[0];
    offset += 4;
    return /* @__PURE__ */ new Map([["namehash", namehash], ["heapid", buf.slice(offset, offset + 7)]]);
  }
};
var BTreeV2GroupOrders = class extends BTreeV2 {
  /*
  HDF5 version 2 B-Tree storing group creation orders (type 6).
  */
  NODE_TYPE = 6;
  _parse_record(buf, offset, size2) {
    let creationorder = struct.unpack_from("<Q", buf, offset)[0];
    offset += 8;
    return /* @__PURE__ */ new Map([["creationorder", creationorder], ["heapid", buf.slice(offset, offset + 7)]]);
  }
};
var SuperBlock = class {
  constructor(fh, offset) {
    let version_hint = struct.unpack_from("<B", fh, offset + 8)[0];
    var contents;
    if (version_hint == 0) {
      contents = _unpack_struct_from(SUPERBLOCK_V0, fh, offset);
      this._end_of_sblock = offset + SUPERBLOCK_V0_SIZE;
    } else if (version_hint == 2 || version_hint == 3) {
      contents = _unpack_struct_from(SUPERBLOCK_V2_V3, fh, offset);
      this._end_of_sblock = offset + SUPERBLOCK_V2_V3_SIZE;
    } else {
      throw "unsupported superblock version: " + version_hint.toFixed();
    }
    if (contents.get("format_signature") != FORMAT_SIGNATURE) {
      throw "Incorrect file signature: " + contents.get("format_signature");
    }
    if (contents.get("offset_size") != 8 || contents.get("length_size") != 8) {
      throw "File uses non-64-bit addressing";
    }
    this.version = contents.get("superblock_version");
    this._contents = contents;
    this._root_symbol_table = null;
    this._fh = fh;
  }
  get offset_to_dataobjects() {
    if (this.version == 0) {
      var sym_table = new SymbolTable(this._fh, this._end_of_sblock, true);
      this._root_symbol_table = sym_table;
      return sym_table.group_offset;
    } else if (this.version == 2 || this.version == 3) {
      return this._contents.get("root_group_address");
    } else {
      throw "Not implemented version = " + this.version.toFixed();
    }
  }
};
var Heap = class {
  /*
  """
  HDF5 local heap.
  """
  */
  constructor(fh, offset) {
    let local_heap = _unpack_struct_from(LOCAL_HEAP, fh, offset);
    assert(local_heap.get("signature") == "HEAP");
    assert(local_heap.get("version") == 0);
    let data_offset = local_heap.get("address_of_data_segment");
    let heap_data = fh.slice(data_offset, data_offset + local_heap.get("data_segment_size"));
    local_heap.set("heap_data", heap_data);
    this._contents = local_heap;
    this.data = heap_data;
  }
  get_object_name(offset) {
    let end = new Uint8Array(this.data).indexOf(0, offset);
    let name_size = end - offset;
    let name51 = struct.unpack_from("<" + name_size.toFixed() + "s", this.data, offset)[0];
    return name51;
  }
};
var SymbolTable = class {
  /*
  """
  HDF5 Symbol Table.
  """
  */
  constructor(fh, offset, root = false) {
    var node2;
    if (root) {
      node2 = /* @__PURE__ */ new Map([["symbols", 1]]);
    } else {
      node2 = _unpack_struct_from(SYMBOL_TABLE_NODE, fh, offset);
      if (node2.get("signature") != "SNOD") {
        throw "incorrect node type";
      }
      offset += SYMBOL_TABLE_NODE_SIZE;
    }
    var entries = [];
    var n_symbols = node2.get("symbols");
    for (var i = 0; i < n_symbols; i++) {
      entries.push(_unpack_struct_from(SYMBOL_TABLE_ENTRY, fh, offset));
      offset += SYMBOL_TABLE_ENTRY_SIZE;
    }
    if (root) {
      this.group_offset = entries[0].get("object_header_address");
    }
    this.entries = entries;
    this._contents = node2;
  }
  assign_name(heap) {
    this.entries.forEach(function(entry) {
      let offset = entry.get("link_name_offset");
      let link_name = heap.get_object_name(offset);
      entry.set("link_name", link_name);
    });
  }
  get_links(heap) {
    var links = {};
    this.entries.forEach(function(e) {
      let cache_type = e.get("cache_type");
      let link_name = e.get("link_name");
      if (cache_type == 0 || cache_type == 1) {
        links[link_name] = e.get("object_header_address");
      } else if (cache_type == 2) {
        let scratch = e.get("scratch");
        let buf = new ArrayBuffer(4);
        let bufView = new Uint8Array(buf);
        for (var i = 0; i < 4; i++) {
          bufView[i] = scratch.charCodeAt(i);
        }
        let offset = struct.unpack_from("<I", buf, 0)[0];
        links[link_name] = heap.get_object_name(offset);
      }
    });
    return links;
  }
};
var GlobalHeap = class {
  /*
  HDF5 Global Heap collection.
  */
  constructor(fh, offset) {
    let header = _unpack_struct_from(GLOBAL_HEAP_HEADER, fh, offset);
    offset += GLOBAL_HEAP_HEADER_SIZE;
    let heap_data_size = header.get("collection_size") - GLOBAL_HEAP_HEADER_SIZE;
    let heap_data = fh.slice(offset, offset + heap_data_size);
    this.heap_data = heap_data;
    this._header = header;
    this._objects = null;
  }
  get objects() {
    if (this._objects == null) {
      this._objects = /* @__PURE__ */ new Map();
      var offset = 0;
      while (offset <= this.heap_data.byteLength - GLOBAL_HEAP_OBJECT_SIZE) {
        let info = _unpack_struct_from(
          GLOBAL_HEAP_OBJECT,
          this.heap_data,
          offset
        );
        if (info.get("object_index") == 0) {
          break;
        }
        offset += GLOBAL_HEAP_OBJECT_SIZE;
        let obj_data = this.heap_data.slice(offset, offset + info.get("object_size"));
        this._objects.set(info.get("object_index"), obj_data);
        offset += _padded_size(info.get("object_size"));
      }
    }
    return this._objects;
  }
};
var FractalHeap = class {
  /*
  HDF5 Fractal Heap.
  */
  constructor(fh, offset) {
    this.fh = fh;
    let header = _unpack_struct_from(FRACTAL_HEAP_HEADER, fh, offset);
    offset += _structure_size(FRACTAL_HEAP_HEADER);
    assert(header.get("signature") == "FRHP");
    assert(header.get("version") == 0);
    if (header.get("filter_info_size") > 0) {
      throw "Filter info size not supported on FractalHeap";
    }
    if (header.get("btree_address_huge_objects") == UNDEFINED_ADDRESS) {
      header.set("btree_address_huge_objects", null);
    } else {
      throw "Huge objects not implemented in FractalHeap";
    }
    if (header.get("root_block_address") == UNDEFINED_ADDRESS) {
      header.set("root_block_address", null);
    }
    let nbits = header.get("log2_maximum_heap_size");
    let block_offset_size = this._min_size_nbits(nbits);
    let h = /* @__PURE__ */ new Map([
      ["signature", "4s"],
      ["version", "B"],
      ["heap_header_adddress", "Q"],
      //['block_offset', `${block_offset_size}s`]
      ["block_offset", `${block_offset_size}B`]
      //this._int_format(block_offset_size)]
    ]);
    this.indirect_block_header = new Map(h);
    this.indirect_block_header_size = _structure_size(h);
    if ((header.get("flags") & 2) == 2) {
      h.set("checksum", "I");
    }
    this.direct_block_header = h;
    this.direct_block_header_size = _structure_size(h);
    let maximum_dblock_size = header.get("maximum_direct_block_size");
    this._managed_object_offset_size = this._min_size_nbits(nbits);
    let value = Math.min(maximum_dblock_size, header.get("max_managed_object_size"));
    this._managed_object_length_size = this._min_size_integer(value);
    let start_block_size = header.get("starting_block_size");
    let table_width = header.get("table_width");
    if (!(start_block_size > 0)) {
      throw "Starting block size == 0 not implemented";
    }
    let log2_maximum_dblock_size = Number(Math.floor(Math.log2(maximum_dblock_size)));
    assert(1n << BigInt(log2_maximum_dblock_size) == maximum_dblock_size);
    let log2_start_block_size = Number(Math.floor(Math.log2(start_block_size)));
    assert(1n << BigInt(log2_start_block_size) == start_block_size);
    this._max_direct_nrows = log2_maximum_dblock_size - log2_start_block_size + 2;
    let log2_table_width = Math.floor(Math.log2(table_width));
    assert(1 << log2_table_width == table_width);
    this._indirect_nrows_sub = log2_table_width + log2_start_block_size - 1;
    this.header = header;
    this.nobjects = header.get("managed_object_count") + header.get("huge_object_count") + header.get("tiny_object_count");
    let managed = [];
    let root_address = header.get("root_block_address");
    let nrows = 0;
    if (root_address != null) {
      nrows = header.get("indirect_current_rows_count");
    }
    if (nrows > 0) {
      for (let data of this._iter_indirect_block(fh, root_address, nrows)) {
        managed.push(data);
      }
    } else {
      let data = this._read_direct_block(fh, root_address, start_block_size);
      managed.push(data);
    }
    let data_size = managed.reduce((p, c) => p + c.byteLength, 0);
    let combined = new Uint8Array(data_size);
    let moffset = 0;
    managed.forEach((m) => {
      combined.set(new Uint8Array(m), moffset);
      moffset += m.byteLength;
    });
    this.managed = combined.buffer;
  }
  _read_direct_block(fh, offset, block_size) {
    let data = fh.slice(offset, offset + block_size);
    let header = _unpack_struct_from(this.direct_block_header, data);
    assert(header.get("signature") == "FHDB");
    return data;
  }
  get_data(heapid) {
    let firstbyte = struct.unpack_from("<B", heapid, 0)[0];
    let reserved = firstbyte & 15;
    let idtype = firstbyte >> 4 & 3;
    let version = firstbyte >> 6;
    let data_offset = 1;
    if (idtype == 0) {
      assert(version == 0);
      let nbytes = this._managed_object_offset_size;
      let offset = _unpack_integer(nbytes, heapid, data_offset);
      data_offset += nbytes;
      nbytes = this._managed_object_length_size;
      let size2 = _unpack_integer(nbytes, heapid, data_offset);
      return this.managed.slice(offset, offset + size2);
    } else if (idtype == 1) {
      throw "tiny objectID not supported in FractalHeap";
    } else if (idtype == 2) {
      throw "huge objectID not supported in FractalHeap";
    } else {
      throw "unknown objectID type in FractalHeap";
    }
  }
  _min_size_integer(integer) {
    return this._min_size_nbits(bitSize(integer));
  }
  _min_size_nbits(nbits) {
    return Math.ceil(nbits / 8);
  }
  *_iter_indirect_block(fh, offset, nrows) {
    let header = _unpack_struct_from(this.indirect_block_header, fh, offset);
    offset += this.indirect_block_header_size;
    assert(header.get("signature") == "FHIB");
    let block_offset_bytes = header.get("block_offset");
    let block_offset = block_offset_bytes.reduce((p, c, i) => p + (c << i * 8), 0);
    header.set("block_offset", block_offset);
    let [ndirect, nindirect] = this._indirect_info(nrows);
    let direct_blocks = [];
    for (let i = 0; i < ndirect; i++) {
      let address = struct.unpack_from("<Q", fh, offset)[0];
      offset += 8;
      if (address == UNDEFINED_ADDRESS) {
        break;
      }
      let block_size = this._calc_block_size(i);
      direct_blocks.push([address, block_size]);
    }
    let indirect_blocks = [];
    for (let i = ndirect; i < ndirect + nindirect; i++) {
      let address = struct.unpack_from("<Q", fh, offset)[0];
      offset += 8;
      if (address == UNDEFINED_ADDRESS) {
        break;
      }
      let block_size = this._calc_block_size(i);
      let nrows2 = this._iblock_nrows_from_block_size(block_size);
      indirect_blocks.push([address, nrows2]);
    }
    for (let [address, block_size] of direct_blocks) {
      let obj = this._read_direct_block(fh, address, block_size);
      yield obj;
    }
    for (let [address, nrows2] of indirect_blocks) {
      for (let obj of this._iter_indirect_block(fh, address, nrows2)) {
        yield obj;
      }
    }
  }
  _calc_block_size(iblock) {
    let row = Math.floor(iblock / this.header.get("table_width"));
    return 2 ** Math.max(row - 1, 0) * this.header.get("starting_block_size");
  }
  _iblock_nrows_from_block_size(block_size) {
    let log2_block_size = Math.floor(Math.log2(block_size));
    assert(2 ** log2_block_size == block_size);
    return log2_block_size - this._indirect_nrows_sub;
  }
  _indirect_info(nrows) {
    let table_width = this.header.get("table_width");
    let nobjects = nrows * table_width;
    let ndirect_max = this._max_direct_nrows * table_width;
    let ndirect, nindirect;
    if (nrows <= ndirect_max) {
      ndirect = nobjects;
      nindirect = 0;
    } else {
      ndirect = ndirect_max;
      nindirect = nobjects - ndirect_max;
    }
    return [ndirect, nindirect];
  }
  _int_format(bytelength) {
    return ["B", "H", "I", "Q"][bytelength - 1];
  }
};
var FORMAT_SIGNATURE = struct.unpack_from("8s", new Uint8Array([137, 72, 68, 70, 13, 10, 26, 10]).buffer)[0];
var UNDEFINED_ADDRESS = struct.unpack_from("<Q", new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]).buffer)[0];
var SUPERBLOCK_V0 = /* @__PURE__ */ new Map([
  ["format_signature", "8s"],
  ["superblock_version", "B"],
  ["free_storage_version", "B"],
  ["root_group_version", "B"],
  ["reserved_0", "B"],
  ["shared_header_version", "B"],
  ["offset_size", "B"],
  // assume 8
  ["length_size", "B"],
  // assume 8
  ["reserved_1", "B"],
  ["group_leaf_node_k", "H"],
  ["group_internal_node_k", "H"],
  ["file_consistency_flags", "L"],
  ["base_address_lower", "Q"],
  // assume 8 byte addressing
  ["free_space_address", "Q"],
  // assume 8 byte addressing
  ["end_of_file_address", "Q"],
  ["driver_information_address", "Q"]
  // assume 8 byte addressing
]);
var SUPERBLOCK_V0_SIZE = _structure_size(SUPERBLOCK_V0);
var SUPERBLOCK_V2_V3 = /* @__PURE__ */ new Map([
  ["format_signature", "8s"],
  ["superblock_version", "B"],
  ["offset_size", "B"],
  ["length_size", "B"],
  ["file_consistency_flags", "B"],
  ["base_address", "Q"],
  // assume 8 byte addressing
  ["superblock_extension_address", "Q"],
  // assume 8 byte addressing
  ["end_of_file_address", "Q"],
  // assume 8 byte addressing
  ["root_group_address", "Q"],
  // assume 8 byte addressing
  ["superblock_checksum", "I"]
]);
var SUPERBLOCK_V2_V3_SIZE = _structure_size(SUPERBLOCK_V2_V3);
var SYMBOL_TABLE_ENTRY = /* @__PURE__ */ new Map([
  ["link_name_offset", "Q"],
  // 8 byte address
  ["object_header_address", "Q"],
  ["cache_type", "I"],
  ["reserved", "I"],
  ["scratch", "16s"]
]);
var SYMBOL_TABLE_ENTRY_SIZE = _structure_size(SYMBOL_TABLE_ENTRY);
var SYMBOL_TABLE_NODE = /* @__PURE__ */ new Map([
  ["signature", "4s"],
  ["version", "B"],
  ["reserved_0", "B"],
  ["symbols", "H"]
]);
var SYMBOL_TABLE_NODE_SIZE = _structure_size(SYMBOL_TABLE_NODE);
var LOCAL_HEAP = /* @__PURE__ */ new Map([
  ["signature", "4s"],
  ["version", "B"],
  ["reserved", "3s"],
  ["data_segment_size", "Q"],
  // 8 byte size of lengths
  ["offset_to_free_list", "Q"],
  // 8 bytes size of lengths
  ["address_of_data_segment", "Q"]
  // 8 byte addressing
]);
var GLOBAL_HEAP_HEADER = /* @__PURE__ */ new Map([
  ["signature", "4s"],
  ["version", "B"],
  ["reserved", "3s"],
  ["collection_size", "Q"]
]);
var GLOBAL_HEAP_HEADER_SIZE = _structure_size(GLOBAL_HEAP_HEADER);
var GLOBAL_HEAP_OBJECT = /* @__PURE__ */ new Map([
  ["object_index", "H"],
  ["reference_count", "H"],
  ["reserved", "I"],
  ["object_size", "Q"]
  // 8 byte addressing,
]);
var GLOBAL_HEAP_OBJECT_SIZE = _structure_size(GLOBAL_HEAP_OBJECT);
var FRACTAL_HEAP_HEADER = /* @__PURE__ */ new Map([
  ["signature", "4s"],
  ["version", "B"],
  ["object_index_size", "H"],
  ["filter_info_size", "H"],
  ["flags", "B"],
  ["max_managed_object_size", "I"],
  ["next_huge_object_index", "Q"],
  // 8 byte addressing
  ["btree_address_huge_objects", "Q"],
  // 8 byte addressing
  ["managed_freespace_size", "Q"],
  // 8 byte addressing
  ["freespace_manager_address", "Q"],
  // 8 byte addressing
  ["managed_space_size", "Q"],
  // 8 byte addressing
  ["managed_alloc_size", "Q"],
  // 8 byte addressing
  ["next_directblock_iterator_address", "Q"],
  // 8 byte addressing
  ["managed_object_count", "Q"],
  // 8 byte addressing
  ["huge_objects_total_size", "Q"],
  // 8 byte addressing
  ["huge_object_count", "Q"],
  // 8 byte addressing
  ["tiny_objects_total_size", "Q"],
  // 8 byte addressing
  ["tiny_object_count", "Q"],
  // 8 byte addressing
  ["table_width", "H"],
  ["starting_block_size", "Q"],
  // 8 byte addressing
  ["maximum_direct_block_size", "Q"],
  // 8 byte addressing
  ["log2_maximum_heap_size", "H"],
  ["indirect_starting_rows_count", "H"],
  ["root_block_address", "Q"],
  // 8 byte addressing
  ["indirect_current_rows_count", "H"]
]);
var DataObjects = class {
  /*
  """
  HDF5 DataObjects.
  """
  */
  constructor(fh, offset) {
    let version_hint = struct.unpack_from("<B", fh, offset)[0];
    if (version_hint == 1) {
      var [msgs, msg_data, header] = this._parse_v1_objects(fh, offset);
    } else if (version_hint == "O".charCodeAt(0)) {
      var [msgs, msg_data, header] = this._parse_v2_objects(fh, offset);
    } else {
      throw "InvalidHDF5File('unknown Data Object Header')";
    }
    this.fh = fh;
    this.msgs = msgs;
    this.msg_data = msg_data;
    this.offset = offset;
    this._global_heaps = {};
    this._header = header;
    this._filter_pipeline = null;
    this._chunk_params_set = false;
    this._chunks = null;
    this._chunk_dims = null;
    this._chunk_address = null;
  }
  get dtype() {
    let msg = this.find_msg_type(DATATYPE_MSG_TYPE)[0];
    let msg_offset = msg.get("offset_to_message");
    return new DatatypeMessage(this.fh, msg_offset).dtype;
  }
  get chunks() {
    this._get_chunk_params();
    return this._chunks;
  }
  get shape() {
    let msg = this.find_msg_type(DATASPACE_MSG_TYPE)[0];
    let msg_offset = msg.get("offset_to_message");
    return determine_data_shape(this.fh, msg_offset);
  }
  get filter_pipeline() {
    if (this._filter_pipeline != null) {
      return this._filter_pipeline;
    }
    let filter_msgs = this.find_msg_type(DATA_STORAGE_FILTER_PIPELINE_MSG_TYPE);
    if (!filter_msgs.length) {
      this._filter_pipeline = null;
      return this._filter_pipeline;
    }
    var offset = filter_msgs[0].get("offset_to_message");
    let [version, nfilters] = struct.unpack_from("<BB", this.fh, offset);
    offset += struct.calcsize("<BB");
    var filters = [];
    if (version == 1) {
      let [res0, res1] = struct.unpack_from("<HI", this.fh, offset);
      offset += struct.calcsize("<HI");
      for (var _ = 0; _ < nfilters; _++) {
        let filter_info = _unpack_struct_from(
          FILTER_PIPELINE_DESCR_V1,
          this.fh,
          offset
        );
        offset += FILTER_PIPELINE_DESCR_V1_SIZE;
        let padded_name_length = _padded_size(filter_info.get("name_length"), 8);
        let fmt = "<" + padded_name_length.toFixed() + "s";
        let filter_name = struct.unpack_from(fmt, this.fh, offset)[0];
        filter_info.set("filter_name", filter_name);
        offset += padded_name_length;
        fmt = "<" + filter_info.get("client_data_values").toFixed() + "I";
        let client_data = struct.unpack_from(fmt, this.fh, offset);
        filter_info.set("client_data", client_data);
        offset += 4 * filter_info.get("client_data_values");
        if (filter_info.get("client_data_values") % 2) {
          offset += 4;
        }
        filters.push(filter_info);
      }
    } else if (version == 2) {
      for (let nf = 0; nf < nfilters; nf++) {
        let filter_info = /* @__PURE__ */ new Map();
        let buf = this.fh;
        let filter_id = struct.unpack_from("<H", buf, offset)[0];
        offset += 2;
        filter_info.set("filter_id", filter_id);
        let name_length = 0;
        if (filter_id > 255) {
          name_length = struct.unpack_from("<H", buf, offset)[0];
          offset += 2;
        }
        let flags = struct.unpack_from("<H", buf, offset)[0];
        offset += 2;
        let optional = (flags & 1) > 0;
        filter_info.set("optional", optional);
        let num_client_values = struct.unpack_from("<H", buf, offset)[0];
        offset += 2;
        let name51;
        if (name_length > 0) {
          name51 = struct.unpack_from(`${name_length}s`, buf, offset)[0];
          offset += name_length;
        }
        filter_info.set("name", name51);
        let client_values = struct.unpack_from(`<${num_client_values}i`, buf, offset);
        offset += 4 * num_client_values;
        filter_info.set("client_data", client_values);
        filter_info.set("client_data_values", num_client_values);
        filters.push(filter_info);
      }
    } else {
      throw `version ${version} is not supported`;
    }
    this._filter_pipeline = filters;
    return this._filter_pipeline;
  }
  find_msg_type(msg_type) {
    return this.msgs.filter(function(m) {
      return m.get("type") == msg_type;
    });
  }
  get_attributes() {
    let attrs = {};
    let attr_msgs = this.find_msg_type(ATTRIBUTE_MSG_TYPE);
    for (let msg of attr_msgs) {
      let offset = msg.get("offset_to_message");
      let [name51, value] = this.unpack_attribute(offset);
      attrs[name51] = value;
    }
    return attrs;
  }
  get fillvalue() {
    let msg = this.find_msg_type(FILLVALUE_MSG_TYPE)[0];
    var offset = msg.get("offset_to_message");
    var is_defined;
    let version = struct.unpack_from("<B", this.fh, offset)[0];
    var info, size2, fillvalue;
    if (version == 1 || version == 2) {
      info = _unpack_struct_from(FILLVAL_MSG_V1V2, this.fh, offset);
      offset += FILLVAL_MSG_V1V2_SIZE;
      is_defined = info.get("fillvalue_defined");
    } else if (version == 3) {
      info = _unpack_struct_from(FILLVAL_MSG_V3, this.fh, offset);
      offset += FILLVAL_MSG_V3_SIZE;
      is_defined = info.get("flags") & 32;
    } else {
      throw 'InvalidHDF5File("Unknown fillvalue msg version: "' + String(version);
    }
    if (is_defined) {
      size2 = struct.unpack_from("<I", this.fh, offset)[0];
      offset += 4;
    } else {
      size2 = 0;
    }
    if (size2) {
      let [getter, big_endian, size22] = dtype_getter(this.dtype);
      let payload_view = new DataView64(this.fh);
      fillvalue = payload_view[getter](offset, !big_endian, size22);
    } else {
      fillvalue = 0;
    }
    return fillvalue;
  }
  unpack_attribute(offset) {
    let version = struct.unpack_from("<B", this.fh, offset)[0];
    var attr_map, padding_multiple;
    if (version == 1) {
      attr_map = _unpack_struct_from(
        ATTR_MSG_HEADER_V1,
        this.fh,
        offset
      );
      assert(attr_map.get("version") == 1);
      offset += ATTR_MSG_HEADER_V1_SIZE;
      padding_multiple = 8;
    } else if (version == 3) {
      attr_map = _unpack_struct_from(
        ATTR_MSG_HEADER_V3,
        this.fh,
        offset
      );
      assert(attr_map.get("version") == 3);
      offset += ATTR_MSG_HEADER_V3_SIZE;
      padding_multiple = 1;
    } else {
      throw "unsupported attribute message version: " + version;
    }
    let name_size = attr_map.get("name_size");
    let name51 = struct.unpack_from("<" + name_size.toFixed() + "s", this.fh, offset)[0];
    name51 = name51.replace(/\x00$/, "");
    offset += _padded_size(name_size, padding_multiple);
    var dtype;
    try {
      dtype = new DatatypeMessage(this.fh, offset).dtype;
    } catch (e) {
      console.warn("Attribute " + name51 + " type not implemented, set to null.");
      return [name51, null];
    }
    offset += _padded_size(attr_map.get("datatype_size"), padding_multiple);
    let shape = this.determine_data_shape(this.fh, offset);
    let items = shape.reduce(function(a, b) {
      return a * b;
    }, 1);
    offset += _padded_size(attr_map.get("dataspace_size"), padding_multiple);
    var value = this._attr_value(dtype, this.fh, items, offset);
    if (shape.length == 0) {
      value = value[0];
    } else {
    }
    return [name51, value];
  }
  determine_data_shape(buf, offset) {
    let version = struct.unpack_from("<B", buf, offset)[0];
    var header;
    if (version == 1) {
      header = _unpack_struct_from(DATASPACE_MSG_HEADER_V1, buf, offset);
      assert(header.get("version") == 1);
      offset += DATASPACE_MSG_HEADER_V1_SIZE;
    } else if (version == 2) {
      header = _unpack_struct_from(DATASPACE_MSG_HEADER_V2, buf, offset);
      assert(header.get("version") == 2);
      offset += DATASPACE_MSG_HEADER_V2_SIZE;
    } else {
      throw "unknown dataspace message version";
    }
    let ndims = header.get("dimensionality");
    let dim_sizes = struct.unpack_from("<" + ndims.toFixed() + "Q", buf, offset);
    return dim_sizes;
  }
  _attr_value(dtype, buf, count, offset) {
    var value = new Array(count);
    if (dtype instanceof Array) {
      let dtype_class = dtype[0];
      for (var i = 0; i < count; i++) {
        if (dtype_class == "VLEN_STRING") {
          let character_set = dtype[2];
          var [vlen, vlen_data] = this._vlen_size_and_data(buf, offset);
          const encoding = character_set == 0 ? "ascii" : "utf-8";
          const decoder = new TextDecoder(encoding);
          value[i] = decoder.decode(vlen_data);
          offset += 16;
        } else if (dtype_class == "REFERENCE") {
          var address = struct.unpack_from("<Q", buf, offset);
          value[i] = address;
          offset += 8;
        } else if (dtype_class == "VLEN_SEQUENCE") {
          let base_dtype = dtype[1];
          var [vlen, vlen_data] = this._vlen_size_and_data(buf, offset);
          value[i] = this._attr_value(base_dtype, vlen_data, vlen, 0);
          offset += 16;
        } else {
          throw "NotImplementedError";
        }
      }
    } else {
      let [getter, big_endian, size2] = dtype_getter(dtype);
      let view = new DataView64(buf, 0);
      for (var i = 0; i < count; i++) {
        value[i] = view[getter](offset, !big_endian, size2);
        offset += size2;
      }
    }
    return value;
  }
  _vlen_size_and_data(buf, offset) {
    let vlen_size = struct.unpack_from("<I", buf, offset)[0];
    let gheap_id = _unpack_struct_from(GLOBAL_HEAP_ID, buf, offset + 4);
    let gheap_address = gheap_id.get("collection_address");
    assert(gheap_id.get("collection_address") < Number.MAX_SAFE_INTEGER);
    var gheap;
    if (!(gheap_address in this._global_heaps)) {
      gheap = new GlobalHeap(this.fh, gheap_address);
      this._global_heaps[gheap_address] = gheap;
    }
    gheap = this._global_heaps[gheap_address];
    let vlen_data = gheap.objects.get(gheap_id.get("object_index"));
    return [vlen_size, vlen_data];
  }
  _parse_v1_objects(buf, offset) {
    let header = _unpack_struct_from(OBJECT_HEADER_V1, buf, offset);
    assert(header.get("version") == 1);
    let total_header_messages = header.get("total_header_messages");
    var block_size = header.get("object_header_size");
    var block_offset = offset + _structure_size(OBJECT_HEADER_V1);
    var msg_data = buf.slice(block_offset, block_offset + block_size);
    var object_header_blocks = [[block_offset, block_size]];
    var current_block = 0;
    var local_offset = 0;
    var msgs = new Array(total_header_messages);
    for (var i = 0; i < total_header_messages; i++) {
      if (local_offset >= block_size) {
        [block_offset, block_size] = object_header_blocks[++current_block];
        local_offset = 0;
      }
      let msg = _unpack_struct_from(HEADER_MSG_INFO_V1, buf, block_offset + local_offset);
      let offset_to_message = block_offset + local_offset + HEADER_MSG_INFO_V1_SIZE;
      msg.set("offset_to_message", offset_to_message);
      if (msg.get("type") == OBJECT_CONTINUATION_MSG_TYPE) {
        var [fh_off, size2] = struct.unpack_from("<QQ", buf, offset_to_message);
        object_header_blocks.push([fh_off, size2]);
      }
      local_offset += HEADER_MSG_INFO_V1_SIZE + msg.get("size");
      msgs[i] = msg;
    }
    return [msgs, msg_data, header];
  }
  _parse_v2_objects(buf, offset) {
    var [header, creation_order_size, block_offset] = this._parse_v2_header(buf, offset);
    offset = block_offset;
    var msgs = [];
    var block_size = header.get("size_of_chunk_0");
    var msg_data = buf.slice(offset, offset += block_size);
    var object_header_blocks = [[block_offset, block_size]];
    var current_block = 0;
    var local_offset = 0;
    while (true) {
      if (local_offset >= block_size - HEADER_MSG_INFO_V2_SIZE) {
        let next_block = object_header_blocks[++current_block];
        if (next_block == null) {
          break;
        }
        [block_offset, block_size] = next_block;
        local_offset = 0;
      }
      let msg = _unpack_struct_from(HEADER_MSG_INFO_V2, buf, block_offset + local_offset);
      let offset_to_message = block_offset + local_offset + HEADER_MSG_INFO_V2_SIZE + creation_order_size;
      msg.set("offset_to_message", offset_to_message);
      if (msg.get("type") == OBJECT_CONTINUATION_MSG_TYPE) {
        var [fh_off, size2] = struct.unpack_from("<QQ", buf, offset_to_message);
        object_header_blocks.push([fh_off + 4, size2 - 4]);
      }
      local_offset += HEADER_MSG_INFO_V2_SIZE + msg.get("size") + creation_order_size;
      msgs.push(msg);
    }
    return [msgs, msg_data, header];
  }
  _parse_v2_header(buf, offset) {
    let header = _unpack_struct_from(OBJECT_HEADER_V2, buf, offset);
    var creation_order_size;
    offset += _structure_size(OBJECT_HEADER_V2);
    assert(header.get("version") == 2);
    if (header.get("flags") & 4) {
      creation_order_size = 2;
    } else {
      creation_order_size = 0;
    }
    assert((header.get("flags") & 16) == 0);
    if (header.get("flags") & 32) {
      let times = struct.unpack_from("<4I", buf, offset);
      offset += 16;
      header.set("access_time", times[0]);
      header.set("modification_time", times[1]);
      header.set("change_time", times[2]);
      header.set("birth_time", times[3]);
    }
    let chunk_fmt = ["<B", "<H", "<I", "<Q"][header.get("flags") & 3];
    header.set("size_of_chunk_0", struct.unpack_from(chunk_fmt, buf, offset)[0]);
    offset += struct.calcsize(chunk_fmt);
    return [header, creation_order_size, offset];
  }
  get_links() {
    return Object.fromEntries(this.iter_links());
  }
  *iter_links() {
    for (let msg of this.msgs) {
      if (msg.get("type") == SYMBOL_TABLE_MSG_TYPE) {
        yield* this._iter_links_from_symbol_tables(msg);
      } else if (msg.get("type") == LINK_MSG_TYPE) {
        yield this._get_link_from_link_msg(msg);
      } else if (msg.get("type") == LINK_INFO_MSG_TYPE) {
        yield* this._iter_link_from_link_info_msg(msg);
      }
    }
  }
  *_iter_links_from_symbol_tables(sym_tbl_msg) {
    assert(sym_tbl_msg.get("size") == 16);
    let data = _unpack_struct_from(
      // NOTE: using this.fh instead of this.msg_data - needs to be fixed in py file?
      SYMBOL_TABLE_MSG,
      this.fh,
      sym_tbl_msg.get("offset_to_message")
    );
    yield* this._iter_links_btree_v1(data.get("btree_address"), data.get("heap_address"));
  }
  *_iter_links_btree_v1(btree_address, heap_address) {
    let btree = new BTreeV1Groups(this.fh, btree_address);
    let heap = new Heap(this.fh, heap_address);
    for (let symbol_table_address of btree.symbol_table_addresses()) {
      let table = new SymbolTable(this.fh, symbol_table_address);
      table.assign_name(heap);
      yield* Object.entries(table.get_links(heap));
    }
  }
  _get_link_from_link_msg(link_msg) {
    let offset = link_msg.get("offset_to_message");
    return this._decode_link_msg(this.fh, offset)[1];
    ;
  }
  _decode_link_msg(data, offset) {
    let [version, flags] = struct.unpack_from("<BB", data, offset);
    offset += 2;
    assert(version == 1);
    let size_of_length_of_link_name = 2 ** (flags & 3);
    let link_type_field_present = (flags & 2 ** 3) > 0;
    let link_name_character_set_field_present = (flags & 2 ** 4) > 0;
    let ordered = (flags & 2 ** 2) > 0;
    let link_type;
    if (link_type_field_present) {
      link_type = struct.unpack_from("<B", data, offset)[0];
      offset += 1;
    } else {
      link_type = 0;
    }
    assert([0, 1].includes(link_type));
    let creationorder;
    if (ordered) {
      creationorder = struct.unpack_from("<Q", data, offset)[0];
      offset += 8;
    }
    let link_name_character_set = 0;
    if (link_name_character_set_field_present) {
      link_name_character_set = struct.unpack_from("<B", data, offset)[0];
      offset += 1;
    }
    let encoding = link_name_character_set == 0 ? "ascii" : "utf-8";
    let name_size_fmt = ["<B", "<H", "<I", "<Q"][flags & 3];
    let name_size = struct.unpack_from(name_size_fmt, data, offset)[0];
    offset += size_of_length_of_link_name;
    let name51 = new TextDecoder(encoding).decode(data.slice(offset, offset + name_size));
    offset += name_size;
    let address;
    if (link_type == 0) {
      address = struct.unpack_from("<Q", data, offset)[0];
    } else if (link_type == 1) {
      let length_of_soft_link_value = struct.unpack_from("<H", data, offset)[0];
      offset += 2;
      address = new TextDecoder(encoding).decode(data.slice(offset, offset + length_of_soft_link_value));
    }
    return [creationorder, [name51, address]];
  }
  *_iter_link_from_link_info_msg(info_msg) {
    let offset = info_msg.get("offset_to_message");
    let data = this._decode_link_info_msg(this.fh, offset);
    let heap_address = data.get("heap_address");
    let name_btree_address = data.get("name_btree_address");
    let order_btree_address = data.get("order_btree_address");
    if (name_btree_address != null) {
      yield* this._iter_links_btree_v2(name_btree_address, order_btree_address, heap_address);
    }
  }
  *_iter_links_btree_v2(name_btree_address, order_btree_address, heap_address) {
    let heap = new FractalHeap(this.fh, heap_address);
    let btree;
    const ordered = order_btree_address != null;
    if (ordered) {
      btree = new BTreeV2GroupOrders(this.fh, order_btree_address);
    } else {
      btree = new BTreeV2GroupNames(this.fh, name_btree_address);
    }
    let items = /* @__PURE__ */ new Map();
    for (let record of btree.iter_records()) {
      let data = heap.get_data(record.get("heapid"));
      let [creationorder, item] = this._decode_link_msg(data, 0);
      const key = ordered ? creationorder : item[0];
      items.set(key, item);
    }
    let sorted_keys = Array.from(items.keys()).sort();
    for (let key of sorted_keys) {
      yield items.get(key);
    }
  }
  _decode_link_info_msg(data, offset) {
    let [version, flags] = struct.unpack_from("<BB", data, offset);
    assert(version == 0);
    offset += 2;
    if ((flags & 1) > 0) {
      offset += 8;
    }
    let fmt = (flags & 2) > 0 ? LINK_INFO_MSG2 : LINK_INFO_MSG1;
    let link_info = _unpack_struct_from(fmt, data, offset);
    let output = /* @__PURE__ */ new Map();
    for (let [k, v] of link_info.entries()) {
      output.set(k, v == UNDEFINED_ADDRESS2 ? null : v);
    }
    return output;
  }
  get is_dataset() {
    return this.find_msg_type(DATASPACE_MSG_TYPE).length > 0;
  }
  /**
   * Return the data pointed to in the DataObject
   *
   * @returns {Array}
   * @memberof DataObjects
   */
  get_data() {
    let msg = this.find_msg_type(DATA_STORAGE_MSG_TYPE)[0];
    let msg_offset = msg.get("offset_to_message");
    var [version, dims, layout_class, property_offset] = this._get_data_message_properties(msg_offset);
    if (layout_class == 0) {
      throw "Compact storage of DataObject not implemented";
    } else if (layout_class == 1) {
      return this._get_contiguous_data(property_offset);
    } else if (layout_class == 2) {
      return this._get_chunked_data(msg_offset);
    }
  }
  _get_data_message_properties(msg_offset) {
    let dims, layout_class, property_offset;
    let [version, arg1, arg2] = struct.unpack_from(
      "<BBB",
      this.fh,
      msg_offset
    );
    if (version == 1 || version == 2) {
      dims = arg1;
      layout_class = arg2;
      property_offset = msg_offset;
      property_offset += struct.calcsize("<BBB");
      property_offset += struct.calcsize("<BI");
      assert(layout_class == 1 || layout_class == 2);
    } else if (version == 3 || version == 4) {
      layout_class = arg1;
      property_offset = msg_offset;
      property_offset += struct.calcsize("<BB");
    }
    assert(version >= 1 && version <= 4);
    return [version, dims, layout_class, property_offset];
  }
  _get_contiguous_data(property_offset) {
    let [data_offset] = struct.unpack_from("<Q", this.fh, property_offset);
    if (data_offset == UNDEFINED_ADDRESS2) {
      let size2 = this.shape.reduce(function(a, b) {
        return a * b;
      }, 1);
      return new Array(size2);
    }
    var fullsize = this.shape.reduce(function(a, b) {
      return a * b;
    }, 1);
    if (!(this.dtype instanceof Array)) {
      let dtype = this.dtype;
      if (/[<>=!@\|]?(i|u|f|S)(\d*)/.test(dtype)) {
        let [item_getter, item_is_big_endian, item_size] = dtype_getter(dtype);
        let output = new Array(fullsize);
        let view = new DataView64(this.fh);
        for (var i = 0; i < fullsize; i++) {
          output[i] = view[item_getter](data_offset + i * item_size, !item_is_big_endian, item_size);
        }
        return output;
      } else {
        throw "not Implemented - no proper dtype defined";
      }
    } else {
      let dtype_class = this.dtype[0];
      if (dtype_class == "REFERENCE") {
        let size2 = this.dtype[1];
        if (size2 != 8) {
          throw "NotImplementedError('Unsupported Reference type')";
        }
        let ref_addresses = this.fh.slice(data_offset, data_offset + fullsize);
        return ref_addresses;
      } else if (dtype_class == "VLEN_STRING") {
        let character_set = this.dtype[2];
        const encoding = character_set == 0 ? "ascii" : "utf-8";
        const decoder = new TextDecoder(encoding);
        var value = [];
        for (var i = 0; i < fullsize; i++) {
          const [vlen, vlen_data] = this._vlen_size_and_data(this.fh, data_offset);
          value[i] = decoder.decode(vlen_data);
          data_offset += 16;
        }
        return value;
      } else {
        throw "NotImplementedError('datatype not implemented')";
      }
    }
  }
  _get_chunked_data(offset) {
    this._get_chunk_params();
    if (this._chunk_address == UNDEFINED_ADDRESS2) {
      return [];
    }
    var chunk_btree = new BTreeV1RawDataChunks(
      this.fh,
      this._chunk_address,
      this._chunk_dims
    );
    let data = chunk_btree.construct_data_from_chunks(
      this.chunks,
      this.shape,
      this.dtype,
      this.filter_pipeline
    );
    if (this.dtype instanceof Array && /^VLEN/.test(this.dtype[0])) {
      let dtype_class = this.dtype[0];
      for (var i = 0; i < data.length; i++) {
        let [item_size, gheap_address, object_index] = data[i];
        var gheap;
        if (!(gheap_address in this._global_heaps)) {
          gheap = new GlobalHeap(this.fh, gheap_address);
          this._global_heaps[gheap_address] = gheap;
        } else {
          gheap = this._global_heaps[gheap_address];
        }
        let vlen_data = gheap.objects.get(object_index);
        if (dtype_class == "VLEN_STRING") {
          let character_set = this.dtype[2];
          const encoding = character_set == 0 ? "ascii" : "utf-8";
          const decoder = new TextDecoder(encoding);
          data[i] = decoder.decode(vlen_data);
        }
      }
    }
    return data;
  }
  _get_chunk_params() {
    if (this._chunk_params_set) {
      return;
    }
    this._chunk_params_set = true;
    var msg = this.find_msg_type(DATA_STORAGE_MSG_TYPE)[0];
    var offset = msg.get("offset_to_message");
    var [version, dims, layout_class, property_offset] = this._get_data_message_properties(offset);
    if (layout_class != 2) {
      return;
    }
    var data_offset;
    if (version == 1 || version == 2) {
      var address = struct.unpack_from("<Q", this.fh, property_offset)[0];
      data_offset = property_offset + struct.calcsize("<Q");
    } else if (version == 3) {
      var [dims, address] = struct.unpack_from(
        "<BQ",
        this.fh,
        property_offset
      );
      data_offset = property_offset + struct.calcsize("<BQ");
    }
    assert(version >= 1 && version <= 3);
    var fmt = "<" + (dims - 1).toFixed() + "I";
    var chunk_shape = struct.unpack_from(fmt, this.fh, data_offset);
    this._chunks = chunk_shape;
    this._chunk_dims = dims;
    this._chunk_address = address;
    return;
  }
};
function determine_data_shape(buf, offset) {
  let version = struct.unpack_from("<B", buf, offset)[0];
  var header;
  if (version == 1) {
    header = _unpack_struct_from(DATASPACE_MSG_HEADER_V1, buf, offset);
    assert(header.get("version") == 1);
    offset += DATASPACE_MSG_HEADER_V1_SIZE;
  } else if (version == 2) {
    header = _unpack_struct_from(DATASPACE_MSG_HEADER_V2, buf, offset);
    assert(header.get("version") == 2);
    offset += DATASPACE_MSG_HEADER_V2_SIZE;
  } else {
    throw "InvalidHDF5File('unknown dataspace message version')";
  }
  let ndims = header.get("dimensionality");
  let dim_sizes = struct.unpack_from("<" + (ndims * 2).toFixed() + "I", buf, offset);
  return dim_sizes.filter(function(s, i) {
    return i % 2 == 0;
  });
}
var UNDEFINED_ADDRESS2 = struct.unpack_from("<Q", new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]).buffer);
var GLOBAL_HEAP_ID = /* @__PURE__ */ new Map([
  ["collection_address", "Q"],
  //# 8 byte addressing,
  ["object_index", "I"]
]);
var GLOBAL_HEAP_ID_SIZE = _structure_size(GLOBAL_HEAP_ID);
var ATTR_MSG_HEADER_V1 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["reserved", "B"],
  ["name_size", "H"],
  ["datatype_size", "H"],
  ["dataspace_size", "H"]
]);
var ATTR_MSG_HEADER_V1_SIZE = _structure_size(ATTR_MSG_HEADER_V1);
var ATTR_MSG_HEADER_V3 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["flags", "B"],
  ["name_size", "H"],
  ["datatype_size", "H"],
  ["dataspace_size", "H"],
  ["character_set_encoding", "B"]
]);
var ATTR_MSG_HEADER_V3_SIZE = _structure_size(ATTR_MSG_HEADER_V3);
var OBJECT_HEADER_V1 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["reserved", "B"],
  ["total_header_messages", "H"],
  ["object_reference_count", "I"],
  ["object_header_size", "I"],
  ["padding", "I"]
]);
var OBJECT_HEADER_V2 = /* @__PURE__ */ new Map([
  ["signature", "4s"],
  ["version", "B"],
  ["flags", "B"]
  //# Access time (optional)
  //# Modification time (optional)
  //# Change time (optional)
  //# Birth time (optional)
  //# Maximum # of compact attributes
  //# Maximum # of dense attributes
  //# Size of Chunk #0
]);
var DATASPACE_MSG_HEADER_V1 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["dimensionality", "B"],
  ["flags", "B"],
  ["reserved_0", "B"],
  ["reserved_1", "I"]
]);
var DATASPACE_MSG_HEADER_V1_SIZE = _structure_size(DATASPACE_MSG_HEADER_V1);
var DATASPACE_MSG_HEADER_V2 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["dimensionality", "B"],
  ["flags", "B"],
  ["type", "B"]
]);
var DATASPACE_MSG_HEADER_V2_SIZE = _structure_size(DATASPACE_MSG_HEADER_V2);
var HEADER_MSG_INFO_V1 = /* @__PURE__ */ new Map([
  ["type", "H"],
  ["size", "H"],
  ["flags", "B"],
  ["reserved", "3s"]
]);
var HEADER_MSG_INFO_V1_SIZE = _structure_size(HEADER_MSG_INFO_V1);
var HEADER_MSG_INFO_V2 = /* @__PURE__ */ new Map([
  ["type", "B"],
  ["size", "H"],
  ["flags", "B"]
]);
var HEADER_MSG_INFO_V2_SIZE = _structure_size(HEADER_MSG_INFO_V2);
var SYMBOL_TABLE_MSG = /* @__PURE__ */ new Map([
  ["btree_address", "Q"],
  //# 8 bytes addressing
  ["heap_address", "Q"]
  //# 8 byte addressing
]);
var LINK_INFO_MSG1 = /* @__PURE__ */ new Map([
  ["heap_address", "Q"],
  // 8 byte addressing
  ["name_btree_address", "Q"]
  // 8 bytes addressing
]);
var LINK_INFO_MSG2 = /* @__PURE__ */ new Map([
  ["heap_address", "Q"],
  // 8 byte addressing
  ["name_btree_address", "Q"],
  // 8 bytes addressing
  ["order_btree_address", "Q"]
  // 8 bytes addressing
]);
var FILLVAL_MSG_V1V2 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["space_allocation_time", "B"],
  ["fillvalue_write_time", "B"],
  ["fillvalue_defined", "B"]
]);
var FILLVAL_MSG_V1V2_SIZE = _structure_size(FILLVAL_MSG_V1V2);
var FILLVAL_MSG_V3 = /* @__PURE__ */ new Map([
  ["version", "B"],
  ["flags", "B"]
]);
var FILLVAL_MSG_V3_SIZE = _structure_size(FILLVAL_MSG_V3);
var FILTER_PIPELINE_DESCR_V1 = /* @__PURE__ */ new Map([
  ["filter_id", "H"],
  ["name_length", "H"],
  ["flags", "H"],
  ["client_data_values", "H"]
]);
var FILTER_PIPELINE_DESCR_V1_SIZE = _structure_size(FILTER_PIPELINE_DESCR_V1);
var DATASPACE_MSG_TYPE = 1;
var LINK_INFO_MSG_TYPE = 2;
var DATATYPE_MSG_TYPE = 3;
var FILLVALUE_MSG_TYPE = 5;
var LINK_MSG_TYPE = 6;
var DATA_STORAGE_MSG_TYPE = 8;
var DATA_STORAGE_FILTER_PIPELINE_MSG_TYPE = 11;
var ATTRIBUTE_MSG_TYPE = 12;
var OBJECT_CONTINUATION_MSG_TYPE = 16;
var SYMBOL_TABLE_MSG_TYPE = 17;
var Group = class _Group {
  /*
    An HDF5 Group which may hold attributes, datasets, or other groups.
    Attributes
    ----------
    attrs : dict
        Attributes for this group.
    name : str
        Full path to this group.
    file : File
        File instance where this group resides.
    parent : Group
        Group instance containing this group.
  */
  /**
   *
   *
   * @memberof Group
   * @member {Group|File} parent;
   * @member {File} file;
   * @member {string} name;
   * @member {DataObjects} _dataobjects;
   * @member {Object} _attrs;
   * @member {Array<string>} _keys;
   */
  // parent;
  // file;
  // name;
  // _links;
  // _dataobjects;
  // _attrs;
  // _keys;
  /**
   * 
   * @param {string} name 
   * @param {DataObjects} dataobjects 
   * @param {Group} [parent] 
   * @param {boolean} [getterProxy=false]
   * @returns {Group}
   */
  constructor(name51, dataobjects, parent, getterProxy = false) {
    if (parent == null) {
      this.parent = this;
      this.file = this;
    } else {
      this.parent = parent;
      this.file = parent.file;
    }
    this.name = name51;
    this._links = dataobjects.get_links();
    this._dataobjects = dataobjects;
    this._attrs = null;
    this._keys = null;
    if (getterProxy) {
      return new Proxy(this, groupGetHandler);
    }
  }
  get keys() {
    if (this._keys == null) {
      this._keys = Object.keys(this._links);
    }
    return this._keys.slice();
  }
  get values() {
    return this.keys.map((k) => this.get(k));
  }
  length() {
    return this.keys.length;
  }
  _dereference(ref) {
    if (!ref) {
      throw "cannot deference null reference";
    }
    let obj = this.file._get_object_by_address(ref);
    if (obj == null) {
      throw "reference not found in file";
    }
    return obj;
  }
  get(y) {
    if (typeof y == "number") {
      return this._dereference(y);
    }
    var path = normpath(y);
    if (path == "/") {
      return this.file;
    }
    if (path == ".") {
      return this;
    }
    if (/^\//.test(path)) {
      return this.file.get(path.slice(1));
    }
    if (posix_dirname(path) != "") {
      var [next_obj, additional_obj] = path.split(/\/(.*)/);
    } else {
      var next_obj = path;
      var additional_obj = ".";
    }
    if (!(next_obj in this._links)) {
      throw next_obj + " not found in group";
    }
    var obj_name = normpath(this.name + "/" + next_obj);
    let link_target = this._links[next_obj];
    if (typeof link_target == "string") {
      try {
        return this.get(link_target);
      } catch (error) {
        return null;
      }
    }
    var dataobjs = new DataObjects(this.file._fh, link_target);
    if (dataobjs.is_dataset) {
      if (additional_obj != ".") {
        throw obj_name + " is a dataset, not a group";
      }
      return new Dataset(obj_name, dataobjs, this);
    } else {
      var new_group = new _Group(obj_name, dataobjs, this);
      return new_group.get(additional_obj);
    }
  }
  visit(func) {
    return this.visititems((name51, obj) => func(name51));
  }
  visititems(func) {
    var root_name_length = this.name.length;
    if (!/\/$/.test(this.name)) {
      root_name_length += 1;
    }
    var queue = this.values.slice();
    while (queue) {
      let obj = queue.shift();
      if (queue.length == 1) console.log(obj);
      let name51 = obj.name.slice(root_name_length);
      let ret = func(name51, obj);
      if (ret != null) {
        return ret;
      }
      if (obj instanceof _Group) {
        queue = queue.concat(obj.values);
      }
    }
    return null;
  }
  get attrs() {
    if (this._attrs == null) {
      this._attrs = this._dataobjects.get_attributes();
    }
    return this._attrs;
  }
};
var groupGetHandler = {
  get: function(target, prop, receiver) {
    if (prop in target) {
      return target[prop];
    }
    return target.get(prop);
  }
};
var File = class extends Group {
  /*
  Open a HDF5 file.
  Note in addition to having file specific methods the File object also
  inherit the full interface of **Group**.
  File is also a context manager and therefore supports the with statement.
  Files opened by the class will be closed after the with block, file-like
  object are not closed.
  Parameters
  ----------
  filename : str or file-like
      Name of file (string or unicode) or file like object which has read
      and seek methods which behaved like a Python file object.
  Attributes
  ----------
  filename : str
      Name of the file on disk, None if not available.
  mode : str
      String indicating that the file is open readonly ("r").
  userblock_size : int
      Size of the user block in bytes (currently always 0).
  */
  constructor(fh, filename) {
    var superblock = new SuperBlock(fh, 0);
    var offset = superblock.offset_to_dataobjects;
    var dataobjects = new DataObjects(fh, offset);
    super("/", dataobjects, null);
    this.parent = this;
    this._fh = fh;
    this.filename = filename || "";
    this.file = this;
    this.mode = "r";
    this.userblock_size = 0;
  }
  _get_object_by_address(obj_addr) {
    if (this._dataobjects.offset == obj_addr) {
      return this;
    }
    return this.visititems(
      (y) => {
        y._dataobjects.offset == obj_addr ? y : null;
      }
    );
  }
};
var Dataset = class extends Array {
  /*
  A HDF5 Dataset containing an n-dimensional array and meta-data attributes.
  Attributes
  ----------
  shape : tuple
      Dataset dimensions.
  dtype : dtype
      Dataset's type.
  size : int
      Total number of elements in the dataset.
  chunks : tuple or None
      Chunk shape, or NOne is chunked storage not used.
  compression : str or None
      Compression filter used on dataset.  None if compression is not enabled
      for this dataset.
  compression_opts : dict or None
      Options for the compression filter.
  scaleoffset : dict or None
      Setting for the HDF5 scale-offset filter, or None if scale-offset
      compression is not used for this dataset.
  shuffle : bool
      Whether the shuffle filter is applied for this dataset.
  fletcher32 : bool
      Whether the Fletcher32 checksumming is enabled for this dataset.
  fillvalue : float or None
      Value indicating uninitialized portions of the dataset. None is no fill
      values has been defined.
  dim : int
      Number of dimensions.
  dims : None
      Dimension scales.
  attrs : dict
      Attributes for this dataset.
  name : str
      Full path to this dataset.
  file : File
      File instance where this dataset resides.
  parent : Group
      Group instance containing this dataset.
  */
  /**
   *
   *
   * @memberof Dataset
   * @member {Group|File} parent;
   * @member {File} file;
   * @member {string} name;
   * @member {DataObjects} _dataobjects;
   * @member {Object} _attrs;
   * @member {string} _astype;
   */
  // parent;
  // file;
  // name;
  // _dataobjects;
  // _attrs;
  // _astype;
  constructor(name51, dataobjects, parent) {
    super();
    this.parent = parent;
    this.file = parent.file;
    this.name = name51;
    this._dataobjects = dataobjects;
    this._attrs = null;
    this._astype = null;
  }
  get value() {
    var data = this._dataobjects.get_data();
    if (this._astype == null) {
      return data;
    }
    return data.astype(this._astype);
  }
  get shape() {
    return this._dataobjects.shape;
  }
  get attrs() {
    return this._dataobjects.get_attributes();
  }
  get dtype() {
    return this._dataobjects.dtype;
  }
  get fillvalue() {
    return this._dataobjects.fillvalue;
  }
};
function posix_dirname(p) {
  let sep = "/";
  let i = p.lastIndexOf(sep) + 1;
  let head = p.slice(0, i);
  let all_sep = new RegExp("^" + sep + "+$");
  let end_sep = new RegExp(sep + "$");
  if (head && !all_sep.test(head)) {
    head = head.replace(end_sep, "");
  }
  return head;
}
function normpath(path) {
  return path.replace(/\/(\/)+/g, "/");
}

// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

// node_modules/mathjs/lib/esm/core/config.js
var DEFAULT_CONFIG = {
  // minimum relative difference between two compared values,
  // used by all comparison functions
  relTol: 1e-12,
  // minimum absolute difference between two compared values,
  // used by all comparison functions
  absTol: 1e-15,
  // type of default matrix output. Choose 'matrix' (default) or 'array'
  matrix: "Matrix",
  // type of default number output. Choose 'number' (default) 'BigNumber', 'bigint', or 'Fraction'
  number: "number",
  // type of fallback used for config { number: 'bigint' } when a value cannot be represented
  // in the configured numeric type. Choose 'number' (default) or 'BigNumber'.
  numberFallback: "number",
  // number of significant digits in BigNumbers
  precision: 64,
  // predictable output type of functions. When true, output type depends only
  // on the input types. When false (default), output type can vary depending
  // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
  // predictable is false, and returns `NaN` when true.
  predictable: false,
  // random seed for seeded pseudo random number generation
  // null = randomly seed
  randomSeed: null
};

// node_modules/mathjs/lib/esm/utils/customs.js
function getSafeProperty(object, prop) {
  if (isSafeProperty(object, prop)) {
    return object[prop];
  }
  if (typeof object[prop] === "function" && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }
  throw new Error('No access to property "' + prop + '"');
}
function setSafeProperty(object, prop, value) {
  if (isSafeProperty(object, prop)) {
    object[prop] = value;
    return value;
  }
  throw new Error('No access to property "' + prop + '"');
}
function isSafeProperty(object, prop) {
  if (!isPlainObject(object) && !Array.isArray(object)) {
    return false;
  }
  if (hasOwnProperty(safeNativeProperties, prop)) {
    return true;
  }
  if (prop in Object.prototype) {
    return false;
  }
  if (prop in Function.prototype) {
    return false;
  }
  return true;
}
function isSafeMethod(object, method) {
  if (object === null || object === void 0 || typeof object[method] !== "function") {
    return false;
  }
  if (hasOwnProperty(object, method) && Object.getPrototypeOf && method in Object.getPrototypeOf(object)) {
    return false;
  }
  if (hasOwnProperty(safeNativeMethods, method)) {
    return true;
  }
  if (method in Object.prototype) {
    return false;
  }
  if (method in Function.prototype) {
    return false;
  }
  return true;
}
function isPlainObject(object) {
  return typeof object === "object" && object && object.constructor === Object;
}
var safeNativeProperties = {
  length: true,
  name: true
};
var safeNativeMethods = {
  toString: true,
  valueOf: true,
  toLocaleString: true
};

// node_modules/mathjs/lib/esm/utils/map.js
var ObjectWrappingMap = class {
  constructor(object) {
    this.wrappedObject = object;
    this[Symbol.iterator] = this.entries;
  }
  keys() {
    return Object.keys(this.wrappedObject).filter((key) => this.has(key)).values();
  }
  get(key) {
    return getSafeProperty(this.wrappedObject, key);
  }
  set(key, value) {
    setSafeProperty(this.wrappedObject, key, value);
    return this;
  }
  has(key) {
    return isSafeProperty(this.wrappedObject, key) && key in this.wrappedObject;
  }
  entries() {
    return mapIterator(this.keys(), (key) => [key, this.get(key)]);
  }
  forEach(callback) {
    for (var key of this.keys()) {
      callback(this.get(key), key, this);
    }
  }
  delete(key) {
    if (isSafeProperty(this.wrappedObject, key)) {
      delete this.wrappedObject[key];
    }
  }
  clear() {
    for (var key of this.keys()) {
      this.delete(key);
    }
  }
  get size() {
    return Object.keys(this.wrappedObject).length;
  }
};
function mapIterator(it, callback) {
  return {
    next: () => {
      var n = it.next();
      return n.done ? n : {
        value: callback(n.value),
        done: false
      };
    }
  };
}

// node_modules/mathjs/lib/esm/utils/is.js
function isNumber(x) {
  return typeof x === "number";
}
function isBigNumber(x) {
  if (!x || typeof x !== "object" || typeof x.constructor !== "function") {
    return false;
  }
  if (x.isBigNumber === true && typeof x.constructor.prototype === "object" && x.constructor.prototype.isBigNumber === true) {
    return true;
  }
  if (typeof x.constructor.isDecimal === "function" && x.constructor.isDecimal(x) === true) {
    return true;
  }
  return false;
}
function isBigInt(x) {
  return typeof x === "bigint";
}
function isComplex(x) {
  return x && typeof x === "object" && Object.getPrototypeOf(x).isComplex === true || false;
}
function isFraction(x) {
  return x && typeof x === "object" && Object.getPrototypeOf(x).isFraction === true || false;
}
function isUnit(x) {
  return x && x.constructor.prototype.isUnit === true || false;
}
function isString(x) {
  return typeof x === "string";
}
var isArray = Array.isArray;
function isMatrix(x) {
  return x && x.constructor.prototype.isMatrix === true || false;
}
function isCollection(x) {
  return Array.isArray(x) || isMatrix(x);
}
function isDenseMatrix(x) {
  return x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isSparseMatrix(x) {
  return x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isRange(x) {
  return x && x.constructor.prototype.isRange === true || false;
}
function isIndex(x) {
  return x && x.constructor.prototype.isIndex === true || false;
}
function isBoolean(x) {
  return typeof x === "boolean";
}
function isResultSet(x) {
  return x && x.constructor.prototype.isResultSet === true || false;
}
function isHelp(x) {
  return x && x.constructor.prototype.isHelp === true || false;
}
function isFunction(x) {
  return typeof x === "function";
}
function isDate(x) {
  return x instanceof Date;
}
function isRegExp(x) {
  return x instanceof RegExp;
}
function isObject(x) {
  return !!(x && typeof x === "object" && x.constructor === Object && !isComplex(x) && !isFraction(x));
}
function isMap(object) {
  if (!object) {
    return false;
  }
  return object instanceof Map || object instanceof ObjectWrappingMap || typeof object.set === "function" && typeof object.get === "function" && typeof object.keys === "function" && typeof object.has === "function";
}
function isNull(x) {
  return x === null;
}
function isUndefined(x) {
  return x === void 0;
}
function isAccessorNode(x) {
  return x && x.isAccessorNode === true && x.constructor.prototype.isNode === true || false;
}
function isArrayNode(x) {
  return x && x.isArrayNode === true && x.constructor.prototype.isNode === true || false;
}
function isAssignmentNode(x) {
  return x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isBlockNode(x) {
  return x && x.isBlockNode === true && x.constructor.prototype.isNode === true || false;
}
function isConditionalNode(x) {
  return x && x.isConditionalNode === true && x.constructor.prototype.isNode === true || false;
}
function isConstantNode(x) {
  return x && x.isConstantNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionAssignmentNode(x) {
  return x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionNode(x) {
  return x && x.isFunctionNode === true && x.constructor.prototype.isNode === true || false;
}
function isIndexNode(x) {
  return x && x.isIndexNode === true && x.constructor.prototype.isNode === true || false;
}
function isNode(x) {
  return x && x.isNode === true && x.constructor.prototype.isNode === true || false;
}
function isObjectNode(x) {
  return x && x.isObjectNode === true && x.constructor.prototype.isNode === true || false;
}
function isOperatorNode(x) {
  return x && x.isOperatorNode === true && x.constructor.prototype.isNode === true || false;
}
function isParenthesisNode(x) {
  return x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true || false;
}
function isRangeNode(x) {
  return x && x.isRangeNode === true && x.constructor.prototype.isNode === true || false;
}
function isRelationalNode(x) {
  return x && x.isRelationalNode === true && x.constructor.prototype.isNode === true || false;
}
function isSymbolNode(x) {
  return x && x.isSymbolNode === true && x.constructor.prototype.isNode === true || false;
}
function isChain(x) {
  return x && x.constructor.prototype.isChain === true || false;
}
function typeOf(x) {
  var t = typeof x;
  if (t === "object") {
    if (x === null) return "null";
    if (isBigNumber(x)) return "BigNumber";
    if (x.constructor && x.constructor.name) return x.constructor.name;
    return "Object";
  }
  return t;
}

// node_modules/mathjs/lib/esm/utils/object.js
function clone(x) {
  var type = typeof x;
  if (type === "number" || type === "bigint" || type === "string" || type === "boolean" || x === null || x === void 0) {
    return x;
  }
  if (typeof x.clone === "function") {
    return x.clone();
  }
  if (Array.isArray(x)) {
    return x.map(function(value) {
      return clone(value);
    });
  }
  if (x instanceof Date) return new Date(x.valueOf());
  if (isBigNumber(x)) return x;
  if (isObject(x)) {
    return mapObject(x, clone);
  }
  if (type === "function") {
    return x;
  }
  throw new TypeError("Cannot clone: unknown type of value (value: ".concat(x, ")"));
}
function mapObject(object, callback) {
  var clone4 = {};
  for (var key in object) {
    if (hasOwnProperty(object, key)) {
      clone4[key] = callback(object[key]);
    }
  }
  return clone4;
}
function extend(a, b) {
  for (var prop in b) {
    if (hasOwnProperty(b, prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
}
function deepStrictEqual(a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0, len = a.length; i < len; i++) {
      if (!deepStrictEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof a === "function") {
    return a === b;
  } else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }
    for (prop in a) {
      if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
        return false;
      }
    }
    for (prop in b) {
      if (!(prop in a)) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}
function hasOwnProperty(object, property) {
  return object && Object.hasOwnProperty.call(object, property);
}
function pickShallow(object, properties) {
  var copy = {};
  for (var i = 0; i < properties.length; i++) {
    var key = properties[i];
    var value = object[key];
    if (value !== void 0) {
      copy[key] = value;
    }
  }
  return copy;
}

// node_modules/mathjs/lib/esm/core/function/config.js
var MATRIX_OPTIONS = ["Matrix", "Array"];
var NUMBER_OPTIONS = ["number", "BigNumber", "Fraction"];

// node_modules/mathjs/lib/esm/entry/configReadonly.js
var config = function config2(options) {
  if (options) {
    throw new Error("The global config is readonly. \nPlease create a mathjs instance if you want to change the default configuration. \nExample:\n\n  import { create, all } from 'mathjs';\n  const mathjs = create(all);\n  mathjs.config({ number: 'BigNumber' });\n");
  }
  return Object.freeze(DEFAULT_CONFIG);
};
_extends(config, DEFAULT_CONFIG, {
  MATRIX_OPTIONS,
  NUMBER_OPTIONS
});

// node_modules/mathjs/lib/esm/core/function/typed.js
var import_typed_function = __toESM(require_typed_function(), 1);

// node_modules/mathjs/lib/esm/utils/factory.js
function factory(name51, dependencies52, create, meta) {
  function assertAndCreate(scope) {
    var deps = pickShallow(scope, dependencies52.map(stripOptionalNotation));
    assertDependencies(name51, dependencies52, scope);
    return create(deps);
  }
  assertAndCreate.isFactory = true;
  assertAndCreate.fn = name51;
  assertAndCreate.dependencies = dependencies52.slice().sort();
  if (meta) {
    assertAndCreate.meta = meta;
  }
  return assertAndCreate;
}
function assertDependencies(name51, dependencies52, scope) {
  var allDefined = dependencies52.filter((dependency) => !isOptionalDependency(dependency)).every((dependency) => scope[dependency] !== void 0);
  if (!allDefined) {
    var missingDependencies = dependencies52.filter((dependency) => scope[dependency] === void 0);
    throw new Error('Cannot create function "'.concat(name51, '", ') + "some dependencies are missing: ".concat(missingDependencies.map((d) => '"'.concat(d, '"')).join(", "), "."));
  }
}
function isOptionalDependency(dependency) {
  return dependency && dependency[0] === "?";
}
function stripOptionalNotation(dependency) {
  return dependency && dependency[0] === "?" ? dependency.slice(1) : dependency;
}

// node_modules/mathjs/lib/esm/utils/number.js
function isInteger(value) {
  if (typeof value === "boolean") {
    return true;
  }
  return isFinite(value) ? value === Math.round(value) : false;
}
var sign = Math.sign || function(x) {
  if (x > 0) {
    return 1;
  } else if (x < 0) {
    return -1;
  } else {
    return 0;
  }
};
var log2 = Math.log2 || function log22(x) {
  return Math.log(x) / Math.LN2;
};
var log10 = Math.log10 || function log102(x) {
  return Math.log(x) / Math.LN10;
};
var log1p = Math.log1p || function(x) {
  return Math.log(x + 1);
};
var cbrt = Math.cbrt || function cbrt2(x) {
  if (x === 0) {
    return x;
  }
  var negate = x < 0;
  var result;
  if (negate) {
    x = -x;
  }
  if (isFinite(x)) {
    result = Math.exp(Math.log(x) / 3);
    result = (x / (result * result) + 2 * result) / 3;
  } else {
    result = x;
  }
  return negate ? -result : result;
};
var expm1 = Math.expm1 || function expm12(x) {
  return x >= 2e-4 || x <= -2e-4 ? Math.exp(x) - 1 : x + x * x / 2 + x * x * x / 6;
};
function formatNumberToBase(n, base, size2) {
  var prefixes = {
    2: "0b",
    8: "0o",
    16: "0x"
  };
  var prefix = prefixes[base];
  var suffix = "";
  if (size2) {
    if (size2 < 1) {
      throw new Error("size must be in greater than 0");
    }
    if (!isInteger(size2)) {
      throw new Error("size must be an integer");
    }
    if (n > 2 ** (size2 - 1) - 1 || n < -(2 ** (size2 - 1))) {
      throw new Error("Value must be in range [-2^".concat(size2 - 1, ", 2^").concat(size2 - 1, "-1]"));
    }
    if (!isInteger(n)) {
      throw new Error("Value must be an integer");
    }
    if (n < 0) {
      n = n + 2 ** size2;
    }
    suffix = "i".concat(size2);
  }
  var sign3 = "";
  if (n < 0) {
    n = -n;
    sign3 = "-";
  }
  return "".concat(sign3).concat(prefix).concat(n.toString(base)).concat(suffix);
}
function format(value, options) {
  if (typeof options === "function") {
    return options(value);
  }
  if (value === Infinity) {
    return "Infinity";
  } else if (value === -Infinity) {
    return "-Infinity";
  } else if (isNaN(value)) {
    return "NaN";
  }
  var {
    notation,
    precision,
    wordSize
  } = normalizeFormatOptions(options);
  switch (notation) {
    case "fixed":
      return toFixed(value, precision);
    case "exponential":
      return toExponential(value, precision);
    case "engineering":
      return toEngineering(value, precision);
    case "bin":
      return formatNumberToBase(value, 2, wordSize);
    case "oct":
      return formatNumberToBase(value, 8, wordSize);
    case "hex":
      return formatNumberToBase(value, 16, wordSize);
    case "auto":
      return toPrecision(value, precision, options).replace(/((\.\d*?)(0+))($|e)/, function() {
        var digits2 = arguments[2];
        var e = arguments[4];
        return digits2 !== "." ? digits2 + e : e;
      });
    default:
      throw new Error('Unknown notation "' + notation + '". Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
  }
}
function normalizeFormatOptions(options) {
  var notation = "auto";
  var precision;
  var wordSize;
  if (options !== void 0) {
    if (isNumber(options)) {
      precision = options;
    } else if (isBigNumber(options)) {
      precision = options.toNumber();
    } else if (isObject(options)) {
      if (options.precision !== void 0) {
        precision = _toNumberOrThrow(options.precision, () => {
          throw new Error('Option "precision" must be a number or BigNumber');
        });
      }
      if (options.wordSize !== void 0) {
        wordSize = _toNumberOrThrow(options.wordSize, () => {
          throw new Error('Option "wordSize" must be a number or BigNumber');
        });
      }
      if (options.notation) {
        notation = options.notation;
      }
    } else {
      throw new Error("Unsupported type of options, number, BigNumber, or object expected");
    }
  }
  return {
    notation,
    precision,
    wordSize
  };
}
function splitNumber(value) {
  var match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError("Invalid number " + value);
  }
  var sign3 = match[1];
  var digits2 = match[2];
  var exponent = parseFloat(match[4] || "0");
  var dot2 = digits2.indexOf(".");
  exponent += dot2 !== -1 ? dot2 - 1 : digits2.length - 1;
  var coefficients = digits2.replace(".", "").replace(/^0*/, function(zeros3) {
    exponent -= zeros3.length;
    return "";
  }).replace(/0*$/, "").split("").map(function(d) {
    return parseInt(d);
  });
  if (coefficients.length === 0) {
    coefficients.push(0);
    exponent++;
  }
  return {
    sign: sign3,
    coefficients,
    exponent
  };
}
function toEngineering(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var split = splitNumber(value);
  var rounded = roundDigits(split, precision);
  var e = rounded.exponent;
  var c = rounded.coefficients;
  var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;
  if (isNumber(precision)) {
    while (precision > c.length || e - newExp + 1 > c.length) {
      c.push(0);
    }
  } else {
    var missingZeros = Math.abs(e - newExp) - (c.length - 1);
    for (var i = 0; i < missingZeros; i++) {
      c.push(0);
    }
  }
  var expDiff = Math.abs(e - newExp);
  var decimalIdx = 1;
  while (expDiff > 0) {
    decimalIdx++;
    expDiff--;
  }
  var decimals = c.slice(decimalIdx).join("");
  var decimalVal = isNumber(precision) && decimals.length || decimals.match(/[1-9]/) ? "." + decimals : "";
  var str = c.slice(0, decimalIdx).join("") + decimalVal + "e" + (e >= 0 ? "+" : "") + newExp.toString();
  return rounded.sign + str;
}
function toFixed(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var splitValue = splitNumber(value);
  var rounded = typeof precision === "number" ? roundDigits(splitValue, splitValue.exponent + 1 + precision) : splitValue;
  var c = rounded.coefficients;
  var p = rounded.exponent + 1;
  var pp = p + (precision || 0);
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  }
  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  }
  if (p < c.length) {
    c.splice(p, 0, p === 0 ? "0." : ".");
  }
  return rounded.sign + c.join("");
}
function toExponential(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var split = splitNumber(value);
  var rounded = precision ? roundDigits(split, precision) : split;
  var c = rounded.coefficients;
  var e = rounded.exponent;
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  }
  var first = c.shift();
  return rounded.sign + first + (c.length > 0 ? "." + c.join("") : "") + "e" + (e >= 0 ? "+" : "") + e;
}
function toPrecision(value, precision, options) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var lowerExp = _toNumberOrDefault(options === null || options === void 0 ? void 0 : options.lowerExp, -3);
  var upperExp = _toNumberOrDefault(options === null || options === void 0 ? void 0 : options.upperExp, 5);
  var split = splitNumber(value);
  var rounded = precision ? roundDigits(split, precision) : split;
  if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
    return toExponential(value, precision);
  } else {
    var c = rounded.coefficients;
    var e = rounded.exponent;
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }
    c = c.concat(zeros(e - c.length + 1 + (c.length < precision ? precision - c.length : 0)));
    c = zeros(-e).concat(c);
    var dot2 = e > 0 ? e : 0;
    if (dot2 < c.length - 1) {
      c.splice(dot2 + 1, 0, ".");
    }
    return rounded.sign + c.join("");
  }
}
function roundDigits(split, precision) {
  var rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  };
  var c = rounded.coefficients;
  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }
  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);
    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;
      while (c[i] === 10) {
        c.pop();
        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }
        i--;
        c[i]++;
      }
    }
  }
  return rounded;
}
function zeros(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}
function digits(value) {
  return value.toExponential().replace(/e.*$/, "").replace(/^0\.?0*|\./, "").length;
}
function nearlyEqual(a, b) {
  var relTol = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1e-8;
  var absTol = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
  if (relTol <= 0) {
    throw new Error("Relative tolerance must be greater than 0");
  }
  if (absTol < 0) {
    throw new Error("Absolute tolerance must be at least 0");
  }
  if (isNaN(a) || isNaN(b)) {
    return false;
  }
  if (!isFinite(a) || !isFinite(b)) {
    return a === b;
  }
  if (a === b) {
    return true;
  }
  return Math.abs(a - b) <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), absTol);
}
var tanh = Math.tanh || function(x) {
  var e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
};
function _toNumberOrThrow(value, onError) {
  if (isNumber(value)) {
    return value;
  } else if (isBigNumber(value)) {
    return value.toNumber();
  } else {
    onError();
  }
}
function _toNumberOrDefault(value, defaultValue) {
  if (isNumber(value)) {
    return value;
  } else if (isBigNumber(value)) {
    return value.toNumber();
  } else {
    return defaultValue;
  }
}

// node_modules/mathjs/lib/esm/core/function/typed.js
var _createTyped2 = function _createTyped() {
  _createTyped2 = import_typed_function.default.create;
  return import_typed_function.default;
};
var dependencies = ["?BigNumber", "?Complex", "?DenseMatrix", "?Fraction"];
var createTyped = /* @__PURE__ */ factory("typed", dependencies, function createTyped2(_ref) {
  var {
    BigNumber: BigNumber2,
    Complex: Complex3,
    DenseMatrix: DenseMatrix2,
    Fraction: Fraction3
  } = _ref;
  var typed3 = _createTyped2();
  typed3.clear();
  typed3.addTypes([
    {
      name: "number",
      test: isNumber
    },
    {
      name: "Complex",
      test: isComplex
    },
    {
      name: "BigNumber",
      test: isBigNumber
    },
    {
      name: "bigint",
      test: isBigInt
    },
    {
      name: "Fraction",
      test: isFraction
    },
    {
      name: "Unit",
      test: isUnit
    },
    // The following type matches a valid variable name, i.e., an alphanumeric
    // string starting with an alphabetic character. It is used (at least)
    // in the definition of the derivative() function, as the argument telling
    // what to differentiate over must (currently) be a variable.
    // TODO: deprecate the identifier type (it's not used anymore, see https://github.com/josdejong/mathjs/issues/3253)
    {
      name: "identifier",
      test: (s) => isString && /^(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDD4A-\uDD65\uDD6F-\uDD85\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC4\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDDD0-\uDDED\uDDF0\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDD4A-\uDD65\uDD6F-\uDD85\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC4\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDDD0-\uDDED\uDDF0\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])*$/.test(s)
    },
    {
      name: "string",
      test: isString
    },
    {
      name: "Chain",
      test: isChain
    },
    {
      name: "Array",
      test: isArray
    },
    {
      name: "Matrix",
      test: isMatrix
    },
    {
      name: "DenseMatrix",
      test: isDenseMatrix
    },
    {
      name: "SparseMatrix",
      test: isSparseMatrix
    },
    {
      name: "Range",
      test: isRange
    },
    {
      name: "Index",
      test: isIndex
    },
    {
      name: "boolean",
      test: isBoolean
    },
    {
      name: "ResultSet",
      test: isResultSet
    },
    {
      name: "Help",
      test: isHelp
    },
    {
      name: "function",
      test: isFunction
    },
    {
      name: "Date",
      test: isDate
    },
    {
      name: "RegExp",
      test: isRegExp
    },
    {
      name: "null",
      test: isNull
    },
    {
      name: "undefined",
      test: isUndefined
    },
    {
      name: "AccessorNode",
      test: isAccessorNode
    },
    {
      name: "ArrayNode",
      test: isArrayNode
    },
    {
      name: "AssignmentNode",
      test: isAssignmentNode
    },
    {
      name: "BlockNode",
      test: isBlockNode
    },
    {
      name: "ConditionalNode",
      test: isConditionalNode
    },
    {
      name: "ConstantNode",
      test: isConstantNode
    },
    {
      name: "FunctionNode",
      test: isFunctionNode
    },
    {
      name: "FunctionAssignmentNode",
      test: isFunctionAssignmentNode
    },
    {
      name: "IndexNode",
      test: isIndexNode
    },
    {
      name: "Node",
      test: isNode
    },
    {
      name: "ObjectNode",
      test: isObjectNode
    },
    {
      name: "OperatorNode",
      test: isOperatorNode
    },
    {
      name: "ParenthesisNode",
      test: isParenthesisNode
    },
    {
      name: "RangeNode",
      test: isRangeNode
    },
    {
      name: "RelationalNode",
      test: isRelationalNode
    },
    {
      name: "SymbolNode",
      test: isSymbolNode
    },
    {
      name: "Map",
      test: isMap
    },
    {
      name: "Object",
      test: isObject
    }
    // order 'Object' last, it matches on other classes too
  ]);
  typed3.addConversions([{
    from: "number",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      if (digits(x) > 15) {
        throw new TypeError("Cannot implicitly convert a number with >15 significant digits to BigNumber (value: " + x + "). Use function bignumber(x) to convert to BigNumber.");
      }
      return new BigNumber2(x);
    }
  }, {
    from: "number",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      return new Complex3(x, 0);
    }
  }, {
    from: "BigNumber",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      return new Complex3(x.toNumber(), 0);
    }
  }, {
    from: "bigint",
    to: "number",
    convert: function convert(x) {
      if (x > Number.MAX_SAFE_INTEGER) {
        throw new TypeError("Cannot implicitly convert bigint to number: value exceeds the max safe integer value (value: " + x + ")");
      }
      return Number(x);
    }
  }, {
    from: "bigint",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      return new BigNumber2(x.toString());
    }
  }, {
    from: "bigint",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      return new Fraction3(x);
    }
  }, {
    from: "Fraction",
    to: "BigNumber",
    convert: function convert(x) {
      throw new TypeError("Cannot implicitly convert a Fraction to BigNumber or vice versa. Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.");
    }
  }, {
    from: "Fraction",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      return new Complex3(x.valueOf(), 0);
    }
  }, {
    from: "number",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      var f = new Fraction3(x);
      if (f.valueOf() !== x) {
        throw new TypeError("Cannot implicitly convert a number to a Fraction when there will be a loss of precision (value: " + x + "). Use function fraction(x) to convert to Fraction.");
      }
      return f;
    }
  }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf()
    //  }
    // }, {
    from: "string",
    to: "number",
    convert: function convert(x) {
      var n = Number(x);
      if (isNaN(n)) {
        throw new Error('Cannot convert "' + x + '" to a number');
      }
      return n;
    }
  }, {
    from: "string",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      try {
        return new BigNumber2(x);
      } catch (err2) {
        throw new Error('Cannot convert "' + x + '" to BigNumber');
      }
    }
  }, {
    from: "string",
    to: "bigint",
    convert: function convert(x) {
      try {
        return BigInt(x);
      } catch (err2) {
        throw new Error('Cannot convert "' + x + '" to BigInt');
      }
    }
  }, {
    from: "string",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      try {
        return new Fraction3(x);
      } catch (err2) {
        throw new Error('Cannot convert "' + x + '" to Fraction');
      }
    }
  }, {
    from: "string",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      try {
        return new Complex3(x);
      } catch (err2) {
        throw new Error('Cannot convert "' + x + '" to Complex');
      }
    }
  }, {
    from: "boolean",
    to: "number",
    convert: function convert(x) {
      return +x;
    }
  }, {
    from: "boolean",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      return new BigNumber2(+x);
    }
  }, {
    from: "boolean",
    to: "bigint",
    convert: function convert(x) {
      return BigInt(+x);
    }
  }, {
    from: "boolean",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      return new Fraction3(+x);
    }
  }, {
    from: "boolean",
    to: "string",
    convert: function convert(x) {
      return String(x);
    }
  }, {
    from: "Array",
    to: "Matrix",
    convert: function convert(array) {
      if (!DenseMatrix2) {
        throwNoMatrix();
      }
      return new DenseMatrix2(array);
    }
  }, {
    from: "Matrix",
    to: "Array",
    convert: function convert(matrix2) {
      return matrix2.valueOf();
    }
  }]);
  typed3.onMismatch = (name51, args, signatures) => {
    var usualError = typed3.createError(name51, args, signatures);
    if (["wrongType", "mismatch"].includes(usualError.data.category) && args.length === 1 && isCollection(args[0]) && // check if the function can be unary:
    signatures.some((sig) => !sig.params.includes(","))) {
      var err2 = new TypeError("Function '".concat(name51, "' doesn't apply to matrices. To call it ") + "elementwise on a matrix 'M', try 'map(M, ".concat(name51, ")'."));
      err2.data = usualError.data;
      throw err2;
    }
    throw usualError;
  };
  typed3.onMismatch = (name51, args, signatures) => {
    var usualError = typed3.createError(name51, args, signatures);
    if (["wrongType", "mismatch"].includes(usualError.data.category) && args.length === 1 && isCollection(args[0]) && // check if the function can be unary:
    signatures.some((sig) => !sig.params.includes(","))) {
      var err2 = new TypeError("Function '".concat(name51, "' doesn't apply to matrices. To call it ") + "elementwise on a matrix 'M', try 'map(M, ".concat(name51, ")'."));
      err2.data = usualError.data;
      throw err2;
    }
    throw usualError;
  };
  return typed3;
});
function throwNoBignumber(x) {
  throw new Error("Cannot convert value ".concat(x, " into a BigNumber: no class 'BigNumber' provided"));
}
function throwNoComplex(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Complex number: no class 'Complex' provided"));
}
function throwNoMatrix() {
  throw new Error("Cannot convert array into a Matrix: no class 'DenseMatrix' provided");
}
function throwNoFraction(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Fraction, no class 'Fraction' provided."));
}

// node_modules/decimal.js/decimal.mjs
var EXP_LIMIT = 9e15;
var MAX_DIGITS = 1e9;
var NUMERALS = "0123456789abcdef";
var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
var DEFAULTS = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed at run-time using the `Decimal.config` method.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used when rounding to `precision`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The modulo mode used when calculating the modulus: a mod n.
  // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
  // The remainder (r) is calculated as: r = a - n * q.
  //
  // UP         0 The remainder is positive if the dividend is negative, else is negative.
  // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
  // FLOOR      3 The remainder has the same sign as the divisor (Python %).
  // HALF_EVEN  6 The IEEE 754 remainder function.
  // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
  //
  // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
  // division (9) are commonly used for the modulus operation. The other rounding modes can also
  // be used, but they may not give useful results.
  modulo: 1,
  // 0 to 9
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -EXP_LIMIT
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to EXP_LIMIT
  // The minimum exponent value, beneath which underflow to zero occurs.
  // JavaScript numbers: -324  (5e-324)
  minE: -EXP_LIMIT,
  // -1 to -EXP_LIMIT
  // The maximum exponent value, above which overflow to Infinity occurs.
  // JavaScript numbers: 308  (1.7976931348623157e+308)
  maxE: EXP_LIMIT,
  // 1 to EXP_LIMIT
  // Whether to use cryptographically-secure random number generation, if available.
  crypto: false
  // true/false
};
var inexact;
var quadrant;
var external = true;
var decimalError = "[DecimalError] ";
var invalidArgument = decimalError + "Invalid argument: ";
var precisionLimitExceeded = decimalError + "Precision limit exceeded";
var cryptoUnavailable = decimalError + "crypto unavailable";
var tag = "[object Decimal]";
var mathfloor = Math.floor;
var mathpow = Math.pow;
var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
var BASE = 1e7;
var LOG_BASE = 7;
var MAX_SAFE_INTEGER = 9007199254740991;
var LN10_PRECISION = LN10.length - 1;
var PI_PRECISION = PI.length - 1;
var P = { toStringTag: tag };
P.absoluteValue = P.abs = function() {
  var x = new this.constructor(this);
  if (x.s < 0) x.s = 1;
  return finalise(x);
};
P.ceil = function() {
  return finalise(new this.constructor(this), this.e + 1, 2);
};
P.clampedTo = P.clamp = function(min2, max2) {
  var k, x = this, Ctor = x.constructor;
  min2 = new Ctor(min2);
  max2 = new Ctor(max2);
  if (!min2.s || !max2.s) return new Ctor(NaN);
  if (min2.gt(max2)) throw Error(invalidArgument + max2);
  k = x.cmp(min2);
  return k < 0 ? min2 : x.cmp(max2) > 0 ? max2 : new Ctor(x);
};
P.comparedTo = P.cmp = function(y) {
  var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }
  if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
  if (xs !== ys) return xs;
  if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
  xdL = xd.length;
  ydL = yd.length;
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
P.cosine = P.cos = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.d) return new Ctor(NaN);
  if (!x.d[0]) return new Ctor(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
P.cubeRoot = P.cbrt = function() {
  var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  external = false;
  s = x.s * mathpow(x.s * x, 1 / 3);
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;
    if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
    s = mathpow(n, 1 / 3);
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.decimalPlaces = P.dp = function() {
  var w, d = this.d, n = NaN;
  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
    w = d[w];
    if (w) for (; w % 10 == 0; w /= 10) n--;
    if (n < 0) n = 0;
  }
  return n;
};
P.dividedBy = P.div = function(y) {
  return divide(this, new this.constructor(y));
};
P.dividedToIntegerBy = P.divToInt = function(y) {
  var x = this, Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
P.equals = P.eq = function(y) {
  return this.cmp(y) === 0;
};
P.floor = function() {
  return finalise(new this.constructor(this), this.e + 1, 3);
};
P.greaterThan = P.gt = function(y) {
  return this.cmp(y) > 0;
};
P.greaterThanOrEqualTo = P.gte = function(y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};
P.hyperbolicCosine = P.cosh = function() {
  var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
  if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero()) return one;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = "2.3283064365386962890625e-10";
  }
  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
  var cosh2_x, i = k, d8 = new Ctor(8);
  for (; i--; ) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }
  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.hyperbolicSine = P.sinh = function() {
  var k, pr, rm, len, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true);
    var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(x, pr, rm, true);
};
P.hyperbolicTangent = P.tanh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(x.s);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;
  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
P.inverseCosine = P.acos = function() {
  var x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
  if (k !== -1) {
    return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
  }
  if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = new Ctor(1).minus(x).div(x.plus(1)).sqrt().atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseHyperbolicCosine = P.acosh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).minus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicSine = P.asinh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).plus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicTangent = P.atanh = function() {
  var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();
  if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
  Ctor.precision = wpr = xsd - x.e;
  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
  Ctor.precision = pr + 4;
  Ctor.rounding = 1;
  x = x.ln();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(0.5);
};
P.inverseSine = P.asin = function() {
  var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
  if (x.isZero()) return new Ctor(x);
  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (k !== -1) {
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }
    return new Ctor(NaN);
  }
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseTangent = P.atan = function() {
  var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
  if (!x.isFinite()) {
    if (!x.s) return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }
  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;
  k = Math.min(28, wpr / LOG_BASE + 2 | 0);
  for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));
  external = false;
  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px = x;
  for (; i !== -1; ) {
    px = px.times(x2);
    t = r.minus(px.div(n += 2));
    px = px.times(x2);
    r = t.plus(px.div(n += 2));
    if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--; ) ;
  }
  if (k) r = r.times(2 << k - 1);
  external = true;
  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.isFinite = function() {
  return !!this.d;
};
P.isInteger = P.isInt = function() {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
P.isNaN = function() {
  return !this.s;
};
P.isNegative = P.isNeg = function() {
  return this.s < 0;
};
P.isPositive = P.isPos = function() {
  return this.s > 0;
};
P.isZero = function() {
  return !!this.d && this.d[0] === 0;
};
P.lessThan = P.lt = function(y) {
  return this.cmp(y) < 0;
};
P.lessThanOrEqualTo = P.lte = function(y) {
  return this.cmp(y) < 1;
};
P.logarithm = P.log = function(base) {
  var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;
    if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
    isBase10 = base.eq(10);
  }
  d = arg.d;
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0; ) k /= 10;
      inf = k !== 1;
    }
  }
  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
  r = divide(num, denominator, sd, 1);
  if (checkRoundingDigits(r.d, k = pr, rm)) {
    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);
      if (!inf) {
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }
  external = true;
  return finalise(r, pr, rm);
};
P.minus = P.sub = function(y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s) y = new Ctor(NaN);
    else if (x.d) y.s = -y.s;
    else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (yd[0]) y.s = -y.s;
    else if (xd[0]) y = new Ctor(x);
    else return new Ctor(rm === 3 ? -0 : 0);
    return external ? finalise(y, pr, rm) : y;
  }
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);
  xd = xd.slice();
  k = xe - e;
  if (k) {
    xLTy = k < 0;
    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
    if (k > i) {
      k = i;
      d.length = 1;
    }
    d.reverse();
    for (i = k; i--; ) d.push(0);
    d.reverse();
  } else {
    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy) len = i;
    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }
    k = 0;
  }
  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }
  len = xd.length;
  for (i = yd.length - len; i > 0; --i) xd[len++] = 0;
  for (i = yd.length; i > k; ) {
    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0; ) xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }
    xd[i] -= yd[i];
  }
  for (; xd[--len] === 0; ) xd.pop();
  for (; xd[0] === 0; xd.shift()) --e;
  if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.modulo = P.mod = function(y) {
  var q, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }
  external = false;
  if (Ctor.modulo == 9) {
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }
  q = q.times(y);
  external = true;
  return x.minus(q);
};
P.naturalExponential = P.exp = function() {
  return naturalExponential(this);
};
P.naturalLogarithm = P.ln = function() {
  return naturalLogarithm(this);
};
P.negated = P.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};
P.plus = P.add = function(y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s) y = new Ctor(NaN);
    else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (!yd[0]) y = new Ctor(x);
    return external ? finalise(y, pr, rm) : y;
  }
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);
  xd = xd.slice();
  i = k - e;
  if (i) {
    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;
    if (i > len) {
      i = len;
      d.length = 1;
    }
    d.reverse();
    for (; i--; ) d.push(0);
    d.reverse();
  }
  len = xd.length;
  i = yd.length;
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }
  for (carry = 0; i; ) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }
  if (carry) {
    xd.unshift(carry);
    ++e;
  }
  for (len = xd.length; xd[--len] == 0; ) xd.pop();
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.precision = P.sd = function(z) {
  var k, x = this;
  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k) k = x.e + 1;
  } else {
    k = NaN;
  }
  return k;
};
P.round = function() {
  var x = this, Ctor = x.constructor;
  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
P.sine = P.sin = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = sine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
P.squareRoot = P.sqrt = function() {
  var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }
  external = false;
  s = Math.sqrt(+x);
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);
    if ((n.length + e) % 2 == 0) n += "0";
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.tangent = P.tan = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;
  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
P.times = P.mul = function(y) {
  var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
  y.s *= x.s;
  if (!xd || !xd[0] || !yd || !yd[0]) {
    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
  }
  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;
  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }
  r = [];
  rL = xdL + ydL;
  for (i = rL; i--; ) r.push(0);
  for (i = ydL; --i >= 0; ) {
    carry = 0;
    for (k = xdL + i; k > i; ) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }
    r[k] = (r[k] + carry) % BASE | 0;
  }
  for (; !r[--rL]; ) r.pop();
  if (carry) ++e;
  else r.shift();
  y.d = r;
  y.e = getBase10Exponent(r, e);
  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
P.toBinary = function(sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};
P.toDecimalPlaces = P.toDP = function(dp, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (dp === void 0) return x;
  checkInt32(dp, 0, MAX_DIGITS);
  if (rm === void 0) rm = Ctor.rounding;
  else checkInt32(rm, 0, 8);
  return finalise(x, dp + x.e + 1, rm);
};
P.toExponential = function(dp, rm) {
  var str, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFixed = function(dp, rm) {
  var str, y, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFraction = function(maxD) {
  var d, d0, d1, d2, e, k, n, n0, n13, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
  if (!xd) return new Ctor(x);
  n13 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);
  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
  if (maxD == null) {
    maxD = e > 0 ? d : n13;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n13)) throw Error(invalidArgument + n);
    maxD = n.gt(d) ? e > 0 ? d : n13 : n;
  }
  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;
  for (; ; ) {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1) break;
    d0 = d1;
    d1 = d2;
    d2 = n13;
    n13 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }
  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n13));
  d0 = d0.plus(d2.times(d1));
  n0.s = n13.s = x.s;
  r = divide(n13, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n13, d1] : [n0, d0];
  Ctor.precision = pr;
  external = true;
  return r;
};
P.toHexadecimal = P.toHex = function(sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};
P.toNearest = function(y, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (y == null) {
    if (!x.d) return x;
    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }
    if (!x.d) return y.s ? x : y;
    if (!y.d) {
      if (y.s) y.s = x.s;
      return y;
    }
  }
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);
  } else {
    y.s = x.s;
    x = y;
  }
  return x;
};
P.toNumber = function() {
  return +this;
};
P.toOctal = function(sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};
P.toPower = P.pow = function(y) {
  var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
  if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
  x = new Ctor(x);
  if (x.eq(1)) return x;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (y.eq(1)) return finalise(x, pr, rm);
  e = mathfloor(y.e / LOG_BASE);
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }
  s = x.s;
  if (s < 0) {
    if (e < y.d.length - 1) return new Ctor(NaN);
    if ((y.d[e] & 1) == 0) s = 1;
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
  external = false;
  Ctor.rounding = x.s = 1;
  k = Math.min(12, (e + "").length);
  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
  if (r.d) {
    r = finalise(r, pr + 5, 1);
    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10;
      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }
  r.s = s;
  external = true;
  Ctor.rounding = rm;
  return finalise(r, pr, rm);
};
P.toPrecision = function(sd, rm) {
  var str, x = this, Ctor = x.constructor;
  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toSignificantDigits = P.toSD = function(sd, rm) {
  var x = this, Ctor = x.constructor;
  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  }
  return finalise(new Ctor(x), sd, rm);
};
P.toString = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.truncated = P.trunc = function() {
  return finalise(new this.constructor(this), this.e + 1, 1);
};
P.valueOf = P.toJSON = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() ? "-" + str : str;
};
function digitsToString(d) {
  var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + "";
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
      str += ws;
    }
    w = d[i];
    ws = w + "";
    k = LOG_BASE - ws.length;
    if (k) str += getZeroString(k);
  } else if (w === 0) {
    return "0";
  }
  for (; w % 10 === 0; ) w /= 10;
  return str + w;
}
function checkInt32(i, min2, max2) {
  if (i !== ~~i || i < min2 || i > max2) {
    throw Error(invalidArgument + i);
  }
}
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd;
  for (k = d[0]; k >= 10; k /= 10) --i;
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;
  if (repeating == null) {
    if (i < 3) {
      if (i == 0) rd = rd / 100 | 0;
      else if (i == 1) rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0) rd = rd / 1e3 | 0;
      else if (i == 1) rd = rd / 100 | 0;
      else if (i == 2) rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
    }
  }
  return r;
}
function convertBase(str, baseIn, baseOut) {
  var j, arr = [0], arrL, i = 0, strL = str.length;
  for (; i < strL; ) {
    for (arrL = arr.length; arrL--; ) arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0) arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }
  return arr.reverse();
}
function cosine(Ctor, x) {
  var k, len, y;
  if (x.isZero()) return x;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = "2.3283064365386962890625e-10";
  }
  Ctor.precision += k;
  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
  for (var i = k; i--; ) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }
  Ctor.precision -= k;
  return x;
}
var divide = /* @__PURE__ */ function() {
  function multiplyInteger(x, k, base) {
    var temp, carry = 0, i = x.length;
    for (x = x.slice(); i--; ) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }
    if (carry) x.unshift(carry);
    return x;
  }
  function compare(a, b, aL, bL) {
    var i, r;
    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }
    return r;
  }
  function subtract2(a, b, aL, base) {
    var i = 0;
    for (; aL--; ) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }
    for (; !a[0] && a.length > 1; ) a.shift();
  }
  return function(x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign3 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(
        // Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : (
          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign3 * 0 : sign3 / 0
        )
      );
    }
    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }
    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign3);
    qd = q.d = [];
    for (i = 0; yd[i] == (xd[i] || 0); i++) ;
    if (yd[i] > (xd[i] || 0)) e--;
    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }
    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {
      sd = sd / logBase + 2 | 0;
      i = 0;
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }
        more = k || i < xL;
      } else {
        k = base / (yd[0] + 1) | 0;
        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }
        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; ) rem[remL++] = 0;
        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];
        if (yd[1] >= base / 2) ++yd0;
        do {
          k = 0;
          cmp = compare(yd, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
            k = rem0 / yd0 | 0;
            if (k > 1) {
              if (k >= base) k = base - 1;
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;
              cmp = compare(prod, rem, prodL, remL);
              if (cmp == 1) {
                k--;
                subtract2(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }
            prodL = prod.length;
            if (prodL < remL) prod.unshift(0);
            subtract2(rem, prod, remL, base);
            if (cmp == -1) {
              remL = rem.length;
              cmp = compare(yd, rem, yL, remL);
              if (cmp < 1) {
                k++;
                subtract2(rem, yL < remL ? yz : yd, remL, base);
              }
            }
            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }
          qd[i++] = k;
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);
        more = rem[0] !== void 0;
      }
      if (!qd[0]) qd.shift();
    }
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {
      for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
      q.e = i + e * logBase - 1;
      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }
    return q;
  };
}();
function finalise(x, sd, rm, isTruncated) {
  var digits2, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
  out: if (sd != null) {
    xd = x.d;
    if (!xd) return x;
    for (digits2 = 1, k = xd[0]; k >= 10; k /= 10) digits2++;
    i = sd - digits2;
    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0];
      rd = w / mathpow(10, digits2 - j - 1) % 10 | 0;
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;
      if (xdi >= k) {
        if (isTruncated) {
          for (; k++ <= xdi; ) xd.push(0);
          w = rd = 0;
          digits2 = 1;
          i %= LOG_BASE;
          j = i - LOG_BASE + 1;
        } else {
          break out;
        }
      } else {
        w = k = xd[xdi];
        for (digits2 = 1; k >= 10; k /= 10) digits2++;
        i %= LOG_BASE;
        j = i - LOG_BASE + digits2;
        rd = j < 0 ? 0 : w / mathpow(10, digits2 - j - 1) % 10 | 0;
      }
    }
    isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits2 - j - 1));
    roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
    (i > 0 ? j > 0 ? w / mathpow(10, digits2 - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
    if (sd < 1 || !xd[0]) {
      xd.length = 0;
      if (roundUp) {
        sd -= x.e + 1;
        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = -sd || 0;
      } else {
        xd[0] = x.e = 0;
      }
      return x;
    }
    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i);
      xd[xdi] = j > 0 ? (w / mathpow(10, digits2 - j) % mathpow(10, j) | 0) * k : 0;
    }
    if (roundUp) {
      for (; ; ) {
        if (xdi == 0) {
          for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
          j = xd[0] += k;
          for (k = 1; j >= 10; j /= 10) k++;
          if (i != k) {
            x.e++;
            if (xd[0] == BASE) xd[0] = 1;
          }
          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    }
    for (i = xd.length; xd[--i] === 0; ) xd.pop();
  }
  if (external) {
    if (x.e > Ctor.maxE) {
      x.d = null;
      x.e = NaN;
    } else if (x.e < Ctor.minE) {
      x.e = 0;
      x.d = [0];
    }
  }
  return x;
}
function finiteToString(x, isExp, sd) {
  if (!x.isFinite()) return nonFiniteToString(x);
  var k, e = x.e, str = digitsToString(x.d), len = str.length;
  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + "." + str.slice(1);
    }
    str = str + (x.e < 0 ? "e" : "e+") + x.e;
  } else if (e < 0) {
    str = "0." + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0) str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
  } else {
    if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len) str += ".";
      str += getZeroString(k);
    }
  }
  return str;
}
function getBase10Exponent(digits2, e) {
  var w = digits2[0];
  for (e *= LOG_BASE; w >= 10; w /= 10) e++;
  return e;
}
function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {
    external = true;
    if (pr) Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}
function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}
function getPrecision(digits2) {
  var w = digits2.length - 1, len = w * LOG_BASE + 1;
  w = digits2[w];
  if (w) {
    for (; w % 10 == 0; w /= 10) len--;
    for (w = digits2[0]; w >= 10; w /= 10) len++;
  }
  return len;
}
function getZeroString(k) {
  var zs = "";
  for (; k--; ) zs += "0";
  return zs;
}
function intPow(Ctor, x, n, pr) {
  var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
  external = false;
  for (; ; ) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k)) isTruncated = true;
    }
    n = mathfloor(n / 2);
    if (n === 0) {
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0) ++r.d[n];
      break;
    }
    x = x.times(x);
    truncate(x.d, k);
  }
  external = true;
  return r;
}
function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}
function maxOrMin(Ctor, args, n) {
  var k, y, x = new Ctor(args[0]), i = 0;
  for (; ++i < args.length; ) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    }
    k = x.cmp(y);
    if (k === n || k === 0 && x.s === n) {
      x = y;
    }
  }
  return x;
}
function naturalExponential(x, sd) {
  var denominator, guard, j, pow2, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (!x.d || !x.d[0] || x.e > 17) {
    return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  t = new Ctor(0.03125);
  while (x.e > -2) {
    x = x.times(t);
    k += 5;
  }
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow2 = sum2 = new Ctor(1);
  Ctor.precision = wpr;
  for (; ; ) {
    pow2 = finalise(pow2.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum2.plus(divide(pow2, denominator, wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      j = k;
      while (j--) sum2 = finalise(sum2.times(sum2), wpr, 1);
      if (sd == null) {
        if (rep < 3 && checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow2 = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
  }
}
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);
  if (Math.abs(e = x.e) < 15e14) {
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }
    e = x.e;
    if (c0 > 1) {
      x = new Ctor("0." + c);
      e++;
    } else {
      x = new Ctor(c0 + "." + c.slice(1));
    }
  } else {
    t = getLn10(Ctor, wpr + 2, pr).times(e + "");
    x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;
    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }
  x1 = x;
  sum2 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;
  for (; ; ) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum2.plus(divide(numerator, new Ctor(denominator), wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      sum2 = sum2.times(2);
      if (e !== 0) sum2 = sum2.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
      sum2 = divide(sum2, new Ctor(n), wpr, 1);
      if (sd == null) {
        if (checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
    denominator += 2;
  }
}
function nonFiniteToString(x) {
  return String(x.s * x.s / 0);
}
function parseDecimal(x, str) {
  var e, i, len;
  if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
  if ((i = str.search(/e/i)) > 0) {
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {
    e = str.length;
  }
  for (i = 0; str.charCodeAt(i) === 48; i++) ;
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len) ;
  str = str.slice(i, len);
  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];
    i = (e + 1) % LOG_BASE;
    if (e < 0) i += LOG_BASE;
    if (i < len) {
      if (i) x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len; ) x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }
    for (; i--; ) str += "0";
    x.d.push(+str);
    if (external) {
      if (x.e > x.constructor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < x.constructor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
  } else {
    x.e = 0;
    x.d = [0];
  }
  return x;
}
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
  if (str.indexOf("_") > -1) {
    str = str.replace(/(\d)_(?=\d)/g, "$1");
    if (isDecimal.test(str)) return parseDecimal(x, str);
  } else if (str === "Infinity" || str === "NaN") {
    if (!+str) x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }
  if (isHex.test(str)) {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str)) {
    base = 2;
  } else if (isOctal.test(str)) {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }
  i = str.search(/p/i);
  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }
  i = str.indexOf(".");
  isFloat = i >= 0;
  Ctor = x.constructor;
  if (isFloat) {
    str = str.replace(".", "");
    len = str.length;
    i = len - i;
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }
  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;
  for (i = xe; xd[i] === 0; --i) xd.pop();
  if (i < 0) return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;
  if (isFloat) x = divide(x, divisor, len * 4);
  if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;
  return x;
}
function sine(Ctor, x) {
  var k, len = x.d.length;
  if (len < 3) {
    return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
  }
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;
  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x);
  var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
  for (; k--; ) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }
  return x;
}
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
  external = false;
  x2 = x.times(x);
  u = new Ctor(y);
  for (; ; ) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);
    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--; ) ;
      if (j == -1) break;
    }
    j = u;
    u = y;
    y = t;
    t = j;
    i++;
  }
  external = true;
  t.d.length = k + 1;
  return t;
}
function tinyPow(b, e) {
  var n = b;
  while (--e) n *= b;
  return n;
}
function toLessThanHalfPi(Ctor, x) {
  var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
  x = x.abs();
  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }
  t = x.divToInt(pi);
  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
      return x;
    }
    quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
  }
  return x.minus(pi).abs();
}
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }
  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf(".");
    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }
    if (i >= 0) {
      str = str.replace(".", "");
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }
    xd = convertBase(str, 10, base);
    e = len = xd.length;
    for (; xd[--len] == 0; ) xd.pop();
    if (!xd[0]) {
      str = isExp ? "0p+0" : "0";
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;
      roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
      xd.length = sd;
      if (roundUp) {
        for (; ++xd[--sd] > base - 1; ) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }
      for (len = xd.length; !xd[len - 1]; --len) ;
      for (i = 0, str = ""; i < len; i++) str += NUMERALS.charAt(xd[i]);
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++) str += "0";
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len) ;
            for (i = 1, str = "1."; i < len; i++) str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + "." + str.slice(1);
          }
        }
        str = str + (e < 0 ? "p" : "p+") + e;
      } else if (e < 0) {
        for (; ++e; ) str = "0" + str;
        str = "0." + str;
      } else {
        if (++e > len) for (e -= len; e--; ) str += "0";
        else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
      }
    }
    str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
  }
  return x.s < 0 ? "-" + str : str;
}
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}
function abs(x) {
  return new this(x).abs();
}
function acos(x) {
  return new this(x).acos();
}
function acosh(x) {
  return new this(x).acosh();
}
function add(x, y) {
  return new this(x).plus(y);
}
function asin(x) {
  return new this(x).asin();
}
function asinh(x) {
  return new this(x).asinh();
}
function atan(x) {
  return new this(x).atan();
}
function atanh(x) {
  return new this(x).atanh();
}
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
  if (!y.s || !x.s) {
    r = new this(NaN);
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s;
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s;
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s;
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }
  return r;
}
function cbrt3(x) {
  return new this(x).cbrt();
}
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}
function clamp(x, min2, max2) {
  return new this(x).clamp(min2, max2);
}
function config3(obj) {
  if (!obj || typeof obj !== "object") throw Error(decimalError + "Object expected");
  var i, p, v, useDefaults = obj.defaults === true, ps = [
    "precision",
    1,
    MAX_DIGITS,
    "rounding",
    0,
    8,
    "toExpNeg",
    -EXP_LIMIT,
    0,
    "toExpPos",
    0,
    EXP_LIMIT,
    "maxE",
    0,
    EXP_LIMIT,
    "minE",
    -EXP_LIMIT,
    0,
    "modulo",
    0,
    9
  ];
  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
      else throw Error(invalidArgument + p + ": " + v);
    }
  }
  if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ": " + v);
    }
  }
  return this;
}
function cos(x) {
  return new this(x).cos();
}
function cosh(x) {
  return new this(x).cosh();
}
function clone2(obj) {
  var i, p, ps;
  function Decimal2(v) {
    var e, i2, t, x = this;
    if (!(x instanceof Decimal2)) return new Decimal2(v);
    x.constructor = Decimal2;
    if (isDecimalInstance(v)) {
      x.s = v.s;
      if (external) {
        if (!v.d || v.e > Decimal2.maxE) {
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal2.minE) {
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }
      return;
    }
    t = typeof v;
    if (t === "number") {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      if (v === ~~v && v < 1e7) {
        for (e = 0, i2 = v; i2 >= 10; i2 /= 10) e++;
        if (external) {
          if (e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }
        return;
      }
      if (v * 0 !== 0) {
        if (!v) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }
      return parseDecimal(x, v.toString());
    }
    if (t === "string") {
      if ((i2 = v.charCodeAt(0)) === 45) {
        v = v.slice(1);
        x.s = -1;
      } else {
        if (i2 === 43) v = v.slice(1);
        x.s = 1;
      }
      return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
    }
    if (t === "bigint") {
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      return parseDecimal(x, v.toString());
    }
    throw Error(invalidArgument + v);
  }
  Decimal2.prototype = P;
  Decimal2.ROUND_UP = 0;
  Decimal2.ROUND_DOWN = 1;
  Decimal2.ROUND_CEIL = 2;
  Decimal2.ROUND_FLOOR = 3;
  Decimal2.ROUND_HALF_UP = 4;
  Decimal2.ROUND_HALF_DOWN = 5;
  Decimal2.ROUND_HALF_EVEN = 6;
  Decimal2.ROUND_HALF_CEIL = 7;
  Decimal2.ROUND_HALF_FLOOR = 8;
  Decimal2.EUCLID = 9;
  Decimal2.config = Decimal2.set = config3;
  Decimal2.clone = clone2;
  Decimal2.isDecimal = isDecimalInstance;
  Decimal2.abs = abs;
  Decimal2.acos = acos;
  Decimal2.acosh = acosh;
  Decimal2.add = add;
  Decimal2.asin = asin;
  Decimal2.asinh = asinh;
  Decimal2.atan = atan;
  Decimal2.atanh = atanh;
  Decimal2.atan2 = atan2;
  Decimal2.cbrt = cbrt3;
  Decimal2.ceil = ceil;
  Decimal2.clamp = clamp;
  Decimal2.cos = cos;
  Decimal2.cosh = cosh;
  Decimal2.div = div;
  Decimal2.exp = exp;
  Decimal2.floor = floor;
  Decimal2.hypot = hypot;
  Decimal2.ln = ln;
  Decimal2.log = log;
  Decimal2.log10 = log103;
  Decimal2.log2 = log23;
  Decimal2.max = max;
  Decimal2.min = min;
  Decimal2.mod = mod;
  Decimal2.mul = mul;
  Decimal2.pow = pow;
  Decimal2.random = random;
  Decimal2.round = round;
  Decimal2.sign = sign2;
  Decimal2.sin = sin;
  Decimal2.sinh = sinh;
  Decimal2.sqrt = sqrt;
  Decimal2.sub = sub;
  Decimal2.sum = sum;
  Decimal2.tan = tan;
  Decimal2.tanh = tanh2;
  Decimal2.trunc = trunc;
  if (obj === void 0) obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
      for (i = 0; i < ps.length; ) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
  }
  Decimal2.config(obj);
  return Decimal2;
}
function div(x, y) {
  return new this(x).div(y);
}
function exp(x) {
  return new this(x).exp();
}
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}
function hypot() {
  var i, n, t = new this(0);
  external = false;
  for (i = 0; i < arguments.length; ) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }
  external = true;
  return t.sqrt();
}
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}
function ln(x) {
  return new this(x).ln();
}
function log(x, y) {
  return new this(x).log(y);
}
function log23(x) {
  return new this(x).log(2);
}
function log103(x) {
  return new this(x).log(10);
}
function max() {
  return maxOrMin(this, arguments, -1);
}
function min() {
  return maxOrMin(this, arguments, 1);
}
function mod(x, y) {
  return new this(x).mod(y);
}
function mul(x, y) {
  return new this(x).mul(y);
}
function pow(x, y) {
  return new this(x).pow(y);
}
function random(sd) {
  var d, e, k, n, i = 0, r = new this(1), rd = [];
  if (sd === void 0) sd = this.precision;
  else checkInt32(sd, 1, MAX_DIGITS);
  k = Math.ceil(sd / LOG_BASE);
  if (!this.crypto) {
    for (; i < k; ) rd[i++] = Math.random() * 1e7 | 0;
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));
    for (; i < k; ) {
      n = d[i];
      if (n >= 429e7) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {
        rd[i++] = n % 1e7;
      }
    }
  } else if (crypto.randomBytes) {
    d = crypto.randomBytes(k *= 4);
    for (; i < k; ) {
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
      if (n >= 214e7) {
        crypto.randomBytes(4).copy(d, i);
      } else {
        rd.push(n % 1e7);
        i += 4;
      }
    }
    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }
  k = rd[--i];
  sd %= LOG_BASE;
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }
  for (; rd[i] === 0; i--) rd.pop();
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;
    for (; rd[0] === 0; e -= LOG_BASE) rd.shift();
    for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;
    if (k < LOG_BASE) e -= LOG_BASE - k;
  }
  r.e = e;
  r.d = rd;
  return r;
}
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}
function sign2(x) {
  x = new this(x);
  return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
function sin(x) {
  return new this(x).sin();
}
function sinh(x) {
  return new this(x).sinh();
}
function sqrt(x) {
  return new this(x).sqrt();
}
function sub(x, y) {
  return new this(x).sub(y);
}
function sum() {
  var i = 0, args = arguments, x = new this(args[i]);
  external = false;
  for (; x.s && ++i < args.length; ) x = x.plus(args[i]);
  external = true;
  return finalise(x, this.precision, this.rounding);
}
function tan(x) {
  return new this(x).tan();
}
function tanh2(x) {
  return new this(x).tanh();
}
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}
P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
P[Symbol.toStringTag] = "Decimal";
var Decimal = P.constructor = clone2(DEFAULTS);
LN10 = new Decimal(LN10);
PI = new Decimal(PI);
var decimal_default = Decimal;

// node_modules/mathjs/lib/esm/type/bignumber/BigNumber.js
var name = "BigNumber";
var dependencies2 = ["?on", "config"];
var createBigNumberClass = /* @__PURE__ */ factory(name, dependencies2, (_ref) => {
  var {
    on,
    config: config4
  } = _ref;
  var BigNumber2 = decimal_default.clone({
    precision: config4.precision,
    modulo: decimal_default.EUCLID
  });
  BigNumber2.prototype = Object.create(BigNumber2.prototype);
  BigNumber2.prototype.type = "BigNumber";
  BigNumber2.prototype.isBigNumber = true;
  BigNumber2.prototype.toJSON = function() {
    return {
      mathjs: "BigNumber",
      value: this.toString()
    };
  };
  BigNumber2.fromJSON = function(json) {
    return new BigNumber2(json.value);
  };
  if (on) {
    on("config", function(curr, prev) {
      if (curr.precision !== prev.precision) {
        BigNumber2.config({
          precision: curr.precision
        });
      }
    });
  }
  return BigNumber2;
}, {
  isClass: true
});

// node_modules/complex.js/dist/complex.mjs
var cosh2 = Math.cosh || function(x) {
  return Math.abs(x) < 1e-9 ? 1 - x : (Math.exp(x) + Math.exp(-x)) * 0.5;
};
var sinh2 = Math.sinh || function(x) {
  return Math.abs(x) < 1e-9 ? x : (Math.exp(x) - Math.exp(-x)) * 0.5;
};
var cosm1 = function(x) {
  const b = Math.PI / 4;
  if (-b > x || x > b) {
    return Math.cos(x) - 1;
  }
  const xx = x * x;
  return xx * (xx * (xx * (xx * (xx * (xx * (xx * (xx / 20922789888e3 - 1 / 87178291200) + 1 / 479001600) - 1 / 3628800) + 1 / 40320) - 1 / 720) + 1 / 24) - 1 / 2);
};
var hypot2 = function(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  if (x < y) [x, y] = [y, x];
  if (x < 1e8) return Math.sqrt(x * x + y * y);
  y /= x;
  return x * Math.sqrt(1 + y * y);
};
var parser_exit = function() {
  throw SyntaxError("Invalid Param");
};
function logHypot(a, b) {
  const _a = Math.abs(a);
  const _b = Math.abs(b);
  if (a === 0) {
    return Math.log(_b);
  }
  if (b === 0) {
    return Math.log(_a);
  }
  if (_a < 3e3 && _b < 3e3) {
    return Math.log(a * a + b * b) * 0.5;
  }
  a = a * 0.5;
  b = b * 0.5;
  return 0.5 * Math.log(a * a + b * b) + Math.LN2;
}
var P2 = { "re": 0, "im": 0 };
var parse = function(a, b) {
  const z = P2;
  if (a === void 0 || a === null) {
    z["re"] = z["im"] = 0;
  } else if (b !== void 0) {
    z["re"] = a;
    z["im"] = b;
  } else
    switch (typeof a) {
      case "object":
        if ("im" in a && "re" in a) {
          z["re"] = a["re"];
          z["im"] = a["im"];
        } else if ("abs" in a && "arg" in a) {
          if (!isFinite(a["abs"]) && isFinite(a["arg"])) {
            return Complex["INFINITY"];
          }
          z["re"] = a["abs"] * Math.cos(a["arg"]);
          z["im"] = a["abs"] * Math.sin(a["arg"]);
        } else if ("r" in a && "phi" in a) {
          if (!isFinite(a["r"]) && isFinite(a["phi"])) {
            return Complex["INFINITY"];
          }
          z["re"] = a["r"] * Math.cos(a["phi"]);
          z["im"] = a["r"] * Math.sin(a["phi"]);
        } else if (a.length === 2) {
          z["re"] = a[0];
          z["im"] = a[1];
        } else {
          parser_exit();
        }
        break;
      case "string":
        z["im"] = /* void */
        z["re"] = 0;
        const tokens = a.replace(/_/g, "").match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
        let plus = 1;
        let minus = 0;
        if (tokens === null) {
          parser_exit();
        }
        for (let i = 0; i < tokens.length; i++) {
          const c = tokens[i];
          if (c === " " || c === "	" || c === "\n") {
          } else if (c === "+") {
            plus++;
          } else if (c === "-") {
            minus++;
          } else if (c === "i" || c === "I") {
            if (plus + minus === 0) {
              parser_exit();
            }
            if (tokens[i + 1] !== " " && !isNaN(tokens[i + 1])) {
              z["im"] += parseFloat((minus % 2 ? "-" : "") + tokens[i + 1]);
              i++;
            } else {
              z["im"] += parseFloat((minus % 2 ? "-" : "") + "1");
            }
            plus = minus = 0;
          } else {
            if (plus + minus === 0 || isNaN(c)) {
              parser_exit();
            }
            if (tokens[i + 1] === "i" || tokens[i + 1] === "I") {
              z["im"] += parseFloat((minus % 2 ? "-" : "") + c);
              i++;
            } else {
              z["re"] += parseFloat((minus % 2 ? "-" : "") + c);
            }
            plus = minus = 0;
          }
        }
        if (plus + minus > 0) {
          parser_exit();
        }
        break;
      case "number":
        z["im"] = 0;
        z["re"] = a;
        break;
      default:
        parser_exit();
    }
  if (isNaN(z["re"]) || isNaN(z["im"])) {
  }
  return z;
};
function Complex(a, b) {
  if (!(this instanceof Complex)) {
    return new Complex(a, b);
  }
  const z = parse(a, b);
  this["re"] = z["re"];
  this["im"] = z["im"];
}
Complex.prototype = {
  "re": 0,
  "im": 0,
  /**
   * Calculates the sign of a complex number, which is a normalized complex
   *
   * @returns {Complex}
   */
  "sign": function() {
    const abs2 = hypot2(this["re"], this["im"]);
    return new Complex(
      this["re"] / abs2,
      this["im"] / abs2
    );
  },
  /**
   * Adds two complex numbers
   *
   * @returns {Complex}
   */
  "add": function(a, b) {
    const z = parse(a, b);
    const tInfin = this["isInfinite"]();
    const zInfin = !(isFinite(z["re"]) && isFinite(z["im"]));
    if (tInfin || zInfin) {
      if (tInfin && zInfin) {
        return Complex["NAN"];
      }
      return Complex["INFINITY"];
    }
    return new Complex(
      this["re"] + z["re"],
      this["im"] + z["im"]
    );
  },
  /**
   * Subtracts two complex numbers
   *
   * @returns {Complex}
   */
  "sub": function(a, b) {
    const z = parse(a, b);
    const tInfin = this["isInfinite"]();
    const zInfin = !(isFinite(z["re"]) && isFinite(z["im"]));
    if (tInfin || zInfin) {
      if (tInfin && zInfin) {
        return Complex["NAN"];
      }
      return Complex["INFINITY"];
    }
    return new Complex(
      this["re"] - z["re"],
      this["im"] - z["im"]
    );
  },
  /**
   * Multiplies two complex numbers
   *
   * @returns {Complex}
   */
  "mul": function(a, b) {
    const z = parse(a, b);
    const tInfin = this["isInfinite"]();
    const zInfin = !(isFinite(z["re"]) && isFinite(z["im"]));
    const tIsZero = this["re"] === 0 && this["im"] === 0;
    const zIsZero = z["re"] === 0 && z["im"] === 0;
    if (tInfin && zIsZero || zInfin && tIsZero) {
      return Complex["NAN"];
    }
    if (tInfin || zInfin) {
      return Complex["INFINITY"];
    }
    if (z["im"] === 0 && this["im"] === 0) {
      return new Complex(this["re"] * z["re"], 0);
    }
    return new Complex(
      this["re"] * z["re"] - this["im"] * z["im"],
      this["re"] * z["im"] + this["im"] * z["re"]
    );
  },
  /**
   * Divides two complex numbers
   *
   * @returns {Complex}
   */
  "div": function(a, b) {
    const z = parse(a, b);
    const tInfin = this["isInfinite"]();
    const zInfin = !(isFinite(z["re"]) && isFinite(z["im"]));
    const tIsZero = this["re"] === 0 && this["im"] === 0;
    const zIsZero = z["re"] === 0 && z["im"] === 0;
    if (tIsZero && zIsZero || tInfin && zInfin) {
      return Complex["NAN"];
    }
    if (zIsZero || tInfin) {
      return Complex["INFINITY"];
    }
    if (tIsZero || zInfin) {
      return Complex["ZERO"];
    }
    if (0 === z["im"]) {
      return new Complex(this["re"] / z["re"], this["im"] / z["re"]);
    }
    if (Math.abs(z["re"]) < Math.abs(z["im"])) {
      const x = z["re"] / z["im"];
      const t = z["re"] * x + z["im"];
      return new Complex(
        (this["re"] * x + this["im"]) / t,
        (this["im"] * x - this["re"]) / t
      );
    } else {
      const x = z["im"] / z["re"];
      const t = z["im"] * x + z["re"];
      return new Complex(
        (this["re"] + this["im"] * x) / t,
        (this["im"] - this["re"] * x) / t
      );
    }
  },
  /**
   * Calculate the power of two complex numbers
   *
   * @returns {Complex}
   */
  "pow": function(a, b) {
    const z = parse(a, b);
    const tIsZero = this["re"] === 0 && this["im"] === 0;
    const zIsZero = z["re"] === 0 && z["im"] === 0;
    if (zIsZero) {
      return Complex["ONE"];
    }
    if (z["im"] === 0) {
      if (this["im"] === 0 && this["re"] > 0) {
        return new Complex(Math.pow(this["re"], z["re"]), 0);
      } else if (this["re"] === 0) {
        switch ((z["re"] % 4 + 4) % 4) {
          case 0:
            return new Complex(Math.pow(this["im"], z["re"]), 0);
          case 1:
            return new Complex(0, Math.pow(this["im"], z["re"]));
          case 2:
            return new Complex(-Math.pow(this["im"], z["re"]), 0);
          case 3:
            return new Complex(0, -Math.pow(this["im"], z["re"]));
        }
      }
    }
    if (tIsZero && z["re"] > 0) {
      return Complex["ZERO"];
    }
    const arg = Math.atan2(this["im"], this["re"]);
    const loh = logHypot(this["re"], this["im"]);
    let re = Math.exp(z["re"] * loh - z["im"] * arg);
    let im = z["im"] * loh + z["re"] * arg;
    return new Complex(
      re * Math.cos(im),
      re * Math.sin(im)
    );
  },
  /**
   * Calculate the complex square root
   *
   * @returns {Complex}
   */
  "sqrt": function() {
    const a = this["re"];
    const b = this["im"];
    if (b === 0) {
      if (a >= 0) {
        return new Complex(Math.sqrt(a), 0);
      } else {
        return new Complex(0, Math.sqrt(-a));
      }
    }
    const r = hypot2(a, b);
    let re = Math.sqrt(0.5 * (r + Math.abs(a)));
    let im = Math.abs(b) / (2 * re);
    if (a >= 0) {
      return new Complex(re, b < 0 ? -im : im);
    } else {
      return new Complex(im, b < 0 ? -re : re);
    }
  },
  /**
   * Calculate the complex exponent
   *
   * @returns {Complex}
   */
  "exp": function() {
    const er = Math.exp(this["re"]);
    if (this["im"] === 0) {
      return new Complex(er, 0);
    }
    return new Complex(
      er * Math.cos(this["im"]),
      er * Math.sin(this["im"])
    );
  },
  /**
   * Calculate the complex exponent and subtracts one.
   *
   * This may be more accurate than `Complex(x).exp().sub(1)` if
   * `x` is small.
   *
   * @returns {Complex}
   */
  "expm1": function() {
    const a = this["re"];
    const b = this["im"];
    return new Complex(
      Math.expm1(a) * Math.cos(b) + cosm1(b),
      Math.exp(a) * Math.sin(b)
    );
  },
  /**
   * Calculate the natural log
   *
   * @returns {Complex}
   */
  "log": function() {
    const a = this["re"];
    const b = this["im"];
    if (b === 0 && a > 0) {
      return new Complex(Math.log(a), 0);
    }
    return new Complex(
      logHypot(a, b),
      Math.atan2(b, a)
    );
  },
  /**
   * Calculate the magnitude of the complex number
   *
   * @returns {number}
   */
  "abs": function() {
    return hypot2(this["re"], this["im"]);
  },
  /**
   * Calculate the angle of the complex number
   *
   * @returns {number}
   */
  "arg": function() {
    return Math.atan2(this["im"], this["re"]);
  },
  /**
   * Calculate the sine of the complex number
   *
   * @returns {Complex}
   */
  "sin": function() {
    const a = this["re"];
    const b = this["im"];
    return new Complex(
      Math.sin(a) * cosh2(b),
      Math.cos(a) * sinh2(b)
    );
  },
  /**
   * Calculate the cosine
   *
   * @returns {Complex}
   */
  "cos": function() {
    const a = this["re"];
    const b = this["im"];
    return new Complex(
      Math.cos(a) * cosh2(b),
      -Math.sin(a) * sinh2(b)
    );
  },
  /**
   * Calculate the tangent
   *
   * @returns {Complex}
   */
  "tan": function() {
    const a = 2 * this["re"];
    const b = 2 * this["im"];
    const d = Math.cos(a) + cosh2(b);
    return new Complex(
      Math.sin(a) / d,
      sinh2(b) / d
    );
  },
  /**
   * Calculate the cotangent
   *
   * @returns {Complex}
   */
  "cot": function() {
    const a = 2 * this["re"];
    const b = 2 * this["im"];
    const d = Math.cos(a) - cosh2(b);
    return new Complex(
      -Math.sin(a) / d,
      sinh2(b) / d
    );
  },
  /**
   * Calculate the secant
   *
   * @returns {Complex}
   */
  "sec": function() {
    const a = this["re"];
    const b = this["im"];
    const d = 0.5 * cosh2(2 * b) + 0.5 * Math.cos(2 * a);
    return new Complex(
      Math.cos(a) * cosh2(b) / d,
      Math.sin(a) * sinh2(b) / d
    );
  },
  /**
   * Calculate the cosecans
   *
   * @returns {Complex}
   */
  "csc": function() {
    const a = this["re"];
    const b = this["im"];
    const d = 0.5 * cosh2(2 * b) - 0.5 * Math.cos(2 * a);
    return new Complex(
      Math.sin(a) * cosh2(b) / d,
      -Math.cos(a) * sinh2(b) / d
    );
  },
  /**
   * Calculate the complex arcus sinus
   *
   * @returns {Complex}
   */
  "asin": function() {
    const a = this["re"];
    const b = this["im"];
    const t1 = new Complex(
      b * b - a * a + 1,
      -2 * a * b
    )["sqrt"]();
    const t2 = new Complex(
      t1["re"] - b,
      t1["im"] + a
    )["log"]();
    return new Complex(t2["im"], -t2["re"]);
  },
  /**
   * Calculate the complex arcus cosinus
   *
   * @returns {Complex}
   */
  "acos": function() {
    const a = this["re"];
    const b = this["im"];
    const t1 = new Complex(
      b * b - a * a + 1,
      -2 * a * b
    )["sqrt"]();
    const t2 = new Complex(
      t1["re"] - b,
      t1["im"] + a
    )["log"]();
    return new Complex(Math.PI / 2 - t2["im"], t2["re"]);
  },
  /**
   * Calculate the complex arcus tangent
   *
   * @returns {Complex}
   */
  "atan": function() {
    const a = this["re"];
    const b = this["im"];
    if (a === 0) {
      if (b === 1) {
        return new Complex(0, Infinity);
      }
      if (b === -1) {
        return new Complex(0, -Infinity);
      }
    }
    const d = a * a + (1 - b) * (1 - b);
    const t1 = new Complex(
      (1 - b * b - a * a) / d,
      -2 * a / d
    ).log();
    return new Complex(-0.5 * t1["im"], 0.5 * t1["re"]);
  },
  /**
   * Calculate the complex arcus cotangent
   *
   * @returns {Complex}
   */
  "acot": function() {
    const a = this["re"];
    const b = this["im"];
    if (b === 0) {
      return new Complex(Math.atan2(1, a), 0);
    }
    const d = a * a + b * b;
    return d !== 0 ? new Complex(
      a / d,
      -b / d
    ).atan() : new Complex(
      a !== 0 ? a / 0 : 0,
      b !== 0 ? -b / 0 : 0
    ).atan();
  },
  /**
   * Calculate the complex arcus secant
   *
   * @returns {Complex}
   */
  "asec": function() {
    const a = this["re"];
    const b = this["im"];
    if (a === 0 && b === 0) {
      return new Complex(0, Infinity);
    }
    const d = a * a + b * b;
    return d !== 0 ? new Complex(
      a / d,
      -b / d
    ).acos() : new Complex(
      a !== 0 ? a / 0 : 0,
      b !== 0 ? -b / 0 : 0
    ).acos();
  },
  /**
   * Calculate the complex arcus cosecans
   *
   * @returns {Complex}
   */
  "acsc": function() {
    const a = this["re"];
    const b = this["im"];
    if (a === 0 && b === 0) {
      return new Complex(Math.PI / 2, Infinity);
    }
    const d = a * a + b * b;
    return d !== 0 ? new Complex(
      a / d,
      -b / d
    ).asin() : new Complex(
      a !== 0 ? a / 0 : 0,
      b !== 0 ? -b / 0 : 0
    ).asin();
  },
  /**
   * Calculate the complex sinh
   *
   * @returns {Complex}
   */
  "sinh": function() {
    const a = this["re"];
    const b = this["im"];
    return new Complex(
      sinh2(a) * Math.cos(b),
      cosh2(a) * Math.sin(b)
    );
  },
  /**
   * Calculate the complex cosh
   *
   * @returns {Complex}
   */
  "cosh": function() {
    const a = this["re"];
    const b = this["im"];
    return new Complex(
      cosh2(a) * Math.cos(b),
      sinh2(a) * Math.sin(b)
    );
  },
  /**
   * Calculate the complex tanh
   *
   * @returns {Complex}
   */
  "tanh": function() {
    const a = 2 * this["re"];
    const b = 2 * this["im"];
    const d = cosh2(a) + Math.cos(b);
    return new Complex(
      sinh2(a) / d,
      Math.sin(b) / d
    );
  },
  /**
   * Calculate the complex coth
   *
   * @returns {Complex}
   */
  "coth": function() {
    const a = 2 * this["re"];
    const b = 2 * this["im"];
    const d = cosh2(a) - Math.cos(b);
    return new Complex(
      sinh2(a) / d,
      -Math.sin(b) / d
    );
  },
  /**
   * Calculate the complex coth
   *
   * @returns {Complex}
   */
  "csch": function() {
    const a = this["re"];
    const b = this["im"];
    const d = Math.cos(2 * b) - cosh2(2 * a);
    return new Complex(
      -2 * sinh2(a) * Math.cos(b) / d,
      2 * cosh2(a) * Math.sin(b) / d
    );
  },
  /**
   * Calculate the complex sech
   *
   * @returns {Complex}
   */
  "sech": function() {
    const a = this["re"];
    const b = this["im"];
    const d = Math.cos(2 * b) + cosh2(2 * a);
    return new Complex(
      2 * cosh2(a) * Math.cos(b) / d,
      -2 * sinh2(a) * Math.sin(b) / d
    );
  },
  /**
   * Calculate the complex asinh
   *
   * @returns {Complex}
   */
  "asinh": function() {
    let tmp = this["im"];
    this["im"] = -this["re"];
    this["re"] = tmp;
    const res = this["asin"]();
    this["re"] = -this["im"];
    this["im"] = tmp;
    tmp = res["re"];
    res["re"] = -res["im"];
    res["im"] = tmp;
    return res;
  },
  /**
   * Calculate the complex acosh
   *
   * @returns {Complex}
   */
  "acosh": function() {
    const res = this["acos"]();
    if (res["im"] <= 0) {
      const tmp = res["re"];
      res["re"] = -res["im"];
      res["im"] = tmp;
    } else {
      const tmp = res["im"];
      res["im"] = -res["re"];
      res["re"] = tmp;
    }
    return res;
  },
  /**
   * Calculate the complex atanh
   *
   * @returns {Complex}
   */
  "atanh": function() {
    const a = this["re"];
    const b = this["im"];
    const noIM = a > 1 && b === 0;
    const oneMinus = 1 - a;
    const onePlus = 1 + a;
    const d = oneMinus * oneMinus + b * b;
    const x = d !== 0 ? new Complex(
      (onePlus * oneMinus - b * b) / d,
      (b * oneMinus + onePlus * b) / d
    ) : new Complex(
      a !== -1 ? a / 0 : 0,
      b !== 0 ? b / 0 : 0
    );
    const temp = x["re"];
    x["re"] = logHypot(x["re"], x["im"]) / 2;
    x["im"] = Math.atan2(x["im"], temp) / 2;
    if (noIM) {
      x["im"] = -x["im"];
    }
    return x;
  },
  /**
   * Calculate the complex acoth
   *
   * @returns {Complex}
   */
  "acoth": function() {
    const a = this["re"];
    const b = this["im"];
    if (a === 0 && b === 0) {
      return new Complex(0, Math.PI / 2);
    }
    const d = a * a + b * b;
    return d !== 0 ? new Complex(
      a / d,
      -b / d
    ).atanh() : new Complex(
      a !== 0 ? a / 0 : 0,
      b !== 0 ? -b / 0 : 0
    ).atanh();
  },
  /**
   * Calculate the complex acsch
   *
   * @returns {Complex}
   */
  "acsch": function() {
    const a = this["re"];
    const b = this["im"];
    if (b === 0) {
      return new Complex(
        a !== 0 ? Math.log(a + Math.sqrt(a * a + 1)) : Infinity,
        0
      );
    }
    const d = a * a + b * b;
    return d !== 0 ? new Complex(
      a / d,
      -b / d
    ).asinh() : new Complex(
      a !== 0 ? a / 0 : 0,
      b !== 0 ? -b / 0 : 0
    ).asinh();
  },
  /**
   * Calculate the complex asech
   *
   * @returns {Complex}
   */
  "asech": function() {
    const a = this["re"];
    const b = this["im"];
    if (this["isZero"]()) {
      return Complex["INFINITY"];
    }
    const d = a * a + b * b;
    return d !== 0 ? new Complex(
      a / d,
      -b / d
    ).acosh() : new Complex(
      a !== 0 ? a / 0 : 0,
      b !== 0 ? -b / 0 : 0
    ).acosh();
  },
  /**
   * Calculate the complex inverse 1/z
   *
   * @returns {Complex}
   */
  "inverse": function() {
    if (this["isZero"]()) {
      return Complex["INFINITY"];
    }
    if (this["isInfinite"]()) {
      return Complex["ZERO"];
    }
    const a = this["re"];
    const b = this["im"];
    const d = a * a + b * b;
    return new Complex(a / d, -b / d);
  },
  /**
   * Returns the complex conjugate
   *
   * @returns {Complex}
   */
  "conjugate": function() {
    return new Complex(this["re"], -this["im"]);
  },
  /**
   * Gets the negated complex number
   *
   * @returns {Complex}
   */
  "neg": function() {
    return new Complex(-this["re"], -this["im"]);
  },
  /**
   * Ceils the actual complex number
   *
   * @returns {Complex}
   */
  "ceil": function(places) {
    places = Math.pow(10, places || 0);
    return new Complex(
      Math.ceil(this["re"] * places) / places,
      Math.ceil(this["im"] * places) / places
    );
  },
  /**
   * Floors the actual complex number
   *
   * @returns {Complex}
   */
  "floor": function(places) {
    places = Math.pow(10, places || 0);
    return new Complex(
      Math.floor(this["re"] * places) / places,
      Math.floor(this["im"] * places) / places
    );
  },
  /**
   * Ceils the actual complex number
   *
   * @returns {Complex}
   */
  "round": function(places) {
    places = Math.pow(10, places || 0);
    return new Complex(
      Math.round(this["re"] * places) / places,
      Math.round(this["im"] * places) / places
    );
  },
  /**
   * Compares two complex numbers
   *
   * **Note:** new Complex(Infinity).equals(Infinity) === false
   *
   * @returns {boolean}
   */
  "equals": function(a, b) {
    const z = parse(a, b);
    return Math.abs(z["re"] - this["re"]) <= Complex["EPSILON"] && Math.abs(z["im"] - this["im"]) <= Complex["EPSILON"];
  },
  /**
   * Clones the actual object
   *
   * @returns {Complex}
   */
  "clone": function() {
    return new Complex(this["re"], this["im"]);
  },
  /**
   * Gets a string of the actual complex number
   *
   * @returns {string}
   */
  "toString": function() {
    let a = this["re"];
    let b = this["im"];
    let ret = "";
    if (this["isNaN"]()) {
      return "NaN";
    }
    if (this["isInfinite"]()) {
      return "Infinity";
    }
    if (Math.abs(a) < Complex["EPSILON"]) {
      a = 0;
    }
    if (Math.abs(b) < Complex["EPSILON"]) {
      b = 0;
    }
    if (b === 0) {
      return ret + a;
    }
    if (a !== 0) {
      ret += a;
      ret += " ";
      if (b < 0) {
        b = -b;
        ret += "-";
      } else {
        ret += "+";
      }
      ret += " ";
    } else if (b < 0) {
      b = -b;
      ret += "-";
    }
    if (1 !== b) {
      ret += b;
    }
    return ret + "i";
  },
  /**
   * Returns the actual number as a vector
   *
   * @returns {Array}
   */
  "toVector": function() {
    return [this["re"], this["im"]];
  },
  /**
   * Returns the actual real value of the current object
   *
   * @returns {number|null}
   */
  "valueOf": function() {
    if (this["im"] === 0) {
      return this["re"];
    }
    return null;
  },
  /**
   * Determines whether a complex number is not on the Riemann sphere.
   *
   * @returns {boolean}
   */
  "isNaN": function() {
    return isNaN(this["re"]) || isNaN(this["im"]);
  },
  /**
   * Determines whether or not a complex number is at the zero pole of the
   * Riemann sphere.
   *
   * @returns {boolean}
   */
  "isZero": function() {
    return this["im"] === 0 && this["re"] === 0;
  },
  /**
   * Determines whether a complex number is not at the infinity pole of the
   * Riemann sphere.
   *
   * @returns {boolean}
   */
  "isFinite": function() {
    return isFinite(this["re"]) && isFinite(this["im"]);
  },
  /**
   * Determines whether or not a complex number is at the infinity pole of the
   * Riemann sphere.
   *
   * @returns {boolean}
   */
  "isInfinite": function() {
    return !this["isFinite"]();
  }
};
Complex["ZERO"] = new Complex(0, 0);
Complex["ONE"] = new Complex(1, 0);
Complex["I"] = new Complex(0, 1);
Complex["PI"] = new Complex(Math.PI, 0);
Complex["E"] = new Complex(Math.E, 0);
Complex["INFINITY"] = new Complex(Infinity, Infinity);
Complex["NAN"] = new Complex(NaN, NaN);
Complex["EPSILON"] = 1e-15;

// node_modules/mathjs/lib/esm/type/complex/Complex.js
var name2 = "Complex";
var dependencies3 = [];
var createComplexClass = /* @__PURE__ */ factory(name2, dependencies3, () => {
  Object.defineProperty(Complex, "name", {
    value: "Complex"
  });
  Complex.prototype.constructor = Complex;
  Complex.prototype.type = "Complex";
  Complex.prototype.isComplex = true;
  Complex.prototype.toJSON = function() {
    return {
      mathjs: "Complex",
      re: this.re,
      im: this.im
    };
  };
  Complex.prototype.toPolar = function() {
    return {
      r: this.abs(),
      phi: this.arg()
    };
  };
  Complex.prototype.format = function(options) {
    var str = "";
    var im = this.im;
    var re = this.re;
    var strRe = format(this.re, options);
    var strIm = format(this.im, options);
    var precision = isNumber(options) ? options : options ? options.precision : null;
    if (precision !== null) {
      var epsilon = Math.pow(10, -precision);
      if (Math.abs(re / im) < epsilon) {
        re = 0;
      }
      if (Math.abs(im / re) < epsilon) {
        im = 0;
      }
    }
    if (im === 0) {
      str = strRe;
    } else if (re === 0) {
      if (im === 1) {
        str = "i";
      } else if (im === -1) {
        str = "-i";
      } else {
        str = strIm + "i";
      }
    } else {
      if (im < 0) {
        if (im === -1) {
          str = strRe + " - i";
        } else {
          str = strRe + " - " + strIm.substring(1) + "i";
        }
      } else {
        if (im === 1) {
          str = strRe + " + i";
        } else {
          str = strRe + " + " + strIm + "i";
        }
      }
    }
    return str;
  };
  Complex.fromPolar = function(args) {
    switch (arguments.length) {
      case 1: {
        var arg = arguments[0];
        if (typeof arg === "object") {
          return Complex(arg);
        } else {
          throw new TypeError("Input has to be an object with r and phi keys.");
        }
      }
      case 2: {
        var r = arguments[0];
        var phi = arguments[1];
        if (isNumber(r)) {
          if (isUnit(phi) && phi.hasBase("ANGLE")) {
            phi = phi.toNumber("rad");
          }
          if (isNumber(phi)) {
            return new Complex({
              r,
              phi
            });
          }
          throw new TypeError("Phi is not a number nor an angle unit.");
        } else {
          throw new TypeError("Radius r is not a number.");
        }
      }
      default:
        throw new SyntaxError("Wrong number of arguments in function fromPolar");
    }
  };
  Complex.prototype.valueOf = Complex.prototype.toString;
  Complex.fromJSON = function(json) {
    return new Complex(json);
  };
  Complex.compare = function(a, b) {
    if (a.re > b.re) {
      return 1;
    }
    if (a.re < b.re) {
      return -1;
    }
    if (a.im > b.im) {
      return 1;
    }
    if (a.im < b.im) {
      return -1;
    }
    return 0;
  };
  return Complex;
}, {
  isClass: true
});

// node_modules/fraction.js/dist/fraction.mjs
if (typeof BigInt === "undefined") BigInt = function(n) {
  if (isNaN(n)) throw new Error("");
  return n;
};
var C_ZERO = BigInt(0);
var C_ONE = BigInt(1);
var C_TWO = BigInt(2);
var C_FIVE = BigInt(5);
var C_TEN = BigInt(10);
var MAX_CYCLE_LEN = 2e3;
var P3 = {
  "s": C_ONE,
  "n": C_ZERO,
  "d": C_ONE
};
function assign2(n, s) {
  try {
    n = BigInt(n);
  } catch (e) {
    throw InvalidParameter();
  }
  return n * s;
}
function trunc2(x) {
  return typeof x === "bigint" ? x : Math.floor(x);
}
function newFraction(n, d) {
  if (d === C_ZERO) {
    throw DivisionByZero();
  }
  const f = Object.create(Fraction.prototype);
  f["s"] = n < C_ZERO ? -C_ONE : C_ONE;
  n = n < C_ZERO ? -n : n;
  const a = gcd(n, d);
  f["n"] = n / a;
  f["d"] = d / a;
  return f;
}
function factorize(num) {
  const factors = {};
  let n = num;
  let i = C_TWO;
  let s = C_FIVE - C_ONE;
  while (s <= n) {
    while (n % i === C_ZERO) {
      n /= i;
      factors[i] = (factors[i] || C_ZERO) + C_ONE;
    }
    s += C_ONE + C_TWO * i++;
  }
  if (n !== num) {
    if (n > 1)
      factors[n] = (factors[n] || C_ZERO) + C_ONE;
  } else {
    factors[num] = (factors[num] || C_ZERO) + C_ONE;
  }
  return factors;
}
var parse2 = function(p1, p2) {
  let n = C_ZERO, d = C_ONE, s = C_ONE;
  if (p1 === void 0 || p1 === null) {
  } else if (p2 !== void 0) {
    if (typeof p1 === "bigint") {
      n = p1;
    } else if (isNaN(p1)) {
      throw InvalidParameter();
    } else if (p1 % 1 !== 0) {
      throw NonIntegerParameter();
    } else {
      n = BigInt(p1);
    }
    if (typeof p2 === "bigint") {
      d = p2;
    } else if (isNaN(p2)) {
      throw InvalidParameter();
    } else if (p2 % 1 !== 0) {
      throw NonIntegerParameter();
    } else {
      d = BigInt(p2);
    }
    s = n * d;
  } else if (typeof p1 === "object") {
    if ("d" in p1 && "n" in p1) {
      n = BigInt(p1["n"]);
      d = BigInt(p1["d"]);
      if ("s" in p1)
        n *= BigInt(p1["s"]);
    } else if (0 in p1) {
      n = BigInt(p1[0]);
      if (1 in p1)
        d = BigInt(p1[1]);
    } else if (typeof p1 === "bigint") {
      n = p1;
    } else {
      throw InvalidParameter();
    }
    s = n * d;
  } else if (typeof p1 === "number") {
    if (isNaN(p1)) {
      throw InvalidParameter();
    }
    if (p1 < 0) {
      s = -C_ONE;
      p1 = -p1;
    }
    if (p1 % 1 === 0) {
      n = BigInt(p1);
    } else if (p1 > 0) {
      let z = 1;
      let A = 0, B = 1;
      let C = 1, D = 1;
      let N = 1e7;
      if (p1 >= 1) {
        z = 10 ** Math.floor(1 + Math.log10(p1));
        p1 /= z;
      }
      while (B <= N && D <= N) {
        let M = (A + C) / (B + D);
        if (p1 === M) {
          if (B + D <= N) {
            n = A + C;
            d = B + D;
          } else if (D > B) {
            n = C;
            d = D;
          } else {
            n = A;
            d = B;
          }
          break;
        } else {
          if (p1 > M) {
            A += C;
            B += D;
          } else {
            C += A;
            D += B;
          }
          if (B > N) {
            n = C;
            d = D;
          } else {
            n = A;
            d = B;
          }
        }
      }
      n = BigInt(n) * BigInt(z);
      d = BigInt(d);
    }
  } else if (typeof p1 === "string") {
    let ndx = 0;
    let v = C_ZERO, w = C_ZERO, x = C_ZERO, y = C_ONE, z = C_ONE;
    let match = p1.replace(/_/g, "").match(/\d+|./g);
    if (match === null)
      throw InvalidParameter();
    if (match[ndx] === "-") {
      s = -C_ONE;
      ndx++;
    } else if (match[ndx] === "+") {
      ndx++;
    }
    if (match.length === ndx + 1) {
      w = assign2(match[ndx++], s);
    } else if (match[ndx + 1] === "." || match[ndx] === ".") {
      if (match[ndx] !== ".") {
        v = assign2(match[ndx++], s);
      }
      ndx++;
      if (ndx + 1 === match.length || match[ndx + 1] === "(" && match[ndx + 3] === ")" || match[ndx + 1] === "'" && match[ndx + 3] === "'") {
        w = assign2(match[ndx], s);
        y = C_TEN ** BigInt(match[ndx].length);
        ndx++;
      }
      if (match[ndx] === "(" && match[ndx + 2] === ")" || match[ndx] === "'" && match[ndx + 2] === "'") {
        x = assign2(match[ndx + 1], s);
        z = C_TEN ** BigInt(match[ndx + 1].length) - C_ONE;
        ndx += 3;
      }
    } else if (match[ndx + 1] === "/" || match[ndx + 1] === ":") {
      w = assign2(match[ndx], s);
      y = assign2(match[ndx + 2], C_ONE);
      ndx += 3;
    } else if (match[ndx + 3] === "/" && match[ndx + 1] === " ") {
      v = assign2(match[ndx], s);
      w = assign2(match[ndx + 2], s);
      y = assign2(match[ndx + 4], C_ONE);
      ndx += 5;
    }
    if (match.length <= ndx) {
      d = y * z;
      s = /* void */
      n = x + d * v + z * w;
    } else {
      throw InvalidParameter();
    }
  } else if (typeof p1 === "bigint") {
    n = p1;
    s = p1;
    d = C_ONE;
  } else {
    throw InvalidParameter();
  }
  if (d === C_ZERO) {
    throw DivisionByZero();
  }
  P3["s"] = s < C_ZERO ? -C_ONE : C_ONE;
  P3["n"] = n < C_ZERO ? -n : n;
  P3["d"] = d < C_ZERO ? -d : d;
};
function modpow(b, e, m) {
  let r = C_ONE;
  for (; e > C_ZERO; b = b * b % m, e >>= C_ONE) {
    if (e & C_ONE) {
      r = r * b % m;
    }
  }
  return r;
}
function cycleLen(n, d) {
  for (; d % C_TWO === C_ZERO; d /= C_TWO) {
  }
  for (; d % C_FIVE === C_ZERO; d /= C_FIVE) {
  }
  if (d === C_ONE)
    return C_ZERO;
  let rem = C_TEN % d;
  let t = 1;
  for (; rem !== C_ONE; t++) {
    rem = rem * C_TEN % d;
    if (t > MAX_CYCLE_LEN)
      return C_ZERO;
  }
  return BigInt(t);
}
function cycleStart(n, d, len) {
  let rem1 = C_ONE;
  let rem2 = modpow(C_TEN, len, d);
  for (let t = 0; t < 300; t++) {
    if (rem1 === rem2)
      return BigInt(t);
    rem1 = rem1 * C_TEN % d;
    rem2 = rem2 * C_TEN % d;
  }
  return 0;
}
function gcd(a, b) {
  if (!a)
    return b;
  if (!b)
    return a;
  while (1) {
    a %= b;
    if (!a)
      return b;
    b %= a;
    if (!b)
      return a;
  }
}
function Fraction(a, b) {
  parse2(a, b);
  if (this instanceof Fraction) {
    a = gcd(P3["d"], P3["n"]);
    this["s"] = P3["s"];
    this["n"] = P3["n"] / a;
    this["d"] = P3["d"] / a;
  } else {
    return newFraction(P3["s"] * P3["n"], P3["d"]);
  }
}
var DivisionByZero = function() {
  return new Error("Division by Zero");
};
var InvalidParameter = function() {
  return new Error("Invalid argument");
};
var NonIntegerParameter = function() {
  return new Error("Parameters must be integer");
};
Fraction.prototype = {
  "s": C_ONE,
  "n": C_ZERO,
  "d": C_ONE,
  /**
   * Calculates the absolute value
   *
   * Ex: new Fraction(-4).abs() => 4
   **/
  "abs": function() {
    return newFraction(this["n"], this["d"]);
  },
  /**
   * Inverts the sign of the current fraction
   *
   * Ex: new Fraction(-4).neg() => 4
   **/
  "neg": function() {
    return newFraction(-this["s"] * this["n"], this["d"]);
  },
  /**
   * Adds two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
   **/
  "add": function(a, b) {
    parse2(a, b);
    return newFraction(
      this["s"] * this["n"] * P3["d"] + P3["s"] * this["d"] * P3["n"],
      this["d"] * P3["d"]
    );
  },
  /**
   * Subtracts two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
   **/
  "sub": function(a, b) {
    parse2(a, b);
    return newFraction(
      this["s"] * this["n"] * P3["d"] - P3["s"] * this["d"] * P3["n"],
      this["d"] * P3["d"]
    );
  },
  /**
   * Multiplies two rational numbers
   *
   * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
   **/
  "mul": function(a, b) {
    parse2(a, b);
    return newFraction(
      this["s"] * P3["s"] * this["n"] * P3["n"],
      this["d"] * P3["d"]
    );
  },
  /**
   * Divides two rational numbers
   *
   * Ex: new Fraction("-17.(345)").inverse().div(3)
   **/
  "div": function(a, b) {
    parse2(a, b);
    return newFraction(
      this["s"] * P3["s"] * this["n"] * P3["d"],
      this["d"] * P3["n"]
    );
  },
  /**
   * Clones the actual object
   *
   * Ex: new Fraction("-17.(345)").clone()
   **/
  "clone": function() {
    return newFraction(this["s"] * this["n"], this["d"]);
  },
  /**
   * Calculates the modulo of two rational numbers - a more precise fmod
   *
   * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
   * Ex: new Fraction(20, 10).mod().equals(0) ? "is Integer"
   **/
  "mod": function(a, b) {
    if (a === void 0) {
      return newFraction(this["s"] * this["n"] % this["d"], C_ONE);
    }
    parse2(a, b);
    if (C_ZERO === P3["n"] * this["d"]) {
      throw DivisionByZero();
    }
    return newFraction(
      this["s"] * (P3["d"] * this["n"]) % (P3["n"] * this["d"]),
      P3["d"] * this["d"]
    );
  },
  /**
   * Calculates the fractional gcd of two rational numbers
   *
   * Ex: new Fraction(5,8).gcd(3,7) => 1/56
   */
  "gcd": function(a, b) {
    parse2(a, b);
    return newFraction(gcd(P3["n"], this["n"]) * gcd(P3["d"], this["d"]), P3["d"] * this["d"]);
  },
  /**
   * Calculates the fractional lcm of two rational numbers
   *
   * Ex: new Fraction(5,8).lcm(3,7) => 15
   */
  "lcm": function(a, b) {
    parse2(a, b);
    if (P3["n"] === C_ZERO && this["n"] === C_ZERO) {
      return newFraction(C_ZERO, C_ONE);
    }
    return newFraction(P3["n"] * this["n"], gcd(P3["n"], this["n"]) * gcd(P3["d"], this["d"]));
  },
  /**
   * Gets the inverse of the fraction, means numerator and denominator are exchanged
   *
   * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
   **/
  "inverse": function() {
    return newFraction(this["s"] * this["d"], this["n"]);
  },
  /**
   * Calculates the fraction to some integer exponent
   *
   * Ex: new Fraction(-1,2).pow(-3) => -8
   */
  "pow": function(a, b) {
    parse2(a, b);
    if (P3["d"] === C_ONE) {
      if (P3["s"] < C_ZERO) {
        return newFraction((this["s"] * this["d"]) ** P3["n"], this["n"] ** P3["n"]);
      } else {
        return newFraction((this["s"] * this["n"]) ** P3["n"], this["d"] ** P3["n"]);
      }
    }
    if (this["s"] < C_ZERO) return null;
    let N = factorize(this["n"]);
    let D = factorize(this["d"]);
    let n = C_ONE;
    let d = C_ONE;
    for (let k in N) {
      if (k === "1") continue;
      if (k === "0") {
        n = C_ZERO;
        break;
      }
      N[k] *= P3["n"];
      if (N[k] % P3["d"] === C_ZERO) {
        N[k] /= P3["d"];
      } else return null;
      n *= BigInt(k) ** N[k];
    }
    for (let k in D) {
      if (k === "1") continue;
      D[k] *= P3["n"];
      if (D[k] % P3["d"] === C_ZERO) {
        D[k] /= P3["d"];
      } else return null;
      d *= BigInt(k) ** D[k];
    }
    if (P3["s"] < C_ZERO) {
      return newFraction(d, n);
    }
    return newFraction(n, d);
  },
  /**
   * Calculates the logarithm of a fraction to a given rational base
   *
   * Ex: new Fraction(27, 8).log(9, 4) => 3/2
   */
  "log": function(a, b) {
    parse2(a, b);
    if (this["s"] <= C_ZERO || P3["s"] <= C_ZERO) return null;
    const allPrimes = {};
    const baseFactors = factorize(P3["n"]);
    const T1 = factorize(P3["d"]);
    const numberFactors = factorize(this["n"]);
    const T2 = factorize(this["d"]);
    for (const prime in T1) {
      baseFactors[prime] = (baseFactors[prime] || C_ZERO) - T1[prime];
    }
    for (const prime in T2) {
      numberFactors[prime] = (numberFactors[prime] || C_ZERO) - T2[prime];
    }
    for (const prime in baseFactors) {
      if (prime === "1") continue;
      allPrimes[prime] = true;
    }
    for (const prime in numberFactors) {
      if (prime === "1") continue;
      allPrimes[prime] = true;
    }
    let retN = null;
    let retD = null;
    for (const prime in allPrimes) {
      const baseExponent = baseFactors[prime] || C_ZERO;
      const numberExponent = numberFactors[prime] || C_ZERO;
      if (baseExponent === C_ZERO) {
        if (numberExponent !== C_ZERO) {
          return null;
        }
        continue;
      }
      let curN = numberExponent;
      let curD = baseExponent;
      const gcdValue = gcd(curN, curD);
      curN /= gcdValue;
      curD /= gcdValue;
      if (retN === null && retD === null) {
        retN = curN;
        retD = curD;
      } else if (curN * retD !== retN * curD) {
        return null;
      }
    }
    return retN !== null && retD !== null ? newFraction(retN, retD) : null;
  },
  /**
   * Check if two rational numbers are the same
   *
   * Ex: new Fraction(19.6).equals([98, 5]);
   **/
  "equals": function(a, b) {
    parse2(a, b);
    return this["s"] * this["n"] * P3["d"] === P3["s"] * P3["n"] * this["d"];
  },
  /**
   * Check if this rational number is less than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "lt": function(a, b) {
    parse2(a, b);
    return this["s"] * this["n"] * P3["d"] < P3["s"] * P3["n"] * this["d"];
  },
  /**
   * Check if this rational number is less than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "lte": function(a, b) {
    parse2(a, b);
    return this["s"] * this["n"] * P3["d"] <= P3["s"] * P3["n"] * this["d"];
  },
  /**
   * Check if this rational number is greater than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "gt": function(a, b) {
    parse2(a, b);
    return this["s"] * this["n"] * P3["d"] > P3["s"] * P3["n"] * this["d"];
  },
  /**
   * Check if this rational number is greater than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "gte": function(a, b) {
    parse2(a, b);
    return this["s"] * this["n"] * P3["d"] >= P3["s"] * P3["n"] * this["d"];
  },
  /**
   * Compare two rational numbers
   * < 0 iff this < that
   * > 0 iff this > that
   * = 0 iff this = that
   *
   * Ex: new Fraction(19.6).compare([98, 5]);
   **/
  "compare": function(a, b) {
    parse2(a, b);
    let t = this["s"] * this["n"] * P3["d"] - P3["s"] * P3["n"] * this["d"];
    return (C_ZERO < t) - (t < C_ZERO);
  },
  /**
   * Calculates the ceil of a rational number
   *
   * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
   **/
  "ceil": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      trunc2(this["s"] * places * this["n"] / this["d"]) + (places * this["n"] % this["d"] > C_ZERO && this["s"] >= C_ZERO ? C_ONE : C_ZERO),
      places
    );
  },
  /**
   * Calculates the floor of a rational number
   *
   * Ex: new Fraction('4.(3)').floor() => (4 / 1)
   **/
  "floor": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      trunc2(this["s"] * places * this["n"] / this["d"]) - (places * this["n"] % this["d"] > C_ZERO && this["s"] < C_ZERO ? C_ONE : C_ZERO),
      places
    );
  },
  /**
   * Rounds a rational numbers
   *
   * Ex: new Fraction('4.(3)').round() => (4 / 1)
   **/
  "round": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      trunc2(this["s"] * places * this["n"] / this["d"]) + this["s"] * ((this["s"] >= C_ZERO ? C_ONE : C_ZERO) + C_TWO * (places * this["n"] % this["d"]) > this["d"] ? C_ONE : C_ZERO),
      places
    );
  },
  /**
    * Rounds a rational number to a multiple of another rational number
    *
    * Ex: new Fraction('0.9').roundTo("1/8") => 7 / 8
    **/
  "roundTo": function(a, b) {
    parse2(a, b);
    const n = this["n"] * P3["d"];
    const d = this["d"] * P3["n"];
    const r = n % d;
    let k = trunc2(n / d);
    if (r + r >= d) {
      k++;
    }
    return newFraction(this["s"] * k * P3["n"], P3["d"]);
  },
  /**
   * Check if two rational numbers are divisible
   *
   * Ex: new Fraction(19.6).divisible(1.5);
   */
  "divisible": function(a, b) {
    parse2(a, b);
    return !(!(P3["n"] * this["d"]) || this["n"] * P3["d"] % (P3["n"] * this["d"]));
  },
  /**
   * Returns a decimal representation of the fraction
   *
   * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
   **/
  "valueOf": function() {
    return Number(this["s"] * this["n"]) / Number(this["d"]);
  },
  /**
   * Creates a string representation of a fraction with all digits
   *
   * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
   **/
  "toString": function(dec) {
    let N = this["n"];
    let D = this["d"];
    dec = dec || 15;
    let cycLen = cycleLen(N, D);
    let cycOff = cycleStart(N, D, cycLen);
    let str = this["s"] < C_ZERO ? "-" : "";
    str += trunc2(N / D);
    N %= D;
    N *= C_TEN;
    if (N)
      str += ".";
    if (cycLen) {
      for (let i = cycOff; i--; ) {
        str += trunc2(N / D);
        N %= D;
        N *= C_TEN;
      }
      str += "(";
      for (let i = cycLen; i--; ) {
        str += trunc2(N / D);
        N %= D;
        N *= C_TEN;
      }
      str += ")";
    } else {
      for (let i = dec; N && i--; ) {
        str += trunc2(N / D);
        N %= D;
        N *= C_TEN;
      }
    }
    return str;
  },
  /**
   * Returns a string-fraction representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
   **/
  "toFraction": function(showMixed) {
    let n = this["n"];
    let d = this["d"];
    let str = this["s"] < C_ZERO ? "-" : "";
    if (d === C_ONE) {
      str += n;
    } else {
      let whole = trunc2(n / d);
      if (showMixed && whole > C_ZERO) {
        str += whole;
        str += " ";
        n %= d;
      }
      str += n;
      str += "/";
      str += d;
    }
    return str;
  },
  /**
   * Returns a latex representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
   **/
  "toLatex": function(showMixed) {
    let n = this["n"];
    let d = this["d"];
    let str = this["s"] < C_ZERO ? "-" : "";
    if (d === C_ONE) {
      str += n;
    } else {
      let whole = trunc2(n / d);
      if (showMixed && whole > C_ZERO) {
        str += whole;
        n %= d;
      }
      str += "\\frac{";
      str += n;
      str += "}{";
      str += d;
      str += "}";
    }
    return str;
  },
  /**
   * Returns an array of continued fraction elements
   *
   * Ex: new Fraction("7/8").toContinued() => [0,1,7]
   */
  "toContinued": function() {
    let a = this["n"];
    let b = this["d"];
    let res = [];
    do {
      res.push(trunc2(a / b));
      let t = a % b;
      a = b;
      b = t;
    } while (a !== C_ONE);
    return res;
  },
  "simplify": function(eps) {
    const ieps = BigInt(1 / (eps || 1e-3) | 0);
    const thisABS = this["abs"]();
    const cont = thisABS["toContinued"]();
    for (let i = 1; i < cont.length; i++) {
      let s = newFraction(cont[i - 1], C_ONE);
      for (let k = i - 2; k >= 0; k--) {
        s = s["inverse"]()["add"](cont[k]);
      }
      let t = s["sub"](thisABS);
      if (t["n"] * ieps < t["d"]) {
        return s["mul"](this["s"]);
      }
    }
    return this;
  }
};

// node_modules/mathjs/lib/esm/type/fraction/Fraction.js
var name3 = "Fraction";
var dependencies4 = [];
var createFractionClass = /* @__PURE__ */ factory(name3, dependencies4, () => {
  Object.defineProperty(Fraction, "name", {
    value: "Fraction"
  });
  Fraction.prototype.constructor = Fraction;
  Fraction.prototype.type = "Fraction";
  Fraction.prototype.isFraction = true;
  Fraction.prototype.toJSON = function() {
    return {
      mathjs: "Fraction",
      n: String(this.s * this.n),
      d: String(this.d)
    };
  };
  Fraction.fromJSON = function(json) {
    return new Fraction(json);
  };
  return Fraction;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/matrix/Matrix.js
var name4 = "Matrix";
var dependencies5 = [];
var createMatrixClass = /* @__PURE__ */ factory(name4, dependencies5, () => {
  function Matrix3() {
    if (!(this instanceof Matrix3)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
  }
  Matrix3.prototype.type = "Matrix";
  Matrix3.prototype.isMatrix = true;
  Matrix3.prototype.storage = function() {
    throw new Error("Cannot invoke storage on a Matrix interface");
  };
  Matrix3.prototype.datatype = function() {
    throw new Error("Cannot invoke datatype on a Matrix interface");
  };
  Matrix3.prototype.create = function(data, datatype) {
    throw new Error("Cannot invoke create on a Matrix interface");
  };
  Matrix3.prototype.subset = function(index2, replacement, defaultValue) {
    throw new Error("Cannot invoke subset on a Matrix interface");
  };
  Matrix3.prototype.get = function(index2) {
    throw new Error("Cannot invoke get on a Matrix interface");
  };
  Matrix3.prototype.set = function(index2, value, defaultValue) {
    throw new Error("Cannot invoke set on a Matrix interface");
  };
  Matrix3.prototype.resize = function(size2, defaultValue) {
    throw new Error("Cannot invoke resize on a Matrix interface");
  };
  Matrix3.prototype.reshape = function(size2, defaultValue) {
    throw new Error("Cannot invoke reshape on a Matrix interface");
  };
  Matrix3.prototype.clone = function() {
    throw new Error("Cannot invoke clone on a Matrix interface");
  };
  Matrix3.prototype.size = function() {
    throw new Error("Cannot invoke size on a Matrix interface");
  };
  Matrix3.prototype.map = function(callback, skipZeros) {
    throw new Error("Cannot invoke map on a Matrix interface");
  };
  Matrix3.prototype.forEach = function(callback) {
    throw new Error("Cannot invoke forEach on a Matrix interface");
  };
  Matrix3.prototype[Symbol.iterator] = function() {
    throw new Error("Cannot iterate a Matrix interface");
  };
  Matrix3.prototype.toArray = function() {
    throw new Error("Cannot invoke toArray on a Matrix interface");
  };
  Matrix3.prototype.valueOf = function() {
    throw new Error("Cannot invoke valueOf on a Matrix interface");
  };
  Matrix3.prototype.format = function(options) {
    throw new Error("Cannot invoke format on a Matrix interface");
  };
  Matrix3.prototype.toString = function() {
    throw new Error("Cannot invoke toString on a Matrix interface");
  };
  return Matrix3;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/utils/bignumber/formatter.js
function formatBigNumberToBase(n, base, size2) {
  var BigNumberCtor = n.constructor;
  var big2 = new BigNumberCtor(2);
  var suffix = "";
  if (size2) {
    if (size2 < 1) {
      throw new Error("size must be in greater than 0");
    }
    if (!isInteger(size2)) {
      throw new Error("size must be an integer");
    }
    if (n.greaterThan(big2.pow(size2 - 1).sub(1)) || n.lessThan(big2.pow(size2 - 1).mul(-1))) {
      throw new Error("Value must be in range [-2^".concat(size2 - 1, ", 2^").concat(size2 - 1, "-1]"));
    }
    if (!n.isInteger()) {
      throw new Error("Value must be an integer");
    }
    if (n.lessThan(0)) {
      n = n.add(big2.pow(size2));
    }
    suffix = "i".concat(size2);
  }
  switch (base) {
    case 2:
      return "".concat(n.toBinary()).concat(suffix);
    case 8:
      return "".concat(n.toOctal()).concat(suffix);
    case 16:
      return "".concat(n.toHexadecimal()).concat(suffix);
    default:
      throw new Error("Base ".concat(base, " not supported "));
  }
}
function format2(value, options) {
  if (typeof options === "function") {
    return options(value);
  }
  if (!value.isFinite()) {
    return value.isNaN() ? "NaN" : value.gt(0) ? "Infinity" : "-Infinity";
  }
  var {
    notation,
    precision,
    wordSize
  } = normalizeFormatOptions(options);
  switch (notation) {
    case "fixed":
      return toFixed2(value, precision);
    case "exponential":
      return toExponential2(value, precision);
    case "engineering":
      return toEngineering2(value, precision);
    case "bin":
      return formatBigNumberToBase(value, 2, wordSize);
    case "oct":
      return formatBigNumberToBase(value, 8, wordSize);
    case "hex":
      return formatBigNumberToBase(value, 16, wordSize);
    case "auto": {
      var lowerExp = _toNumberOrDefault2(options === null || options === void 0 ? void 0 : options.lowerExp, -3);
      var upperExp = _toNumberOrDefault2(options === null || options === void 0 ? void 0 : options.upperExp, 5);
      if (value.isZero()) return "0";
      var str;
      var rounded = value.toSignificantDigits(precision);
      var exp3 = rounded.e;
      if (exp3 >= lowerExp && exp3 < upperExp) {
        str = rounded.toFixed();
      } else {
        str = toExponential2(value, precision);
      }
      return str.replace(/((\.\d*?)(0+))($|e)/, function() {
        var digits2 = arguments[2];
        var e = arguments[4];
        return digits2 !== "." ? digits2 + e : e;
      });
    }
    default:
      throw new Error('Unknown notation "' + notation + '". Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
  }
}
function toEngineering2(value, precision) {
  var e = value.e;
  var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;
  var valueWithoutExp = value.mul(Math.pow(10, -newExp));
  var valueStr = valueWithoutExp.toPrecision(precision);
  if (valueStr.includes("e")) {
    var BigNumber2 = value.constructor;
    valueStr = new BigNumber2(valueStr).toFixed();
  }
  return valueStr + "e" + (e >= 0 ? "+" : "") + newExp.toString();
}
function toExponential2(value, precision) {
  if (precision !== void 0) {
    return value.toExponential(precision - 1);
  } else {
    return value.toExponential();
  }
}
function toFixed2(value, precision) {
  return value.toFixed(precision);
}
function _toNumberOrDefault2(value, defaultValue) {
  if (isNumber(value)) {
    return value;
  } else if (isBigNumber(value)) {
    return value.toNumber();
  } else {
    return defaultValue;
  }
}

// node_modules/mathjs/lib/esm/utils/string.js
function format3(value, options) {
  var result = _format(value, options);
  if (options && typeof options === "object" && "truncate" in options && result.length > options.truncate) {
    return result.substring(0, options.truncate - 3) + "...";
  }
  return result;
}
function _format(value, options) {
  if (typeof value === "number") {
    return format(value, options);
  }
  if (isBigNumber(value)) {
    return format2(value, options);
  }
  if (looksLikeFraction(value)) {
    if (!options || options.fraction !== "decimal") {
      return "".concat(value.s * value.n, "/").concat(value.d);
    } else {
      return value.toString();
    }
  }
  if (Array.isArray(value)) {
    return formatArray(value, options);
  }
  if (isString(value)) {
    return stringify(value);
  }
  if (typeof value === "function") {
    return value.syntax ? String(value.syntax) : "function";
  }
  if (value && typeof value === "object") {
    if (typeof value.format === "function") {
      return value.format(options);
    } else if (value && value.toString(options) !== {}.toString()) {
      return value.toString(options);
    } else {
      var entries = Object.keys(value).map((key) => {
        return stringify(key) + ": " + format3(value[key], options);
      });
      return "{" + entries.join(", ") + "}";
    }
  }
  return String(value);
}
function stringify(value) {
  var text = String(value);
  var escaped = "";
  var i = 0;
  while (i < text.length) {
    var c = text.charAt(i);
    escaped += c in controlCharacters ? controlCharacters[c] : c;
    i++;
  }
  return '"' + escaped + '"';
}
var controlCharacters = {
  '"': '\\"',
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t"
};
function formatArray(array, options) {
  if (Array.isArray(array)) {
    var str = "[";
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i !== 0) {
        str += ", ";
      }
      str += formatArray(array[i], options);
    }
    str += "]";
    return str;
  } else {
    return format3(array, options);
  }
}
function looksLikeFraction(value) {
  return value && typeof value === "object" && typeof value.s === "bigint" && typeof value.n === "bigint" && typeof value.d === "bigint" || false;
}

// node_modules/mathjs/lib/esm/error/DimensionError.js
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError("Constructor must be called with the new operator");
  }
  this.actual = actual;
  this.expected = expected;
  this.relation = relation;
  this.message = "Dimension mismatch (" + (Array.isArray(actual) ? "[" + actual.join(", ") + "]" : actual) + " " + (this.relation || "!=") + " " + (Array.isArray(expected) ? "[" + expected.join(", ") + "]" : expected) + ")";
  this.stack = new Error().stack;
}
DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = "DimensionError";
DimensionError.prototype.isDimensionError = true;

// node_modules/mathjs/lib/esm/error/IndexError.js
function IndexError(index2, min2, max2) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError("Constructor must be called with the new operator");
  }
  this.index = index2;
  if (arguments.length < 3) {
    this.min = 0;
    this.max = min2;
  } else {
    this.min = min2;
    this.max = max2;
  }
  if (this.min !== void 0 && this.index < this.min) {
    this.message = "Index out of range (" + this.index + " < " + this.min + ")";
  } else if (this.max !== void 0 && this.index >= this.max) {
    this.message = "Index out of range (" + this.index + " > " + (this.max - 1) + ")";
  } else {
    this.message = "Index out of range (" + this.index + ")";
  }
  this.stack = new Error().stack;
}
IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = "IndexError";
IndexError.prototype.isIndexError = true;

// node_modules/mathjs/lib/esm/utils/array.js
function arraySize(x) {
  var s = [];
  while (Array.isArray(x)) {
    s.push(x.length);
    x = x[0];
  }
  return s;
}
function _validate(array, size2, dim) {
  var i;
  var len = array.length;
  if (len !== size2[dim]) {
    throw new DimensionError(len, size2[dim]);
  }
  if (dim < size2.length - 1) {
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new DimensionError(size2.length - 1, size2.length, "<");
      }
      _validate(array[i], size2, dimNext);
    }
  } else {
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size2.length + 1, size2.length, ">");
      }
    }
  }
}
function validate(array, size2) {
  var isScalar = size2.length === 0;
  if (isScalar) {
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  } else {
    _validate(array, size2, 0);
  }
}
function validateIndexSourceSize(value, index2) {
  var valueSize = value.isMatrix ? value._size : arraySize(value);
  var sourceSize = index2._sourceSize;
  sourceSize.forEach((sourceDim, i) => {
    if (sourceDim !== null && sourceDim !== valueSize[i]) {
      throw new DimensionError(sourceDim, valueSize[i]);
    }
  });
}
function validateIndex(index2, length) {
  if (index2 !== void 0) {
    if (!isNumber(index2) || !isInteger(index2)) {
      throw new TypeError("Index must be an integer (value: " + index2 + ")");
    }
    if (index2 < 0 || typeof length === "number" && index2 >= length) {
      throw new IndexError(index2, length);
    }
  }
}
function isEmptyIndex(index2) {
  for (var i = 0; i < index2._dimensions.length; ++i) {
    var dimension = index2._dimensions[i];
    if (dimension._data && isArray(dimension._data)) {
      if (dimension._size[0] === 0) {
        return true;
      }
    } else if (dimension.isRange) {
      if (dimension.start === dimension.end) {
        return true;
      }
    } else if (isString(dimension)) {
      if (dimension.length === 0) {
        return true;
      }
    }
  }
  return false;
}
function resize(array, size2, defaultValue) {
  if (!Array.isArray(size2)) {
    throw new TypeError("Array expected");
  }
  if (size2.length === 0) {
    throw new Error("Resizing to scalar is not supported");
  }
  size2.forEach(function(value) {
    if (!isNumber(value) || !isInteger(value) || value < 0) {
      throw new TypeError("Invalid size, must contain positive integers (size: " + format3(size2) + ")");
    }
  });
  if (isNumber(array) || isBigNumber(array)) {
    array = [array];
  }
  var _defaultValue = defaultValue !== void 0 ? defaultValue : 0;
  _resize(array, size2, 0, _defaultValue);
  return array;
}
function _resize(array, size2, dim, defaultValue) {
  var i;
  var elem;
  var oldLen = array.length;
  var newLen = size2[dim];
  var minLen = Math.min(oldLen, newLen);
  array.length = newLen;
  if (dim < size2.length - 1) {
    var dimNext = dim + 1;
    for (i = 0; i < minLen; i++) {
      elem = array[i];
      if (!Array.isArray(elem)) {
        elem = [elem];
        array[i] = elem;
      }
      _resize(elem, size2, dimNext, defaultValue);
    }
    for (i = minLen; i < newLen; i++) {
      elem = [];
      array[i] = elem;
      _resize(elem, size2, dimNext, defaultValue);
    }
  } else {
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0];
      }
    }
    for (i = minLen; i < newLen; i++) {
      array[i] = defaultValue;
    }
  }
}
function reshape(array, sizes) {
  var flatArray = flatten(array);
  var currentLength = flatArray.length;
  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError("Array expected");
  }
  if (sizes.length === 0) {
    throw new DimensionError(0, currentLength, "!=");
  }
  sizes = processSizesWildcard(sizes, currentLength);
  var newLength = product(sizes);
  if (currentLength !== newLength) {
    throw new DimensionError(newLength, currentLength, "!=");
  }
  try {
    return _reshape(flatArray, sizes);
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(newLength, currentLength, "!=");
    }
    throw e;
  }
}
function processSizesWildcard(sizes, currentLength) {
  var newLength = product(sizes);
  var processedSizes = sizes.slice();
  var WILDCARD = -1;
  var wildCardIndex = sizes.indexOf(WILDCARD);
  var isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0;
  if (isMoreThanOneWildcard) {
    throw new Error("More than one wildcard in sizes");
  }
  var hasWildcard = wildCardIndex >= 0;
  var canReplaceWildcard = currentLength % newLength === 0;
  if (hasWildcard) {
    if (canReplaceWildcard) {
      processedSizes[wildCardIndex] = -currentLength / newLength;
    } else {
      throw new Error("Could not replace wildcard, since " + currentLength + " is no multiple of " + -newLength);
    }
  }
  return processedSizes;
}
function product(array) {
  return array.reduce((prev, curr) => prev * curr, 1);
}
function _reshape(array, sizes) {
  var tmpArray = array;
  var tmpArray2;
  for (var sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
    var size2 = sizes[sizeIndex];
    tmpArray2 = [];
    var length = tmpArray.length / size2;
    for (var i = 0; i < length; i++) {
      tmpArray2.push(tmpArray.slice(i * size2, (i + 1) * size2));
    }
    tmpArray = tmpArray2;
  }
  return tmpArray;
}
function unsqueeze(array, dims, outer, size2) {
  var s = size2 || arraySize(array);
  if (outer) {
    for (var i = 0; i < outer; i++) {
      array = [array];
      s.unshift(1);
    }
  }
  array = _unsqueeze(array, dims, 0);
  while (s.length < dims) {
    s.push(1);
  }
  return array;
}
function _unsqueeze(array, dims, dim) {
  var i, ii;
  if (Array.isArray(array)) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next);
    }
  } else {
    for (var d = dim; d < dims; d++) {
      array = [array];
    }
  }
  return array;
}
function flatten(array) {
  if (!Array.isArray(array)) {
    return array;
  }
  var flat = [];
  array.forEach(function callback(value) {
    if (Array.isArray(value)) {
      value.forEach(callback);
    } else {
      flat.push(value);
    }
  });
  return flat;
}
function getArrayDataType(array, typeOf2) {
  var type;
  var length = 0;
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    var _isArray = Array.isArray(item);
    if (i === 0 && _isArray) {
      length = item.length;
    }
    if (_isArray && item.length !== length) {
      return void 0;
    }
    var itemType = _isArray ? getArrayDataType(item, typeOf2) : typeOf2(item);
    if (type === void 0) {
      type = itemType;
    } else if (type !== itemType) {
      return "mixed";
    } else {
    }
  }
  return type;
}
function concatRecursive(a, b, concatDim, dim) {
  if (dim < concatDim) {
    if (a.length !== b.length) {
      throw new DimensionError(a.length, b.length);
    }
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c[i] = concatRecursive(a[i], b[i], concatDim, dim + 1);
    }
    return c;
  } else {
    return a.concat(b);
  }
}
function concat() {
  var arrays = Array.prototype.slice.call(arguments, 0, -1);
  var concatDim = Array.prototype.slice.call(arguments, -1);
  if (arrays.length === 1) {
    return arrays[0];
  }
  if (arrays.length > 1) {
    return arrays.slice(1).reduce(function(A, B) {
      return concatRecursive(A, B, concatDim, 0);
    }, arrays[0]);
  } else {
    throw new Error("Wrong number of arguments in function concat");
  }
}
function broadcastSizes() {
  for (var _len = arguments.length, sizes = new Array(_len), _key = 0; _key < _len; _key++) {
    sizes[_key] = arguments[_key];
  }
  var dimensions = sizes.map((s) => s.length);
  var N = Math.max(...dimensions);
  var sizeMax = new Array(N).fill(null);
  for (var i = 0; i < sizes.length; i++) {
    var size2 = sizes[i];
    var dim = dimensions[i];
    for (var j = 0; j < dim; j++) {
      var n = N - dim + j;
      if (size2[j] > sizeMax[n]) {
        sizeMax[n] = size2[j];
      }
    }
  }
  for (var _i = 0; _i < sizes.length; _i++) {
    checkBroadcastingRules(sizes[_i], sizeMax);
  }
  return sizeMax;
}
function checkBroadcastingRules(size2, toSize) {
  var N = toSize.length;
  var dim = size2.length;
  for (var j = 0; j < dim; j++) {
    var n = N - dim + j;
    if (size2[j] < toSize[n] && size2[j] > 1 || size2[j] > toSize[n]) {
      throw new Error("shape mismatch: mismatch is found in arg with shape (".concat(size2, ") not possible to broadcast dimension ").concat(dim, " with size ").concat(size2[j], " to size ").concat(toSize[n]));
    }
  }
}
function broadcastTo(array, toSize) {
  var Asize = arraySize(array);
  if (deepStrictEqual(Asize, toSize)) {
    return array;
  }
  checkBroadcastingRules(Asize, toSize);
  var broadcastedSize = broadcastSizes(Asize, toSize);
  var N = broadcastedSize.length;
  var paddedSize = [...Array(N - Asize.length).fill(1), ...Asize];
  var A = clone3(array);
  if (Asize.length < N) {
    A = reshape(A, paddedSize);
    Asize = arraySize(A);
  }
  for (var dim = 0; dim < N; dim++) {
    if (Asize[dim] < broadcastedSize[dim]) {
      A = stretch(A, broadcastedSize[dim], dim);
      Asize = arraySize(A);
    }
  }
  return A;
}
function stretch(arrayToStretch, sizeToStretch, dimToStretch) {
  return concat(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch);
}
function get(array, index2) {
  if (!Array.isArray(array)) {
    throw new Error("Array expected");
  }
  var size2 = arraySize(array);
  if (index2.length !== size2.length) {
    throw new DimensionError(index2.length, size2.length);
  }
  for (var x = 0; x < index2.length; x++) {
    validateIndex(index2[x], size2[x]);
  }
  return index2.reduce((acc, curr) => acc[curr], array);
}
function deepMap(array, callback) {
  var skipIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  if (array.length === 0) {
    return [];
  }
  if (skipIndex) {
    return recursiveMap(array);
  }
  var index2 = [];
  return recursiveMapWithIndex(array, 0);
  function recursiveMapWithIndex(value, depth) {
    if (Array.isArray(value)) {
      var N = value.length;
      var result = Array(N);
      for (var i = 0; i < N; i++) {
        index2[depth] = i;
        result[i] = recursiveMapWithIndex(value[i], depth + 1);
      }
      return result;
    } else {
      return callback(value, index2.slice(0, depth), array);
    }
  }
  function recursiveMap(value) {
    if (Array.isArray(value)) {
      var N = value.length;
      var result = Array(N);
      for (var i = 0; i < N; i++) {
        result[i] = recursiveMap(value[i]);
      }
      return result;
    } else {
      return callback(value);
    }
  }
}
function clone3(array) {
  return _extends([], array);
}

// node_modules/mathjs/lib/esm/utils/optimizeCallback.js
var import_typed_function2 = __toESM(require_typed_function(), 1);
function optimizeCallback(callback, array, name51) {
  if (import_typed_function2.default.isTypedFunction(callback)) {
    var firstIndex = (array.isMatrix ? array.size() : arraySize(array)).map(() => 0);
    var firstValue = array.isMatrix ? array.get(firstIndex) : get(array, firstIndex);
    var numberOfArguments = _findNumberOfArguments(callback, firstValue, firstIndex, array);
    var fastCallback;
    if (array.isMatrix && array.dataType !== "mixed" && array.dataType !== void 0) {
      var singleSignature = _findSingleSignatureWithArity(callback, numberOfArguments);
      fastCallback = singleSignature !== void 0 ? singleSignature : callback;
    } else {
      fastCallback = callback;
    }
    if (numberOfArguments >= 1 && numberOfArguments <= 3) {
      return function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return _tryFunctionWithArgs(fastCallback, args.slice(0, numberOfArguments), name51, callback.name);
      };
    }
    return function() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return _tryFunctionWithArgs(fastCallback, args, name51, callback.name);
    };
  }
  return callback;
}
function _findSingleSignatureWithArity(callback, arity) {
  var matchingFunctions = [];
  Object.entries(callback.signatures).forEach((_ref) => {
    var [signature, func] = _ref;
    if (signature.split(",").length === arity) {
      matchingFunctions.push(func);
    }
  });
  if (matchingFunctions.length === 1) {
    return matchingFunctions[0];
  }
}
function _findNumberOfArguments(callback, value, index2, array) {
  var testArgs = [value, index2, array];
  for (var i = 3; i > 0; i--) {
    var args = testArgs.slice(0, i);
    if (import_typed_function2.default.resolve(callback, args) !== null) {
      return i;
    }
  }
}
function _tryFunctionWithArgs(func, args, mappingFnName, callbackName) {
  try {
    return func(...args);
  } catch (err2) {
    _createCallbackError(err2, args, mappingFnName, callbackName);
  }
}
function _createCallbackError(err2, args, mappingFnName, callbackName) {
  var _err$data;
  if (err2 instanceof TypeError && ((_err$data = err2.data) === null || _err$data === void 0 ? void 0 : _err$data.category) === "wrongType") {
    var argsDesc = [];
    argsDesc.push("value: ".concat(typeOf(args[0])));
    if (args.length >= 2) {
      argsDesc.push("index: ".concat(typeOf(args[1])));
    }
    if (args.length >= 3) {
      argsDesc.push("array: ".concat(typeOf(args[2])));
    }
    throw new TypeError("Function ".concat(mappingFnName, " cannot apply callback arguments ") + "".concat(callbackName, "(").concat(argsDesc.join(", "), ") at index ").concat(JSON.stringify(args[1])));
  } else {
    throw new TypeError("Function ".concat(mappingFnName, " cannot apply callback arguments ") + "to function ".concat(callbackName, ": ").concat(err2.message));
  }
}

// node_modules/mathjs/lib/esm/type/matrix/DenseMatrix.js
var name5 = "DenseMatrix";
var dependencies6 = ["Matrix"];
var createDenseMatrixClass = /* @__PURE__ */ factory(name5, dependencies6, (_ref) => {
  var {
    Matrix: Matrix3
  } = _ref;
  function DenseMatrix2(data, datatype) {
    if (!(this instanceof DenseMatrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    if (datatype && !isString(datatype)) {
      throw new Error("Invalid datatype: " + datatype);
    }
    if (isMatrix(data)) {
      if (data.type === "DenseMatrix") {
        this._data = clone(data._data);
        this._size = clone(data._size);
        this._datatype = datatype || data._datatype;
      } else {
        this._data = data.toArray();
        this._size = data.size();
        this._datatype = datatype || data._datatype;
      }
    } else if (data && isArray(data.data) && isArray(data.size)) {
      this._data = data.data;
      this._size = data.size;
      validate(this._data, this._size);
      this._datatype = datatype || data.datatype;
    } else if (isArray(data)) {
      this._data = preprocess(data);
      this._size = arraySize(this._data);
      validate(this._data, this._size);
      this._datatype = datatype;
    } else if (data) {
      throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
    } else {
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
    }
  }
  DenseMatrix2.prototype = new Matrix3();
  DenseMatrix2.prototype.createDenseMatrix = function(data, datatype) {
    return new DenseMatrix2(data, datatype);
  };
  Object.defineProperty(DenseMatrix2, "name", {
    value: "DenseMatrix"
  });
  DenseMatrix2.prototype.constructor = DenseMatrix2;
  DenseMatrix2.prototype.type = "DenseMatrix";
  DenseMatrix2.prototype.isDenseMatrix = true;
  DenseMatrix2.prototype.getDataType = function() {
    return getArrayDataType(this._data, typeOf);
  };
  DenseMatrix2.prototype.storage = function() {
    return "dense";
  };
  DenseMatrix2.prototype.datatype = function() {
    return this._datatype;
  };
  DenseMatrix2.prototype.create = function(data, datatype) {
    return new DenseMatrix2(data, datatype);
  };
  DenseMatrix2.prototype.subset = function(index2, replacement, defaultValue) {
    switch (arguments.length) {
      case 1:
        return _get(this, index2);
      // intentional fall through
      case 2:
      case 3:
        return _set(this, index2, replacement, defaultValue);
      default:
        throw new SyntaxError("Wrong number of arguments");
    }
  };
  DenseMatrix2.prototype.get = function(index2) {
    return get(this._data, index2);
  };
  DenseMatrix2.prototype.set = function(index2, value, defaultValue) {
    if (!isArray(index2)) {
      throw new TypeError("Array expected");
    }
    if (index2.length < this._size.length) {
      throw new DimensionError(index2.length, this._size.length, "<");
    }
    var i, ii, indexI;
    var size2 = index2.map(function(i2) {
      return i2 + 1;
    });
    _fit(this, size2, defaultValue);
    var data = this._data;
    for (i = 0, ii = index2.length - 1; i < ii; i++) {
      indexI = index2[i];
      validateIndex(indexI, data.length);
      data = data[indexI];
    }
    indexI = index2[index2.length - 1];
    validateIndex(indexI, data.length);
    data[indexI] = value;
    return this;
  };
  function _get(matrix2, index2) {
    if (!isIndex(index2)) {
      throw new TypeError("Invalid index");
    }
    var isScalar = index2.isScalar();
    if (isScalar) {
      return matrix2.get(index2.min());
    } else {
      var size2 = index2.size();
      if (size2.length !== matrix2._size.length) {
        throw new DimensionError(size2.length, matrix2._size.length);
      }
      var min2 = index2.min();
      var max2 = index2.max();
      for (var i = 0, ii = matrix2._size.length; i < ii; i++) {
        validateIndex(min2[i], matrix2._size[i]);
        validateIndex(max2[i], matrix2._size[i]);
      }
      return new DenseMatrix2(_getSubmatrix(matrix2._data, index2, size2.length, 0), matrix2._datatype);
    }
  }
  function _getSubmatrix(data, index2, dims, dim) {
    var last = dim === dims - 1;
    var range2 = index2.dimension(dim);
    if (last) {
      return range2.map(function(i) {
        validateIndex(i, data.length);
        return data[i];
      }).valueOf();
    } else {
      return range2.map(function(i) {
        validateIndex(i, data.length);
        var child = data[i];
        return _getSubmatrix(child, index2, dims, dim + 1);
      }).valueOf();
    }
  }
  function _set(matrix2, index2, submatrix, defaultValue) {
    if (!index2 || index2.isIndex !== true) {
      throw new TypeError("Invalid index");
    }
    var iSize = index2.size();
    var isScalar = index2.isScalar();
    var sSize;
    if (isMatrix(submatrix)) {
      sSize = submatrix.size();
      submatrix = submatrix.valueOf();
    } else {
      sSize = arraySize(submatrix);
    }
    if (isScalar) {
      if (sSize.length !== 0) {
        throw new TypeError("Scalar expected");
      }
      matrix2.set(index2.min(), submatrix, defaultValue);
    } else {
      if (!deepStrictEqual(sSize, iSize)) {
        try {
          if (sSize.length === 0) {
            submatrix = broadcastTo([submatrix], iSize);
          } else {
            submatrix = broadcastTo(submatrix, iSize);
          }
          sSize = arraySize(submatrix);
        } catch (_unused) {
        }
      }
      if (iSize.length < matrix2._size.length) {
        throw new DimensionError(iSize.length, matrix2._size.length, "<");
      }
      if (sSize.length < iSize.length) {
        var i = 0;
        var outer = 0;
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }
        while (iSize[i] === 1) {
          outer++;
          i++;
        }
        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
      }
      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, ">");
      }
      var size2 = index2.max().map(function(i2) {
        return i2 + 1;
      });
      _fit(matrix2, size2, defaultValue);
      var dims = iSize.length;
      var dim = 0;
      _setSubmatrix(matrix2._data, index2, submatrix, dims, dim);
    }
    return matrix2;
  }
  function _setSubmatrix(data, index2, submatrix, dims, dim) {
    var last = dim === dims - 1;
    var range2 = index2.dimension(dim);
    if (last) {
      range2.forEach(function(dataIndex, subIndex) {
        validateIndex(dataIndex);
        data[dataIndex] = submatrix[subIndex[0]];
      });
    } else {
      range2.forEach(function(dataIndex, subIndex) {
        validateIndex(dataIndex);
        _setSubmatrix(data[dataIndex], index2, submatrix[subIndex[0]], dims, dim + 1);
      });
    }
  }
  DenseMatrix2.prototype.resize = function(size2, defaultValue, copy) {
    if (!isCollection(size2)) {
      throw new TypeError("Array or Matrix expected");
    }
    var sizeArray = size2.valueOf().map((value) => {
      return Array.isArray(value) && value.length === 1 ? value[0] : value;
    });
    var m = copy ? this.clone() : this;
    return _resize2(m, sizeArray, defaultValue);
  };
  function _resize2(matrix2, size2, defaultValue) {
    if (size2.length === 0) {
      var v = matrix2._data;
      while (isArray(v)) {
        v = v[0];
      }
      return v;
    }
    matrix2._size = size2.slice(0);
    matrix2._data = resize(matrix2._data, matrix2._size, defaultValue);
    return matrix2;
  }
  DenseMatrix2.prototype.reshape = function(size2, copy) {
    var m = copy ? this.clone() : this;
    m._data = reshape(m._data, size2);
    var currentLength = m._size.reduce((length, size3) => length * size3);
    m._size = processSizesWildcard(size2, currentLength);
    return m;
  };
  function _fit(matrix2, size2, defaultValue) {
    var newSize = matrix2._size.slice(0);
    var changed = false;
    while (newSize.length < size2.length) {
      newSize.push(0);
      changed = true;
    }
    for (var i = 0, ii = size2.length; i < ii; i++) {
      if (size2[i] > newSize[i]) {
        newSize[i] = size2[i];
        changed = true;
      }
    }
    if (changed) {
      _resize2(matrix2, newSize, defaultValue);
    }
  }
  DenseMatrix2.prototype.clone = function() {
    var m = new DenseMatrix2({
      data: clone(this._data),
      size: clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  DenseMatrix2.prototype.size = function() {
    return this._size.slice(0);
  };
  DenseMatrix2.prototype._forEach = function(callback) {
    var me = this;
    var s = me.size();
    var maxDepth = s.length - 1;
    if (maxDepth < 0) {
      return;
    }
    if (maxDepth === 0) {
      var thisSize = s[0];
      for (var i = 0; i < thisSize; i++) {
        callback(me._data, i, [i]);
      }
      return;
    }
    var index2 = Array(s.length);
    function recurse(data, depth) {
      var thisSize2 = s[depth];
      if (depth < maxDepth) {
        for (var _i = 0; _i < thisSize2; _i++) {
          index2[depth] = _i;
          recurse(data[_i], depth + 1);
        }
      } else {
        for (var _i2 = 0; _i2 < thisSize2; _i2++) {
          index2[depth] = _i2;
          callback(data, _i2, index2.slice());
        }
      }
    }
    recurse(me._data, 0);
  };
  DenseMatrix2.prototype.map = function(callback) {
    var me = this;
    var result = new DenseMatrix2(me);
    var fastCallback = optimizeCallback(callback, me._data, "map");
    result._forEach(function(arr, i, index2) {
      arr[i] = fastCallback(arr[i], index2, me);
    });
    return result;
  };
  DenseMatrix2.prototype.forEach = function(callback) {
    var me = this;
    var fastCallback = optimizeCallback(callback, me._data, "map");
    me._forEach(function(arr, i, index2) {
      fastCallback(arr[i], index2, me);
    });
  };
  DenseMatrix2.prototype[Symbol.iterator] = function* () {
    var maxDepth = this._size.length - 1;
    if (maxDepth < 0) {
      return;
    }
    if (maxDepth === 0) {
      for (var i = 0; i < this._data.length; i++) {
        yield {
          value: this._data[i],
          index: [i]
        };
      }
      return;
    }
    var index2 = [];
    var _recurse = function* recurse(value, depth) {
      if (depth < maxDepth) {
        for (var _i3 = 0; _i3 < value.length; _i3++) {
          index2[depth] = _i3;
          yield* _recurse(value[_i3], depth + 1);
        }
      } else {
        for (var _i4 = 0; _i4 < value.length; _i4++) {
          index2[depth] = _i4;
          yield {
            value: value[_i4],
            index: index2.slice()
          };
        }
      }
    };
    yield* _recurse(this._data, 0);
  };
  DenseMatrix2.prototype.rows = function() {
    var result = [];
    var s = this.size();
    if (s.length !== 2) {
      throw new TypeError("Rows can only be returned for a 2D matrix.");
    }
    var data = this._data;
    for (var row of data) {
      result.push(new DenseMatrix2([row], this._datatype));
    }
    return result;
  };
  DenseMatrix2.prototype.columns = function() {
    var _this = this;
    var result = [];
    var s = this.size();
    if (s.length !== 2) {
      throw new TypeError("Rows can only be returned for a 2D matrix.");
    }
    var data = this._data;
    var _loop = function _loop2(i2) {
      var col = data.map((row) => [row[i2]]);
      result.push(new DenseMatrix2(col, _this._datatype));
    };
    for (var i = 0; i < s[1]; i++) {
      _loop(i);
    }
    return result;
  };
  DenseMatrix2.prototype.toArray = function() {
    return clone(this._data);
  };
  DenseMatrix2.prototype.valueOf = function() {
    return this._data;
  };
  DenseMatrix2.prototype.format = function(options) {
    return format3(this._data, options);
  };
  DenseMatrix2.prototype.toString = function() {
    return format3(this._data);
  };
  DenseMatrix2.prototype.toJSON = function() {
    return {
      mathjs: "DenseMatrix",
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };
  DenseMatrix2.prototype.diagonal = function(k) {
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = this._size[0];
    var columns = this._size[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var data = [];
    for (var i = 0; i < n; i++) {
      data[i] = this._data[i + kSub][i + kSuper];
    }
    return new DenseMatrix2({
      data,
      size: [n],
      datatype: this._datatype
    });
  };
  DenseMatrix2.diagonal = function(size2, value, k, defaultValue) {
    if (!isArray(size2)) {
      throw new TypeError("Array expected, size parameter");
    }
    if (size2.length !== 2) {
      throw new Error("Only two dimensions matrix are supported");
    }
    size2 = size2.map(function(s) {
      if (isBigNumber(s)) {
        s = s.toNumber();
      }
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error("Size values must be positive integers");
      }
      return s;
    });
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = size2[0];
    var columns = size2[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var _value;
    if (isArray(value)) {
      if (value.length !== n) {
        throw new Error("Invalid value array length");
      }
      _value = function _value2(i) {
        return value[i];
      };
    } else if (isMatrix(value)) {
      var ms = value.size();
      if (ms.length !== 1 || ms[0] !== n) {
        throw new Error("Invalid matrix length");
      }
      _value = function _value2(i) {
        return value.get([i]);
      };
    } else {
      _value = function _value2() {
        return value;
      };
    }
    if (!defaultValue) {
      defaultValue = isBigNumber(_value(0)) ? _value(0).mul(0) : 0;
    }
    var data = [];
    if (size2.length > 0) {
      data = resize(data, size2, defaultValue);
      for (var d = 0; d < n; d++) {
        data[d + kSub][d + kSuper] = _value(d);
      }
    }
    return new DenseMatrix2({
      data,
      size: [rows, columns]
    });
  };
  DenseMatrix2.fromJSON = function(json) {
    return new DenseMatrix2(json);
  };
  DenseMatrix2.prototype.swapRows = function(i, j) {
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error("Row index must be positive integers");
    }
    if (this._size.length !== 2) {
      throw new Error("Only two dimensional matrix is supported");
    }
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);
    DenseMatrix2._swapRows(i, j, this._data);
    return this;
  };
  DenseMatrix2._swapRows = function(i, j, data) {
    var vi = data[i];
    data[i] = data[j];
    data[j] = vi;
  };
  function preprocess(data) {
    if (isMatrix(data)) {
      return preprocess(data.valueOf());
    }
    if (isArray(data)) {
      return data.map(preprocess);
    }
    return data;
  }
  return DenseMatrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/utils/collection.js
function deepMap2(array, callback, skipZeros) {
  if (!skipZeros) {
    if (isMatrix(array)) {
      return array.map((x) => callback(x));
    } else {
      return deepMap(array, callback, true);
    }
  }
  var skipZerosCallback = (x) => x === 0 ? x : callback(x);
  if (isMatrix(array)) {
    return array.map((x) => skipZerosCallback(x));
  } else {
    return deepMap(array, skipZerosCallback, true);
  }
}

// node_modules/mathjs/lib/esm/function/utils/isInteger.js
var name6 = "isInteger";
var dependencies7 = ["typed"];
var createIsInteger = /* @__PURE__ */ factory(name6, dependencies7, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name6, {
    number: isInteger,
    // TODO: what to do with isInteger(add(0.1, 0.2))  ?
    BigNumber: function BigNumber2(x) {
      return x.isInt();
    },
    bigint: function bigint(x) {
      return true;
    },
    Fraction: function Fraction3(x) {
      return x.d === 1n;
    },
    "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap2(x, self2))
  });
});

// node_modules/mathjs/lib/esm/plain/number/arithmetic.js
var n1 = "number";
var n2 = "number, number";
function absNumber(a) {
  return Math.abs(a);
}
absNumber.signature = n1;
function addNumber(a, b) {
  return a + b;
}
addNumber.signature = n2;
function subtractNumber(a, b) {
  return a - b;
}
subtractNumber.signature = n2;
function multiplyNumber(a, b) {
  return a * b;
}
multiplyNumber.signature = n2;
function divideNumber(a, b) {
  return a / b;
}
divideNumber.signature = n2;
function unaryMinusNumber(x) {
  return -x;
}
unaryMinusNumber.signature = n1;
function unaryPlusNumber(x) {
  return x;
}
unaryPlusNumber.signature = n1;
function cbrtNumber(x) {
  return cbrt(x);
}
cbrtNumber.signature = n1;
function cubeNumber(x) {
  return x * x * x;
}
cubeNumber.signature = n1;
function expNumber(x) {
  return Math.exp(x);
}
expNumber.signature = n1;
function expm1Number(x) {
  return expm1(x);
}
expm1Number.signature = n1;
function gcdNumber(a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Parameters in function gcd must be integer numbers");
  }
  var r;
  while (b !== 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return a < 0 ? -a : a;
}
gcdNumber.signature = n2;
function lcmNumber(a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Parameters in function lcm must be integer numbers");
  }
  if (a === 0 || b === 0) {
    return 0;
  }
  var t;
  var prod = a * b;
  while (b !== 0) {
    t = b;
    b = a % t;
    a = t;
  }
  return Math.abs(prod / a);
}
lcmNumber.signature = n2;
function log10Number(x) {
  return log10(x);
}
log10Number.signature = n1;
function log2Number(x) {
  return log2(x);
}
log2Number.signature = n1;
function log1pNumber(x) {
  return log1p(x);
}
log1pNumber.signature = n1;
function modNumber(x, y) {
  return y === 0 ? x : x - y * Math.floor(x / y);
}
modNumber.signature = n2;
function signNumber(x) {
  return sign(x);
}
signNumber.signature = n1;
function sqrtNumber(x) {
  return Math.sqrt(x);
}
sqrtNumber.signature = n1;
function squareNumber(x) {
  return x * x;
}
squareNumber.signature = n1;
function xgcdNumber(a, b) {
  var t;
  var q;
  var r;
  var x = 0;
  var lastx = 1;
  var y = 1;
  var lasty = 0;
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Parameters in function xgcd must be integer numbers");
  }
  while (b) {
    q = Math.floor(a / b);
    r = a - q * b;
    t = x;
    x = lastx - q * x;
    lastx = t;
    t = y;
    y = lasty - q * y;
    lasty = t;
    a = b;
    b = r;
  }
  var res;
  if (a < 0) {
    res = [-a, -lastx, -lasty];
  } else {
    res = [a, a ? lastx : 0, lasty];
  }
  return res;
}
xgcdNumber.signature = n2;
function powNumber(x, y) {
  if (x * x < 1 && y === Infinity || x * x > 1 && y === -Infinity) {
    return 0;
  }
  return Math.pow(x, y);
}
powNumber.signature = n2;
function normNumber(x) {
  return Math.abs(x);
}
normNumber.signature = n1;

// node_modules/mathjs/lib/esm/plain/number/utils.js
var n12 = "number";
function isIntegerNumber(x) {
  return isInteger(x);
}
isIntegerNumber.signature = n12;
function isNegativeNumber(x) {
  return x < 0;
}
isNegativeNumber.signature = n12;
function isPositiveNumber(x) {
  return x > 0;
}
isPositiveNumber.signature = n12;
function isZeroNumber(x) {
  return x === 0;
}
isZeroNumber.signature = n12;
function isNaNNumber(x) {
  return Number.isNaN(x);
}
isNaNNumber.signature = n12;

// node_modules/mathjs/lib/esm/utils/bignumber/nearlyEqual.js
function nearlyEqual2(a, b) {
  var relTol = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1e-9;
  var absTol = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
  if (relTol <= 0) {
    throw new Error("Relative tolerance must be greater than 0");
  }
  if (absTol < 0) {
    throw new Error("Absolute tolerance must be at least 0");
  }
  if (a.isNaN() || b.isNaN()) {
    return false;
  }
  if (!a.isFinite() || !b.isFinite()) {
    return a.eq(b);
  }
  if (a.eq(b)) {
    return true;
  }
  return a.minus(b).abs().lte(a.constructor.max(a.constructor.max(a.abs(), b.abs()).mul(relTol), absTol));
}

// node_modules/mathjs/lib/esm/function/utils/isPositive.js
var name7 = "isPositive";
var dependencies8 = ["typed", "config"];
var createIsPositive = /* @__PURE__ */ factory(name7, dependencies8, (_ref) => {
  var {
    typed: typed3,
    config: config4
  } = _ref;
  return typed3(name7, {
    number: (x) => nearlyEqual(x, 0, config4.relTol, config4.absTol) ? false : isPositiveNumber(x),
    BigNumber: (x) => nearlyEqual2(x, new x.constructor(0), config4.relTol, config4.absTol) ? false : !x.isNeg() && !x.isZero() && !x.isNaN(),
    bigint: (x) => x > 0n,
    Fraction: (x) => x.s > 0n && x.n > 0n,
    Unit: typed3.referToSelf((self2) => (x) => typed3.find(self2, x.valueType())(x.value)),
    "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap2(x, self2))
  });
});

// node_modules/mathjs/lib/esm/utils/complex.js
function complexEquals(x, y, relTol, absTol) {
  return nearlyEqual(x.re, y.re, relTol, absTol) && nearlyEqual(x.im, y.im, relTol, absTol);
}

// node_modules/mathjs/lib/esm/function/relational/compareUnits.js
var createCompareUnits = /* @__PURE__ */ factory("compareUnits", ["typed"], (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return {
    "Unit, Unit": typed3.referToSelf((self2) => (x, y) => {
      if (!x.equalBase(y)) {
        throw new Error("Cannot compare units with different base");
      }
      return typed3.find(self2, [x.valueType(), y.valueType()])(x.value, y.value);
    })
  };
});

// node_modules/mathjs/lib/esm/function/relational/equalScalar.js
var name8 = "equalScalar";
var dependencies9 = ["typed", "config"];
var createEqualScalar = /* @__PURE__ */ factory(name8, dependencies9, (_ref) => {
  var {
    typed: typed3,
    config: config4
  } = _ref;
  var compareUnits = createCompareUnits({
    typed: typed3
  });
  return typed3(name8, {
    "boolean, boolean": function boolean_boolean(x, y) {
      return x === y;
    },
    "number, number": function number_number(x, y) {
      return nearlyEqual(x, y, config4.relTol, config4.absTol);
    },
    "BigNumber, BigNumber": function BigNumber_BigNumber(x, y) {
      return x.eq(y) || nearlyEqual2(x, y, config4.relTol, config4.absTol);
    },
    "bigint, bigint": function bigint_bigint(x, y) {
      return x === y;
    },
    "Fraction, Fraction": function Fraction_Fraction(x, y) {
      return x.equals(y);
    },
    "Complex, Complex": function Complex_Complex(x, y) {
      return complexEquals(x, y, config4.relTol, config4.absTol);
    }
  }, compareUnits);
});
var createEqualScalarNumber = factory(name8, ["typed", "config"], (_ref2) => {
  var {
    typed: typed3,
    config: config4
  } = _ref2;
  return typed3(name8, {
    "number, number": function number_number(x, y) {
      return nearlyEqual(x, y, config4.relTol, config4.absTol);
    }
  });
});

// node_modules/mathjs/lib/esm/type/matrix/SparseMatrix.js
var name9 = "SparseMatrix";
var dependencies10 = ["typed", "equalScalar", "Matrix"];
var createSparseMatrixClass = /* @__PURE__ */ factory(name9, dependencies10, (_ref) => {
  var {
    typed: typed3,
    equalScalar: equalScalar2,
    Matrix: Matrix3
  } = _ref;
  function SparseMatrix2(data, datatype) {
    if (!(this instanceof SparseMatrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    if (datatype && !isString(datatype)) {
      throw new Error("Invalid datatype: " + datatype);
    }
    if (isMatrix(data)) {
      _createFromMatrix(this, data, datatype);
    } else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
      this._datatype = datatype || data.datatype;
    } else if (isArray(data)) {
      _createFromArray(this, data, datatype);
    } else if (data) {
      throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
    } else {
      this._values = [];
      this._index = [];
      this._ptr = [0];
      this._size = [0, 0];
      this._datatype = datatype;
    }
  }
  function _createFromMatrix(matrix2, source, datatype) {
    if (source.type === "SparseMatrix") {
      matrix2._values = source._values ? clone(source._values) : void 0;
      matrix2._index = clone(source._index);
      matrix2._ptr = clone(source._ptr);
      matrix2._size = clone(source._size);
      matrix2._datatype = datatype || source._datatype;
    } else {
      _createFromArray(matrix2, source.valueOf(), datatype || source._datatype);
    }
  }
  function _createFromArray(matrix2, data, datatype) {
    matrix2._values = [];
    matrix2._index = [];
    matrix2._ptr = [];
    matrix2._datatype = datatype;
    var rows = data.length;
    var columns = 0;
    var eq = equalScalar2;
    var zero2 = 0;
    if (isString(datatype)) {
      eq = typed3.find(equalScalar2, [datatype, datatype]) || equalScalar2;
      zero2 = typed3.convert(0, datatype);
    }
    if (rows > 0) {
      var j = 0;
      do {
        matrix2._ptr.push(matrix2._index.length);
        for (var i = 0; i < rows; i++) {
          var row = data[i];
          if (isArray(row)) {
            if (j === 0 && columns < row.length) {
              columns = row.length;
            }
            if (j < row.length) {
              var v = row[j];
              if (!eq(v, zero2)) {
                matrix2._values.push(v);
                matrix2._index.push(i);
              }
            }
          } else {
            if (j === 0 && columns < 1) {
              columns = 1;
            }
            if (!eq(row, zero2)) {
              matrix2._values.push(row);
              matrix2._index.push(i);
            }
          }
        }
        j++;
      } while (j < columns);
    }
    matrix2._ptr.push(matrix2._index.length);
    matrix2._size = [rows, columns];
  }
  SparseMatrix2.prototype = new Matrix3();
  SparseMatrix2.prototype.createSparseMatrix = function(data, datatype) {
    return new SparseMatrix2(data, datatype);
  };
  Object.defineProperty(SparseMatrix2, "name", {
    value: "SparseMatrix"
  });
  SparseMatrix2.prototype.constructor = SparseMatrix2;
  SparseMatrix2.prototype.type = "SparseMatrix";
  SparseMatrix2.prototype.isSparseMatrix = true;
  SparseMatrix2.prototype.getDataType = function() {
    return getArrayDataType(this._values, typeOf);
  };
  SparseMatrix2.prototype.storage = function() {
    return "sparse";
  };
  SparseMatrix2.prototype.datatype = function() {
    return this._datatype;
  };
  SparseMatrix2.prototype.create = function(data, datatype) {
    return new SparseMatrix2(data, datatype);
  };
  SparseMatrix2.prototype.density = function() {
    var rows = this._size[0];
    var columns = this._size[1];
    return rows !== 0 && columns !== 0 ? this._index.length / (rows * columns) : 0;
  };
  SparseMatrix2.prototype.subset = function(index2, replacement, defaultValue) {
    if (!this._values) {
      throw new Error("Cannot invoke subset on a Pattern only matrix");
    }
    switch (arguments.length) {
      case 1:
        return _getsubset(this, index2);
      // intentional fall through
      case 2:
      case 3:
        return _setsubset(this, index2, replacement, defaultValue);
      default:
        throw new SyntaxError("Wrong number of arguments");
    }
  };
  function _getsubset(matrix2, idx) {
    if (!isIndex(idx)) {
      throw new TypeError("Invalid index");
    }
    var isScalar = idx.isScalar();
    if (isScalar) {
      return matrix2.get(idx.min());
    }
    var size2 = idx.size();
    if (size2.length !== matrix2._size.length) {
      throw new DimensionError(size2.length, matrix2._size.length);
    }
    var i, ii, k, kk;
    var min2 = idx.min();
    var max2 = idx.max();
    for (i = 0, ii = matrix2._size.length; i < ii; i++) {
      validateIndex(min2[i], matrix2._size[i]);
      validateIndex(max2[i], matrix2._size[i]);
    }
    var mvalues = matrix2._values;
    var mindex = matrix2._index;
    var mptr = matrix2._ptr;
    var rows = idx.dimension(0);
    var columns = idx.dimension(1);
    var w = [];
    var pv = [];
    rows.forEach(function(i2, r) {
      pv[i2] = r[0];
      w[i2] = true;
    });
    var values = mvalues ? [] : void 0;
    var index2 = [];
    var ptr = [];
    columns.forEach(function(j) {
      ptr.push(index2.length);
      for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
        i = mindex[k];
        if (w[i] === true) {
          index2.push(pv[i]);
          if (values) {
            values.push(mvalues[k]);
          }
        }
      }
    });
    ptr.push(index2.length);
    return new SparseMatrix2({
      values,
      index: index2,
      ptr,
      size: size2,
      datatype: matrix2._datatype
    });
  }
  function _setsubset(matrix2, index2, submatrix, defaultValue) {
    if (!index2 || index2.isIndex !== true) {
      throw new TypeError("Invalid index");
    }
    var iSize = index2.size();
    var isScalar = index2.isScalar();
    var sSize;
    if (isMatrix(submatrix)) {
      sSize = submatrix.size();
      submatrix = submatrix.toArray();
    } else {
      sSize = arraySize(submatrix);
    }
    if (isScalar) {
      if (sSize.length !== 0) {
        throw new TypeError("Scalar expected");
      }
      matrix2.set(index2.min(), submatrix, defaultValue);
    } else {
      if (iSize.length !== 1 && iSize.length !== 2) {
        throw new DimensionError(iSize.length, matrix2._size.length, "<");
      }
      if (sSize.length < iSize.length) {
        var i = 0;
        var outer = 0;
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }
        while (iSize[i] === 1) {
          outer++;
          i++;
        }
        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
      }
      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, ">");
      }
      if (iSize.length === 1) {
        var range2 = index2.dimension(0);
        range2.forEach(function(dataIndex, subIndex) {
          validateIndex(dataIndex);
          matrix2.set([dataIndex, 0], submatrix[subIndex[0]], defaultValue);
        });
      } else {
        var firstDimensionRange = index2.dimension(0);
        var secondDimensionRange = index2.dimension(1);
        firstDimensionRange.forEach(function(firstDataIndex, firstSubIndex) {
          validateIndex(firstDataIndex);
          secondDimensionRange.forEach(function(secondDataIndex, secondSubIndex) {
            validateIndex(secondDataIndex);
            matrix2.set([firstDataIndex, secondDataIndex], submatrix[firstSubIndex[0]][secondSubIndex[0]], defaultValue);
          });
        });
      }
    }
    return matrix2;
  }
  SparseMatrix2.prototype.get = function(index2) {
    if (!isArray(index2)) {
      throw new TypeError("Array expected");
    }
    if (index2.length !== this._size.length) {
      throw new DimensionError(index2.length, this._size.length);
    }
    if (!this._values) {
      throw new Error("Cannot invoke get on a Pattern only matrix");
    }
    var i = index2[0];
    var j = index2[1];
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[1]);
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      return this._values[k];
    }
    return 0;
  };
  SparseMatrix2.prototype.set = function(index2, v, defaultValue) {
    if (!isArray(index2)) {
      throw new TypeError("Array expected");
    }
    if (index2.length !== this._size.length) {
      throw new DimensionError(index2.length, this._size.length);
    }
    if (!this._values) {
      throw new Error("Cannot invoke set on a Pattern only matrix");
    }
    var i = index2[0];
    var j = index2[1];
    var rows = this._size[0];
    var columns = this._size[1];
    var eq = equalScalar2;
    var zero2 = 0;
    if (isString(this._datatype)) {
      eq = typed3.find(equalScalar2, [this._datatype, this._datatype]) || equalScalar2;
      zero2 = typed3.convert(0, this._datatype);
    }
    if (i > rows - 1 || j > columns - 1) {
      _resize2(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue);
      rows = this._size[0];
      columns = this._size[1];
    }
    validateIndex(i, rows);
    validateIndex(j, columns);
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      if (!eq(v, zero2)) {
        this._values[k] = v;
      } else {
        _remove(k, j, this._values, this._index, this._ptr);
      }
    } else {
      if (!eq(v, zero2)) {
        _insert(k, i, j, v, this._values, this._index, this._ptr);
      }
    }
    return this;
  };
  function _getValueIndex(i, top, bottom, index2) {
    if (bottom - top === 0) {
      return bottom;
    }
    for (var r = top; r < bottom; r++) {
      if (index2[r] === i) {
        return r;
      }
    }
    return top;
  }
  function _remove(k, j, values, index2, ptr) {
    values.splice(k, 1);
    index2.splice(k, 1);
    for (var x = j + 1; x < ptr.length; x++) {
      ptr[x]--;
    }
  }
  function _insert(k, i, j, v, values, index2, ptr) {
    values.splice(k, 0, v);
    index2.splice(k, 0, i);
    for (var x = j + 1; x < ptr.length; x++) {
      ptr[x]++;
    }
  }
  SparseMatrix2.prototype.resize = function(size2, defaultValue, copy) {
    if (!isCollection(size2)) {
      throw new TypeError("Array or Matrix expected");
    }
    var sizeArray = size2.valueOf().map((value) => {
      return Array.isArray(value) && value.length === 1 ? value[0] : value;
    });
    if (sizeArray.length !== 2) {
      throw new Error("Only two dimensions matrix are supported");
    }
    sizeArray.forEach(function(value) {
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new TypeError("Invalid size, must contain positive integers (size: " + format3(sizeArray) + ")");
      }
    });
    var m = copy ? this.clone() : this;
    return _resize2(m, sizeArray[0], sizeArray[1], defaultValue);
  };
  function _resize2(matrix2, rows, columns, defaultValue) {
    var value = defaultValue || 0;
    var eq = equalScalar2;
    var zero2 = 0;
    if (isString(matrix2._datatype)) {
      eq = typed3.find(equalScalar2, [matrix2._datatype, matrix2._datatype]) || equalScalar2;
      zero2 = typed3.convert(0, matrix2._datatype);
      value = typed3.convert(value, matrix2._datatype);
    }
    var ins = !eq(value, zero2);
    var r = matrix2._size[0];
    var c = matrix2._size[1];
    var i, j, k;
    if (columns > c) {
      for (j = c; j < columns; j++) {
        matrix2._ptr[j] = matrix2._values.length;
        if (ins) {
          for (i = 0; i < r; i++) {
            matrix2._values.push(value);
            matrix2._index.push(i);
          }
        }
      }
      matrix2._ptr[columns] = matrix2._values.length;
    } else if (columns < c) {
      matrix2._ptr.splice(columns + 1, c - columns);
      matrix2._values.splice(matrix2._ptr[columns], matrix2._values.length);
      matrix2._index.splice(matrix2._ptr[columns], matrix2._index.length);
    }
    c = columns;
    if (rows > r) {
      if (ins) {
        var n = 0;
        for (j = 0; j < c; j++) {
          matrix2._ptr[j] = matrix2._ptr[j] + n;
          k = matrix2._ptr[j + 1] + n;
          var p = 0;
          for (i = r; i < rows; i++, p++) {
            matrix2._values.splice(k + p, 0, value);
            matrix2._index.splice(k + p, 0, i);
            n++;
          }
        }
        matrix2._ptr[c] = matrix2._values.length;
      }
    } else if (rows < r) {
      var d = 0;
      for (j = 0; j < c; j++) {
        matrix2._ptr[j] = matrix2._ptr[j] - d;
        var k0 = matrix2._ptr[j];
        var k1 = matrix2._ptr[j + 1] - d;
        for (k = k0; k < k1; k++) {
          i = matrix2._index[k];
          if (i > rows - 1) {
            matrix2._values.splice(k, 1);
            matrix2._index.splice(k, 1);
            d++;
          }
        }
      }
      matrix2._ptr[j] = matrix2._values.length;
    }
    matrix2._size[0] = rows;
    matrix2._size[1] = columns;
    return matrix2;
  }
  SparseMatrix2.prototype.reshape = function(sizes, copy) {
    if (!isArray(sizes)) {
      throw new TypeError("Array expected");
    }
    if (sizes.length !== 2) {
      throw new Error("Sparse matrices can only be reshaped in two dimensions");
    }
    sizes.forEach(function(value) {
      if (!isNumber(value) || !isInteger(value) || value <= -2 || value === 0) {
        throw new TypeError("Invalid size, must contain positive integers or -1 (size: " + format3(sizes) + ")");
      }
    });
    var currentLength = this._size[0] * this._size[1];
    sizes = processSizesWildcard(sizes, currentLength);
    var newLength = sizes[0] * sizes[1];
    if (currentLength !== newLength) {
      throw new Error("Reshaping sparse matrix will result in the wrong number of elements");
    }
    var m = copy ? this.clone() : this;
    if (this._size[0] === sizes[0] && this._size[1] === sizes[1]) {
      return m;
    }
    var colIndex = [];
    for (var i = 0; i < m._ptr.length; i++) {
      for (var j = 0; j < m._ptr[i + 1] - m._ptr[i]; j++) {
        colIndex.push(i);
      }
    }
    var values = m._values.slice();
    var rowIndex = m._index.slice();
    for (var _i = 0; _i < m._index.length; _i++) {
      var r1 = rowIndex[_i];
      var c1 = colIndex[_i];
      var flat = r1 * m._size[1] + c1;
      colIndex[_i] = flat % sizes[1];
      rowIndex[_i] = Math.floor(flat / sizes[1]);
    }
    m._values.length = 0;
    m._index.length = 0;
    m._ptr.length = sizes[1] + 1;
    m._size = sizes.slice();
    for (var _i2 = 0; _i2 < m._ptr.length; _i2++) {
      m._ptr[_i2] = 0;
    }
    for (var h = 0; h < values.length; h++) {
      var _i3 = rowIndex[h];
      var _j = colIndex[h];
      var v = values[h];
      var k = _getValueIndex(_i3, m._ptr[_j], m._ptr[_j + 1], m._index);
      _insert(k, _i3, _j, v, m._values, m._index, m._ptr);
    }
    return m;
  };
  SparseMatrix2.prototype.clone = function() {
    var m = new SparseMatrix2({
      values: this._values ? clone(this._values) : void 0,
      index: clone(this._index),
      ptr: clone(this._ptr),
      size: clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  SparseMatrix2.prototype.size = function() {
    return this._size.slice(0);
  };
  SparseMatrix2.prototype.map = function(callback, skipZeros) {
    if (!this._values) {
      throw new Error("Cannot invoke map on a Pattern only matrix");
    }
    var me = this;
    var rows = this._size[0];
    var columns = this._size[1];
    var fastCallback = optimizeCallback(callback, me, "map");
    var invoke = function invoke2(v, i, j) {
      return fastCallback(v, [i, j], me);
    };
    return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
  };
  function _map(matrix2, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
    var values = [];
    var index2 = [];
    var ptr = [];
    var eq = equalScalar2;
    var zero2 = 0;
    if (isString(matrix2._datatype)) {
      eq = typed3.find(equalScalar2, [matrix2._datatype, matrix2._datatype]) || equalScalar2;
      zero2 = typed3.convert(0, matrix2._datatype);
    }
    var invoke = function invoke2(v, x, y) {
      var value2 = callback(v, x, y);
      if (!eq(value2, zero2)) {
        values.push(value2);
        index2.push(x);
      }
    };
    for (var j = minColumn; j <= maxColumn; j++) {
      ptr.push(values.length);
      var k0 = matrix2._ptr[j];
      var k1 = matrix2._ptr[j + 1];
      if (skipZeros) {
        for (var k = k0; k < k1; k++) {
          var i = matrix2._index[k];
          if (i >= minRow && i <= maxRow) {
            invoke(matrix2._values[k], i - minRow, j - minColumn);
          }
        }
      } else {
        var _values = {};
        for (var _k = k0; _k < k1; _k++) {
          var _i4 = matrix2._index[_k];
          _values[_i4] = matrix2._values[_k];
        }
        for (var _i5 = minRow; _i5 <= maxRow; _i5++) {
          var value = _i5 in _values ? _values[_i5] : 0;
          invoke(value, _i5 - minRow, j - minColumn);
        }
      }
    }
    ptr.push(values.length);
    return new SparseMatrix2({
      values,
      index: index2,
      ptr,
      size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
    });
  }
  SparseMatrix2.prototype.forEach = function(callback, skipZeros) {
    if (!this._values) {
      throw new Error("Cannot invoke forEach on a Pattern only matrix");
    }
    var me = this;
    var rows = this._size[0];
    var columns = this._size[1];
    var fastCallback = optimizeCallback(callback, me, "forEach");
    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      if (skipZeros) {
        for (var k = k0; k < k1; k++) {
          var i = this._index[k];
          fastCallback(this._values[k], [i, j], me);
        }
      } else {
        var values = {};
        for (var _k2 = k0; _k2 < k1; _k2++) {
          var _i6 = this._index[_k2];
          values[_i6] = this._values[_k2];
        }
        for (var _i7 = 0; _i7 < rows; _i7++) {
          var value = _i7 in values ? values[_i7] : 0;
          fastCallback(value, [_i7, j], me);
        }
      }
    }
  };
  SparseMatrix2.prototype[Symbol.iterator] = function* () {
    if (!this._values) {
      throw new Error("Cannot iterate a Pattern only matrix");
    }
    var columns = this._size[1];
    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        var i = this._index[k];
        yield {
          value: this._values[k],
          index: [i, j]
        };
      }
    }
  };
  SparseMatrix2.prototype.toArray = function() {
    return _toArray(this._values, this._index, this._ptr, this._size, true);
  };
  SparseMatrix2.prototype.valueOf = function() {
    return _toArray(this._values, this._index, this._ptr, this._size, false);
  };
  function _toArray(values, index2, ptr, size2, copy) {
    var rows = size2[0];
    var columns = size2[1];
    var a = [];
    var i, j;
    for (i = 0; i < rows; i++) {
      a[i] = [];
      for (j = 0; j < columns; j++) {
        a[i][j] = 0;
      }
    }
    for (j = 0; j < columns; j++) {
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        i = index2[k];
        a[i][j] = values ? copy ? clone(values[k]) : values[k] : 1;
      }
    }
    return a;
  }
  SparseMatrix2.prototype.format = function(options) {
    var rows = this._size[0];
    var columns = this._size[1];
    var density = this.density();
    var str = "Sparse Matrix [" + format3(rows, options) + " x " + format3(columns, options) + "] density: " + format3(density, options) + "\n";
    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        var i = this._index[k];
        str += "\n    (" + format3(i, options) + ", " + format3(j, options) + ") ==> " + (this._values ? format3(this._values[k], options) : "X");
      }
    }
    return str;
  };
  SparseMatrix2.prototype.toString = function() {
    return format3(this.toArray());
  };
  SparseMatrix2.prototype.toJSON = function() {
    return {
      mathjs: "SparseMatrix",
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size,
      datatype: this._datatype
    };
  };
  SparseMatrix2.prototype.diagonal = function(k) {
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = this._size[0];
    var columns = this._size[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var values = [];
    var index2 = [];
    var ptr = [];
    ptr[0] = 0;
    for (var j = kSuper; j < columns && values.length < n; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      for (var x = k0; x < k1; x++) {
        var i = this._index[x];
        if (i === j - kSuper + kSub) {
          values.push(this._values[x]);
          index2[values.length - 1] = i - kSub;
          break;
        }
      }
    }
    ptr.push(values.length);
    return new SparseMatrix2({
      values,
      index: index2,
      ptr,
      size: [n, 1]
    });
  };
  SparseMatrix2.fromJSON = function(json) {
    return new SparseMatrix2(json);
  };
  SparseMatrix2.diagonal = function(size2, value, k, defaultValue, datatype) {
    if (!isArray(size2)) {
      throw new TypeError("Array expected, size parameter");
    }
    if (size2.length !== 2) {
      throw new Error("Only two dimensions matrix are supported");
    }
    size2 = size2.map(function(s) {
      if (isBigNumber(s)) {
        s = s.toNumber();
      }
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error("Size values must be positive integers");
      }
      return s;
    });
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var eq = equalScalar2;
    var zero2 = 0;
    if (isString(datatype)) {
      eq = typed3.find(equalScalar2, [datatype, datatype]) || equalScalar2;
      zero2 = typed3.convert(0, datatype);
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = size2[0];
    var columns = size2[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var _value;
    if (isArray(value)) {
      if (value.length !== n) {
        throw new Error("Invalid value array length");
      }
      _value = function _value2(i2) {
        return value[i2];
      };
    } else if (isMatrix(value)) {
      var ms = value.size();
      if (ms.length !== 1 || ms[0] !== n) {
        throw new Error("Invalid matrix length");
      }
      _value = function _value2(i2) {
        return value.get([i2]);
      };
    } else {
      _value = function _value2() {
        return value;
      };
    }
    var values = [];
    var index2 = [];
    var ptr = [];
    for (var j = 0; j < columns; j++) {
      ptr.push(values.length);
      var i = j - kSuper;
      if (i >= 0 && i < n) {
        var v = _value(i);
        if (!eq(v, zero2)) {
          index2.push(i + kSub);
          values.push(v);
        }
      }
    }
    ptr.push(values.length);
    return new SparseMatrix2({
      values,
      index: index2,
      ptr,
      size: [rows, columns]
    });
  };
  SparseMatrix2.prototype.swapRows = function(i, j) {
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error("Row index must be positive integers");
    }
    if (this._size.length !== 2) {
      throw new Error("Only two dimensional matrix is supported");
    }
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);
    SparseMatrix2._swapRows(i, j, this._size[1], this._values, this._index, this._ptr);
    return this;
  };
  SparseMatrix2._forEachRow = function(j, values, index2, ptr, callback) {
    var k0 = ptr[j];
    var k1 = ptr[j + 1];
    for (var k = k0; k < k1; k++) {
      callback(index2[k], values[k]);
    }
  };
  SparseMatrix2._swapRows = function(x, y, columns, values, index2, ptr) {
    for (var j = 0; j < columns; j++) {
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      var kx = _getValueIndex(x, k0, k1, index2);
      var ky = _getValueIndex(y, k0, k1, index2);
      if (kx < k1 && ky < k1 && index2[kx] === x && index2[ky] === y) {
        if (values) {
          var v = values[kx];
          values[kx] = values[ky];
          values[ky] = v;
        }
        continue;
      }
      if (kx < k1 && index2[kx] === x && (ky >= k1 || index2[ky] !== y)) {
        var vx = values ? values[kx] : void 0;
        index2.splice(ky, 0, y);
        if (values) {
          values.splice(ky, 0, vx);
        }
        index2.splice(ky <= kx ? kx + 1 : kx, 1);
        if (values) {
          values.splice(ky <= kx ? kx + 1 : kx, 1);
        }
        continue;
      }
      if (ky < k1 && index2[ky] === y && (kx >= k1 || index2[kx] !== x)) {
        var vy = values ? values[ky] : void 0;
        index2.splice(kx, 0, x);
        if (values) {
          values.splice(kx, 0, vy);
        }
        index2.splice(kx <= ky ? ky + 1 : ky, 1);
        if (values) {
          values.splice(kx <= ky ? ky + 1 : ky, 1);
        }
      }
    }
  };
  return SparseMatrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/bignumber/function/bignumber.js
var name10 = "bignumber";
var dependencies11 = ["typed", "BigNumber"];
var createBignumber = /* @__PURE__ */ factory(name10, dependencies11, (_ref) => {
  var {
    typed: typed3,
    BigNumber: BigNumber2
  } = _ref;
  return typed3("bignumber", {
    "": function _() {
      return new BigNumber2(0);
    },
    number: function number(x) {
      return new BigNumber2(x + "");
    },
    string: function string(x) {
      var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);
      if (wordSizeSuffixMatch) {
        var size2 = wordSizeSuffixMatch[2];
        var n = BigNumber2(wordSizeSuffixMatch[1]);
        var twoPowSize = new BigNumber2(2).pow(Number(size2));
        if (n.gt(twoPowSize.sub(1))) {
          throw new SyntaxError('String "'.concat(x, '" is out of range'));
        }
        var twoPowSizeSubOne = new BigNumber2(2).pow(Number(size2) - 1);
        if (n.gte(twoPowSizeSubOne)) {
          return n.sub(twoPowSize);
        } else {
          return n;
        }
      }
      return new BigNumber2(x);
    },
    BigNumber: function BigNumber3(x) {
      return x;
    },
    bigint: function bigint(x) {
      return new BigNumber2(x.toString());
    },
    Unit: typed3.referToSelf((self2) => (x) => {
      var clone4 = x.clone();
      clone4.value = self2(x.value);
      return clone4;
    }),
    Fraction: function Fraction3(x) {
      return new BigNumber2(String(x.n)).div(String(x.d)).times(String(x.s));
    },
    null: function _null(_x) {
      return new BigNumber2(0);
    },
    "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap2(x, self2))
  });
});

// node_modules/mathjs/lib/esm/type/matrix/function/matrix.js
var name11 = "matrix";
var dependencies12 = ["typed", "Matrix", "DenseMatrix", "SparseMatrix"];
var createMatrix = /* @__PURE__ */ factory(name11, dependencies12, (_ref) => {
  var {
    typed: typed3,
    Matrix: Matrix3,
    DenseMatrix: DenseMatrix2,
    SparseMatrix: SparseMatrix2
  } = _ref;
  return typed3(name11, {
    "": function _() {
      return _create([]);
    },
    string: function string(format4) {
      return _create([], format4);
    },
    "string, string": function string_string(format4, datatype) {
      return _create([], format4, datatype);
    },
    Array: function Array2(data) {
      return _create(data);
    },
    Matrix: function Matrix4(data) {
      return _create(data, data.storage());
    },
    "Array | Matrix, string": _create,
    "Array | Matrix, string, string": _create
  });
  function _create(data, format4, datatype) {
    if (format4 === "dense" || format4 === "default" || format4 === void 0) {
      return new DenseMatrix2(data, datatype);
    }
    if (format4 === "sparse") {
      return new SparseMatrix2(data, datatype);
    }
    throw new TypeError("Unknown matrix type " + JSON.stringify(format4) + ".");
  }
});

// node_modules/mathjs/lib/esm/function/arithmetic/unaryMinus.js
var name12 = "unaryMinus";
var dependencies13 = ["typed"];
var createUnaryMinus = /* @__PURE__ */ factory(name12, dependencies13, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name12, {
    number: unaryMinusNumber,
    "Complex | BigNumber | Fraction": (x) => x.neg(),
    bigint: (x) => -x,
    Unit: typed3.referToSelf((self2) => (x) => {
      var res = x.clone();
      res.value = typed3.find(self2, res.valueType())(x.value);
      return res;
    }),
    // deep map collection, skip zeros since unaryMinus(0) = 0
    "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap2(x, self2, true))
    // TODO: add support for string
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/addScalar.js
var name13 = "addScalar";
var dependencies14 = ["typed"];
var createAddScalar = /* @__PURE__ */ factory(name13, dependencies14, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name13, {
    "number, number": addNumber,
    "Complex, Complex": function Complex_Complex(x, y) {
      return x.add(y);
    },
    "BigNumber, BigNumber": function BigNumber_BigNumber(x, y) {
      return x.plus(y);
    },
    "bigint, bigint": function bigint_bigint(x, y) {
      return x + y;
    },
    "Fraction, Fraction": function Fraction_Fraction(x, y) {
      return x.add(y);
    },
    "Unit, Unit": typed3.referToSelf((self2) => (x, y) => {
      if (x.value === null || x.value === void 0) {
        throw new Error("Parameter x contains a unit with undefined value");
      }
      if (y.value === null || y.value === void 0) {
        throw new Error("Parameter y contains a unit with undefined value");
      }
      if (!x.equalBase(y)) throw new Error("Units do not match");
      var res = x.clone();
      res.value = typed3.find(self2, [res.valueType(), y.valueType()])(res.value, y.value);
      res.fixPrefix = false;
      return res;
    })
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/subtractScalar.js
var name14 = "subtractScalar";
var dependencies15 = ["typed"];
var createSubtractScalar = /* @__PURE__ */ factory(name14, dependencies15, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name14, {
    "number, number": subtractNumber,
    "Complex, Complex": function Complex_Complex(x, y) {
      return x.sub(y);
    },
    "BigNumber, BigNumber": function BigNumber_BigNumber(x, y) {
      return x.minus(y);
    },
    "bigint, bigint": function bigint_bigint(x, y) {
      return x - y;
    },
    "Fraction, Fraction": function Fraction_Fraction(x, y) {
      return x.sub(y);
    },
    "Unit, Unit": typed3.referToSelf((self2) => (x, y) => {
      if (x.value === null || x.value === void 0) {
        throw new Error("Parameter x contains a unit with undefined value");
      }
      if (y.value === null || y.value === void 0) {
        throw new Error("Parameter y contains a unit with undefined value");
      }
      if (!x.equalBase(y)) throw new Error("Units do not match");
      var res = x.clone();
      res.value = typed3.find(self2, [res.valueType(), y.valueType()])(res.value, y.value);
      res.fixPrefix = false;
      return res;
    })
  });
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo11xS0s.js
var name15 = "matAlgo11xS0s";
var dependencies16 = ["typed", "equalScalar"];
var createMatAlgo11xS0s = /* @__PURE__ */ factory(name15, dependencies16, (_ref) => {
  var {
    typed: typed3,
    equalScalar: equalScalar2
  } = _ref;
  return function matAlgo11xS0s(s, b, callback, inverse) {
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;
    if (!avalues) {
      throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var eq = equalScalar2;
    var zero2 = 0;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      eq = typed3.find(equalScalar2, [dt, dt]);
      zero2 = typed3.convert(0, dt);
      b = typed3.convert(b, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    for (var j = 0; j < columns; j++) {
      cptr[j] = cindex.length;
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        var i = aindex[k];
        var v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b);
        if (!eq(v, zero2)) {
          cindex.push(i);
          cvalues.push(v);
        }
      }
    }
    cptr[columns] = cindex.length;
    return s.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo12xSfs.js
var name16 = "matAlgo12xSfs";
var dependencies17 = ["typed", "DenseMatrix"];
var createMatAlgo12xSfs = /* @__PURE__ */ factory(name16, dependencies17, (_ref) => {
  var {
    typed: typed3,
    DenseMatrix: DenseMatrix2
  } = _ref;
  return function matAlgo12xSfs(s, b, callback, inverse) {
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;
    if (!avalues) {
      throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      b = typed3.convert(b, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cdata = [];
    var x = [];
    var w = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        var r = aindex[k];
        x[r] = avalues[k];
        w[r] = mark;
      }
      for (var i = 0; i < rows; i++) {
        if (j === 0) {
          cdata[i] = [];
        }
        if (w[i] === mark) {
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        } else {
          cdata[i][j] = inverse ? cf(b, 0) : cf(0, b);
        }
      }
    }
    return new DenseMatrix2({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo14xDs.js
var name17 = "matAlgo14xDs";
var dependencies18 = ["typed"];
var createMatAlgo14xDs = /* @__PURE__ */ factory(name17, dependencies18, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return function matAlgo14xDs(a, b, callback, inverse) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var dt;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      b = typed3.convert(b, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : [];
    return a.createDenseMatrix({
      data: cdata,
      size: clone(asize),
      datatype: dt
    });
  };
  function _iterate(f, level, s, n, av, bv, inverse) {
    var cv = [];
    if (level === s.length - 1) {
      for (var i = 0; i < n; i++) {
        cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv);
      }
    } else {
      for (var j = 0; j < n; j++) {
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
      }
    }
    return cv;
  }
});

// node_modules/mathjs/lib/esm/function/arithmetic/exp.js
var name18 = "exp";
var dependencies19 = ["typed"];
var createExp = /* @__PURE__ */ factory(name18, dependencies19, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name18, {
    number: expNumber,
    Complex: function Complex3(x) {
      return x.exp();
    },
    BigNumber: function BigNumber2(x) {
      return x.exp();
    }
  });
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo03xDSf.js
var name19 = "matAlgo03xDSf";
var dependencies20 = ["typed"];
var createMatAlgo03xDSf = /* @__PURE__ */ factory(name19, dependencies20, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return function matAlgo03xDSf(denseMatrix, sparseMatrix, callback, inverse) {
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype || denseMatrix.getDataType();
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype || sparseMatrix._data === void 0 ? sparseMatrix._datatype : sparseMatrix.getDataType();
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    if (!bvalues) {
      throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var zero2 = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt && adt !== "mixed") {
      dt = adt;
      zero2 = typed3.convert(0, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cdata = [];
    for (var z = 0; z < rows; z++) {
      cdata[z] = [];
    }
    var x = [];
    var w = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        var i = bindex[k];
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      for (var y = 0; y < rows; y++) {
        if (w[y] === mark) {
          cdata[y][j] = x[y];
        } else {
          cdata[y][j] = inverse ? cf(zero2, adata[y][j]) : cf(adata[y][j], zero2);
        }
      }
    }
    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: adt === denseMatrix._datatype && bdt === sparseMatrix._datatype ? dt : void 0
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo05xSfSf.js
var name20 = "matAlgo05xSfSf";
var dependencies21 = ["typed", "equalScalar"];
var createMatAlgo05xSfSf = /* @__PURE__ */ factory(name20, dependencies21, (_ref) => {
  var {
    typed: typed3,
    equalScalar: equalScalar2
  } = _ref;
  return function matAlgo05xSfSf(a, b, callback) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype || a._data === void 0 ? a._datatype : a.getDataType();
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype || b._data === void 0 ? b._datatype : b.getDataType();
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var eq = equalScalar2;
    var zero2 = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt && adt !== "mixed") {
      dt = adt;
      eq = typed3.find(equalScalar2, [dt, dt]);
      zero2 = typed3.convert(0, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cvalues = avalues && bvalues ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var xa = cvalues ? [] : void 0;
    var xb = cvalues ? [] : void 0;
    var wa = [];
    var wb = [];
    var i, j, k, k1;
    for (j = 0; j < columns; j++) {
      cptr[j] = cindex.length;
      var mark = j + 1;
      for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
        i = aindex[k];
        cindex.push(i);
        wa[i] = mark;
        if (xa) {
          xa[i] = avalues[k];
        }
      }
      for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
        i = bindex[k];
        if (wa[i] !== mark) {
          cindex.push(i);
        }
        wb[i] = mark;
        if (xb) {
          xb[i] = bvalues[k];
        }
      }
      if (cvalues) {
        k = cptr[j];
        while (k < cindex.length) {
          i = cindex[k];
          var wai = wa[i];
          var wbi = wb[i];
          if (wai === mark || wbi === mark) {
            var va = wai === mark ? xa[i] : zero2;
            var vb = wbi === mark ? xb[i] : zero2;
            var vc = cf(va, vb);
            if (!eq(vc, zero2)) {
              cvalues.push(vc);
              k++;
            } else {
              cindex.splice(k, 1);
            }
          }
        }
      }
    }
    cptr[columns] = cindex.length;
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo13xDD.js
var name21 = "matAlgo13xDD";
var dependencies22 = ["typed"];
var createMatAlgo13xDD = /* @__PURE__ */ factory(name21, dependencies22, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return function matAlgo13xDD(a, b, callback) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    var csize = [];
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    for (var s = 0; s < asize.length; s++) {
      if (asize[s] !== bsize[s]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      csize[s] = asize[s];
    }
    var dt;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt) {
      dt = adt;
      cf = typed3.find(callback, [dt, dt]);
    }
    var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : [];
    return a.createDenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });
  };
  function _iterate(f, level, s, n, av, bv) {
    var cv = [];
    if (level === s.length - 1) {
      for (var i = 0; i < n; i++) {
        cv[i] = f(av[i], bv[i]);
      }
    } else {
      for (var j = 0; j < n; j++) {
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
      }
    }
    return cv;
  }
});

// node_modules/mathjs/lib/esm/type/matrix/utils/broadcast.js
function broadcast(A, B) {
  if (deepStrictEqual(A.size(), B.size())) {
    return [A, B];
  }
  var newSize = broadcastSizes(A.size(), B.size());
  return [A, B].map((M) => _broadcastTo(M, newSize));
}
function _broadcastTo(M, size2) {
  if (deepStrictEqual(M.size(), size2)) {
    return M;
  }
  return M.create(broadcastTo(M.valueOf(), size2), M.datatype());
}

// node_modules/mathjs/lib/esm/type/matrix/utils/matrixAlgorithmSuite.js
var name22 = "matrixAlgorithmSuite";
var dependencies23 = ["typed", "matrix"];
var createMatrixAlgorithmSuite = /* @__PURE__ */ factory(name22, dependencies23, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2
  } = _ref;
  var matAlgo13xDD = createMatAlgo13xDD({
    typed: typed3
  });
  var matAlgo14xDs = createMatAlgo14xDs({
    typed: typed3
  });
  return function matrixAlgorithmSuite(options) {
    var elop = options.elop;
    var SD = options.SD || options.DS;
    var matrixSignatures;
    if (elop) {
      matrixSignatures = {
        "DenseMatrix, DenseMatrix": (x, y) => matAlgo13xDD(...broadcast(x, y), elop),
        "Array, Array": (x, y) => matAlgo13xDD(...broadcast(matrix2(x), matrix2(y)), elop).valueOf(),
        "Array, DenseMatrix": (x, y) => matAlgo13xDD(...broadcast(matrix2(x), y), elop),
        "DenseMatrix, Array": (x, y) => matAlgo13xDD(...broadcast(x, matrix2(y)), elop)
      };
      if (options.SS) {
        matrixSignatures["SparseMatrix, SparseMatrix"] = (x, y) => options.SS(...broadcast(x, y), elop, false);
      }
      if (options.DS) {
        matrixSignatures["DenseMatrix, SparseMatrix"] = (x, y) => options.DS(...broadcast(x, y), elop, false);
        matrixSignatures["Array, SparseMatrix"] = (x, y) => options.DS(...broadcast(matrix2(x), y), elop, false);
      }
      if (SD) {
        matrixSignatures["SparseMatrix, DenseMatrix"] = (x, y) => SD(...broadcast(y, x), elop, true);
        matrixSignatures["SparseMatrix, Array"] = (x, y) => SD(...broadcast(matrix2(y), x), elop, true);
      }
    } else {
      matrixSignatures = {
        "DenseMatrix, DenseMatrix": typed3.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(x, y), self2);
        }),
        "Array, Array": typed3.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(matrix2(x), matrix2(y)), self2).valueOf();
        }),
        "Array, DenseMatrix": typed3.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(matrix2(x), y), self2);
        }),
        "DenseMatrix, Array": typed3.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(x, matrix2(y)), self2);
        })
      };
      if (options.SS) {
        matrixSignatures["SparseMatrix, SparseMatrix"] = typed3.referToSelf((self2) => (x, y) => {
          return options.SS(...broadcast(x, y), self2, false);
        });
      }
      if (options.DS) {
        matrixSignatures["DenseMatrix, SparseMatrix"] = typed3.referToSelf((self2) => (x, y) => {
          return options.DS(...broadcast(x, y), self2, false);
        });
        matrixSignatures["Array, SparseMatrix"] = typed3.referToSelf((self2) => (x, y) => {
          return options.DS(...broadcast(matrix2(x), y), self2, false);
        });
      }
      if (SD) {
        matrixSignatures["SparseMatrix, DenseMatrix"] = typed3.referToSelf((self2) => (x, y) => {
          return SD(...broadcast(y, x), self2, true);
        });
        matrixSignatures["SparseMatrix, Array"] = typed3.referToSelf((self2) => (x, y) => {
          return SD(...broadcast(matrix2(y), x), self2, true);
        });
      }
    }
    var scalar = options.scalar || "any";
    var Ds = options.Ds || options.Ss;
    if (Ds) {
      if (elop) {
        matrixSignatures["DenseMatrix," + scalar] = (x, y) => matAlgo14xDs(x, y, elop, false);
        matrixSignatures[scalar + ", DenseMatrix"] = (x, y) => matAlgo14xDs(y, x, elop, true);
        matrixSignatures["Array," + scalar] = (x, y) => matAlgo14xDs(matrix2(x), y, elop, false).valueOf();
        matrixSignatures[scalar + ", Array"] = (x, y) => matAlgo14xDs(matrix2(y), x, elop, true).valueOf();
      } else {
        matrixSignatures["DenseMatrix," + scalar] = typed3.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(x, y, self2, false);
        });
        matrixSignatures[scalar + ", DenseMatrix"] = typed3.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(y, x, self2, true);
        });
        matrixSignatures["Array," + scalar] = typed3.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(matrix2(x), y, self2, false).valueOf();
        });
        matrixSignatures[scalar + ", Array"] = typed3.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(matrix2(y), x, self2, true).valueOf();
        });
      }
    }
    var sS = options.sS !== void 0 ? options.sS : options.Ss;
    if (elop) {
      if (options.Ss) {
        matrixSignatures["SparseMatrix," + scalar] = (x, y) => options.Ss(x, y, elop, false);
      }
      if (sS) {
        matrixSignatures[scalar + ", SparseMatrix"] = (x, y) => sS(y, x, elop, true);
      }
    } else {
      if (options.Ss) {
        matrixSignatures["SparseMatrix," + scalar] = typed3.referToSelf((self2) => (x, y) => {
          return options.Ss(x, y, self2, false);
        });
      }
      if (sS) {
        matrixSignatures[scalar + ", SparseMatrix"] = typed3.referToSelf((self2) => (x, y) => {
          return sS(y, x, self2, true);
        });
      }
    }
    if (elop && elop.signatures) {
      extend(matrixSignatures, elop.signatures);
    }
    return matrixSignatures;
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo01xDSid.js
var name23 = "matAlgo01xDSid";
var dependencies24 = ["typed"];
var createMatAlgo01xDSid = /* @__PURE__ */ factory(name23, dependencies24, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return function algorithm1(denseMatrix, sparseMatrix, callback, inverse) {
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype || denseMatrix.getDataType();
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype || sparseMatrix._data === void 0 ? sparseMatrix._datatype : sparseMatrix.getDataType();
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    if (!bvalues) {
      throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt = typeof adt === "string" && adt !== "mixed" && adt === bdt ? adt : void 0;
    var cf = dt ? typed3.find(callback, [dt, dt]) : callback;
    var i, j;
    var cdata = [];
    for (i = 0; i < rows; i++) {
      cdata[i] = [];
    }
    var x = [];
    var w = [];
    for (j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        i = bindex[k];
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      for (i = 0; i < rows; i++) {
        if (w[i] === mark) {
          cdata[i][j] = x[i];
        } else {
          cdata[i][j] = adata[i][j];
        }
      }
    }
    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: adt === denseMatrix._datatype && bdt === sparseMatrix._datatype ? dt : void 0
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo04xSidSid.js
var name24 = "matAlgo04xSidSid";
var dependencies25 = ["typed", "equalScalar"];
var createMatAlgo04xSidSid = /* @__PURE__ */ factory(name24, dependencies25, (_ref) => {
  var {
    typed: typed3,
    equalScalar: equalScalar2
  } = _ref;
  return function matAlgo04xSidSid(a, b, callback) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype || a._data === void 0 ? a._datatype : a.getDataType();
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype || b._data === void 0 ? b._datatype : b.getDataType();
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var eq = equalScalar2;
    var zero2 = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt && adt !== "mixed") {
      dt = adt;
      eq = typed3.find(equalScalar2, [dt, dt]);
      zero2 = typed3.convert(0, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cvalues = avalues && bvalues ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var xa = avalues && bvalues ? [] : void 0;
    var xb = avalues && bvalues ? [] : void 0;
    var wa = [];
    var wb = [];
    var i, j, k, k0, k1;
    for (j = 0; j < columns; j++) {
      cptr[j] = cindex.length;
      var mark = j + 1;
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        i = aindex[k];
        cindex.push(i);
        wa[i] = mark;
        if (xa) {
          xa[i] = avalues[k];
        }
      }
      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        i = bindex[k];
        if (wa[i] === mark) {
          if (xa) {
            var v = cf(xa[i], bvalues[k]);
            if (!eq(v, zero2)) {
              xa[i] = v;
            } else {
              wa[i] = null;
            }
          }
        } else {
          cindex.push(i);
          wb[i] = mark;
          if (xb) {
            xb[i] = bvalues[k];
          }
        }
      }
      if (xa && xb) {
        k = cptr[j];
        while (k < cindex.length) {
          i = cindex[k];
          if (wa[i] === mark) {
            cvalues[k] = xa[i];
            k++;
          } else if (wb[i] === mark) {
            cvalues[k] = xb[i];
            k++;
          } else {
            cindex.splice(k, 1);
          }
        }
      }
    }
    cptr[columns] = cindex.length;
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo10xSids.js
var name25 = "matAlgo10xSids";
var dependencies26 = ["typed", "DenseMatrix"];
var createMatAlgo10xSids = /* @__PURE__ */ factory(name25, dependencies26, (_ref) => {
  var {
    typed: typed3,
    DenseMatrix: DenseMatrix2
  } = _ref;
  return function matAlgo10xSids(s, b, callback, inverse) {
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;
    if (!avalues) {
      throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      b = typed3.convert(b, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cdata = [];
    var x = [];
    var w = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        var r = aindex[k];
        x[r] = avalues[k];
        w[r] = mark;
      }
      for (var i = 0; i < rows; i++) {
        if (j === 0) {
          cdata[i] = [];
        }
        if (w[i] === mark) {
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        } else {
          cdata[i][j] = b;
        }
      }
    }
    return new DenseMatrix2({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/function/arithmetic/multiplyScalar.js
var name26 = "multiplyScalar";
var dependencies27 = ["typed"];
var createMultiplyScalar = /* @__PURE__ */ factory(name26, dependencies27, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3("multiplyScalar", {
    "number, number": multiplyNumber,
    "Complex, Complex": function Complex_Complex(x, y) {
      return x.mul(y);
    },
    "BigNumber, BigNumber": function BigNumber_BigNumber(x, y) {
      return x.times(y);
    },
    "bigint, bigint": function bigint_bigint(x, y) {
      return x * y;
    },
    "Fraction, Fraction": function Fraction_Fraction(x, y) {
      return x.mul(y);
    },
    "number | Fraction | BigNumber | Complex, Unit": (x, y) => y.multiply(x),
    "Unit, number | Fraction | BigNumber | Complex | Unit": (x, y) => x.multiply(y)
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/multiply.js
var name27 = "multiply";
var dependencies28 = ["typed", "matrix", "addScalar", "multiplyScalar", "equalScalar", "dot"];
var createMultiply = /* @__PURE__ */ factory(name27, dependencies28, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2,
    addScalar: addScalar2,
    multiplyScalar: multiplyScalar2,
    equalScalar: equalScalar2,
    dot: dot2
  } = _ref;
  var matAlgo11xS0s = createMatAlgo11xS0s({
    typed: typed3,
    equalScalar: equalScalar2
  });
  var matAlgo14xDs = createMatAlgo14xDs({
    typed: typed3
  });
  function _validateMatrixDimensions(size1, size2) {
    switch (size1.length) {
      case 1:
        switch (size2.length) {
          case 1:
            if (size1[0] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Vectors must have the same length");
            }
            break;
          case 2:
            if (size1[0] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Vector length (" + size1[0] + ") must match Matrix rows (" + size2[0] + ")");
            }
            break;
          default:
            throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + size2.length + " dimensions)");
        }
        break;
      case 2:
        switch (size2.length) {
          case 1:
            if (size1[1] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Matrix columns (" + size1[1] + ") must match Vector length (" + size2[0] + ")");
            }
            break;
          case 2:
            if (size1[1] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Matrix A columns (" + size1[1] + ") must match Matrix B rows (" + size2[0] + ")");
            }
            break;
          default:
            throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + size2.length + " dimensions)");
        }
        break;
      default:
        throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix A has " + size1.length + " dimensions)");
    }
  }
  function _multiplyVectorVector(a, b, n) {
    if (n === 0) {
      throw new Error("Cannot multiply two empty vectors");
    }
    return dot2(a, b);
  }
  function _multiplyVectorMatrix(a, b) {
    if (b.storage() !== "dense") {
      throw new Error("Support for SparseMatrix not implemented");
    }
    return _multiplyVectorDenseMatrix(a, b);
  }
  function _multiplyVectorDenseMatrix(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype || a.getDataType();
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype || b.getDataType();
    var alength = asize[0];
    var bcolumns = bsize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
    }
    var c = [];
    for (var j = 0; j < bcolumns; j++) {
      var sum2 = mf(adata[0], bdata[0][j]);
      for (var i = 1; i < alength; i++) {
        sum2 = af(sum2, mf(adata[i], bdata[i][j]));
      }
      c[j] = sum2;
    }
    return a.createDenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  }
  var _multiplyMatrixVector = typed3("_multiplyMatrixVector", {
    "DenseMatrix, any": _multiplyDenseMatrixVector,
    "SparseMatrix, any": _multiplySparseMatrixVector
  });
  var _multiplyMatrixMatrix = typed3("_multiplyMatrixMatrix", {
    "DenseMatrix, DenseMatrix": _multiplyDenseMatrixDenseMatrix,
    "DenseMatrix, SparseMatrix": _multiplyDenseMatrixSparseMatrix,
    "SparseMatrix, DenseMatrix": _multiplySparseMatrixDenseMatrix,
    "SparseMatrix, SparseMatrix": _multiplySparseMatrixSparseMatrix
  });
  function _multiplyDenseMatrixVector(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype || a.getDataType();
    var bdata = b._data;
    var bdt = b._datatype || b.getDataType();
    var arows = asize[0];
    var acolumns = asize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
    }
    var c = [];
    for (var i = 0; i < arows; i++) {
      var row = adata[i];
      var sum2 = mf(row[0], bdata[0]);
      for (var j = 1; j < acolumns; j++) {
        sum2 = af(sum2, mf(row[j], bdata[j]));
      }
      c[i] = sum2;
    }
    return a.createDenseMatrix({
      data: c,
      size: [arows],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  }
  function _multiplyDenseMatrixDenseMatrix(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype || a.getDataType();
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype || b.getDataType();
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
    }
    var c = [];
    for (var i = 0; i < arows; i++) {
      var row = adata[i];
      c[i] = [];
      for (var j = 0; j < bcolumns; j++) {
        var sum2 = mf(row[0], bdata[0][j]);
        for (var x = 1; x < acolumns; x++) {
          sum2 = af(sum2, mf(row[x], bdata[x][j]));
        }
        c[i][j] = sum2;
      }
    }
    return a.createDenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  }
  function _multiplyDenseMatrixSparseMatrix(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype || a.getDataType();
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype || b._data === void 0 ? b._datatype : b.getDataType();
    if (!bvalues) {
      throw new Error("Cannot multiply Dense Matrix times Pattern only Matrix");
    }
    var arows = asize[0];
    var bcolumns = bsize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    var eq = equalScalar2;
    var zero2 = 0;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
      eq = typed3.find(equalScalar2, [dt, dt]);
      zero2 = typed3.convert(0, dt);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    var c = b.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
    for (var jb = 0; jb < bcolumns; jb++) {
      cptr[jb] = cindex.length;
      var kb0 = bptr[jb];
      var kb1 = bptr[jb + 1];
      if (kb1 > kb0) {
        var last = 0;
        for (var i = 0; i < arows; i++) {
          var mark = i + 1;
          var cij = void 0;
          for (var kb = kb0; kb < kb1; kb++) {
            var ib = bindex[kb];
            if (last !== mark) {
              cij = mf(adata[i][ib], bvalues[kb]);
              last = mark;
            } else {
              cij = af(cij, mf(adata[i][ib], bvalues[kb]));
            }
          }
          if (last === mark && !eq(cij, zero2)) {
            cindex.push(i);
            cvalues.push(cij);
          }
        }
      }
    }
    cptr[bcolumns] = cindex.length;
    return c;
  }
  function _multiplySparseMatrixVector(a, b) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype || a._data === void 0 ? a._datatype : a.getDataType();
    if (!avalues) {
      throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
    }
    var bdata = b._data;
    var bdt = b._datatype || b.getDataType();
    var arows = a._size[0];
    var brows = b._size[0];
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    var eq = equalScalar2;
    var zero2 = 0;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
      eq = typed3.find(equalScalar2, [dt, dt]);
      zero2 = typed3.convert(0, dt);
    }
    var x = [];
    var w = [];
    cptr[0] = 0;
    for (var ib = 0; ib < brows; ib++) {
      var vbi = bdata[ib];
      if (!eq(vbi, zero2)) {
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          var ia = aindex[ka];
          if (!w[ia]) {
            w[ia] = true;
            cindex.push(ia);
            x[ia] = mf(vbi, avalues[ka]);
          } else {
            x[ia] = af(x[ia], mf(vbi, avalues[ka]));
          }
        }
      }
    }
    for (var p1 = cindex.length, p = 0; p < p1; p++) {
      var ic = cindex[p];
      cvalues[p] = x[ic];
    }
    cptr[1] = cindex.length;
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  }
  function _multiplySparseMatrixDenseMatrix(a, b) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype || a._data === void 0 ? a._datatype : a.getDataType();
    if (!avalues) {
      throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
    }
    var bdata = b._data;
    var bdt = b._datatype || b.getDataType();
    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    var eq = equalScalar2;
    var zero2 = 0;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
      eq = typed3.find(equalScalar2, [dt, dt]);
      zero2 = typed3.convert(0, dt);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    var c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
    var x = [];
    var w = [];
    for (var jb = 0; jb < bcolumns; jb++) {
      cptr[jb] = cindex.length;
      var mark = jb + 1;
      for (var ib = 0; ib < brows; ib++) {
        var vbij = bdata[ib][jb];
        if (!eq(vbij, zero2)) {
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            var ia = aindex[ka];
            if (w[ia] !== mark) {
              w[ia] = mark;
              cindex.push(ia);
              x[ia] = mf(vbij, avalues[ka]);
            } else {
              x[ia] = af(x[ia], mf(vbij, avalues[ka]));
            }
          }
        }
      }
      for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        var ic = cindex[p];
        cvalues[p] = x[ic];
      }
    }
    cptr[bcolumns] = cindex.length;
    return c;
  }
  function _multiplySparseMatrixSparseMatrix(a, b) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype || a._data === void 0 ? a._datatype : a.getDataType();
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype || b._data === void 0 ? b._datatype : b.getDataType();
    var arows = a._size[0];
    var bcolumns = b._size[1];
    var values = avalues && bvalues;
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      dt = adt;
      af = typed3.find(addScalar2, [dt, dt]);
      mf = typed3.find(multiplyScalar2, [dt, dt]);
    }
    var cvalues = values ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
    var x = values ? [] : void 0;
    var w = [];
    var ka, ka0, ka1, kb, kb0, kb1, ia, ib;
    for (var jb = 0; jb < bcolumns; jb++) {
      cptr[jb] = cindex.length;
      var mark = jb + 1;
      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        ib = bindex[kb];
        if (values) {
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            ia = aindex[ka];
            if (w[ia] !== mark) {
              w[ia] = mark;
              cindex.push(ia);
              x[ia] = mf(bvalues[kb], avalues[ka]);
            } else {
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
            }
          }
        } else {
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            ia = aindex[ka];
            if (w[ia] !== mark) {
              w[ia] = mark;
              cindex.push(ia);
            }
          }
        }
      }
      if (values) {
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          var ic = cindex[p];
          cvalues[p] = x[ic];
        }
      }
    }
    cptr[bcolumns] = cindex.length;
    return c;
  }
  return typed3(name27, multiplyScalar2, {
    // we extend the signatures of multiplyScalar with signatures dealing with matrices
    "Array, Array": typed3.referTo("Matrix, Matrix", (selfMM) => (x, y) => {
      _validateMatrixDimensions(arraySize(x), arraySize(y));
      var m = selfMM(matrix2(x), matrix2(y));
      return isMatrix(m) ? m.valueOf() : m;
    }),
    "Matrix, Matrix": function Matrix_Matrix(x, y) {
      var xsize = x.size();
      var ysize = y.size();
      _validateMatrixDimensions(xsize, ysize);
      if (xsize.length === 1) {
        if (ysize.length === 1) {
          return _multiplyVectorVector(x, y, xsize[0]);
        }
        return _multiplyVectorMatrix(x, y);
      }
      if (ysize.length === 1) {
        return _multiplyMatrixVector(x, y);
      }
      return _multiplyMatrixMatrix(x, y);
    },
    "Matrix, Array": typed3.referTo("Matrix,Matrix", (selfMM) => (x, y) => selfMM(x, matrix2(y))),
    "Array, Matrix": typed3.referToSelf((self2) => (x, y) => {
      return self2(matrix2(x, y.storage()), y);
    }),
    "SparseMatrix, any": function SparseMatrix_any(x, y) {
      return matAlgo11xS0s(x, y, multiplyScalar2, false);
    },
    "DenseMatrix, any": function DenseMatrix_any(x, y) {
      return matAlgo14xDs(x, y, multiplyScalar2, false);
    },
    "any, SparseMatrix": function any_SparseMatrix(x, y) {
      return matAlgo11xS0s(y, x, multiplyScalar2, true);
    },
    "any, DenseMatrix": function any_DenseMatrix(x, y) {
      return matAlgo14xDs(y, x, multiplyScalar2, true);
    },
    "Array, any": function Array_any(x, y) {
      return matAlgo14xDs(matrix2(x), y, multiplyScalar2, false).valueOf();
    },
    "any, Array": function any_Array(x, y) {
      return matAlgo14xDs(matrix2(y), x, multiplyScalar2, true).valueOf();
    },
    "any, any": multiplyScalar2,
    "any, any, ...any": typed3.referToSelf((self2) => (x, y, rest) => {
      var result = self2(x, y);
      for (var i = 0; i < rest.length; i++) {
        result = self2(result, rest[i]);
      }
      return result;
    })
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/subtract.js
var name28 = "subtract";
var dependencies29 = ["typed", "matrix", "equalScalar", "subtractScalar", "unaryMinus", "DenseMatrix", "concat"];
var createSubtract = /* @__PURE__ */ factory(name28, dependencies29, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2,
    equalScalar: equalScalar2,
    subtractScalar: subtractScalar2,
    unaryMinus: unaryMinus2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo01xDSid = createMatAlgo01xDSid({
    typed: typed3
  });
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed3
  });
  var matAlgo05xSfSf = createMatAlgo05xSfSf({
    typed: typed3,
    equalScalar: equalScalar2
  });
  var matAlgo10xSids = createMatAlgo10xSids({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed3,
    matrix: matrix2,
    concat: concat3
  });
  return typed3(name28, {
    "any, any": subtractScalar2
  }, matrixAlgorithmSuite({
    elop: subtractScalar2,
    SS: matAlgo05xSfSf,
    DS: matAlgo01xDSid,
    SD: matAlgo03xDSf,
    Ss: matAlgo12xSfs,
    sS: matAlgo10xSids
  }));
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo07xSSf.js
var name29 = "matAlgo07xSSf";
var dependencies30 = ["typed", "SparseMatrix"];
var createMatAlgo07xSSf = /* @__PURE__ */ factory(name29, dependencies30, (_ref) => {
  var {
    typed: typed3,
    SparseMatrix: SparseMatrix2
  } = _ref;
  return function matAlgo07xSSf(a, b, callback) {
    var asize = a._size;
    var adt = a._datatype || a._data === void 0 ? a._datatype : a.getDataType();
    var bsize = b._size;
    var bdt = b._datatype || b._data === void 0 ? b._datatype : b.getDataType();
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var zero2 = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt && adt !== "mixed") {
      dt = adt;
      zero2 = typed3.convert(0, dt);
      cf = typed3.find(callback, [dt, dt]);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(columns + 1).fill(0);
    var xa = [];
    var xb = [];
    var wa = [];
    var wb = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      var nonZeroCount = 0;
      _scatter(a, j, wa, xa, mark);
      _scatter(b, j, wb, xb, mark);
      for (var i = 0; i < rows; i++) {
        var va = wa[i] === mark ? xa[i] : zero2;
        var vb = wb[i] === mark ? xb[i] : zero2;
        var cij = cf(va, vb);
        if (cij !== 0 && cij !== false) {
          cindex.push(i);
          cvalues.push(cij);
          nonZeroCount++;
        }
      }
      cptr[j + 1] = cptr[j] + nonZeroCount;
    }
    return new SparseMatrix2({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : void 0
    });
  };
  function _scatter(m, j, w, x, mark) {
    var values = m._values;
    var index2 = m._index;
    var ptr = m._ptr;
    for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
      var i = index2[k];
      w[i] = mark;
      x[i] = values[k];
    }
  }
});

// node_modules/mathjs/lib/esm/function/complex/conj.js
var name30 = "conj";
var dependencies31 = ["typed"];
var createConj = /* @__PURE__ */ factory(name30, dependencies31, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name30, {
    "number | BigNumber | Fraction": (x) => x,
    Complex: (x) => x.conjugate(),
    "Array | Matrix": typed3.referToSelf((self2) => (x) => deepMap2(x, self2))
  });
});

// node_modules/mathjs/lib/esm/function/matrix/concat.js
var name31 = "concat";
var dependencies32 = ["typed", "matrix", "isInteger"];
var createConcat = /* @__PURE__ */ factory(name31, dependencies32, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2,
    isInteger: isInteger3
  } = _ref;
  return typed3(name31, {
    // TODO: change signature to '...Array | Matrix, dim?' when supported
    "...Array | Matrix | number | BigNumber": function Array__Matrix__number__BigNumber(args) {
      var i;
      var len = args.length;
      var dim = -1;
      var prevDim;
      var asMatrix = false;
      var matrices = [];
      for (i = 0; i < len; i++) {
        var arg = args[i];
        if (isMatrix(arg)) {
          asMatrix = true;
        }
        if (isNumber(arg) || isBigNumber(arg)) {
          if (i !== len - 1) {
            throw new Error("Dimension must be specified as last argument");
          }
          prevDim = dim;
          dim = arg.valueOf();
          if (!isInteger3(dim)) {
            throw new TypeError("Integer number expected for dimension");
          }
          if (dim < 0 || i > 0 && dim > prevDim) {
            throw new IndexError(dim, prevDim + 1);
          }
        } else {
          var m = clone(arg).valueOf();
          var size2 = arraySize(m);
          matrices[i] = m;
          prevDim = dim;
          dim = size2.length - 1;
          if (i > 0 && dim !== prevDim) {
            throw new DimensionError(prevDim + 1, dim + 1);
          }
        }
      }
      if (matrices.length === 0) {
        throw new SyntaxError("At least one matrix expected");
      }
      var res = matrices.shift();
      while (matrices.length) {
        res = concat(res, matrices.shift(), dim);
      }
      return asMatrix ? matrix2(res) : res;
    },
    "...string": function string(args) {
      return args.join("");
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/flatten.js
var name32 = "flatten";
var dependencies33 = ["typed"];
var createFlatten = /* @__PURE__ */ factory(name32, dependencies33, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name32, {
    Array: function Array2(x) {
      return flatten(x);
    },
    Matrix: function Matrix3(x) {
      return x.create(flatten(x.valueOf()), x.datatype());
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/getMatrixDataType.js
var name33 = "getMatrixDataType";
var dependencies34 = ["typed"];
var createGetMatrixDataType = /* @__PURE__ */ factory(name33, dependencies34, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name33, {
    Array: function Array2(x) {
      return getArrayDataType(x, typeOf);
    },
    Matrix: function Matrix3(x) {
      return x.getDataType();
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/map.js
var name34 = "map";
var dependencies35 = ["typed"];
var createMap = /* @__PURE__ */ factory(name34, dependencies35, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3(name34, {
    "Array, function": _mapArray,
    "Matrix, function": function Matrix_function(x, callback) {
      return x.map(callback);
    },
    "Array|Matrix, Array|Matrix, ...Array|Matrix|function": (A, B, rest) => _mapMultiple([A, B, ...rest.slice(0, rest.length - 1)], rest[rest.length - 1])
  });
  function _mapMultiple(Arrays, multiCallback) {
    if (typeof multiCallback !== "function") {
      throw new Error("Last argument must be a callback function");
    }
    var firstArrayIsMatrix = Arrays[0].isMatrix;
    var newSize = broadcastSizes(...Arrays.map((M) => M.isMatrix ? M.size() : arraySize(M)));
    var _get = firstArrayIsMatrix ? (matrix2, idx) => matrix2.get(idx) : get;
    var broadcastedArrays = firstArrayIsMatrix ? Arrays.map((M) => M.isMatrix ? M.create(broadcastTo(M.toArray(), newSize), M.datatype()) : Arrays[0].create(broadcastTo(M.valueOf(), newSize))) : Arrays.map((M) => M.isMatrix ? broadcastTo(M.toArray(), newSize) : broadcastTo(M, newSize));
    var callback;
    if (typed3.isTypedFunction(multiCallback)) {
      var firstIndex = newSize.map(() => 0);
      var firstValues = broadcastedArrays.map((array) => _get(array, firstIndex));
      var callbackCase = _getTypedCallbackCase(multiCallback, firstValues, firstIndex, broadcastedArrays);
      callback = _getLimitedCallback(callbackCase);
    } else {
      var numberOfArrays = Arrays.length;
      var _callbackCase = _getCallbackCase(multiCallback, numberOfArrays);
      callback = _getLimitedCallback(_callbackCase);
    }
    var broadcastedArraysCallback = (x, idx) => callback([x, ...broadcastedArrays.slice(1).map((Array2) => _get(Array2, idx))], idx);
    if (firstArrayIsMatrix) {
      return broadcastedArrays[0].map(broadcastedArraysCallback);
    } else {
      return _mapArray(broadcastedArrays[0], broadcastedArraysCallback);
    }
    function _getLimitedCallback(callbackCase2) {
      switch (callbackCase2) {
        case 0:
          return (x) => multiCallback(...x);
        case 1:
          return (x, idx) => multiCallback(...x, idx);
        case 2:
          return (x, idx) => multiCallback(...x, idx, ...broadcastedArrays);
      }
    }
    function _getCallbackCase(callback2, numberOfArrays2) {
      if (callback2.length > numberOfArrays2 + 1) {
        return 2;
      }
      if (callback2.length === numberOfArrays2 + 1) {
        return 1;
      }
      return 0;
    }
    function _getTypedCallbackCase(callback2, values, idx, arrays) {
      if (typed3.resolve(callback2, [...values, idx, ...arrays]) !== null) {
        return 2;
      }
      if (typed3.resolve(callback2, [...values, idx]) !== null) {
        return 1;
      }
      if (typed3.resolve(callback2, values) !== null) {
        return 0;
      }
      return 0;
    }
  }
  function _mapArray(array, callback) {
    return deepMap(array, optimizeCallback(callback, array, name34));
  }
});

// node_modules/mathjs/lib/esm/utils/noop.js
function noBignumber() {
  throw new Error('No "bignumber" implementation available');
}
function noMatrix() {
  throw new Error('No "matrix" implementation available');
}

// node_modules/mathjs/lib/esm/function/matrix/range.js
var name35 = "range";
var dependencies36 = ["typed", "config", "?matrix", "?bignumber", "smaller", "smallerEq", "larger", "largerEq", "add", "isPositive"];
var createRange = /* @__PURE__ */ factory(name35, dependencies36, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    matrix: matrix2,
    bignumber: bignumber2,
    smaller: smaller3,
    smallerEq: smallerEq2,
    larger: larger2,
    largerEq: largerEq2,
    add: add3,
    isPositive: isPositive2
  } = _ref;
  return typed3(name35, {
    // TODO: simplify signatures when typed-function supports default values and optional arguments
    string: _strRange,
    "string, boolean": _strRange,
    number: function number(oops) {
      throw new TypeError("Too few arguments to function range(): ".concat(oops));
    },
    boolean: function boolean(oops) {
      throw new TypeError("Unexpected type of argument 1 to function range(): ".concat(oops, ", number|bigint|BigNumber|Fraction"));
    },
    "number, number": function number_number(start, end) {
      return _out(_range(start, end, 1, false));
    },
    "number, number, number": function number_number_number(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "number, number, boolean": function number_number_boolean(start, end, includeEnd) {
      return _out(_range(start, end, 1, includeEnd));
    },
    "number, number, number, boolean": function number_number_number_boolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    },
    // Handle bigints; if either limit is bigint, range should be too
    "bigint, bigint|number": function bigint_bigintNumber(start, end) {
      return _out(_range(start, end, 1n, false));
    },
    "number, bigint": function number_bigint(start, end) {
      return _out(_range(BigInt(start), end, 1n, false));
    },
    "bigint, bigint|number, bigint|number": function bigint_bigintNumber_bigintNumber(start, end, step) {
      return _out(_range(start, end, BigInt(step), false));
    },
    "number, bigint, bigint|number": function number_bigint_bigintNumber(start, end, step) {
      return _out(_range(BigInt(start), end, BigInt(step), false));
    },
    "bigint, bigint|number, boolean": function bigint_bigintNumber_boolean(start, end, includeEnd) {
      return _out(_range(start, end, 1n, includeEnd));
    },
    "number, bigint, boolean": function number_bigint_boolean(start, end, includeEnd) {
      return _out(_range(BigInt(start), end, 1n, includeEnd));
    },
    "bigint, bigint|number, bigint|number, boolean": function bigint_bigintNumber_bigintNumber_boolean(start, end, step, includeEnd) {
      return _out(_range(start, end, BigInt(step), includeEnd));
    },
    "number, bigint, bigint|number, boolean": function number_bigint_bigintNumber_boolean(start, end, step, includeEnd) {
      return _out(_range(BigInt(start), end, BigInt(step), includeEnd));
    },
    "BigNumber, BigNumber": function BigNumber_BigNumber(start, end) {
      var BigNumber2 = start.constructor;
      return _out(_range(start, end, new BigNumber2(1), false));
    },
    "BigNumber, BigNumber, BigNumber": function BigNumber_BigNumber_BigNumber(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "BigNumber, BigNumber, boolean": function BigNumber_BigNumber_boolean(start, end, includeEnd) {
      var BigNumber2 = start.constructor;
      return _out(_range(start, end, new BigNumber2(1), includeEnd));
    },
    "BigNumber, BigNumber, BigNumber, boolean": function BigNumber_BigNumber_BigNumber_boolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    },
    "Fraction, Fraction": function Fraction_Fraction(start, end) {
      return _out(_range(start, end, 1, false));
    },
    "Fraction, Fraction, Fraction": function Fraction_Fraction_Fraction(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "Fraction, Fraction, boolean": function Fraction_Fraction_boolean(start, end, includeEnd) {
      return _out(_range(start, end, 1, includeEnd));
    },
    "Fraction, Fraction, Fraction, boolean": function Fraction_Fraction_Fraction_boolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    },
    "Unit, Unit, Unit": function Unit_Unit_Unit(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "Unit, Unit, Unit, boolean": function Unit_Unit_Unit_boolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    }
  });
  function _out(arr) {
    if (config4.matrix === "Matrix") {
      return matrix2 ? matrix2(arr) : noMatrix();
    }
    return arr;
  }
  function _strRange(str, includeEnd) {
    var r = _parse(str);
    if (!r) {
      throw new SyntaxError('String "' + str + '" is no valid range');
    }
    if (config4.number === "BigNumber") {
      if (bignumber2 === void 0) {
        noBignumber();
      }
      return _out(_range(bignumber2(r.start), bignumber2(r.end), bignumber2(r.step)), includeEnd);
    } else {
      return _out(_range(r.start, r.end, r.step, includeEnd));
    }
  }
  function _range(start, end, step, includeEnd) {
    var array = [];
    var ongoing = isPositive2(step) ? includeEnd ? smallerEq2 : smaller3 : includeEnd ? largerEq2 : larger2;
    var x = start;
    while (ongoing(x, end)) {
      array.push(x);
      x = add3(x, step);
    }
    return array;
  }
  function _parse(str) {
    var args = str.split(":");
    var nums = args.map(function(arg) {
      return Number(arg);
    });
    var invalid = nums.some(function(num) {
      return isNaN(num);
    });
    if (invalid) {
      return null;
    }
    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };
      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };
      default:
        return null;
    }
  }
});

// node_modules/mathjs/lib/esm/function/matrix/reshape.js
var name36 = "reshape";
var dependencies37 = ["typed", "isInteger", "matrix"];
var createReshape = /* @__PURE__ */ factory(name36, dependencies37, (_ref) => {
  var {
    typed: typed3,
    isInteger: isInteger3
  } = _ref;
  return typed3(name36, {
    "Matrix, Array": function Matrix_Array(x, sizes) {
      return x.reshape(sizes, true);
    },
    "Array, Array": function Array_Array(x, sizes) {
      sizes.forEach(function(size2) {
        if (!isInteger3(size2)) {
          throw new TypeError("Invalid size for dimension: " + size2);
        }
      });
      return reshape(x, sizes);
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/size.js
var name37 = "size";
var dependencies38 = ["typed", "config", "?matrix"];
var createSize = /* @__PURE__ */ factory(name37, dependencies38, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    matrix: matrix2
  } = _ref;
  return typed3(name37, {
    Matrix: function Matrix3(x) {
      return x.create(x.size(), "number");
    },
    Array: arraySize,
    string: function string(x) {
      return config4.matrix === "Array" ? [x.length] : matrix2([x.length], "dense", "number");
    },
    "number | Complex | BigNumber | Unit | boolean | null": function number__Complex__BigNumber__Unit__boolean__null(x) {
      return config4.matrix === "Array" ? [] : matrix2 ? matrix2([], "dense", "number") : noMatrix();
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/subset.js
var name38 = "subset";
var dependencies39 = ["typed", "matrix", "zeros", "add"];
var createSubset = /* @__PURE__ */ factory(name38, dependencies39, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2,
    zeros: zeros3,
    add: add3
  } = _ref;
  return typed3(name38, {
    // get subset
    "Matrix, Index": function Matrix_Index(value, index2) {
      if (isEmptyIndex(index2)) {
        return matrix2();
      }
      validateIndexSourceSize(value, index2);
      return value.subset(index2);
    },
    "Array, Index": typed3.referTo("Matrix, Index", function(subsetRef) {
      return function(value, index2) {
        var subsetResult = subsetRef(matrix2(value), index2);
        return index2.isScalar() ? subsetResult : subsetResult.valueOf();
      };
    }),
    "Object, Index": _getObjectProperty,
    "string, Index": _getSubstring,
    // set subset
    "Matrix, Index, any, any": function Matrix_Index_any_any(value, index2, replacement, defaultValue) {
      if (isEmptyIndex(index2)) {
        return value;
      }
      validateIndexSourceSize(value, index2);
      return value.clone().subset(index2, _broadcastReplacement(replacement, index2), defaultValue);
    },
    "Array, Index, any, any": typed3.referTo("Matrix, Index, any, any", function(subsetRef) {
      return function(value, index2, replacement, defaultValue) {
        var subsetResult = subsetRef(matrix2(value), index2, replacement, defaultValue);
        return subsetResult.isMatrix ? subsetResult.valueOf() : subsetResult;
      };
    }),
    "Array, Index, any": typed3.referTo("Matrix, Index, any, any", function(subsetRef) {
      return function(value, index2, replacement) {
        return subsetRef(matrix2(value), index2, replacement, void 0).valueOf();
      };
    }),
    "Matrix, Index, any": typed3.referTo("Matrix, Index, any, any", function(subsetRef) {
      return function(value, index2, replacement) {
        return subsetRef(value, index2, replacement, void 0);
      };
    }),
    "string, Index, string": _setSubstring,
    "string, Index, string, string": _setSubstring,
    "Object, Index, any": _setObjectProperty
  });
  function _broadcastReplacement(replacement, index2) {
    if (typeof replacement === "string") {
      throw new Error("can't boradcast a string");
    }
    if (index2._isScalar) {
      return replacement;
    }
    var indexSize = index2.size();
    if (indexSize.every((d) => d > 0)) {
      try {
        return add3(replacement, zeros3(indexSize));
      } catch (error) {
        return replacement;
      }
    } else {
      return replacement;
    }
  }
});
function _getSubstring(str, index2) {
  if (!isIndex(index2)) {
    throw new TypeError("Index expected");
  }
  if (isEmptyIndex(index2)) {
    return "";
  }
  validateIndexSourceSize(Array.from(str), index2);
  if (index2.size().length !== 1) {
    throw new DimensionError(index2.size().length, 1);
  }
  var strLen = str.length;
  validateIndex(index2.min()[0], strLen);
  validateIndex(index2.max()[0], strLen);
  var range2 = index2.dimension(0);
  var substr = "";
  range2.forEach(function(v) {
    substr += str.charAt(v);
  });
  return substr;
}
function _setSubstring(str, index2, replacement, defaultValue) {
  if (!index2 || index2.isIndex !== true) {
    throw new TypeError("Index expected");
  }
  if (isEmptyIndex(index2)) {
    return str;
  }
  validateIndexSourceSize(Array.from(str), index2);
  if (index2.size().length !== 1) {
    throw new DimensionError(index2.size().length, 1);
  }
  if (defaultValue !== void 0) {
    if (typeof defaultValue !== "string" || defaultValue.length !== 1) {
      throw new TypeError("Single character expected as defaultValue");
    }
  } else {
    defaultValue = " ";
  }
  var range2 = index2.dimension(0);
  var len = range2.size()[0];
  if (len !== replacement.length) {
    throw new DimensionError(range2.size()[0], replacement.length);
  }
  var strLen = str.length;
  validateIndex(index2.min()[0]);
  validateIndex(index2.max()[0]);
  var chars = [];
  for (var i = 0; i < strLen; i++) {
    chars[i] = str.charAt(i);
  }
  range2.forEach(function(v, i2) {
    chars[v] = replacement.charAt(i2[0]);
  });
  if (chars.length > strLen) {
    for (var _i = strLen - 1, _len = chars.length; _i < _len; _i++) {
      if (!chars[_i]) {
        chars[_i] = defaultValue;
      }
    }
  }
  return chars.join("");
}
function _getObjectProperty(object, index2) {
  if (isEmptyIndex(index2)) {
    return void 0;
  }
  if (index2.size().length !== 1) {
    throw new DimensionError(index2.size(), 1);
  }
  var key = index2.dimension(0);
  if (typeof key !== "string") {
    throw new TypeError("String expected as index to retrieve an object property");
  }
  return getSafeProperty(object, key);
}
function _setObjectProperty(object, index2, replacement) {
  if (isEmptyIndex(index2)) {
    return object;
  }
  if (index2.size().length !== 1) {
    throw new DimensionError(index2.size(), 1);
  }
  var key = index2.dimension(0);
  if (typeof key !== "string") {
    throw new TypeError("String expected as index to retrieve an object property");
  }
  var updated = clone(object);
  setSafeProperty(updated, key, replacement);
  return updated;
}

// node_modules/mathjs/lib/esm/function/matrix/transpose.js
var name39 = "transpose";
var dependencies40 = ["typed", "matrix"];
var createTranspose = /* @__PURE__ */ factory(name39, dependencies40, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2
  } = _ref;
  return typed3(name39, {
    Array: (x) => transposeMatrix(matrix2(x)).valueOf(),
    Matrix: transposeMatrix,
    any: clone
    // scalars
  });
  function transposeMatrix(x) {
    var size2 = x.size();
    var c;
    switch (size2.length) {
      case 1:
        c = x.clone();
        break;
      case 2:
        {
          var rows = size2[0];
          var columns = size2[1];
          if (columns === 0) {
            throw new RangeError("Cannot transpose a 2D matrix with no columns (size: " + format3(size2) + ")");
          }
          switch (x.storage()) {
            case "dense":
              c = _denseTranspose(x, rows, columns);
              break;
            case "sparse":
              c = _sparseTranspose(x, rows, columns);
              break;
          }
        }
        break;
      default:
        throw new RangeError("Matrix must be a vector or two dimensional (size: " + format3(size2) + ")");
    }
    return c;
  }
  function _denseTranspose(m, rows, columns) {
    var data = m._data;
    var transposed = [];
    var transposedRow;
    for (var j = 0; j < columns; j++) {
      transposedRow = transposed[j] = [];
      for (var i = 0; i < rows; i++) {
        transposedRow[i] = clone(data[i][j]);
      }
    }
    return m.createDenseMatrix({
      data: transposed,
      size: [columns, rows],
      datatype: m._datatype
    });
  }
  function _sparseTranspose(m, rows, columns) {
    var values = m._values;
    var index2 = m._index;
    var ptr = m._ptr;
    var cvalues = values ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var w = [];
    for (var x = 0; x < rows; x++) {
      w[x] = 0;
    }
    var p, l, j;
    for (p = 0, l = index2.length; p < l; p++) {
      w[index2[p]]++;
    }
    var sum2 = 0;
    for (var i = 0; i < rows; i++) {
      cptr.push(sum2);
      sum2 += w[i];
      w[i] = cptr[i];
    }
    cptr.push(sum2);
    for (j = 0; j < columns; j++) {
      for (var k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
        var q = w[index2[k]]++;
        cindex[q] = j;
        if (values) {
          cvalues[q] = clone(values[k]);
        }
      }
    }
    return m.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows],
      datatype: m._datatype
    });
  }
});

// node_modules/mathjs/lib/esm/function/matrix/zeros.js
var name40 = "zeros";
var dependencies41 = ["typed", "config", "matrix", "BigNumber"];
var createZeros = /* @__PURE__ */ factory(name40, dependencies41, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    matrix: matrix2,
    BigNumber: BigNumber2
  } = _ref;
  return typed3(name40, {
    "": function _() {
      return config4.matrix === "Array" ? _zeros([]) : _zeros([], "default");
    },
    // math.zeros(m, n, p, ..., format)
    // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
    "...number | BigNumber | string": function number__BigNumber__string(size2) {
      var last = size2[size2.length - 1];
      if (typeof last === "string") {
        var format4 = size2.pop();
        return _zeros(size2, format4);
      } else if (config4.matrix === "Array") {
        return _zeros(size2);
      } else {
        return _zeros(size2, "default");
      }
    },
    Array: _zeros,
    Matrix: function Matrix3(size2) {
      var format4 = size2.storage();
      return _zeros(size2.valueOf(), format4);
    },
    "Array | Matrix, string": function Array__Matrix_string(size2, format4) {
      return _zeros(size2.valueOf(), format4);
    }
  });
  function _zeros(size2, format4) {
    var hasBigNumbers = _normalize(size2);
    var defaultValue = hasBigNumbers ? new BigNumber2(0) : 0;
    _validate2(size2);
    if (format4) {
      var m = matrix2(format4);
      if (size2.length > 0) {
        return m.resize(size2, defaultValue);
      }
      return m;
    } else {
      var arr = [];
      if (size2.length > 0) {
        return resize(arr, size2, defaultValue);
      }
      return arr;
    }
  }
  function _normalize(size2) {
    var hasBigNumbers = false;
    size2.forEach(function(value, index2, arr) {
      if (isBigNumber(value)) {
        hasBigNumbers = true;
        arr[index2] = value.toNumber();
      }
    });
    return hasBigNumbers;
  }
  function _validate2(size2) {
    size2.forEach(function(value) {
      if (typeof value !== "number" || !isInteger(value) || value < 0) {
        throw new Error("Parameters in function zeros must be positive integers");
      }
    });
  }
});

// node_modules/mathjs/lib/esm/function/relational/smaller.js
var name41 = "smaller";
var dependencies42 = ["typed", "config", "bignumber", "matrix", "DenseMatrix", "concat", "SparseMatrix"];
var createSmaller = /* @__PURE__ */ factory(name41, dependencies42, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    bignumber: bignumber2,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3,
    SparseMatrix: SparseMatrix2
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed3
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed3,
    SparseMatrix: SparseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed3,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed3
  });
  function bignumSmaller(x, y) {
    return x.lt(y) && !nearlyEqual2(x, y, config4.relTol, config4.absTol);
  }
  return typed3(name41, createSmallerNumber({
    typed: typed3,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x < y,
    "BigNumber, BigNumber": bignumSmaller,
    "bigint, bigint": (x, y) => x < y,
    "Fraction, Fraction": (x, y) => x.compare(y) === -1,
    "Fraction, BigNumber": function Fraction_BigNumber(x, y) {
      return bignumSmaller(bignumber2(x), y);
    },
    "BigNumber, Fraction": function BigNumber_Fraction(x, y) {
      return bignumSmaller(x, bignumber2(y));
    },
    "Complex, Complex": function Complex_Complex(x, y) {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createSmallerNumber = /* @__PURE__ */ factory(name41, ["typed", "config"], (_ref2) => {
  var {
    typed: typed3,
    config: config4
  } = _ref2;
  return typed3(name41, {
    "number, number": function number_number(x, y) {
      return x < y && !nearlyEqual(x, y, config4.relTol, config4.absTol);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/smallerEq.js
var name42 = "smallerEq";
var dependencies43 = ["typed", "config", "matrix", "DenseMatrix", "concat", "SparseMatrix"];
var createSmallerEq = /* @__PURE__ */ factory(name42, dependencies43, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3,
    SparseMatrix: SparseMatrix2
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed3
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed3,
    SparseMatrix: SparseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed3,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed3
  });
  return typed3(name42, createSmallerEqNumber({
    typed: typed3,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x <= y,
    "BigNumber, BigNumber": function BigNumber_BigNumber(x, y) {
      return x.lte(y) || nearlyEqual2(x, y, config4.relTol, config4.absTol);
    },
    "bigint, bigint": (x, y) => x <= y,
    "Fraction, Fraction": (x, y) => x.compare(y) !== 1,
    "Complex, Complex": function Complex_Complex() {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createSmallerEqNumber = /* @__PURE__ */ factory(name42, ["typed", "config"], (_ref2) => {
  var {
    typed: typed3,
    config: config4
  } = _ref2;
  return typed3(name42, {
    "number, number": function number_number(x, y) {
      return x <= y || nearlyEqual(x, y, config4.relTol, config4.absTol);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/larger.js
var name43 = "larger";
var dependencies44 = ["typed", "config", "bignumber", "matrix", "DenseMatrix", "concat", "SparseMatrix"];
var createLarger = /* @__PURE__ */ factory(name43, dependencies44, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    bignumber: bignumber2,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3,
    SparseMatrix: SparseMatrix2
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed3
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed3,
    SparseMatrix: SparseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed3,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed3
  });
  function bignumLarger(x, y) {
    return x.gt(y) && !nearlyEqual2(x, y, config4.relTol, config4.absTol);
  }
  return typed3(name43, createLargerNumber({
    typed: typed3,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x > y,
    "BigNumber, BigNumber": bignumLarger,
    "bigint, bigint": (x, y) => x > y,
    "Fraction, Fraction": (x, y) => x.compare(y) === 1,
    "Fraction, BigNumber": function Fraction_BigNumber(x, y) {
      return bignumLarger(bignumber2(x), y);
    },
    "BigNumber, Fraction": function BigNumber_Fraction(x, y) {
      return bignumLarger(x, bignumber2(y));
    },
    "Complex, Complex": function Complex_Complex() {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createLargerNumber = /* @__PURE__ */ factory(name43, ["typed", "config"], (_ref2) => {
  var {
    typed: typed3,
    config: config4
  } = _ref2;
  return typed3(name43, {
    "number, number": function number_number(x, y) {
      return x > y && !nearlyEqual(x, y, config4.relTol, config4.absTol);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/largerEq.js
var name44 = "largerEq";
var dependencies45 = ["typed", "config", "matrix", "DenseMatrix", "concat", "SparseMatrix"];
var createLargerEq = /* @__PURE__ */ factory(name44, dependencies45, (_ref) => {
  var {
    typed: typed3,
    config: config4,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3,
    SparseMatrix: SparseMatrix2
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed3
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed3,
    SparseMatrix: SparseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed3,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed3
  });
  return typed3(name44, createLargerEqNumber({
    typed: typed3,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x >= y,
    "BigNumber, BigNumber": function BigNumber_BigNumber(x, y) {
      return x.gte(y) || nearlyEqual2(x, y, config4.relTol, config4.absTol);
    },
    "bigint, bigint": function bigint_bigint(x, y) {
      return x >= y;
    },
    "Fraction, Fraction": (x, y) => x.compare(y) !== -1,
    "Complex, Complex": function Complex_Complex() {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createLargerEqNumber = /* @__PURE__ */ factory(name44, ["typed", "config"], (_ref2) => {
  var {
    typed: typed3,
    config: config4
  } = _ref2;
  return typed3(name44, {
    "number, number": function number_number(x, y) {
      return x >= y || nearlyEqual(x, y, config4.relTol, config4.absTol);
    }
  });
});

// node_modules/mathjs/lib/esm/type/matrix/ImmutableDenseMatrix.js
var name45 = "ImmutableDenseMatrix";
var dependencies46 = ["smaller", "DenseMatrix"];
var createImmutableDenseMatrixClass = /* @__PURE__ */ factory(name45, dependencies46, (_ref) => {
  var {
    smaller: smaller3,
    DenseMatrix: DenseMatrix2
  } = _ref;
  function ImmutableDenseMatrix2(data, datatype) {
    if (!(this instanceof ImmutableDenseMatrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    if (datatype && !isString(datatype)) {
      throw new Error("Invalid datatype: " + datatype);
    }
    if (isMatrix(data) || isArray(data)) {
      var matrix2 = new DenseMatrix2(data, datatype);
      this._data = matrix2._data;
      this._size = matrix2._size;
      this._datatype = matrix2._datatype;
      this._min = null;
      this._max = null;
    } else if (data && isArray(data.data) && isArray(data.size)) {
      this._data = data.data;
      this._size = data.size;
      this._datatype = data.datatype;
      this._min = typeof data.min !== "undefined" ? data.min : null;
      this._max = typeof data.max !== "undefined" ? data.max : null;
    } else if (data) {
      throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
    } else {
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
      this._min = null;
      this._max = null;
    }
  }
  ImmutableDenseMatrix2.prototype = new DenseMatrix2();
  ImmutableDenseMatrix2.prototype.type = "ImmutableDenseMatrix";
  ImmutableDenseMatrix2.prototype.isImmutableDenseMatrix = true;
  ImmutableDenseMatrix2.prototype.subset = function(index2) {
    switch (arguments.length) {
      case 1: {
        var m = DenseMatrix2.prototype.subset.call(this, index2);
        if (isMatrix(m)) {
          return new ImmutableDenseMatrix2({
            data: m._data,
            size: m._size,
            datatype: m._datatype
          });
        }
        return m;
      }
      // intentional fall through
      case 2:
      case 3:
        throw new Error("Cannot invoke set subset on an Immutable Matrix instance");
      default:
        throw new SyntaxError("Wrong number of arguments");
    }
  };
  ImmutableDenseMatrix2.prototype.set = function() {
    throw new Error("Cannot invoke set on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.resize = function() {
    throw new Error("Cannot invoke resize on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.reshape = function() {
    throw new Error("Cannot invoke reshape on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.clone = function() {
    return new ImmutableDenseMatrix2({
      data: clone(this._data),
      size: clone(this._size),
      datatype: this._datatype
    });
  };
  ImmutableDenseMatrix2.prototype.toJSON = function() {
    return {
      mathjs: "ImmutableDenseMatrix",
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };
  ImmutableDenseMatrix2.fromJSON = function(json) {
    return new ImmutableDenseMatrix2(json);
  };
  ImmutableDenseMatrix2.prototype.swapRows = function() {
    throw new Error("Cannot invoke swapRows on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.min = function() {
    if (this._min === null) {
      var m = null;
      this.forEach(function(v) {
        if (m === null || smaller3(v, m)) {
          m = v;
        }
      });
      this._min = m !== null ? m : void 0;
    }
    return this._min;
  };
  ImmutableDenseMatrix2.prototype.max = function() {
    if (this._max === null) {
      var m = null;
      this.forEach(function(v) {
        if (m === null || smaller3(m, v)) {
          m = v;
        }
      });
      this._max = m !== null ? m : void 0;
    }
    return this._max;
  };
  return ImmutableDenseMatrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/matrix/MatrixIndex.js
var name46 = "Index";
var dependencies47 = ["ImmutableDenseMatrix", "getMatrixDataType"];
var createIndexClass = /* @__PURE__ */ factory(name46, dependencies47, (_ref) => {
  var {
    ImmutableDenseMatrix: ImmutableDenseMatrix2,
    getMatrixDataType: getMatrixDataType2
  } = _ref;
  function Index2(ranges) {
    if (!(this instanceof Index2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    this._dimensions = [];
    this._sourceSize = [];
    this._isScalar = true;
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];
      var argIsArray = isArray(arg);
      var argIsMatrix = isMatrix(arg);
      var argType = typeof arg;
      var sourceSize = null;
      if (isRange(arg)) {
        this._dimensions.push(arg);
        this._isScalar = false;
      } else if (argIsArray || argIsMatrix) {
        var m = void 0;
        if (getMatrixDataType2(arg) === "boolean") {
          if (argIsArray) m = _createImmutableMatrix(_booleansArrayToNumbersForIndex(arg).valueOf());
          if (argIsMatrix) m = _createImmutableMatrix(_booleansArrayToNumbersForIndex(arg._data).valueOf());
          sourceSize = arg.valueOf().length;
        } else {
          m = _createImmutableMatrix(arg.valueOf());
        }
        this._dimensions.push(m);
        var size2 = m.size();
        if (size2.length !== 1 || size2[0] !== 1 || sourceSize !== null) {
          this._isScalar = false;
        }
      } else if (argType === "number") {
        this._dimensions.push(_createImmutableMatrix([arg]));
      } else if (argType === "bigint") {
        this._dimensions.push(_createImmutableMatrix([Number(arg)]));
      } else if (argType === "string") {
        this._dimensions.push(arg);
      } else {
        throw new TypeError("Dimension must be an Array, Matrix, number, bigint, string, or Range");
      }
      this._sourceSize.push(sourceSize);
    }
  }
  Index2.prototype.type = "Index";
  Index2.prototype.isIndex = true;
  function _createImmutableMatrix(arg) {
    for (var i = 0, l = arg.length; i < l; i++) {
      if (typeof arg[i] !== "number" || !isInteger(arg[i])) {
        throw new TypeError("Index parameters must be positive integer numbers");
      }
    }
    return new ImmutableDenseMatrix2(arg);
  }
  Index2.prototype.clone = function() {
    var index2 = new Index2();
    index2._dimensions = clone(this._dimensions);
    index2._isScalar = this._isScalar;
    index2._sourceSize = this._sourceSize;
    return index2;
  };
  Index2.create = function(ranges) {
    var index2 = new Index2();
    Index2.apply(index2, ranges);
    return index2;
  };
  Index2.prototype.size = function() {
    var size2 = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var d = this._dimensions[i];
      size2[i] = typeof d === "string" ? 1 : d.size()[0];
    }
    return size2;
  };
  Index2.prototype.max = function() {
    var values = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var range2 = this._dimensions[i];
      values[i] = typeof range2 === "string" ? range2 : range2.max();
    }
    return values;
  };
  Index2.prototype.min = function() {
    var values = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var range2 = this._dimensions[i];
      values[i] = typeof range2 === "string" ? range2 : range2.min();
    }
    return values;
  };
  Index2.prototype.forEach = function(callback) {
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      callback(this._dimensions[i], i, this);
    }
  };
  Index2.prototype.dimension = function(dim) {
    if (typeof dim !== "number") {
      return null;
    }
    return this._dimensions[dim] || null;
  };
  Index2.prototype.isObjectProperty = function() {
    return this._dimensions.length === 1 && typeof this._dimensions[0] === "string";
  };
  Index2.prototype.getObjectProperty = function() {
    return this.isObjectProperty() ? this._dimensions[0] : null;
  };
  Index2.prototype.isScalar = function() {
    return this._isScalar;
  };
  Index2.prototype.toArray = function() {
    var array = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var dimension = this._dimensions[i];
      array.push(typeof dimension === "string" ? dimension : dimension.toArray());
    }
    return array;
  };
  Index2.prototype.valueOf = Index2.prototype.toArray;
  Index2.prototype.toString = function() {
    var strings2 = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var dimension = this._dimensions[i];
      if (typeof dimension === "string") {
        strings2.push(JSON.stringify(dimension));
      } else {
        strings2.push(dimension.toString());
      }
    }
    return "[" + strings2.join(", ") + "]";
  };
  Index2.prototype.toJSON = function() {
    return {
      mathjs: "Index",
      dimensions: this._dimensions
    };
  };
  Index2.fromJSON = function(json) {
    return Index2.create(json.dimensions);
  };
  return Index2;
}, {
  isClass: true
});
function _booleansArrayToNumbersForIndex(booleanArrayIndex) {
  var indexOfNumbers = [];
  booleanArrayIndex.forEach((bool, idx) => {
    if (bool) {
      indexOfNumbers.push(idx);
    }
  });
  return indexOfNumbers;
}

// node_modules/mathjs/lib/esm/function/trigonometry/tanh.js
var name47 = "tanh";
var dependencies48 = ["typed"];
var createTanh = /* @__PURE__ */ factory(name47, dependencies48, (_ref) => {
  var {
    typed: typed3
  } = _ref;
  return typed3("tanh", {
    number: tanh,
    "Complex | BigNumber": (x) => x.tanh()
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/add.js
var name48 = "add";
var dependencies49 = ["typed", "matrix", "addScalar", "equalScalar", "DenseMatrix", "SparseMatrix", "concat"];
var createAdd = /* @__PURE__ */ factory(name48, dependencies49, (_ref) => {
  var {
    typed: typed3,
    matrix: matrix2,
    addScalar: addScalar2,
    equalScalar: equalScalar2,
    DenseMatrix: DenseMatrix2,
    SparseMatrix: SparseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo01xDSid = createMatAlgo01xDSid({
    typed: typed3
  });
  var matAlgo04xSidSid = createMatAlgo04xSidSid({
    typed: typed3,
    equalScalar: equalScalar2
  });
  var matAlgo10xSids = createMatAlgo10xSids({
    typed: typed3,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed3,
    matrix: matrix2,
    concat: concat3
  });
  return typed3(name48, {
    "any, any": addScalar2,
    "any, any, ...any": typed3.referToSelf((self2) => (x, y, rest) => {
      var result = self2(x, y);
      for (var i = 0; i < rest.length; i++) {
        result = self2(result, rest[i]);
      }
      return result;
    })
  }, matrixAlgorithmSuite({
    elop: addScalar2,
    DS: matAlgo01xDSid,
    SS: matAlgo04xSidSid,
    Ss: matAlgo10xSids
  }));
});

// node_modules/mathjs/lib/esm/function/matrix/dot.js
var name49 = "dot";
var dependencies50 = ["typed", "addScalar", "multiplyScalar", "conj", "size"];
var createDot = /* @__PURE__ */ factory(name49, dependencies50, (_ref) => {
  var {
    typed: typed3,
    addScalar: addScalar2,
    multiplyScalar: multiplyScalar2,
    conj: conj2,
    size: size2
  } = _ref;
  return typed3(name49, {
    "Array | DenseMatrix, Array | DenseMatrix": _denseDot,
    "SparseMatrix, SparseMatrix": _sparseDot
  });
  function _validateDim(x, y) {
    var xSize = _size(x);
    var ySize = _size(y);
    var xLen, yLen;
    if (xSize.length === 1) {
      xLen = xSize[0];
    } else if (xSize.length === 2 && xSize[1] === 1) {
      xLen = xSize[0];
    } else {
      throw new RangeError("Expected a column vector, instead got a matrix of size (" + xSize.join(", ") + ")");
    }
    if (ySize.length === 1) {
      yLen = ySize[0];
    } else if (ySize.length === 2 && ySize[1] === 1) {
      yLen = ySize[0];
    } else {
      throw new RangeError("Expected a column vector, instead got a matrix of size (" + ySize.join(", ") + ")");
    }
    if (xLen !== yLen) throw new RangeError("Vectors must have equal length (" + xLen + " != " + yLen + ")");
    if (xLen === 0) throw new RangeError("Cannot calculate the dot product of empty vectors");
    return xLen;
  }
  function _denseDot(a, b) {
    var N = _validateDim(a, b);
    var adata = isMatrix(a) ? a._data : a;
    var adt = isMatrix(a) ? a._datatype || a.getDataType() : void 0;
    var bdata = isMatrix(b) ? b._data : b;
    var bdt = isMatrix(b) ? b._datatype || b.getDataType() : void 0;
    var aIsColumn = _size(a).length === 2;
    var bIsColumn = _size(b).length === 2;
    var add3 = addScalar2;
    var mul2 = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string" && adt !== "mixed") {
      var dt = adt;
      add3 = typed3.find(addScalar2, [dt, dt]);
      mul2 = typed3.find(multiplyScalar2, [dt, dt]);
    }
    if (!aIsColumn && !bIsColumn) {
      var c = mul2(conj2(adata[0]), bdata[0]);
      for (var i = 1; i < N; i++) {
        c = add3(c, mul2(conj2(adata[i]), bdata[i]));
      }
      return c;
    }
    if (!aIsColumn && bIsColumn) {
      var _c = mul2(conj2(adata[0]), bdata[0][0]);
      for (var _i = 1; _i < N; _i++) {
        _c = add3(_c, mul2(conj2(adata[_i]), bdata[_i][0]));
      }
      return _c;
    }
    if (aIsColumn && !bIsColumn) {
      var _c2 = mul2(conj2(adata[0][0]), bdata[0]);
      for (var _i2 = 1; _i2 < N; _i2++) {
        _c2 = add3(_c2, mul2(conj2(adata[_i2][0]), bdata[_i2]));
      }
      return _c2;
    }
    if (aIsColumn && bIsColumn) {
      var _c3 = mul2(conj2(adata[0][0]), bdata[0][0]);
      for (var _i3 = 1; _i3 < N; _i3++) {
        _c3 = add3(_c3, mul2(conj2(adata[_i3][0]), bdata[_i3][0]));
      }
      return _c3;
    }
  }
  function _sparseDot(x, y) {
    _validateDim(x, y);
    var xindex = x._index;
    var xvalues = x._values;
    var yindex = y._index;
    var yvalues = y._values;
    var c = 0;
    var add3 = addScalar2;
    var mul2 = multiplyScalar2;
    var i = 0;
    var j = 0;
    while (i < xindex.length && j < yindex.length) {
      var I = xindex[i];
      var J = yindex[j];
      if (I < J) {
        i++;
        continue;
      }
      if (I > J) {
        j++;
        continue;
      }
      if (I === J) {
        c = add3(c, mul2(xvalues[i], yvalues[j]));
        i++;
        j++;
      }
    }
    return c;
  }
  function _size(x) {
    return isMatrix(x) ? x.size() : size2(x);
  }
});

// node_modules/mathjs/lib/esm/type/matrix/function/index.js
var name50 = "index";
var dependencies51 = ["typed", "Index"];
var createIndex = /* @__PURE__ */ factory(name50, dependencies51, (_ref) => {
  var {
    typed: typed3,
    Index: Index2
  } = _ref;
  return typed3(name50, {
    "...number | string | BigNumber | Range | Array | Matrix": function number__string__BigNumber__Range__Array__Matrix(args) {
      var ranges = args.map(function(arg) {
        if (isBigNumber(arg)) {
          return arg.toNumber();
        } else if (isArray(arg) || isMatrix(arg)) {
          return arg.map(function(elem) {
            return isBigNumber(elem) ? elem.toNumber() : elem;
          });
        } else {
          return arg;
        }
      });
      var res = new Index2();
      Index2.apply(res, ranges);
      return res;
    }
  });
});

// node_modules/mathjs/lib/esm/entry/pureFunctionsAny.generated.js
var BigNumber = /* @__PURE__ */ createBigNumberClass({
  config
});
var Complex2 = /* @__PURE__ */ createComplexClass({});
var Fraction2 = /* @__PURE__ */ createFractionClass({});
var Matrix = /* @__PURE__ */ createMatrixClass({});
var DenseMatrix = /* @__PURE__ */ createDenseMatrixClass({
  Matrix
});
var typed2 = /* @__PURE__ */ createTyped({
  BigNumber,
  Complex: Complex2,
  DenseMatrix,
  Fraction: Fraction2
});
var addScalar = /* @__PURE__ */ createAddScalar({
  typed: typed2
});
var conj = /* @__PURE__ */ createConj({
  typed: typed2
});
var equalScalar = /* @__PURE__ */ createEqualScalar({
  config,
  typed: typed2
});
var exp2 = /* @__PURE__ */ createExp({
  typed: typed2
});
var flatten2 = /* @__PURE__ */ createFlatten({
  typed: typed2
});
var getMatrixDataType = /* @__PURE__ */ createGetMatrixDataType({
  typed: typed2
});
var isInteger2 = /* @__PURE__ */ createIsInteger({
  typed: typed2
});
var isPositive = /* @__PURE__ */ createIsPositive({
  config,
  typed: typed2
});
var map = /* @__PURE__ */ createMap({
  typed: typed2
});
var multiplyScalar = /* @__PURE__ */ createMultiplyScalar({
  typed: typed2
});
var SparseMatrix = /* @__PURE__ */ createSparseMatrixClass({
  Matrix,
  equalScalar,
  typed: typed2
});
var subtractScalar = /* @__PURE__ */ createSubtractScalar({
  typed: typed2
});
var bignumber = /* @__PURE__ */ createBignumber({
  BigNumber,
  typed: typed2
});
var matrix = /* @__PURE__ */ createMatrix({
  DenseMatrix,
  Matrix,
  SparseMatrix,
  typed: typed2
});
var reshape2 = /* @__PURE__ */ createReshape({
  isInteger: isInteger2,
  matrix,
  typed: typed2
});
var tanh3 = /* @__PURE__ */ createTanh({
  typed: typed2
});
var transpose = /* @__PURE__ */ createTranspose({
  matrix,
  typed: typed2
});
var zeros2 = /* @__PURE__ */ createZeros({
  BigNumber,
  config,
  matrix,
  typed: typed2
});
var concat2 = /* @__PURE__ */ createConcat({
  isInteger: isInteger2,
  matrix,
  typed: typed2
});
var largerEq = /* @__PURE__ */ createLargerEq({
  DenseMatrix,
  SparseMatrix,
  concat: concat2,
  config,
  matrix,
  typed: typed2
});
var size = /* @__PURE__ */ createSize({
  matrix,
  config,
  typed: typed2
});
var smaller2 = /* @__PURE__ */ createSmaller({
  DenseMatrix,
  SparseMatrix,
  bignumber,
  concat: concat2,
  config,
  matrix,
  typed: typed2
});
var unaryMinus = /* @__PURE__ */ createUnaryMinus({
  typed: typed2
});
var add2 = /* @__PURE__ */ createAdd({
  DenseMatrix,
  SparseMatrix,
  addScalar,
  concat: concat2,
  equalScalar,
  matrix,
  typed: typed2
});
var ImmutableDenseMatrix = /* @__PURE__ */ createImmutableDenseMatrixClass({
  DenseMatrix,
  smaller: smaller2
});
var Index = /* @__PURE__ */ createIndexClass({
  ImmutableDenseMatrix,
  getMatrixDataType
});
var larger = /* @__PURE__ */ createLarger({
  DenseMatrix,
  SparseMatrix,
  bignumber,
  concat: concat2,
  config,
  matrix,
  typed: typed2
});
var smallerEq = /* @__PURE__ */ createSmallerEq({
  DenseMatrix,
  SparseMatrix,
  concat: concat2,
  config,
  matrix,
  typed: typed2
});
var subset = /* @__PURE__ */ createSubset({
  add: add2,
  matrix,
  typed: typed2,
  zeros: zeros2
});
var subtract = /* @__PURE__ */ createSubtract({
  DenseMatrix,
  concat: concat2,
  equalScalar,
  matrix,
  subtractScalar,
  typed: typed2,
  unaryMinus
});
var dot = /* @__PURE__ */ createDot({
  addScalar,
  conj,
  multiplyScalar,
  size,
  typed: typed2
});
var index = /* @__PURE__ */ createIndex({
  Index,
  typed: typed2
});
var multiply = /* @__PURE__ */ createMultiply({
  addScalar,
  dot,
  equalScalar,
  matrix,
  multiplyScalar,
  typed: typed2
});
var range = /* @__PURE__ */ createRange({
  bignumber,
  matrix,
  add: add2,
  config,
  isPositive,
  larger,
  largerEq,
  smaller: smaller2,
  smallerEq,
  typed: typed2
});

// node_modules/rltools/main.js
var Matrix2 = class {
  constructor(dataset) {
    this.rows = dataset.shape[0];
    this.cols = dataset.shape[1];
    const data_flat = matrix(dataset.value);
    this.data = reshape2(data_flat, [this.rows, this.cols]);
  }
};
var Tensor = class {
  constructor(dataset) {
    this.shape = dataset.shape;
    const data_flat = matrix(dataset.value);
    this.data = reshape2(data_flat, this.shape);
  }
};
var DenseLayer = class {
  constructor(group) {
    this.weights = group.get("weights").attrs.type === "matrix" ? new Matrix2(group.get("weights").get("parameters")) : new Tensor(group.get("weights").get("parameters"));
    this.input_shape = [null, null, this.weights.shape[1]];
    this.output_shape = [null, null, this.weights.shape[0]];
    this.biases = group.get("biases").attrs.type === "matrix" ? new Matrix2(group.get("biases").get("parameters")) : new Tensor(group.get("biases").get("parameters"));
    this.activation_function_name = group.attrs.activation_function;
  }
  activation_function(input) {
    if (this.activation_function_name === "IDENTITY") {
      return input;
    } else if (this.activation_function_name === "RELU") {
      return map(input, (x) => x > 0 ? x : 0);
    } else if (this.activation_function_name === "SIGMOID") {
      return map(input, (x) => 1 / (1 + exp2(-x)));
    } else if (this.activation_function_name === "TANH") {
      return map(input, (x) => tanh3(x));
    } else if (this.activation_function_name === "FAST_TANH") {
      let clamp2 = function(value, min2, max2) {
        return Math.max(min2, Math.min(max2, value));
      };
      return map(input, (inp) => {
        const x = clamp2(inp, -3, 3);
        const x_squared = x * x;
        return x * (27 + x_squared) / (27 + 9 * x_squared);
      });
    } else {
      console.error("Unknown activation function: ", this.activation_function_name);
      return null;
    }
  }
  evaluate(input) {
    const leading_dimension = input.size().slice(0, -1).reduce((a, b) => a * b, 1);
    const input_reshaped = reshape2(input, [leading_dimension, input.size()[input.size().length - 1]]);
    let output = multiply(this.weights.data, transpose(input_reshaped));
    output = add2(transpose(output), this.biases.data);
    output = this.activation_function(output);
    const output_shape = input.size().slice(0, -1).concat(this.biases.shape[1]);
    output = reshape2(output, output_shape);
    return output;
  }
};
var SampleAndSquashLayer = class {
  constructor(group) {
    this.input_shape = [null, null, null];
    this.output_shape = [null, null, null];
  }
  evaluate(input) {
    const mean = subset(input, index(
      ...input.size().map((x, i) => {
        if (i === input.size().length - 1) {
          return range(0, x / 2);
        } else {
          return range(0, x);
        }
      })
    ));
    return map(mean, Math.tanh);
  }
};
var MLP = class {
  constructor(group) {
    this.input_layer = new DenseLayer(group.get("input_layer"));
    this.hidden_layers = [];
    for (let i = 0; i < group.attrs.num_layers - 2; i++) {
      this.hidden_layers.push(new DenseLayer(group.get(`hidden_layer_${i}`)));
    }
    this.output_layer = new DenseLayer(group.get("output_layer"));
    this.input_shape = this.input_layer.input_shape;
    this.output_shape = this.output_layer.output_shape;
  }
  evaluate(input) {
    let current = this.input_layer.evaluate(input);
    for (let i = 0; i < this.hidden_layers.length; i++) {
      const layer = this.hidden_layers[i];
      current = layer.evaluate(current);
    }
    current = this.output_layer.evaluate(current);
    return current;
  }
};
var Sequential = class {
  constructor(group) {
    this.layers = [];
    for (let i = 0; i < group.get("layers").keys.length; i++) {
      this.layers.push(layer_dispatch(group.get("layers").get(`${i}`)));
    }
    this.input_shape = this.layers[0].input_shape;
    this.output_shape = this.layers.reverse().find((layer) => layer.output_shape.reduce((a, c) => a || c !== null, null)).output_shape;
  }
  evaluate(input) {
    let current = input;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (layer) {
        current = layer.evaluate(current);
      }
    }
    return current;
  }
};
function layer_dispatch(group) {
  let model = null;
  if (group.attrs.type === "dense") {
    model = new DenseLayer(group);
  } else if (group.attrs.type === "mlp") {
    model = new MLP(group);
  } else if (group.attrs.type === "sequential") {
    model = new Sequential(group);
  } else if (group.attrs.type === "sample_and_squash") {
    model = new SampleAndSquashLayer(group);
  } else {
    console.error("Unknown layer type: ", group.attrs.type);
    model = null;
  }
  if ("checkpoint_name" in group.attrs) {
    model.checkpoint_name = group.attrs.checkpoint_name;
  } else {
    model.checkpoint_name = "noname";
  }
  return model;
}
function load_from_array_buffer(buffer) {
  var f = new File(buffer, "");
  const model = layer_dispatch(f.get("actor"));
  const input = new Tensor(f.get("example").get("input"));
  const target_output = new Tensor(f.get("example").get("output"));
  const output = model.evaluate(input.data);
  const diff = subtract(output, target_output.data);
  const diff_reduce = flatten2(diff).valueOf().reduce((a, c) => a + Math.abs(c)) / diff.size().reduce((a, c) => a * c, 1);
  console.log("Example diff per element: ", diff_reduce);
  console.assert(diff_reduce < 1e-6, "Output is not close enough to target output");
  return model;
}
function load(input) {
  if (typeof input === "string") {
    return fetch(input).then(function(response) {
      return response.arrayBuffer();
    }).then(load_from_array_buffer);
  } else if (input instanceof ArrayBuffer) {
    return load_from_array_buffer(input);
  } else {
    console.error("Input is not a string or ArrayBuffer");
    return null;
  }
}
export {
  load
};
/*! Bundled license information:

jsfive/dist/esm/index.mjs:
  (*! Bundled license information:
  
  pako/dist/pako.esm.mjs:
    (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)
  *)

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/
