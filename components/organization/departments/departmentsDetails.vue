<template>
  <div>
    <form @submit.prevent="profileSubmit" class="mt-3 mb-05" v-if="deptdatas">
      <div class="font-w-700 ml-2 mb-1">{{ $t("common.departmentInformation") }}</div>
      <div class="m-2">
        <div class="align-center">
          <div class="avatar-container">
            <bib-avatar :src="organization_image ? organization_image : `/img/department.svg`" class="profile-image shape-circle" size="5rem" :class="[{'dark': !lightThemeChecked}]"></bib-avatar>
            <div v-if="organization_image && isAdmin" class="remove-icon w-fit shape-sharp" v-tooltip="'Remove profile image'">
              <bib-icon
                variant="gray1"
                class="cursor-pointer"
                icon="trash-solid"
                @click="isOpenAvatarRemoveDialog = true"
              ></bib-icon>
            </div>
          </div>
        </div>
        <!-- uploadImage button  -->
        <div class="upload-image-text font-sm text-underline cursor-pointer mt-025" @click="openCropModal" v-if="isAdmin"> {{ $t('common.uploadImage') }} </div>
      </div>
      <div class="pl-2 pr-2">
        <!-- <bib-input type="text" v-model="deptdatas.DeptName" placeholder="..." :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.departmentName')" :disabled="!departmentInformationEditState"></bib-input> -->
        <bib-input
          class="grid-col-1"
          type="text"
          v-model="deptdatas.DeptName"
          :label="$t('common.departmentName')"
          placeholder="..."
          :disabled="!departmentInformationEditState"
          :variant="lightThemeChecked ? 'light' : 'dark'"
         >
        </bib-input>


        <div v-if="profileerrors">
          <div v-for="(perror, index) in profileerrors" :key="index" class="text-danger error-msg font-sm">
            {{ perror }}
          </div>
        </div>
        <!-- <bib-input type="textarea" v-model="deptdatas.Description" placeholder="..." :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.description')" :disabled="!departmentInformationEditState"></bib-input> -->
        <bib-input
          class="grid-col-1"
          type="textarea"
         v-model="deptdatas.Description"
         :label="$t('common.description')"
          placeholder="..."
          :disabled="!departmentInformationEditState"
          :variant="lightThemeChecked ? 'light' : 'dark'"
         >
        </bib-input>
        <div id="user-select-content" ref="pickerContent" class="picker-content position-relative">
              <template>
                <bib-input
                    type="text"
                    class="grid-col-1 cls-department-select"
                    :variant="lightThemeChecked ? 'light' : 'dark'"
                    id="user-select-input"
                    ref="userFilterInput"
                    v-model="inputValue"
                    @focus="handleInputFocus"
                    :placeholder="$t('APIError.pleaseSelectDepartmentManager')"
                    :label="$t('common.departmentManager')"
                    @input="handleInputChange"
                    @keyup.esc="closeDropdown"
                    @blur="handleBlur"
                    :disabled="!departmentInformationEditState"
                    icon-right="arrowhead-down-solid"
                    autofocus
                ></bib-input>
                <div v-if="deptmanagererrors">
                  <div v-for="(derror, index) in deptmanagererrors" :key="index" class="text-danger error-msg font-sm">
                    {{ derror }}
                  </div>
                </div>
              </template>

              <div v-if="dropdownOpen" :class="['dept-list p-025 position-absolute w-100', lightThemeChecked ? 'bg-light-sub2 light border-gray2' : ' bg-dark border-dark-sub1 dark']" style="max-height: 12rem; overflow-y: auto" id="user-select-user-avatar-list-wrapper">
                  <ul class="m-0 p-0" id="user-select-user-avatar-list">
                      <li @click="unassignUser" :class="['p-025 pr-05 font-md cursor-pointer align-center', lightThemeChecked ? 'bg-hover-light text-danger' : 'bg-hover-danger text-hover-white text-danger']" v-if="inputValue">
                          <span class="user-label ml-025" :style="{ maxwidth: 'calc(' + maxwidth + ' - 3rem)' }">{{$t("common.unassign")}}</span>
                          <bib-icon icon="close" variant="danger-sub1" class="ml-auto close-icon text-danger"></bib-icon>
                      </li>
                      <li v-for="(user, index) in filteredDeptsalldata" :key="user.id" @click="selectUser(user)" :id="'user-select-user-avatar-' + index" :class="['p-025 pr-05 font-md cursor-pointer text-hover-dark align-center', lightThemeChecked ? 'bg-hover-light' : 'bg-hover-dark-sub1',{'selected': user === deptusermanager}]">
                        <bib-avatar :src="user.UserAvatar ? user.UserAvatar : `/img/department.svg`" size="1rem"  :class="['flex-shrink-0 mr-025',lightThemeChecked ? 'bg-silver-gray' : 'bg-surface-tertiary']"></bib-avatar>
                        <span class="user-label text-secondary ml-025" :style="{ maxwidth: 'calc(' + maxwidth + ' - 3rem)' }">{{ user.Name }}</span>
                    </li>
                  </ul>
              </div>
            </div>
      </div>
      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="departmentInformationEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="handleCancelProfileUpdate"></bib-button>
          <bib-button size="lg" :label="$t('common.update')"  variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="primary-24--outline" pill @click="departmentInformationEditState = true" v-if="isAdmin"></bib-button>
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
            <div v-if="userAvatarerrors">
              <div v-for="(uerror, index) in userAvatarerrors" :key="index" class="text-danger error-msg font-sm">
                {{ uerror }}
              </div>
            </div>
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
    <!-- Remove Avatar Confirm Dialog -->
    <bib-modal-wrapper v-if="isOpenAvatarRemoveDialog" :title="$t('profile.removeAvatar')" @close="isOpenAvatarRemoveDialog = null">
      <template slot="content">
        <div class="text-center">
          <p class="font-w-500 mt-0">
            {{ $t('profile.confirmRemoveAvatarText') }}
          </p>
          <bib-avatar :src="this.organization_image || `/img/department.svg`" size="8rem" class="profile-image shape-circle" :class="[{'dark': !lightThemeChecked}]"/>
        </div>
      </template>
      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="isOpenAvatarRemoveDialog = null"></bib-button>
        <bib-button size="lg" :label="$t('common.remove')" variant="danger" pill @click="handleRemoveAvatar"></bib-button>
      </div>
    </bib-modal-wrapper>
    <confirm-dialog
      v-if="isOpenRemoveRoleConfirmModal"
      :text="$t('profile.confirmUnassignManagerRole')"
      @close="closeConfirmDeleteRole()"
      @confirm="deleteManagerFromDept()">
    </confirm-dialog>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import { updateDepartment,getDepartment,uploadAvatarDept,cropUploadAvatarDept,assignManagerRoleDept,unassignManagerDept } from '../../../model/department';
export default {
  components: {
    Cropper
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    deptmanagerRole:{
      type: String,
      default: () => "",
    }
  },
  data() {
    return {
      deptdatas: this.data,
      udeptData: this.data, // user data which is already updated in back-end
      isOpenAvatarRemoveDialog: false,
      organization_image: null,
      DeptName: null,
      DeptDescription: null,
      DeptData:{},
      departmentInformationEditState: false,
      isOpenAvatarUpload: false,
      image: {
        src: this.organization_image,
        type: 'image/jpg'
      },
      isSelectImageFromLocal: false,
      localFile: null,
      imageFile: null,
      coordinates: "",
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      deptdetailserrors:[],
      errors:[],
      deptusermanager: null,
      deptfilterkey:null,
      deptselectedUser: null,
      dropdownOpen:false,
      localDeptusersAlldata: null,
      isOpenRemoveRoleConfirmModal:null,
      selectedManagerUserName:'',
      prevselectedManagerUserName:'',
      deptusermanagerId:null,
      selectedManagerUserId:null,
      prevselectedManagerUserId:null,
      deptmanagererrors:[],
      userAvatarerrors:[],
      profileerrors:[],
    };
  },
  computed: {  
    isProfileUpdateDisabled() {
      return !this.deptdatas.DeptName || !this.deptdatas.Description
    },
    isAdmin() {
      return (this.$store.state.account.data.userRole === 'ADMIN')||(this.deptmanagerRole == 'MANAGER')
    },
    filteredDeptsalldata() {
      if (!this.deptfilterkey || (this.deptusermanager && this.deptfilterkey === this.deptusermanager)) {
        return this.localDeptusersAlldata;
      }
      return this.localDeptusersAlldata.filter(user => user.Name.toLowerCase().includes(this.deptfilterkey.toLowerCase()));
    },
    maxwidth() {
        return '100%'; // Define this or adjust according to your layout
    },
    inputValue: {
      get() {
        return this.selectedManagerUserName
      },
      set(newValue) {
        this.selectedManagerUserName = newValue;
        this.deptfilterkey = newValue; 
      }
    }
  },
  watch:{
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    },
    selectedManagerUserName(newVal,OldVal){
      if (newVal) {
        this.prevselectedManagerUserName = OldVal;
      }
    },
    deptdatas(newDeptData){
      if(newDeptData){
      }
    },
    selectedManagerUserId(newSelectedVal,OldSelectedVal){
      if (newSelectedVal) {
        this.prevselectedManagerUserId = OldSelectedVal;
      }
    },
    data(newData) {
      this.departmentInformationEditState = false;
      this.users = [...newData]; // Update teams when prop changes
      this.getDepartments();
    },
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const hashId = this.$route.params.id;
      const data = await getDepartment({ hashId: hashId });
      if(data.err)
      {
        if(data.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
        }
        else if(data.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        this.$emit('open')
      }
      else
      {
        this.DeptName = data.DeptName
        this.DeptDescription = data.Description
        this.organization_image = data.Photo
        this.deptdatas = data
        this.localDeptusersAlldata = data.Dept_Users;
        var DeptUser = this.localDeptusersAlldata.filter(x=>x.Role==='MANAGER')
        this.selectedManagerUserName = DeptUser[0]?.Name;
        this.deptusermanagerId = DeptUser[0]?.UserId;
        this.selectedManagerUserId = DeptUser[0]?.UserId;
        this.deptusermanager = DeptUser[0]?.Name;
      } 
    },
    async openDropdown() {
      if (!this.localDeptusersAlldata) {
          await this.getDepartments();
      }
      this.dropdownOpen = true;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    handleInputFocus() {
      this.dropdownOpen = true; // Open dropdown to display the list
    },
    handleInputChange() {
      this.deptfilterkey = this.inputValue;// Open dropdown to display the list
    },
    selectUser(user) {
      //this.deptusermanager = user.UserId;
      this.selectedManagerUserName = user.Name;
      this.selectedManagerUserId = user.UserId;
      this.closeDropdown();
      //await this.getDepartments();
    },
    unassignUser() {
      this.deptusermanager = null;
      //this.selectedDeptName = '';
      // this.previousDeptName = '';
      this.isOpenRemoveRoleConfirmModal=true
      this.closeDropdown();
    },
    handleBlur() {
      setTimeout(() => {
        this.dropdownOpen = false;
      }, 200); // Add a delay to allow for click events to register
    },
    async closeConfirmDeleteRole() {
      this.isOpenRemoveRoleConfirmModal = null;
      if(this.selectedManagerUserName != ""){
       // this.selectedDeptName = this.previousDeptName;
        await this.getDepartments();
      }
      this.departmentInformationEditState = false;
    },
    async deleteManagerFromDept(){
      this.unassignManagerres = []
      this.deptmanagererrors = []
      const unassignManagerres = await unassignManagerDept({UserId: this.deptusermanagerId,DeptId: this.$route.params.id})
      if (unassignManagerres.err) {
        if(unassignManagerres.err.error === `missing DepartmentId`)
        {
          this.deptmanagererrors.push(this.$t('APIError.missingDepartmentId'));
          //this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(unassignManagerres.err.error === `invalid DepartmentId`)
        {
          this.deptmanagererrors.push(this.$t('APIError.invalidDepartmentId'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(unassignManagerres.err.error === `missing UserId`)
        {
          this.deptmanagererrors.push(this.$t('APIError.pleaseSelectDepartmentManager'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.pleaseSelectDepartmentManager'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(unassignManagerres.err.error === `invalid User Id`)
        {
          this.deptmanagererrors.push(this.$t('APIError.invalidUserId'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(unassignManagerres.err.error === `missing Role`)
        {
          this.deptmanagererrors.push(this.$t('APIError.missingRole'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingRole'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      } else {
        this.deptmanagererrors = [];
        this.$store.dispatch('notification/set', [true, this.$t('APISuccess.unassignManagerSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      //this.selectedManagerUserName = ""
       await this.getDepartments();
      }
      this.$store.dispatch('loading/set', false)
      this.isOpenRemoveRoleConfirmModal = false
      this.departmentInformationEditState = false
    },
    async uploadUserAvatar () {
      this.userAvatarerrors=[];
      await this.$store.dispatch('loading/setGlobal', true)
      try {
        if (this.isSelectImageFromLocal) {
          const data = await uploadAvatarDept({ file: this.localFile, coordinates: this.coordinates })
          if(data.err)
          {
            if(data.err.error === 'missing width')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingwidth'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingwidth'), 'danger'])
            }
            else if(data.err.error === 'missing height')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingheight'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingheight'), 'danger'])
            }
            else if(data.err.error === 'missing left')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingleft'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingleft'), 'danger'])
            }
            else if(data.err.error === 'missing top')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingtop'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingtop'), 'danger'])
            }
            else if(data.err.error === 'Access Denied: Unable to upload file')
            {
              this.userAvatarerrors.push(this.$t('APIError.AccessDenied'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.AccessDenied'), 'danger'])
            }
            else if(data.err.error === 'Bucket not found: Unable to upload file')
            {
              this.userAvatarerrors.push(this.$t('APIError.Bucketnotfound'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.Bucketnotfound'), 'danger'])
            }
            else if(data.err.error === 'Credentials Error: Unable to upload file')
            {
              this.userAvatarerrors.push(this.$t('APIError.CredentialsError'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.CredentialsError'), 'danger'])
            }
            else
            {
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
            }
            this.$emit('open')
          }
          else
          {
            this.organization_image = JSON.parse(JSON.stringify(data))
            const businessId = this.$store.state.account.data.businessId
            const res = await updateDepartment({ "Id": this.$route.params.id, "BusinessId": businessId, "DeptName": this.DeptName, "Description": this.DeptDescription, "Photo": this.organization_image })
            const sdeptdefaultImg = document.querySelector(".organization-headline.default-img")
            if (sdeptdefaultImg) {
              sdeptdefaultImg.classList.remove('default-img')
            }
            this.userAvatarerrors = [];
            document.querySelector("#dept_image").src = this.organization_image;
            await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.imageUploadSuccessfully'), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
            this.closeCropModal()
          } 
        } 
        else {
          this.userAvatarerrors = [];
          const data = await cropUploadAvatarDept({ "imgUrl": this.image.src, "width": this.coordinates.width, "height": this.coordinates.height,"left": this.coordinates.left,"top": this.coordinates.top})
          if(data.err)
          {
            if(data.err.error === 'missing width')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingwidth'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingwidth'), 'danger'])
            }
            else if(data.err.error === 'missing height')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingheight'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingheight'), 'danger'])
            }
            else if(data.err.error === 'missing left')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingleft'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingleft'), 'danger'])
            }
            else if(data.err.error === 'missing top')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingtop'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingtop'), 'danger'])
            }
            else if(data.err.error === 'missing imgUrl')
            {
              this.userAvatarerrors.push(this.$t('APIError.missingimgUrl'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingimgUrl'), 'danger'])
            }
            else if(data.err.error === 'Access Denied: Unable to upload file')
            {
              this.userAvatarerrors.push(this.$t('APIError.AccessDenied'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.AccessDenied'), 'danger'])
            }
            else if(data.err.error === 'Bucket not found: Unable to upload file')
            {
              this.userAvatarerrors.push(this.$t('APIError.Bucketnotfound'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.Bucketnotfound'), 'danger'])
            }
            else if(data.err.error === 'Credentials Error: Unable to upload file')
            {
              this.userAvatarerrors.push(this.$t('APIError.CredentialsError'));
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.CredentialsError'), 'danger'])
            }
            else
            {
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
            }
            this.$emit('open')
          }
          else
          {
            this.organization_image = JSON.parse(JSON.stringify(data))
            const businessId = this.$store.state.account.data.businessId
            const res = await updateDepartment({ "Id": this.$route.params.id, "BusinessId": businessId, "DeptName": this.DeptName, "Description": this.DeptDescription, "Photo": this.organization_image })
            this.userAvatarerrors = [];
            const fdeptdefaultImg = document.querySelector(".organization-headline.default-img")
            if (fdeptdefaultImg) {
              fdeptdefaultImg.classList.remove('default-img')
            }
            document.querySelector("#dept_image").src = this.organization_image;
            await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.imageUploadSuccessfully'), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
            this.closeCropModal()
          } 
        }
        await this.$store.dispatch('loading/setGlobal', false)
      } catch (err) {
        await this.$store.dispatch('loading/setGlobal', false)
        await this.$store.dispatch('notification/set', [true, err, 'danger'])
      }
    },
    async handleCancelProfileUpdate() {
      this.userAvatarerrors = [];
      this.deptmanagererrors = [];
      this.profileerrors = [];
      this.deptdatas.DeptName = this.udeptData.DeptName !== undefined ? this.udeptData.DeptName : this.DeptName
      this.deptdatas.Description = this.udeptData.Description !== undefined ? this.udeptData.Description : this.DeptDescription
      this.$emit('refresh')
      if(!this.selectedManagerUserName == ""){
        await this.getDepartments();
      }
      this.departmentInformationEditState = false
    },
    async profileSubmit() {
      this.deptdetailserrors = [];
      this.errors = [];
      this.profileerrors = [];
      this.$store.dispatch('loading/set', true)
      let msg;
      var unassignManagerress="";
      if(this.prevselectedManagerUserId)
      {
        unassignManagerress = await unassignManagerDept({UserId: this.prevselectedManagerUserId,DeptId: this.$route.params.id})
        if (unassignManagerress.err) {
        } else {
        //this.selectedManagerUserName = ""
        // await this.getDepartments();
        }
        this.$store.dispatch('loading/set', false)
      }

      //assign updated as a manager 
      const assignManagerres = await assignManagerRoleDept({UserId: this.selectedManagerUserId,DeptId: this.$route.params.id,Role: "MANAGER"}); 
      if (assignManagerres.err) {
        // if(assignManagerres.err.error === `the MANAGER role is already assigned to the department member`)
        // {
        //   msg = this.$t("APIError.theMANAGERroleisalreadyassignedtotheDepartmentmember", { userName: this.selectedManagerUserName})
        //   this.$store.dispatch('notification/set', [true, msg, 'danger'])
        //   setTimeout(async () => {
        //     await this.$store.dispatch('notification/set', [false, '', ''])
        //   }, 5000)
        // }
      } else {
        // this.$store.dispatch('notification/set', [true, this.$t('APISuccess.AssignManagerSuccessfully'), 'success'])
        // setTimeout(async () => {
        //   await this.$store.dispatch('notification/set', [false, '', ''])
        // }, 5000)
        await this.getDepartments();
      }
      const businessId = this.$store.state.account.data.businessId
      var deptdata ={ 
        "Id": this.$route.params.id, 
        "BusinessId": businessId, 
        "DeptName": this.deptdatas.DeptName, 
        "Description": this.deptdatas.Description, 
      }
      var res = await updateDepartment(deptdata)
      if(res.err)
      {
        if(res.err.error === `missing Id`)
        {
          this.profileerrors.push(this.$t('APIError.missingId'));
        }
        else if(res.err.error === `invalid DeptId`)
        {
          this.profileerrors.push(this.$t('APIError.invalidDepartmentId'));
        }
        else if(res.err.error === `missing BusinessId`)
        {
          this.profileerrors.push(this.$t('APIError.missingBusinessId'));
        }
        else if(res.err.error === `invalid BusinessId`)
        {
          this.profileerrors.push(this.$t('APIError.invalidBusinessId'));
        }
        else if(res.err.error === 'missing DeptName')
        {
          this.profileerrors.push(this.$t('APIError.missingDeptName'));
        }
        else if(res.err.error === 'Department Name already exists')
        {
          this.profileerrors.push(this.$t('APIError.DeptNamealreadyexists'));
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        this.$emit('open')
      }
      // else if((!assignManagerres.err)&&(!res.err)&&(!unassignManagerres.err))
      else
      {
        document.querySelector("#test_deptname").textContent = this.deptdatas.DeptName;
        await this.$store.dispatch('department/update', deptdata)
        await this.$store.dispatch('loading/setGlobal', false)
        this.udeptData = JSON.parse(JSON.stringify(this.deptdatas))
        this.departmentInformationEditState = false
        await this.getDepartments();
        await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.updateDepartmentSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      this.$store.dispatch('loading/set', false)
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
    async uploadImage (event) {
      const { files } = event.target
      if (files && files[0]) {
        if (files[0].size > 2000000) {
          alert(this.$t('APIError.Pleaseselectvalidimagefilesize'))
        } else if(files[0].type !== "image/jpeg" && files[0].type !== "image/png" && files[0].type !== "image/jpg"){
          alert(this.$t('APIError.Pleaseselectvalidimageformat'));
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
    async handleRemoveAvatar () {
      this.userAvatarerrors = [];
      this.organization_image = null;
      await this.$store.dispatch('loading/set', true);
      const businessId = this.$store.state.account.data.businessId
      const res = await updateDepartment({ "Id": this.$route.params.id, "BusinessId": businessId, "DeptName": this.DeptName, "Description": this.DeptDescription, "Photo": this.organization_image })
      await this.$store.dispatch('loading/set', false);
      this.isOpenAvatarRemoveDialog = false;
      if(res.err)
      {
        if(res.err.error === `missing Id`)
        {
          this.userAvatarerrors.push(this.$t('APIError.missingId'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingId'), 'danger'])
        }
        else if(res.err.error === `invalid DeptId`)
        {
          this.userAvatarerrors.push(this.$t('APIError.invalidDepartmentId'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
        }
        else if(res.err.error === `missing BusinessId`)
        {
          this.userAvatarerrors.push(this.$t('APIError.missingBusinessId'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
        }
        else if(res.err.error === `invalid BusinessId`)
        {
          this.userAvatarerrors.push(this.$t('APIError.invalidBusinessId'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
        }
        else if(res.err.error === 'missing DeptName')
        {
          this.userAvatarerrors.push(this.$t('APIError.missingDeptName'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDeptName'), 'danger'])
        }
        else if(res.err.error === 'Department Name already exists')
        {
          this.userAvatarerrors.push(this.$t('APIError.DeptNamealreadyexists'));
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.DeptNamealreadyexists'), 'danger'])
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        this.$emit('open')
      }
      else
      {
        document.getElementById('deptcircleicon').classList.add('default-img');
        document.querySelector("#dept_image").src = '/img/department.svg';
        await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.imageDeleteSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
    },
    openCropModal() {
      this.image.src = this.organization_image
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
      this.deptdetailserrors = []
      this.errors=[]
      this.userAvatarerrors = []
    },
    onCanvasChange({ coordinates, canvas }) {
			this.coordinates = coordinates;
		},
  },
};
</script>

<style lang="scss" scoped>
.profile-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 16px;
  background-color: transparent;
}
.form__container-component-holder{
  .avatar-container{
    position: relative;
    .remove-icon{
      position: absolute;
      right: -5px;
      bottom: -2px;
      display: flex;
      align-items: center;
      border: 1px solid var(--bib-gray7);
      padding: 2px;
      background-color: var(--bib-gray2);
    }
    .profile-image{
      margin: 0;
    }
  }
}
.form__container-component-holder{
  &.dark{
    .remove-icon{
      background-color: var(--bib-surface-tertiary);
      border-color: var(--bib-border-primary);
    }
  }
}

.error-msg{
  margin-bottom: 8px;
}

#user-select-content{
  &:has(.dept-list){
    input{
      margin-bottom: 0 !important;
    }

    .dept-list{
      scrollbar-color: var(--bib-gray4) transparent !important;
      z-index: 10;

      .selected {
        background-color: var(--bib-light);
      }

      &.dark{
        scrollbar-color: var(--bib-text-secondary) transparent !important;

        .selected {
          background-color: var(--bib-dark-sub1);
        }
      }
    }
  }
}
#user-select-user-avatar-list-wrapper{
  max-height: 170px !important;
}
</style>
