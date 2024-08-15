<template>
  <div class="team-card" :style="computedStyle" @click="$emit('click')">
    <img :src="`/img/biztree_logo.jpg`" class="team-card-img" />
    <div class="team-card__title">BizTree, Inc.</div>
    <div class="team-card__subtitle">Custom description</div> 
    <slot />
  </div>
</template>

<script>
export default {
  props: ["team", "height", "background-color"],
  data() {
    return {};
  },
  methods: {},
  computed: {
    computedStyle() {
      return [
        { "--background-color": this.backgroundColor || "white" },
        { "--background-height": this.height || "130px" },
        ///
      ];
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.team-card {
  position: relative;
  @include flex-align;
  // @include flex-justify;
  padding-top: 36px;
  flex-direction: column;
  width: 100%;
  height: var(--background-height);
  background: var(--background-color);
  border-radius: calc(var(--background-height) / 32);
  cursor: pointer;
  overflow: hidden;

  &-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;

  }

  &__title {
    font-size: 15px;
    font-weight: bold;

    text-align: center;
    width: calc(100% - 32px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtitle {
    font-size: 13px;
    text-align: center;
    width: calc(100% - 32px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:active {
   // transform: scale(0.98);
  }
}
</style>
