<template>
  <div :class="['main-container', { 'dark': !isLightTheme }]">
    <div class="main-container__content">
      <div :class="isAdmin ? 'grid-2 grid-gap-4 grid-break-800' : ''">
        <div v-if="isAdmin" class="grid-1 grid-col-1 grid-gap-4">
          <div class="bussiness-in-a-box grid-col-1">
            <img class="biztree-img" :src="`/img/BIB-BLUE.png`" />
            <div class="balance-container">
              <span class="balance-label">Current balance</span>
              <br />
              <span class="balance">${{ parseFloat(referralDetail?.CommissionAmount || 0).toFixed(2) }}</span>
            </div>
            <div class="container-bottom ">
              <span class="referrer-id">Referrer id: {{ referralDetail?.RefId || "-" }}</span>
              <br />
              <span class="valid-month">
                {{
                  transactions?.length ? `Valid until ${$moment(referralDetail?.Expire)?.format('MMM YYYY')}` : ''
                }}</span>
            </div>
          </div>
          <div class="grid-col-1" :class="['right-container', { 'dark': !isLightTheme }]">
            <div class="mb-1">
              <span class="referral-link-label">Latest Transactions</span>
            </div>
            <div class="transaction-history-container" :class="[{ 'dark': !isLightTheme }]">
              <div class="justify-center mt-5" v-if="transactions?.length === 0">
                <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">No transactions available</span>
              </div>
              <div v-else>
                <div v-for="(trs, index) in transactions" :key="index" class="transaction-content" :class="[{ 'dark': !isLightTheme }]">
                  <div class="justify-start">
                    <div class="ml-05">
                      <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">
                        {{
                          $moment(new Date(trs.createdAt)).format('DD-MM-YYYY')
                        }} - {{
                          $moment(new Date(trs.createdAt), 'HH:mm').format('hh:mm A')
                        }}</span>
                    </div>
                  </div>
                  <div class="text-ellipsis ml-05" style="max-width: 40%; min-width: 40%;">
                    <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">{{
                      trs?.ReferredUser?.User?.UserDetails?.FirstName + " " + trs?.ReferredUser?.User?.UserDetails?.LastName
                      }}</span>
                  </div>
                  <div class="mr-05 justify-end" style="max-width: 10%; min-width: 10%;">
                    <span class="transaction-text" :class="[{ 'dark': !isLightTheme }]">${{ parseFloat(trs?.CommissionAmount).toFixed(2) }}</span>
                  </div>
                  <div class="justify-center" style="max-width: 5%; min-width: 5%;">
                    <!-- <bib-icon icon="elipsis" variant="black"></bib-icon> -->
                    <bib-button pop="horizontal-dots" :class="[{ 'dark-dots': !isLightTheme }]">
                      <template v-slot:menu>
                        <div class="list" :class="!isLightTheme? 'view-dark':'view-light'">
                          <span class="list__item" @click.stop="handleAction_Table(trs)">View</span>
                        </div>
                      </template>
                    </bib-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="isAdmin ? 'grid-1 grid-col-1 grid-gap-4' : 'grid-1 w-70 mx-2'">
          <div class="grid-col-1" :class="['right-container', { 'dark': !isLightTheme }]">
            <span class="referral-link-label">How to Earn</span>
            <br />
            <span v-if="isAdmin" class="referral-link-text">Copy the referral link, share it with friends and colleagues, and earn a {{ referralDetail?.CommissionRate || "10" }}% commission.</span>
            <span v-if="!isAdmin" class="referral-link-text">Copy the referral link, share it with friends and colleagues, and start earning commissions.</span>
          </div>
          <div class="grid-col-1" :class="['right-container', { 'dark': !isLightTheme }]">
            <span class="referral-link-label">Referral link</span>
            <br />
            <span class="referral-link-text">Copy the referral link, share it with friends and colleagues, and start earning rewards!</span>
            <div class="container-bottom mt-1">
              <bib-input :variant="isLightTheme ? 'light' : 'dark'" type="text" placeholder="http://dev.account.business-in-a-box.com/dev/internal/create-account" size="md" :value="referralLink" disabled class="mr-05"></bib-input>
              <bib-button @click="copyToClipboard" label="Copy" style="padding: 0.65rem 1rem;" variant="primary" icon="link"></bib-button>
            </div>
          </div>
          <div class="grid-col-1" :class="['right-container', { 'dark': !isLightTheme }]">
            <span class="referral-link-label">Email referral</span>
            <br />
            <span class="referral-link-text">Enter the email address of a person that you would like to refer and press send.
            </span>
            <div class="container-bottom mt-1">
              <bib-input :variant="isLightTheme ? 'light' : 'dark'" v-model="email" type="text" placeholder="Enter email address" size="md" class="mr-05" @keyup.enter="inviteByEmail()"></bib-input>
              <bib-button style="padding: 0.65rem 1rem;" label="Send" variant="primary" icon="mail-solid" @click="inviteByEmail()"></bib-button>
            </div>
          </div>
          <div class="grid-col-1"></div>
          <div class="grid-col-1"></div>
        </div>
      </div>
    </div>
    <organization-transaction-details-modal :data="selectedTransactionData" :show="showTransactionDetailsModal" @close="handleClickOutsideTransaction" :isLightTheme="isLightTheme">
    </organization-transaction-details-modal>
  </div>
</template>

<script>
import { referralDetails, transactionsData, inviteByEmailAddress, updateTransactionData } from "../model/referrals";

export default {
  layout: "home",
  props: ["global", "isLightTheme"],
  data() {
    return {
      referralDetail: {},
      referralLink: "",
      email: "",
      orgMembers: [],
      businessData: null,
      selectedUser: null,
      isOpenNoSeatsModal: false,
      inviteTeamMemberModal: false,
      userDetailsModal: null,
      isOpenConfirmModal: false,
      isUserEditModal: false,
      isOpenUpgradePlanModal: false,
      bibUpgradeLicenseUrl: process.env.BIB_UPGRADE_LICENSE_URL,
      bibUpgradeLicenseUrlTrial: `${process.env.BIB_UPGRADE_LICENSE_URL_TRIAL}/?lang=${this.$i18n.locale}`,
      transactions: [],
      showTransactionDetailsModal: null,
      selectedTransactionData: {},
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === "ADMIN";
    },
    countTotalMembers() {
      return this.orgMembers.length;
    },
    countPendingMembers() {
      return this.orgMembers.filter((e) => e.Status === "PENDING").length;
    },
    countSeatsAvailable() {
      return (
        (this.businessData &&
          this.businessData.BibLicenseNumberOfUsers - this.orgMembers.length) ||
        0
      );
    },
    isSubscriptionExpired() {
      return (
        this.businessData &&
        Date.parse(this.businessData.BibLicenseExpiration) < Date.now()
      );
    },
    isMobileView() {
      return this.$store.state.ui.windowSize.width < 600;
    },
  },
  async created() {
    try {
      this.$store.dispatch('loading/set', true)
      const resp = await referralDetails()
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      } else {
        this.referralDetail = resp;
        this.referralLink = `http://dev.account.business-in-a-box.com/login/?RefId=${resp?.RefId}&state=register&Source=Referral link`
      }
      const res = await transactionsData()
      this.transactions = res;
      this.$store.dispatch('loading/set', false)
    } catch (error) {
      console.log("error", error);
    }
  },
  mounted() {
  },
  methods: {
    handleClickOutsideTransaction() {
      if (this.showTransactionDetailsModal) this.showTransactionDetailsModal = false;
    },
    handleItemClick_Table(item) {
      console.log('table item clicked:', item)
    },
    handleAction_Table(data) {
      data.id = data._id
      this.selectedTransactionData = { value: data }
      this.showTransactionDetailsModal = true;
    },
    async getUserReferralDetails() {
      const resp = await referralDetails()
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        return resp[0]
      }
    },

    async handleImportant(index) {
      this.transactions[index].Important = !this.transactions[index].Important;
      this.transactions = [...this.transactions];
      var res = await updateTransactionData(this.transactions[index]._id, { Important: this.transactions[index].Important });
    },
    async copyToClipboard() {
      // Create a temporary textarea element
      var textarea = document.createElement("textarea");

      // Set the value of the textarea to the specified text
      textarea.value = this.referralLink;

      // Make sure to make the textarea out of the viewport to ensure it's not visible
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";

      // Append the textarea to the document body
      document.body.appendChild(textarea);

      // Select the text inside the textarea
      textarea.select();

      try {
        // Copy the selected text to the clipboard
        var successful = document.execCommand("copy");
        var message = successful ? "Referral link copied to clipboard." : "Unable to copy referral link!";
        await this.$store.dispatch('notification/set', [true, message, 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } catch (error) {
        console.error("Failed to copy:", error);
      }

      // Remove the temporary textarea from the document body
      document.body.removeChild(textarea);
    },
    async inviteByEmail() {
      try {
        if (this?.email?.trim()) {
          var emailArray = this?.email.split(";");
          const validEmails = emailArray.map(email => email.trim()).filter((email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
          });

          console.log("validEmails", validEmails);

          if (validEmails?.length === emailArray?.length) {
            emailArray.forEach(async email => {
              console.log('Processing email:', email?.trim());
              var res = await inviteByEmailAddress({ email: email?.trim() })
            });
            await this.$store.dispatch('notification/set', [true, "Email sent successfully", 'success'])
            this.email = ""
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          } else {

            const invalidEmails = emailArray.map(email => email.trim()).filter((email) => {
              const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return !re.test(email);
            });

            await this.$store.dispatch('notification/set', [true, `Invalid email '${invalidEmails?.join(", ")}'`, 'danger'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
        }
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    },

    formatTime(date) {
      date = new Date(date);
      // Get hours and minutes from the date
      let hours = date.getHours();
      let minutes = date.getMinutes();

      // Pad the hours and minutes with a leading zero if necessary
      let formattedHours = hours.toString().padStart(2, '0');
      let formattedMinutes = minutes.toString().padStart(2, '0');

      // Combine the formatted hours and minutes into hh:mm format
      return `${formattedHours}:${formattedMinutes}`;
    }

  },
};
</script>

<style lang="scss" scoped>
.main-container {
  @include flex-justify;
  width: 100%;
  height: 100vh;
  padding: 32px 1.5rem;

  &__content {
    width: inherit;
  }

  &.dark {
    background-color: var(--bib-black);
    color: var(--bib-secondary);
    // border: 1px solid var(--bib-border-primary);
  }
}

.bussiness-in-a-box {
  padding: 16px;
  height: 300px;
  background: radial-gradient(circle at 0% 0%, rgba(248, 248, 249, 1) 45%, rgba(7, 65, 163, 1) 75%), url('/img/blend.png') no-repeat;
  font-size: 15px;
  border-radius: 8px;
  background-size: contain;
  background-blend-mode: multiply;
  background-position: center;

}

.container-bottom {
  @include flex-align;
  @include flex-justify(space-between);
}

.referrer-id {
  color: #0741A3;
}

.valid-month {
  color: #FFFFFF;
}

.biztree-img {
  width: 257px;
  height: auto;
}

.icon-img {
  width: 30px;
  height: 30px;
}

.balance-container {
  text-align: end;
  margin-top: 25px;
  margin-bottom: 80px;
}

.balance-label {
  font-weight: bold;
  color: rgb(255, 255, 255);
}

.referral-link-label {
  font-weight: bold;
}

.referral-link-text {
  font-size: small;
}

.balance {
  font-weight: bold;
  color: rgb(255, 255, 255);
  font-size: -webkit-xxx-large;
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

.social-media-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 16px;
}


.team-card__dot-menu {
  position: absolute !important;
  top: 8px;
  right: 8px;

  &:hover {
    border-radius: 100px;
    background: $background-dark;
  }
}

.transaction-history-container {
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #F1F1F1;
  min-height: 220px;
  max-height: 220px;
  overflow: auto;

  &.dark {
    background-color: var(--bib-text);
    border: 1px solid #343437;
  }
}

.transaction-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0px;
  border-bottom: 1px solid #F1F1F1;
  cursor: pointer;

  &.dark {
    border-bottom: 1px solid #343437;
  }
}

.transaction-text {
  font-weight: 400;
  font-size: 14px;
  line-height: 16.94px;
  color: #1D1D20;

  &.dark {
    color: var(--bib-light);
  }
}


.transaction-text-time {
  color: #8D8D8F;
}

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
}
</style>