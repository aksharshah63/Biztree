<template>
  <div :class="(selectedTeam.length >= 2)&&(selectedTeammates.length >= 2) ? 'teamsanddepartmentaddteam' : 'teamsanddepartment' " class="deptmodel" @keyup.enter="handleSubmit()">
    <bib-modal-wrapper v-if="show" size="lg" @close="close" :title="computedTitle">
      <div slot="content" class="pl-1 pr-1">
        <!-- <div v-if="depterrors" >
          <div v-for="(depterror, index) in depterrors" :key="index" class="font-w-600 text-danger bg-danger-sub3 text-center mr-1 ml-1 p-1 mb-1 shape-sharp">
            {{depterror}}
          </div>
        </div> -->
       
        <template v-if="!team">
          <bib-input type="text" v-model="DeptName" :variant="lightThemeChecked ? 'light' : 'dark'" :label="`${$t('common.departmentName')} *`" :placeholder="`${$t('common.departmentName')}`" required></bib-input>
          <div v-if="errors">
            <div v-for="(error, index) in errors" :key="index" class="text-danger font-sm">
              {{ error }}
            </div>
          </div>
          <div class="teammemeber_dropdown">
          <div class="mt-2 mb-2 team-dropdowns" id="team-dropdowns">
            <bib-input class="mb-05 input-wrap" type="text" v-model="invite_team_member" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.inviteTeamMembers')" :placeholder="$t('common.enterNameOrEmail')" @keyup.enter="handleEnterKeyss" @input="searchTeammatess" required></bib-input>
            <div v-if="usererrors">
              <div v-for="(error, index) in usererrors" :key="index" class="text-danger font-sm">
                {{ error }}
              </div>
            </div>
            <div v-if="suggestionss.length" class="suggestions" :class="lightThemeChecked ? 'bg-light-sub2 border-gray11' : 'bg-dark border-surface-tertiary'">
              <div v-for="(suggestion, index) in suggestionss" :key="index" :class="['suggestion-item d-flex align-center',lightThemeChecked ? 'bg-hover-light text-black text-hover-text-secondary' : 'bg-hover-surface-tertiary text-gray4 text-hover-text-secondary border-bottom-surface-tertiary']" @click="selectTeammates(suggestion)">
                  <img :src="suggestion.Photo ? suggestion.Photo : `/img/default_avatar.svg`" /> 
                  <div class="user-name">
                    {{ truncateText(suggestion.FirstName + ' ' + suggestion.LastName, 25) }}
                  </div> 
                  <div class="user-email">
                    {{ truncateText(suggestion.Email, 25) }}
                  </div>
              </div>
            </div>
            <div class="selected-teammates">
              <div v-for="(user, index) in selectedTeammatess" :key="index" class="teammate-user">
                <img :src="user.photo ? user.photo :'/img/default_avatar.svg'" class="teammate-user__img" />
                <div class="teammate-user__name" :title="displayUserFullNames[index] ? user.name : truncateUserName(user.name, index)" @click="toggleUserNameDisplay(index)">
                  {{ displayUserFullNames[index] ? user.name : truncateUserName(user.name, index) }}
                </div> 
                <div class="teammate-user__email">({{ user.email }})</div>
                <div class="teammate-user__clear" @click="clearTeammates(user.name)">×</div>
              </div>
            </div>
          </div>
        </div>
        </template>
        <template v-else-if="context === 'users'">
           <div class="teammemeber_dropdown">
          <div class="mt-2 mb-2 team-dropdowns" id="team-dropdowns">
            <bib-input class="mb-05 input-wrap" type="text" v-model="invite_team_member" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.inviteTeamMembers')" :placeholder="$t('common.enterNameOrEmail')" @keyup.enter="handleEnterKey" @input="searchTeammates" required></bib-input>
            <div v-if="usererrors">
              <div v-for="(error, index) in usererrors" :key="index" class="text-danger font-sm">
                {{ error }}
              </div>
            </div>
            <div v-if="suggestions.length" class="suggestions" :class="lightThemeChecked ? 'bg-light-sub2 border-gray11' : 'bg-dark border-surface-tertiary'">
              <div v-for="(suggestion, index) in suggestions" :key="index" :class="['suggestion-item d-flex align-center',lightThemeChecked ? 'bg-hover-light text-black text-hover-text-secondary ' : 'bg-hover-surface-tertiary text-gray4 text-hover-text-secondary  border-bottom-surface-tertiary']" @click="selectTeammate(suggestion)">
                  <img :src="suggestion.UserAvatar ? suggestion.UserAvatar : `/img/default_avatar.svg`" /> 
                  <div class="user-name">
                    {{ truncateText(suggestion.Name, 25) }}
                  </div> 
                  <div class="user-email">
                    {{ truncateText(suggestion.Email, 25) }}
                  </div>
              </div>
            </div>
            <div class="selected-teammates">
              <div v-for="(user, index) in selectedTeammates" :key="index" class="teammate-user">
                <img :src="user.photo ? user.photo :'/img/default_avatar.svg'" class="teammate-user__img" />
                <div class="teammate-user__name" :title="displayUserFullNames[index] ? user.name : truncateUserName(user.name, index)" @click="toggleUserNameDisplay(index)">
                  {{ displayUserFullNames[index] ? user.name : truncateUserName(user.name, index) }}
                </div> 
                <div class="teammate-user__email">({{ user.email }})</div>
                 <div v-if="$route.path.match(/^\/departments\/[\w-]+$/)">
                  <div v-if="(!$route.path.match(/^\/departments\/[\w-]+$/))||(user.userdeptid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeammatesUName = `${user?.userdeptid}`),(selectedusername=`${user.name}`),(selecteddeptname=`${selected_deptId}`)">×</div>
                </div>
                <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(user.userdeptid == null)&&(user.Id == null)">
                  <div v-if="((!$route.path.match(/^\/departments\/[\w-]+$/))&&(user.userdeptid == null))||((!$route.path.match(/^\/departments\/[\w-]+$/))&&(user.Id == null))" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeammatesUName = `${user?.userdeptid}`),(selectedusername=`${user.name}`),(selecteddeptname=`${selected_deptId}`)">×</div>
                </div>
                <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(!((user.userdeptid == null)&&(user.Id == null)))">
                  <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(user.userdeptid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeammatesUName = `${user?.userdeptid}`),(selectedusername=`${user.name}`),(selecteddeptname=`${selected_deptId}`)">×</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </template>
        <template v-else-if="context === 'deptusers'">
           <div class="teammemeber_dropdown">
          <div class="mt-2 mb-2 team-dropdowns" id="team-dropdowns">
            <bib-input class="mb-05 input-wrap" type="text" v-model="invite_team_member" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.inviteTeamMembers')" :placeholder="$t('common.enterNameOrEmail')" @keyup.enter="handleEnterKey" @input="searchTeammates" required></bib-input>
            <div v-if="depterrors">
              <div v-for="(error, index) in depterrors" :key="index" class="text-danger font-sm">
                {{ error }}
              </div>
            </div>
            <div v-if="suggestions.length" class="suggestions" :class="lightThemeChecked ? 'bg-light-sub2 border-gray11' : 'bg-dark border-surface-tertiary'">
              <div v-for="(suggestion, index) in suggestions" :key="index" :class="['suggestion-item d-flex align-center',lightThemeChecked ? 'bg-hover-light text-black text-hover-text-secondary ' : 'bg-hover-surface-tertiary text-gray4 text-hover-text-secondary  border-bottom-surface-tertiary']"  @click="selectTeammate(suggestion)">
                  <img :src="suggestion.UserAvatar ? suggestion.UserAvatar : `/img/default_avatar.svg`" /> 
                  <div class="user-name">
                    {{ truncateText(suggestion.Name, 25) }}
                  </div> 
                  <div class="user-email">
                    {{ truncateText(suggestion.Email, 25) }}
                  </div>
              </div>
            </div>
            <div class="selected-teammates">
              <div v-for="(user, index) in selectedTeammates" :key="index" class="teammate-user">
                <img :src="user.photo ? user.photo :'/img/default_avatar.svg'" class="teammate-user__img" />
                <div class="teammate-user__name" :title="displayUserFullNames[index] ? user.name : truncateUserName(user.name, index)" @click="toggleUserNameDisplay(index)">
                  {{ displayUserFullNames[index] ? user.name : truncateUserName(user.name, index) }}
                </div> 
                <div class="teammate-user__email">({{ user.email }})</div>
                <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(user.userdeptid == null)&&(user.Id == null)">
                  <div v-if="((!$route.path.match(/^\/departments\/[\w-]+$/))&&(user.userdeptid == null))||((!$route.path.match(/^\/departments\/[\w-]+$/))&&(user.Id == null))" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeammatesUName = `${user?.userdeptid}`),(selectedusername=`${user.name}`),(selecteddeptname=`${selected_deptId}`)">×</div>
                </div>
                <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(!((user.userdeptid == null)&&(user.Id == null)))">
                  <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(user.userdeptid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeammatesUName = `${user?.userdeptid}`),(selectedusername=`${user.name}`),(selecteddeptname=`${selected_deptId}`)">×</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </template>
        <template v-else-if="context === 'deptteams'">
          <bib-input type="text" v-model="dept_team_name" :variant="lightThemeChecked ? 'light' : 'dark'" :label="`${$t('common.teamName')} *`" :placeholder="$t('common.teamName')" required class="test"></bib-input>
          <div v-if="teamerrors">
            <div v-for="(terror, index) in teamerrors" :key="index" class="text-danger font-sm">
              {{ terror }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="teammemeber_dropdown">
            <div class="mt-2 mb-2 team-dropdowns" id="team-dropdowns">
              <bib-input class="mb-05 input-wrap" type="text" v-model="invite_team" :variant="lightThemeChecked ? 'light' : 'dark'" :label="`${$t('common.pleaseselectteam')} *`" :placeholder="$t('common.pleaseselectteam')" @keyup.enter="handleEnterKeys" @input="searchTeam" required></bib-input>
              <div v-if="errors">
                <div v-for="(error, index) in errors" :key="index" class="text-danger font-sm">
                  {{ error }}
                </div>
              </div>
              <div v-if="teamsuggestions.length" class="suggestions" :class="lightThemeChecked ? 'bg-light-sub2 border-gray11' : 'bg-dark border-surface-tertiary'">
                <div>
                  <div v-for="(teamsuggestion, index) in teamsuggestions" :key="index" :class="['suggestion-item d-flex align-center',lightThemeChecked ? 'bg-hover-light text-black text-hover-text-secondary ' : 'bg-hover-surface-tertiary text-gray4 text-hover-text-secondary border-bottom-surface-tertiary']" @click="selectTeam(teamsuggestion)">
                    <img :src="teamsuggestion.Photo ? teamsuggestion.Photo : `/img/default_avatar.svg`"/>
                    {{ truncateText(teamsuggestion.TeamName, 50) }}
                  </div>
                </div>
              </div>
              <!-- selected team display -->
              <div class="selected-teammates">
                <div v-for="(team, index) in selectedTeam" :key="index" class="teammate-user">
                  <img :src="team.photo ? team.photo :'/img/default_avatar.svg'" class="teammate-user__img" />
                  <div class="teammate-user__name" :title="displayTeamFullNames[index] ? team.TeamName : truncateTeamName(team.TeamName, index)" @click="toggleTeamNameDisplay(index)">
                    {{ displayTeamFullNames[index] ? team.TeamName : truncateTeamName(team.TeamName, index) }}
                  </div> 
                  <div v-if="$route.path.match(/^\/departments\/[\w-]+$/)">
                    <div v-if="(!$route.path.match(/^\/departments\/[\w-]+$/))||(team.selected_deptId == null)" class="teammate-user__clear" @click="clearTeam(team.TeamName)">×</div>
                    <div v-else class="teammate-user__clear" @click="isOpenConfirmTeamModal=true,(selectedTeamUName = `${team?.selected_TeamId}`),(selectedteamname=`${team.TeamName}`),(selectedteamdeptname=`${selected_deptId}`)">×</div>
                  </div>
                  <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(team.selected_deptId == null)&&(team.selected_TeamId == null)">
                    <div v-if="((!$route.path.match(/^\/departments\/[\w-]+$/))&&(team.selected_deptId == null))||((!$route.path.match(/^\/departments\/[\w-]+$/))&&(team.selected_TeamId == null))" class="teammate-user__clear" @click="clearTeam(team.TeamName)">×</div>
                    <div v-else class="teammate-user__clear" @click="isOpenConfirmTeamModal=true,(selectedTeamUName = `${team?.selected_TeamId}`),(selectedteamname=`${team.TeamName}`),(selectedteamdeptname=`${selected_deptId}`)">×</div>
                  </div>
                  <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(!((team.selected_deptId == null)&&(team.selected_TeamId == null)))">
                    <div v-if="(!($route.path.match(/^\/departments\/[\w-]+$/)))&&(team.selected_deptId == null)" class="teammate-user__clear" @click="clearTeam(team.TeamName)">×</div>
                    <div v-else class="teammate-user__clear" @click="isOpenConfirmTeamModal=true,(selectedTeamUName = `${team?.selected_TeamId}`),(selectedteamname=`${team.TeamName}`),(selectedteamdeptname=`${selected_deptId}`)">×</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="align-center justify-between mt-2" slot="footer" v-if="(context === 'deptteams')||(!team)">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" class="cancel-btn" pill @click="$emit('close'),cancel()"></bib-button>
        <bib-button size="lg" :label="$t('common.create')" variant="primary-24" pill @click="handleSubmit"></bib-button>
      </div>
      <div class="align-center justify-between mt-2" slot="footer" v-else>
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" class="cancel-btn" pill @click="$emit('close'),cancel()"></bib-button>
        <bib-button size="lg" :label="$t('common.add')" variant="primary-24" pill @click="handleSubmit"></bib-button>
      </div>
    </bib-modal-wrapper>
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteDepartmentPeopleText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteClearTeammate(selectedTeammatesUName,selectedusername,selecteddeptname)"
      @keyup.enter="deleteClearTeammate(selectedTeammatesUName,selectedusername,selecteddeptname)">
    </confirm-dialog>
    <confirm-dialog
      v-if="isOpenConfirmTeamModal"
      :text="$t('profile.confirmDeleteDepartmentTeamText')"
      @close="isOpenConfirmTeamModal = null"
      @confirm="deleteClearTeam(selectedTeamUName,selectedteamname,selectedteamdeptname)"
      @keyup.enter="deleteClearTeam(selectedTeamUName,selectedteamname,selectedteamdeptname)">
    </confirm-dialog>
  </div>
</template>
<script>
import { addDepartment,removeUserFromDepartment,teamUnassign,getUserNotbelongDept } from '../../../model/department';
import { getUsers, addUsertoDepartment, getTeam, addTeamtoDepartment,removeTeamFromDepartmet,addTeam } from '../../../model/team';
export default {
  props: ["show", "team","context","deptname","localdeptUsers","localdeptTeams"],
  data() {
    return {
      DeptName: null,
      dept_team_name:'',
      invite_team_member: null,
      invite_team: null,
      selectedTeammates: [],
      selectedTeammatess: [],
      selectedTeam: [],
      users: [],
      userss: [],
      teams: [],
      suggestions: [],
      suggestionss: [],
      teamsuggestions: [],
      displayTeamFullNames: [],
      displayUserFullNames: [],
      depterrors:[],
      teamerrors:[],
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      errors:[],
      usererrors:[],
      selectedTeammatesUName:null,
      selectedusername:null,
      selecteddeptname:null,
      isOpenConfirmModal:null,
      localdeptUsersSelect: this.localdeptUsers,
      selected_deptId:null,
      isUpdatingTeams: false, // Flag to control recursive updates
      localdeptTeamsSelect: this.localdeptTeams,
      selectedTeamUName:null,
      selectedteamname:null,
      selectedteamdeptname:null,
      isOpenConfirmTeamModal:null,
      testteamId:null,
    };
  },
  created() {
    if ((this.$route.path.match(/^\/departments\/[\w-]+$/))||(this.context === 'deptusers')) {
      this.getAllUserss();
    }else{
      this.getAllUsers();
    }
    this.getAllTeams();
  },
  computed: {
    computedTitle() {
      if(!this.team)
      {
          return this.$t('common.createDepartment')
      }
      else if(this.context=='users')
      {
          return this.$t("common.addteammemberstothedepartment", { dept:this.deptname })
      }
      else if(this.context=='deptusers')
      {
          return this.$t("common.addteammemberstothedepartment", { dept:this.deptname })
      }
      else if(this.context=='deptteams')
      {
          return this.$t("common.createTeam")
      }
      else
      {
        return this.$t('common.addTeam')
      }
    },
  },
  watch:{
    localdeptUsers(newData) {
      this.selectedTeammates = [];
      this.localdeptUsersSelect = newData; // Update teams when prop changes
      if (this.localdeptUsersSelect.length > 0) {
        this.localdeptUsersSelect.forEach(user => {
          if (!this.selectedTeammates.some(teammate => teammate.email === user.Email)) {
            this.selectedTeammates.push({
              selected_deptId: this.team.DeptId ? this.team.DeptId : this.team,
              teamNameUser: `${user.TeamName}`,
              userdeptid: `${user.UserId}`,
              name: `${user.Name}`,
              email: user.Email,
              photo: user.UserAvatar
            });
          }
        });
      }else{
        this.selectedTeammates = [];
      }
    },
    localdeptTeams(newVal){
      this.selectedTeam = [];
      this.localdeptTeamsSelect = newVal; // Update teams when prop changes
      if (this.localdeptTeamsSelect.length > 0) {
        this.localdeptTeamsSelect.forEach(user => {
          if (!this.selectedTeam.some(teammate => teammate.TeamName === user.TeamName)) {
            this.selectedTeam.push({
              selected_deptId: this.team.DeptId ? this.team.DeptId : this.team,
              TeamName: `${user.TeamName}`,
              selected_TeamId: `${user.Id}`,
              photo: user.UserAvatar || user.Photo
            });
          }
        });
      }else{
        this.selectedTeam = [];
      }
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    },
    // updatedteams(newVal) {
    //   if (!this.isUpdatingTeams && JSON.stringify(newVal) !== JSON.stringify(this.tempTeams)) {
    //     this.getAllTeams();
    //   }
    // },
    team(newValteam) {
      if (newValteam) {
        this.getAllUserss();
      }
    },
    selectedTeammates(newValTeammates){
      if(newValTeammates){
        this.getAllUserss();
      }
    },
    selectedTeammatess(newValTeammatess){
      if(newValTeammatess){
        this.getAllUsers();
      }
    },
    selectedTeam(newValTeams){
      if(newValTeams){
        this.getAllTeams();
      }
    }
  },
  
  methods: {
    async getAllUsers() {
      const businessId = this.$store.state.account.data.businessId;
      this.userss = await getUsers({ hashId: businessId });
    },
    async getAllUserss() {
      const businessId = this.$store.state.account.data.businessId;
      const deptnewid = this.team.DeptId ? this.team.DeptId : this.team;

      this.users = await getUserNotbelongDept({ hashId: deptnewid,BusinessId: businessId });
    },
    // async getUserNotbelongDept(){

    // },
    async getAllTeams() {
      const businessId = this.$store.state.account.data.businessId;
      this.teams = await teamUnassign({ BusinessId: businessId });
    },
    searchTeammates() {
      let searchQuery = this.invite_team_member.trim().toLowerCase();
      if (searchQuery.length > 0) {
        const searchTerms = searchQuery.split(/\s+/);
        this.suggestions = this.users.filter(user => {
          return searchTerms.every(term =>
            user.Name.toLowerCase().includes(term) ||
            //user.LastName.toLowerCase().includes(term) ||
            user.Email.toLowerCase().includes(term)
          );
        });
      } else {
        this.suggestions = [];
      }
    },
    searchTeammatess() {
      let searchQuery = this.invite_team_member.trim().toLowerCase();
      if (searchQuery.length > 0) {
        const searchTerms = searchQuery.split(/\s+/);
        this.suggestionss = this.userss.filter(users => {
          return searchTerms.every(term =>
          users.FirstName.toLowerCase().includes(term) ||
          users.LastName.toLowerCase().includes(term) ||
          users.Email.toLowerCase().includes(term)
          );
        });
      } else {
        this.suggestionss = [];
      }
    },
    searchTeam() {
      let searchQuery = this.invite_team.trim().toLowerCase();
      if (searchQuery.length > 0) {
        const searchTerms = searchQuery.split(/\s+/);
        this.teamsuggestions = this.teams.result.filter(team => {
          return searchTerms.every(term =>
            team.TeamName.toLowerCase().includes(term)
          );
        });
      } else {
        this.teamsuggestions = [];
      }
    },
    selectTeammate(user) {
      if (!this.selectedTeammates.some(teammate => teammate.email === user.Email)) {
        this.selectedTeammates.push({
          // name: `${user.FirstName} ${user.LastName}`,
          name: `${user.Name}`,
          email: user.Email,
          photo: user.Photo ? user.Photo : user.UserAvatar
        });
      }
      this.invite_team_member = '';
      this.suggestions = [];
    },
    selectTeammates(user) {
      if (!this.selectedTeammatess.some(teammate => teammate.email === user.Email)) {
        this.selectedTeammatess.push({
          name: `${user.FirstName} ${user.LastName}`,
          email: user.Email,
          photo: user.Photo ? user.Photo : user.UserAvatar
        });
      }
      this.invite_team_member = '';
      this.suggestionss = [];      
    },
    truncateUserName(name) {
      return name.length > 15 ? name.slice(0, 15) + '...' : name;
    },
    toggleUserNameDisplay(index) {
      this.$set(this.displayUserFullNames, index, !this.displayUserFullNames[index]);
    },
    selectTeam(team) {
      if (!this.selectedTeam.some(teamm => teamm.TeamName === team.TeamName)) {
        this.selectedTeam.push({
          TeamName: `${team.TeamName}`,
          photo: team.Photo ? team.Photo : team.UserAvatar
        });
      }
      this.invite_team = '';
      this.teamsuggestions = [];
    },
    truncateTeamName(TeamName) {
      return TeamName.length > 15 ? TeamName.slice(0, 50) + '...' : TeamName;
    },
    toggleTeamNameDisplay(index) {
      this.$set(this.displayTeamFullNames, index, !this.displayTeamFullNames[index]);
    },
    clearTeammate(name) {
      this.selectedTeammates = this.selectedTeammates.filter(e => (name !== e.name));
    },
    clearTeammates(name) {
      this.selectedTeammatess = this.selectedTeammatess.filter(e => (name !== e.name));
    },
    clearTeam(TeamName) {
      this.selectedTeam = this.selectedTeam.filter(e => (TeamName !== e.TeamName));
    },
    handleEnterKey() {
      const matchingUser = this.users.find(
        user =>
          (user.Email === this.invite_team_member && this.$store.state.account.data.businessId === user.BusinessId) ||
          (user.Name === this.invite_team_member && this.$store.state.account.data.businessId === user.BusinessId)
          // (user.LastName === this.invite_team_member && this.$store.state.account.data.businessId === user.BusinessId)
      );

      if (matchingUser) {
        this.selectTeammate(matchingUser);
      }
    },
    handleEnterKeyss() {
      const matchingUsers = this.userss.find(
        users =>
          (users.Email === this.invite_team_member && this.$store.state.account.data.businessId === users.BusinessId) ||
          (users.Name === this.invite_team_member && this.$store.state.account.data.businessId === users.BusinessId)
          // (user.LastName === this.invite_team_member && this.$store.state.account.data.businessId === user.BusinessId)
      );
      if (matchingUsers) {
        this.selectTeammates(matchingUsers);
      }
    },
    handleEnterKeys() {
      const matchingTeam = this.teams.result.find(
        team => team.TeamName === this.invite_team
      );
      if (matchingTeam) {
        this.selectTeam(matchingTeam);
      }
    },
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + '...';
      }
      return text;
    },
    async deleteClearTeam(TeamIdClear,TeamName,deptIdClear){
      const deptidss = this.team.DeptId ? this.team.DeptId : this.team;
      const res = await removeTeamFromDepartmet({ hashId: TeamIdClear, deptId: deptidss });
      let msg;
      if(res.err)
      {
        if(res.err.error === `missing Team Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid Team Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `missing Department Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid Department Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `the team ${TeamIdClear} is not attached to the department ${this.deptidss}`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.theteamisnotattachedtothedepartment'), 'danger'])
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
        msg = this.$t("APISuccess.teamRemoveFromDeptSuccessfully", { deptName: this.deptname })
        await this.$store.dispatch('notification/set', [true, msg, 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        this.clearTeam(TeamName)
        this.$emit('add-team',deptidss)
        this.$emit('refresh')
        this.$store.dispatch('loading/set', false)
      }
      this.isOpenConfirmTeamModal = false
    },
    async deleteClearTeammate(UserId,uname,deptname) {
      const deptidss = this.team.DeptId ? this.team.DeptId : this.team;
      let msg;
      const res = await removeUserFromDepartment({ hashId: deptidss, UserId: UserId });
      if(res.err)
      {
        if(res.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        if(res.err.error === `missing User Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingUserId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid User Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `the user ${UserId} is already removed from the department ${deptidss}`)
        {
          msg = this.$t("APIError.theuserisalreadyremovedfromthedepartment", { userName: uname, deptName: deptname })
          this.$store.dispatch('notification/set', [true, msg, 'danger'])
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
        await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteTeammemberSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        this.clearTeammate(uname)
        this.$emit('add-member',this.team.DeptId)
        this.$emit('refresh')
        this.$store.dispatch('loading/set', false)
      }
      this.$store.dispatch('loading/set', false)
      this.isOpenConfirmModal = false
    },
    async handleSubmit() {
      let msg;
      const businessId = this.$store.state.account.data.businessId;
      let userres = '';
      let teamress = '';
      let userresss = '';
      let userress = '';
      let teamres = '';
      let userresaddUsertoDepartment  = '';
      let userresaddUsertoDepartments = '';
      var createteamres = '';
      var addteamress = '';

      if (!this.team) {
        this.depterrors = [];
        this.errors=[];
        this.usererrors=[];
        var deptres = await addDepartment({ "BusinessId": businessId, "DeptName": this.DeptName });
        if(deptres.err)
        {
          if(deptres.err.error === 'missing BusinessId')
          {
            this.errors.push(this.$t('APIError.missingBusinessId'));
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
          else if(deptres.err.error === 'invalid BusinessId')
          {
            this.errors.push(this.$t('APIError.invalidBusinessId'));
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
          else if(deptres.err.error === 'missing DeptName')
          {
            this.errors.push(this.$t('APIError.missingDeptName'));
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
          else if(deptres.err.error === 'Department Name already exists')
          {
            this.errors.push(this.$t('APIError.DeptNamealreadyexists'));
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
          await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addDepartmentSuccessfully'), 'success'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        if (this.selectedTeammatess.length > 0) {
          await Promise.all(this.selectedTeammatess.map(async (element) => {
            const result = this.userss.filter(x => x.Email === element.email || x.FirstName === element.name || x.LastName === element.name)
            userres = await addUsertoDepartment({ "hashId": deptres.Id, "UserId": result[0].Id, "BusinessId": businessId });
            if(userres.err)
            {
              if(userres.err.error === `missing Department Id`)
              {
                this.usererrors.push(this.$t('APIError.missingDepartmentId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `missing UserId`)
              {
                this.usererrors.push(this.$t('APIError.missingUserId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `invalid UserId`)
              {
                this.usererrors.push(this.$t('APIError.invalidUserId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `missing BusinessId`)
              {
                this.usererrors.push(this.$t('APIError.missingBusinessId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `invalid BusinessId`)
              {
                this.usererrors.push(this.$t('APIError.invalidBusinessId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `the user ${result[0].Id} is already added to the department ${deptres.Id}`)
              {
                msg = this.$t("APIError.theuserisalreadyaddedtothedepartment", { userName: result[0].FirstName + " " + result[0].LastName, deptName: this.DeptName})
                this.usererrors.push(msg);
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `the department ${deptres.Id} does not belong to the business ${businessId}`)
              {
                msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.DeptName})
                this.usererrors.push(msg);
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userres.err.error === `the user ${result[0].Id} does not belong to the business ${businessId}`)
              {
                msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: result[0].FirstName + " " + result[0].LastName })
                this.usererrors.push(msg);
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
          }));
        }
        if(!deptres.err && !userres.err){
          // this.$emit('close')
          // this.$emit('refresh')
          // this.$store.dispatch('loading/set', false)
          this.close()
          this.selectedTeammatess=[];
          this.$emit('refresh')
          this.$store.dispatch('loading/set', false)
        }
      }
      else{
        function isDeptRoute(route) {
          const teamRoutePattern = /^\/departments\/[\w-]+$/;
          return teamRoutePattern.test(route);
        }
        if (isDeptRoute(this.$route.path)) {
          this.depterrors = [];
          this.errors=[];
          this.usererrors=[]; 
          this.teamerrors=[];
          
          if(this.context === 'deptteams'){
            createteamres = await addTeam({ "BusinessId": businessId, "TeamName": this.dept_team_name });            
            if (createteamres.err) {
              if(createteamres.err.error === 'missing BusinessId')
              {
                this.teamerrors.push(this.$t('APIError.missingBusinessId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(createteamres.err.error === 'invalid BusinessId')
              {
                this.teamerrors.push(this.$t('APIError.invalidBusinessId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(createteamres.err.error === 'missing TeamName')
              {
                this.teamerrors.push(this.$t('APIError.missingTeamName'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(createteamres.err.error === 'Team Name already exists')
              {
                this.teamerrors.push(this.$t('APIError.TeamNamealreadyexists'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(createteamres.err.error === 'Business not found')
              {
                this.teamerrors.push(this.$t('APIError.Businessnotfound'));
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
            if(createteamres.Id){
              addteamress = await addTeamtoDepartment({"hashId":createteamres.Id,"DeptId":this.team,"BusinessId": businessId})
              if(addteamress.err)
              {
                if(addteamress.err.error === `missing Team Id`)
                {
                  this.teamerrors.push(this.$t('APIError.missingteamId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `missing Department Id`)
                {
                  this.teamerrors.push(this.$t('APIError.missingDepartmentId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `invalid Department Id`)
                {
                  this.teamerrors.push(this.$t('APIError.invalidDepartmentId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `missing Business Id`)
                {
                  this.teamerrors.push(this.$t('APIError.missingBusinessId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `invalid Business Id`)
                {
                  this.teamerrors.push(this.$t('APIError.invalidBusinessId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `the department ${this.team} does not belongs to the business ${businessId}`)
                {
                  msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname })
                  this.teamerrors.push(msg);
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `the team ${this.dept_team_name} is already attached to the department ${this.team}`)
                {
                  msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { teamName: this.dept_team_name, deptName: this.deptname })
                  this.teamerrors.push(msg);
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(addteamress.err.error === `One team can be assigned to one department`)
                {
                  this.teamerrors.push(this.$t('APIError.Oneteamcanbeassignedtoonedepartment'));
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
                await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.teamCreateAddDeptSuccessfully'), 'success'])
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
            }
            if(!createteamres.err){              
              this.close()
              //this.getAllUserss()
              this.$emit('refresh')
              this.$store.dispatch('loading/set', false)
            }
          }

          if(this.context === 'users'){
            if (this.selectedTeammates.length > 0) {
              await Promise.all(this.selectedTeammates.map(async (element) => {
                // const result = this.users.filter(x => x.Email === element.email || x.FirstName === element.name || x.LastName === element.name);
                const result = this.users.filter(x => x.Email === element.email || x.Name === element.name || x.LastName === element.name);
                if (result.length > 0) { // Ensure that results[0] is defined
                  userresaddUsertoDepartment = await addUsertoDepartment({ "hashId": this.team, "UserId": result[0].DeptUserId, "BusinessId": businessId });                                
                  if(userresaddUsertoDepartment.err)
                  {
                    if(userresaddUsertoDepartment.err.error === `missing Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `invalid Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `missing UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `invalid UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `missing BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `invalid BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `the user ${result[0].Id} is already added to the department ${this.team}`)
                    {                    
                      msg = this.$t("APIError.theuserisalreadyaddedtothedepartment", { userName: result[0].Name, deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `the department ${this.team} does not belong to the business ${businessId}`)
                    {                    
                      msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartment.err.error === `the user ${result[0].Id} does not belong to the business ${businessId}`)
                    {                    
                      msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: result[0].Name})
                      this.depterrors.push(msg);
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
                    await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addTeammemberSuccessfully'), 'success'])
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                }
              }));
            }
            else{
              userresaddUsertoDepartment = await addUsertoDepartment({ "hashId":  this.team, "UserId": "", "BusinessId": businessId });
              if(userresaddUsertoDepartment.err)
              {
                if(userresaddUsertoDepartment.err.error === `missing Department Id`)
                {
                  this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartment.err.error === `invalid Department Id`)
                {
                  this.depterrors.push(this.$t('APIError.invalidDepartmentId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartment.err.error === `missing UserId`)
                {
                  this.usererrors.push(this.$t('APIError.missingUserId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartment.err.error === `invalid UserId`)
                {
                  this.depterrors.push(this.$t('APIError.invalidUserId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartment.err.error === `missing BusinessId`)
                {
                  this.depterrors.push(this.$t('APIError.missingBusinessId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartment.err.error === `invalid BusinessId`)
                {
                  this.depterrors.push(this.$t('APIError.invalidBusinessId'));
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
            }
            if(!userresaddUsertoDepartment.err){
              this.close()
              //this.getAllUserss()
              this.$emit('refresh')
              this.$store.dispatch('loading/set', false)
            }
          }
          else{
            if (this.selectedTeam.length > 0) {
              await Promise.all(this.selectedTeam.map(async (element) => {
                const results = this.teams.result.filter(x => x.TeamName === element.TeamName)
                if (results.length > 0) { // Ensure that results[0] is defined
                  teamress = await addTeamtoDepartment({"hashId":results[0].TeamId,"DeptId":this.team,"BusinessId": businessId})
                  if(teamress.err)
                  {
                    if(teamress.err.error === `missing Team Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingteamId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `invalid Team Id`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidTeamId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `missing Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `invalid Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `missing Business Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `invalid Business Id`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `the department ${this.team} does not belongs to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname })
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `the team ${results[0].TeamName} is already attached to the department ${this.team}`)
                    {
                      msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { teamName: results[0].TeamName, deptName: this.deptname })
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(teamress.err.error === `One team can be assigned to one department`)
                    {
                      this.depterrors.push(this.$t('APIError.Oneteamcanbeassignedtoonedepartment'));
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
                    await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.teamAddDeptSuccessfully'), 'success'])
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                }
              }));
              this.$emit('refresh');
            }
            if (!this.selectedTeam.length) {
              this.errors.push(this.$t('APIError.Atleastoneteamisrequired'));
              return; // Exit early if any required fields are missing
            }
            if (this.selectedTeammates.length > 0) {
              await Promise.all(this.selectedTeammates.map(async (element) => {
                // const result = this.users.filter(x => x.Email === element.email || x.FirstName === element.name || x.LastName === element.name)
                const result = this.users.filter(x => x.Email === element.email || x.Name === element.name)
                if (result.length > 0) { // Ensure that results[0] is defined
                  userresss = await addUsertoDepartment({ "hashId": this.team, "UserId": result[0].DeptUserId, "BusinessId": businessId });
                  if(userresss.err)
                  {
                    if(userresss.err.error === `missing Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `missing UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `invalid UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `missing BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `invalid BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `the user ${result[0].Id} is already added to the department ${this.team}`)
                    {
                      msg = this.$t("APIError.theuserisalreadyaddedtothedepartment", { userName: result[0].Name, deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `the department ${this.team} does not belong to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresss.err.error === `the user ${result[0].Id} does not belong to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: result[0].Name})
                      this.depterrors.push(msg);
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
                }
              }));
            }
            if(!teamress.err && !userresss.err && !createteamres.err){              
              this.close()
              this.getAllUsers()
              this.getAllTeams()
              this.$emit('refresh')
              this.$store.dispatch('loading/set', false)
            }
          }
        }else{
          this.depterrors = [];
          this.errors=[];
          this.usererrors=[];
         // this.teamerrors=[];
          if(this.context === 'deptusers'){
            
            if (this.selectedTeammates.length > 0) {
              await Promise.all(this.selectedTeammates.map(async (element) => {
                const results = this.users.filter(x => x.Email === element.email || x.Name === element.name);
                if (results.length > 0) { // Ensure that results[0] is defined
                  userresaddUsertoDepartments = await addUsertoDepartment({ "hashId": this.team.DeptId, "UserId": results[0].DeptUserId, "BusinessId": businessId });
                  if(userresaddUsertoDepartments.err)
                  {
                    if(userresaddUsertoDepartments.err.error === `missing Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `invalid Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `missing UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `invalid UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `missing BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `invalid BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `the user ${results[0].Id} is already added to the department ${this.team.DeptId}`)
                    {
                      msg = this.$t("APIError.theuserisalreadyaddedtothedepartment", { userName: results[0].Name, deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `the department ${this.team.DeptId} does not belong to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userresaddUsertoDepartments.err.error === `the user ${results[0].Id} does not belong to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: results[0].Name})
                      this.depterrors.push(msg);
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
                    this.$emit('add-member',this.team.DeptId)
                    await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addTeammemberSuccessfully'), 'success'])
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                }
              }));
            }
            else{
              userresaddUsertoDepartments = await addUsertoDepartment({ "hashId": this.team.DeptId, "UserId": "", "BusinessId": businessId });
              if(userresaddUsertoDepartments.err)
              {
                if(userresaddUsertoDepartments.err.error === `missing Department Id`)
                {
                  this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartments.err.error === `invalid Department Id`)
                {
                  this.depterrors.push(this.$t('APIError.invalidDepartmentId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartments.err.error === `missing UserId`)
                {
                  this.depterrors.push(this.$t('APIError.missingUserId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartments.err.error === `invalid UserId`)
                {
                  this.depterrors.push(this.$t('APIError.invalidUserId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartments.err.error === `missing BusinessId`)
                {
                  this.depterrors.push(this.$t('APIError.missingBusinessId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userresaddUsertoDepartments.err.error === `invalid BusinessId`)
                {
                  this.depterrors.push(this.$t('APIError.invalidBusinessId'));
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
            }
            if(!userresaddUsertoDepartments.err){              
              this.close()
              this.selectedTeammates=[];
              this.$emit('refresh')
              this.$store.dispatch('loading/set', false)
            }
          }else{            
            if (this.selectedTeam.length > 0) {
              await Promise.all(this.selectedTeam.map(async (element) => {
                const results = this.teams.result.filter(x => x.TeamName === element.TeamName);
                if (results.length > 0) { // Ensure that results[0] is defined
                  const testteamid = results[0].TeamId;
                  teamres = await addTeamtoDepartment({ "hashId": testteamid, "DeptId": this.team.DeptId, "BusinessId": businessId })
                  if (teamres.err) {
                    if (teamres.err.error === `missing Team Id`) {
                      this.depterrors.push(this.$t('APIError.missingteamId'));
                    } else if (teamres.err.error === `invalid Team Id`) {
                      this.depterrors.push(this.$t('APIError.invalidTeamId'));
                    } else if (teamres.err.error === `missing Department Id`) {
                      this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                    } else if (teamres.err.error === `invalid Department Id`) {
                      this.depterrors.push(this.$t('APIError.invalidDepartmentId'));
                    } else if (teamres.err.error === `missing Business Id`) {
                      this.depterrors.push(this.$t('APIError.missingBusinessId'));
                    } else if (teamres.err.error === `invalid Business Id`) {
                      this.depterrors.push(this.$t('APIError.invalidBusinessId'));
                    } else if (teamres.err.error === `the department ${this.team.DeptId} does not belongs to the business ${businessId}`) {
                      const msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname });
                      this.depterrors.push(msg);
                    } else if (teamres.err.error === `the team ${results[0].TeamName} is already attached to the department ${this.team.DeptId}`) {
                      const msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { teamName: results[0].TeamName, deptName: this.deptname });
                      this.depterrors.push(msg);
                    } else if (teamres.err.error === `One team can be assigned to one department`) {
                      this.depterrors.push(this.$t('APIError.Oneteamcanbeassignedtoonedepartment'));
                    } else {
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', '']);
                      }, 5000);
                    }
                  } else {
                    this.$emit('add-team', this.team.DeptId);
                    await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.teamAddDeptSuccessfully'), 'success']);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', '']);
                    }, 5000);
                  }
                }
              }));
            }
            else {
              this.errors.push(this.$t('APIError.Atleastoneteamisrequired'));
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
              return; // Exit early if any required fields are missing
            }
            if (this.selectedTeammates.length > 0) {
              await Promise.all(this.selectedTeammates.map(async (element) => {
                const result = this.users.filter(x => x.Email === element.email || x.Name === element.name);
                if (result.length > 0) { // Ensure that results[0] is defined
                  userress = await addUsertoDepartment({ "hashId": this.team.DeptId, "UserId": result[0].DeptUserId, "BusinessId": businessId });
                  if(userress.err)
                  {
                    if(userress.err.error === `missing Department Id`)
                    {
                      this.depterrors.push(this.$t('APIError.missingDepartmentId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `missing UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `invalid UserId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidUserId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `missing BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.missingBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `invalid BusinessId`)
                    {
                      this.depterrors.push(this.$t('APIError.invalidBusinessId'));
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `the user ${result[0].Id} is already added to the department ${this.team.DeptId}`)
                    {
                      msg = this.$t("APIError.theuserisalreadyaddedtothedepartment", { userName: result[0].Name, deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `the department ${this.team.DeptId} does not belong to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.thedepartmentdoesnotbelongtothebusiness", { deptName: this.deptname})
                      this.depterrors.push(msg);
                      setTimeout(async () => {
                        await this.$store.dispatch('notification/set', [false, '', ''])
                      }, 5000)
                    }
                    else if(userress.err.error === `the user ${results[0].Id} does not belong to the business ${businessId}`)
                    {
                      msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: result[0].Name})
                      this.depterrors.push(msg);
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
                    this.$emit('add-member',this.team.DeptId)
                    await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addTeamSuccessfully'), 'success'])
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                }
              }));
            }
            if(!userress.err && !teamres.err) 
            {
              this.close()
              this.selectedTeammates=[];
              this.selectedTeam=[];
              this.$emit('refresh')
              this.$store.dispatch('loading/set', false)
            }
          } 
        }
      }
      this.$emit('refresh');
    },
    cancel() {
      this.DeptName = "";
      this.dept_team_name = "";
      this.invite_team_member = "";
      this.invite_team = "";
      if((!this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammates.userdeptid==undefined)){
        if(!(this.selectedTeammates.length > 0)){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      if((!this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammatess.userdeptid==undefined)){
        if(!(this.selectedTeammatess.length > 0)){
          this.selectedTeammatess = this.selectedTeammatess.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammatess = [];
        }
      }
      
      if((this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammates.userdeptid==undefined)){
        if(this.selectedTeammates.length > 0){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      if((this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammatess.userdeptid==undefined)){
        if(this.selectedTeammatess.length > 0){
          this.selectedTeammatess = this.selectedTeammatess.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammatess = [];
        }
      }
      
      if((!this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeam.selected_deptId==undefined)){
        if(!(this.selectedTeam.length > 0)){
          this.selectedTeam = this.selectedTeam.filter(teams => teams.selected_deptId !== undefined);
        }else{
          this.selectedTeam = [];
        }
      }
      if((this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeam.selected_deptId==undefined)){
        if(this.selectedTeam.length > 0){
          this.selectedTeam = this.selectedTeam.filter(teams => teams.selected_deptId !== undefined);
        }else{
          this.selectedTeam = [];
        }
      }
      // this.selectedTeammates = [];
      // this.selectedTeam = [];
      this.depterrors = [];
      this.teamerrors = [];
      this.suggestions = [];
      this.teamsuggestions = [];
      this.errors = [];
      this.usererrors = [];
      this.$emit('close');
    },
    close() {
      this.DeptName = "";
      this.dept_team_name = "";
      this.invite_team_member = "";
      this.invite_team = "";
      if((!this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammates.userdeptid==undefined)){
        if(!(this.selectedTeammates.length > 0)){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      if((!this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammatess.userdeptid==undefined)){
        if(!(this.selectedTeammatess.length > 0)){
          this.selectedTeammatess = this.selectedTeammatess.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammatess = [];
        }
      }

      if((this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammates.userdeptid==undefined)){
        if(this.selectedTeammates.length > 0){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      if((this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeammatess.userdeptid==undefined)){
        if(this.selectedTeammatess.length > 0){
          this.selectedTeammatess = this.selectedTeammatess.filter(teammate => teammate.userdeptid !== undefined);
        }else{
          this.selectedTeammatess = [];
        }
      }
      if((!this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeam.selected_deptId==undefined)){
        if(!(this.selectedTeam.length > 0)){
          this.selectedTeam = this.selectedTeam.filter(teams => teams.selected_deptId !== undefined);
        }else{
          this.selectedTeam = [];
        }
      }
      if((this.$route.path.match(/^\/departments\/[\w-]+$/))&&(this.selectedTeam.selected_deptId==undefined)){
        if(this.selectedTeam.length > 0){
          this.selectedTeam = this.selectedTeam.filter(teams => teams.selected_deptId !== undefined);
        }else{
          this.selectedTeam = [];
        }
      }
      // this.selectedTeammates = [];
      //this.selectedTeam = [];
      this.depterrors = [];
      this.teamerrors = [];
      this.suggestions = [];
      this.teamsuggestions = [];
      this.errors = [];
      this.usererrors = [];
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
.teammate-user {
  display: flex;
  align-items: center;
  background: #f4f4f4;
  width: max-content;
  padding: 4px;
  margin: 5px 0;
  border-radius: 50px;
  font-size: 12px;
  *:not(:last-child) {
    margin-right: 8px;
  }
  &__img {
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 400px;
    box-shadow: 0 0 0 1px $gray4;
  }

  &__clear {
    cursor: pointer;
    color: var(--bib-secondary);
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 0;
    margin-top: -2px;
    &:hover {
      color: $gray5;
    }
    &:active {
      color: $gray6;
    }
  }
}
.team-dropdown {
  position: relative;
  .input-wrap{
    margin: 0;
  }
}
.team-dropdown{
  input{
    margin-bottom: 0 !important;
  }
}
.team-dropdowns {
  position: relative;
  .input-wrap{
    margin: 0;
  }
}
.team-dropdowns{
  input{
    margin-bottom: 0 !important;
  }
  .teammate-user{
    &:nth-child(1){
      margin-top: 16px !important;
    }
  }
}

.suggestions {
  border-radius: 4px;
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 205px; // Adjust this value to reduce the height
  overflow-y: auto;
}
.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}
.teammemeber_dropdown {
  .selected-teammates {
    max-height: 211px; /* Adjust this value as needed */
    overflow-y: auto;
  }
}
.teammate-user__name{
  cursor: pointer;
}
.modal__wrapper__content{
  .suggestions{
    border-top: none;
    border-radius: 0 0 4px 4px;

    .suggestion-item{
      gap: 10px;
      font-size: 15px;
      line-height: 21px;

      img{
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
      .user-name{
        word-break: break-all;
      }
      .user-email{
        word-break: break-all;
        font-weight: normal;
      }      
    }
  }
}

.deptmodel {
  .dark {
    color: var(--bib-gray6);
  }
}

.modal__wrapper--dark{
  .teammate-user{
    background-color: #343437;
    color: var(--bib-white);

    &__clear{
      color: var(--bib-secondary);
    }
  }
}

.teamsanddepartmentaddteam{
  .modal__mask{
    display: flex;
    .modal__wrapper{
      overflow-y: auto;
      max-height: 80%;
      scrollbar-color : transparent transparent !important;

      .cancel-btn{
          color: var(--bib-secondary) !important;
        }
    }
  }
}


</style>