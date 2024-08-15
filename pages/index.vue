<template>
  <div>
    <!-- <bib-button size="lg" class="ml-3 mt-3" label="go to my account" variant="primary-24" pill @click="$router.push('/account')"></bib-button> -->
  </div>
</template>

<script>
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
  beforeMount () {
    this.$router.push("/my_profile")
  }
};
</script>
<style lang="scss" scoped></style>
