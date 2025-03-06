<template>
  <div class="wida-lesson-planner">
    <v-card class="ma-4">
      <v-card-title class="text-h4 text-center">WIDA Lesson Plan Generator</v-card-title>
      
      <!-- WIDA Standards Selection -->
      <v-card-text class="pa-4">
        <div class="text-h6 mb-2">WIDA Standards</div>
        <div class="text-subtitle-2 mb-4">Select at least one standard</div>
        <v-container class="px-2">
          <div class="chip-group-wrapper">
            <v-chip-group
              v-model="selectedStandards"
              column
              multiple
              class="chip-group"
              @change="errors.standards = ''"
            >
              <v-chip
                v-for="standard in widaStandards"
                :key="standard.value"
                :value="standard.value"
                filter
                variant="elevated"
                :color="selectedStandards.includes(standard.value) ? getSpringColor(standard.value) : '#E0E0E0'"
                class="mb-2"
              >
                <v-tooltip :text="standard.description">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">{{ standard.title }}</span>
                  </template>
                </v-tooltip>
              </v-chip>
            </v-chip-group>
          </div>
        </v-container>
        <v-alert
          v-if="errors.standards"
          type="error"
          :text="errors.standards"
          variant="tonal"
          class="mt-2"
        ></v-alert>
      </v-card-text>
      
      <!-- Key Language Use Selection -->
      <v-card-text>
        <div class="text-h6 mb-2">Key Language Use</div>
        <div class="text-subtitle-2 mb-4">Select at least one language use</div>
        <v-container>
          <v-chip-group
            v-model="selectedLanguageUses"
            column
            multiple
            @change="errors.languageUses = ''"
          >
            <v-chip
              v-for="language in keyLanguageUses"
              :key="language.value"
              :value="language.value"
              filter
              variant="elevated"
              :color="selectedLanguageUses.includes(language.value) ? getSpringColor(language.value) : '#E0E0E0'"
              class="mb-2"
            >
              <v-tooltip :text="language.description">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">{{ language.value }}</span>
                </template>
              </v-tooltip>
            </v-chip>
          </v-chip-group>
        </v-container>
        <v-alert
          v-if="errors.languageUses"
          type="error"
          :text="errors.languageUses"
          variant="tonal"
          class="mt-2"
        ></v-alert>
      </v-card-text>
      
      <!-- Grade Level Cluster Selection -->
      <v-card-text>
        <div class="text-h6 mb-2">Grade Level Cluster</div>
        <div class="text-subtitle-2 mb-4">Select one grade level cluster</div>
        <v-container>
          <v-radio-group
            v-model="selectedGradeLevel"
            @change="errors.gradeLevel = ''"
            column
          >
            <v-radio
              v-for="grade in gradeLevelClusters"
              :key="grade.value"
              :value="grade.value"
              :label="grade.label"
              density="comfortable"
            ></v-radio>
          </v-radio-group>
        </v-container>
        <v-alert
          v-if="errors.gradeLevel"
          type="error"
          :text="errors.gradeLevel"
          variant="tonal"
          class="mt-2"
        ></v-alert>
      </v-card-text>
      
      <!-- Proficiency Level Selection -->
      <v-card-text>
        <div class="text-h6 mb-2">Proficiency Levels</div>
        <div class="text-subtitle-2 mb-4">Select at least one proficiency level</div>
        <v-container>
          <v-chip-group
            v-model="selectedProficiencyLevels"
            column
            multiple
            @change="errors.proficiencyLevels = ''"
          >
            <v-chip
              v-for="level in proficiencyLevels"
              :key="level.value"
              :value="level.value"
              filter
              variant="elevated"
              :color="selectedProficiencyLevels.includes(level.value) ? getSpringColor(level.value) : '#E0E0E0'"
              class="mb-2"
            >
              {{ level.value }}
            </v-chip>
          </v-chip-group>
        </v-container>
        <v-alert
          v-if="errors.proficiencyLevels"
          type="error"
          :text="errors.proficiencyLevels"
          variant="tonal"
          class="mt-2"
        ></v-alert>
      </v-card-text>
      
      <!-- Generate Button -->
      <v-card-actions class="justify-center pa-4">
        <v-btn
          color="primary"
          size="large"
          @click="generateLessonPlan"
          :prepend-icon="'mdi-wand'"
        >
          Generate Lesson Plan
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <!-- Output Section -->
    <v-card v-if="generatedPrompt" class="ma-4">
      <v-card-title class="text-h5">Generated Prompt</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="generatedPrompt"
          readonly
          variant="outlined"
          auto-grow
          rows="5"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="justify-center pa-4">
        <v-btn
          color="primary"
          @click="copyPrompt"
          :prepend-icon="'mdi-content-copy'"
        >
          Copy to Clipboard
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'WidaLessonPlanner',
  setup() {
    // Data definitions
    const widaStandards = [
      { 
        value: 'Standard 1', 
        title: 'Standard 1',
        description: 'English Language Learners communicate for social and instructional purposes within the school setting.'
      },
      { 
        value: 'Standard 2', 
        title: 'Standard 2',
        description: 'English Language Learners communicate information, ideas, and concepts necessary for academic success in the content area of Language Arts.'
      },
      { 
        value: 'Standard 3', 
        title: 'Standard 3',
        description: 'English Language Learners communicate information, ideas, and concepts necessary for academic success in the content area of Mathematics.'
      },
      { 
        value: 'Standard 4', 
        title: 'Standard 4',
        description: 'English Language Learners communicate information, ideas, and concepts necessary for academic success in the content area of Science.'
      },
      { 
        value: 'Standard 5', 
        title: 'Standard 5',
        description: 'English Language Learners communicate information, ideas, and concepts necessary for academic success in the content area of Social Studies.'
      }
    ];
    
    const keyLanguageUses = [
      { 
        value: 'Narrate', 
        description: 'Recounting events, telling stories, and describing experiences.' 
      },
      { 
        value: 'Inform', 
        description: 'Conveying factual information, defining concepts, and reporting on observations.' 
      },
      { 
        value: 'Explain', 
        description: 'Clarifying processes, causes, and reasons.' 
      },
      { 
        value: 'Argue', 
        description: 'Persuading, justifying claims, and evaluating different perspectives.' 
      }
    ];
    
    const gradeLevelClusters = [
      { value: 'K', label: 'K' },
      { value: '1', label: '1' },
      { value: '2-3', label: '2-3' },
      { value: '4-5', label: '4-5' },
      { value: '6-8', label: '6-8' },
      { value: '9-12', label: '9-12' }
    ];
    
    const proficiencyLevels = [
      { value: 'Entering' },
      { value: 'Emerging' },
      { value: 'Developing' },
      { value: 'Expanding' },
      { value: 'Bridging' },
      { value: 'Reaching' }
    ];
    
    // State
    const selectedStandards = ref([]);
    const selectedLanguageUses = ref([]);
    const selectedGradeLevel = ref('');
    const selectedProficiencyLevels = ref([]);
    const generatedPrompt = ref('');
    
    const errors = reactive({
      standards: '',
      languageUses: '',
      gradeLevel: '',
      proficiencyLevels: ''
    });

    const showSnackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    
    // Material Design color palette mapping
    const materialColors = {
      'Standard 1': '#2196F3',    // Vibrant Blue
      'Standard 2': '#FF9800',    // Warm Orange
      'Standard 3': '#BA68C8',    // Lavender Purple
      'Standard 4': '#FFEB3B',    // Sunny Yellow
      'Standard 5': '#009688',    // Teal
      'Narrate': '#F44336',      // Bright Red
      'Inform': '#8BC34A',       // Lime Green
      'Explain': '#673AB7',      // Deep Purple
      'Argue': '#FF8A65',        // Coral
      'Entering': '#4CAF50',     // Emerald Green
      'Emerging': '#29B6F6',     // Sky Blue
      'Developing': '#2196F3',   // Vibrant Blue
      'Expanding': '#FF9800',    // Warm Orange
      'Bridging': '#BA68C8',     // Lavender Purple
      'Reaching': '#FFEB3B',     // Sunny Yellow
    };

    // Helper function to get color based on value
    const getSpringColor = (value) => {
      return materialColors[value] || '#2196F3'; // Default to Vibrant Blue if no match
    };

    // Methods
    const toggleStandard = (value) => {
      const index = selectedStandards.value.indexOf(value);
      if (index === -1) {
        selectedStandards.value.push(value);
      } else {
        selectedStandards.value.splice(index, 1);
      }
      errors.standards = '';
    };
    
    const toggleLanguageUse = (value) => {
      const index = selectedLanguageUses.value.indexOf(value);
      if (index === -1) {
        selectedLanguageUses.value.push(value);
      } else {
        selectedLanguageUses.value.splice(index, 1);
      }
      errors.languageUses = '';
    };
    
    const selectGradeLevel = (value) => {
      selectedGradeLevel.value = value;
      errors.gradeLevel = '';
    };
    
    const toggleProficiencyLevel = (value) => {
      const index = selectedProficiencyLevels.value.indexOf(value);
      if (index === -1) {
        selectedProficiencyLevels.value.push(value);
      } else {
        selectedProficiencyLevels.value.splice(index, 1);
      }
      errors.proficiencyLevels = '';
    };
    
    const validateForm = () => {
      let valid = true;
      
      if (selectedStandards.value.length === 0) {
        errors.standards = 'Please select at least one WIDA Standard';
        valid = false;
      }
      
      if (selectedLanguageUses.value.length === 0) {
        errors.languageUses = 'Please select at least one Key Language Use';
        valid = false;
      }
      
      if (!selectedGradeLevel.value) {
        errors.gradeLevel = 'Please select a Grade Level Cluster';
        valid = false;
      }
      
      if (selectedProficiencyLevels.value.length === 0) {
        errors.proficiencyLevels = 'Please select at least one Proficiency Level';
        valid = false;
      }
      
      return valid;
    };
    
    const generateLessonPlan = () => {
      if (!validateForm()) return;
      
      // Generate the prompt
      generatedPrompt.value = `Create a WIDA-aligned lesson plan for grade level ${selectedGradeLevel.value} incorporating the following:

WIDA Standards: ${selectedStandards.value.join(', ')}
Key Language Uses: ${selectedLanguageUses.value.join(', ')}
Proficiency Levels: ${selectedProficiencyLevels.value.join(', ')}

Include specific language objectives, content objectives, activities, assessments, and differentiation strategies for the various proficiency levels.`;
    };
    
    const copyPrompt = () => {
      navigator.clipboard.writeText(generatedPrompt.value)
        .then(() => {
          snackbarText.value = 'Prompt copied to clipboard!';
          snackbarColor.value = 'success';
          showSnackbar.value = true;
        })
        .catch(err => {
          snackbarText.value = 'Failed to copy text: ' + err;
          snackbarColor.value = 'error';
          showSnackbar.value = true;
        });
    };
    
    return {
      widaStandards,
      keyLanguageUses,
      gradeLevelClusters,
      proficiencyLevels,
      selectedStandards,
      selectedLanguageUses,
      selectedGradeLevel,
      selectedProficiencyLevels,
      errors,
      generatedPrompt,
      toggleStandard,
      toggleLanguageUse,
      selectGradeLevel,
      toggleProficiencyLevel,
      generateLessonPlan,
      copyPrompt,
      showSnackbar,
      snackbarText,
      snackbarColor,
      getSpringColor,
    };
  }
};
</script>

<style scoped>
.wida-lesson-planner {
  max-width: 900px;
  margin: 0 auto;
}

:deep(.v-container) {
  max-width: 100%;
  padding: 16px !important;
}

.chip-group-wrapper {
  padding: 4px;
  margin: -4px;
  width: 100%;
}

:deep(.v-chip-group) {
  padding: 4px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.v-chip) {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 0 !important;
  white-space: normal;
  height: auto !important;
  min-height: 32px;
  flex: 0 1 auto;
  transition: all 0.2s ease;
  position: relative;
  border: 2px solid transparent !important;
}

:deep(.v-chip.v-chip--selected) {
  border: 2px solid currentColor !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-weight: 500;
}

/* Force consistent border style for all chips */
:deep(.v-chip--filter) {
  border: 2px solid transparent !important;
}

:deep(.v-chip--filter.v-chip--selected) {
  border: 2px solid currentColor !important;
}

/* More specific selectors to ensure consistent border behavior */
:deep(.v-chip.v-chip--filter) {
  border: 2px solid transparent !important;
}

:deep(.v-chip.v-chip--filter.v-chip--selected) {
  border: 2px solid currentColor !important;
  border-color: inherit !important;
}

:deep(.v-chip.v-chip--filter.v-chip--selected:hover) {
  border-color: currentColor !important;
}

:deep(.v-chip:hover) {
  opacity: 0.9;
}

:deep(.v-card-text) {
  padding: 16px;
}

:deep(.v-chip-group .v-chip) {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

/* Make chips wrap properly on smaller screens */
@media (max-width: 600px) {
  :deep(.v-container) {
    padding: 8px !important;
  }
  
  :deep(.v-chip) {
    margin: 2px !important;
  }
}

/* Style updates to ensure consistent border colors */
:deep(.v-chip.v-chip--filter.v-chip--selected) {
  border-color: currentColor !important;
  border-style: solid !important;
  border-width: 2px !important;
}

:deep(.v-chip.v-chip--filter.v-chip--selected .v-chip__overlay) {
  opacity: 0.1;
}

:deep(.v-chip.v-chip--selected:not(.v-chip--filter)) {
  border-color: currentColor !important;
  border-style: solid !important;
  border-width: 2px !important;
}

/* Additional style to force border color inheritance */
:deep(.v-chip.v-chip--filter.v-chip--selected), 
:deep(.v-chip.v-chip--filter.v-chip--selected:hover),
:deep(.v-chip.v-chip--filter.v-chip--selected:focus) {
  border-color: currentColor !important;
}

:deep(.v-chip.v-chip--filter.v-chip--selected::before) {
  opacity: 0.12;
}
</style>