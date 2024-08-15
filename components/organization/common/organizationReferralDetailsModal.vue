<template>
  <div class="panel" :class="show !== null ? show ? (!isLightTheme ? 'panel-open dark' : 'panel-open') : 'panel-off' : ''" v-click-outside="() => $emit('close')">
    <content-header :style="(!isLightTheme ? 'background-color: var(--bib-black);' : '')">
      <template slot="bottom-left">
        <div style="display: flex;justify-content: space-between;width: 450px;">
          <div class="align-center">
            <div class="ml-1">
              <bib-avatar v-if="data?.value?.UserDetails?.Photo" :src="data?.value?.UserDetails?.Photo" size="2rem" />
              <bib-avatar v-if="!data?.value?.UserDetails?.Photo" class="mt-auto mb-auto mr-1" shape="circle" size="2rem"></bib-avatar>
            </div>
            <h2 class="font-w-600 font-heading-sm ml-05">{{ data?.value?.UserDetails?.FirstName + ' ' + data?.value?.UserDetails?.LastName }}</h2>
          </div>
          <div class="mt-auto mb-auto mr-1 cross-btn" @click="$emit('close')">
            <bib-icon class="cursor-pointer" icon="close" :scale="1.5" variant="gray4">
            </bib-icon>
          </div>
        </div>
      </template>
    </content-header>


    <div :class="['main-container', { 'dark': !isLightTheme }]">
      <div class="main-container__content">
        <div :class="['right-container', { 'dark': !isLightTheme }]">
          <div class="justify-between">
            <div style="min-width: 50%;">
              <span class="label">Referrer ID</span>
              <br />
              <span class="value">{{ data?.value?.RefId }}</span>
            </div>
            <div style="min-width: 50%;">
              <span class="label">Status</span>
              <br />
              <span class="value" :style="data?.value?.Status ? { color: 'green' } : { color: 'gray' }"> {{ data?.value?.Status ? "Active" : "Inactive" }}</span>
            </div>
          </div>
          <div class="mt-1">
            <span class="label">Referrer Name</span>
            <br />
            <span class="value">{{ data?.value?.UserDetails?.FirstName + ' ' + data?.value?.UserDetails?.LastName }}</span>
          </div>

          <div class="justify-between mt-1">
            <div class="text-ellipsis pr-05" style="min-width: 50%;">
              <span class="label">Referrer Email</span>
              <br />
              <span class="value" :title="data?.value?.UserDetails?.Email">{{ data?.value?.UserDetails?.Email || "-" }}</span>
            </div>
            <div style="min-width: 50%;">
              <span class="label">Referrer Mobile</span>
              <br />
              <span class="value">{{ data?.value?.UserDetails?.Phone }}</span>
            </div>
          </div>
        </div>

        <div :class="['right-container', { 'dark': !isLightTheme }]" class="mt-1">
          <div class="justify-between ">
            <div style="min-width: 33%;">
              <span class="label">Referrals</span>
              <br />
              <span class="value">{{ data?.value?.Referrals }}</span>
            </div>
            <div style="min-width: 33%;">
              <span class="label">Leads</span>
              <br />
              <span class="value">{{ data?.value?.Lead }}</span>
            </div>
            <div style="min-width: 33%;">
              <span class="label">Sales</span>
              <br />
              <span class="value">{{ data?.value?.Sales }}</span>
            </div>
          </div>
          <div class="justify-between mt-1">
            <div style="min-width: 50%;">
              <span class="label">Commission amount</span>
              <br />
              <span class="value">${{ parseFloat(data?.value?.CommissionAmount).toFixed(2) || "0" }}</span>
            </div>
          </div>

          <div class="grid-col-1 mt-1">
            <div class="mb-1">
              <span class="referral-link-label">Transaction history</span>
            </div>
            <div class="transaction-history-container" :class="[{ 'dark': !isLightTheme }]">
              <div class="justify-center mt-5" v-if="transactions?.length === 0">
                <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">No transactions available</span>
              </div>
              <div v-else>
                <div v-for="(trs, index) in transactions" :key="index" class="transaction-content" :class="[{ 'dark': !isLightTheme }]">
                  <div class="justify-start">
                    <div>
                      <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">
                        {{ $moment(new Date(trs.createdAt)).format('DD-MM-YYYY') }}</span>
                    </div>
                  </div>
                  <div class="text-ellipsis" style="max-width: 40%; min-width: 40%;">
                    <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">{{ trs?.ReferredUser?.NewUser?.UserDetails?.FirstName + " " + trs?.ReferredUser?.NewUser?.UserDetails?.LastName }}</span>
                  </div>
                  <div class="justify-end" style="max-width: 10%; min-width: 10%;">
                    <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">${{ parseFloat(trs?.CommissionAmount).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { getUsersTransactions } from "../../../model/referrals";
export default {
  props: ["data", "show", "isLightTheme"],
  data() {
    return {
      transactions: []
    };
  },
  methods: {
    async getTransactionsData(UserId) {
      const resp = await getUsersTransactions({ UserId })
      this.transactions = resp;
    }
  },
  computed: {
  },
  created() {
  },
  watch: {
    'data.value.UserId': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.transactions = [];
          this.getTransactionsData(newVal);
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.data?.value?.UserId) {
      this.getTransactionsData(this.data.value.UserId);
    }
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  @include flex-justify;
  width: 100%;
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 60px);

  &.dark {
    background-color: var(--bib-black);
    color: var(--bib-light);
    border: 1px solid var(--bib-border-primary);
    border-bottom: none;
  }

  &__content {
    width: inherit;
  }
}

.label {
  font-weight: bolder;
  color: #85858F;
  font-size: 12px;
}

.value {
  font-size: 14px;
}

.right-container {
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;

  &.dark {
    background-color: var(--bib-text);
    color: var(--bib-light);
    border: 1px solid var(--bib-border-primary);
  }
}

.referral-link-label {
  font-weight: bold;
}

.transaction-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 0px;
  border-bottom: 1px solid #F1F1F1;

  &.dark {
    border-bottom: 1px solid #343437;
  }
}

.transaction-history-container {
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #F1F1F1;
  min-height: 220px;
  max-height: 220px;
  width: 100%;
  padding: 5px 0px;
  overflow: hidden;

  &.dark {
    background-color: var(--bib-text);
    border: 1px solid #343437;
  }
}

.transaction-text {
  font-weight: 400;
  font-size: 12px;
  line-height: 16.94px;
  color: #1D1D20;

  &.dark {
    color: var(--bib-light);
  }
}

.transaction-title {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 150px;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.transaction-title .transaction-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-text-time {
  color: #8D8D8F;
}



/* Styles for the panel */
.panel {
  // margin-top: 64px;
  position: fixed;
  top: 0;
  right: -450px;
  width: 450px;
  height: 100vh;
  background-color: white;
  box-shadow: -1px 0 3px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease;
  z-index: 999;
  /* Animation duration and easing */
}




/* When the panel is open */
.panel-open {
  right: 0;
  animation: slideIn 0.8s forwards;

  &.dark {
    background-color: var(--bib-black);
  }
}

.panel-off {
  right: -450px;
  animation: slideOut 0.8s backwards;
}

.cross-btn {
  padding-top: 5px;
  height: 32px;
  cursor: pointer;
}

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@keyframes slideIn {
  from {
    right: -450px;
  }

  to {
    right: 0;
  }
}

@keyframes slideOut {
  from {
    right: 0;
  }

  to {
    right: -450px;
  }
}
</style>
