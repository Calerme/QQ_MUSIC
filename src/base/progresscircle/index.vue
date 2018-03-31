<template>
  <div class="progress-circle">
    <svg width="40"
         height="40"
         viewBox="0 0 100 100"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background"
              r="50"
              cx="50"
              cy="50"
              fill="transparent"></circle>
      <circle class="progress-bar"
              r="50"
              cx="50"
              cy="50"
              fill="transparent"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="residual"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'circleSvg',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    residual () {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/base";
.progress-circle {
  position: relative;
  width: 40px;
  height: 40px;
}
svg {
  position: absolute;
  top: 0;
  left: 0;
}
circle {
  position: absolute;
  left: 0;
  top: 0;
  stroke-width: 8px;
  transform-origin: center;
  &.progress-background {
    transform: scale(0.9);
    stroke: $baseColorLighterGray;
  }
  &.progress-bar {
    transform: scale(0.9) rotate(-90deg);
    stroke: $baseColor;
  }
}
</style>
