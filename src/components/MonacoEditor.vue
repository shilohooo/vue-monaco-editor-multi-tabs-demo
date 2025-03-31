<template>
  <div class="editor-container">
    <div class="tab-headers">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :class="['tab-header', { active: activeTab === index }]"
        @click="switchTab(index)"
      >
        📝 {{ tab.name }}
        <span class="close-tab" @click.stop="closeTab(index)">×</span>
      </div>
      <button class="add-tab" @click="addTab">+ New Tab</button>
    </div>
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

// Types
interface Tab {
  id: number
  name: string
  content: string
  language: string
}

// Refs
const editor = ref<HTMLElement | null>(null)
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

// Tab management
const tabs = ref<Tab[]>([
  { id: 1, name: 'Tab 1', content: '// Start coding here', language: 'javascript' }
])
const activeTab = ref<number>(0)

// Initialize Monaco Editor
onMounted(() => {
  if (editor.value) {
    editorInstance = monaco.editor.create(editor.value, {
      value: tabs.value[0].content,
      language: tabs.value[0].language,
      theme: 'vs-dark',
      automaticLayout: true
    })

    editorInstance.onDidChangeModelContent(() => {
      if (editorInstance) {
        tabs.value[activeTab.value].content = editorInstance.getValue()
      }
    })
  }
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.dispose()
  }
})

// Tab operations
const switchTab = (index: number) => {
  if (editorInstance) {
    tabs.value[activeTab.value].content = editorInstance.getValue()
    activeTab.value = index
    editorInstance.setValue(tabs.value[index].content)
    monaco.editor.setModelLanguage(
      editorInstance.getModel()!,
      tabs.value[index].language
    )
  }
}

const addTab = () => {
  const newId = tabs.value.length + 1
  tabs.value.push({
    id: newId,
    name: `Tab ${newId}`,
    content: '// New tab content',
    language: 'javascript'
  })
  nextTick(() => switchTab(tabs.value.length - 1))
}

const closeTab = (index: number) => {
  if (tabs.value.length > 1) {
    tabs.value.splice(index, 1)
    if (activeTab.value >= tabs.value.length) {
      activeTab.value = tabs.value.length - 1
    }
    switchTab(activeTab.value)
  }
}
</script>

<style scoped>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.tab-headers {
  display: flex;
  background: #1e1e1e;
  border-bottom: 1px solid #444;
}

.tab-header {
  padding: 8px 15px;
  cursor: pointer;
  color: #fff;
  position: relative;
  user-select: none;
}

.tab-header.active {
  background: #2d2d2d;
  /*border-bottom: 2px solid #3b82f6;*/
  /*border-bottom: 2px solid #6b7280;*/
  /*border-bottom: 2px solid #10b981;*/
  /*border-bottom: 2px solid #ef4444;*/
  /*border-bottom: 2px solid #f59e0b;*/
  border-bottom: 2px solid #60a5fa;
}

.close-tab {
  margin-left: 8px;
  font-size: 16px;
  cursor: pointer;
}

.close-tab:hover {
  color: #ff4444;
}

.add-tab {
  margin: 4px;
  padding: 4px 10px;
  background: #444;
  color: white;
  border: none;
  cursor: pointer;
}

.add-tab:hover {
  background: #555;
}

.editor {
  flex: 1;
  min-height: 0;
}
</style>
