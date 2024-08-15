<template>
    <bib-modal-wrapper no-header>
      <div slot="content" :class="['dialog-content', {'dark': !isLightTheme}]">
        <div class="custom-close">
          <bib-icon
            variant="gray4"
            class="cursor-pointer"
            :scale="1.5"
            icon="close"
            @click="$emit('close')"
          ></bib-icon>
        </div>
        <div class="text-center p-2">
          <p class="font-w-600">
            {{ text }}
          </p>
        </div>
      </div>

      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
        <bib-button size="lg" :label="$t('common.confirm')" variant="danger" pill @click="$emit('confirm')"></bib-button>
      </div>
    </bib-modal-wrapper>
</template>

<script>
export default {
  props: {
    text: String,
    isLightTheme: Boolean
  },
}
</script>

<style lang="scss" scoped>
.dialog-content {
  &.dark {
    color: var(--bib-secondary);
  }
  position: relative;
  .custom-close {
    position: absolute;
    top: -1rem;
    right: -1.2rem;
  }
}
</style>
