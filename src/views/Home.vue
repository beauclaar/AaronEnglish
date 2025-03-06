<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>WIDA Lesson Plan Generator</h1>
        <p>Create custom lesson plans aligned with WIDA standards for English language learners</p>
      </div>
    </div>

    <div class="container">
      <wida-lesson-planner />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import WidaLessonPlanner from '../components/WidaLessonPlanner.vue';

export default {
  name: 'HomeView',
  components: {
    WidaLessonPlanner
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    const goToLogin = () => {
      router.push('/login');
    };
    
    const goToDashboard = () => {
      router.push('/dashboard');
    };
    
    return {
      isAuthenticated,
      goToLogin,
      goToDashboard
    };
  }
};
</script>

<style scoped>
.home {
  width: 100%;
}

.hero-section {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 48px 16px;
  text-align: center;
  margin-bottom: 32px;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 36px;
  font-weight: 500;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 18px;
  opacity: 0.9;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}
</style>