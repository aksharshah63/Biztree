<template>
  <bib-modal-wrapper v-if="cardType && cardObj" size="xl" @close="$emit('close')" @click:outside="$emit('close')" no-header>
    <!-- CARD -->
    <div :class="['card-modal', { dark: !lightThemeChecked }]">
      <!-- HEADER -->
      <div class="card-modal__header">{{ $t("common.expires") }}: {{ `20${expYear}-${expMonth}` }}</div>

      <!-- CARD CONTAINER -->
      <div :class="`card-modal__card-information card-modal__card-information--${cardTypeName}`">
        <div v-if="cardObj.CardType !== null">
          <img :src="`/img/paymet_cards/${cardTypeName}.png`" />
          <h2 class="font-capitalize mb-0">{{ cardTypeName[0].toUpperCase() + cardTypeName.slice(1) }}****{{ cardObj.CardNumberLast4Digits }}</h2>
        </div>

        <form @submit.prevent v-if="currentSelectedState === 'edit_card'">
          <bib-input type="text" v-model="cardObj.CardNumber" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.cardNumber')" @input="changeCardNumber" class="mt-2" :disabled="cardInfoDisabled"></bib-input>

          <bib-input type="text" v-model="cardObj.NameOnCard" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.nameOnCard')" class="mt-025" :disabled="cardInfoDisabled"></bib-input>

          <div class="grid-3 grid-gap-1 grid-break-600 mt-025">
            <bib-input class="grid-col-1" v-model="cardObj.ExpMonth" type="select" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.expirationMonth')" :options="expirationMonths" :disabled="cardInfoDisabled"></bib-input>
            <bib-input class="grid-col-1" v-model="cardObj.ExpYear" type="select" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.expirationYear')" :options="expirationYears" :disabled="cardInfoDisabled"></bib-input>
            <bib-input class="grid-col-1" type="text" v-model="cardObj.CVC" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.cardCvc')" :disabled="cardInfoDisabled"></bib-input>
          </div>

          <bib-input type="select" v-model="cardObj.country" :variant="lightThemeChecked ? 'light' : 'dark'" :options="countries" :label="$t('common.country')" class="mt-025" :disabled="cardInfoDisabled" @input="handleCountrySelect"></bib-input>

          <div class="grid-1 grid-gap-1 grid-break-600 mt-025">
            <bib-input :disabled="cardInfoDisabled" :variant="lightThemeChecked ? 'light' : 'dark'" v-if="selectedCountryISO === 840" class="grid-col-1" :options="states" type="select" v-model="cardObj.state" :label="$t('common.state')"></bib-input>
            <bib-input :disabled="cardInfoDisabled" v-if="selectedCountryISO === 124" class="grid-col-1" :options="provinces" type="select" v-model="cardObj.state" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.state')"></bib-input>
            <bib-input :disabled="cardInfoDisabled" v-if="selectedCountryISO !== 840 && selectedCountryISO !== 124" class="grid-col-1" type="text" placeholder="Type your State or Province" v-model="cardObj.state" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.state')"></bib-input>
          </div>

          <div class="align-center justify-between mt-2">
            <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
            <bib-button size="lg" :label="$t('common.save')" variant="primary-24" pill v-if="!cardInfoDisabled" @click="updateCardInfo" :disabled="isCardUpdateDisabled"></bib-button>
            <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill v-if="cardInfoDisabled" @click="cardInfoDisabled = !cardInfoDisabled"></bib-button>
          </div>
        </form>
        <template v-else>
          <div class="align-end justify-between">
            <div>
              <div>{{ firstName + " " + lastName }}</div>
              <div>{{ $t("common.expires") }}: 20{{ expYear }}-{{ expMonth }}</div>
            </div>
            <div class="link" @click="currentSelectedState = 'edit_card'" :class="{'text-primary-24': lightThemeChecked,'text-primary-24-sub4': !lightThemeChecked}">{{ $t("common.editCardInformation") }}</div>
          </div>
        </template>
      </div>

      <!-- BILLING INFO -->
      <div class="card-modal__billing-information">
        <form @submit.prevent v-if="currentSelectedState === 'edit_billing'">
          <div>
            <div class="font-w-700 mb-2">{{ $t("common.billingInformation") }}</div>

            <div class="grid-2 grid-gap-2 grid-break-600">
              <bib-input class="grid-col-1" type="text" v-model="firstName" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.firstName')" :disabled="billingInfoDisabled"></bib-input>
              <bib-input class="grid-col-1" type="text" v-model="lastName" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.lastName')" :disabled="billingInfoDisabled"></bib-input>
            </div>
            <div class="grid-2 grid-gap-2 grid-break-600">
              <bib-input class="grid-col-1" type="email" v-model="businessObj.ContactEmail" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.email')" :disabled="billingInfoDisabled"></bib-input>
              <bib-input class="grid-col-1" type="text" v-model="phoneNumber" @keypress="isPhoneNumber($event)" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.telephone')" :disabled="billingInfoDisabled"></bib-input>
            </div>
          </div>

          <!-- ADDRESS -->
          <div class="mt-2" v-if="false">
            <div class="grid-3 grid-gap-2 grid-break-600">
              <bib-input class="grid-col-2" type="text" v-model="businessObj.AddressL1" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.addressLong')" :disabled="billingInfoDisabled"></bib-input>
              <!-- <bib-input class="grid-col-1" type="text" placeholder="..." :label="$t('common.addressApartment')"></bib-input> -->
            </div>
            <div class="grid-3 grid-gap-2 grid-break-600">
              <bib-input class="grid-col-1" type="text" v-model="businessObj.City" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.city')" :disabled="billingInfoDisabled"></bib-input>
              <bib-input class="grid-col-1" type="text" v-model="businessObj.StateProvince" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.state')" :disabled="billingInfoDisabled"></bib-input>
              <bib-input class="grid-col-1" type="text" v-model="businessObj.PostalCode" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.zipCode')" :disabled="billingInfoDisabled"></bib-input>
            </div>
            <div class="grid-3 grid-gap-2 grid-break-600">
              <div class="grid-col-2">
                <div class="font-md text-gray5">{{ $t("common.country") }}</div>
                <bib-input :variant="lightThemeChecked ? 'light' : 'dark'" :options="countries" type="select" v-model="businessObj.Country" :disabled="billingInfoDisabled"></bib-input>
              </div>
            </div>
          </div>

          <!-- ORGANIZATION -->
          <div>
            <bib-input type="text" v-model="businessObj.CompanyName" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.organization')" :disabled="billingInfoDisabled"></bib-input>
            <!-- <bib-input type="text" placeholder="#########" :label="$t('common.taxId')"></bib-input> -->
          </div>

          <div class="align-center justify-between mt-2">
            <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
            <bib-button size="lg" v-if="!billingInfoDisabled" :label="$t('common.save')" variant="primary-24" pill @click="saveBillingInfo"></bib-button>
            <bib-button size="lg" v-if="billingInfoDisabled" :label="$t('common.update')" variant="primary-24" pill @click="billingInfoDisabled = !billingInfoDisabled"></bib-button>
          </div>
        </form>
      </div>
    </div>
  </bib-modal-wrapper>
</template>

<script>
import { updateCard, updateBusiness } from "~/model/business";
import { creditCardTypeDetector, getCardTypeName } from "@/assets/utils/creditCardTypeDetector";
import { countries } from "@/assets/utils/locations";
import { states } from "@/assets/utils/locations";
export default {
  props: ["cardData", "modalState", "businessData", "lightThemeChecked"],
  data() {
    return {
      currentSelectedState: null,
      countries: [],
      states: [],
      provinces: [],
      cardObj: this.cardData,
      cardType: this.cardData.CardType,
      cardTypeName: getCardTypeName(parseInt(this.cardData.CardType)),
      cardInfoDisabled: false,
      businessObj: this.businessData,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      expirationMonths: [{ label: "--", value: null }],
      expirationYears: [{ label: "--", value: null }],
      billingInfoDisabled: false,
      selectedCountryISO: null,
    };
  },
  computed: {
    expYear() {
      return this.cardObj.ExpYear < 10 ? "0" + this.cardObj.ExpYear : this.cardObj.ExpYear;
    },
    expMonth() {
      return this.cardObj.ExpMonth < 10 ? "0" + this.cardObj.ExpMonth : this.cardObj.ExpMonth;
    },
    isPhoneNumberValidate() {
      const reg = /^(\+)?(\d{1,2})?[( .-]*(\d{3})[) .-]*(\d{3,4})[ .-]?(\d{4})$/;
      return this.phoneNumber ? this.phoneNumber.match(reg) : true;
    },
    isCardUpdateDisabled() {
      return !this.cardObj.country || (!this.cardObj.state && (this.cardObj.country == "124" || this.cardObj.country == "840"));
    },
  },
  created() {
    this.firstName = this.businessData.ContactName.split(" ")[0];
    this.lastName = this.businessData.ContactName.split(" ")[1];
    this.phoneNumber = this.businessData.ContactPhone;
    Array.from(Array(12).keys()).forEach((e) => {
      this.expirationMonths.push({
        label: e + 1,
        value: e + 1,
      });
    });
    Array.from(Array(40).keys()).forEach((e) => {
      this.expirationYears.push({
        label: e + 2011,
        value: e + 11,
      });
    });
    this.countries = countries.map((e) => {
      return {
        label: e.name,
        value: e.id,
      };
    });
    this.countries.unshift({
      label: this.$t("common.select"),
      value: null,
    });
    this.provinces = states["124"].map((e) => {
      return {
        label: e.name,
        value: e.name,
        region: e.regionIso2,
      };
    });
    this.provinces.unshift({
      label: this.$t("common.select"),
      value: null,
    });
    this.states = states["840"].map((e) => {
      return {
        label: e.name,
        value: e.name,
        region: e.regionIso2,
      };
    });
    this.states.unshift({
      label: this.$t("common.select"),
      value: null,
    });
  },
  mounted() {
    this.cardObj.CardNumber = `************${this.cardObj.CardNumberLast4Digits}`;
    this.cardObj.CVC = `****`;
    this.currentSelectedState = this.modalState || "edit_card";
    this.cardObj.country = (this.businessData.Country && this.countries.filter((e) => e.label === this.businessData.Country)[0].value) || null;
    this.selectedCountryISO = parseInt(this.cardObj.country);
    this.cardObj.state = this.businessData.StateProvince ? this.businessData.StateProvince : "";
  },
  methods: {
    handleCountrySelect() {
      this.selectedCountryISO = parseInt(this.cardObj.country);
      if (this.cardObj.country === 840) {
        this.cardObj.state = this.states[0].value;
      } else if (this.cardObj.country === 124) {
        this.cardObj.state = this.provinces[0].value;
      } else {
        this.cardObj = Object.assign({}, { ...this.cardObj, state: null });
      }
    },
    changeCardNumber(value) {
      const card = creditCardTypeDetector(value);
      this.cardObj.CardType = card.code;
      this.cardTypeName = getCardTypeName(this.cardObj.CardType);
      this.cardObj.CardNumberLast4Digits = this.cardObj.CardNumber.slice(-4);
    },
    async updateCardInfo() {
      this.$store.dispatch("loading/setGlobal", true);
      this.businessObj.Country = this.countries.filter((e) => e.value == this.cardObj.country)[0].label;
      this.businessObj.StateProvince = this.cardObj.state;
      await updateBusiness(this.businessObj);
      const resp = await updateCard(this.cardObj);
      if (resp.err) {
        await this.$store.dispatch("notification/set", [true, resp.err.message, "danger"]);
        setTimeout(async () => {
          await this.$store.dispatch("notification/set", [false, "", ""]);
        }, 5000);
      } else {
        this.cardObj.CardNumberLast4Digits = this.cardObj.CardNumber.slice(-4);
        this.cardObj.CardNumber = `************${this.cardObj.CardNumberLast4Digits}`;
        this.cardObj.CVC = new Array(this.cardObj.CVC.length + 1).join(`*`);
        this.cardInfoDisabled = true;
        this.$emit("update");
      }
      this.$store.dispatch("loading/setGlobal", false);
    },
    isPhoneNumber(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 32 && charCode !== 43 && charCode !== 45 && charCode !== 40 && charCode !== 41) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    async saveBillingInfo() {
      this.businessObj.ContactName = `${this.firstName} ${this.lastName}`;
      this.businessObj.ContactPhone = this.phoneNumber;
      this.$store.dispatch("loading/setGlobal", true);
      const resp = await updateBusiness(this.businessObj);
      if (resp.err) {
        this.$store.dispatch("notification/set", [true, resp.err.message, "danger"]);
        setTimeout(async () => {
          await this.$store.dispatch("notification/set", [false, "", ""]);
        }, 5000);
      } else {
        this.billingInfoDisabled = true;
      }
      this.$store.dispatch("loading/setGlobal", false);
    },
  },
  watch: {
    modalState() {
      this.currentSelectedState = this.modalState || "edit_card";
    },
    cardObj(old, newV) {
      console.log(newV);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper {
  border-radius: 10px !important;
  box-shadow: 0px 2px 40px -4px rgb(0 0 0 / 40%) !important;
  max-width: 720px !important;
}

.card-modal {
  background: $background-dark;
  &.dark {
    background-color: var(--bib-text);
  }

  &__header {
    // position: sticky;
    // top: 0;
    // z-index: 1;
    // box-shadow: 0px 2px 6px -2px rgba(0, 0, 0, 0.2);
    background: #ffd835;
    padding: 10px;
    text-align: center;
    font-size: 15px;
  }

  &__card-information {
    padding: 32px;

    img {
      width: auto;
      height: 50px;
    }

    // &--mastercard {
    //   background: linear-gradient(125deg, #eb001b, #f79e1b);
    // }

    // &--visa {
    //   background: linear-gradient(125deg, #faa61a, #00579f);
    // }

    // &--amex {
    //   background: linear-gradient(125deg, #eff07b, #dbdd5c);
    // }
  }

  &__billing-information form {
    padding: 2rem;
  }

  .link {
    text-decoration: underline;
    cursor: pointer;
  }
}
.card-modal__header {
  color: var(--bib-black) !important;
}
</style>
