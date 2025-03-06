<template>
  <div class="dashboard">
    <h1>Your Dashboard</h1>
    
    <div class="stats-wrapper">
      <div class="stat-item">
        <div class="stat-value">{{ files.length }}</div>
        <div class="stat-label">Files</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalSize }}</div>
        <div class="stat-label">Total Size</div>
      </div>
    </div>
    
    <div class="file-actions">
      <button @click="showFileModal = true" class="v-btn v-btn--primary">
        <span class="mdi mdi-plus"></span>
        Create New File
      </button>
    </div>
    
    <div class="v-card files-list" v-if="files.length > 0">
      <div class="list-header">
        <div class="file-name">Name</div>
        <div class="file-type">Type</div>
        <div class="file-size">Size</div>
        <div class="file-date">Date Modified</div>
        <div class="file-actions">Actions</div>
      </div>
      
      <div v-for="file in files" :key="file.id" class="file-item">
        <div class="file-name" @click="openFile(file)">
          <span class="material-icon">{{ getFileIcon(file.type) }}</span>
          {{ file.name }}
        </div>
        <div class="file-type">{{ file.type || 'Unknown' }}</div>
        <div class="file-size">{{ formatFileSize(file.size) }}</div>
        <div class="file-date">{{ formatDate(file.modifiedDate) }}</div>
        <div class="file-actions">
          <button @click="openFile(file)" class="v-icon-button">
            <span class="mdi mdi-eye"></span>
          </button>
          <button @click="downloadFile(file)" class="v-icon-button">
            <span class="mdi mdi-download"></span>
          </button>
          <button @click="confirmDeleteFile(file)" class="v-icon-button delete">
            <span class="mdi mdi-delete"></span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="v-card empty-state">
      <div class="empty-state-icon">
        <span class="mdi mdi-folder-open"></span>
      </div>
      <h3>No files yet</h3>
      <p>Create your first file to get started</p>
    </div>
    
    <!-- File creation modal -->
    <div v-if="showFileModal" class="v-dialog" @click="showFileModal = false">
      <div class="v-card dialog-content" @click.stop>
        <div class="v-card-title">
          <h2>Create New File</h2>
          <button @click="showFileModal = false" class="v-btn v-btn--icon">
            <span class="mdi mdi-close"></span>
          </button>
        </div>
        <div class="v-card-text dialog-body">
          <div class="form-group">
            <label for="fileName">File Name</label>
            <input type="text" id="fileName" v-model="newFile.name" placeholder="Enter file name">
          </div>
          
          <div class="form-group">
            <label for="fileType">File Type</label>
            <select id="fileType" v-model="newFile.type">
              <option value="text">Text Document</option>
              <option value="spreadsheet">Spreadsheet</option>
              <option value="presentation">Presentation</option>
              <option value="image">Image</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="fileContent">Content</label>
            <textarea id="fileContent" v-model="newFile.content" placeholder="Enter content"></textarea>
          </div>
        </div>
        <div class="v-card-actions">
          <button @click="showFileModal = false" class="v-btn">Cancel</button>
          <button @click="saveFile" class="v-btn v-btn--primary" :disabled="isLoading">Save</button>
        </div>
      </div>
    </div>
    
    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="v-dialog" @click="showDeleteModal = false">
      <div class="v-card dialog-content" @click.stop>
        <div class="v-card-title">
          <h2>Confirm Delete</h2>
          <button @click="showDeleteModal = false" class="v-btn v-btn--icon">
            <span class="mdi mdi-close"></span>
          </button>
        </div>
        <div class="v-card-text dialog-body">
          <p>Are you sure you want to delete <strong>{{ fileToDelete?.name }}</strong>?</p>
          <p class="warning">This action cannot be undone.</p>
        </div>
        <div class="v-card-actions">
          <button @click="showDeleteModal = false" class="v-btn">Cancel</button>
          <button @click="deleteFile" class="v-btn v-btn--danger" :disabled="isLoading">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DashboardView',
  setup() {
    const store = useStore();
    
    // State
    const files = computed(() => store.getters.userFiles);
    const isLoading = computed(() => store.getters.isLoading);
    const showFileModal = ref(false);
    const showDeleteModal = ref(false);
    const fileToDelete = ref(null);
    const newFile = ref({
      name: '',
      type: 'text',
      content: '',
      size: 0
    });
    
    // Calculate total file size
    const totalSize = computed(() => {
      const bytes = files.value.reduce((sum, file) => sum + (file.size || 0), 0);
      return formatFileSize(bytes);
    });
    
    // Load files on component mount
    onMounted(async () => {
      try {
        await store.dispatch('loadFiles');
      } catch (error) {
        console.error('Failed to load files', error);
      }
    });
    
    // File management methods
    const saveFile = async () => {
      try {
        // Calculate file size based on content
        const size = new Blob([newFile.value.content]).size;
        
        const fileData = {
          ...newFile.value,
          size,
          createdDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString()
        };
        
        await store.dispatch('saveFile', fileData);
        
        // Reset form and close modal
        newFile.value = { name: '', type: 'text', content: '', size: 0 };
        showFileModal.value = false;
      } catch (error) {
        console.error('Failed to save file', error);
      }
    };
    
    const openFile = (file) => {
      // In a real app, this would open the file in a viewer or editor
      console.log('Opening file:', file);
      
      // For demonstration, we could show content in an alert or a modal
      alert(`File content: ${file.content}`);
    };
    
    const downloadFile = (file) => {
      // Create a blob from the file content
      const blob = new Blob([file.content], { type: getContentType(file.type) });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    
    const confirmDeleteFile = (file) => {
      fileToDelete.value = file;
      showDeleteModal.value = true;
    };
    
    const deleteFile = async () => {
      if (!fileToDelete.value) return;
      
      try {
        await store.dispatch('deleteFile', fileToDelete.value.id);
        showDeleteModal.value = false;
        fileToDelete.value = null;
      } catch (error) {
        console.error('Failed to delete file', error);
      }
    };
    
    // Helper functions
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };
    
    const getFileIcon = (fileType) => {
      switch (fileType) {
        case 'text': return 'description';
        case 'spreadsheet': return 'table_chart';
        case 'presentation': return 'slideshow';
        case 'image': return 'image';
        default: return 'insert_drive_file';
      }
    };
    
    const getContentType = (fileType) => {
      switch (fileType) {
        case 'text': return 'text/plain';
        case 'spreadsheet': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'presentation': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'image': return 'image/png';
        default: return 'text/plain';
      }
    };
    
    return {
      files,
      isLoading,
      showFileModal,
      showDeleteModal,
      fileToDelete,
      newFile,
      totalSize,
      saveFile,
      openFile,
      downloadFile,
      confirmDeleteFile,
      deleteFile,
      formatFileSize,
      formatDate,
      getFileIcon
    };
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* Remove flutter-specific styles and rely on Vuetify's built-in classes */
.content-area {
  margin: 24px 0;
}

.stats-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-state-icon {
  font-size: 64px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

/* Dialog styles */
.dialog-content {
  padding: 16px;
}

.dialog-body {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>