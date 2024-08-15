<template>
  <bib-modal-wrapper v-if="show" @close="$emit('close')" @click:outside="$emit('close')" no-header>
    <div slot="content" class="user-details">
      <!-- COMPANY IMAGE -->
      <div class="head-line">
        <img :src="`/img/default_company.svg`" />
      </div>

      <!-- COMPANY TITLE -->
      <div class="mt-1 mb-1">
        <div class="align-center justify-between font-lg mb-025">
          <div class="font-w-700">{{ $t("common.productName") }}</div>
          <div class="font-w-700">$354.98</div>
        </div>
        <div class="align-center justify-between font-md mb-025">
          <div>
            {{ $t("common.users") }}: 6/10
            <span class="text-primary" style="text-decoration: underline; cursor: pointer">{{ $t("common.upgrade") }}</span>
          </div>
          <div>/{{ $t("common.month") }}</div>
        </div>
        <div class="align-center justify-between font-md">
          <div>
            {{ $t("common.organizationShort") }}: Biztree, Inc.
            <span class="text-primary" style="text-decoration: underline; cursor: pointer">{{ $t("common.upgrade") }}</span>
          </div>
          <div>{{ $t("common.paidAnnually") }}</div>
        </div>
      </div>

      <!-- COMPANY DETAILS -->
      <div class="details-body">
        <div class="cancel-autorenew">
          <div class="ellipsis">{{ $t("common.cancelsAutorenews") }} 2022-05-19</div>
          <div class="renew-link">{{ $t("common.renew") }}</div>
        </div>

        <div class="details-body__content">
          <bib-input type="number" placeholder="..." value="10" :label="$t('common.users')" class="mb-1"></bib-input>

          <div class="text-secondary mb-05">{{ $t("common.assignedOrganization") }}</div>
          <div class="font-w-700 mb-2">Biztree, Inc.</div>

          <div class="align-center justify-between">
            <div class="ellipsis">
              {{ $t("common.paidWith") }}:
              <span class="font-w-700">MasterCard****1245</span>
            </div>
            <div class="text-primary" style="text-decoration: underline; cursor: pointer">{{ $t("common.update") }}</div>
          </div>
        </div>
      </div>

      <div class="align-center justify-between mt-2 mb-1">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
        <bib-button size="lg" :label="$t('common.save')" variant="primary-24" pill @click="$emit('close')"></bib-button>
      </div>
    </div>
  </bib-modal-wrapper>
</template>

<script>
export default {
  props: ["show", "userId"],
  data() {
    return {
      userData: { name: "Brought Dust", work_title: "Project manager", company_name: "Biztree Inc.", email: "brought.dust@gmail.comb", phone: "+1 514 698 5214", address: "5874 Boul. Lasalle Verdun, Montreal QC H4G 3DR" },
    };
  },
  methods: {},
  computed: {},
  created() {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper {
  border-radius: 8px !important;
  box-shadow: 0px 2px 40px -4px rgb(0 0 0 / 40%) !important;
  background: $background-dark !important;
}

.user-details {
  .head-line {
    img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 0 0 1px $gray4;
      margin-right: 16px;
    }
  }

  .details-body {
    background: $background;
    margin-top: 16px;
    border-radius: 4px;
    overflow: hidden;

    .cancel-autorenew {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      background: $warning;
      padding: 14px;

      .renew-link {
        color: $primary;
        cursor: pointer;
        text-decoration: underline;
      }
    }

    &__content {
      padding: 14px;
    }
  }
}
</style>
