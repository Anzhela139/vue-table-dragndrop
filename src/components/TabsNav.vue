<script>

</script>

<template>
    <div class="tabs-btn-wrapper">
        <div class="tab-btn active">
            <RouterLink to="/" class="tab-link">Drag'n'drop data table</RouterLink>
        </div>
        <div class="tab-btn">
            <RouterLink to="/not-yet" class="tab-link">Not implemented</RouterLink>
        </div>
        <div class="tab-btn">
            <RouterLink to="/not-yet" class="tab-link">Not implemented</RouterLink>
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