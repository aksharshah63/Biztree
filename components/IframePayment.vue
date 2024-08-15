<template>
    <iframe v-if="computedPlace" :src="computedPlace" class="iframe" />
</template>

<script>
export default {
    props: {
        place: {
            type: String,
            default: null,
        },
    },
    data: () => ({
        computedPlace: null,
    }),
    async mounted() {
        try {
            const place = new URL(this.place);
            place.searchParams.set("lang", this.$i18n.locale);
            place.searchParams.set("ssotoken", this.$cookies.get(this.$root.context.env.SSO_COOKIE_NAME));

            if (this.$cookies.get("SourceDesktopApp")) place.searchParams.set("SourceDesktopApp", this.$cookies.get("SourceDesktopApp"));

            document.getElementById("__nuxt").append(this.$el);
            window.addEventListener("message", this.iframeCommunication);

            this.computedPlace = place.href;
        } catch (e) {
            console.error("new_account iframeCommunication error -+++++++->", "bad_url");
            this.$emit("cancel", "bad_url");
        }
    },
    methods: {
        iframeCommunication({ data, origin }) {
            try {
                if (typeof data == "string") data = JSON.parse(data);

                if (!/business-in-a-box.com(\:[0-9]+)?$/.test(origin) || !("buyFrame" in data)) return;
                const evtData = data.buyFrame;

                if (evtData.key == "appStorePurchaseDialogInitiate") {
                    this.$mobile.emit("appStorePurchaseDialogInitiate", { action: "plans-and-pricing" });
                } else {
                    this.$emit(evtData.key, evtData.value); // [mounted, paypal_open, payment_success, etc.]
                }

                console.log("new_account iframeCommunication -+++++++->", evtData);
            } catch (e) {
                console.error("new_account iframeCommunication error -+++++++->", e);
            }
        },
    },
    computed: {},
    beforeDestroy() {
        window.removeEventListener("message", this.iframeCommunication);
    },
};
</script>

<style lang="scss" scoped>
iframe {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    height: 100svh;
    border: none;
    outline: none;
    z-index: 10;
}
</style>
