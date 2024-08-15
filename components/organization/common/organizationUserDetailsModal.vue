<template>
  <bib-modal-wrapper v-if="show && userData" @click:outside="$emit('close')" no-header>
    <div slot="content" :class="['user-details', {'dark': !isLightTheme }]">
      <div class="custom-close">
        <bib-icon
          variant="gray4"
          class="cursor-pointer"
          :scale="1.5"
          icon="close"
          @click="$emit('close')"
        ></bib-icon>
      </div>
      <div class="head-line mt-1 mb-2">
        <bib-avatar :src="userData.Photo" size="5rem" class="mr-2"/>
        <div class="head-line__text">
          <div class="head-line__text-name">{{ userData.FirstName + ' ' + userData.LastName }}</div>
          <div class="head-line__text-details">{{ userData.JobTitle }}</div>
        </div>
      </div>
      <div v-show="userData.Email" class="details-body">
        <div class="font-md mb-2">{{ $t("common.contactDetails") }}</div>
        <div class="align-start mb-1">
          <bib-icon icon="mail-new" :scale="1.3" variant="secondary" class="m-05 mr-1" />
          <div>
            <div class="text-secondary font-md">{{ $t("common.email") }}</div>
            <div>{{ userData.Email }}</div>
          </div>
        </div>
        <div v-show="userData.Phone" class="align-start mb-1">
          <bib-icon icon="device-mobile" :scale="1.3" variant="secondary" class="m-05 mr-1" />
          <div>
            <div class="text-secondary font-md">{{ $t("common.phone") }}</div>
            <div>{{ userData.Phone }}</div>
          </div>
        </div>
        <div v-show="userData.Address" class="align-start mb-1">
          <bib-icon icon="location" :scale="1.3" variant="secondary" class="m-05 mr-1" />
          <div>
            <div class="text-secondary font-md">{{ $t("common.address") }}</div>
            <div>{{ userData.Address }}</div>
          </div>
        </div>

        <!-- FULL PROFILE BUTTON -->
        <div class="p-025">
          <!-- <bib-button size="lg" :label="`${$t('common.fullProfile')}...`" variant="gray" pill class="w-100"></bib-button> -->
        </div>
      </div>
    </div>
  </bib-modal-wrapper>
</template>

<script>
export default {
  props: ["show", "userId", "user", "isLightTheme"],
  data() {
    return {
      userData: null
    };
  },
  methods: {},
  computed: {},
  created() {
    this.userData = this.user
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper__content {
  padding-top: 0 !important;
  margin-top: 2rem;
}

.user-details {
  &.dark {
    color: var(--bib-secondary);
    .details-body {
      background-color: var(--bib-surface-tertiary);
      border: 1px solid var(--bib-border-primary);
    }
  }
  position: relative;
  .custom-close {
    position: absolute;
    top: -1rem;
    right: -1.2rem;
  }
  .head-line {
    display: flex;
    align-items: center;

    img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 800px;
      box-shadow: 0 0 0 1px $gray4;
      margin-right: 16px;
    }

    &__text {
      &-name {
        font-weight: 700;
      }

      &-details {
        font-size: 15px;
      }
    }
  }

  .details-body {
    background: $background-dark;
    margin-top: 16px;
    padding: 10px;
    padding-top: 6px;
    border-radius: 8px;
  }
}
</style>
