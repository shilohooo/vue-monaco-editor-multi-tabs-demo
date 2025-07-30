<!--
  * Editor tabs
  * @author shiloh
  * @date 2025/7/30 10:13
-->
<template>
  <div class="flex border-b-1 border-b-gray-300 border-solid mb-4">
    <q-tabs
      v-model="activeTab"
      v-for="(tab, index) in tabs"
      :key="tab.id"
      dense
      indicator-color="primary"
      active-color="dark"
    >
      <q-tab :name="index" no-caps class="border-r-1 border-solid border-r-gray-300">
        <template #default>
          <div class="flex justify-center items-center gap-2 py-1">
            <svg-icon v-if="tab.iconName" :name="tab.iconName" size="24" :color="tab.iconColor"/>
            <span :class="{ 'text-gray-500': activeTab !== index }">{{ tab.name }}</span>
          </div>
        </template>
      </q-tab>
    </q-tabs>
  </div>
</template>

<script setup lang="ts">
  import SvgIcon from '@/components/SvgIcon.vue'
  import { ref, watch } from 'vue'
  import type { Tab } from '@/types/monaco-editor.ts'

  defineProps<{ tabs: Tab[] }>()

  const emits = defineEmits<{
    (e: 'switch-tab', currentTabIdx: number, prevTabIdx: number): void;
  }>()

  const activeTab = ref<number>(0)

  // region watch

  watch(
    () => activeTab.value,
    (value, oldValue) => {
      emits('switch-tab', value, oldValue)
    }
  )

  // endregion
</script>

<style scoped>

</style>