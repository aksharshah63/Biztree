<template>
  <div class="teamsanddepartment" @keyup.enter="createTeam()">
    <bib-modal-wrapper v-if="show" size="lg" @close="close" :title="computedTitle">
      <div slot="content" class="pl-1 pr-1">
        <div v-if="teamerrors" >
          <div v-for="(teamerror, index) in teamerrors" :key="index" class="font-w-600 text-danger bg-danger-sub3 text-center mr-1 ml-1 p-1 mb-1 shape-sharp">
            {{teamerror}}
          </div>
        </div>

        <template v-if="!team">
          <!-- <div :class="['font-w-700 pb-2',{'dark': !lightThemeChecked}]">{{ $t("common.createTeam") }}</div> -->
          <bib-input type="text" v-model="team_name" :variant="lightThemeChecked ? 'light' : 'dark'" :label="`${$t('common.teamName')} *`" :placeholder="$t('common.teamName')" required class="test"></bib-input>
          <div v-if="errors">
            <div v-for="(error, index) in errors" :key="index" class="text-danger font-sm">
              {{ error }}
            </div>
          </div>
          <div class="teammemeber_dropdown">
            <div class="mt-2 mb-2 team-dropdown" id="team-dropdown">
              <bib-input class="mb-05 input-wrap" type="text" v-model="invite_team_member" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.inviteTeamMembers')" :placeholder="$t('common.enterNameOrEmail')" @keyup.enter="handleEnterKeys" @input="searchTeammatess" required></bib-input>
              <div v-if="usererrors">
                <div v-for="(error, index) in usererrors" :key="index" class="text-danger font-sm">
                  {{ error }}
                </div>
              </div>
              <div v-if="suggestionss.length" class="suggestions" :class="lightThemeChecked ? 'bg-light-sub2 border-gray11' : 'bg-dark border-surface-tertiary'">
                <div>
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
              </div>
              
              <div class="selected-teammates">
                <div v-for="(user, index) in selectedTeammates" :key="index" class="teammate-user">
                  <img :src="user.photo ? user.photo :'/img/default_avatar.svg'" class="teammate-user__img" />
                  <div
                    class="teammate-user__name"
                    :title="displayFullNames[index] ? user.name : truncateName(user.name, index)"
                    @click="toggleNameDisplay(index)"
                    >
                    {{ displayFullNames[index] ? user.name : truncateName(user.name, index) }}
                  </div>            
                  <div class="teammate-user__email">({{ user.email }})</div>
                  <!-- <div v-if="((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.userteamid === null))||((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.Id === null)&&(team))" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div> -->
                
                  <!-- <div v-if="((!$route.path.match(/^\/teams\/[\w-]+$/))||(user.userteamid == null))&&(!team)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div> -->
                  <div v-if="$route.path.match(/^\/teams\/[\w-]+$/)">
                    <div v-if="(!$route.path.match(/^\/teams\/[\w-]+$/))||(user.userteamid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                    <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div>
                  </div>
                  <div v-if="(!($route.path.match(/^\/teams\/[\w-]+$/)))&&(user.userteamid == null)&&(user.Id == null)">
                    <div v-if="((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.userteamid == null))||((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.Id == null))" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                    <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div>
                  </div>
                  <div v-if="(!($route.path.match(/^\/teams\/[\w-]+$/)))&&(!((user.userteamid == null)&&(user.Id == null)))">
                    <div v-if="(!($route.path.match(/^\/teams\/[\w-]+$/)))&&(user.userteamid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                    <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div>
                  </div>
                  <!-- <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div> -->
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- <div :class="['font-w-700',{'dark': !lightThemeChecked}]">{{ $t("common.inviteTeammatesToJoinYourTeam", { team: teamName }) }}</div> -->
          <div class="teammemeber_dropdown">
          <div class="mt-2 mb-2 team-dropdown" id="team-dropdown">
            <bib-input class="mb-05 input-wrap" type="text" v-model="invite_team_member" :variant="lightThemeChecked ? 'light' : 'dark'" :label="$t('common.inviteTeamMembers')" :placeholder="$t('common.enterNameOrEmail')" @keyup.enter="handleEnterKey" @input="searchTeammates" required></bib-input>
            <div v-if="usererrors">
              <div v-for="(error, index) in usererrors" :key="index" class="text-danger font-sm">
                {{ error }}
              </div>
            </div>
            <div v-if="suggestions.length" class="suggestions" :class="lightThemeChecked ? 'bg-light-sub2 border-gray11' : 'bg-dark border-surface-tertiary'">
              <div>
                <div v-for="(suggestion, index) in suggestions" :key="index" :class="['suggestion-item d-flex align-center',lightThemeChecked ? 'bg-hover-light text-black text-hover-text-secondary' : 'bg-hover-surface-tertiary text-gray4 text-hover-text-secondary border-bottom-surface-tertiary']" @click="selectTeammate(suggestion)">
                  <img :src="suggestion.UserAvatar ? suggestion.UserAvatar : `/img/default_avatar.svg`" /> 
                  <div class="user-name">
                    {{ truncateText(suggestion.Name, 25) }}
                  </div> 
                  <div class="user-email">
                    {{ truncateText(suggestion.Email, 25) }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="selected-teammates">
              <div v-for="(user, index) in selectedTeammates" :key="index" class="teammate-user">
                
                <img :src="user.photo ? user.photo :'/img/default_avatar.svg'" class="teammate-user__img" />
                <div
                  class="teammate-user__name"
                  :title="displayFullNames[index] ? user.name : truncateName(user.name, index)"
                  @click="toggleNameDisplay(index)"
                  >
                  {{ displayFullNames[index] ? user.name : truncateName(user.name, index) }}
                </div>            
                <div class="teammate-user__email">({{ user.email }})</div>
                <!-- <div v-if="((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.userteamid === null))||((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.Id === null)&&(team))" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div> -->
              
                <!-- <div v-if="((!$route.path.match(/^\/teams\/[\w-]+$/))||(user.userteamid == null))&&(!team)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div> -->
                <div v-if="$route.path.match(/^\/teams\/[\w-]+$/)">
                  <div v-if="(!$route.path.match(/^\/teams\/[\w-]+$/))||(user.userteamid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div>
                </div>
                <div v-if="(!($route.path.match(/^\/teams\/[\w-]+$/)))&&(user.userteamid == null)&&(user.Id == null)">
                  <div v-if="((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.userteamid == null))||((!$route.path.match(/^\/teams\/[\w-]+$/))&&(user.Id == null))" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div>
                </div>
                <div v-if="(!($route.path.match(/^\/teams\/[\w-]+$/)))&&(!((user.userteamid == null)&&(user.Id == null)))">
                  <div v-if="(!($route.path.match(/^\/teams\/[\w-]+$/)))&&(user.userteamid == null)" class="teammate-user__clear" @click="clearTeammate(user.name)">×</div>
                  <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div>
                </div>
                <!-- <div v-else class="teammate-user__clear" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.name}`),(selectedusername=`${user.userteamid}`),(selected_Team=`${selected_TeamId}`)">×</div> -->
              </div>
            </div>
          </div>
        </div>
        </template>
      </div>
      <div class="align-center justify-between mt-2" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close'),cancel()"></bib-button>
        <bib-button size="lg" :label="$t('common.add')" variant="primary-24" pill @click="createTeam"></bib-button>
      </div>
    </bib-modal-wrapper>
    
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteTeamPeopleText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteClearTeammate(selectedTeam,selectedusername,selected_Team)">
    </confirm-dialog>
  </div>
</template>

<script>
import { addTeam, getUsers, addUsertoTeam,removeUser,getUserNotbelongTeam  } from '../../../model/team';

export default {
  props: ["show", "team", "teamName","localUsers","teastteamId"],
  data() {
    return {
      team_name: null,
      invite_team_member: null,
      selectedTeammates: [],
      users: [],
      userss: [],
      suggestions: [],
      suggestionss: [],
      displayFullNames:[],
      displayFirstNames:[],
      teamerrors:[],
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      errors:[],
      usererrors:[],
      localUsersSelect: this.localUsers,
      isOpenConfirmModal: null,
      selectedUser: null,
      selectedUserId: null,
      selected_Team: null,
      selectedusername: null,
      selectedTeam:null,
      userteamid:null,
      selected_TeamId:null,
   //   teamname: null
    };
  },
  created() {
    if (this.$route.path.match(/^\/teams\/[\w-]+$/)) {
      this.getAllUserss();
    }else{
      this.getAllUsers();
    }
  },
  computed: {
    computedTitle() {
      return !this.team ? this.$t('common.createTeam') : this.$t('common.inviteTeammatesToJoinYourTeam', { team: this.teamName });
    },
  },
  watch:{
    localUsers(newData) {
      this.selectedTeammates = [];
      this.localUsersSelect = newData; // Update teams when prop changes
      if (this.localUsersSelect.length > 0) {
        this.localUsersSelect.forEach(user => {
          if (!this.selectedTeammates.some(teammate => teammate.email === user.Email)) {
            this.selectedTeammates.push({
              selected_TeamId: `${user.Id}`,
              teamNameUser: `${user.TeamName}`,
              userteamid: `${user.TeamUserId || user.Id}`,
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
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    },
    team(newVal) {
      if (newVal) {
        this.getAllUserss();
      }
    }
  },
  methods: {
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + '...';
      }
      return text;
    },
    async getAllUsers() {
      const businessId = this.$store.state.account.data.businessId;
      this.userss = await getUsers({ hashId: businessId });
    },
    async getAllUserss() {
      const businessId = this.$store.state.account.data.businessId;
      const teamnewid = this.team.TeamId ? this.team.TeamId : this.team;
      this.users = await getUserNotbelongTeam({ hashId: teamnewid,BusinessId: businessId });
    },
    searchTeammates() {
      let searchQuery = this.invite_team_member.trim().toLowerCase();
      if (searchQuery.length > 0) {
        const searchTerms = searchQuery.split(/\s+/);
        this.suggestions = this.users.filter(user => {
          return searchTerms.every(term =>
            (user.Name && user.Name.toLowerCase().includes(term)) ||
            (user.Email && user.Email.toLowerCase().includes(term))
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
    selectTeammate(user) {
      if (!this.selectedTeammates.some(teammate => teammate.email === user.Email)) {
        this.selectedTeammates.push({
          name: `${user.Name}`,
          email: user.Email,
          photo :user.Photo ? user.Photo : user.UserAvatar
        });
      }
      this.invite_team_member = '';
      this.suggestions = [];
      this.suggestionss = [];      
    },
    selectTeammates(user) {
      if (!this.selectedTeammates.some(teammate => teammate.email === user.Email)) {
        this.selectedTeammates.push({
          name: `${user.FirstName} ${user.LastName}`,
          email: user.Email,
          photo :user.Photo ? user.Photo : user.UserAvatar
        });
      }
      this.invite_team_member = '';
      this.suggestions = [];
      this.suggestionss = [];      
    },
    toggleNameDisplay(index) {
      this.$set(this.displayFullNames, index, !this.displayFullNames[index]);
    },
    truncateName(name) {
      return name.length > 15 ? name.slice(0, 15) + '...' : name;
    },
    clearTeammate(name) {
      this.selectedTeammates = this.selectedTeammates.filter(e => name !== e.name);
    },
    handleEnterKey() {
      const matchingUser = this.users.find(
        user => (user.Email === this.invite_team_member) || (user.Name === this.invite_team_member)
      );
      if (matchingUser) {
        this.selectTeammate(matchingUser);
      }
    },
    handleEnterKeys() {
      const matchingUsers = this.userss.find(
        users => (users.Email === this.invite_team_member) || (users.FirstName === this.invite_team_member) || (users.LastName === this.invite_team_member)
      );
      if (matchingUsers) {
        this.selectTeammates(matchingUsers);
      }
    },
    async deleteClearTeammate(uname,TeamUserId,tname) {
      let msg;
      const res = await removeUser({ hashId: this.team, userId: TeamUserId });
      if (res.err) {
        if(res.err.error === `the user ${TeamUserId} is already removed from the team ${this.teamId}`)
        {
          msg = this.$t("APIError.theuserisalreadyremovedfromtheteam", { userName: uname, teamName: tname })
          this.$store.dispatch('notification/set', [true, msg, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `missing hashId`)
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
        else if(res.err.error === `missing UserId`)
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
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      } else {
        this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteTeammemberSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        this.clearTeammate(uname)
        const adduserteamid = this.team;
        this.$emit('add-member',adduserteamid)
        this.getAllUserss();
        //this.close()
        this.$emit('refresh')
        this.$store.dispatch('loading/set', false)
      }
      this.$store.dispatch('loading/set', false)
      this.isOpenConfirmModal = false
    },
    async createTeam() {
      let msg;
      let userteamres = '';
      let userteamresisTeamRoute = '';

      const businessId = this.$store.state.account.data.businessId || "";
      if (!this.team) {
        let teamres,userres='';
        if (this.$route.path === '/teams') {
          this.teamerrors=[];
          this.errors=[];
          this.usererrors=[];
          teamres = await addTeam({ "BusinessId": businessId, "TeamName": this.team_name });
          if (teamres.err) {
            if(teamres.err.error === 'missing BusinessId')
            {
              this.teamerrors.push(this.$t('APIError.missingBusinessId'));
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
            }
            else if(teamres.err.error === 'invalid BusinessId')
            {
              this.teamerrors.push(this.$t('APIError.invalidBusinessId'));
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
            }
            else if(teamres.err.error === 'missing TeamName')
            {
              this.errors.push(this.$t('APIError.missingTeamName'));
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
            }
            else if(teamres.err.error === 'Team Name already exists')
            {
              this.teamerrors.push(this.$t('APIError.TeamNamealreadyexists'));
              setTimeout(async () => {
                await this.$store.dispatch('notification/set', [false, '', ''])
              }, 5000)
            }
            else if(teamres.err.error === 'Business not found')
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
          } else {
            await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addTeamSuccessfully'), 'success'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
          if (this.selectedTeammates.length > 0) {
            await Promise.all(this.selectedTeammates.map(async (element) => {
              const result = this.userss.filter(x => x.Email === element.email || x.FirstName === element.name || x.LastName === element.name);
              userres = await addUsertoTeam({ "hashId": teamres.Id, "UserId": result[0].Id, "BusinessId": businessId });
              if (userres.err) {
                if(userres.err.error === `the user ${result[0].Id} is already added to the team ${teamres.Id}`)
                {
                  msg = this.$t("APIError.theuserisalreadyaddedtotheteam", { userName: result[0].FirstName + " " + result[0].LastName, teamName: this.teamName})
                  this.teamerrors.push(msg);
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `the team ${teamres.Id} does not belong to the business ${businessId}`)
                {
                  msg = this.$t("APIError.theteamdoesnotbelongtothebusiness", { teamName: this.teamName})
                  this.teamerrors.push(msg);
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `the user ${result[0].Id} does not belong to the business ${businessId}`)
                {
                  msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: result[0].FirstName + " " + result[0].LastName })
                  this.teamerrors.push(msg);
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `missing hashId`)
                {
                  this.teamerrors.push(this.$t('APIError.missinghashId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `missing UserId`)
                {
                  this.teamerrors.push(this.$t('APIError.missingUserId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `invalid User Id`)
                {
                  this.teamerrors.push(this.$t('APIError.invalidUserId'));                  
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `missing BusinessId`)
                {
                  this.teamerrors.push(this.$t('APIError.missingBusinessId'));
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
                else if(userres.err.error === `invalid Business Id`)
                {
                  this.teamerrors.push(this.$t('APIError.invalidBusinessId'));
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
          if(!teamres.err && !userres.err)
          {
            this.close()
            this.$emit('refresh')
            this.$store.dispatch('loading/set', false)
          }
        }
      } 
      else {
        function isTeamRoute(route) {
          const teamRoutePattern = /^\/teams\/[\w-]+$/;
          return teamRoutePattern.test(route);
        }
        function isAddUserTeamRoute(route) {
          const addUserteamRoutePattern = /teams/;
          return addUserteamRoutePattern.test(route);
        }
        if (isTeamRoute(this.$route.path)) {
          this.teamerrors = [];
          this.errors = [];
          this.usererrors = [];

          if (this.selectedTeammates.length > 0) {
            await Promise.all(this.selectedTeammates.map(async (element) => {
              const data = this.users.filter(x => x.Email === element.email || x.Name === element.name);
              if(data.length > 0){
                userteamresisTeamRoute = await addUsertoTeam({ "hashId": this.$route.params.id, "UserId": data[0].TeamUserId, "BusinessId": businessId });
                if (userteamresisTeamRoute.err) {
                  if(userteamresisTeamRoute.err.error === `the user ${data[0].Id} is already added to the team ${this.$route.params.id}`)
                  {
                    msg = this.$t("APIError.theuserisalreadyaddedtotheteam", { userName: data[0].Name, teamName: this.teamName})
                    this.teamerrors.push(msg);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `the team ${this.$route.params.id} does not belong to the business ${businessId}`)
                  {
                    msg = this.$t("APIError.theteamdoesnotbelongtothebusiness", { teamName: this.teamName})
                    this.teamerrors.push(msg);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `the user ${data[0].Id} does not belong to the business ${businessId}`)
                  {
                    msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: data[0].Name })
                    this.teamerrors.push(msg);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `missing hashId`)
                  {
                    this.teamerrors.push(this.$t('APIError.missinghashId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `missing UserId`)
                  {
                    this.teamerrors.push(this.$t('APIError.missingUserId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `invalid User Id`)
                  {
                    this.teamerrors.push(this.$t('APIError.invalidUserId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `missing BusinessId`)
                  {
                    this.teamerrors.push(this.$t('APIError.missingBusinessId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamresisTeamRoute.err.error === `invalid Business Id`)
                  {
                    this.teamerrors.push(this.$t('APIError.invalidBusinessId'));
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
                  await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addTeammemberSuccessfully'), 'success'])
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
              }
            }));
          }else{
            userteamresisTeamRoute = await addUsertoTeam({ "hashId": this.$route.params.id, "UserId": "", "BusinessId": businessId });
            if (userteamresisTeamRoute.err) {
              if(userteamresisTeamRoute.err.error === `missing hashId`)
              {
                this.teamerrors.push(this.$t('APIError.missinghashId'));
                setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
              }
              else if(userteamresisTeamRoute.err.error === `invalid Team Id`)
              {
                this.teamerrors.push(this.$t('APIError.invalidTeamId'));
                setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
              }
              else if(userteamresisTeamRoute.err.error === `missing UserId`)
              {
                this.usererrors.push(this.$t('APIError.missingUserId'));
                setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
              }
              else if(userteamresisTeamRoute.err.error === `invalid User Id`)
              {
                this.teamerrors.push(this.$t('APIError.invalidUserId'));
                setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
              }
              else if(userteamresisTeamRoute.err.error === `missing BusinessId`)
              {
                this.teamerrors.push(this.$t('APIError.missingBusinessId'));
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
          if(!userteamresisTeamRoute.err)
          {
            this.close()
            this.getAllUserss()
            this.$emit('refresh')
            this.$store.dispatch('loading/set', false)
          }
        }
        else if(isAddUserTeamRoute(this.$route.path)){
          this.teamerrors = [];
          this.errors = [];
          this.usererrors = [];

          if (this.selectedTeammates.length > 0) {
            let adduserteamid = this.team;
            await Promise.all(this.selectedTeammates.map(async (element) => {
              const data = this.users.filter(x => x.Email === element.email || x.Name === element.name);
              if(data.length > 0){
                userteamres = await addUsertoTeam({ "hashId": this.team, "UserId": data[0].TeamUserId, "BusinessId": businessId });  
                if (userteamres.err) {
                  if(userteamres.err.error === `the user ${data[0].Id} is already added to the team ${adduserteamid}`)
                  {
                    msg = this.$t("APIError.theuserisalreadyaddedtotheteam", { userName: data[0].Name , teamName: this.teamName})
                    this.teamerrors.push(msg);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `the team ${this.team} does not belong to the business ${businessId}`)
                  {
                    msg = this.$t("APIError.theteamdoesnotbelongtothebusiness", { teamName: this.teamName})
                    this.teamerrors.push(msg);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `the user ${data[0].Id} does not belong to the business ${businessId}`)
                  {
                    msg = this.$t("APIError.theuserdoesnotbelongtothebusiness", { userName: data[0].Name })
                    this.teamerrors.push(msg);
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `missing hashId`)
                  {
                    this.teamerrors.push(this.$t('APIError.missinghashId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `invalid Team Id`)
                  {
                    this.teamerrors.push(this.$t('APIError.invalidTeamId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `missing UserId`)
                  {
                    this.teamerrors.push(this.$t('APIError.missingUserId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `invalid User Id`)
                  {
                    this.teamerrors.push(this.$t('APIError.invalidUserId'));
                    setTimeout(async () => {
                      await this.$store.dispatch('notification/set', [false, '', ''])
                    }, 5000)
                  }
                  else if(userteamres.err.error === `missing BusinessId`)
                  {
                    this.teamerrors.push(this.$t('APIError.missingBusinessId'));
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
                  this.$emit('add-member',adduserteamid)
                  await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.addTeammemberSuccessfully'), 'success'])
                  setTimeout(async () => {
                    await this.$store.dispatch('notification/set', [false, '', ''])
                  }, 5000)
                }
              }
            }));
          }
          else{
            userteamres = await addUsertoTeam({ "hashId":  this.team, "UserId": "", "BusinessId": businessId });
            if (userteamres.err) {
              if(userteamres.err.error === `missing hashId`)
              {
                this.teamerrors.push(this.$t('APIError.missinghashId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userteamres.err.error === `invalid Team Id`)
              {
                this.teamerrors.push(this.$t('APIError.invalidTeamId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userteamres.err.error === `missing UserId`)
              {
                this.usererrors.push(this.$t('APIError.missingUserId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userteamres.err.error === `invalid User Id`)
              {
                this.teamerrors.push(this.$t('APIError.invalidUserId'));
                setTimeout(async () => {
                  await this.$store.dispatch('notification/set', [false, '', ''])
                }, 5000)
              }
              else if(userteamres.err.error === `missing BusinessId`)
              {
                this.teamerrors.push(this.$t('APIError.missingBusinessId'));
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
          if(!userteamres.err)
          {
            this.close()
            this.$emit('refresh')
            this.$store.dispatch('loading/set', false)
          }
        }
      }
      // this.$emit('refresh');
      // this.selectedTeammates = [];
    },
    cancel() {
      this.team_name = "";
      this.invite_team_member = "";
      if((!this.$route.path.match(/^\/teams\/[\w-]+$/))&&(this.selectedTeammates.userteamid==undefined)){
        if(!(this.selectedTeammates.length > 0)){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userteamid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      if((this.$route.path.match(/^\/teams\/[\w-]+$/))&&(this.selectedTeammates.userteamid==undefined)){
        if(this.selectedTeammates.length > 0){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userteamid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      this.teamerrors = [];
      this.suggestions = [];
      this.suggestionss = [];
      this.errors = [];
      this.usererrors = [];
      this.$emit('close');
    },
    close() {
      this.team_name = "";
      this.invite_team_member = "";
      if((!this.$route.path.match(/^\/teams\/[\w-]+$/))&&(this.selectedTeammates.userteamid==undefined)){
        if(!(this.selectedTeammates.length > 0)){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userteamid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      if((this.$route.path.match(/^\/teams\/[\w-]+$/))&&(this.selectedTeammates.userteamid==undefined)){
        if(this.selectedTeammates.length > 0){
          this.selectedTeammates = this.selectedTeammates.filter(teammate => teammate.userteamid !== undefined);
        }else{
          this.selectedTeammates = [];
        }
      }
      this.teamerrors = [];
      this.suggestions = [];
      this.suggestionss = [];
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
  &__name {
    margin-right: 2px !important;
  }
  &__clear {
    cursor: pointer;
    color: var(--bib-secondary);
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 0;
    margin-top: -1px;
    &:hover {
      color: $gray5;
    }
    &:active {
      color: $gray6;
    }
  }
}
.teammate-user__name,
.teammate-user__email{
  cursor: pointer;
  padding-top: 1.5px;
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
.suggestions {
  border-radius: 4px;
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 205px;
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
  .teammate-user{
    &:nth-child(1){
      margin-top: 16px !important;
    }
  }
}
.modal__wrapper__content{
  .suggestions{
    border-top: none;
    border-radius: 0 0 4px 4px;

    .suggestion-item{
      gap: 10px;
      padding: 8px;
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
.teamsanddepartment {
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
    }
  }
}
</style>
