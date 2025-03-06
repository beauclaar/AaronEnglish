// Google Auth API for Workplace for Education
import store from '../store';

// Your Google Workspace for Education client ID from .env.local
const CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID || '';

// Define the scopes for Google Workspace for Education
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/classroom.profile.photos',
  'https://www.googleapis.com/auth/drive.file'
];

// Keep track of auth instance
let googleAuth = null;

/**
 * Initialize Google Auth API
 */
export const initializeGoogleAuth = () => {
  return new Promise((resolve) => {
    // If no client ID is configured, resolve without initializing
    if (!CLIENT_ID || CLIENT_ID === 'YOUR_GOOGLE_WORKSPACE_CLIENT_ID') {
      console.warn('Google Client ID not configured. Authentication will be disabled.');
      resolve(null);
      return;
    }

    // Check if gapi is already loaded
    if (window.gapi) {
      loadGapiAndInit(resolve);
    } else {
      // Load the Google API client library
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => loadGapiAndInit(resolve);
      script.onerror = () => {
        console.error('Failed to load Google API client library');
        resolve(null);
      };
      document.head.appendChild(script);
    }
  });
};

/**
 * Load necessary GAPI libraries and initialize auth
 */
const loadGapiAndInit = async (resolve) => {
  try {
    await new Promise((res) => {
      window.gapi.load('client:auth2', res);
    });

    await window.gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES.join(' ')
    });
    
    googleAuth = window.gapi.auth2.getAuthInstance();
    
    // Listen for sign-in state changes
    googleAuth.isSignedIn.listen(updateSigninStatus);
    
    // Handle the initial sign-in state
    updateSigninStatus(googleAuth.isSignedIn.get());
    
    resolve(googleAuth);
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
    resolve(null);
  }
};

/**
 * Update sign-in status in the app
 */
const updateSigninStatus = (isSignedIn) => {
  if (isSignedIn) {
    const googleUser = googleAuth.currentUser.get();
    const profile = googleUser.getBasicProfile();
    const user = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
      token: googleUser.getAuthResponse().id_token
    };
    
    store.dispatch('setUser', user);
  } else {
    store.dispatch('setUser', null);
  }
};

/**
 * Sign in the user
 */
export const signIn = () => {
  if (googleAuth) {
    return googleAuth.signIn();
  }
  return Promise.reject(new Error('Google Auth not initialized'));
};

/**
 * Sign out the user
 */
export const signOut = () => {
  if (googleAuth) {
    return googleAuth.signOut();
  }
  return Promise.reject(new Error('Google Auth not initialized'));
};

/**
 * Check if user is authenticated
 */
export const getAuthStatus = () => {
  return googleAuth ? googleAuth.isSignedIn.get() : false;
};

/**
 * Get current user information
 */
export const getCurrentUser = () => {
  if (!googleAuth || !googleAuth.isSignedIn.get()) {
    return null;
  }
  
  const googleUser = googleAuth.currentUser.get();
  const profile = googleUser.getBasicProfile();
  
  return {
    id: profile.getId(),
    name: profile.getName(),
    email: profile.getEmail(),
    imageUrl: profile.getImageUrl()
  };
};