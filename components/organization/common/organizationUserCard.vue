<template>
  <div :class="['teammates-card', {'dark': !lightThemeChecked}]" :style="computedStyle" @click="$emit('click')">
    <div v-if="user.Status === 'PENDING'" class="teammates-card__pending shape-rounded font-md">
      {{ isAdmin ? $t("people.invitationSent") : $t("people.pending") }}
    </div>
    <div v-if="this.$route.path.includes('/people')">
      <bib-avatar :src="user.Photo ? user.Photo : user.UserAvatar" size="4rem" class="mb-075"/>
    </div>
    <div v-else>
        <bib-avatar :src="user.UserAvatar? user.UserAvatar:`/img/user.svg`" size="4rem" class="mb-075 user-profile"/>
    </div>
    <div class="teammates-card__title">
      {{ title }}
    </div>
    <div class="teammates-card__subtitle">{{ user.JobTitle }}</div>
    <div v-if="user.Role === 'ADMIN'" class="font-sm mt-025">({{ $t("common.admin") }})</div>
    <bib-popup v-if="isAdmin && user.Id !== $store.state.account.data.userId" :class="['teammates-card__dot-menu', {'dark': !lightThemeChecked}]" pop="horizontal-dots" icon-hover-variant="primary-24">
      <template v-slot:menu class="dark">
        <div slot="menu" :class="['list', {'dark': !lightThemeChecked}]">
          <template v-if="user.Status === 'ACTIVE'">
            <span v-if="user.Role === 'ADMIN'" class="list__item" @click="$emit('update-role', user.Id, user.Role)">
              {{ $t("common.revokeAdminStatus") }}
            </span>
            <span v-if="user.Role === 'USER'" class="list__item" @click="$emit('update-role', user.Id, user.Role)">
              {{ $t("common.makeAdmin") }}
            </span>
            <span class="list__item" @click="$emit('edit-user', user)">
              {{ $t("common.editUser") }}
            </span>
            <span v-if="isAdmin && user.Id !== $store.state.account.data.userId" class="list__item danger bg-hover-danger" @click="$emit('remove-user', user)">
              {{ $t("common.removeUser") }}
            </span>
          </template>
          <template v-if="user.Status === 'PENDING'">
            <span class="list__item" @click="$emit('resend-invite', user)">
              {{ $t("common.resendInvite") }}
            </span>
            <span class="list__item danger bg-hover-danger" @click="$emit('cancel-invite', user)">
              {{ $t("common.cancelInvite") }}
            </span>
          </template>
        </div>
      </template>
    </bib-popup>
    <slot />
  </div>
</template>

<script>
export default {
  props: ["user", "height", "background-color"],
  data()
  {
    return {
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    }
  },
  watch:{
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  methods: {},
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
    computedStyle() {
      return [
        { "--background-color": this.backgroundColor || "white" },
        { "--background-height": this.height || "130px" },
      ];
    },
    title() {
      if (this.user.FirstName && this.user.LastName) {
        return `${this.user.FirstName} ${this.user.LastName}`
      } else if (!this.user.FirstName && !this.user.LastName) {
        return this.user.Name
      } else if (this.user.FirstName && !this.user.LastName) {
        return this.user.FirstName
      } else if (!this.user.FirstName && this.user.LastName) {
        return this.user.LastName
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
  }
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

  .user-profile{
    &.avatar {
      background-color: var(--bib-silver-gray);
    }
  }

  &:hover{
    .user-profile{
    &.avatar {
      background-color: var(--bib-background-dark);
    }
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

    .user-profile{
      &.avatar {
        background-color: var(--bib-surface-tertiary);
      }    
    }

    &:hover{
    .user-profile{
    &.avatar {
      background-color:var(--bib-text);
    }
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


  &__pending {
    position: absolute !important;
    top: 8px;
    left: 50%;
    transform: translate(-50%, 0);
    background: $primary-24-sub;
    color: white;
    padding: 0.2rem 0.4rem;
  }
}

.list {
  .list__item:hover{
    background: var(--bib-light-sub1);
  }
  .danger:hover {
    background-color: var(--bib-danger);
    color: var(--bib-background);
  }
  &.dark {
    background-color: var(--bib-text);
    color: var(--bib-secondary);
    border: 1px solid var(--bib-border-primary);
      
    .list__item:hover {
        background-color: var(--bib-surface-tertiary);
      }

    .danger:hover {
      background-color: var(--bib-danger);
      color: var(--bib-background);
    }
  }
}

::v-deep {
  .teammates-card__dot-menu {
    &.dark {
      .menu {
        .pop {
          // Your styles here
          border-color: var(--bib-border-primary); 
        }
      }
    }
  }
}
</style>
