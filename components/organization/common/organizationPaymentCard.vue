<template>
  <div :class="['payment-card', `payment-card--${cardTypeName}`, { 'dark': !lightThemeChecked }]" :style="computedStyle" @click="$emit('click')">
    <!-- <div v-if="cardTypeName === 'mastercard'" class="payment-card__primary">{{ $t("common.primary") }}</div> -->
    <img :src="`/img/paymet_cards/${cardTypeName}.png`" />
    <div class="payment-card__text">
      <div class="payment-card__text-title">****{{cardInfo.CardNumberLast4Digits}}</div>
      <div class="payment-card__text-subtitle">Expires {{expMonth}}/20{{expYear}}</div>
    </div>
    <slot />
  </div>
</template>

<script>
import { getCardTypeName } from "@/assets/utils/creditCardTypeDetector";
export default {
  props: ["card", "height", "background-color", "cardInfo", "lightThemeChecked"],
  data() {
    return {
      cardTypeName: getCardTypeName(parseInt(this.cardInfo.CardType)),
    };
  },
  computed: {
    computedStyle() {
      return [
        { "--background-color": this.backgroundColor || "white" },
        { "--background-height": this.height || "130px" },
      ];
    },
    expYear() {
      return this.cardInfo.ExpYear < 10 ? '0' + this.cardInfo.ExpYear : this.cardInfo.ExpYear
    },
    expMonth() {
      return this.cardInfo.ExpMonth < 10 ? '0' + this.cardInfo.ExpMonth : this.cardInfo.ExpMonth
    }
  },
  created() {},
  mounted() {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.payment-card {
  position: relative;
  @include flex-align;
  @include flex-justify;
  flex-direction: column;
  width: 16rem;
  height: var(--background-height);
  background: var(--background-color);
  border-radius: calc(var(--background-height) / 32);
  cursor: pointer;

  img {
    width: 100%;
    max-height: 48px;
    object-fit: contain;
    margin-bottom: 8px;
  }

  &__text {
    overflow: hidden;
    width: 100%;
    text-align: center;
    color: white;

    &-title {
      font-weight: bold;
      font-size: 15px;
      padding: 0 16px;
      text-align: center;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-subtitle {
      font-size: 13px;
      padding: 0 16px;
      text-align: center;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &--empty {
    background: none;
    border: 1px solid $border-color;
    color: $primary;
  }

  // &:active {
  //   // transform: scale(0.98);
  // }

  &--mastercard {
    background: linear-gradient(125deg, #eb001b, #f79e1b);
  }

  &--visa {
    background: linear-gradient(125deg, #faa61a, #00579f);
  }

  &--amex {
    background: #b1b1b4;
    &.dark {
      background: var(--bib-surface-tertiary);
      border: 1px solid var(--bib-border-primary);
    }
  }

  &__primary {
    position: absolute;
    top: -5px;
    left: -5px;
    text-transform: uppercase;
    font-size: 12px;
    background: $success;
    color: white;
    padding: 4px 24px;
    border-top-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
