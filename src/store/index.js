import { createStore } from 'vuex';
import localforage from 'localforage';

// Configure localforage for local file storage
localforage.config({
  name: 'workspace-education-app',
  storeName: 'files'
});

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    files: [],
    isLoading: false,
    error: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_FILES(state, files) {
      state.files = files;
    },
    ADD_FILE(state, file) {
      state.files.push(file);
    },
    UPDATE_FILE(state, updatedFile) {
      const index = state.files.findIndex(file => file.id === updatedFile.id);
      if (index !== -1) {
        state.files.splice(index, 1, updatedFile);
      }
    },
    DELETE_FILE(state, fileId) {
      state.files = state.files.filter(file => file.id !== fileId);
    }
  },
  actions: {
    // Auth actions
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    
    // File management actions
    async saveFile({ commit }, fileData) {
      try {
        commit('SET_LOADING', true);
        const fileId = fileData.id || Date.now().toString();
        const fileToSave = { ...fileData, id: fileId };
        
        // Save to local storage using localforage
        await localforage.setItem(fileId, fileToSave);
        
        // Update store
        commit('ADD_FILE', fileToSave);
        commit('SET_LOADING', false);
        return fileToSave;
      } catch (error) {
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
        throw error;
      }
    },
    
    async loadFiles({ commit }) {
      try {
        commit('SET_LOADING', true);
        const files = [];
        
        // Iterate through stored files
        await localforage.iterate((value) => {
          files.push(value);
        });
        
        commit('SET_FILES', files);
        commit('SET_LOADING', false);
        return files;
      } catch (error) {
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
        throw error;
      }
    },
    
    async deleteFile({ commit }, fileId) {
      try {
        commit('SET_LOADING', true);
        await localforage.removeItem(fileId);
        commit('DELETE_FILE', fileId);
        commit('SET_LOADING', false);
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
        throw error;
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    userFiles: state => state.files,
    isLoading: state => state.isLoading,
    hasError: state => !!state.error,
    errorMessage: state => state.error
  }
});