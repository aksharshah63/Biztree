<template>
  <div :class="['content-header', { 'dark': !lightThemeChecked }]">
    <div class="content-header__header-bottom">
      <div class="bottom-left">
        <slot name="bottom-left" />
      </div>
      <div class="bottom-right">
        <slot name="bottom-right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    };
  },
  watch: {
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  mounted() {
    this.lightThemeChecked = this.$cookies.get('isLightTheme');
  }
};
</script>


<style lang="scss" scoped>
.content-header {
  background: $background;
  position: sticky;
  top: 0;
  z-index: 2;
  &__header-top {
    @include flex-align;
    @include flex-justify(space-between);
    height: 40px;
    border-bottom: 1px solid $border-color;
    .top-left {
      @include flex-align;
      flex-wrap: wrap;
    }
    .top-right {
      @include flex-align;
      @include flex-justify(flex-end);
      flex-wrap: wrap;
    }
  }
  &__header-bottom {
    @include flex-align;
    @include flex-justify(space-between);
    height: 60px;
    border-bottom: 1px solid $border-color;
    line-height: 100%;
    .bottom-left {
      @include flex-align;
      flex-wrap: wrap;
    }
    .bottom-right {
      @include flex-align;
      @include flex-justify(flex-end);
      flex-wrap: wrap;
    }
    &__left-side {
      @include flex-align;
      height: 72px;
      border-bottom: 1px solid $border-color;
      line-height: 100%;
      font-size: 25px;
      font-weight: bold;
      padding-left: 42px;
    }
  }
}

.content-header.dark {
  background-color: var(--bib-text) !important;
  color: var(--bib-secondary);
  .pop{
    .list{
      background-color: var(--bib-text) !important;
    }
  }
}

</style>
