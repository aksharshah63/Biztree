<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="top-left">
        <bib-icon icon="home" :scale="1.5" class="ml-075 mr-05" variant="secondary-sub2"></bib-icon>
        <div class="font-sm">/ Organization Name / {{ $t("common.departments") }}</div>
      </template>
      <template slot="bottom-left">
        <div class="align-center">
          <div class="ml-1 justify-center" @click="goBack">
            <bib-icon icon="arrow-left" style="width: 1.5rem; height: 1.5rem; cursor: pointer;" variant="gray5"></bib-icon>
          </div>
          <div class="organization-headline" id="deptcircleicon" :class="{'default-img': !department?.Photo}">
            <img :src="department?.Photo ? department?.Photo : `/img/department.svg`" class="organization-image" id="dept_image"/>
            <h2 class="font-w-600 font-heading-sm m-0" id="test_deptname">{{department?.DeptName}}</h2>
          </div>
        </div>
      </template>
      <template slot="bottom-right"  v-if="isAdmin">
        <div class="organization-right-icons">
          <div  :class="['icon-circle  mr-05', {'bg-border-primary': !lightThemeChecked}, {'bg-gray11': lightThemeChecked}]" @click.stop="openModal('department', department.Id), (deptname = `${department?.DeptName}`)" :title="$t('common.addTeam')">
            <bib-icon icon="user-group" variant="secondary" :scale="1.3"></bib-icon>
          </div>
          <div  :class="['icon-circle  mr-05', {'bg-border-primary': !lightThemeChecked}, {'bg-gray11': lightThemeChecked}]" @click.stop="openModal('deptteammember',department.Id), (deptname = `${department?.DeptName}`)" :title="$t('common.addteammember')">
            <bib-icon icon="user-add" variant="secondary" :scale="1.3"></bib-icon>
          </div>
          <div :class="['icon-circle mr-1', {'bg-border-primary': !lightThemeChecked}, {'bg-gray11': lightThemeChecked}]" :title="$t('common.more')">
            <bib-popup size="lg" pop="elipsis">
              <div slot="menu" class="list">
                <span class="list__item" @click.stop="openModal('department',department.Id), (deptname = `${department?.DeptName}`)" :title="$t('common.addTeam')">{{ $t("common.addTeam") }}</span>
                <span class="list__item" @click.stop="openModal('deptteammember',department.Id), (deptname = `${department?.DeptName}`)" :title="$t('common.addteammember')">{{ $t("common.addteammember") }}</span>
                <div class="separator" />
                <span class="list__item danger" @click.stop="isOpenConfirmModal=true, (selectedTeam = department.Id), (deptname = `${department?.DeptName}`)" :title="$t('common.deleteDepartment')">{{ $t("common.deleteDepartment") }}</span>
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
          <span class="tab-bar__item" :class="{ active: selectedTab === 'teams',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'teams'">{{ $t("common.teams") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'people',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'people'">{{ $t("common.people") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'details',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'details'">{{ $t("common.details") }}</span>
          <!-- <span class="tab-bar__item" :class="{ active: selectedTab === 'activity',mobile_view: isMobileView,'dark': !lightThemeChecked }" @click="selectedTab = 'activity'">{{ $t("common.activity") }}</span> -->
        </div>
        <div :class="['form__container-component-holder', {'dark': !lightThemeChecked}]">
          <!-- ORGANIZATION INFORMATION -->
          <keep-alive>
            <component :lightThemeChecked = lightThemeChecked :is="`departments-${selectedTab}`" :data="tabData[selectedTab]" :teamsAlldata="teamsAlldata" :deptmanagerRole="deptmanagerRole" :usersAlldata="usersAlldata"/>
          </keep-alive>
        </div>
      </div>
    </div>

    <!-- CREATE TEAM -->
    <organization-create-department-modal v-if="modalType === 'department'" :localdeptTeams="localteamsAlldata" :show="createTeamModal" :deptname="deptname" :team="selectedTeam" @close="closeModal" @refresh="getTeams()"/>
    <organization-create-department-modal v-if="modalType === 'deptteammember'" :localdeptUsers="usersAlldata" :context="'users'" :show="createTeamModal" :deptname="deptname" :team="selectedTeam" @close="closeModal" @refresh="getTeams()"/>
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteDepartmentText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteDepartment(selectedTeam,deptname)">
    </confirm-dialog>
    </div>
</template>

<script>

import { getDepartment,removeDepartment,getUserAccessdept } from "~/model/department";


export default {
  layout: "home",
  props: ["global"],
  auth: false,
  data() {
    return {
      selectedTab: "teams",
      createTeamModal: null,
      selectedTeam: null,
      modalType: null,
      department: null,
      deptname:null,
      tabData: {
        teams: [],
        people: [],
        details: [],
        activity: [],
      },
      isOpenConfirmModal: null,
      teamsAlldata:[],
      usersAlldata:[],
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      localdeptTeams:null,
      localteamsAlldata:null,
      localdeptUsers:null,
      deptmanagerRole:''
    };
  },
  computed: {
    isMobileView() {
      return this.$store.state.ui.windowSize.width < 600
    },
    isAdmin() {
      return (this.$store.state.account.data.userRole === 'ADMIN')||(this.deptmanagerRole === 'MANAGER')
    },
  },
  created() {
    this.fetchTabData(this.selectedTab)
    this.getTeams()
    if (this.$store.state.account.data.userRole === 'USER') {
      this.getUserAccessdeptdata();
    }
  },
  mounted() { },
  watch: {
    selectedTab(newTab, oldTab) {
      this.fetchTabData(newTab)
    },
    department(newDeptData){
      this.department = newDeptData;
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    },
  },
  methods: {
    goBack(){
      this.$router.push(`/departments`);
    },
    async fetchTabData(tab) {
      let response;
      if(tab==='teams')
      {
        const hashId = this.$route.params.id
        let result= await getDepartment({ hashId: hashId });
        this.department=result;
        response= result.Teams
      }
      else if(tab==='people')
      {
        const hashId = this.$route.params.id
        let result= await getDepartment({ hashId: hashId });
        this.department=result;
        response = result.Dept_Users;
      }
      else if(tab==='details')
      {
        const hashId = this.$route.params.id
        let result= await getDepartment({ hashId: hashId });
        this.department=result;
        response = Object.values(result);
      }
      this.$set(this.tabData, tab, response);
    },
    async getTeams()
    {
      const hashId = this.$route.params.id
      var data = await getDepartment({ hashId: hashId });
      if(data.err)
      {
        if(data.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
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
      }
      else
      {
        this.teamsAlldata = data.Teams;
        this.usersAlldata = data.Dept_Users;
        this.localteamsAlldata = data.Teams;
      }
    },
    async getUserAccessdeptdata(){
      var deptdataid = this.$route.params.id;
      var useraccessdeptdata = await getUserAccessdept({UserId:this.$store.state.account.data.userId,BusinessId:this.$store.state.account.data.businessId,DeptId:deptdataid})
      if(useraccessdeptdata.err){
        if(useraccessdeptdata.err.error === 'missing BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === 'invalid BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === 'business not found')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.Businessnotfound'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === `missing TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === `invalid TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === `missing UserId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingUserId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === `invalid User Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(useraccessdeptdata.err.error === `user not found`)
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
        this.deptmanagerRole = useraccessdeptdata.result.Role;
      }
    },
    async deleteDepartment(departmentId,dept_name) {
      const res = await removeDepartment({ hashId: departmentId });
      if (res.err) {
        let msg;
        if(res.err.error === 'missing Department Id')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === 'invalid Department Id')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `department ${departmentId} doesn't exist`)
        {
          msg = this.$t("APIError.departmentdoesntexist", { deptName: dept_name})
          this.$store.dispatch('notification/set', [true, msg, 'danger'])
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
        this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteDepartmentSuccessfully'), 'success'])
        this.$router.push(`/departments`)
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      this.$store.dispatch('loading/set', false)
      this.isOpenConfirmModal = false
    },
    openModal(type, team) {
      this.modalType = type;
      this.selectedTeam = team;
      this.createTeamModal = true;
      this.getTeams();
    },
    closeModal() {
      this.createTeamModal = false;
      this.modalType = null;
      this.selectedTeam = null;
    },
  },
};
</script>

<style lang="scss" scoped>

.organization-image {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 50%;
}
.organization-headline {
  width: 100%;
  @include flex-align;
  margin-left: 16px;
  gap:8px;

  &.default-img{
    .organization-image{
      width: 20px;
      margin-top: -4px;
    }
  }
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
