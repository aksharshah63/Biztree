<template>
    <div>
        <content-header>
            <template slot="bottom-left">
                <div class="align-center">
                    <h2 class="font-w-600 font-heading-sm margin-left-40">{{ $t("common.referralsDashboard") }}</h2>
                </div>
            </template>
        </content-header>

        <div v-if="isAdmin">
            <admin-referral-dashboard :isLightTheme="lightThemeChecked"></admin-referral-dashboard>
        </div>
    </div>
</template>

<script>
import AdminReferralDashboard from '../../components/AdminReferralDashboard.vue';

export default {
    components: { AdminReferralDashboard },
    layout: "home",
    props: ["global"],
    data() {
        return {
            lightThemeChecked: this.$cookies.get('isLightTheme'),
        };
    },
    computed: {
        isAdmin() {
            return this.$store.state.account.data.userRole === "ADMIN";
        },
        isMobileView() {
            return this.$store.state.ui.windowSize.width < 600;
        },
    },
    async created() { },
    mounted() { if (this.$store.state.account.data.userRole !== "ADMIN") this.$router.push(`/my_profile`); },
    watch: {
        '$store.state.isLightTheme'(newValue) {
            this.lightThemeChecked = newValue;
        }
    },
    methods: {
    },
};
</script>
<style lang="scss" scoped>
.main-container {
    @include flex-justify;
    width: 100%;
    padding: 32px 40px;

    &__content {
        width: inherit;
        // grid-template-columns: repeat(5, 1fr);
    }
}
</style>