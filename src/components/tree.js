class TreeStore {
    constructor(items) {
        this.items = items;
    }

    getAll() {
        return this.items;
    }

    getItem(id) {
        return this.items.find((el) => parseInt(el.id) === parseInt(id))
    }

    getChildren(id) {
        return this.items.filter((el) => parseInt(el.parent) === parseInt(id))
    }

    getAllChildren(id) {
        const chidlren = [];

        const getDescendants = (ids) => {
            const descendants = this.items.filter((el) => ids.find((f) => f.id === el.parent))

            if (descendants.length) {
                chidlren.push(...descendants)
                return getDescendants(descendants)
            }
        }

        getDescendants([{ id: id }]);
        return chidlren;
    }

    getAllParents(id) {
        const item = this.getItem(id);
        const ancestors = [];

        const getAncestors = (id) => {
            const ancestor = this.getItem(id)
            if (ancestor) {
                ancestors.push(ancestor)
                
                if (ancestor.parent) {
                    return getAncestors(ancestor.parent)
                }
            }
        }

        getAncestors(item.parent);
        return ancestors;
    }
}

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];
const ts = new TreeStore(items);
console.log(ts)

console.log(ts.getAll())

console.log(ts.getItem(7))

console.log(ts.getChildren(4))
console.log(ts.getChildren(5))
console.log(ts.getChildren(2))
console.log(ts.getAllChildren(2))

console.log(ts.getAllParents(7))

export default ts