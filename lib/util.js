export function uniqueBy (arr, ...keyProps) {
  const kvArray = arr.map(entry => {
    const key = keyProps.map(k => entry[k]).join('|')
    return [key, entry]
  })
  const map = new Map(kvArray)
  return Array.from(map.values())
}

export function pick (obj, ...keys) {
  Object.assign({}, ...keys.map(key => ({ [key]: obj[key] })))
}

export function chunks (array, size) {
  const chunked = []
  let index = 0
  while (index < array.length) {
    chunked.push(array.slice(index, size + index))
    index += size
  }
  return chunked
}
