const fetchDataMixin = {
    methods: {
        async fetchProducts() {
            fetch('api/products')
                .then(async (res) => {
                    const data = await res.json()
                    this.products = data
                    this.products.forEach((el) => {
                        el.price = el.cost * el.amount
                    })
                    return true
                })
                .catch((err) => console.log(err))
        },
        fetchNames() {
            fetch('api/names')
                .then(async (res) => {
                    const data = await res.json()
                    this.names = data

                })
                .catch((err) => console.log(err))
        },
        fetchProductsNames() {
            fetch('api/product_names')
                .then(async (res) => {
                    const data = await res.json()
                    this.product_names = data
                })
                .catch((err) => console.log(err))
        }
    }
}

export default fetchDataMixin