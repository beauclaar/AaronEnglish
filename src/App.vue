<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Aaron's English</h1>
        <nav v-if="isAuthenticated">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <a href="#" @click.prevent="handleSignOut" class="nav-link">Sign Out</a>
        </nav>
        <div v-else class="auth-links">
          <router-link to="/login" class="nav-link">Sign In</router-link>
        </div>
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2023 Aaron's English. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { signOut } from './services/googleAuth';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    const handleSignOut = async () => {
      try {
        await signOut();
        router.push('/');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    };
    
    return {
      isAuthenticated,
      handleSignOut
    };
  }
};
</script>

<style>
/* Replace with Material Design styling */
:root {
  --primary-color: #1976D2;
  --primary-dark: #1565C0;
  --secondary-color: #26A69A;
  --accent-color: #FF4081;
  --error-color: #F44336;
  --text-color: #212121;
  --text-secondary: #757575;
  --border-color: #E0E0E0;
  --background-light: #F5F5F5;
  --white: #FFFFFF;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  background-color: var(--background-light);
  line-height: 1.5;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary-color);
  color: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--white);
  text-decoration: none;
}

nav, .auth-links {
  display: flex;
  gap: 16px;
}

.nav-link {
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-content {
  flex: 1;
  padding: 24px 16px;
}

.app-footer {
  background-color: var(--text-color);
  color: var(--white);
  padding: 16px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
}

/* Remove Flutter-style classes */
.nav-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s;
  color: var(--white);
  background-color: var(--primary-color);
}

.nav-button:hover {
  background-color: var(--primary-dark);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
  }
  
  nav, .auth-links {
    width: 100%;
    justify-content: center;
  }
}
</style>