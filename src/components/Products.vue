<script>
import '@bhplugin/vue3-datatable/dist/style.css'
import { SlickList, SlickItem, DragHandle } from 'vue-slicksort';
import DataTable from 'datatables.net-dt';
import TabsNav from './TabsNav.vue'
import fetchDataMixin from './../mixins/fetchData'
import formatters from './../mixins/formatters'
import Settings from './icons/Settings.vue'
import Plus from './icons/Plus.vue'
import Hamburger from './icons/Hamburger.vue'
import ThreeDots from './icons/ThreeDots.vue'
import ArrowRight from './icons/ArrowRight.vue'
import ts from './tree.js'

const cols = [
    { name: 'name', title: 'Наименование еденицы', id: '0', show: true, defaultProcent: 0, width: 0 },
    { name: 'cost', title: 'Цена', id: '1', show: true, defaultProcent: 14, width: 0 },
    { name: 'amount', title: 'Кол-во', id: '2', show: true, defaultProcent: 14, width: 0 },
    { name: 'product_name', title: 'Название товара', id: '3', show: true, defaultProcent: 14, width: 0 },
    { name: 'company', title: 'Компания', id: '4', show: false, defaultProcent: 14, width: 0 },
    { name: 'price', title: 'Итого', id: '5', show: true, defaultProcent: 11, width: 0 },
    { name: 'weight', title: 'Вес', type: 'number', id: '6', show: false, defaultProcent: 11, width: 0 },
    { name: 'isActive', title: 'Активен', type: 'bool', id: '7', show: false, defaultProcent: 11, width: 0 },
]

export default {
    components: {
        TabsNav,
        SlickList,
        SlickItem,
        DragHandle,
        Settings,
        Plus,
        Hamburger,
        ThreeDots,
        ArrowRight
    },
    data() {
        return {
            isFilterOpen: false,
            isFilterColumnsToggle: false,
            isFilterColumnsOrder: false,
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
            cols: [
                { name: 'name', title: 'Наименование еденицы', id: '0', show: true, defaultProcent: 0, width: 0 },
                { name: 'cost', title: 'Цена', id: '1', show: true, defaultProcent: 14, width: 0 },
                { name: 'amount', title: 'Кол-во', id: '2', show: true, defaultProcent: 14, width: 0 },
                { name: 'product_name', title: 'Название товара', id: '3', show: true, defaultProcent: 14, width: 0 },
                { name: 'company', title: 'Компания', id: '4', show: false, defaultProcent: 14, width: 0 },
                { name: 'price', title: 'Итого', id: '5', show: true, defaultProcent: 11, width: 0 },
                { name: 'weight', title: 'Вес', type: 'number', id: '6', show: false, defaultProcent: 11, width: 0 },
                { name: 'isActive', title: 'Активен', type: 'bool', id: '7', show: false, defaultProcent: 11, width: 0 },
            ]
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

                const summWidth = (this.cols[target].width + this.cols[shownColsArray[index + 1][0]].width)
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

            const filtered = this.cols.filter((el) => el.show);
            const grid = filtered.filter((el) => el.defaultProcent).map((el) => {
                const column = Math.abs(el.width ? el.width : tableProcent * el.defaultProcent)
                this.cols[el].width = column
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
        closeFilters() {
            this.isFilterOpen = false
            this.isFilterColumnsOrder = false
            this.isFilterColumnsToggle = false
        },
        openDefiniteFilter(event) {
            console.log(event.target.classList)
            const isToggle = event.target.classList?.contains('first-choice')
            this.isFilterOpen = false
            this.isFilterColumnsOrder = !isToggle
            this.isFilterColumnsToggle = isToggle
        }

    },

    mounted() {
        setTimeout(() => {
            new DataTable('#example', {
                colReorder: true,
                rowReorder: true
            });
            // $('#example').DataTable( {
            //     colReorder: true
            // } );
        //     this.fetchProducts()
        //     this.fetchNames()
        //     this.fetchProductsNames()

        //     const bindedSetGrid = this.setGrid.bind(this)

        //     window.addEventListener('resize', () => {
        //         bindedSetGrid()
        //     }, true);
        }, 500)
    }
}
</script>

<template>
    <TabsNav />
    <div class="filter-wrapper">
        <div class="filter-select" @click="isFilterOpen = !isFilterOpen">
            <Settings />
        </div>
        <ul v-if="isFilterOpen" class="filter-list">
            <li class="filter-choice first-choice" @click="openDefiniteFilter">Отображение столбцов
                <ArrowRight />
            </li>
            <li class="filter-choice second-choice" @click="openDefiniteFilter">Порядок столбцов
                <ArrowRight />
            </li>
        </ul>
        <ul v-if="isFilterColumnsToggle" class="filter-list">
            <li v-for="col in cols" :key="col.field">
                <v-checkbox :label="col.title" :checked="!col.hide" @change="toggleColumn($event, col)" :color="'#000'"
                    v-model="col.show"></v-checkbox>
            </li>
        </ul>
        <div v-if="isFilterColumnsOrder" class="filter-list">
            <SlickList axis="y" v-model:list="colsArray">
                <SlickItem v-for="(col, index) in colsArray" :key="cols.id" :index="index">
                    {{ col[1].title }}
                </SlickItem>
            </SlickList>
        </div>
    </div>
    <div class="block-wrapper with-padding" @click="closeFilters">
        <button class="button btn-add btn-primary" type="button" @click="addProduct">
            <Plus />
            Добавить строку
        </button>
    </div>
    <div class="block-wrapper" @click="closeFilters">
        <div class="product-table__wrapper">
            <table id="example" class="mdl-data-table" style="width:100%">
        <thead>
            <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Tiger</td>
                <td>Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>320800</td>
            </tr>
            <tr>
                <td>Garrett</td>
                <td>Winters</td>
                <td>Accountant</td>
                <td>Tokyo</td>
                <td>170750</td>
            </tr>
            <tr>
                <td>Ashton</td>
                <td>Cox</td>
                <td>Junior Technical Author</td>
                <td>San Francisco</td>
                <td>86000</td>
            </tr>
            <tr>
                <td>Cedric</td>
                <td>Kelly</td>
                <td>Senior Javascript Developer</td>
                <td>Edinburgh</td>
                <td>433060</td>
            </tr>
            <tr>
                <td>Airi</td>
                <td>Satou</td>
                <td>Accountant</td>
                <td>Tokyo</td>
                <td>162700</td>
            </tr>
            <tr>
                <td>Brielle</td>
                <td>Williamson</td>
                <td>Integration Specialist</td>
                <td>New York</td>
                <td>372000</td>
            </tr>
            <tr>
                <td>Herrod</td>
                <td>Chandler</td>
                <td>Sales Assistant</td>
                <td>San Francisco</td>
                <td>137500</td>
            </tr>
            <tr>
                <td>Rhona</td>
                <td>Davidson</td>
                <td>Integration Specialist</td>
                <td>Tokyo</td>
                <td>327900</td>
            </tr>
            <tr>
                <td>Colleen</td>
                <td>Hurst</td>
                <td>Javascript Developer</td>
                <td>San Francisco</td>
                <td>205500</td>
            </tr>
            <tr>
                <td>Sonya</td>
                <td>Frost</td>
                <td>Software Engineer</td>
                <td>Edinburgh</td>
                <td>103600</td>
            </tr>
            <tr>
                <td>Jena</td>
                <td>Gaines</td>
                <td>Office Manager</td>
                <td>London</td>
                <td>90560</td>
            </tr>
            <tr>
                <td>Quinn</td>
                <td>Flynn</td>
                <td>Support Lead</td>
                <td>Edinburgh</td>
                <td>342000</td>
            </tr>
            <tr>
                <td>Charde</td>
                <td>Marshall</td>
                <td>Regional Director</td>
                <td>San Francisco</td>
                <td>470600</td>
            </tr>
            <tr>
                <td>Haley</td>
                <td>Kennedy</td>
                <td>Senior Marketing Designer</td>
                <td>London</td>
                <td>313500</td>
            </tr>
            <tr>
                <td>Tatyana</td>
                <td>Fitzpatrick</td>
                <td>Regional Director</td>
                <td>London</td>
                <td>385750</td>
            </tr>
            <tr>
                <td>Michael</td>
                <td>Silva</td>
                <td>Marketing Designer</td>
                <td>London</td>
                <td>198500</td>
            </tr>
            <tr>
                <td>Paul</td>
                <td>Byrd</td>
                <td>Chief Financial Officer (CFO)</td>
                <td>New York</td>
                <td>725000</td>
            </tr>
            <tr>
                <td>Gloria</td>
                <td>Little</td>
                <td>Systems Administrator</td>
                <td>New York</td>
                <td>237500</td>
            </tr>
            <tr>
                <td>Bradley</td>
                <td>Greer</td>
                <td>Software Engineer</td>
                <td>London</td>
                <td>132000</td>
            </tr>
            <tr>
                <td>Dai</td>
                <td>Rios</td>
                <td>Personnel Lead</td>
                <td>Edinburgh</td>
                <td>217500</td>
            </tr>
            <tr>
                <td>Jenette</td>
                <td>Caldwell</td>
                <td>Development Lead</td>
                <td>New York</td>
                <td>345000</td>
            </tr>
            <tr>
                <td>Yuri</td>
                <td>Berry</td>
                <td>Chief Marketing Officer (CMO)</td>
                <td>New York</td>
                <td>675000</td>
            </tr>
            <tr>
                <td>Caesar</td>
                <td>Vance</td>
                <td>Pre-Sales Support</td>
                <td>New York</td>
                <td>106450</td>
            </tr>
            <tr>
                <td>Doris</td>
                <td>Wilder</td>
                <td>Sales Assistant</td>
                <td>Sydney</td>
                <td>85600</td>
            </tr>
            <tr>
                <td>Angelica</td>
                <td>Ramos</td>
                <td>Chief Executive Officer (CEO)</td>
                <td>London</td>
                <td>1200000</td>
            </tr>
            <tr>
                <td>Gavin</td>
                <td>Joyce</td>
                <td>Developer</td>
                <td>Edinburgh</td>
                <td>92575</td>
            </tr>
            <tr>
                <td>Jennifer</td>
                <td>Chang</td>
                <td>Regional Director</td>
                <td>Singapore</td>
                <td>357650</td>
            </tr>
            <tr>
                <td>Brenden</td>
                <td>Wagner</td>
                <td>Software Engineer</td>
                <td>San Francisco</td>
                <td>206850</td>
            </tr>
            <tr>
                <td>Fiona</td>
                <td>Green</td>
                <td>Chief Operating Officer (COO)</td>
                <td>San Francisco</td>
                <td>850000</td>
            </tr>
            <tr>
                <td>Shou</td>
                <td>Itou</td>
                <td>Regional Marketing</td>
                <td>Tokyo</td>
                <td>163000</td>
            </tr>
            <tr>
                <td>Michelle</td>
                <td>House</td>
                <td>Integration Specialist</td>
                <td>Sydney</td>
                <td>95400</td>
            </tr>
            <tr>
                <td>Suki</td>
                <td>Burks</td>
                <td>Developer</td>
                <td>London</td>
                <td>114500</td>
            </tr>
            <tr>
                <td>Prescott</td>
                <td>Bartlett</td>
                <td>Technical Author</td>
                <td>London</td>
                <td>145000</td>
            </tr>
            <tr>
                <td>Gavin</td>
                <td>Cortez</td>
                <td>Team Leader</td>
                <td>San Francisco</td>
                <td>235500</td>
            </tr>
            <tr>
                <td>Martena</td>
                <td>Mccray</td>
                <td>Post-Sales support</td>
                <td>Edinburgh</td>
                <td>324050</td>
            </tr>
            <tr>
                <td>Unity</td>
                <td>Butler</td>
                <td>Marketing Designer</td>
                <td>San Francisco</td>
                <td>85675</td>
            </tr>
            <tr>
                <td>Howard</td>
                <td>Hatfield</td>
                <td>Office Manager</td>
                <td>San Francisco</td>
                <td>164500</td>
            </tr>
            <tr>
                <td>Hope</td>
                <td>Fuentes</td>
                <td>Secretary</td>
                <td>San Francisco</td>
                <td>109850</td>
            </tr>
            <tr>
                <td>Vivian</td>
                <td>Harrell</td>
                <td>Financial Controller</td>
                <td>San Francisco</td>
                <td>452500</td>
            </tr>
            <tr>
                <td>Timothy</td>
                <td>Mooney</td>
                <td>Office Manager</td>
                <td>London</td>
                <td>136200</td>
            </tr>
            <tr>
                <td>Jackson</td>
                <td>Bradshaw</td>
                <td>Director</td>
                <td>New York</td>
                <td>645750</td>
            </tr>
            <tr>
                <td>Olivia</td>
                <td>Liang</td>
                <td>Support Engineer</td>
                <td>Singapore</td>
                <td>234500</td>
            </tr>
            <tr>
                <td>Bruno</td>
                <td>Nash</td>
                <td>Software Engineer</td>
                <td>London</td>
                <td>163500</td>
            </tr>
            <tr>
                <td>Sakura</td>
                <td>Yamamoto</td>
                <td>Support Engineer</td>
                <td>Tokyo</td>
                <td>139575</td>
            </tr>
            <tr>
                <td>Thor</td>
                <td>Walton</td>
                <td>Developer</td>
                <td>New York</td>
                <td>98540</td>
            </tr>
            <tr>
                <td>Finn</td>
                <td>Camacho</td>
                <td>Support Engineer</td>
                <td>San Francisco</td>
                <td>87500</td>
            </tr>
            <tr>
                <td>Serge</td>
                <td>Baldwin</td>
                <td>Data Coordinator</td>
                <td>Singapore</td>
                <td>138575</td>
            </tr>
            <tr>
                <td>Zenaida</td>
                <td>Frank</td>
                <td>Software Engineer</td>
                <td>New York</td>
                <td>125250</td>
            </tr>
            <tr>
                <td>Zorita</td>
                <td>Serrano</td>
                <td>Software Engineer</td>
                <td>San Francisco</td>
                <td>115000</td>
            </tr>
            <tr>
                <td>Jennifer</td>
                <td>Acosta</td>
                <td>Junior Javascript Developer</td>
                <td>Edinburgh</td>
                <td>75650</td>
            </tr>
            <tr>
                <td>Cara</td>
                <td>Stevens</td>
                <td>Sales Assistant</td>
                <td>New York</td>
                <td>145600</td>
            </tr>
            <tr>
                <td>Hermione</td>
                <td>Butler</td>
                <td>Regional Director</td>
                <td>London</td>
                <td>356250</td>
            </tr>
            <tr>
                <td>Lael</td>
                <td>Greer</td>
                <td>Systems Administrator</td>
                <td>London</td>
                <td>103500</td>
            </tr>
            <tr>
                <td>Jonas</td>
                <td>Alexander</td>
                <td>Developer</td>
                <td>San Francisco</td>
                <td>86500</td>
            </tr>
            <tr>
                <td>Shad</td>
                <td>Decker</td>
                <td>Regional Director</td>
                <td>Edinburgh</td>
                <td>183000</td>
            </tr>
            <tr>
                <td>Michael</td>
                <td>Bruce</td>
                <td>Javascript Developer</td>
                <td>Singapore</td>
                <td>183000</td>
            </tr>
            <tr>
                <td>Donna</td>
                <td>Snider</td>
                <td>Customer Support</td>
                <td>New York</td>
                <td>112000</td>
            </tr>
        </tbody>
    </table>
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
    min-width: 179px;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
    background-color: #fff;
    cursor: pointer;
}

.filter-list>div>div {
    padding: 4px 8px;
}

.first-choice {
    border-radius: 5px 5px 0 0;
}

.second-choice {
    border-radius: 0 0 5px 5px;
}

.filter-list li {
    list-style: none;
}

.filter-choice {
    padding: 7px 10px;
    font-family: MyriadPro;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #161616;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter-choice:hover {
    background-color: #eef3f8;
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