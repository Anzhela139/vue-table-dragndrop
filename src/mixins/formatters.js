const formatters = {
    methods: {
        formatNum(price) {
            const formatter = Intl.NumberFormat("ru")

            return formatter.format(price)
        }
    }
}

export default formatters
