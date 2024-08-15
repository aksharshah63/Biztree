<template>
  <div class="mt-3">
    <!-- SUBSCRIPTION INFORMATION -->

    <div class="font-w-700 ml-2 mb-2">{{ $t("common.recentActivity") }}</div>

    <div v-for="(row, index) in activityHistory" :key="index" class="history-row">
      <div class="history-row__date-time">
        <div>{{ row.date }}&nbsp;</div>
        <div>@ {{ row.time }}</div>
      </div>
      <div class="history-row__info">
        <div class="info__user-name">{{ row.user_name }}</div>
        <div class="info__user-action">{{ row.user_action }}</div>
        <div class="info__undo-link">{{ $t("common.undo") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityHistory: [],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.history-row {
  width: 100%;
  padding: 0 30px;
  margin-bottom: 1rem;
  font-size: 14px;
  @include flex-align;

  &__date-time {
    margin-left: 16px;
    width: 120px;
    font-size: 12px;
    display: list-item;
    color: $gray1;
  }

  &__info {
    width: 100%;
    @include flex-align;
    background: $background;
    padding: 10px;

    .info {
      &__user-name {
        font-weight: bold;
        margin-right: 10px;
      }

      &__user-action {
        flex-grow: 1;
      }

      &__undo-link {
        margin-left: 10px;
        text-decoration: underline;
        color: $orange;
        cursor: pointer;

        &:active {
          transform: scale(95%);
        }
      }
    }
  }

  @media only screen and (max-width: 790px) {
    flex-direction: column;
    &__date-time {
      @include flex-align;
      width: 100%;
      margin-bottom: 6px;
    }
  }
}
</style>
