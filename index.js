export default function db (entries) {
  const facets = {}
  const items = []

  while (entries.length) {
    const i = entries.pop()

    items.push(i)

    for (let f in i.facets) {
      facets[f] = facets[f] || []
      for (let v of i.facets[f]) {
        facets[f].indexOf(v) < 0 && facets[f].push(v)
      }
    }
  }

  const proto = {
    deviation: 0,
    filters: {},
    filtersLen: 0,
    get items () {
      let _items = []
      for (let i of items) {
        let _matches = 0
        for (let k in this.filters) {
          for (let f of this.filters[k]) {
            if (i.facets[k].indexOf(f) > -1) _matches++
            if (
              _matches === (this.filtersLen - (this.deviation !== undefined ? this.deviation : 0))
              && _items.indexOf(i) < 0
            ) _items.push(i)
          }
        }
      }
      return _items
    }
  }

  let methods = {}

  for (let facet in facets) {
    methods[facet] = {
      value: function applyFacet(vals) {
        vals = vals.pop ? vals : [vals]
        this.filters[facet] = this.filters[facet] || []
        for (let val of vals) {
          this.filters[facet].push(val)
          this.filtersLen++
        }
        return Object.create(this)
      }
    }
  }

  return Object.create(proto, methods)
}
