# tril
A bare-bones in-memory database. **417 bytes gzipped.**

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

## Querying
The facets defined on database entries are used to create methods of the same name. Then, pass a facet value or array of facet values to each method to filter the database.
```javascript
const query = db.foo('two').bar([ 'two' ])
```
Then, access the filtered entries:
```javascript
query.items // => [{ name: 'Item Two' }]
```
Queries can also be extended:
```javascript
query.baz('three')
```

## Adjusting Deviation
By default, all declared filters must match the facets defined on the returned items. Optionally, you can adjust this by setting the `devation` property to a positive integer corresponding to the number of misses allowed by the search operation.

You can set this value on the database itself:
```javascript
db.deviation = 0
db.foo(['two', 'three']).items // => [{ name: 'Item Two' }]
db.deviation = 1
db.foo(['two', 'three']).items // => [{ name: 'Item Item' }, { name: 'Item Two' }, { name: 'Item Three' }]
```
Or on an intermediary value:
```javascript
const query = db.foo('two')
query.deviation = 1
query.baz('three').items // => [{ name: 'Item Item' }, { name: 'Item Two' }, { name: 'Item Three' }]
```

## Benchmarks
Would loooove some help here.

MIT
