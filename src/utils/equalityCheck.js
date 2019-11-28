/**
 * Check if two array have the same elements, as determined by `===` strict comparison,
 * in the same order.
 */
function scalarArrayEq (arrayA, arrayB) {
  return (arrayA && arrayB) &&
    (Array.isArray(arrayA) && Array.isArray(arrayB)) &&
    (arrayA.length === arrayB.length) &&
    arrayA.every((value, index) => value === arrayB[index])
}

export { scalarArrayEq }
