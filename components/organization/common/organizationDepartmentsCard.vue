<template>
  <div :class="['teammates-card', {'dark': !isLightTheme}]" :style="computedStyle" @click="$emit('click')">
    <bib-avatar :src="team.Photo ? team.Photo : `/img/department.svg`" size="4rem"  :class="['mb-075', {'dark': !isLightTheme}]" v-if="$store.state.account.data.userRole === 'ADMIN'"/>
    <bib-avatar :src="team.DeptPhoto ? team.DeptPhoto : `/img/department.svg`" size="4rem"  :class="['mb-075', {'dark': !isLightTheme}]" v-else-if="$store.state.account.data.userRole === 'USER'"/>
    <div class="teammates-card__title" :title="team?.DeptName">{{ team?.DeptName }}</div>
    <div class="teammates-card__subtitle" v-if="((localTeams===0) || (localTeams===1))&&((localUsers===0) || (localUsers===1))">{{ $t("common.teamAndTeamMember", {teamsCount: localTeams, teamMembersCount: localUsers}) }}</div>
    <div class="teammates-card__subtitle" v-else-if="((localTeams===0) || (localTeams===1))">{{ $t("common.teamAndTeamMembers", {teamsCount: localTeams, teamMembersCounts: localUsers}) }}</div>
    <div class="teammates-card__subtitle" v-else-if="((localUsers===0) || (localUsers===1))">{{ $t("common.teamsAndTeamMember", {teamsCounts: localTeams, teamMembersCount: localUsers}) }}</div>
    <div class="teammates-card__subtitle" v-else>{{ $t("common.teamsAndTeamMembers", {teamsCounts: localTeams, teamMembersCounts: localUsers}) }}</div>
    <slot />
  </div>
</template>

<script>
import { getTeam } from "~/model/team";
import { getDepartment } from "~/model/department";

export default {
  //  props: ["team", "height", "backgroundColor"],
  props: {
    team: Object,
    height: String,
    backgroundColor: String,
    users: Number,
    deptindexteamcount: Number,
    isLightTheme: Boolean
  },
  data() {
    return {
      teams: [],
      totalTeams: 0,
      totalUsers: 0,
      localUsers: this.team.DeptUsersCount,
      localTeams: this.team.TeamsCount
    };
  },
  computed: {
    computedStyle() {
      return {
        "--background-color": this.backgroundColor || "white",
        "--background-height": this.height || "130px",
      };
    },
  },
  mounted() {
    //this.fetchUsersDept();
    //this.fetchTeamsDept();    
  },
  watch: {
    team(newData) {
      this.localUsers = newData.DeptUsersCount; // Update teams when prop changes
      this.localTeams = newData.TeamsCount; // Update teams when prop changes
    }
  },
  methods: {
    // async fetchUsersDept() {
    //   const hashId = this.team.DeptId;
    //   const data = await getDepartment({ hashId });
    //   if(data.err)
    //   {
    //     if(data.err.error === `missing DepartmentId`)
    //     {
    //       this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //     else if(data.err.error === `invalid DepartmentId`)
    //     {
    //       this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //     else
    //     {
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //   }
    //   else
    //   {
    //     if (data && data.Dept_Users) {
    //       this.localUsers = data.Dept_Users.length;
    //     } else {
    //       this.localUsers = 0;
    //     }
    //   }
    // },
    // async fetchTeamsDept() {
    //   const hashId = this.$store.state.account.data.businessId;
    //   const data = await getTeam({ hashId });
    //   if(data.err)
    //   {
    //     if(data.err.error === `missing BusinessId`)
    //     {
    //       this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //     else if(data.err.error === `invalid BusinessId`)
    //     {
    //       this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //     else if(data.err.error === `business not found`)
    //     {
    //       this.$store.dispatch('notification/set', [true, this.$t('APIError.Businessnotfound'), 'danger'])
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //     else
    //     {
    //       setTimeout(async () => {
    //         await this.$store.dispatch('notification/set', [false, '', ''])
    //       }, 5000)
    //     }
    //   }
    //   else
    //   {
    //     this.teams = data;
    //     const selectedTeams = this.teams.filter(department => department.DeptId === this.team.DeptId);
    //     this.localTeams = selectedTeams.length;
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.teammates-card {
  position: relative;
  @include flex-align;
  @include flex-justify;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  height: var(--background-height);
  background: var(--background-color);
  border-radius: calc(var(--background-height) / 32);
  cursor: pointer;
  overflow: hidden;

  .avatar {
    background-color: var(--bib-silver-gray);
  }

  &:hover{
    .avatar{
      background-color: var(--bib-background-dark);
    }
  }

  &.dark {
    background-color: var(--bib-text);
    color: var(--bib-secondary);
    border: 1px solid var(--bib-border-primary);
    &:hover {
      background-color: var(--bib-surface-tertiary);
    }
    .pop{
      border: 1px solid var(--bib-border-primary);
    }

    .avatar {
      background-color: var(--bib-surface-tertiary);
    }

    &:hover{
    .avatar{
      background-color:var(--bib-text);
    }
  }

  }

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 800px;
    margin-bottom: 8px;
    box-shadow: 0 0 0 1px $gray4;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: bold;

    text-align: center;
    width: calc(100% - 32px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtitle {
    font-size: 13px;
    text-align: center;
    width: calc(100% - 32px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background: $gray2;
  }

  &:active {
    transform: scale(0.98);
  }

  &__dot-menu {
    position: absolute !important;
    top: 8px;
    right: 8px;
  }
}
</style>
