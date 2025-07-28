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
        <svg-icon v-if="tab.iconName" :name="tab.iconName" size="24" :color="tab.iconColor"/>
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
  iconColor?: string
}

// Refs
const editor = ref<HTMLElement | null>(null)
const modelMap = new Map<number, monaco.editor.ITextModel | null>()
const viewStateMap = new Map<number, monaco.editor.ICodeEditorViewState | null>()
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

// Tab management
const tabs = ref<Tab[]>([
  {
    id: 1,
    name: 'HelloWorld.js',
    content: 'console.log(123)',
    language: 'javascript',
    iconName: 'javascript',
    iconColor: '#F5DD1E'
  },
  {
    id: 2,
    name: 'HelloWorld.ts',
    content: 'const a: number = 123',
    language: 'typescript',
    iconName: 'typescript',
    iconColor: '#0288D1'
  },
  {
    id: 3,
    name: 'HelloWorld.java',
    content: 'public class HelloWorld {\n\tpublic static void main(String[] args) {}\n}',
    language: 'java',
    iconName: 'java',
    iconColor: '#6699FF'
  },
  {
    id: 4,
    name: 'HelloWorld.cs',
    content: 'namespace HelloWorld;\n\npublic class HelloWorld {}',
    language: 'csharp',
    iconName: 'csharp',
    iconColor: '#68217A'
  }
])
const activeTab = ref<number>(0)

// Tab operations
const switchTab = (index: number) => {
  if (!editorInstance) {
    return
  }

  const prevTabId = tabs.value[activeTab.value].id
  const newTabId = tabs.value[index].id

  viewStateMap?.set(prevTabId, editorInstance.saveViewState())


  activeTab.value = index
  const newModel = modelMap?.get(newTabId)
  if (!newModel) {
    return
  }
  editorInstance.setModel(newModel)
  const viewState = viewStateMap?.get(newTabId)
  if (!viewState) {
    return
  }

  editorInstance.restoreViewState(viewState)
  editorInstance.focus()
}

const addTab = async () => {
  const newId = tabs.value.length + 1
  const newTab = {
    id: newId,
    name: `Tab ${newId}`,
    content: '// New tab content',
    language: 'javascript'
  }
  tabs.value.push(newTab)

  const newModel = monaco.editor.createModel(newTab.content, newTab.language)
  modelMap?.set(newId, newModel)
  await nextTick()
  switchTab(tabs.value.length - 1)
}

const closeTab = (index: number) => {
  if (tabs.value.length <= 1) {
    return
  }

  const closedTab = tabs.value[index]
  tabs.value.splice(index, 1)

  const closedModel = modelMap?.get(closedTab.id)
  if (closedModel) {
    closedModel?.dispose()
    modelMap?.delete(closedTab.id)
    viewStateMap?.delete(closedTab.id)
  }

  if (activeTab.value >= tabs.value.length) {
    activeTab.value = tabs.value.length - 1
  }

  switchTab(activeTab.value)
}

// Initialize Monaco Editor
onMounted(async () => {
  await nextTick()

  if (!editor.value) {
    console.error('Editor element not found')
    return
  }

  tabs.value.forEach(tab => {
    const model = monaco.editor.createModel(tab.content, tab.language)
    modelMap?.set(tab.id, model)
  })

  const currentModel = modelMap?.get(tabs.value[0].id)
  editorInstance = monaco.editor.create(editor.value, {
    model: currentModel,
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 16
  })

})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.dispose()
  }
})
</script>

<style scoped></style>
