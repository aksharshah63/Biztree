import Vue from 'vue'
import BibUILibrary from '@bizinbox/bib-ui-lib/dist/library'

export default ({ store, app }, inject) => {
    Vue.use(BibUILibrary, { store });
    store.commit("setIsApp", { router: app.context.route });
};