import { http, HttpResponse } from 'msw';

const handlers = [
    http.get('api/products', () => {
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
        return HttpResponse.json(products);
    }),
    http.get('api/names', () => {
        const names = Array(12).fill("Мраморный щебень фр. 2-5 мм, 25кг")
        return HttpResponse.json(names);
    }),
    http.get('api/product_names', () => {
        const productNames = Array(12).fill("Мраморный щебень")
        return HttpResponse.json(productNames);
    })
]
export default handlers