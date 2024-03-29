<script>

</script>

<template>
    <div class="tabs-btn-wrapper">
        <div class="tab-btn">
            <a href="" class="tab-link">Общее</a>
        </div>
        <div class="tab-btn active">
            <a href="" class="tab-link">Товары</a>
        </div>
        <div class="tab-btn">
            <a href="" class="tab-link">Доп. расходы</a>
        </div>
    </div>
</template>

<style scoped>
.tabs-btn-wrapper {
    display: flex;
    gap: 22px;
    align-items: center;
}
.tab-btn,
.tab-btn a {
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--light-navy);

}

.tab-btn.active,
.tab-btn.active a {
    color: #000;
}
</style>