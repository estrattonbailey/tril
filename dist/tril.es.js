function proxy(target) {
    return new Proxy(target || {}, {
        get: function get(prox, k) {
            return prox[k] || proxy({
                items: []
            });
        }
    });
}

function init(facets, items, keypath) {
    var o = {};
    var loop = function ( facet ) {
        o[facet] = {
            get: function get() {
                keypath += facet + '=';
                var i = {};
                var loop = function () {
                    var val = list[i$1];

                    i[val] = {
                        get: function get() {
                            keypath += val + ',';
                            var o = {};
                            for (var k in facets) {
                                if (facet !== k) 
                                    { o[k] = facets[k]; }
                            }
                            return init(o, items, keypath);
                        }
                    };
                };

                for (var i$1 = 0, list = facets[facet]; i$1 < list.length; i$1 += 1) loop();
                return proxy(Object.create({}, i));
            }
        };
    };

    for (var facet in facets) loop( facet );
    return proxy(Object.create({
        get items() {
            var len = 0;
            var facets = {};
            for (var i$1 = 0, list = keypath.split(','); i$1 < list.length; i$1 += 1) {
                var f = list[i$1];

                if (!f) 
                    { continue; }
                var facet = f.split('=');
                facets[facet[0]] = facet[1];
                len++;
            }
            var _items = [];
            for (var i$2 = 0, list$1 = items; i$2 < list$1.length; i$2 += 1) {
                var i = list$1[i$2];

                var matches = 0;
                for (var f$1 in i.facets) {
                    if (!facets[f$1]) 
                        { continue; }
                    if (i.facets[f$1].indexOf(facets[f$1]) > -1) 
                        { matches++; }
                    if (matches === len) 
                        { _items.push(i); }
                }
            }
            return _items;
        }
    }, o));
}

function db(entries) {
    var facets = {};
    var items = [];
    while (entries.length) {
        var i = entries.pop();
        for (var f in i.facets) {
            facets[f] = facets[f] || [];
            for (var i$1 = 0, list = i.facets[f]; i$1 < list.length; i$1 += 1) {
                var v = list[i$1];

                facets[f].indexOf(v) < 0 && facets[f].push(v);
            }
        }
        items.push(i);
    }
    return proxy(init(facets, items, ''));
}

export default db;
//# sourceMappingURL=tril.es.js.map
