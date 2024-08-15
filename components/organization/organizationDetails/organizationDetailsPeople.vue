<template>
  <form @submit.prevent class="mt-3">
    <!-- TEAM -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.people") }}</div>

      <div class="grid-auto-200 grid-gap-2 pl-2 pr-2">
        <!-- EMPTY -->
        <div class="add-user-card" @click="inviteTeamMemberModal = true">
          {{ $t("common.addNewPerson") }}
        </div>

        <organization-user-card height="130px" v-for="(user, index) in 10" :key="index" :user="user" @click="userDetailsModal = '16854112145'" />
      </div>
    </div>
    <!-- INVITE TEAM MEMBER -->
    <organization-invite-team-member-modal :show="inviteTeamMemberModal" @close="inviteTeamMemberModal = null" />

    <!--  USER PROFILE -->
    <organization-user-details-modal :show="userDetailsModal" :userId="userDetailsModal" @close="userDetailsModal = null" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      inviteTeamMemberModal: false,
      userDetailsModal: null,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.add-user-card {
  @include flex-align;
  @include flex-justify;
  width: 100%;
  height: 130px;
  border: 1px solid $border-color;
  font-weight: bold;
  font-size: 15px;
  color: $primary;
  cursor: pointer;

  &:active {
    // transform: scale(0.98);
  }
}
</style>
