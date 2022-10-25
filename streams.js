// type Memo<T> = { get: () => T }
// memo0<T>(f: () => T): Memo<T>
export function memo0(f) {
    let r = { evaluated: false };
    return {
        get: function() {
            if (! r.evaluated) {
              r = { evaluated: true, v: f() }
            }
            return r.v;
        },
        toString: function() {
            if (r.evaluated) {
              return r.v.toString();
            } else {   
              return '<unevaluated>';
            }
          }
    };
}

// sempty: Stream<T>
let sempty = {
    isEmpty: () => true,
    map: (f) => sempty,
    filter: (pred) => sempty,
    toString: () => 'sempty'
};
// snode<T>(head: T, tail: Stream<T>): Stream<T>
export function snode(head, tail) {
    return {
        isEmpty: () => false,
        head: () => head,
        tail: tail.get,
        map: f => snode(f(head), memo0(() => tail.get().map(f))),
        filter: pred => pred(head) ?
                        snode(head, memo0(() => tail.get().filter(pred)))
                        : tail.get().filter(pred),
        toString: () => "snode(" + head.toString() + ", " + tail.toString() + ")"
    }
}
