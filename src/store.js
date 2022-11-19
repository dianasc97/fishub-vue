import { appendFile } from 'fs';
import Vue from 'vue';
import Vuex from 'vuex';

import api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tackleBoxItems: [],
    user: JSON.parse(localStorage.getItem("user"))
  },
  getters: {
    tackleBoxItemsCount: state => state.anglerBoxItems.length,
    isAthenticated: state => !!state.user
  },
  mutations: {
    setTackBoxItems(state, items) {
      state.tackleBoxItems = items;
      }
    },
    addTackBoxItems(state, items) {
      state.tackleBoxItems.push(items);
      },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem("user");
      state.tackleBoxItems = [];
    },
    actions: {
      getTackleBoxItems({ commmit }) {
        if(this.getters.isAthenticated) {
          api.getTackleBoxItems().then(response => {
            commit("setTackBoxItems", response.data);
          });
        }
      },
      createTackBoxItem({ commmit }, baitId) {
        api.createTackBoxItem(baitId).then(response => {
          commmit("addTackBoxItem", response.data);
        });
      },
      signIn({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
          api
          .createSession(username, password)
          .then(response => {
            commit("setUser", response.data);
            this.dispatch("getTackleBoxItems");
            resolve();
          })
          .catch(error => {
            commit("clearUser");
            reject(error.response.data.error);
          });
        });
      },
      signOut({ commit }) {
        return new Promise(resolve => {
          api.deleteSession().then(() => {
            commit("clearUser");
            resolve()
          });
        });
  });
  
