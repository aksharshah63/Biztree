export default ({ app, store, route, redirect }) => {
  // route.path === "/" && redirect("/my_profile");
  // route.path === "/organizations" && redirect(`/organizations/${store.state.account.data.businessId}`);
  // if (store.state.account.data.userRole === 'USER') {
  //   route.path === "/subscription_billing" && redirect("/my_profile");
  // }
  app.router.beforeEach((to, from, next) => {
    next();
  });
};
