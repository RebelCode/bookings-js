export function makeDeepObjectDifference (transform, isEqual, isObject) {
  return (object, base) => {
    function changes (object, base) {
      return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
        }
      })
    }
    return changes(object, base)
  }
}