# tril
An experimental bare-bones decision tree-like in-memory database. I think that's enough hyphens. **528 bytes gzipped.**

## Usage
An item in the database can have any properties at all, as long as there is a `facets` property defined and it's an object.

Each *facet* on the `facets` object should be an array of values, which can be anything that can be strictly compared e.g. `a === b` or `{} === {}`, etc. They could be values that point to entirely separate data structures 🤔
```javascript
import tril from 'tril'

const db = tril([
  {
    name: 'Item One',
    facets: {
      foo: [
        'one',
        'two'
      ],
      bar: [
        'one',
        'two'
      ],
      baz: [
        'one',
        'two'
      ]
    }
  },
  {
    name: 'Item Two',
    facets: {
      foo: [
        'two',
        'three'
      ],
      bar: [
        'two',
        'three'
      ],
      baz: [
        'two',
        'three'
      ]
    }
  },
  {
    name: 'Item Three',
    facets: {
      foo: [
        'three',
        'four'
      ],
      bar: [
        'three',
        'four'
      ],
      baz: [
        'three',
        'four'
      ]
    }
  }
])
```
To filter values, access properties in a repeating `<facet>.<value>` fashion. A all objects return an `items` value that resolves to only those entries that match the preceding keypath.
```javascript
db.foo.two.items // [{ name: 'Item One' }, { name: 'Item Two' }]
db.foo.three.baz.four.items // [{ name: 'Item Three' }]
```

## Adjusting Deviation
By default, all declared facets must match the returned items. Optionally, you can adjust this by setting the `devation` property to a positive integer corresponding to the number of misses allowed by the search operation.
```javascript
db.deviation = 0
db.foo.two.foo.three.items // [{ name: 'Item Two' }]
db.deviation = 1
db.foo.two.foo.three.items // [{ name: 'Item Item' }, { name: 'Item Two' }, { name: 'Item Three' }]
```
## Undefined Values
The database is protected against bad requests using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Any values that are `undefined` will return an empty array `[]` instead of throwing an error.
```javascript
db.foo.two.undefinedFacet.items // []
```

## Environment
Should be fine in node, but in browsers it's *no IE* and *Safari > 10*.

## Benchmarks
Would loooove some help here.

MIT
