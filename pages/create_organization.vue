<template>
  <div class="organization">
    <Header />
    <div class="organization__header-2">
      <bib-icon icon="home" :scale="1.5" class="ml-05 mr-05" variant="secondary-sub2"></bib-icon>
      {{ $t("common.myAccount") }}
    </div>
    <div class="organization__header-3">
      <div class="organization__header-3__left-side">
        <template v-if="formType == 'create_organization'">{{ $t("common.createOrganization") }}</template>
        <template v-if="formType == 'invite_teammates'">{{ $t("common.inviteTeammates") }}</template>
      </div>
      <div class="organization__header-3__right-side">
        <bib-button size="lg" :label="$t('common.skip')" variant="gray" pill @click="skip()" class="mr-1" />
        <bib-button size="lg" :label="$t('common.next')" variant="primary-24" pill @click="next()" class="mr-1" />
      </div>
    </div>

    <div class="organization__container">
      <!-- FORM -->
      <form @submit.prevent class="organization__container-content">
        <div class="font-bold mt-3 mb-2 bold">
          <template v-if="formType == 'create_organization'">{{ $t("common.createYourOrganization") }}</template>
          <template v-if="formType == 'invite_teammates'">{{ $t("common.inviteTeammates") }}</template>
        </div>

        <div class="mid-content">
          <template v-if="formType == 'create_organization'">
            <div class="avatar-container">
              <img :src="organization_image ? organization_image.base64 : `/img/default_avatar.svg`" @click="uploadAvatar()" />
              <div class="avatar-container__text">
                <span class="upload-link" @click="uploadAvatar()">{{ $t("common.uploadPicture") }}</span>
                ({{ $t("common.optional") }})
              </div>
            </div>

            <!-- Organization name -->
            <div v-if="formType == 'create_organization'" class="fieldset">
              <div class="secondary--text small--text">
                {{ $t("common.organizationName") }}
                <span style="color: var(--danger)">*</span>
              </div>
              <bib-input type="text" v-model="organization_name" name="name" required @keyup.enter="next()"></bib-input>
            </div>
          </template>
          <div v-else-if="formType == 'invite_teammates'" class="teammates-card-container">
            <!-- YOU -->
            <div class="teammates-card">
              <img :src="organization_image ? organization_image.base64 : `/img/default_avatar.svg`" />
              <div class="teammates-card__text">You (Admin)</div>
            </div>

            <!-- EMPTY -->
            <div class="teammates-card teammates-card--empty">
              <div class="teammates-card__text">{{ $t("common.addTeammate") }}</div>
            </div>
          </div>
        </div>
        <div class="submit-group">
          <bib-button size="lg" :label="$t('common.skip')" variant="gray" pill @click="skip()" class="mr-1" />
          <bib-button size="lg" :label="$t('common.next')" variant="primary-24" pill @click="next()" class="mr-1" />
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/global";

.organization {
  height: 100%;

  &__header-2 {
    @include flex-align;
    height: 40px;
    border-bottom: 1px solid $border-color;
  }

  &__header-3 {
    @include flex-align;
    @include flex-justify(space-between);

    height: 72px;
    border-bottom: 1px solid $border-color;
    line-height: 100%;

    &__left-side {
      @include flex-align;
      height: 72px;
      border-bottom: 1px solid $border-color;
      line-height: 100%;
      font-size: 25px;
      font-weight: bold;
      padding-left: 42px;
    }

    &__right-side {
      @include flex-align;
    }
  }

  &__container {
    @include flex-align;
    flex-direction: column;

    &-content {
      @include flex-justify(space-between);
      flex-direction: column;

      margin: 20px;
      margin-top: 30px;
      width: 100%;
      max-width: 720px;
      height: 100%;
      min-height: 500px;
      padding: 32px;
      padding-bottom: 30px;
      background: $background-dark;
      border-radius: 6px;

      .submit-group {
        @include flex-justify(space-between);
        margin: 10px 0;
      }
    }
  }

  .mid-content {
    flex-grow: 1;
    .avatar-container {
      @include flex-align;
      flex-direction: column;
      margin-bottom: 52px;

      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 16px;
        cursor: pointer;
      }

      &__text {
        color: $secondary;
        font-size: 14px;
        font-weight: 300;
      }
    }

    .teammates-card-container {
      @include grid($rows: 3, $gap: 16px);

      @media only screen and (max-width: 580px) {
        @include grid($rows: 2, $gap: 16px);
      }
      @media only screen and (max-width: 380px) {
        @include grid($rows: 1, $gap: 16px);
      }

      .teammates-card {
        @include flex-align;
        @include flex-justify;
        flex-direction: column;
        width: 100%;
        height: 130px;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;

        img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 400px;
          margin-bottom: 16px;
        }

        &__text {
          font-size: 14px;
          font-weight: bold;

          text-align: center;
          width: calc(100% - 32px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &--empty {
          background: none;
          border: 1px solid $border-color;
          color: $primary;
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  .upload-link {
    color: $primary;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: var(--v-primary-lighten2);
    }
  }
}
</style>

<script>
import { createOrganization, inviteTeammates } from "~/model/user";
import { uploadFile } from "~/assets/utils/file";
export default {
  data: () => ({
    formType: null,
    organization_name: null,
    organization_image: null,
    team_mates: [],
  }),
  cpmputed: {},
  mounted() {
    this.formType = this.$route.query.step?.toLowerCase() || "create_organization";
  },
  methods: {
    next() {
      if (this.formType === "create_organization" && !this.organization_name?.trim) return console.log(`missing required`);

      if (this.formType == "create_organization") {
        this.formType = "invite_teammates";
      } else {
        // create the organization
        createOrganization().then((newOrganization) => {
          console.log(`newOrganization`, newOrganization);

          if (this.team_mates.length) {
            // invite teammates if there are some
            inviteTeammates().then((e) => {
              console.log(`inviteTeammates`, e);

              // exit with message
            });
          } else {
            // exit with message
          }
        });
      }
    },
    skip() {
      this.$router.push("/");
    },
    uploadAvatar() {
      uploadFile({ multiple: true }).then((e) => {
        this.organization_image = e[0];
      });
    },
  },
};
</script>
