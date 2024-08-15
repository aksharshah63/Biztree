<template>
  <div class="header">
    <bib-logo is-light-theme size="36px" />
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.header {
  background: $background;
  height: 64px;
  color: white;
  padding: 8px 5px;
  display: flex;
  align-items: center;
}
</style>
