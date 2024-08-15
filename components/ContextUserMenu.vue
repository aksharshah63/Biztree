<template>
    <transition name="slide-right" mode="out-in" appear>
        <div class="ContextUserMenu user-menu">
            <!-- USER -->
            <div class="user-menu__user-info">
                <img :src="$store.state.account.data.photo || '/img/default_avatar.svg'" @error="$event.target.src = '/img/default_avatar.svg'" alt="avatar" @click="navigate(options[0])" />
                <div class="info-name">{{ $store.state.account.data.userFirstName + " " + $store.state.account.data.userLastName }}</div>
                <div class="info-email">{{ $store.state.account.data.userEmail }}</div>
            </div>

            <!-- CONTROLS -->
            <div class="ContextUserMenu__user-items user-menu__user-items">
                <div v-for="(option, index) in isAdmin ? options: options.filter((t) => t.admin == false)" :class="`ContextUserMenu__item-${index + 1} user-menu__user-items-item`" :key="option.label" @click.native="navigate(option)">
                    <bib-icon :icon="option.icon" />
                    {{ option.label }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            options: [
                { label: this.$t("common.myAccount"), action: "myAccount", icon: "user", admin: false },
                { label: this.$t("team"), action: "team", icon: "user-admin-network", admin: true },
                // { label: this.$t("common.billing"), action: "billing", icon: "credits", admin: true },
                // { label: this.$t("support"), action: "support", icon: "support", admin: false },
                { label: this.$t("common.logout"), action: "logout", icon: "output", admin: false },
            ],
        };
    },
    computed: {
        isAdmin() {
            return this.$store.state.account.data.userRole === 'ADMIN'
        },
    },
    methods: {
        navigate(item) {
            if (item.action == "myAccount") {
                this.goToMyProfile()
            } else if (item.action == "team") {
                this.goToPeople()
            } else if (item.action == "billing") {
                this.goToSubscription()
            } else if (item.action == "support") {
                this.openHelp()
            } else if (item.action == "logout") {
                this.logout()
            }
            this.$store.commit("context/TOGGLE_USER_MENU")
        },
        goToMyProfile() {
            this.$router.push('/my_profile')
        },
        goToPeople() {
            this.$router.push('/people')
        },
        goToSubscription() {
            this.$router.push('/subscription_billing')  
        },
        openHelp() {
            window.open(process.env.SUPPORT_URL)
        },
        async logout() {
            this.$store.dispatch('loading/setGlobal', true)
            await this.$store.dispatch('account/logout')
        },
    },
};
</script>

<style lang="scss" scoped>
.user-menu {
    background: white;
    position: fixed;
    padding: 10px;
    top: 54px !important;
    right: calc(0% - -10px);
    // left: calc(100vw - 272px);
    // width: 100%;
    // max-width: 260px;
    max-height: calc(100vh - 70px);
    border-radius: 8px !important;
    box-shadow: 0 6px 30px -2px rgb(0 0 0 / 38%);
    cursor: default;
    z-index: 3;
    transition: flex 2s;

    --section-width: 240px;

    @media only screen and (max-height: 480px) {
        display: flex;

        &__user-info {
            padding: 20px !important;

            img {
                width: 80px !important;
                height: 80px !important;
                margin-bottom: 10px !important;
            }
        }
    }

    &__user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 20px;
        overflow: hidden;
        width: var(--section-width);

        img {
            margin-bottom: 20px;
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 200px;
            transition: filter 0.5s;
            cursor: pointer;

            &:hover {
                filter: brightness(0.8);
            }
        }

        .info-name {
            font-size: 1.1rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }

        .info-email {
            font-weight: lighter;
            font-size: 0.8rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-all;
            color: $secondary;
        }
    }

    &__user-items {
        width: var(--section-width);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 14px;
            margin: 0.2rem;
            padding: 0.4rem 0.65rem;
            border-radius: 0.3rem;
            cursor: pointer;

            &:hover {
                background-color: var(--bib-light);
            }
        }
    }
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease-out, opacity 0.5s;
}

.slide-right-enter,
.slide-right-leave-to {
    transform: translateX(40px);
    opacity: 0;
}
</style>
