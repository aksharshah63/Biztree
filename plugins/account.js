import { localization } from '~/assets/utils/locations.js'
export default async ({ store, router, route }) => {
    localization()
    
    if (!route.path.includes("login") &&
        !route.path.includes("create-account") &&
        !route.path.includes("forgot-password") &&
        !route.path.includes("reset_password") &&
        !route.path.includes("confirm_account") &&
        !route.path.includes("invite") &&
        !route.path.includes("logout")
    ) {
        await store.dispatch('account/authenticate')
    }
}