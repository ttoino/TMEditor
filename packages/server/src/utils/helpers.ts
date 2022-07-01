/**
 * Checks if the elements of a array @x are only strings.
 *
 * @param x     The array.
 * @returns     True if array only contains strings, false otherwise
 */
export const checkIfStringsArray = (x: any[]) => {
  return x.every(i => (typeof i === "string"));
}

/**
 * Checks if the @property is present on every element of array @x .
 *
 * @param x         The array.
 * @param property  The array.
 * @returns     True if array contains property in every element, false otherwise
 */
export const checkPropertyInEveryObjectsArray = (x: any[], property: string) => {
  return x.every(i => i.hasOwnProperty(property))
}