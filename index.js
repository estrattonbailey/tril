function proxy (target) {
  return new Proxy(target || {}, {
    get (prox, k) {
      return prox[k] || proxy({ items: [] })
    }
  })
}

export default function db (entries) {
  let deviation = 0
  let keypath = ''
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

  const proto = {
    get items () {
      let len = 0 - (this.deviation !== undefined ? this.deviation : 0)
      let _facets = {}
      let _items = []
      for (let f of keypath.split(',')) {
        if (!f) continue
        let facet = f.split('=')
        _facets[facet[0]] = _facets[facet[0]] || []
        _facets[facet[0]].push(facet[1])
        len++
      }
      for (let i of items) {
        let matches = 0
        for (let k in _facets) {
          for (let f of _facets[k]) {
            if (i.facets[k].indexOf(f) > -1) matches++
            if (matches === len && _items.indexOf(i) < 0) _items.push(i)
          }
        }
      }
      return _items
    },
    set deviation (int) {
      deviation = int
    },
    get deviation () {
      return deviation
    }
  }

  const db = (function walk (parent) {
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
                return walk(parent)
              }
            }
          }
          return proxy(Object.create(parent, i))
        }
      }
    }
    return proxy(Object.create(parent, o))
  })(Object.create(proto))

  return proxy(db)
}
