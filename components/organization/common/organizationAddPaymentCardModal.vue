<template>
    <bib-modal-wrapper no-header>
      <form @submit.prevent class="p-2">
        <div slot="content" class="dialog-content">
          <!-- <div class="custom-close">
            <bib-icon
              variant="gray4"
              class="cursor-pointer"
              :scale="1.5"
              icon="close"
              @click="$emit('close')"
            ></bib-icon>
          </div> -->
          <div>
              <bib-input
                type="text"
                v-model="paymentDataNew.ccnumber"
                :variant="lightThemeChecked ? 'light' : 'dark'"
                :label="$t('common.cardNumber')"
                required
              ></bib-input>
              
              <bib-input
                type="text"
                v-model="paymentDataNew.ccnameoncard"
                :variant="lightThemeChecked ? 'light' : 'dark'"
                :label="$t('common.nameOnCard')"
                class="mt-025"
                required
              ></bib-input>
              <div class="grid-3 grid-gap-3 grid-break-600 mt-025">
                <div class="grid-col-1">
                  <label for="">
                    {{$t('common.expirationMonth')}}
                  </label>
                </div>
                <div class="grid-col-1">
                  <label for="">
                    {{$t('common.expirationYear')}}
                  </label>
                </div>
                <div class="grid-col-1">
                  <label for="">
                    {{$t('common.cardCvc')}}
                  </label>
                </div>
              </div>
              <div class="grid-3 grid-gap-3 grid-break-600 mt-025">
                <bib-input
                  class="grid-col-1"
                  v-model="paymentDataNew.ccexpmonth"
                  type="select"
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                  :options="expirationMonths"
                  required
                ></bib-input>
                <bib-input
                  class="grid-col-1"
                  v-model="paymentDataNew.ccexpyear"
                  type="select"
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                  :options="expirationYears"
                  required
                ></bib-input>
                 <bib-input
                  class="grid-col-1"
                  type="text"
                  v-model="paymentDataNew.cvv"
                  required
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                ></bib-input>
              </div>

              <div class="grid-1 grid-gap-1 grid-break-600 mt-025">
                <bib-input
                  class="grid-col-1"
                  :options="countries"
                  @input="defaultSet"
                  type="select"
                  v-model="paymentDataNew.country"
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                  :label="$t('common.country')"
                ></bib-input>
              </div>

              <div class="grid-1 grid-gap-1 grid-break-600 mt-025">
                <bib-input
                  v-if="paymentDataNew.country == 840"
                  class="grid-col-1"
                  :options="states"
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                  type="select"
                  v-model="paymentDataNew.state"
                  :label="$t('common.state')"
                ></bib-input>
                <bib-input
                  v-if="paymentDataNew.country == 124"
                  class="grid-col-1"
                  :options="provinces"
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                  type="select"
                  v-model="paymentDataNew.state"
                  :label="$t('common.state')"
                ></bib-input>
                <bib-input
                  v-if="paymentDataNew.country != 124 && paymentDataNew.country != 840"
                  class="grid-col-1"
                  type="text"
                  placeholder="Type your State or Province"
                  v-model="paymentDataNew.state"
                  :variant="lightThemeChecked ? 'light' : 'dark'"
                  :label="$t('common.state')"
                ></bib-input>
              </div>
          </div>
        </div>
        <div class="align-center justify-between mt-1" slot="footer">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
          <bib-button type="submit" size="lg" :label="$t('common.save')" variant="primary-24" pill @click="handleSubmit" :disabled="isSaveDisabled"></bib-button>
        </div>
      </form>
    </bib-modal-wrapper>
</template>

<script>
import { changeAutoRenewal, updateCard, updateBusiness } from "~/model/business";
import { creditCardTypeDetector } from "@/assets/utils/creditCardTypeDetector";
import { countries } from "@/assets/utils/locations";
import { states } from "@/assets/utils/locations";
export default {
  props: ["businessData", "lightThemeChecked"],
  data() {
    return {
      paymentDataNew: {
        ccnameoncard: "",
        ccnumber: "",
        ccexpmonth: "",
        ccexpyear: "",
        cvv: "",
        country: "124", // default for Canada
        state: '',
        cctype: "",
      },
      businessObj: this.businessData,
      countries: [],
      states:[],
      provinces:[],
      expirationMonths: [
        { label: "--", value: null },
      ],
      expirationYears: [
        { label: "--", value: null },
      ],
    }
  },
  computed: {
    isSaveDisabled() {
      return !this.paymentDataNew.ccnumber || !this.paymentDataNew.ccnameoncard || !this.paymentDataNew.ccexpmonth || !this.paymentDataNew.ccexpyear || !this.paymentDataNew.cvv || !this.paymentDataNew.country || (!this.paymentDataNew.state && (this.paymentDataNew.country == '124' || this.paymentDataNew.country == '840'))
    }
  },
  created() {
    Array.from(Array(12).keys()).forEach(e => {
      this.expirationMonths.push({
        label: e + 1,
        value: e < 9 ? `0${e + 1}` : (e + 1).toString()
      })
    })
    Array.from(Array(21).keys()).forEach(e => {
      this.expirationYears.push({
        label: e + 2023,
        value: (e + 23).toString()
      })
    })
    this.countries = countries.map(e => {
      return {
        label: e.name,
        value: e.id,
      }
    })
    this.countries.unshift({
      label: this.$t("common.select"),
      value: null,
    })
    this.provinces = states['124'].map(e => {
      return {
        label: e.name,
        value: e.name,
        region: e.regionIso2
      }
    })
    this.provinces.unshift({
      label: this.$t("common.select"),
      value: null,
    })
    this.states = states['840'].map(e => {
      return {
        label: e.name,
        value: e.name,
        region: e.regionIso2
      }
    })
    this.states.unshift({
      label: this.$t("common.select"),
      value: null,
    })
  },
  mounted() {
    const country = this.businessData.Country
    this.paymentDataNew.country = country && this.countries.filter(e => e.label === country)[0].value || null
    this.paymentDataNew.state = this.businessData.StateProvince ? this.businessData.StateProvince : ''
  },
  methods: {
    defaultSet() {
      if (this.paymentDataNew.country === 840 ) {
        this.paymentDataNew.state = states[0].value;
      } else if (this.paymentDataNew.country === 124) {
        this.paymentDataNew.state = this.provinces[0].value;
      } else {
        this.paymentDataNew = Object.assign({}, {...this.paymentDataNew, state: null})
      }
    },
    creditCardDetect() {
      const card = creditCardTypeDetector(this.paymentDataNew.ccnumber);
      this.paymentDataNew.cctype = card.code;
    },
    handleSubmit () {
      this.creditCardDetect();
      if (
        this.paymentDataNew.ccnumber &&
        this.paymentDataNew.ccnameoncard &&
        this.paymentDataNew.ccexpmonth &&
        this.paymentDataNew.ccexpyear &&
        this.paymentDataNew.cvv
      ) {
        const cardData = {
          CardType: this.paymentDataNew.cctype,
          CardNumber: this.paymentDataNew.ccnumber,
          ExpMonth: this.paymentDataNew.ccexpmonth,
          ExpYear: this.paymentDataNew.ccexpyear,
          NameOnCard: this.paymentDataNew.ccnameoncard,
          CVC: this.paymentDataNew.cvv,
        }
        this.addCard(cardData)
      }
    },
    async addCard (cardData) {
      cardData.BusinessId = this.$store.state.account.data.businessId
      this.$store.dispatch('loading/setGlobal', true)
      this.businessObj.Country = this.countries.filter(e => e.value == this.paymentDataNew.country)[0].label
      this.businessObj.StateProvince = this.paymentDataNew.state
      await updateBusiness(this.businessObj)
      const resp = await updateCard(cardData)
      this.$store.dispatch('loading/setGlobal', false)
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        const resp1 = await changeAutoRenewal({ Id: this.$store.state.account.data.businessId, AutoRenewal: 1 })
        if (resp1.err) {
          this.$store.dispatch('notification/set', [true, resp1.err.message, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          await this.$store.dispatch('business/set_AutoRenewal', 1)
          this.$emit('callback', cardData)
        }
      }      
    },
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  position: relative;
  .custom-close {
    position: absolute;
    top: -1rem;
    right: -1.2rem;
  }
}
.grid-col-1 {
  label {
    color: var(--bib-gray6);
  }
}
</style>
