export function uniqueBy (arr, ...keyProps) {
  const kvArray = arr.map(entry => {
    const key = keyProps.map(k => entry[k]).join('|')
    return [key, entry]
  })
  const map = new Map(kvArray)
  return Array.from(map.values())
}
