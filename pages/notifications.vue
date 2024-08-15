<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <h2 class="font-w-600 font-heading-sm margin-left-40">{{ $t("common.notifications") }}</h2>
      </template>
    </content-header>

    <!-- CONTENT -->
    <div class="form__container">
      <!-- FORM -->
      <div :class="['form__container-content', {'dark': !lightThemeChecked}]">
        <!-- EMAI NOTIFICATIONS -->
        <div class="mt-2 pt-05 ">
          <div class="font-w-700 ml-2 mb-1">{{ $t("common.emailNotifications") }}</div>
          <div class="button-group">
            <bib-switch 
            variant="primary" 
            class="button-group__button font-md" 
            :checked="showNotificationEmail"
            @change="notificationEmailChange"
            >
            {{ $t("notifications.systemTransactionalAlerts") }}</bib-switch>
            <bib-switch 
            variant="primary" 
            class="button-group__button font-md" 
            :checked="showNewsletters" 
            @change="newslettersChange">
            {{ $t("notifications.weeklyNewsletter") }}
            </bib-switch>
            <!-- <bib-switch variant="primary-24" class="button-group__button font-md" :checked="false">{{ $t("notifications.promotionsOffers") }}</bib-switch> -->
          </div>
          <div class="separator mt-3"></div>
        </div>

        <!-- AUTHENTICATION -->
        <div class="pt-2 mb-3">
          <div class="font-w-700 ml-2 mb-1">{{ $t("common.smsNotifications") }}</div>
          <div class="button-group">
            <bib-switch 
            variant="primary" 
            class="button-group__button font-md" 
            :checked="showNotificationSms"
            @change="notificationSmsChange">
            {{ $t("notifications.systemTransactionalAlerts") }}
          </bib-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "home",
  props: ["global"],
  auth: false,
  data() {
    return {
      newsletters: false,
      notificationEmail: false,
      notificationSms: false,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {
    showNewsletters() {
      return this.newsletters
    },
    showNotificationEmail() {
      return this.notificationEmail
    },
    showNotificationSms() {
      return this.notificationSms
    },
  },
  watch: {
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  async created() {
    this.$store.dispatch('loading/set', true)
    const resp = await this.$store.dispatch('notification/getNotifications', { userId: this.$store.state.account.data.userId })
    if (resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      this.newsletters = resp.newsletters.insider
      this.notificationEmail = resp.notificationEmail
      this.notificationSms = resp.notificationSms
      this.$store.dispatch('notification/set_newsletters', resp.newsletters.insider)
      this.$store.dispatch('notification/set_notificationEmail', resp.notificationEmail)
      this.$store.dispatch('notification/set_notificationSms', resp.notificationSms)
    }
    this.$store.dispatch('loading/set', false)
  },
  mounted() {
    this.lightThemeChecked = this.$cookies.get('isLightTheme');
  },
  methods: {
    newslettersChange(){
      this.$store.dispatch('notification/set_newsletters', !this.newsletters)
      this.newsletters = !this.newsletters
      this.$store.dispatch('notification/updateNotifications', this.$store.state.account.data.userId)
    },
    notificationEmailChange(){
      this.$store.dispatch('notification/set_notificationEmail', !this.notificationEmail)
      this.notificationEmail = !this.notificationEmail
      this.$store.dispatch('notification/updateNotifications', this.$store.state.account.data.userId)
    },
    notificationSmsChange(){
      this.$store.dispatch('notification/set_notificationSms', !this.notificationSms)
      this.notificationSms = !this.notificationSms
      this.$store.dispatch('notification/updateNotifications', this.$store.state.account.data.userId)
    }
  },
};
</script>
<style lang="scss" scoped>
.form {
  &__container {
    @include flex-align;
    flex-direction: column;
    margin: 0 14px;

    &-content {
      flex-direction: column;

      margin: 30px 0;
      width: 100%;
      max-width: 720px;
      height: 100%;
      background: $background-dark;
      border-radius: 6px;

      &.dark {
        background-color: var(--bib-text);
        color: var(--bib-secondary);
        border: 1px solid var(--bib-border-primary);
      }

      .button-group {
        padding: 0 32px;
        margin-top: 20px;

        &__button {
          display: block;
          margin-bottom: 16px;
        }
      }

      .separator {
        width: 100%;
        height: 1px;
        background: rgba(120, 120, 120, 0.25);
      }
    }
  }
}
::v-deep {
  .form__container-content {
    &.dark {
      .button-group {
        .button-group__button {
          span {
            background-color: var(--bib-black);
            border: 1px solid var(--bib-border-primary);
          }
        }
      }
    }
  }
}
</style>
