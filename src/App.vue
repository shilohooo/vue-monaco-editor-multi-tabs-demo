<script setup lang="ts">
  import MonacoEditor from './components/MonacoEditor.vue'
  import { ref } from 'vue'
  import type { Tab } from '@/types/monaco-editor.ts'

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
</script>

<template>
  <div>
    <monaco-editor :tabs="tabs"/>
  </div>
</template>

<style scoped></style>
