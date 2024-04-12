const fetchDataMixin = {
    methods: {
        /*
            При запуске прооекта с локалки, fetch отрабатывает как нужно благодаря msw,
            на netlify такой 
        */ 
        async fetchProducts() {
            return fetch('api/products')
                .then(async (res) => {
                    const data = await res.json()
                    this.products = data
                    this.products.forEach((el) => {
                        el.price = el.cost * el.amount
                    })
                    console.log(this.products[0].price)
                    return Promise.resolve(this.products)
                })
                .catch((err) => {
                    console.log(err)
                    const products = Array.apply(null, Array(12)).map(function (_, index) {
                        return {
                            "id": index,
                            "name": "Мраморный щебень фр. 2-5 мм, 25кг",
                            "cost": "1231",
                            "amount": "12",
                            "product_name": "Мраморный щебень",
                            "weight": 25
                        }
                    });
                    this.products = products
                    this.products.forEach((el) => {
                        el.price = el.cost * el.amount
                    })
                })
        },
        async fetchNames() {
            return fetch('api/names')
                .then(async (res) => {
                    const data = await res.json()
                    this.names = data
                    return Promise.resolve(data)
                })
                .catch((err) => {
                    console.log(err)
                    const names = Array(12).fill("Мраморный щебень фр. 2-5 мм, 25кг")
                    this.names = names
                })
        },
        async fetchProductsNames() {
            return fetch('api/product_names')
                .then(async (res) => {
                    const data = await res.json()
                    this.product_names = data
                    return Promise.resolve(data)
                })
                .catch((err) => console.log(err))
        }
    }
}

export default fetchDataMixin