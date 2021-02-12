import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { JsonAstNode, JsonParseMode, parseJsonAst } from "@angular-devkit/core";

/**
 * Reads the content of the JSON file at the provided path from the tree and parses its content into an
 * abstract syntax tree (AST) representation of the file. If the path is not available in the tree or the
 * JSON cannot be parsed a SchematicsException is thrown.
 *
 * @param jsonFilePath the relative path in the tree to the JSON file.
 * @param tree the project tree containing the JSON file.
 *
 * @returns the Abstract Syntax Tree (AST) representation of the JSON file's content.
 *
 * @throws SchematicsException if the JSON file does not exist or cannot be parsed.
 */
export function parseJsonFile(jsonFilePath: string, tree: Tree): JsonAstNode {
  const jsonBuffer = tree.read(jsonFilePath);

  if (jsonBuffer === null) {
    throw new SchematicsException(`Could not parse JSON file ${jsonFilePath}.`);
  }

  const jsonContent = jsonBuffer.toString();

  return parseJsonAst(jsonContent, JsonParseMode.Strict);
}
