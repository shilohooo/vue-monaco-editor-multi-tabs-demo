<template>
  <div class="h-screen flex flex-col">
    <EditorTabs :tabs="tabs" @switch-tab="handleSwitchTab"/>
    <div ref="editor" class="flex-1/2 min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, ref } from 'vue'
  import * as monaco from 'monaco-editor'
  import MonacoGitHubLightTheme from '@/assets/monaco-themes/GitHubLight.json'
  import EditorTabs from '@/components/EditorTabs.vue'
  import type { Tab } from '@/types/monaco-editor.ts'

  const props = defineProps<{ tabs: Tab[] }>()

  // Refs
  const editor = ref<HTMLElement | null>(null)
  const modelMap = new Map<number, monaco.editor.ITextModel | null>()
  const viewStateMap = new Map<number, monaco.editor.ICodeEditorViewState | null>()
  let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

  // Tab operations
  function handleSwitchTab(currentTabIdx: number, prevTabIdx?: number) {
    if (!editorInstance) {
      return
    }

    if (prevTabIdx !== null && prevTabIdx !== undefined) {
      viewStateMap?.set(props.tabs[prevTabIdx].id, editorInstance.saveViewState())
    }

    const newTabId = props.tabs[currentTabIdx].id
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

  // Initialize Monaco Editor
  onMounted(async () => {
    await nextTick()

    if (!editor.value) {
      console.error('Editor element not found')
      return
    }


    props.tabs.forEach(tab => {
      const model = monaco.editor.createModel(tab.content, tab.language)
      modelMap?.set(tab.id, model)
    })

    const currentModel = modelMap?.get(props.tabs[0].id)
    editorInstance = monaco.editor.create(editor.value, {
      model: currentModel,
      automaticLayout: true,
      fontSize: 16
    })

    monaco.editor.defineTheme('GitHubLight', MonacoGitHubLightTheme as monaco.editor.IStandaloneThemeData)
    monaco.editor.setTheme('GitHubLight')

  })

  onUnmounted(() => {
    if (editorInstance) {
      editorInstance.dispose()
    }
  })
</script>

<style scoped></style>
