<template>
  <div class="panel" :class="show !== null ? show ? (!isLightTheme ? 'panel-open dark' : 'panel-open') : 'panel-off' : ''" v-click-outside="() => $emit('close')">
    <content-header :style="(!isLightTheme ? 'background-color: var(--bib-black);' : '')">
      <template slot="bottom-left">
        <div style="display:flex;justify-content: space-between;width: 450px;">
          <div class="align-center">
            <h2 class="font-w-600 font-heading-sm ml-1">Transaction</h2>
          </div>
          <div class="mt-auto mb-auto mr-1 cross-btn" @click="$emit('close')">
            <bib-icon class="cursor-pointer" icon="close" :scale="1.5" variant="gray4">
            </bib-icon>
          </div>
        </div>
      </template>
    </content-header>

    <div :class="['main-container', { 'dark': !isLightTheme }]">
      <div :class="['main-container__content', { 'dark': !isLightTheme }]">
        <div>
          <span class="label">Transaction Date/Time</span>
          <br />
          <span class="value">
            {{ $moment(new Date(data?.value?.createdAt)).format('DD-MM-YYYY') }} - {{ $moment(new Date(data?.value?.createdAt), 'HH:mm').format('hh:mm A') }}</span>
        </div>
        <div class=" mt-1">
          <div>
            <span class="label">Transaction ID</span>
            <br />
            <span class="value">{{ data?.value?._id }}</span>
          </div>
        </div>
        <div class="justify-between mt-1">
          <div style="min-width: 50%;">
            <span class="label">Referrer ID</span>
            <br />
            <span class="value">{{ data?.value?.ReferralId }}</span>
          </div>
          <div style="min-width: 50%;">
            <span class="label">Referrer Name</span>
            <br />
            <span class="value">
              {{ data?.value?.ReferredUser?.User?.UserDetails?.FirstName + " " + data?.value?.ReferredUser?.User?.UserDetails?.LastName }}
              <!-- {{ data?.value?.ReferredUser?.NewUser?.UserDetails?.FirstName + " " + data?.value?.ReferredUser?.NewUser?.UserDetails?.LastName }} -->
            </span>
          </div>
        </div>
        <div class="mt-1">
          <span class="label">Source</span>
          <br />
          <span class="value">{{ data?.value?.ReferredUser?.NewUser?.Source || "-" }}</span>
        </div>
        <hr class="my-2" :style="(!isLightTheme ? 'border: 0.1px solid #343437;' : '')">
        <div class="justify-between mt-1">
          <div style="min-width: 50%;">
            <span class="label">Commission amount</span>
            <br />
            <span class="value">${{ parseFloat(data?.value?.CommissionAmount).toFixed(2) }}</span>
          </div>
          <div style="min-width: 50%;">
            <span class="label">Payout Status</span>
            <br />
            <span class="value">{{ data?.value?.Status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data", "show", "isLightTheme"],
  data() {
    return {
    };
  },
  methods: {},
  computed: {},
  created() { },
  mounted() { },
};
</script>

<style lang="scss" scoped>
.main-container {
  @include flex-justify;
  width: 100%;
  padding: 20px;
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

.main-container__content {
  width: inherit;
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;

  &.dark {
    background-color: var(--bib-text);
    color: var(--bib-light);
    border: 1px solid var(--bib-border-primary);
  }
}

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

@keyframes slideIn {
  from {
    right: -450px;
  }

  to {
    right: 0;
  }
}

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 20px;
}

.hr-border {
  border: 0.1px solid #343437;
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
