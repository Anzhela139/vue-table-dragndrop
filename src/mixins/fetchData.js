const fetchDataMixin = {
    methods: {
        /*
            При запуске прооекта с локалки, fetch отрабатывает как нужно благодаря msw,
            на netlify такой 
        */ 
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
        fetchNames() {
            fetch('api/names')
                .then(async (res) => {
                    const data = await res.json()
                    this.names = data
                })
                .catch((err) => {
                    console.log(err)
                    const names = Array(12).fill("Мраморный щебень фр. 2-5 мм, 25кг")
                    this.names = names
                })
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