import { http, HttpResponse } from 'msw';

const handlers = [
    http.get('api/products', () => {
        const products = Array.apply(null, Array(12)).map(function (_, index) {
            return {
                "id": index,
                "name": `Name option №${index + 1} 25kg`,
                "cost": "1231",
                "amount": "12",
                "product_name": `Name option №${index + 1}`,
                "weight": 25
            }
        });
        return HttpResponse.json(products);
    }),
    http.get('api/names', () => {
        const names = Array(12).fill("Name option №0 фр. 2-5 мм, 25кг")
        return HttpResponse.json(names);
    }),
    http.get('api/product_names', () => {
        const productNames = Array(12).fill("Name option")
        return HttpResponse.json(productNames);
    })
]
export default handlers