<template>
  <div>
    <!-- USER PERSONAL INFORMATION -->
    <form @submit.prevent="profileSubmit" class="mt-3 mb-1" v-if="userData">
      <div class="font-w-700 ml-2 mb-1">{{ $t("common.personalInformation") }}</div>

      <div class="m-2">
        <div class="align-center">
          <div class="avatar-container">
            <img :src="userData.Photo ? userData.Photo : `/img/default_avatar.svg`" class="profile-image"/>
            <div v-if="userData.Photo" :class="['remove-icon bg-gray2 w-fit shape-sharp', {'dark': !lightThemeChecked}]" v-tooltip="'Remove profile image'">
              <bib-icon
                variant="gray1"
                class="cursor-pointer"
                icon="trash-solid"
                @click="isOpenAvatarRemoveDialog = true"
              ></bib-icon>
            </div>
          </div>
          <h3 class="font-w-700 ml-2">{{fullName}}</h3>
        </div>
        <div class="upload-image-text font-sm text-underline cursor-pointer mt-025" @click="openCropModal"> {{ $t('common.uploadImage') }} </div>
        <!-- <input
          type="file"
          ref="file_input"
          @change="uploadImage($event)"
          accept="image/*"
          class="d-none"
        /> -->
      </div>

      <div class="pl-2 pr-2">
        <div class="grid-2 grid-gap-2 grid-break-800">
          <div>
            <bib-input
              class="grid-col-1"
              type="text"
              v-model="userData.FirstName"
              required
              name="first-name"
              :label="$t('common.firstName')"
              :variant="userPersonalEditState && !userData.FirstName ? lightThemeChecked? 'light alert' : 'dark alert' :   lightThemeChecked ? 'light' : 'dark'"
              :disabled="!userPersonalEditState"
              @input="checkFirstNameValidate"
              test_id="input_first_name">
            </bib-input>
            <div v-if="!isFirstNameValidate" class="text-danger font-sm">
              ({{ firstNameValidateText }})
            </div>
          </div>

          <div>
            <bib-input
              class="grid-col-1"
              type="text"
              v-model="userData.LastName"
              required
              name="last-name"
              :label="$t('common.lastName')"
              :variant="userPersonalEditState && !userData.LastName ? lightThemeChecked? 'light alert' : 'dark alert' : lightThemeChecked ? 'light' : 'dark'"
              :disabled="!userPersonalEditState"
              @input="checkLastNameValidate"
              test_id="input_last_name">
            </bib-input>
            <div v-if="!isLastNameValidate" class="text-danger font-sm">
              ({{ lastNameValidateText }})
            </div>
          </div>
        </div>
        <div class="grid-2 grid-gap-2 grid-break-800">
          <bib-input
            class="grid-col-1"
            type="email"
            v-model="userData.Email"
            :label="$t('common.emailAddress')"
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :disabled="true"
            test_id="input_email">
          </bib-input>

          <div class="grid-col-1">
            <bib-input
              type="text"
              v-model="userData.Phone"
              :variant="lightThemeChecked ? 'light' : 'dark'"
              :label="$t('common.telephoneNumber')"
              :disabled="!userPersonalEditState"
              name="phone-number"
              @keypress="isPhoneNumber($event)"
              test_id="input_phone_number"
            ></bib-input>
            <div v-if="userPersonalEditState && !isPhoneNumberValidate" class="text-danger font-sm">
              ({{ $t('common.phoneNumberValidationText') }})
            </div>
          </div>
        </div>
        <bib-input
          class="grid-col-1"
          type="text"
          v-model="userData.JobTitle"
          :label="$t('common.jobTitle')"
          :disabled="!userPersonalEditState"
          :variant="userData.JobTitle && !isJobTitleValidate ? lightThemeChecked? 'light alert' : 'dark alert' : lightThemeChecked ? 'light' : 'dark'"
          test_id="input_job_title">
        </bib-input>
        <div v-if="userData.JobTitle && !isJobTitleValidate" class="text-danger font-sm">
          ({{ $t('common.jotTitleValidation') }})
        </div>
        <!-- <div class="grid-2 grid-gap-2 grid-break-800">
          <bib-input class="grid-col-1" type="text" v-model="userData" placeholder="xx-xx-xxxx" :label="$t('common.dateBirth')" :disabled="!userPersonalEditState"></bib-input>
          <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="*** *** 751" :label="$t('common.socialId')" :disabled="!userPersonalEditState"></bib-input>
        </div> -->
      </div>

      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="userPersonalEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="handleCancelProfileUpdate" test_id="btn_edit_cancel"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit" :disabled="isProfileUpdateDisabled" test_id="btn_update_submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="primary-24--outline" pill @click="userPersonalEditState = true" test_id="btn_edit_state"></bib-button>
        </template>
      </div>

      <div class="separator mt-3"></div>
    </form>

    <!-- PASSWORD -->
    <form @submit.prevent="passwordSubmit" class="mt-1">
      <div class="font-w-700 ml-2 mb-1">{{ $t("common.password") }}</div>
      <div class="grid-3 grid-gap-3 grid-break-900 pl-2 pr-2" v-show="protectedGroupState === 'password'">
        <div class="grid-col-1">
          <label for="">
            {{ $t('common.currentPassword') }}
          </label>
        </div>
        <div class="grid-col-1">
          <label for="">
            {{ $t('common.newPassword') }}
          </label>
        </div>
        <div class="grid-col-1">
          <label for="">
            {{ $t('common.confirmPassword') }}
          </label>
        </div>
      </div>
      <div class="grid-3 grid-gap-3 grid-break-900 pl-2 pr-2" v-show="protectedGroupState === 'password'">
        <div class="grid-col-1">
          <bib-input
            type="password"
            v-model="userPassword"
            name="current-password"
            required
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :disabled="protectedGroupState !== 'password'"
            test_id="input_current_password"
          ></bib-input>
        </div>
        <div class="grid-col-1">
          <bib-input
            type="password"
            v-model="newPassword"
            required
            :disabled="protectedGroupState !== 'password'"
            :variant="isNewPasswordValidate ? lightThemeChecked ? 'light' : 'dark' : lightThemeChecked? 'light alert' : 'dark alert'"
            @input="checkNewPasswordValidate"
            test_id="input_new_password"
          >
          </bib-input>
          <div v-if="!isNewPasswordValidate" class="text-danger font-sm">
              ({{ passwordValidateText }})
          </div>
        </div>
        <div class="grid-col-1">
          <bib-input
            type="password"
            v-model="confirmPassword"
            class="grid-col-1"
            required
            :variant="isMatchingPassword ? lightThemeChecked ? 'light' : 'dark': lightThemeChecked? 'light alert' : 'dark alert'"
            test_id="input_confirm_password"
          ></bib-input>
          <div v-if="!isMatchingPassword" class="text-danger font-sm">
              ({{ $t('common.notMatched') }})
          </div>
        </div>
      </div>
      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="protectedGroupState === 'password'">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="cancelPasswordChange" test_id="btn_pw_cancel"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit" :disabled="!isNewPasswordValidate || !isMatchingPassword || isPasswordUpdateDisabled" test_id="btn_pw_submit"></bib-button>
        </template>
        <template v-else>
          <div class="grid-2 grid-gap-1 w-100">
            <div class="grid-col-1">
              <bib-button size="lg" :label="$t('common.change')" variant="primary-24--outline" pill @click="clickPasswordChangeBtn" test_id="btn_pw_change_state"></bib-button>
            </div>
            <div class="grid-col-1 text-right">
              <span @click.prevent="handleResetPassword" :class="{'text-primary-24': lightThemeChecked,'text-primary-24-sub4': !lightThemeChecked}" class="cursor-pointer text-underline text-nowrap">
                {{ $t("common.resetPasswordByEmail") }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <div class="separator mt-3"></div>
    </form>

    <!-- LANGUAGE -->
    <div class="mt-1">
      <div class="font-w-700 ml-2 mb-1">{{ $t("common.language") }}</div>

      <div class="grid-2 grid-gap-2 grid-break-900 pl-2 pr-2">
        <bib-input
          type="select"
          :class="['grid-col-1', {'dark': !lightThemeChecked}]"
          :variant="lightThemeChecked ? 'light' : 'dark'"
          v-model="selectedLang"
          :options="languageOptions"
          @input="chooseLang"
          test_id="select_language"
        ></bib-input>
      </div>
      <div v-if="false" class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="languageTimeState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="languageTimeState = null"></bib-button>
          <bib-button size="lg" :label="$t('common.save')" variant="primary-24" pill @click="languageTimeState = null"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="gray--outline" pill @click="languageTimeState = true"></bib-button>
        </template>
      </div>
      <div class="separator mt-3"></div>
    </div>
    
    <div class="mt-1">
      <div class="font-w-700 ml-2 mb-1">{{ $t("common.termsofUse") }}</div>
      <div class="align-end ml-2 mr-2">
        <a href="https://www.business-in-a-box.com/company/terms-of-use" target="_blank" :class="{'text-primary-24': lightThemeChecked,'text-primary-24-sub4': !lightThemeChecked}">
          {{ $t("common.licenseAgreement") }}
        </a>
      </div>
    </div>

    <!-- USER PROFESSIONAL INFORMATION -->
    <form @submit.prevent v-if="false">
      <div class="font-w-700 ml-2 mb-2 mt-2">{{ $t("common.professionalInformation") }}</div>

      <div class="pl-2 pr-2">
        <div class="grid-2 grid-gap-2 grid-break-800">
          <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="..." :label="$t('common.professionalTitle')" :disabled="!userProfessionalEditState"></bib-input>
          <bib-input class="grid-col-1" type="select" :selected="classifictions[0]" :options="classifictions" placeholder="..." :label="$t('common.classification')" :disabled="!userProfessionalEditState"></bib-input>
        </div>

        <bib-input type="textarea" v-model="organization_image" placeholder="..." :label="$t('common.notes')" :disabled="!userProfessionalEditState"></bib-input>

        <bib-input type="text" v-model="organization_image" placeholder="..." :label="$t('common.skills')" :disabled="!userProfessionalEditState"></bib-input>
      </div>

      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="userProfessionalEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="userProfessionalEditState = false"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="gray--outline" pill @click="userProfessionalEditState = true"></bib-button>
        </template>
      </div>
    </form>

    <!-- AVATAR UPLOAD MODAL -->
    <bib-modal-wrapper v-if="isOpenAvatarUpload" @close="closeCropModal">
      <template slot="content">
        <div class="text-center p-1 pb-1">
          <cropper
            ref="cropper"
            class="cropper"
            :src="image.src"
            @change="onCanvasChange"
          />
          <div v-if="!image.src" class="empty--picture">
            <a href="javascript:void(0);" @click="$refs.file.click()" class="text-primary m-auto">{{$t('profile.selectImage')}}</a>
          </div>
          <div class="d-flex w-100 mt-1">
            <a href="javascript:void(0);" v-if="image.src" @click="$refs.file.click()" class="text-primary m-auto">{{$t('profile.selectImage')}}</a>
            <input
              type="file"
              ref="file"
              @change="uploadImage($event)"
              accept="image/*"
              :autoZoom="true"
              imageRestriction="none"
              class="d-none"
            />
          </div>
        </div>
      </template>

      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="closeCropModal"></bib-button>
        <bib-button size="lg" :label="$t('Apply')" variant="primary-24" pill @click="uploadUserAvatar"></bib-button>
      </div>
    </bib-modal-wrapper>



    <!-- PROTECT GROUP MODAL -->
    <bib-modal-wrapper v-if="protectedGroupModal" :title="$t('profile.enterPasswordText')" @close="protectedGroupModal = null">
      <bib-input slot="content" class="mt-1" type="password" v-model="userPassword"></bib-input>

      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="protectedGroupModal = null"></bib-button>
        <bib-button size="lg" :label="$t('common.submit')" variant="primary-24" pill @click="updatePassword"></bib-button>
      </div>
    </bib-modal-wrapper>

    <!-- Remove Avatar Confirm Dialog -->
    <bib-modal-wrapper v-if="isOpenAvatarRemoveDialog" :title="$t('profile.removeAvatar')" @close="isOpenAvatarRemoveDialog = null">
      <template slot="content">
        <div class="text-center">
          <p class="font-w-500 mt-0">
            {{ $t('profile.confirmRemoveAvatarText') }}
          </p>
          <bib-avatar :src="$store.state.account.data.photo || `/img/default_avatar.svg`" size="8rem"/>
        </div>
      </template>

      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="isOpenAvatarRemoveDialog = null"></bib-button>
        <bib-button size="lg" :label="$t('common.remove')" variant="danger" pill @click="handleRemoveAvatar"></bib-button>
      </div>
    </bib-modal-wrapper>

    <!-- Delete Account Confirm Dialog -->
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteAccountText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteAccount">
    </confirm-dialog>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { updateUser, changePassword, deleteUser, uploadAvatar, cropUploadAvatar, sendResetLink } from "~/model/user";
import ConfirmDialog from '../common/confirmDialog.vue';
export default {
  components: {
    Cropper,
    ConfirmDialog
  },
  props: {
    data: Object,
    lightThemeChecked: Boolean,
  },
  data() {
    return {
      userData: JSON.parse(JSON.stringify(this.data)), // user's dynamic data
      uData: this.data, // user data which is already updated in back-end
      isOpenAvatarUpload: false,
      image: {
        src: this.data.Photo,
        type: 'image/jpg'
      },
      imageFile: null,
      organization_image: null,
      userPersonalEditState: false,
      userProfessionalEditState: false,
      newPassword: '',
      confirmPassword: '',
      userPassword: '',
      protectedGroupState: null,
      protectedGroupModal: null,
      languageTimeState: null,
      selectedLang: this.$i18n.locale,
      classifictions: [
        { label: "...", value: null },
        { label: "Orange", value: "orange" },
        { label: "Apple", value: "apple" },
        { label: "Grape", value: "grape" },
      ],
      isOpenAvatarRemoveDialog: false,
      isOpenConfirmModal: false,
      coordinates: undefined,
      isSelectImageFromLocal: false,
      localFile: null,
      isNewPasswordValidate: true,
      passwordValidateText: '',
      isFirstNameValidate: true,
      firstNameValidateText: '',
      isLastNameValidate: true,
      lastNameValidateText: '',
    };
  },
  computed: {
    languageCode() {
      return this.$store.state.language.code
    },
    fullName() {
      return `${this.userData.FirstName || ''} ${this.userData.LastName || ''}`
    },
    isMatchingPassword() {
      return (this.newPassword && this.confirmPassword) ? this.newPassword === this.confirmPassword : true
    },
    isJobTitleValidate() {
      return this.userData.JobTitle?.trim().length > 0 && this.userData.JobTitle?.length <= 30
    },
    languageOptions() {
      let options = JSON.parse(JSON.stringify(this.$i18n.locales))
      options.forEach(e => {
        e.label = e.name,
        e.value = e.code
      })
      return options
    },
    isPhoneNumberValidate() {
      // const reg = /^(\+)?(\d{1,2})?[( .-]*(\d{3})[) .-]*(\d{3,4})[ .-]?(\d{4})$/
      // return this.userData.Phone ? this.userData.Phone.match(reg) : true;
      return true
    },
    isProfileUpdateDisabled() {
      return !this.userData.FirstName || !this.userData.LastName || !this.userData.Email
    },
    isPasswordUpdateDisabled() {
      return !this.userPassword || !this.newPassword || !this.confirmPassword
    }
  },
  watch: {
    languageCode(){
      this.checkNewPasswordValidate()
      this.checkFirstNameValidate()
      this.checkLastNameValidate()
      this.isNewPasswordValidate = true;
      this.passwordValidateText = ""
    }
  },
  created() {},
  mounted() {
    const self = this
    this.$root.$on('choose_lang', function(code) {
      self.selectedLang = code
    })
  },
  methods: {
    checkNewPasswordValidate() {
      if (this.newPassword === '') {
        this.isNewPasswordValidate = false;
        this.passwordValidateText = this.$t("common.passwordRequiredValidationText");
      } else if(this.newPassword.includes(' ')) {
        this.isNewPasswordValidate = false;
        this.passwordValidateText = this.$t("common.passwordSpaceValidationText");
      } else if(this.newPassword.length < 8) {
        this.isNewPasswordValidate = false;
        this.passwordValidateText = this.$t("common.passwordLengthValidationText");
      } else if(!this.newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&^()_+=~]{8,}$/)) {
        this.isNewPasswordValidate = false;
        this.passwordValidateText = this.$t("common.passwordConfirmValidationText");
      } else {
        this.isNewPasswordValidate = true;
        this.passwordValidateText = '';
      }
    },
    checkFirstNameValidate() {
      // Length between 1 to 25  characters
      if (this.userData.FirstName.length < 1 || this.userData.FirstName.length > 25) {
        this.isFirstNameValidate = false;
        this.firstNameValidateText = this.$t("common.firstNameLengthValidationText");
      }
      else {
        this.isFirstNameValidate = true;
        this.firstNameValidateText = '';
      }
    },
    checkLastNameValidate() {
      // Length between 2 to 25  characters
      if (this.userData.LastName.length < 1 || this.userData.LastName.length > 25) {
        this.isLastNameValidate = false;
        this.lastNameValidateText = this.$t("common.lastNameLengthValidationText");
      }
      else {
        this.isLastNameValidate = true;
        this.lastNameValidateText = '';
      }
    },
    isPhoneNumber (evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 32 && charCode !== 43 && charCode !== 45 && charCode !== 40 && charCode !== 41 && charCode !== 150) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    async handleRemoveAvatar () {
      this.userData.Photo = null;
      this.uData.Photo = null;
      await this.$store.dispatch('loading/set', true);
      await updateUser(this.userData);
      await this.$store.dispatch('account/update', this.userData);
      await this.$store.dispatch('loading/set', false);
      this.isOpenAvatarRemoveDialog = false;
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    dataURLtoFile (dataurl, filename) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while(n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {type:mime})
    },
    onCanvasChange({ coordinates, canvas }) {
			this.coordinates = coordinates;
		},
    async uploadImage (event) {
      const { files } = event.target
      if (files && files[0]) {
        if (files[0].size > 2000000) {
          alert('Image file size should be less than 2M!')
        } else {
          if (this.image.src) {
            URL.revokeObjectURL(this.image.src)
          }
          const blob = URL.createObjectURL(files[0])
          this.image = {
            src: blob,
            type: files[0].type
          }
          this.isSelectImageFromLocal = true
          const base64Data = await this.getBase64(files[0])
          this.localFile = this.dataURLtoFile(base64Data, `user-avatar.jpg`)
        }        
      }
    },
    async uploadUserAvatar () {
      await this.$store.dispatch('loading/setGlobal', true)
      try {
        if (this.isSelectImageFromLocal) {
          this.userData.Photo = await uploadAvatar({ file: this.localFile, coordinates: this.coordinates })
        } else {
          this.userData.Photo = await cropUploadAvatar({ imgUrl: this.image.src, coordinates: this.coordinates })
        }
        this.uData.Photo = JSON.parse(JSON.stringify(this.userData.Photo))
        await updateUser(this.userData)
        await this.$store.dispatch('account/update', this.userData)
        await this.$store.dispatch('loading/setGlobal', false)
        this.closeCropModal()
      } catch (err) {
        await this.$store.dispatch('loading/setGlobal', false)
        await this.$store.dispatch('notification/set', [true, err, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
    },
    directUpload() {
      this.$refs.file_input.click()
    },
    openCropModal() {
      this.image.src = this.userData.Photo
      this.isOpenAvatarUpload = true
      this.$nextTick(() => {
        const img = this.$refs.cropper.$el.getElementsByTagName('img')[0]
        img.removeAttribute('crossorigin')
      });
    },
    closeCropModal() {
      this.isOpenAvatarUpload = false
      this.image.src = null
      this.isSelectImageFromLocal = false
    },
    handleCancelProfileUpdate() {
      this.userData = JSON.parse(JSON.stringify(this.uData))
      this.userPersonalEditState = false
      this.isFirstNameValidate = true
      this.isLastNameValidate = true
      this.isJobTitleValidate = true
      this.lastNameValidateText = ''
      this.firstNameValidateText = ''
    },
    async profileSubmit() {
      if (this.isPhoneNumberValidate) {
        this.$store.dispatch('loading/set', true)
        await updateUser(this.userData)
        await this.$store.dispatch('account/update', this.userData)
        this.$store.dispatch('loading/set', false)
        this.uData = JSON.parse(JSON.stringify(this.userData))
        this.userPersonalEditState = false
      } else {
        document.querySelector('input[name="phone-number"').focus()
      }
    },
    clickPasswordChangeBtn() {
      this.protectedGroupState = 'password'
      document.querySelector('input[name="current-password"').focus()
    },
    cancelPasswordChange() {
      this.protectedGroupState = null
      this.userPassword = ""
      this.newPassword = ""
      this.confirmPassword = ""
      this.isNewPasswordValidate = true;
      this.passwordValidateText = ""
    },
    passwordSubmit() {
      this.updatePassword()
    },
    async updatePassword() {
      if (this.userPassword) {
        const params = {
          Email: this.$store.state.account.data.userEmail,
          OldPassword: this.userPassword,
          NewPassword: this.newPassword
        }
        this.$store.dispatch('loading/set', true)
        try {
          const resp = await changePassword(params)
          this.$store.dispatch('loading/set', false)
          this.protectedGroupModal = false
          if (resp.changePassword === 'success') {
            await this.$store.dispatch('notification/set', [true, this.$t("common.passwordUpdatedMsg"), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
            this.newPassword = ''
            this.confirmPassword = ''
            this.userPassword = ''
            this.protectedGroupState = null
          } else {
            await this.$store.dispatch('notification/set', [true, resp.error, 'danger'])
          }
        } catch(err) {
          await this.$store.dispatch('notification/set', [true, err.message, 'danger'])
        }
      }
    },
    handleResetPassword() {
      this.$store.dispatch('loading/set', true)
      sendResetLink(this.userData.Email, { Language: this.$i18n.locale }).then(async (resp) => {
        this.$store.dispatch('loading/set', false)
        if (resp.err) {
          await this.$store.dispatch('notification/set', [true, this.$t("loginView.invalidEmailContactAdministrator"), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          await this.$store.dispatch('notification/set', [true, this.$t('loginView.resetLinkSent', { email: this.userData.Email }), 'success'])
        }
      });
    },
    chooseLang() {
      this.$i18n.locale = this.selectedLang
      this.$store.dispatch('language/change', { code: this.selectedLang })
    },
    async deleteAccount () {
      this.$store.dispatch('loading/setGlobal', true)
      try {
        const resp = await deleteUser({
          userId: this.$store.state.account.data.userId
        })
        this.isOpenConfirmModal = false
        if (resp.deleteUser === 'success') {
          await this.$store.dispatch('account/logout')
        } else {
          this.$store.dispatch('loading/setGlobal', false)
          await this.$store.dispatch('notification/set', [true, resp.error, 'danger'])
        }
      } catch(err) {
        this.$store.dispatch('loading/setGlobal', false)
        await this.$store.dispatch('notification/set', [true, err.message, 'danger'])
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-container {
  position: relative;
  height: 100px;
  .remove-icon {
    position: absolute;
    right: 5px;
    bottom: -2px;
    display: flex;
    align-items: center;
    padding: 2px;
    border: 1px solid $gray7;
    &.dark{
      background-color: var(--bib-surface-tertiary);
      border: 1px solid var(--bib-border-primary);
    }
  }
}
.upload-image-text {
  width: 100px;
  text-align: center;
}
.empty--picture {
  border: 2px dashed #888181;
  width: 100%;
  height: 150px;
  display: flex;
}
.grid-col-1 {
  label {
    color: var(--bib-gray6);
  }
}
</style>
