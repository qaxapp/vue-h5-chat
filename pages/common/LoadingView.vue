<template>
    <div class="loading-container">
        <div class="loading-dot"></div>
    </div>
</template>

<script>
export default {
    name: "LoadingView"
}
</script>

<style lang="scss" scoped>
.loading-container {
    display: inline-flex;
    margin-right: 8px;
}

.loading-dot {
    width: 16px;
    height: 16px;
    border: 2px solid $cm-border-color;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
