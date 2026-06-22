const compareList = (b, a) => {
  if (!b.length) return false
  if (b.length < a.length) {
    a = a.slice(0, b.length)
  }
  const strA = a.map(item => [item.time, item.name, item.item_type, item.rank_type].join('-')).join(',')
  const strB = b.map(item => [item.time, item.name, item.item_type, item.rank_type].join('-')).join(',')
  return strA === strB
}

const mergeList = (a, b) => {
  if (!a || !a.length) return b || []
  if (!b || !b.length) return a
  const minA = new Date(a[0].time).getTime()
  const idA = a[0].id
  let pos = b.length
  let idFounded = false
  for (let i = b.length - 1; i >= 0; i--) {
    let idB = b[i].id
    if (idB && idB === idA) {
      pos = i
      idFounded = true
      break
    }
  }
  if (!idFounded) {
    let width = Math.min(11, a.length, b.length)
    for (let i = 0; i < b.length; i++) {
      const time = new Date(b[i].time).getTime()
      if (time >= minA) {
        if (compareList(b.slice(i, width + i), a.slice(0, width))) {
          pos = i
          break
        }
      }
    }
  }
  return b.slice(0, pos).concat(a)
}

const mergeData = (local, origin) => {
  if (local && local.result) {
    const localResult = local.result
    const localUid = local.uid
    const originUid = origin.uid
    if (localUid !== originUid) return origin.result
    const originResult = new Map()
    for (let [key, value] of origin.result) {
      const newVal = mergeList(value, localResult.get(key))
      originResult.set(key, newVal)
    }
    return originResult
  }
  return origin.result
}

module.exports = { mergeData, mergeList, compareList }
