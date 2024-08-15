<template>
  <form @submit.prevent class="mt-3">
    <!-- TEAM -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.teams") }}</div>

      <div class="grid-auto-200 grid-gap-2 pl-2 pr-2">
        <!-- CREATE REAM -->
        <div class="create-team-card" @click="createTeamModal = true">
          {{ $t("common.createNewTeam") }}
        </div>

        <organization-team-card height="130px" v-for="(team, index) in 10" :key="index" :team="team" />
      </div>
    </div>
    <!-- CREATE TEAM -->
    <organization-create-team-modal :show="createTeamModal" @close="createTeamModal = null" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      createTeamModal: false,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.create-team-card {
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
