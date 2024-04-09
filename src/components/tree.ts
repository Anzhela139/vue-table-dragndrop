interface TreeStore {
    id: number | string;
    parent: number;
    type?: string;
}

const getTypedValue = (value: number | string): number => {
    return (typeof value === 'number' ? value : parseInt(value));
}

class TreeStore {
    items: { id: number | string, parent: number | string, type?: string }[] 
    constructor(items: { id: number | string, parent: number | string, type?: string }[]) {
        this.items = items;
    }

    getAll(): { id: number | string, parent: number | string, type?: string }[] {
        return this.items;
    }

    getItem(id: (string | number)) {
        return this.items.find((el) => getTypedValue(el.id) === getTypedValue(id))
    }

    getChildren(id: string | number) {
        return this.items.filter((el) => getTypedValue(el.parent) === getTypedValue(id))
    }

    getAllChildren(id: string | number) {
        const chidlren = [];
        const item = this.getItem(id);

        const getDescendants = (ids: { id: number | string, parent: number | string, type?: string }[]) => {
            const descendants = this.items.filter((el) => ids.find((f) => f.id === el.parent))

            if (descendants.length) {
                chidlren.push(...descendants)
                return getDescendants(descendants)
            }
        }

        getDescendants([item]);
        return chidlren;
    }

    getAllParents(id: string | number) {
        const item = this.getItem(id);
        const ancestors = [];

        const getAncestors = (id: string | number) => {
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

const items: { id: number | string, parent: number | string, type?: string }[] = [
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