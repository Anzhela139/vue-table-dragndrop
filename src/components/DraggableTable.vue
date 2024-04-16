<template>
  <table class="product-table resizable-table" style="width:100%" ref="table">
    <thead>
      <transition-group name="flip-list" tag="tr" class="product-table__header">
        <th class="cell header-title fr-column" key="row-empty-header-handler"></th>
        <th class="cell header-title" key="row-header-handler">
          <div class="resizer"></div>
          Действие
        </th>
        <th v-for="column in columns" :key="`column-${column}`" :class="[isDraggbleColumn == column ? 'draggble' : '']"
          v-text="column.title" @mousedown="isDraggbleColumn = column" @mouseover="sort(column)"
          @mouseup="isDraggbleColumn = ''" />
      </transition-group>
    </thead>
    <tbody>
      <template v-for="(row, index) in rows" :key="`row-${index}`">
        <transition-group name="flip-list" tag="tr" class="product-table__row"
          :style="{ 'grid-template-columns': bodyGrid }">
          <td :key="`row-${index}-handler`" class="product-table__handle">
            <div class="cell body-cell fr-column" data-target="0">
              <Hamburger />
              {{ index + 1 }}
            </div>
            <div class="cell body-cell" data-target="1">
              <ThreeDots />
            </div>
          </td>
          <td v-for="column in columns" :key="`column-${index}-${column}`"
            :class="[isDraggbleColumn == column ? 'draggble' : '']" v-text="row[column?.name]" />
        </transition-group>
      </template>
    </tbody>
  </table>
</template>

<script>
import Hamburger from './icons/Hamburger.vue'
import ThreeDots from './icons/ThreeDots.vue'

export default {
  components: {
    Hamburger,
    ThreeDots,
  },
  props: {
    rows: { type: Array, default: () => ([]) },
    columns: { type: Array, default: () => ([]) },
  },
  data: () => ({
    isDraggbleColumn: null,
    headerGrid: '50px repeat(6, auto)',
    bodyGrid: 'repeat(5, auto)',
    tableWidth: 1092,
  }),
  created() {
    document.onmouseup = this.ClearDraggble
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.ClearDraggble)
  },
  mounted() {
    this.setGrid()
  },
  methods: {
    sort(column2) {
      if (!this.isDraggbleColumn || column2 == this.isDraggbleColumn) return;
      let columns = [...this.columns]
      let indexColumn1 = columns.findIndex(column => column == this.isDraggbleColumn)
      columns.splice(indexColumn1, 1)
      let indexColumn2 = columns.findIndex(column => column == column2)
      let append = (indexColumn1 == indexColumn2) ? 1 : 0;
      columns.splice(indexColumn2 + append, 0, this.isDraggbleColumn)
      this.$emit('sort', columns)
    },
    ClearDraggble() {
      this.isDraggbleColumn = null
    },
    setGrid() {
      this.tableWidth = this.$refs.table.getBoundingClientRect().width
      const tableProcent = this.tableWidth / 100

      const grid = this.columns.filter((el) => el.defaultProcent).map((el) => {
        const column = Math.abs(el.width ? el.width : tableProcent * el.defaultProcent)
        el.width = column
        return column
      })

      this.headerGrid = `50px ${tableProcent * 9}px ${Math.abs(this.tableWidth - 50 - tableProcent * 9 - grid.reduce((a, b) => a + b, 0))}px ${grid.join('px ')}px`
      this.bodyGrid = `83px ${Math.abs(this.tableWidth - 83 - grid.reduce((a, b) => a + b, 0))}px ${grid.join('px ')}px`
    },
  }
}
</script>

<style lang="scss">
table {
  width: 100%;
  border: 1px solid #2c3e50;
  background-color: darken(white, 5%);

  thead th {
    border-bottom: 1px solid #2c3e50;
    cursor: move;
    user-select: none;
  }

  .draggble {
    background-color: blue;
  }
}
</style>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform .3s;
}
</style>