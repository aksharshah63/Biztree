<template>
  <div class="text-center">
  </div>
</template>

<script>
export default {
  created() {
    this.logout()
  },
  mounted() {
  },
  methods: {
    async logout() {
      this.$store.dispatch('loading/set', true)
      await this.$store.dispatch('account/global_logout')
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
