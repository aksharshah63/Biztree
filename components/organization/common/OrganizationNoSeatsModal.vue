<template>
    <bib-modal-wrapper no-header>
      <div slot="content" class="dialog-content">
        <div class="custom-close">
          <bib-icon
            variant="gray4"
            class="cursor-pointer"
            :scale="1.5"
            icon="close"
            @click="$emit('close')"
          ></bib-icon>
        </div>
        <div class="text-center p-1">
          <p class="font-w-600 mb-2">
            {{ text }}
          </p>
          <bib-button size="lg" label="Add Seats" pill variant="primary-24" @click="handleAddSeats"></bib-button>
        </div>
      </div>
    </bib-modal-wrapper>
</template>

<script>
export default {
  props: {
    text: String
  },
  data () {
    return {
      bibUpgradeLicenseURL: process.env.BIB_UPGRADE_LICENSE_URL,
    }
  },
  methods: {
    handleAddSeats() {
      window.open(`${this.bibUpgradeLicenseURL}/?lang=${this.$i18n.locale}`, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  position: relative;
  .custom-close {
    position: absolute;
    top: -1rem;
    right: -1.2rem;
  }
}
</style>
