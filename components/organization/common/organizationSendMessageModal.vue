<template>
  <bib-modal-wrapper v-if="show" @close="$emit('close')">
    <div slot="content" class="pl-1 pr-1">
      <div class="font-w-700 pb-2">{{ $t("common.sendMessage") }}</div>

      <div class="mb-2">
        <bib-input class="mb-05" type="text" v-model="user_email" :label="$t('common.recipients')" :placeholder="$t('common.enterNameOrEmail')"></bib-input>

        <div v-for="(user, index) in selectedTeammates" :key="index" class="teammate-user">
          <img src="/img/default_avatar.svg" class="teammate-user__img" />
          <div class="teammate-user__name">{{ user.name }}</div>
          <div class="teammate-user__email">{{ user.email }}</div>
          <div class="teammate-user__clear" @click="clearTeammate(user.email)">×</div>
        </div>
      </div>

      <bib-input type="text" v-model="user_email" :label="$t('common.subject')" :placeholder="$t('common.subjectText')" required class="mb-1"></bib-input>
      <bib-input type="textarea" v-model="user_email" :label="$t('common.message')" :placeholder="$t('common.messageText')" required class="mb-1"></bib-input>
    </div>

    <div class="align-center justify-between p-1" slot="footer">
      <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
      <bib-button size="lg" :label="$t('common.send')" variant="primary-24" pill></bib-button>
    </div>
  </bib-modal-wrapper>
</template>

<script>
export default {
  props: ["show", "team"],
  data() {
    return {
      user_email: null,
      selectedTeammates: [
        { email: "john.doe@gmail.com", name: "John Doe" },
        { email: "brought.dust@gmail.com", name: "Brought Dust" },
        { email: "john.doe@gmail.coma", name: "John Doe" },
      ],
    };
  },
  methods: {
    clearTeammate(email) {
      this.selectedTeammates = this.selectedTeammates.filter((e) => email !== e.email);
    },
  },
  computed: {},
  created() {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper {
  max-width: 560px !important;
}

.teammate-user {
  display: flex;
  align-items: center;
  background: $light;
  width: max-content;
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 15px;

  *:not(:last-child) {
    margin-right: 10px;
  }

  &__img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 400px;
    box-shadow: 0 0 0 1px $gray4;
  }

  &__name {
    font-weight: bold;
  }

  &__clear {
    cursor: pointer;
    color: $gray4;
    font-size: 2rem;
    line-height: 0;
    margin-top: -6px;

    &:hover {
      color: $gray5;
    }
    &:active {
      color: $gray6;
    }
  }
}
</style>
