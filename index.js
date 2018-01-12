function proxy (target) {
  return new Proxy(target || {}, {
    get (prox, k) {
      return prox[k] || proxy({ items: [] })
    }
  })
}

function init (facets, items, keypath) {
  let o = {}

  for (let facet in facets) {
    o[facet] = {
      get () {
        keypath += facet + '='
        let i = {}
        for (let val of facets[facet]) {
          i[val] = {
            get () {
              keypath += val + ','
              let o = {}
              for (let k in facets) {
                if (facet !== k) o[k] = facets[k]
              }
              return init(o, items, keypath)
            }
          }
        }

        return proxy(Object.create({}, i))
      }
    }
  }

  return proxy(Object.create({
    get items () {
      let len = 0
      let facets = {}
      for (let f of keypath.split(',')) {
        if (!f) continue
        let facet = f.split('=')
        facets[facet[0]] = facet[1]
        len++
      }
      let _items = []
      for (let i of items) {
        let matches = 0
        for (let f in i.facets) {
          if (!facets[f]) continue
          if (i.facets[f].indexOf(facets[f]) > -1) matches++
          if (matches === len) _items.push(i)
        }
      }
      return _items
    }
  }, o))
}

export default function db (entries) {
  const facets = {}
  const items = []

  while (entries.length) {
    const i = entries.pop()
    for (let f in i.facets) {
      facets[f] = facets[f] || []
      for (let v of i.facets[f]) {
        facets[f].indexOf(v) < 0 && facets[f].push(v)
      }
    }
    items.push(i)
  }

  return proxy(init(facets, items, ''))
}
