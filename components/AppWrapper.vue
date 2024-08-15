<template>
  <div class="templates-wrapper">
    <!-- TOP -->
    <div v-if="$slots.topbar" class="templates-wrapper__top">
      <slot name="topbar" />
    </div>

    <!-- BOTTOM -->
    <div class="templates-wrapper__bottom">
      <!-- BOTTOM LEFT -->
      <div class="templates-wrapper__bottom-left" :class="{ dark: !isLightTheme }">
        <div
          v-if="$slots.switcher"
          class="templates-wrapper__bottom-left-switcher"
        >
          <slot name="switcher" />
        </div>
        <div
          v-if="$slots.navigation"
          class="templates-wrapper__bottom-left-navigation"
        >
          <slot name="navigation" />
        </div>
      </div>

      <!-- BOTTOM RIGHT -->
      <div class="templates-wrapper__bottom-right">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLightTheme: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.templates-wrapper {
  &__top {
    height: 4rem;
  }

  &__bottom {
    display: flex;
    height: calc(100vh - 4rem);

    &-left {
      position: relative;
      display: flex;
      border-right: 1px solid var(--bib-light);

      &.dark{
        background: $dark;
      }

      &-switcher {
        padding-top: 0.25rem;
        background-color: rgba(0, 0, 0, 0.08);
      }
    }

    &-right {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
