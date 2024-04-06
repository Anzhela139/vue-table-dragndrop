<script>
import '@bhplugin/vue3-datatable/dist/style.css'
import { SlickList, SlickItem, DragHandle } from 'vue-slicksort';
import TabsNav from './TabsNav.vue'
import fetchDataMixin from './../mixins/fetchData'
import formatters from './../mixins/formatters'
import Settings from './icons/Settings.vue'
import Plus from './icons/Plus.vue'
import Hamburger from './icons/Hamburger.vue'
import ThreeDots from './icons/ThreeDots.vue'

export default {
    components: {
        TabsNav,
        SlickList,
        SlickItem,
        DragHandle,
        Settings,
        Plus,
        Hamburger,
        ThreeDots
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
            resingColumn: null,
            startWidth: 0,
            tableWidth: 1092,
            headerGrid: '50px repeat(6, auto)',
            bodyGrid: 'repeat(5, auto)',
            cols: {
                'name': { title: 'Наименование еденицы', show: true, defaultProcent: 0, width: 0 },
                'cost': { title: 'Цена', show: true, defaultProcent: 14, width: 0 },
                'amount': { title: 'Кол-во', show: true, defaultProcent: 14, width: 0 },
                'product_name': { title: 'Название товара', show: true, defaultProcent: 14, width: 0 },
                'company': { title: 'Компания', show: false, defaultProcent: 14, width: 0 },
                'price': { title: 'Итого', show: true, defaultProcent: 11, width: 0 },
                'weight': { title: 'Вес', type: 'number', show: false, defaultProcent: 11, width: 0 },
                'isActive': { title: 'Активен', type: 'bool', show: false, defaultProcent: 11, width: 0 },
            }
        }
    },
    mixins: [fetchDataMixin, formatters],
    watch: {
        products() {
            this.setGrid()
            this.setTotal()
        }
    },
    methods: {
        getPrice(product) {
            return parseFloat(product.cost) * parseFloat(product.amount);
        },
        getTotalValue(val) {
            return this.products.reduce((a, b) => a + parseFloat(b[val]), 0)
        },
        setTotal() {
            this.cost = this.formatNum(this.getTotalValue("cost"))
            this.amount = this.formatNum(this.getTotalValue("amount"))
            this.price = this.formatNum(this.getTotalValue("price"))
            this.weight = this.formatNum(this.getTotalValue("weight"))
        },
        resizeHandler(event) {
            event.preventDefault();
            this.startX = event.pageX;
            this.resingColumn = event.target.closest('[data-target]')

            this.startWidth = parseInt(this.resingColumn.getBoundingClientRect().width);
            const bindResizeColumn = this.resizeColumn.bind(this)
            document.addEventListener('mousemove', bindResizeColumn, false);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', bindResizeColumn, false);
            }, false);
        },
        resizeColumn(event) {
            const target = this.resingColumn.dataset.target;

            const shownColsArray = Object.entries(this.cols);
            const index = shownColsArray.findIndex((el) => el[0] === target)
            if (index >= 0) {
                const width = this.cols[target].width + event.pageX - this.startX;
                if (width === this.cols[target].width || (event.pageX - this.startX) === 0) return
                const reliableWidth = (val, summWidth) => {
                    return val >= 100 ? ((summWidth - val) <= 100 ? summWidth - 100 : val) : 100
                }

                const summWidth = (this.cols[target].width +  this.cols[shownColsArray[index + 1][0]].width)
                const newNextWidth = summWidth - width
                this.cols[target].width = reliableWidth(width, summWidth)

                this.cols[shownColsArray[index + 1][0]].width = reliableWidth(newNextWidth, summWidth)
                this.setGrid()
            }
        },
        stopResize() {
            document.removeEventListener('mousemove', this.resizeColumn);
        },
        setGrid() {
            this.tableWidth = this.$refs.table.getBoundingClientRect().width
            const tableProcent = this.tableWidth / 100
            const shownColsArray = (obj) => Object.entries(obj).filter((el) => el[1].show);


            const filtered = shownColsArray(this.cols); 
            const grid = filtered.filter((el) => el[1].defaultProcent).map((el) => {
                const column = Math.abs( el[1].width ? el[1].width : tableProcent * el[1].defaultProcent )
                this.cols[el[0]].width = column
                return column
            })

            this.headerGrid = `50px ${tableProcent * 9}px ${Math.abs(this.tableWidth - 50 - tableProcent * 9 - grid.reduce((a, b) => a + b, 0))}px ${grid.join('px ')}px`
            this.bodyGrid = `${Math.abs(this.tableWidth - 83 - grid.reduce((a, b) => a + b, 0))}px ${grid.join('px ')}px`
        },
        toggleColumn(event, col) {
            col.hide = !event.target.checked
            this.setGrid()
        },
        addProduct() {
            this.products.push({
                    "id": this.products.length,
                    "name": "Мраморный щебень фр. 2-5 мм, 25кг",
                    "cost": "1231",
                    "amount": "12",
                    "product_name": "Мраморный щебень",
                    "weight": 25
                });
            this.products[this.products.length - 1].price = this.products[this.products.length - 1].cost * this.products[this.products.length - 1].amount
            this.setTotal()
        },

    },

    mounted() {
        setTimeout(() => {
            this.fetchProducts()
            this.fetchNames()
            this.fetchProductsNames()

            const bindedSetGrid = this.setGrid.bind(this)

            window.addEventListener('resize', () => {
                bindedSetGrid()
            }, true);
        }, 500)
    }
}
</script>

<template>
    <TabsNav />
    <div class="filter-wrapper">
        <div class="filter-select" @click="isOpen = !isOpen">
            <Settings />
        </div>
        <ul v-if="isOpen" class="filter-list">
            <li v-for="col in cols" :key="col.field">
                <v-checkbox :label="col.title" :checked="!col.hide" @change="toggleColumn($event, col)"
                    :color="'#000'" v-model="col.show"></v-checkbox>
            </li>
        </ul>
    </div>
    <div class="block-wrapper with-padding" @click="isOpen = false">
        <button class="button btn-add btn-primary" type="button" @click="addProduct">
            <Plus />
            Добавить строку</button>
    </div>
    <div class="block-wrapper" @click="isOpen = false">
        <div class="product-table__wrapper">
            <div class="product-table resizable-table" ref="table">
                <div class="product-table__header">
                    <div class="cell header-title fr-column"></div>
                    <div class="cell header-title">
                        <div class="resizer"></div>
                        Действие
                    </div>
                    <div class="cell header-title" v-if="cols.name.show">
                        <div class="resizer"></div>
                        Наименование еденицы
                    </div>
                    <div class="cell header-title" data-target="name" v-if="cols.cost.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Цена
                    </div>
                    <div class="cell header-title" data-target="cost" v-if="cols.amount.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Кол-во
                    </div>
                    <div class="cell header-title" data-target="amount" v-if="cols.product_name.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Название товара
                    </div>
                    <div class="cell header-title ls-column" data-target="product_name" v-if="cols.price.show">
                        <div class="resizer" @mousedown="resizeHandler"></div>
                        Итого
                    </div>
                </div>
                <div class="product-table__body">
                    <div class="product-table__border-shadows">
                        <div class="product-table__border-shadow" v-for="(product, index) in products"></div>
                    </div>
                    <SlickList axis="y" v-model:list="products" useDragHandle>
                        <SlickItem v-for="(product, index) in products" :key="products.id" :index="index">
                            <div class="product-table__row">
                                <DragHandle>
                                    <div class="product-table__handle">
                                        <div class="cell body-cell fr-column" data-target="0">
                                            <Hamburger />
                                            {{ index + 1 }}
                                        </div>
                                        <div class="cell body-cell" data-target="1">
                                            <ThreeDots />
                                        </div>
                                    </div>
                                </DragHandle>
                                <div class="product-table__row-body" :style="{ 'grid-template-columns': bodyGrid }">
                                    <div class="cell body-cell" data-target="2" v-if="cols.name.show">
                                        <v-select :value="product.name" :items="names" variant="outlined"></v-select>
                                    </div>
                                    <div class="cell body-cell" data-target="3" v-if="cols.cost.show">
                                        <v-text-field :value="product.cost" variant="outlined"></v-text-field>
                                    </div>
                                    <div class="cell body-cell" data-target="4" v-if="cols.amount.show">
                                        <v-text-field :value="product.amount" variant="outlined"></v-text-field>
                                    </div>
                                    <div class="cell body-cell" data-target="5" v-if="cols.product_name.show">
                                        <v-select :value="product.product_name" :items="product_names"
                                            variant="outlined"></v-select>
                                    </div>
                                    <div class="cell body-cell ls-column" data-target="6" v-if="cols.price.show">
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
    position: relative;
}

.product-table__handle {
    display: grid;
    grid-template-columns: 50px auto;
    cursor: move;
}

.product-table__handle .body-cell {
    display: flex;
    align-items: center; 
    gap: 5px;
}

.product-table__row {
    position: relative;
    display: grid;
    grid-template-columns: 83px auto;
    padding-bottom: 10px;
    user-select: none;
    background-color: #fff;
}

.product-table__border-shadows {
    position: absolute;
    width: 100%;
}

.product-table__border-shadow {
    width: 100%;
    height: 43px;
    z-index: 0;
    visibility: visible;
    opacity: 1;
    border-radius: 5px;
    border: 2px dashed #a6b7d4;
    background-color: transparent;
    margin-bottom: 2px;
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

.header-title {
    padding: 14px 0 14px 11px;
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

.total-summ__full {
    margin-bottom: 0;
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