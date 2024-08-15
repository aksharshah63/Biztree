<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="top-left">
        <bib-icon icon="home" :scale="1.5" class="ml-075 mr-05" variant="secondary-sub2"></bib-icon>
        <div class="font-sm">/ Organization Name / {{ $t("common.teams") }}</div>
      </template>
      <template slot="bottom-left">
        <div class="align-center">
          <div class="ml-1 justify-center" @click="goBack">
            <bib-icon icon="arrow-left" style="width: 1.5rem; height: 1.5rem; cursor: pointer;" variant="gray5"></bib-icon>
          </div>
          <div class="organization-headline" id="teamcircleicon" :class="{'default-img': !teamData?.Photo}">
            <img :src="teamData?.Photo ? teamData?.Photo : `/img/team.svg`" class="organization-image" id="team_image"/>
            <h2 class="font-w-600 font-heading-sm m-0" id="test_teamname">{{this.TeamName}}</h2>
          </div>
        </div>
      </template>
      <template slot="bottom-right" v-if="isAdmin">
        <div class="organization-right-icons">
          <div :class="['icon-circle  mr-05', {'bg-border-primary': !lightThemeChecked}, {'bg-gray11': lightThemeChecked}]" @click="createTeamModal = true,getUsers()" :title="$t('common.addteammember')">
            <bib-icon icon="user-add" variant="secondary" :scale="1.3" class="icon--gray5"></bib-icon>
          </div>
          <div :class="['icon-circle mr-1', {'bg-border-primary': !lightThemeChecked}, {'bg-gray11': lightThemeChecked}]" :title="$t('common.more')">
            <bib-popup pop="elipsis">
              <div slot="menu" class="list">
                <span class="list__item" @click.stop="createTeamModal = true,getUsers()" :title="$t('common.addteammember')">{{ $t("common.addteammember") }}</span>
                <div class="separator" />
                <span class="list__item danger" @click.stop="isOpenConfirmModal=true, (selectedTeam = $route.params.id)" :title="$t('common.deleteTeam')">{{ $t("common.deleteTeam") }}</span>
              </div>
            </bib-popup>
          </div>
        </div>
      </template>
    </content-header>
    <!-- CONTENT -->
    <div class="form__container">
      <!-- CENTER FORM -->
      <div class="form__container-content form__container-content--center">
        <div :class="['form__container-tab-bar', {'dark': !lightThemeChecked}]">
          <span class="tab-bar__item" :class="{ active: selectedTab === 'people',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'people'">{{ $t("common.people") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'details',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'details'">{{ $t("common.details") }}</span>
          <!-- <span class="tab-bar__item" :class="{ active: selectedTab === 'activity',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'activity'">{{ $t("common.activity") }}</span> -->
          <!-- <span class="tab-bar__item" :class="{ active: selectedTab === 'test',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'test'">test</span> -->
        </div>
        <div :class="['form__container-component-holder', {'dark': !lightThemeChecked}]">
          <!-- ORGANIZATION INFORMATION -->
          <component :lightThemeChecked = lightThemeChecked :is="`teams-${selectedTab}`" :teammanagerRole="teammanagerRole" :data="tabData[selectedTab]" :users="users"/>
        </div>
      </div>
    </div>
    
    <!-- CREATE TEAM -->
    <organization-create-team-modal :show="createTeamModal" :team="$route.params.id" :localUsers="localUsers" :teamName="TeamName" @close="createTeamModal = null" @refresh="getUsers()"/>

    <!-- SCHEDULE MEETING -->
    <organization-schedule-meeting-modal :show="scheduleMeetingModal" @close="scheduleMeetingModal = null" />

    <!-- SEND MESSAGE -->
    <organization-send-message-modal :show="sendMessageModal" @close="sendMessageModal = null" />
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteTeamText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteTeam(selectedTeam)">
    </confirm-dialog>
  </div>
</template>

<script>
import { getTeam,removeTeam,getTeamUser,getUserAccess } from "~/model/team";

export default {
  layout: "home",
  props: ["global"],
  auth: false,
  data() {
    return {
      TeamName: null,
      selectedTab: "people",
      createTeamModal: null,
      scheduleMeetingModal: null,
      sendMessageModal: null,
      teamData:null,      
      tabData: {
        people: [],
        details: [],
      },
      selectedTeam: null,
      // team_name: null,
      isOpenConfirmModal: null,
      users:[],
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      localUsers:null,
      managerRole:null,
      teammanagerRole:''
    };
  },
  computed: {
    isMobileView() {
      return this.$store.state.ui.windowSize.width < 600
    },
    isAdmin() {
      return (this.$store.state.account.data.userRole === 'ADMIN')||(this.teammanagerRole === 'MANAGER')
    },
  },
  async created() {
    this.fetchTeamData()
    this.fetchTabData(this.selectedTab)
    this.getUsers()
    if (this.$store.state.account.data.userRole === 'USER') {
      this.getUserAccessdata();
    }
  },
  mounted() {
    this.lightThemeChecked = this.$cookies.get('isLightTheme');
  },
  watch:{
    selectedTab(newTab, oldTab) {
      this.fetchTabData(newTab)
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  methods: {
    goBack(){
      this.$router.push(`/teams`);
    },
    async fetchTabData(tab) {
      let response;
      if(tab==='people')
      {
        const hashId = this.$route.params.id
        let result= await getTeamUser({ hashId: hashId });
        this.department=result;
        this.users = result;
        response = this.users;
      }
      else if(tab==='details')
      {
        const hashId = this.$route.params.id
        let result= await getTeamUser({ hashId: hashId });
        this.department=result;
        this.users = result;
        response = this.users;
      }
      this.$set(this.tabData, tab, response);
    },
    async getUsers() {
      const hashId = this.$route.params.id;
      const data = await getTeamUser({ hashId: hashId });
      if (data.err) {
        if(data.err.error === `missing TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `invalid TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      }else{
        this.users = data;
        this.localUsers = data;
      } 
    },
    async getUserAccessdata(){
      const teamdataid = this.$route.params.id;
      const useraccessdata = await getUserAccess({UserId: this.$store.state.account.data.userId,BusinessId: this.$store.state.account.data.businessId,TeamId: teamdataid})
      if(useraccessdata.err){
        if(useraccessdata.err.error === 'missing BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === 'invalid BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === 'business not found')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.Businessnotfound'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === `missing TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === `invalid TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === `missing UserId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingUserId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === `invalid User Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdata.err.error === `user not found`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.USER_ERR'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      }else{
        this.teammanagerRole = useraccessdata.result.Role;
      }
    },
    async fetchTeamData() {
      const businessId = this.$store.state.account.data.businessId;
      const data = await getTeam({ hashId: businessId });
      if (data.err) {
        if(data.err.error === 'missing BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === 'invalid BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === 'business not found')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.Businessnotfound'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      } else {
        const teamId = this.$route.params.id;
        const matchedTeam = data.find(team => team.TeamId === teamId);
        if (matchedTeam) {
          this.TeamName = matchedTeam.TeamName;
        }
        this.teamData = matchedTeam;
      }
    },
    async deleteTeam(hashId, team_name) {
      const res = await removeTeam({ hashId: hashId });
      if (res.err) {
        this.handleDeleteError(res.err.error, team_name);
      } else {
        this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteTeamSuccessfully'), 'success']);
        this.$router.push(`/teams`)
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      this.$store.dispatch('loading/set', false);
      this.isOpenConfirmModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.organization-headline {
  width: 100%;
  @include flex-align;
  margin-left: 16px;
}

.organization-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.organization-right-icons {
  @include flex-align;
  .organization-icon {
    @include flex-align;
    @include flex-justify;
    background: $background-dark;
    width: 40px;
    height: 40px;
    border-radius: 100px;
    margin-right: 10px;
    &:last-child {
      margin-right: 20px;
    }
    &:hover {
      box-shadow: 0 0 0px 1px $gray6;
    }
  }
}

.organization-headline {
  width: 100%;
  @include flex-align;
  margin-left: 16px;
  gap:8px;

  &.default-img{
    .organization-image{
      width: 25px;
    }
  }
}

.form {
  &__container {
    @include flex-justify;
    margin: 0 14px;

    &-tab-bar {
      position: relative;
      @include flex-align;
      flex-wrap: wrap;
      background: $background;
      height: 40px;
      min-width: 0;

      &.dark::before{
        background-color: var(--bib-text);
      }

      .tab-bar__item {
        @include flex-align;
        @include flex-justify;
        background: $secondary-sub2;
        font-size: 14px;
        min-width: 120px;
        max-width: 200px;
        height: 100%;
        padding: 0 16px;
        margin-right: 8px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          background: $gray2;
        }
        &.active {
          background: $background-dark;
          cursor: default;
        }
        &.mobile_view {
          min-width: 50px;
          max-width: 60px;
          text-overflow: ellipsis;
          display: inline-block;
          padding-top: 0.5rem;
          &.active {
            max-width: 180px;
            display: flex;
            padding-top: 0;
          }
        }
      }
      &::before {
        position: absolute;
        bottom: -50px;
        content: "";
        width: 100%;
        height: 50px;
        // background-image: linear-gradient(to bottom, $background-dark 5%, transparent);
        pointer-events: none;
        z-index: 1;
      }
    }
    &-component-holder {
      overflow-y: auto;
      max-height: inherit;
      padding-bottom: 64px;
      min-height: 50vh;
    }
    &-content {
      overflow: hidden;
      margin-top: 30px;
      width: 100%;
      max-width: 720px;
      height: 100%;
      max-height: calc(100vh - 230px);
      background: $background-dark;
      border-radius: 6px;
      @media only screen and (max-width: 900px) {
        max-width: 100%;
        max-height: 100%;
        margin-bottom: 30px;
      }
    }
    @media only screen and (max-width: 900px) {
      flex-direction: column;
    }
  }
}
</style>
