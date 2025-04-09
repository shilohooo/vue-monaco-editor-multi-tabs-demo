<template>
  <div class="h-screen flex flex-col">
    <div class="flex bg-[#2d2d2d]">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.id"
        class="flex justify-center items-center gap-2 text-white cursor-pointer px-4 py-2"
        :class="{ 'bg-[#1e1e1e]': activeTab === index,'border-b-1': activeTab === index }"
        @click="switchTab(index)"
      >
        <svg-icon v-if="tab.iconName" :name="tab.iconName" size="24"/>
        <span :class="{ 'text-gray-500': activeTab !== index }">{{ tab.name }}</span>
        <div class="ml-2 text-sm cursor-pointer hover:text-red-400" @click.stop="closeTab(index)">×</div>
      </div>
      <button class="m-1 px-2 text-white cursor-pointer border-none hover:text-green-300 text-2xl"
              @click="addTab">
        +
      </button>
    </div>
    <div ref="editor" class="flex-1/2 min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import SvgIcon from '@/components/SvgIcon.vue'

// Types
interface Tab {
  id: number
  name: string
  content: string
  language: string
  iconName?: string
}

// Refs
const editor = ref<HTMLElement | null>(null)
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

// Tab management
const tabs = ref<Tab[]>([
  { id: 1, name: 'HelloWorld.js', content: 'console.log(123)', language: 'javascript', iconName: 'javascript' },
  { id: 2, name: 'HelloWorld.ts', content: 'const a: number = 123', language: 'typescript', iconName: 'typescript' },
  {
    id: 3,
    name: 'HelloWorld.java',
    content: 'public class HelloWorld {\n\tpublic static void main(String[] args) {}\n}',
    language: 'java',
    iconName: 'java'
  },
  {
    id: 4,
    name: 'HelloWorld.cs',
    content: 'namespace HelloWorld;\n\npublic class HelloWorld {}',
    language: 'csharp',
    iconName: 'csharp'
  }
])
const activeTab = ref<number>(0)

// Initialize Monaco Editor
onMounted(() => {
  if (editor.value) {
    editorInstance = monaco.editor.create(editor.value, {
      value: tabs.value[0].content,
      language: tabs.value[0].language,
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 16
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

<style scoped></style>
