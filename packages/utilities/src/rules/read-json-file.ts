import { SchematicsException, Tree } from "@angular-devkit/schematics";

/**
 * Reads the content of the JSON file at the provided path from the tree and returns its content.
 * If the path is not available in the tree and an optional default value is provided, the default
 * value will be returned. If the path is not available and the JSON cannot be read, a
 * SchematicsException is thrown.
 *
 * @param jsonFilePath the relative path in the tree to the JSON file.
 * @param tree the project tree containing the JSON file.
 * @param defaultValue an optional default value if the JSON file doesn't exist or
 *        cannot be read.
 *
 * @returns the JSON content read from the file.
 *
 * @throws SchematicsException if the JSON file does not exist and no default value is provided.
 */
export function readJsonFile(jsonFilePath: string, tree: Tree, defaultValue?: any): any {
  const jsonBuffer = tree.read(jsonFilePath);

  if (jsonBuffer) {
    return JSON.parse(jsonBuffer.toString());
  } else if (defaultValue !== undefined) {
    return defaultValue;
  } else {
    throw new SchematicsException(`Unable to read JSON file at path ${jsonFilePath} and no default value provided.`);
  }
}
