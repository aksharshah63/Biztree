<template>
  <bib-modal-wrapper v-if="selectedPayment" @close="$emit('close')" @click:outside="$emit('close')" no-header size="xl">
    <!-- CARD -->
    <div class="card-modal">
      <div class="card-modal__header">
        <div class="grid-2 grid-gap-3 grid-break-800 w-100">
            <div class="grid-col-1">
              <bib-logo isLightTheme />
            </div>
            <div class="grid-col-1 d-flex">
              <div>
                <!-- <div class="font-w-700 font-lg mb-025">{{ $t("common.orderReceipt") }}</div>
                <div class="font-sm pl-025">{{ $t("common.orderId") }} {{ selectedPayment.OrderId }}</div> -->
              </div>
              <div class="right-menu ml-auto">
                <div class="d-flex align-center">
                  <div v-if="!isGenerating" class="icon-circle mr-025">
                    <bib-icon icon="align-bottom" variant="secondary" :scale="1.3" @click="generateReport"></bib-icon>
                  </div>
                  <span v-if="isGenerating" class="text-success mr-05"> {{ $t("common.loading") }} </span>
                  <div class="icon-circle icon-circle--background" @click="$emit('close')">
                    <bib-icon icon="close" variant="secondary" :scale="1.3"></bib-icon>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div class="card-modal__content">
        <div class="card-modal-body">
          <!-- row 1 -->
          <div class="grid-2 grid-gap-3 grid-break-800 mb-1">
            <div class="grid-col-1">
              <div class="font-w-700 mb-025">{{ $t("common.billingDate") }}</div>
              <div class="data-row">{{ selectedPayment.date }}</div>
            </div>
            <div class="grid-col-1">
              <div class="font-w-700 mb-025">{{ $t("common.orderId") }}</div>
              <div class="data-row">{{selectedPayment.OrderId}}</div>
            </div>
          </div>

          <!-- row 2 -->
          <div class="mb-1">
            <div class="font-w-700">{{ $t("common.orderDetails") }}</div>

            <table class="order-details-table">
              <tr class="data-row text-secondary">
                <td>{{ $t("common.item") }}</td>
                <td>{{ $t("common.users") }}</td>
                <td>{{ $t("common.price") }}</td>
                <td>{{ $t("common.total") }}</td>
              </tr>
              <tr class="data-row">
                <td>{{`Business In a Box (1-Year / ${users}-User)`}}</td>
                <td>{{users}}</td>
                <td>{{currencySign(selectedPayment.CurrencyCode) + price}}</td>
                <td>{{currencySign(selectedPayment.CurrencyCode) + selectedPayment.SubTotal}}</td>
              </tr>
              <tr class="data-row" v-show="selectedPayment.BillingCountryName == 'Canada' && isVisibleTax">
                <td></td>
                <td></td>
                <td class="text-secondary">GST/HST (865162085RT0001)</td>
                <td>{{currencySign(selectedPayment.CurrencyCode) + selectedPayment.TaxFed}}</td>
              </tr>
              <tr class="data-row" v-show="selectedPayment.BillingCountryName == 'Canada' && isVisibleTax">
                <td></td>
                <td></td>
                <td class="text-secondary">QST (1202236002TQ0001)</td>
                <td>{{currencySign(selectedPayment.CurrencyCode) + selectedPayment.TaxState}}</td>
              </tr>
              <tr class="data-row" v-show="selectedPayment.BillingCountryName == 'Canada' && isVisibleTax">
                <td></td>
                <td></td>
                <td class="text-secondary">{{ $t("common.taxShort") }} {{ $t("common.total") }}</td>
                <td>{{currencySign(selectedPayment.CurrencyCode) + taxTotal}}</td>
              </tr>
              <tr class="data-row">
                <td></td>
                <td></td>
                <td class="text-secondary">{{ $t("common.total") }} ({{selectedPayment.CurrencyCode}})</td>
                <td>{{currencySign(selectedPayment.CurrencyCode) + selectedPayment.Total}}</td>
              </tr>
            </table>
          </div>

          <!-- row 3 -->
          <div class="grid-2 grid-gap-3 grid-break-700 mb-1">
            <div class="grid-col-1">
              <div class="font-w-700 mb-05">{{ $t("common.billedBy") }}</div>
              <div class="data-row">Business In a Box</div>
              <div class="data-row">By Biztree Inc.</div>
              <div class="data-row">
                {{ $t("common.tollFree") }} (North America)
                <span class="text-primary">1-800-BIZTREE</span>
              </div>
              <div class="data-row">
                {{ $t("common.phone") }}
                <span class="text-primary">+1 (514) 768-4100</span>
              </div>
              <div class="data-row">
                {{ $t("common.email") }}
                <span class="text-primary">support@biztree.com</span>
              </div>
            </div>
            <div class="grid-col-1">
              <div class="font-w-700 mb-05">{{ $t("common.billedTo") }}</div>
              <div class="data-row">{{ selectedPayment.BillingName }}</div>
              <div class="data-row">
                {{ $t("common.country") }}
                <span class="text-primary">{{selectedPayment.BillingCountryName}}</span>
              </div>
              <div class="data-row">
                {{ $t("common.phone") }}
                <span class="text-primary">{{selectedPayment.BillingPhone}}</span>
              </div>
              <div class="data-row">
                {{ $t("common.email") }}
                <span class="text-primary">{{selectedPayment.BillingEmail}}</span>
              </div>
            </div>
          </div>

          <!-- row 4 -->
          <div class="mb-3">
            <div class="font-w-700 mb-05">{{ $t("common.paymentDetails") }}</div>
            <div class="data-row">
              {{ $t("common.date") }}
              <span>{{selectedPayment.date}} @ {{selectedPayment.time}}</span>
            </div>
            <div class="data-row">
              {{ $t("common.method") }}
              <span>{{selectedPayment.PaymentCardTypeName + selectedPayment.PaymentCardNumberMask}}</span>
            </div>
            <div class="data-row">
              {{ $t("common.reference") }} #
              <span>{{selectedPayment.PaymentTransactionId}}</span>
            </div>
            <div class="data-row">
              {{ $t("common.amount") }}
              <span>{{currencySign(selectedPayment.CurrencyCode) + selectedPayment.Total}}</span>
            </div>
            <div class="data-row">
              {{ $t("common.currency") }}
              <span>{{selectedPayment.CurrencyCode}}</span>
            </div>
          </div>
        </div>
        <VueHtml2pdf
          :show-layout="false"
          :float-layout="true"
          :preview-modal="true"
          :enable-download="true"
          :paginate-elements-by-height="1600"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          pdf-orientation="portrait"
          pdf-content-width="800px"
          :filename="fileName"
          @progress="onProgress($event)"
          ref="html2Pdf"
        >
          <section slot="pdf-content" class="pdf-content">
              <!-- PDF Content Here -->
              <div id="report_info">
              </div>
          </section>
        </VueHtml2pdf>
      </div>
    </div>
  </bib-modal-wrapper>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import { getTwoDecimal } from '@/assets/utils/index'
export default {
  components: {
    VueHtml2pdf
  },
  props: {
    selectedPayment: Object
  },
  data() {
    return {
      users: 1,
      price: this.selectedPayment && this.selectedPayment.SubTotal || 0,
      taxTotal: 0,
      isGenerating: false
    };
  },
  computed: {
    isVisibleTax() {
      return this.selectedPayment.TaxFed !== '0.00' || this.selectedPayment.TaxState !== '0.00'
    },
    billingFullAddress() {
      if (this.selectedPayment) {
        const address1 = this.selectedPayment.BillingAddressL1 && `${this.selectedPayment.BillingAddressL1} ` || ''
        const address2 = this.selectedPayment.BillingAddressL2 && `${this.selectedPayment.BillingAddressL2}, ` || ''
        return address1 + address2 + this.selectedPayment.BillingCity + ' ' + this.selectedPayment.BillingStateProvince + ' ' + this.selectedPayment.BillingZipPostalCode
      }
    },
    fileName() {
      return this.selectedPayment && `Biztree Invoice - ${this.selectedPayment.OrderId}` || ''
    }
  },
  created() {
    const pArray = this.selectedPayment && this.selectedPayment.ProductSku && this.selectedPayment.ProductSku.split('-') || []
    const uItem = pArray.slice(-1)[0]
    if (uItem) {
      this.users = parseInt(uItem.slice(-1) === 'U' && uItem.slice(0, -1) || uItem)
    }
    this.price = getTwoDecimal(this.price / this.users)
    for (let key in this.selectedPayment) {
      if (key !== 'ID' && key !== 'UserID')
      this.selectedPayment[key] = getTwoDecimal(this.selectedPayment[key])
    }
    this.taxTotal = this.selectedPayment ? getTwoDecimal(Number(this.selectedPayment.TaxFed) + Number(this.selectedPayment.TaxState)) : 0
    this.selectedPayment.TaxFed = getTwoDecimal(Number(this.selectedPayment.TaxFed))
    this.selectedPayment.TaxState = getTwoDecimal(Number(this.selectedPayment.TaxState))
  },
  mounted() {},
  methods: {
    currencySign(CurrencyCode) {
      switch(CurrencyCode) {
        case 'EUR':
          return '€'
        case 'GBP':
          return '£'
        case 'CAD':
          return '$'
        case 'USD':
          return '$'
        default:
          return '$'
      }
    },
    generateReport() {
      this.isGenerating = true
      setTimeout(() => {
        const style = `<style>
          .pdf-content .right-menu {
            display: none;
          }
        </style>`
        document.getElementById('report_info').innerHTML = style + document.getElementsByClassName('modal__wrapper__default')[0].innerHTML
        this.$nextTick(() => {
          this.$refs.html2Pdf.generatePdf();
        });
      }, 100)
    },
    onProgress(progress) {
      if (progress === 100) this.isGenerating = false
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper {
  border-radius: 16px !important;
  box-shadow: 0px 2px 40px -4px rgb(0 0 0 / 40%) !important;
  max-width: 60rem !important;
}

.card-modal {
  background: $background;
  padding: 1.5rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid rgba(120, 120, 120, 0.2);
  }

  &__content {
    .data-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $base-size;
      padding: 0.4rem 5px;
      border-bottom: 1px solid rgba(120, 120, 120, 0.2);
    }

    .order-details-table {
      width: 100%;
      font-size: $base-size;

      td {
        text-align: right;

        &:nth-child(1) {
          text-align: left;
          width: 40%;
        }

        &:nth-child(2) {
          width: 10%;
        }

        &:nth-child(3) {
          width: 35%;
        }

        &:nth-child(4) {
          width: 15%;
          padding-left: 10px;
        }
      }
    }
  }

  .link {
    text-decoration: underline;
    cursor: pointer;
  }
}
.pdf-content {
  width: 100%;
  background: #fff;

  #report-info {
    display: flex;
    padding: 20px;
    padding-bottom: 0px;
  }
}
</style>