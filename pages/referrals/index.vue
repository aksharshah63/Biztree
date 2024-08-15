<template>
    <div>
        <!-- HEADER -->
        <content-header>
            <template slot="bottom-left">
                <div class="align-center">
                    <h2 class="font-w-600 font-heading-sm ml-3">{{ $t("common.referrals") }}</h2>
                </div>
            </template>
        </content-header>
        <div>
            <user-referral :isLightTheme="lightThemeChecked"></user-referral>
        </div>
    </div>
</template>

<script>
import UserReferral from '../../components/UserReferral.vue';
export default {
    components: { UserReferral },
    layout: "home",
    props: ["global"],
    data() {
        return {
            lightThemeChecked: this.$cookies.get('isLightTheme'),
        };
    },
    computed: {},
    async created() { },
    mounted() { },
    watch: {
        '$store.state.isLightTheme'(newValue) {
            this.lightThemeChecked = newValue;
        }
    },
    methods: {},
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