<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">
        <img src="https://www.gstatic.com/images/branding/product/2x/hh_workspace_64dp.png" alt="Workspace for Education Logo" onerror="this.src='https://www.gstatic.com/images/branding/product/2x/hh_workspace_64dp.png'">
      </div>
      <h1>Sign in with Google</h1>
      <p>Use your Google Workspace for Education account</p>
      
      <div class="login-buttons">
        <button @click="handleGoogleLogin" class="google-login-button" :disabled="isLoading">
          <span class="google-icon"></span>
          <span>Sign in with Google</span>
        </button>
      </div>
      
      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Connecting to Google...</p>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signIn } from '../services/googleAuth';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const error = ref('');
    
    const handleGoogleLogin = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        
        await signIn();
        router.push('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        error.value = 'Failed to sign in. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      isLoading,
      error,
      handleGoogleLogin
    };
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24px;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 48px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  margin-bottom: 24px;
}

.logo img {
  height: 64px;
  width: auto;
}

h1 {
  margin: 0 0 8px;
  color: #202124;
  font-size: 24px;
  font-weight: 400;
}

p {
  color: #5f6368;
  margin: 0 0 32px;
}

.login-buttons {
  margin-bottom: 16px;
}

.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 16px;
  background-color: white;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-login-button:hover {
  background-color: #f1f3f4;
}

.google-login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="%23FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="%23FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="%234CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="%231976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.spinner {
  border: 3px solid rgba(0,0,0,0.1);
  border-top: 3px solid #1a73e8;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #d93025;
  margin-top: 16px;
  font-size: 14px;
}
</style>