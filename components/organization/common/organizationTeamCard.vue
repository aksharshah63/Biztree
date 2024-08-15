<template>
  <div :class="['teammates-card', {'dark': !lightThemeChecked}]" :style="computedStyle" @click="$emit('click')">
    <bib-avatar :src="team.Photo ? team.Photo : `/img/team.svg`" size="4rem"  :class="['mb-075', {'dark': !isLightTheme}]" v-if="$store.state.account.data.userRole === 'ADMIN'"/>
    <bib-avatar :src="team.TeamPhoto ? team.TeamPhoto : `/img/team.svg`" size="4rem"  :class="['mb-075', {'dark': !isLightTheme}]" v-else-if="$store.state.account.data.userRole === 'USER'"/>
    <!-- <bib-avatar :src="team.Photo ? team.Photo : `/img/team.svg`" size="4rem" :class="['mb-075', {'dark': !isLightTheme}]"/> -->
    <div class="teammates-card__title" :title="team?.TeamName">{{ team?.TeamName }}</div>
    <div class="teammates-card__subtitle" v-if="localUsers===0 || localUsers===1"> {{ $t("common.totalteamMember",{totaluser: localUsers}) }}</div>
    <div class="teammates-card__subtitle" v-else> {{ $t("common.totalteamMembers",{totalusers: localUsers}) }}</div>
    <slot />
  </div>
</template>

<script>
import { getTeamUser } from "~/model/team";

export default {
  // props: ["team", "height", "backgroundColor","users"],
  props: {
    team: Object,
    height: String,
    backgroundColor: String,
    users: Number,
    isLightTheme: Boolean
  },
  data() {
    return {
      localUsers: this.team.TeamUserCount,
      hashId: null,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
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
    //this.fetchUsers();
  },
  watch: {
    team(newData) {
      this.localUsers = newData.TeamUserCount; // Update teams when prop changes
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  methods: {
//     async fetchUsers() {
//       const { TeamId, Id } = this.team;
//       this.hashId = TeamId ? TeamId : Id;
//       const data = await getTeamUser({ hashId: this.hashId });
//       if(data.err)
//       {
//         if(data.err.error === `missing TeamId`)
//         {
//           this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
//           setTimeout(async () => {
//             await this.$store.dispatch('notification/set', [false, '', ''])
//           }, 5000)
//         }
//         else if(data.err.error === `invalid TeamId`)
//         {
//           this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
//           setTimeout(async () => {
//             await this.$store.dispatch('notification/set', [false, '', ''])
//           }, 5000)
//         }
//         else
//         {
//           setTimeout(async () => {
//             await this.$store.dispatch('notification/set', [false, '', ''])
//           }, 5000)
//         }
//       }
//       else
//       {
//         this.localUsers = data.length;
//       }
//     },
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
