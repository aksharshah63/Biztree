<template>
  <form @submit.prevent class="mt-3">
    <!-- EMAIL -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.email") }}</div>

      <div class="grid-2 grid-gap-2 grid-break-1000 pl-2 pr-2">
        <bib-input class="grid-col-1" type="email" v-model="organization_image" placeholder="..." :label="$t('common.primaryEmail')" :disabled="!organizationEditState"></bib-input>
      </div>
      <div class="grid-2 grid-gap-2 grid-break-1000 pl-2 pr-2">
        <bib-input class="grid-col-1" type="email" v-model="organization_image" placeholder="..." :label="$t('common.secondaryEmail')" :disabled="!organizationEditState"></bib-input>
      </div>

      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="organizationEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="organizationEditState = false"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="gray--outline" pill @click="organizationEditState = true"></bib-button>
        </template>
      </div>
      <div class="separator mt-3"></div>
    </div>

    <!-- ADDRESS -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.address") }}</div>
      <div class="grid-3 grid-gap-2 grid-break-800 pl-2 pr-2">
        <bib-input class="grid-col-2" type="text" v-model="organization_image" placeholder="..." :label="$t('common.addressLong')" :disabled="!organizationEditState"></bib-input>
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="..." :label="$t('common.addressApartment')" :disabled="!organizationEditState"></bib-input>
      </div>
      <div class="grid-3 grid-gap-2 grid-break-800 pl-2 pr-2">
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="..." :label="$t('common.city')" :disabled="!organizationEditState"></bib-input>
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="..." :label="$t('common.state')" :disabled="!organizationEditState"></bib-input>
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="..." :label="$t('common.zipCode')" :disabled="!organizationEditState"></bib-input>
      </div>
      <div class="grid-3 grid-gap-2 grid-break-800 pl-2 pr-2">
        <div class="grid-col-1">
          <div class="font-md text-gray5">{{ $t("common.country") }}</div>
          <bib-input :selected="languages[0]" :options="languages" type="select"></bib-input>
        </div>
      </div>

      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="organizationEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="organizationEditState = false"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="gray--outline" pill @click="organizationEditState = true"></bib-button>
        </template>
      </div>
      <div class="separator mt-3"></div>
    </div>

    <!-- TELEPHON -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.telephoneNumbers") }}</div>
      <div class="pl-2 pr-2">
        <div class="grid-3 grid-break-800">
          <div class="grid-col-2 align-start">
            <bib-input type="text" class="mr-1" v-model="organization_image" placeholder="..." :label="`${$t('common.phoneNumber')} #1`" :disabled="!organizationEditState"></bib-input>
            <bib-input style="width: 100px" type="text" v-model="organization_image" placeholder="..." :label="$t('common.phoneExtentionShort')" :disabled="!organizationEditState"></bib-input>
          </div>
        </div>

        <div class="grid-3 grid-break-800">
          <div class="grid-col-2 align-start">
            <bib-input type="text" class="mr-1" v-model="organization_image" placeholder="..." :label="`${$t('common.phoneNumber')} #2`" :disabled="!organizationEditState"></bib-input>
            <bib-input style="width: 100px" type="text" v-model="organization_image" placeholder="..." :label="$t('common.phoneExtentionShort')" :disabled="!organizationEditState"></bib-input>
          </div>
        </div>

        <div class="grid-3 grid-break-800">
          <div class="grid-col-2 align-start">
            <bib-input type="text" class="mr-1" v-model="organization_image" placeholder="..." :label="`${$t('common.phoneNumber')} #3`" :disabled="!organizationEditState"></bib-input>
            <bib-input style="width: 100px" type="text" v-model="organization_image" placeholder="..." :label="$t('common.phoneExtentionShort')" :disabled="!organizationEditState"></bib-input>
          </div>
        </div>
      </div>

      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="organizationEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="organizationEditState = false"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="gray--outline" pill @click="organizationEditState = true"></bib-button>
        </template>
      </div>
      <div class="separator mt-3"></div>
    </div>

    <!-- LINKS / APPS -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.linksApps") }}</div>
      <div class="pl-2 pr-2">
        <div class="grid-3 grid-break-800">
          <div class="grid-col-2 align-start">
            <bib-input type="text" class="mr-1" v-model="organization_image" placeholder="..." :label="$t('common.network')" :disabled="!organizationEditState"></bib-input>
            <bib-input type="text" v-model="organization_image" placeholder="..." :label="$t('common.pageUrl')" :disabled="!organizationEditState"></bib-input>
          </div>
        </div>

        <div class="grid-3 grid-break-800">
          <div class="grid-col-2 align-start">
            <bib-input type="text" class="mr-1" v-model="organization_image" placeholder="..." :label="$t('common.network')" :disabled="!organizationEditState"></bib-input>
            <bib-input type="text" v-model="organization_image" placeholder="..." :label="$t('common.pageUrl')" :disabled="!organizationEditState"></bib-input>
          </div>
        </div>

        <div class="grid-3 grid-break-800">
          <div class="grid-col-2 align-start">
            <bib-input type="text" class="mr-1" v-model="organization_image" placeholder="..." :label="$t('common.network')" :disabled="!organizationEditState"></bib-input>
            <bib-input type="text" v-model="organization_image" placeholder="..." :label="$t('common.pageUrl')" :disabled="!organizationEditState"></bib-input>
          </div>
        </div>
      </div>

      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="organizationEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="organizationEditState = false"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="gray--outline" pill @click="organizationEditState = true"></bib-button>
        </template>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      organization_image: null,
      organizationEditState: false,

      //
      languages: {
        items: [
          {
            label: "Organization #01",
            event: "item-click",
            img: "https://i.pravatar.cc/300",
          },
          {
            label: "Organization #02",
            event: "item-click",
            img: "https://i.pravatar.cc/300",
          },
        ],
        footer: {
          label: this.$i18n.t("addOrganization"),
          icon: "plus",
          event: "add-organization",
        },
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.separator {
  width: 100%;
  height: 1px;
  background: rgba(120, 120, 120, 0.25);
}

.organization-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;

  &--big {
    width: 80px;
    height: 80px;
  }
}
</style>
