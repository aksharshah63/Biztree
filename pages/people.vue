<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <div class="align-center">
          <h2 class="font-w-600 font-heading-sm margin-left-40">{{ $t("common.people") }}</h2>
          <!-- hide in mobile view -->
          <div v-show="!isMobileView" class="ml-2">
            <span v-show="countPendingMembers > 0" class="font-md">
              <span v-show="countTotalMembers > 1 && countSeatsAvailable !== 1">
                {{ $t("people.countDetailText", { totalMembers: countTotalMembers, pendingInvites: countPendingMembers, seatsAvailable: countSeatsAvailable }) }}
              </span>
              <span v-show="countTotalMembers === 1 && countSeatsAvailable !== 1">
                {{ $t("people.countDetailTextSingleMember", { pendingInvites: countPendingMembers, seatsAvailable: countSeatsAvailable }) }}
              </span>
              <span v-show="countTotalMembers > 1 && countSeatsAvailable === 1">
                {{ $t("people.countDetailTextSingleSeat", { totalMembers: countTotalMembers, pendingInvites: countPendingMembers }) }}
              </span>
              <span v-show="countTotalMembers === 1 && countSeatsAvailable === 1">
                {{ $t("people.countDetailTextSingleMemberSingleSeat", { pendingInvites: countPendingMembers }) }}
              </span>
            </span>
            <span v-show="countPendingMembers === 0" class="font-md">
              <span v-show="countTotalMembers > 1 && countSeatsAvailable !== 1">
                {{ $t("people.countDetailTextNoPending", { totalMembers: countTotalMembers, seatsAvailable: countSeatsAvailable }) }}
              </span>
              <span v-show="countTotalMembers === 1 && countSeatsAvailable !== 1">
                {{ $t("people.countDetailTextNoPendingSingleMember", { seatsAvailable: countSeatsAvailable }) }}
              </span>
              <span v-show="countTotalMembers > 1 && countSeatsAvailable === 1">
                {{ $t("people.countDetailTextNoPendingSingleSeat", { totalMembers: countTotalMembers }) }}
              </span>
              <span v-show="countTotalMembers === 1 && countSeatsAvailable === 1">
                {{ $t("people.countDetailTextNoPendingSingleMemberSingleSeat") }}
              </span>
            </span>
          </div>
        </div>
      </template>
      <template v-if="businessData" slot="bottom-right">
        <div class="mr-1" v-if="isAdmin && !isSubscriptionExpired">
          <bib-button
            size="lg"
            :label="$t('common.addUser')"
            variant="primary-24"
            pill
            @click="handleAddUser"
          ></bib-button>
        </div>
      </template>
    </content-header>

    <!-- show in mobile view -->
    <div v-show="isMobileView" class="mt-1 ml-1 mr-1 p-1 pb-0">
      <span v-show="countPendingMembers > 0" class="font-md">
        <span v-show="countTotalMembers > 1 && countSeatsAvailable !== 1">
          {{ $t("people.countDetailText", { totalMembers: countTotalMembers, pendingInvites: countPendingMembers, seatsAvailable: countSeatsAvailable }) }}
        </span>
        <span v-show="countTotalMembers === 1 && countSeatsAvailable !== 1">
          {{ $t("people.countDetailTextSingleMember", { pendingInvites: countPendingMembers, seatsAvailable: countSeatsAvailable }) }}
        </span>
        <span v-show="countTotalMembers > 1 && countSeatsAvailable === 1">
          {{ $t("people.countDetailTextSingleSeat", { totalMembers: countTotalMembers, pendingInvites: countPendingMembers }) }}
        </span>
        <span v-show="countTotalMembers === 1 && countSeatsAvailable === 1">
          {{ $t("people.countDetailTextSingleMemberSingleSeat", { pendingInvites: countPendingMembers }) }}
        </span>
      </span>
      <span v-show="countPendingMembers === 0" class="font-md">
        <span v-show="countTotalMembers > 1 && countSeatsAvailable !== 1">
          {{ $t("people.countDetailTextNoPending", { totalMembers: countTotalMembers, seatsAvailable: countSeatsAvailable }) }}
        </span>
        <span v-show="countTotalMembers === 1 && countSeatsAvailable !== 1">
          {{ $t("people.countDetailTextNoPendingSingleMember", { seatsAvailable: countSeatsAvailable }) }}
        </span>
        <span v-show="countTotalMembers > 1 && countSeatsAvailable === 1">
          {{ $t("people.countDetailTextNoPendingSingleSeat", { totalMembers: countTotalMembers }) }}
        </span>
        <span v-show="countTotalMembers === 1 && countSeatsAvailable === 1">
          {{ $t("people.countDetailTextNoPendingSingleMemberSingleSeat") }}
        </span>
      </span>
    </div>

    <!-- CONTENT -->
    <div class="main-container">
      <div v-show="businessData" class="main-container__content grid-auto-240 grid-gap-4">
        <!-- CREATE TEAM -->
        <!-- <div v-if="isAdmin && !isSubscriptionExpired" class="create-team-card" @click="handleAddUser">{{ $t("common.addUser") }}</div> -->
        
        <organization-user-card
          height="240px"
          background-color="var(--bib-background-dark)"
          v-for="(member, index) in orgMembers"
          :key="index"
          :user="member"
          :isLightTheme="lightThemeChecked"
          @click="pickUser(index)"
          @remove-user="openConfirmRemoveModal"
          @update-role="updateRole"
          @resend-invite="resendInvite"
          @cancel-invite="cancelInvite"
          @edit-user="openUserEditModal(index)"
        />
      </div>
    </div>

    <!-- Display No Seats MODAL -->
    <organization-no-seats-modal
      v-if="isOpenNoSeatsModal"
      :text="$t('people.seatsExceededNote')"
      @close="isOpenNoSeatsModal = null"
    />

    <!-- INVITE TEAM MEMBER MODAL -->
    <organization-invite-team-member-modal
      v-if="inviteTeamMemberModal"
      :show="inviteTeamMemberModal"
      :lightThemeChecked="lightThemeChecked"
      @add-member="addPendingUser"
      @close="closeInviteModal"
    />

    <!--  USER PROFILE MODAL -->
    <organization-user-details-modal
      v-if="selectedUser"
      :isLightTheme="lightThemeChecked"
      :show="userDetailsModal"
      :user="selectedUser"
      :userId="userDetailsModal"
      @close="userDetailsModal = null"
    />

    <!-- Remove User Confirm Dialog -->
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :isLightTheme="lightThemeChecked"
      :text="$t('people.confirmRemoveUser')"
      @close="isOpenConfirmModal = null"
      @confirm="updateStatus">
    </confirm-dialog>

    <!--  Edit Name Modal -->
    <organization-user-edit-modal
      v-if="selectedUser"
      :show="isUserEditModal"
      :user="selectedUser"
      :lightThemeChecked="lightThemeChecked"
      @close="isUserEditModal = false"
    />

    <!--  Upgrade Plan Modal -->
    <organization-upgrade-plan-modal
      :show="isOpenUpgradePlanModal"
      @close="isOpenUpgradePlanModal = false"
    />

  </div>
</template>

<script>
import { getMembers, getBusiness } from "~/model/business";
import { deleteUser, updateUserStatus, updateUserRole, invitePerson, getUser } from "~/model/user";
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {
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
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
    countTotalMembers() {
      return this.orgMembers.length
    },
    countPendingMembers() {
      return this.orgMembers.filter(e => e.Status === 'PENDING').length
    },
    countSeatsAvailable() {
      return this.businessData && (this.businessData.BibLicenseNumberOfUsers - this.orgMembers.length) || 0
    },
    isSubscriptionExpired() {
      return this.businessData && Date.parse(this.businessData.BibLicenseExpiration) < Date.now()
    },
    isMobileView() {
      return this.$store.state.ui.windowSize.width < 600
    },
  },
  async created() {
    const businessId = this.$store.state.account.data.businessId
    this.$store.dispatch('loading/set', true)
    const allMembers = await getMembers({ businessId }) || []
    this.orgMembers = allMembers.filter(e => e.Status === 'ACTIVE' || e.Status === 'PENDING')
    const resp = await getBusiness({ businessId })
    if (resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      this.businessData = resp[0]
    }
    this.$store.dispatch('loading/set', false)
  },
  mounted() {},
  watch: {
    async"$store.state.business.subscriptionInfo"({err, ...resp }){
      if (err) {
        this.$store.dispatch('notification/set', [true, err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        this.$store.dispatch('loading/set', true)
        const businessId = this.$store.state.account.data.businessId
        const allMembers = await getMembers({ businessId }) || []
        this.orgMembers = allMembers.filter(e => e.Status === 'ACTIVE' || e.Status === 'PENDING')
        const resp = await getBusiness({ businessId })
        if (resp.err) {
          this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          this.businessData = resp[0]
        }
        this.$store.dispatch('loading/set', false)
      }
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  methods: {
    async getUserObject(userId) {
      const resp = await getUser({ userId })
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        return resp[0]
      }
    },
    handleAddUser() {
      if (this.countSeatsAvailable > 0) {
        this.inviteTeamMemberModal = true
      } else {
        if(this.$mobile.emit("appStorePurchaseDialogInitiate", { action: "plans-and-pricing" }) || !this.businessData) return;
        if (this.businessData.Status === 'CLIENT') {
          // window.open(`${this.bibUpgradeLicenseUrl}/?lang=${this.$i18n.locale}`, '_blank')
          this.$store.commit("gui/PAYMENT_MODAL", true);
        } else if (this.businessData.Status === 'FREETRIAL') {
          // window.open(`${this.bibUpgradeLicenseUrlTrial}`, '_blank')
          this.$store.commit("gui/PAYMENT_MODAL", true);
        }
      }
    },
    pickUser(index) {
      this.selectedUser = null
      setTimeout(() => {
        this.selectedUser = this.orgMembers[index]
        this.userDetailsModal = true
      }, 100)
    },
    async addPendingUser(userId) {
      const user = await this.getUserObject(userId) || null
      if (user) {
        this.orgMembers.push(user)
      }
    },
    openConfirmRemoveModal(user) {
      this.selectedUser = user
      this.isOpenConfirmModal = true
    },
    openUserEditModal(index) {
      this.selectedUser = null
      setTimeout(() => {
        this.selectedUser = this.orgMembers[index]
        this.isUserEditModal = true
      }, 100)
    },
    closeInviteModal(value) {
      this.inviteTeamMemberModal = false
      // if (value === 'remaining quota: 0') {
      //   this.isOpenUpgradePlanModal = true
      // }
    },
    async resendInvite(user) {
      await this.deleteUser(user.Id, 'resendInvite')
      const params = {
        FirstName: user.FirstName,
        LastName: user.LastName,
        InviterEmail: this.$store.state.account.data.userEmail,
        Email: user.Email,
        BusinessId: this.$store.state.account.data.businessId,
        Role: 'USER',
        InviterId: this.$store.state.account.data.userId
      }
      this.$store.dispatch('loading/set', true)
      let failedText = ''
      invitePerson(params).then(async (resp) => {
        this.$store.dispatch('loading/set', false)
        if (resp.errorEmails && resp.errorEmails.length) {
          failedText = resp.errorEmails[0].err
          await this.$store.dispatch('notification/set', [true, failedText, 'danger'])
        } else if (resp.inviteUser === 'failed') {
          failedText = resp.error
          await this.$store.dispatch('notification/set', [true, failedText, 'danger'])
        } else {
          this.orgMembers.forEach(e => {
            if (e.Id === user.Id) {
              e.Id = resp.Id
            }
          })
          const msg = this.$t("people.resentInvitationMsg", { email: user.Email })
          await this.$store.dispatch('notification/set', [true, msg, 'success'])
        }
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 8000)
      })
    },
    async cancelInvite(user) {
      this.selectedUser = user
      await this.deleteUser(user.Id, 'cancelInvite')
    },
    async deleteUser (userId, actionType) { // physically delete
      this.$store.dispatch('loading/set', true)
      try {
        const resp = await deleteUser({ userId })
        this.$store.dispatch('loading/set', false)
        this.isOpenConfirmModal = false
        if (resp.deleteUser === 'success') {
          let i = -1
          this.orgMembers.forEach((e, index) => {
            if (e.Id === userId) {
              i = index
            }
          })
          if (actionType === 'cancelInvite') {
            this.orgMembers.splice(i, 1)
          }
        } else {
          await this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      } catch(err) {
        this.$store.dispatch('loading/set', false)
        await this.$store.dispatch('notification/set', [true, err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
    },
    async updateRole(userId, Role) {
      this.$store.dispatch('loading/set', true)
      const updatedRole = Role === 'ADMIN' ? 'USER' : 'ADMIN'
      const params = {
        Id: userId,
        Role: updatedRole,
        BusinessId: this.$store.state.account.data.businessId
      }
      try {
        const resp = await updateUserRole(params)
        this.$store.dispatch('loading/set', false)
        if (resp.changeUserStatus === 'success') {
          let user = null
          this.orgMembers.forEach((e, index) => {
            if (e.Id === userId) {
              e.Role = updatedRole
              user = e
            }
          })
          const msg = this.$t("people.userRoleUpdatingMsg", { firstName: user.FirstName, lastName: user.LastName, updatedRole: updatedRole })
          await this.$store.dispatch('notification/set', [true, msg, 'success'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          await this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        }
      } catch(err) {
        this.$store.dispatch('loading/set', false)
        await this.$store.dispatch('notification/set', [true, err.message, 'danger'])
      }
    },
    async updateStatus() { // Status = 'DELETED' => soft delete
      this.$store.dispatch('loading/setGlobal', true)
      const Id = this.selectedUser.Id
      const Status = 'DELETED'
      const params = {
        Id,
        Status
      }
      try {
        const resp = await updateUserStatus(params)
        this.$store.dispatch('loading/setGlobal', false)
        if (resp.changeUserStatus === 'success') {
          let i = -1, user = null
          this.orgMembers.forEach((e, index) => {
            if (e.Id === Id) {
              i = index
              user = e
            }
          })
          this.orgMembers.splice(i, 1)
          let text = `User has been removed`;
          if (user.FirstName && user.LastName) {
            text = `${user.FirstName} ${user.LastName} has been removed`
          } else if (user.FirstName && !user.LastName) {
            text = `${user.FirstName} has been removed`
          } else if (!user.FirstName && user.LastName) {
            text = `${user.LastName} has been removed`
          } else {
            text = `User(${user.Email}) has been removed`
          }
          await this.$store.dispatch('notification/set', [true, text, 'success'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          await this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        }
      } catch(err) {
        this.$store.dispatch('loading/setGlobal', false)
        await this.$store.dispatch('notification/set', [true, err.message, 'danger'])
      }
      this.isOpenConfirmModal = false
    },
  },
};
</script>
<style lang="scss" scoped>
.main-container {
  @include flex-justify;
  width: 100%;
  padding: 32px 40px;

  &__content {
    width: inherit;
    // grid-template-columns: repeat(5, 1fr);
  }
}

.create-team-card {
  @include flex-align;
  @include flex-justify;
  width: 100%;
  height: 240px;
  border: 1px solid $border-color;
  font-weight: bold;
  font-size: 15px;
  color: $primary;
  cursor: pointer;
  border-radius: 8px;

}

.team-card__dot-menu {
  position: absolute !important;
  top: 8px;
  right: 8px;

  // &:hover {
  //   border-radius: 100px;
  //   background: $background-dark;
  // }
}
</style>
