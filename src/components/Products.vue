<script>
import '@bhplugin/vue3-datatable/dist/style.css'
import { SlickList, SlickItem, DragHandle } from 'vue-slicksort';
import TabsNav from './TabsNav.vue'
export default {
    components: {
        TabsNav,
        SlickList,
        SlickItem,
        DragHandle
    },
    data() {
        return {
            isOpen: false,
            products: [],
            names: [],
            product_names: [],
            cost: 0,
            amount: 0,
            price: 0,
            weight: 0,
            startX: 0,
            startWidth: 0,
            tableWidth: 1092,
            headerGrid: '50px repeat(6, auto)',
            bodyGrid: 'repeat(5, auto)',
            cols: {
                'name': { title: 'Наименование еденицы', show: true, width: 'auto' },
                'cost': { title: 'Цена', show: true, width: '14%' },
                'amount': { title: 'Кол-во', show: true, width: '14%' },
                'product_name': { title: 'Название товара', show: true, width: '14%' },
                'company': { title: 'Компания', show: false, width: '14%' },
                'price': { title: 'Итого', show: true, width: '11%' },
                'weight': { title: 'Вес', type: 'number', show: false, width: '11%' },
                'isActive': { title: 'Активен', type: 'bool', show: false, width: '11%' },
            }
        }
    },
    methods: {
        getPrice(product) {
            return parseFloat(product.cost) * parseFloat(product.amount);
        },
        getTotalValue(val) {
            console.log(this.products)
            return this.products.reduce((a, b) => a + parseFloat(b[val]), 0)
        },
        setTotal() {
            this.cost = this.getTotalValue("cost")
            this.amount = this.getTotalValue("amount")
            // this.price = this.getTotalValue("price")
            this.weight = this.getTotalValue("weight")
        },
        resizeHandler(event) {
            console.log(event)
            event.preventDefault();
            this.startX = event.pageX;
            this.startWidth = parseInt(getComputedStyle(event.target.parentNode).width);
            document.addEventListener('mousemove', this.resizeColumn);
            document.addEventListener('mouseup', this.stopResize);
        },
        resizeColumn(event) {
            const width = this.startWidth + event.pageX - this.startX;
            const index = event.target.dataIndex;
            console.log(event.target)
            console.log(this.$refs.table.querySelectorAll(`.body-cell[data-index=${index}]`))
            this.$refs.table.querySelectorAll(`.body-cell[data-index=${index}]`).forEach(function (cell) {
                cell.style.width = `${width}px`;
            });
        },
        stopResize() {
            document.removeEventListener('mousemove', this.resizeColumn);
        },
        setGrid() {
            this.tableWidth = this.$refs.table.getBoundingClientRect().width / 100
            const shownColsArray = (obj) => Object.entries(obj).filter((el) => el[1].show);


            const filtered = shownColsArray(this.cols); 
            const grid = filtered.map((el) => /%/.test(el[1].width) ? `${this.tableWidth * parseInt(el[1].width.replace(/%/, ''))}px` : el[1].width).join(' ')
            this.headerGrid = `50px 9% ${grid}`
            console.log(this.headerGrid);
            this.bodyGrid = grid
        }
    },

    mounted() {
        this.products = Array.apply(null, Array(12)).map(function (_, index) {
            return {
                "id": index,
                "name": "Мраморный щебень фр. 2-5 мм, 25кг",
                "cost": "1231",
                "amount": "12",
                "product_name": "Мраморный щебень",
                "weight": 25
            }
        });
        this.names = Array(12).fill("Мраморный щебень фр. 2-5 мм, 25кг")
        this.product_names = Array(12).fill("Мраморный щебень")
        this.setGrid()
        this.setTotal()
    }
}
</script>

<template>
    <TabsNav />
    <div class="filter-wrapper">
        <div class="filter-select" @click="isOpen = !isOpen">
            <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Combined Shape</title>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Логистика-Copy-37" transform="translate(-1673.000000, -231.000000)" fill="#A6B7D4"
                        fill-rule="nonzero">
                        <g id="Group-Copy" transform="translate(254.000000, 222.000000)">
                            <path
                                d="M1427.27083,9 C1427.68511,9 1428.02084,9.33572998 1428.02084,9.75001121 L1428.02084,10.7021181 C1428.555,10.841881 1429.05942,11.0518244 1429.52452,11.32425 L1430.19725,10.6515195 C1430.49023,10.3585405 1430.96505,10.3585405 1431.25796,10.6514447 L1432.34841,11.7418945 C1432.64131,12.0348735 1432.64131,12.5096937 1432.34841,12.8025979 L1431.67568,13.4753285 C1431.94818,13.9404326 1432.15804,14.4448497 1432.29788,14.9790131 L1433.24991,14.9789384 C1433.66412,14.9789384 1434,15.3147431 1434,15.7289496 L1434,17.2710504 C1434,17.6852569 1433.6642,18.0210616 1433.24999,18.0210616 L1432.29781,18.0211363 C1432.15797,18.5552998 1431.94803,19.0596421 1431.6756,19.5247463 L1432.34841,20.1975515 C1432.64131,20.4904558 1432.64131,20.965276 1432.34841,21.2581802 L1431.25803,22.34863 C1430.96513,22.6415343 1430.49031,22.6415343 1430.1974,22.34863 L1429.52452,21.6758248 C1429.05949,21.9482503 1428.55508,22.158119 1428.02099,22.2979566 L1428.02099,23.2499888 C1428.02099,23.6641953 1427.68526,24 1427.27098,24 L1425.72895,24 C1425.31474,24 1424.97894,23.6641953 1424.97894,23.2499888 L1424.97894,22.2978819 C1424.44485,22.1580442 1423.94051,21.9482503 1423.47548,21.6758248 L1422.80267,22.34863 C1422.50977,22.6415343 1422.03495,22.6415343 1421.74204,22.34863 L1420.65159,21.258255 C1420.35869,20.9653508 1420.35869,20.4904558 1420.65159,20.1975515 L1421.3244,19.524821 C1421.0519,19.0597169 1420.84203,18.5553745 1420.70219,18.0213606 L1419.75001,18.0213606 C1419.3358,18.0213606 1419,17.6856306 1419,17.2713493 L1419,15.7292486 C1419,15.3150421 1419.3358,14.9792374 1419.75001,14.9792374 L1420.70189,14.9792374 C1420.84173,14.4451487 1421.05153,13.9407316 1421.32395,13.4756274 L1420.65115,12.8029716 C1420.35824,12.5100674 1420.35824,12.0351724 1420.65115,11.7422682 L1421.74152,10.6518184 C1422.03443,10.3588394 1422.50932,10.3588394 1422.80222,10.6517437 L1423.47488,11.3243995 C1423.94006,11.0518991 1424.44455,10.841881 1424.97879,10.7020434 L1424.97879,9.75001121 C1424.97879,9.33572998 1425.31459,9 1425.7288,9 Z M1426.50138,13.7478139 C1424.9815,13.7478139 1423.74938,14.979926 1423.74938,16.4998134 C1423.74938,18.0197007 1424.9815,19.2518129 1426.50138,19.2518129 C1428.02127,19.2518129 1429.25338,18.0197007 1429.25338,16.4998134 C1429.25338,14.979926 1428.02127,13.7478139 1426.50138,13.7478139 Z"
                                id="Combined-Shape"></path>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        <ul v-if="isOpen" class="filter-list">
            <li v-for="col in cols" :key="col.field">
                <v-checkbox :label="col.title" :checked="!col.hide" @change="col.hide = !$event.target.checked"
                    :color="'#000'" v-model="col.show"></v-checkbox>
            </li>
        </ul>
    </div>
    <div class="block-wrapper with-padding">
        <button class="button btn-add btn-primary" type="button">
            <svg width="11px" height="11px" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>Combined Shape</title>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Логистика-Copy-39" transform="translate(-289.000000, -154.000000)" fill="#1253A2">
                        <g id="Group-10" transform="translate(254.000000, 122.000000)">
                            <g id="Кнопка-в-корзину" transform="translate(25.000000, 20.000000)">
                                <path
                                    d="M15.5,12 C15.7761424,12 16,12.2238576 16,12.5 L16,17 L20.5,17 C20.7761424,17 21,17.2238576 21,17.5 C21,17.7761424 20.7761424,18 20.5,18 L16,18 L16,22.5 C16,22.7761424 15.7761424,23 15.5,23 C15.2238576,23 15,22.7761424 15,22.5 L15,17.999 L10.5,18 C10.2238576,18 10,17.7761424 10,17.5 C10,17.2238576 10.2238576,17 10.5,17 L15,16.999 L15,12.5 C15,12.2238576 15.2238576,12 15.5,12 Z"
                                    id="Combined-Shape"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
            Добавить строку</button>
    </div>
    <div class="block-wrapper">
        <div class="product-table__wrapper">
            <div class="product-table resizable-table" ref="table">
                <div class="product-table__header">
                    <div class="cell header-title fr-column"></div>
                    <div class="cell header-title" data-index="0">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Действие
                    </div>
                    <div class="cell header-title" data-index="1" v-if="cols.name.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Наименование еденицы
                    </div>
                    <div class="cell header-title" data-index="2" v-if="cols.cost.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Цена
                    </div>
                    <div class="cell header-title" data-index="3" v-if="cols.amount.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Кол-во
                    </div>
                    <div class="cell header-title" data-index="4" v-if="cols.product_name.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Название товара
                    </div>
                    <div class="cell header-title ls-column" data-index="5" v-if="cols.price.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Итого
                    </div>
                </div>
                <div class="product-table__body">
                    <SlickList axis="y" v-model:list="products" useDragHandle>
                        <SlickItem v-for="(product, index) in products" :key="products.id" :index="index">
                            <div class="product-table__row">
                                <DragHandle>
                                    <div class="product-table__handle">
                                        <div class="cell body-cell fr-column" data-index="0">
                                            <svg width="11px" height="12px" viewBox="0 0 11 12" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink">
                                                <title>Combined Shape</title>
                                                <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                    fill-rule="evenodd">
                                                    <g id="Логистика-Copy-37"
                                                        transform="translate(-270.000000, -316.000000)" fill="#A6B7D4">
                                                        <g id="Group-2-Copy-7"
                                                            transform="translate(254.000000, 222.000000)">
                                                            <g id="Group-Copy-3"
                                                                transform="translate(1.000000, 78.000000)">
                                                                <g id="Group-11"
                                                                    transform="translate(15.000000, 15.000000)">
                                                                    <path
                                                                        d="M1,1 L10,1 C10.5522847,1 11,1.44771525 11,2 C11,2.55228475 10.5522847,3 10,3 L1,3 C0.44771525,3 5.11724585e-16,2.55228475 0,2 C-6.76353751e-17,1.44771525 0.44771525,1 1,1 Z M1,6 L10,6 C10.5522847,6 11,6.44771525 11,7 C11,7.55228475 10.5522847,8 10,8 L1,8 C0.44771525,8 5.11724585e-16,7.55228475 0,7 C-6.76353751e-17,6.44771525 0.44771525,6 1,6 Z M1,11 L10,11 C10.5522847,11 11,11.4477153 11,12 C11,12.5522848 10.5522847,13 10,13 L1,13 C0.44771525,13 5.11724585e-16,12.5522848 0,12 C-6.76353751e-17,11.4477153 0.44771525,11 1,11 Z"
                                                                        id="Combined-Shape"></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            {{ index + 1 }}
                                        </div>
                                        <div class="cell body-cell" data-index="1">
                                            <svg width="3px" height="13px" viewBox="0 0 3 13" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink">
                                                <title>Combined Shape</title>
                                                <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                    fill-rule="evenodd">
                                                    <g id="Логистика-Copy-37"
                                                        transform="translate(-314.000000, -361.000000)" fill="#A6B7D4">
                                                        <g id="Group-2-Copy-7"
                                                            transform="translate(254.000000, 222.000000)">
                                                            <g id="Group-Copy-5"
                                                                transform="translate(1.000000, 123.000000)">
                                                                <g id="Group-12-Copy"
                                                                    transform="translate(59.000000, 16.000000)">
                                                                    <path
                                                                        d="M1.5,0 C2.32842712,-1.52179594e-16 3,0.671572875 3,1.5 C3,2.32842712 2.32842712,3 1.5,3 C0.671572875,3 1.01453063e-16,2.32842712 0,1.5 C-1.01453063e-16,0.671572875 0.671572875,1.52179594e-16 1.5,0 Z M1.5,5 C2.32842712,5 3,5.67157288 3,6.5 C3,7.32842712 2.32842712,8 1.5,8 C0.671572875,8 1.01453063e-16,7.32842712 0,6.5 C-1.01453063e-16,5.67157288 0.671572875,5 1.5,5 Z M1.5,10 C2.32842712,10 3,10.6715729 3,11.5 C3,12.3284271 2.32842712,13 1.5,13 C0.671572875,13 1.01453063e-16,12.3284271 0,11.5 C-1.01453063e-16,10.6715729 0.671572875,10 1.5,10 Z"
                                                                        id="Combined-Shape"></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </DragHandle>
                                <div class="product-table__row-body">
                                    <div class="cell body-cell" data-index="2" v-if="cols.name.show">
                                        <v-select :value="product.name" :items="names" variant="outlined"></v-select>
                                    </div>
                                    <div class="cell body-cell" data-index="3" v-if="cols.cost.show">
                                        <v-text-field :value="product.cost" variant="outlined"></v-text-field>
                                    </div>
                                    <div class="cell body-cell" data-index="4" v-if="cols.amount.show">
                                        <v-text-field :value="product.amount" variant="outlined"></v-text-field>
                                    </div>
                                    <div class="cell body-cell" data-index="5" v-if="cols.product_name.show">
                                        <v-select :value="product.product_name" :items="product_names"
                                            variant="outlined"></v-select>
                                    </div>
                                    <div class="cell body-cell ls-column" data-index="6" v-if="cols.price.show">
                                        <v-text-field :value="getPrice(product)" disabled
                                            variant="outlined"></v-text-field>
                                    </div>
                                </div>
                            </div>

                        </SlickItem>
                    </SlickList>
                </div>
            </div>
            <div class="total-wrapper">
                <div class="total-summ__full">
                    <div class="total-sum__full-item">
                        <div class="total-summ__title">Сумма:</div>
                        <div class="total-summ__value">{{ cost }} руб</div>
                    </div>
                    <div class="total-sum__full-item">
                        <div class="total-summ__title">Кол-во:</div>
                        <div class="total-summ__value">{{ amount }} шт</div>
                    </div>
                    <div class="total-sum__full-item">
                        <div class="total-summ__title">Общий вес:</div>
                        <div class="total-summ__value">{{ weight }} кг</div>
                    </div>
                </div>
                <div class="total-summ">
                    <div class="total-sum__full-item">
                        <div class="total-summ__title">Общая сумма:</div>
                        <div class="total-summ__value">{{ price }} руб</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.filter-wrapper {
    position: relative;
    display: flex;
    justify-content: flex-end;
}

.filter-list {
    position: absolute;
    z-index: 5;
    top: 25px;
    border-radius: 5px;
    box-shadow: 0 5px 20px 0 var(--black-7);
    border: solid 1px var(--pale-grey);
    background-color: #fff;
}

.filter-list li {
    list-style: none;
}

.product-table {
    padding-top: 32px;
}

.product-table__body {
    margin-top: 5px;
}

.product-table__handle {
    display: grid;
    grid-template-columns: 50px auto;
    cursor: move;
}

.product-table__row {
    display: grid;
    grid-template-columns: 83px auto;
    padding-bottom: 10px;
}

.product-table__row>span {
    display: flex;
    align-items: center;
}

.product-table__header,
.product-table__row-body {
    display: grid;
}

.product-table__header {
    grid-template-columns: v-bind(headerGrid);
}

.product-table__row-body {
    grid-template-columns: v-bind(bodyGrid);
}

/* .cell {
    padding-left: 7.5px;
} */

.header-title {
    padding: 14px 0 14px 7.5px;
    font-family: MyriadPro;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000;
    position: relative;
    border: 1px solid var(--pale-grey);
    border-right: none;
    border-left: none;
    user-select: none;
}

.fr-column {
    padding-left: 15px;
}

.ls-column {
    padding-right: 15px;
}

.body-cell {
    padding-left: 11px;
    padding-right: 11px;
}

.resizer {
    display: inline-block;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: col-resize;
    z-index: 4;
    background-color: var(--pale-grey);
}

.total-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.total-summ__full,
.total-summ {
    width: 304px;
    margin: 15px 14px;
    padding: 15px;
    border-radius: 5px;
    border: solid 1px var(--pale-grey);
    background-color: var(--pale-grey-two);
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.total-summ__full .total-summ__title {
    font-family: MyriadPro;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #8f8f8f;
}

.total-summ__full .total-summ__value {
    font-family: MyriadPro;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #000;
}

.total-summ .total-summ__title {
    font-family: MyriadPro;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000;
}

.total-sum__full-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-summ .total-summ__value {
    font-family: MyriadPro;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #000;
}

.v-input__details {
    padding-inline: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
}

.v-messages {
    min-height: 0 !important;
}

.v-field__input,
.v-checkbox .v-selection-control {
    min-height: 35px !important;
    height: 35px !important;
    padding-top: 5px !important;
}
</style>