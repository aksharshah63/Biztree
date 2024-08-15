<template>
  <div>
    <!-- USER PERSONAL INFORMATION -->
    <form @submit.prevent="profileSubmit" class="mt-3 mb-05" v-if="teamdatas">
      <div v-if="teamdetailserrors" >
        <div v-for="(teamdetailserror, index) in teamdetailserrors" :key="index" class="font-w-600 text-danger bg-danger-sub3 text-center mr-1 ml-1 p-1 mb-1 shape-sharp">
          {{teamdetailserror}}
        </div>
      </div>
      <div class="font-w-700 ml-2 mb-1">{{ $t("common.teamInformation") }}</div>
      <div class="m-2">
        <div class="align-center">
          <div class="avatar-container">
            <bib-avatar :src="organization_image ? organization_image : `/img/team.svg`" class="profile-image shape-circle" size="5rem" :class="[{'dark': !lightThemeChecked}]"></bib-avatar>
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
        <div class="upload-image-text font-sm text-underline cursor-pointer mt-025" @click="openCropModal" v-if="isAdmin"> {{ $t('common.uploadImage') }} </div>
      </div>
      <div class="pl-2 pr-2">
          <div class="grid-2 grid-gap-2 grid-break-800">
            <div>
              <bib-input class="grid-col-1" type="text" v-model="teamdatas.TeamName" placeholder="..." :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.teamName')" :disabled="!teamInformationEditState"></bib-input>
              <div v-if="teamprofileerrors">
                <div v-for="(teamperror, index) in teamprofileerrors" :key="index" class="text-danger error-msg font-sm">
                  {{ teamperror }}
                </div>
              </div>
            </div>
            
            <!-- <template>
              <bib-input
                class="grid-col-1 cls-department-select"
                type="select"
                v-model="selectedDeptName"
                :variant="lightThemeChecked ? 'light' : 'dark'"
                :options="deptsdata"
                placeholder="..."
                :label="$t('common.department')"
                :disabled="!teamInformationEditState">
              </bib-input>
            </template> -->

            <!-- UPDATED DROPDOWN -->
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
                    :placeholder="$t('APIError.pleaseSelectDepartment')"
                    :label="$t('common.department')"
                    @input="handleInputChange"
                    @keyup.esc="closeDropdown"
                    @blur="handleBlur"
                    :disabled="!teamInformationEditState"
                    icon-right="arrowhead-down-solid"
                    autofocus
                ></bib-input>
                <div v-if="depattoteamdetailserrors">
                  <div v-for="(depttoteamerror, index) in depattoteamdetailserrors" :key="index" class="text-danger error-msg font-sm">
                    {{ depttoteamerror }}
                  </div>
                </div>
              </template>

              <div v-if="dropdownOpen" :class="['dept-list p-025 position-absolute w-100', lightThemeChecked ? 'bg-light-sub2 light border-gray2' : ' bg-dark border-dark-sub1 dark']" style="max-height: 12rem; overflow-y: auto" id="user-select-user-avatar-list-wrapper">
                  <ul class="m-0 p-0" id="user-select-user-avatar-list">
                      <li @click="unassignUser" :class="['p-025 pr-05 font-md cursor-pointer align-center', lightThemeChecked ? 'bg-hover-light text-danger' : 'bg-hover-danger text-hover-white text-danger']" v-if="inputValue">
                          <span class="user-label ml-025" :style="{ maxwidth: 'calc(' + maxwidth + ' - 3rem)' }">{{$t("common.unassign")}}</span>
                          <bib-icon icon="close" variant="danger-sub1" class="ml-auto close-icon text-danger"></bib-icon>
                      </li>
                      <li v-for="(user, index) in filteredDeptsalldata" :key="user.id" @click="selectUser(user)" :id="'user-select-user-avatar-' + index" :class="['p-025 pr-05 font-md cursor-pointer text-hover-dark align-center', lightThemeChecked ? 'bg-hover-light' : 'bg-hover-dark-sub1',{'selected': user === selectedUser}]">
                        <bib-avatar :src="user.Photo ? user.Photo : `/img/department.svg`" size="1rem"  :class="['flex-shrink-0 mr-025',lightThemeChecked ? 'bg-silver-gray' : 'bg-surface-tertiary']"></bib-avatar>
                        <span class="user-label text-secondary ml-025" :style="{ maxwidth: 'calc(' + maxwidth + ' - 3rem)' }">{{ user.DeptName }}</span>
                    </li>
                  </ul>
              </div>
            </div>
        </div>
        <bib-input type="textarea" v-model="teamdatas.Description" placeholder="..." :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.description')" :disabled="!teamInformationEditState"></bib-input>
        <!-- Assign As Manager Dropdown -->
        <div id="user-select-content" ref="pickerContent" class="picker-content position-relative">
          <template>
            <bib-input
                type="text"
                class="grid-col-1 cls-department-select"
                :variant="lightThemeChecked ? 'light' : 'dark'"
                id="user-select-input"
                ref="userFilterInput"
                v-model="inputValueManager"
                @focus="handleInputFocusManager"
                :placeholder="$t('APIError.pleaseSelectTeamManager')"
                :label="$t('common.teamManager')"
                @input="handleInputChangeManager"
                @keyup.esc="closeDropdownManager"
                @blur="handleBlurManager"
                :disabled="!teamInformationEditState"
                icon-right="arrowhead-down-solid"
                autofocus
            ></bib-input>
            <div v-if="teamManagerError">
              <div v-for="(teammerror, index) in teamManagerError" :key="index" class="text-danger error-msg font-sm">
                {{ teammerror }}
              </div>
            </div>
          </template>

          <div v-if="dropdownOpenManager" :class="['dept-list p-025 position-absolute w-100', lightThemeChecked ? 'bg-light-sub2 light border-gray2' : ' bg-dark border-dark-sub1 dark']" style="max-height: 12rem; overflow-y: auto" id="user-select-user-avatar-list-wrapper">
            <ul class="m-0 p-0" id="user-select-user-avatar-list">
              <li @click="unassignUserManager" :class="['p-025 pr-05 font-md cursor-pointer align-center', lightThemeChecked ? 'bg-hover-light text-danger' : 'bg-hover-danger text-hover-white text-danger']" v-if="inputValueManager">
                <span class="user-label ml-025" :style="{ maxwidth: 'calc(' + maxwidth + ' - 3rem)' }">{{$t("common.unassign")}}</span>
                <bib-icon icon="close" variant="danger-sub1" class="ml-auto close-icon text-danger"></bib-icon>
              </li>
              <li v-for="(user, index) in filteredDeptsalldataManager" :key="user.id" @click="selectUserManager(user)" :id="'user-select-user-avatar-' + index" :class="['p-025 pr-05 font-md cursor-pointer text-hover-text-secondary align-center', lightThemeChecked ? 'bg-hover-light text-black' : 'bg-hover-surface-tertiary text-gray4',{'selected': user === teamusermanager}]">
                <bib-avatar :src="user.UserAvatar ? user.UserAvatar : `/img/team.svg`" size="1rem"  :class="['flex-shrink-0 mr-025',lightThemeChecked ? 'bg-silver-gray' : 'bg-surface-tertiary']"></bib-avatar>
                <span class="user-label text-secondary ml-025" :style="{ maxwidth: 'calc(' + maxwidth + ' - 3rem)' }">{{ user.Name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="align-center justify-between pt-1 pl-2 pr-2">
        <template v-if="teamInformationEditState">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="handleCancelProfileUpdate"></bib-button>
          <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit"></bib-button>
        </template>
        <template v-else>
          <bib-button size="lg" :label="$t('common.edit')" variant="primary-24--outline" pill @click="teamInformationEditState = true" v-if="isAdmin"></bib-button>
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
            <div v-if="UserAvatarError">
              <div v-for="(uavtarerror, index) in UserAvatarError" :key="index" class="text-danger error-msg font-sm">
                {{ uavtarerror }}
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
          <p class="font-w-500 mt-0">{{ $t('profile.confirmRemoveAvatarText') }}</p>
          <bib-avatar :src="this.organization_image || `/img/team.svg`" size="8rem" class="profile-image shape-circle" :class="[{'dark': !lightThemeChecked}]"/>
        </div>
      </template>
      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="isOpenAvatarRemoveDialog = null"></bib-button>
        <bib-button size="lg" :label="$t('common.remove')" variant="danger" pill @click="handleRemoveAvatar"></bib-button>
      </div>
    </bib-modal-wrapper>
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteDepartmentFromTeam')"
      @close="closeConfirmDeleteDepartment()"
      @confirm="deleteDepeartmentFromTeam()">
    </confirm-dialog>
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
import 'vue-advanced-cropper/dist/style.css';
import { getTeam,updateTeam,uploadAvatarTeam,cropUploadAvatarTeam,removeTeamFromDepartmet,assignManagerRole,unassignManager,getTeamUser } from "~/model/team";
import { getBusinessDepartments,getDepartment } from "~/model/department";

export default {
  components: {
    Cropper,
  },
  props: {
    data: Array,
    teammanagerRole: String
  },
  data() {
    return {
      teamdatas: JSON.parse(JSON.stringify(this.data)),
      uteamData: this.data, // user data which is already updated in back-end
      isOpenAvatarRemoveDialog: false,
      organization_image: null,
      OldValueForDepartmentSelect: '',
      isChangedOrNot: false,
      TeamName: null,
      deptsalldata:null,
      TeamDescription: null,
      TeamDeptId:null,
      updatedTeamDeptId:null,
      TeamData:{},
      deptsdata:[],
      selectedDeptName:'',
      selectedDept:null,
      teamInformationEditState: false,
      isOpenAvatarUpload: false,
      image: {
        src: this.organization_image,
        type: 'image/jpg'
      },
      isSelectImageFromLocal: false,
      localFile: null,
      imageFile: null,
      coordinates: "",
      isOpenConfirmModal: null,
      selectedTeam: null,
      previousDeptName: '', // Temporary variable to store the previous value
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      teamdetailserrors:[],
      errors:[],

      selectedUser: null,
      dropdownOpen: false,
      isUpdated: false,
      initialLoad: true,  // Flag to handle the first-time condition
      sinitialLoad: true,
      filterkey: '',

      teamusermanager: null,
      teamfilterkey:null,
      teamselectedUser: null,
      dropdownOpenManager:false,
      localTeamusersAlldata: null,
      isOpenRemoveRoleConfirmModal:null,
      selectedTeamManagerUserName:'',
      prevselectedTeamManagerUserName:'',
      teamusermanagerId:null,
      selectedTeamManagerUserId:null,
      prevselectedTeamManagerUserId:null,
      teamManagerError: [],
      UserAvatarError: [],
      depattoteamdetailserrors: [],
      teamprofileerrors: [],
    };
  },
  computed: {
    isProfileUpdateDisabled() {
      return !this.teamdatas.TeamName || !this.teamdatas.Description
    },
    isAdmin() {
      return (this.$store.state.account.data.userRole === 'ADMIN')||(this.teammanagerRole == 'MANAGER')
    },
    filteredDeptsalldata() {
      if (!this.filterkey || (this.selectedUser && this.filterkey === this.selectedUser.DeptName)) {
        return this.deptsalldata;
      }
      return this.deptsalldata.filter(user => user.DeptName.toLowerCase().includes(this.filterkey.toLowerCase()));
    },
    filteredDeptsalldataManager() {
      if (!this.teamfilterkey || (this.teamusermanager && this.teamfilterkey === this.teamusermanager)) {
        return this.localTeamusersAlldata;
      }
      return this.localTeamusersAlldata.filter(user => user.Name.toLowerCase().includes(this.teamfilterkey.toLowerCase()));
    },
    maxwidth() {
        return '100%'; // Define this or adjust according to your layout
    },
    inputValue: {
      get() {
        return this.selectedDeptName
      },
      set(newValue) {
        this.selectedDeptName = newValue;
        this.filterkey = newValue; 
      }
    },
    inputValueManager: {
      get() {
        return this.selectedTeamManagerUserName
      },
      set(newValue) {
        this.selectedTeamManagerUserName = newValue;
        this.teamfilterkey = newValue; 
      }
    }
    
  },
  watch: {
    selectedDeptName(newValue, oldValue) {     
      // if (newValue !== this.previousDeptName) {
          this.previousDeptName = oldValue;
          // }
    },
    async isUpdated(newUpdatedValue){
      if (this.isUpdated == true) {
        await this.getTeams();
        this.isUpdated = false;
      }
    },
    teamdatas(newTeamsData){
      if(newTeamsData){
      }
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    },
    TeamDeptId(newTeamDeptIdValue){
      if(newTeamDeptIdValue){
        this.TeamDeptId = newTeamDeptIdValue;
      }
    },
    selectedTeamManagerUserName(newVal,OldVal){
      if (newVal) {
        this.prevselectedTeamManagerUserName = OldVal;
      }
    },
    selectedTeamManagerUserId(newSelectedVal,OldSelectedVal){
      if (newSelectedVal) {
        this.prevselectedTeamManagerUserId = OldSelectedVal;
      }
    }
  },
  async created() {
    await this.getTeams();
    this.getAllDepartments();
    this.getUsers();
  },
  mounted() {
    // setTimeout(() => {
    //   let dropdown = document.querySelector('.cls-department-select select');
    //   let initialValue = document.querySelector('.cls-department-select select').value;
    //   initialValue = initialValue ? initialValue : '';
    //   this.OldValueForDepartmentSelect = initialValue;
    //   dropdown.addEventListener('change', () => {
    //     const currentValue = dropdown.value;
    //     if (currentValue === this.OldValueForDepartmentSelect) {
    //       this.isChangedOrNot = false;
    //     } else {
    //       this.isChangedOrNot = true;
    //     }
    //   });
    // }, 1000);
  },
  methods: {
    async getUsers() {
      const hashId = this.$route.params.id;
      var data = await getTeamUser({ hashId: hashId });
      if (data.err) {
        if(data.err.error === `missing TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `invalid TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
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
        this.localTeamusersAlldata = data;
        var TeamUser = this.localTeamusersAlldata.filter(x=>x.TeamUserRole==='MANAGER')
        this.selectedTeamManagerUserName = TeamUser[0]?.Name;
        this.teamusermanagerId = TeamUser[0]?.TeamUserId;
        this.selectedTeamManagerUserId = TeamUser[0]?.TeamUserId;
        this.teamusermanager = TeamUser[0]?.Name;
      }
    },
    async getTeams() {
      const businessId = this.$store.state.account.data.businessId;
      const data = await getTeam({ hashId: businessId });
      if (data.err) {
        if(data.err.error === 'missing BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === 'invalid BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === 'business not found')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.Businessnotfound'), 'danger'])
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
        const teamId = this.$route.params.id; 
        this.teamdatas = data.find(team => team.TeamId === teamId);
        if (this.teamdatas) {
          this.TeamName = this.teamdatas.TeamName;
          this.TeamDescription = this.teamdatas.Description;
          this.TeamDeptId = this.teamdatas.DeptId;
          this.organization_image = this.teamdatas.Photo;
        } 
      }
    },
    selectUser(user) {
      this.selectedUser = user;
      this.selectedDeptName = user.DeptName;
      this.closeDropdown();
      this.getTeams();
    },
    selectUserManager(user) {
      this.selectedTeamManagerUserName = user.Name;
      this.selectedTeamManagerUserId = user.TeamUserId;
      this.closeDropdownManager();
    },
    unassignUser() {
      this.selectedUser = null;
      this.isOpenConfirmModal=true
      this.closeDropdown();
    },
    unassignUserManager() {
      this.teamusermanager = null;
      this.isOpenRemoveRoleConfirmModal=true
      this.closeDropdownManager();
    },
    async openDropdown() {
      if (!this.deptsalldata) {
          await this.getAllDepartments();
      }
      this.dropdownOpen = true;
    },
    async openDropdownManager() {
      if (!this.localTeamusersAlldata) {
          await this.getUsers();
      }
      this.dropdownOpenManager = true;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    closeDropdownManager() {
      this.dropdownOpenManager = false;
    },
    handleBlur() {
      setTimeout(() => {
        this.dropdownOpen = false;
      }, 200); // Add a delay to allow for click events to register
    },
    handleBlurManager(){
      setTimeout(() => {
        this.dropdownOpenManager = false;
      }, 200); // Add a delay to allow for click events to register
    },
    handleInputFocus() {
      this.dropdownOpen = true; // Open dropdown to display the list
    },
    handleInputFocusManager() {
      this.dropdownOpenManager = true; // Open dropdown to display the list
    },
    handleInputChange() {
      this.filterkey = this.inputValue;// Open dropdown to display the list
    },
    handleInputChangeManager(){
      this.filterkeyManager = this.inputValueManager;// Open dropdown to display the list
    },
    async closeConfirmDeleteRole() {
      this.isOpenRemoveRoleConfirmModal = null;
      this.teamInformationEditState = false;
      if(this.selectedTeamManagerUserName != ""){
        await this.getUsers();
      }
    },
    async deleteManagerFromDept(TeamUserId,uname,tname){
    let msg;
    this.teamManagerError = [];
    const unassignManagerres = await unassignManager({UserId: this.teamusermanagerId,TeamId: this.$route.params.id})
    if (unassignManagerres.err) {
      if(unassignManagerres.err.error === `missing TeamId`)
      {
        this.teamManagerError.push(this.$t('APIError.missingteamId'));
        // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
        // setTimeout(async () => {
        //   await this.$store.dispatch('notification/set', [false, '', ''])
        // }, 5000)
      }
      else if(unassignManagerres.err.error === `invalid Team Id`)
      {
        this.teamManagerError.push(this.$t('APIError.invalidTeamId'));
        // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
        // setTimeout(async () => {
        //   await this.$store.dispatch('notification/set', [false, '', ''])
        // }, 5000)
      }
      else if(unassignManagerres.err.error === `missing UserId`)
      {
        this.teamManagerError.push(this.$t('APIError.pleaseSelectTeamManager'));
        // this.$store.dispatch('notification/set', [true, this.$t('APIError.pleaseSelectTeamManager'), 'danger'])
        // setTimeout(async () => {
        //   await this.$store.dispatch('notification/set', [false, '', ''])
        // }, 5000)
      }
      else if(unassignManagerres.err.error === `invalid User Id`)
      {
        this.teamManagerError.push(this.$t('APIError.invalidUserId'));
        // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
        // setTimeout(async () => {
        //   await this.$store.dispatch('notification/set', [false, '', ''])
        // }, 5000)
      }
      else if(unassignManagerres.err.error === `missing Role`)
      {
        this.teamManagerError.push(this.$t('APIError.missingRole'));
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
      this.$store.dispatch('notification/set', [true, this.$t('APISuccess.unassignManagerSuccessfully'), 'success'])
      this.teamManagerError = [];
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
      this.getUsers();
    }
    this.$store.dispatch('loading/set', false)
    this.isOpenRemoveRoleConfirmModal = false
    this.teamInformationEditState = false
  },
    async getAllDepartments() {
      const businessId = this.$store.state.account.data.businessId;
      this.deptsalldata = await getBusinessDepartments({ hashId: businessId });
      this.deptsdata = [];
      const getAllDepartmentsData = this.deptsalldata.map(item => ({
        label: item.DeptName,
        value: item.DeptName 
      }));
      this.deptsdata = [...this.deptsdata, ...getAllDepartmentsData];
      const selectedDept = this.deptsalldata.find(department => department.DeptId === this.TeamDeptId);
      this.selectedDeptName = selectedDept?.DeptName ? selectedDept.DeptName : ''; // Bind the name to the v-model
    },
  
    async handleRemoveAvatar () {
      this.organization_image = null;
      this.UserAvatarError = [];
      await this.$store.dispatch('loading/set', true);
      const businessId = this.$store.state.account.data.businessId
      const res = await updateTeam({ "Id": this.$route.params.id, "BusinessId": businessId, "TeamName": this.TeamName, "Description": this.TeamDescription, "Photo": this.organization_image, "DeptId": this.TeamDeptId })
      await this.$store.dispatch('loading/set', false);
      this.isOpenAvatarRemoveDialog = false;
      if(res.err)
      {
        if(res.err.error === `missing Id`)
        {
          this.UserAvatarError.push(this.$t('APIError.missingId'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(res.err.error === `invalid TeamId`)
        {
          this.UserAvatarError.push(this.$t('APIError.invalidTeamId'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(res.err.error === `missing BusinessId`)
        {
          this.UserAvatarError.push(this.$t('APIError.missingBusinessId'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(res.err.error === `invalid BusinessId`)
        {
          this.UserAvatarError.push(this.$t('APIError.invalidBusinessId'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(res.err.error === 'missing TeamName')
        {
          this.UserAvatarError.push(this.$t('APIError.missingTeamName'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingTeamName'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(res.err.error === 'Team Name already exists')
        {
          this.UserAvatarError.push(this.$t('APIError.TeamNamealreadyexists'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.TeamNamealreadyexists'), 'danger'])
          // setTimeout(async () => {
          //   await this.$store.dispatch('notification/set', [false, '', ''])
          // }, 5000)
        }
        else if(res.err.error === 'missing imgUrl')
        {
          this.UserAvatarError.push(this.$t('APIError.missingimgUrl'))
          // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingimgUrl'), 'danger'])
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
      }
      else
      {
        this.UserAvatarError = [];
        document.getElementById('teamcircleicon').classList.add('default-img');
        document.querySelector("#team_image").src = '/img/team.svg';
        await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.imageDeleteSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
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
        } else if(files[0].type !== "image/jpeg" && files[0].type !== "image/png" && files[0].type !== "image/jpg"){
          alert('Please select image of JPEG, JPG, PNG format.');
        }else {
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
      this.UserAvatarError = [];
      await this.$store.dispatch('loading/setGlobal', true)
      try{
        if (this.isSelectImageFromLocal) {
          const data = await uploadAvatarTeam({ file: this.localFile, coordinates: this.coordinates })
          if(data.err)
          {
            if(data.err.error === 'missing width')
            {
              this.UserAvatarError.push(this.$t('APIError.missingwidth'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingwidth'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing height')
            {
              this.UserAvatarError.push(this.$t('APIError.missingheight'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingheight'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing left')
            {
              this.UserAvatarError.push(this.$t('APIError.missingleft'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingleft'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing top')
            {
              this.UserAvatarError.push(this.$t('APIError.missingtop'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingtop'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'Access Denied: Unable to upload file')
            {
              this.UserAvatarError.push(this.$t('APIError.AccessDenied'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.AccessDenied'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'Bucket not found: Unable to upload file')
            {
              this.UserAvatarError.push(this.$t('APIError.Bucketnotfound'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.Bucketnotfound'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'Credentials Error: Unable to upload file')
            {
              this.UserAvatarError.push(this.$t('APIError.CredentialsError'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.CredentialsError'), 'danger'])
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
            this.$emit('open')
          }
          else
          {
            this.organization_image = JSON.parse(JSON.stringify(data))
            const businessId = this.$store.state.account.data.businessId
            const res = await updateTeam({ "Id": this.$route.params.id, "BusinessId": businessId, "TeamName": this.TeamName, "Description": this.TeamDescription, "Photo": this.organization_image, "DeptId": this.TeamDeptId })
            const teamdefaultImg = document.querySelector(".organization-headline.default-img")
            if (teamdefaultImg) {
              teamdefaultImg.classList.remove('default-img')
            }
            this.UserAvatarError = [];
            document.querySelector("#team_image").src = this.organization_image;
            this.closeCropModal()
            await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.imageUploadSuccessfully'), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
        } 
        else {
          this.UserAvatarError = [];
          const data = await cropUploadAvatarTeam({ "imgUrl": this.image.src, "width": this.coordinates.width, "height": this.coordinates.height,"left": this.coordinates.left,"top": this.coordinates.top})
          if(data.err)
          {
            if(data.err.error === 'missing width')
            {
              this.UserAvatarError.push(this.$t('APIError.missingwidth'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingwidth'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing height')
            {
              this.UserAvatarError.push(this.$t('APIError.missingheight'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingheight'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing left')
            {
              this.UserAvatarError.push(this.$t('APIError.missingleft'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingleft'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing top')
            {
              this.UserAvatarError.push(this.$t('APIError.missingtop'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingtop'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'missing imgUrl')
            {
              this.UserAvatarError.push(this.$t('APIError.missingimgUrl'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.missingimgUrl'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'Access Denied: Unable to upload file')
            {
              this.UserAvatarError.push(this.$t('APIError.AccessDenied'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.AccessDenied'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'Bucket not found: Unable to upload file')
            {
              this.UserAvatarError.push(this.$t('APIError.Bucketnotfound'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.Bucketnotfound'), 'danger'])
              // setTimeout(async () => {
              //   await this.$store.dispatch('notification/set', [false, '', ''])
              // }, 5000)
            }
            else if(data.err.error === 'Credentials Error: Unable to upload file')
            {
              this.UserAvatarError.push(this.$t('APIError.CredentialsError'))
              // this.$store.dispatch('notification/set', [true, this.$t('APIError.CredentialsError'), 'danger'])
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
            this.$emit('open')
          }
          else
          {
            this.organization_image = JSON.parse(JSON.stringify(data))
            const businessId = this.$store.state.account.data.businessId
            const res = await updateTeam({ "Id": this.$route.params.id, "BusinessId": businessId, "TeamName": this.TeamName, "Description": this.TeamDescription, "Photo": this.organization_image, "DeptId": this.TeamDeptId })
            const fteamdefaultImg = document.querySelector(".organization-headline.default-img")
            if (fteamdefaultImg) {
              fteamdefaultImg.classList.remove('default-img')
            }
            this.UserAvatarError = [];
            document.querySelector("#team_image").src = this.organization_image;
            this.closeCropModal()
            await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.imageUploadSuccessfully'), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          } 
        }
        await this.$store.dispatch('loading/setGlobal', false)
      } catch (err) {
        await this.$store.dispatch('loading/setGlobal', false)
        await this.$store.dispatch('notification/set', [true, err, 'danger'])
      }
    },
    async handleCancelProfileUpdate() { 
      // Reset teamdatas properties
      this.depattoteamdetailserrors= [];
      this.teamprofileerrors = [];
      this.UserAvatarError = [];
      this.teamManagerError = [];
      this.teamdatas.TeamName = this.uteamData.TeamName !== undefined ? this.uteamData.TeamName : this.TeamName;
      this.teamdatas.Description = this.uteamData.Description !== undefined ? this.uteamData.Description : this.TeamDescription;
      this.teamInformationEditState = false;
      if(!this.selectedTeamManagerUserName == ""){
        await this.getUsers();
      }
      if(!this.selectedDeptName == ""){
        await this.getAllDepartments();
      }
    }, 
    async closeConfirmDeleteDepartment() {
      this.isOpenConfirmModal = null;
      this.UserAvatarError = [];
      this.teamManagerError = [];
      this.depattoteamdetailserrors= [];
      this.teamprofileerrors = [];
      if(this.selectedDeptName != ""){
       // this.selectedDeptName = this.previousDeptName;
        await this.getAllDepartments();
      }
      this.teamInformationEditState = false;
    },
    async deleteDepeartmentFromTeam(){
      this.depattoteamdetailserrors = []
      this.$store.dispatch('loading/set', true)
      if(!(this.updatedTeamDeptId == undefined)){
        const DeleteTeamIdd = this.$route.params.id;
        let selectedDeptDatas = this.updatedTeamDeptId || this.updatedTeamDeptId===undefined ? this.updatedTeamDeptId : ""
        const res = await removeTeamFromDepartmet({ "hashId": DeleteTeamIdd, "deptId": selectedDeptDatas.DeptId });
        if(res.err)
        {
          if(res.err.error === 'missing Id')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.missingteamId'));
            this.selectedDeptName = this.previousDeptName;
          }
          else if(res.err.error === `invalid Team Id`)
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.invalidTeamId'));
            this.selectedDeptName = this.previousDeptName;
          }
          else if(res.err.error === 'missing deptId')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.missingDepartmentId'));
          }
          else if(res.err.error === 'missing Department Id')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.missingDepartmentId'));
          }
          else if(res.err.error === 'invalid Department Id')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.invalidDepartmentId'));
          }
          else if(res.err.error === `the team ${DeleteTeamIdd} is not attached to the department ${selectedDeptDatas.DeptId}`)
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.theteamisnotattachedtothedepartment'));
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
          this.depattoteamdetailserrors = [];
          this.teamInformationEditState = false;
          await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteDepartmentSuccessfully'), 'success'])
          await this.getAllDepartments();
          this.selectedDeptName = '';
          this.previousDeptName = '';
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } 
        this.isOpenConfirmModal = false
        this.$store.dispatch('loading/set', false)
      }else{
        const DeleteTeamId = this.$route.params.id;
        let selectedDeptDatass = this.TeamDeptId || this.TeamDeptId===undefined || this.TeamDeptId===null ? this.TeamDeptId : ""
        const res = await removeTeamFromDepartmet({ "hashId": DeleteTeamId, "deptId": selectedDeptDatass});
        if(res.err)
        {
          if(res.err.error === 'missing Id')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.missingteamId'));
            this.selectedDeptName = this.previousDeptName;
          }
          else if(res.err.error === `invalid Team Id`)
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.invalidTeamId'));
            this.selectedDeptName = this.previousDeptName;
          }
          else if(res.err.error === 'missing deptId')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.pleaseSelectDepartment'));
          }
          else if(res.err.error === 'missing Department Id')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.missingDepartmentId'));
          }
          else if(res.err.error === 'invalid Department Id')
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.invalidDepartmentId'));
          }
          else if(res.err.error === `the team ${DeleteTeamId} is not attached to the department ${selectedDeptDatass}`)
          {
            this.depattoteamdetailserrors.push(this.$t('APIError.theteamisnotattachedtothedepartment'));
            this.selectedDeptName = this.previousDeptName;
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
          this.depattoteamdetailserrors = [];
          this.teamInformationEditState = false;
          await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteDepartmentSuccessfully'), 'success'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
          await this.getAllDepartments();
          this.selectedDeptName = '';
          this.previousDeptName = '';
        } 
        this.isOpenConfirmModal = false
        this.$store.dispatch('loading/set', false)
      }
    },
    async profileSubmit() {
      this.teamdetailserrors = []
      this.errors = []
      this.teamprofileerrors = []
      this.$store.dispatch('loading/set', true)


      let msg;
      var unassignManagerress="";
      if(this.prevselectedTeamManagerUserId)
      {
        unassignManagerress = await unassignManager({UserId: this.prevselectedTeamManagerUserId,TeamId: this.$route.params.id})
        if (unassignManagerress.err) {
        } else {
        }
        this.$store.dispatch('loading/set', false)
      }
      
      //assign updated as a manager 
      const assignManagerres = await assignManagerRole({UserId: this.selectedTeamManagerUserId,TeamId: this.$route.params.id,Role: "MANAGER"}); 
      if (assignManagerres.err) {
      } else {
        await this.getUsers();
      }

      // this.OldValueForDepartmentSelect = this.selectedDeptName;
      if (this.selectedDeptName === "remove_department") {      
        this.isOpenConfirmModal=true
      }else if(this.selectedDeptName === ""){
        if(this.previousDeptName){
          this.selectedDeptName = this.previousDeptName ? this.previousDeptName : this.selectedDeptName;
          this.teamInformationEditState = false;
        }else{
         // this.isOpenConfirmModal=true
        }
      }

        const businessId = this.$store.state.account.data.businessId
        this.updatedTeamDeptId = this.deptsalldata.find(department => department.DeptName === this.selectedDeptName);
        var selectedDeptData = this.updatedTeamDeptId || this.updatedTeamDeptId!==undefined ? this.updatedTeamDeptId : ""
        if(this.selectedDeptName || selectedDeptData == "") {
          if (this.isChangedOrNot) {
            var teamdata ={ 
              "Id": this.$route.params.id, 
              "BusinessId": businessId, 
              "TeamName": this.teamdatas.TeamName, 
              "Description": this.teamdatas.Description, 
              "DeptId": selectedDeptData.DeptId ? selectedDeptData.DeptId : selectedDeptData }
            var res =  await updateTeam(teamdata)
          } else {
            var teamdata ={ 
              "Id": this.$route.params.id, 
              "BusinessId": businessId, 
              "TeamName": this.teamdatas.TeamName, 
              "Description": this.teamdatas.Description, 
              "DeptId": selectedDeptData.DeptId ? selectedDeptData.DeptId : selectedDeptData }
              var res =  await updateTeam(teamdata)
          }
          if(res.err)
          {
            if(res.err.error === `missing Id`)
            {
              this.teamprofileerrors.push(this.$t('APIError.missingId'));
            }
            else if(res.err.error === `invalid TeamId`)
            {
              this.teamprofileerrors.push(this.$t('APIError.invalidTeamId'));
            }
            else if(res.err.error === `missing BusinessId`)
            {
              this.teamprofileerrors.push(this.$t('APIError.missingBusinessId'));
            }
            else if(res.err.error === `invalid BusinessId`)
            {
              this.teamprofileerrors.push(this.$t('APIError.invalidBusinessId'));
            }
            else if(res.err.error === 'missing TeamName')
            {
              this.teamprofileerrors.push(this.$t('APIError.missingTeamName'));
            }
            else if(res.err.error === 'Team Name already exists')
            {
              this.teamprofileerrors.push(this.$t('APIError.TeamNamealreadyexists'));
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
            this.teamprofileerrors = [];
            document.querySelector("#test_teamname").textContent = this.teamdatas.TeamName;
            await this.$store.dispatch('team/update', teamdata)
            await this.$store.dispatch('loading/setGlobal', false)
            this.uteamData = JSON.parse(JSON.stringify(this.teamdatas))
            this.teamInformationEditState = false;
            this.isUpdated = true
            await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.updateTeamSuccessfully'), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          } 
        }
      this.$store.dispatch('loading/set', false)
    },
    directUpload() {
      this.$refs.file_input.click()
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
      this.teamdetailserrors = []
      this.errors = []
      this.teamManagerError = [];
      this.UserAvatarError = [];
      this.depattoteamdetailserrors= [];
      this.teamprofileerrors = [];
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
.error-msg{
  margin-bottom: 8px;
}
#main-wrapper-content-scroll{
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
  &.dark{
    .cls-department-select.input--disabled{
        select{
          background-color: var(--bib-gray4) !important;
        }
    }
      .remove-icon{
      background-color: var(--bib-surface-tertiary);
      border-color: var(--bib-border-primary);
    }
  }
}
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
