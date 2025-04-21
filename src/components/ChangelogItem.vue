<template>
  <ul :class="[
    'space-y-2', 
    depth === 0 ? 'list-disc' : 'list-[\'•\']',
    depth === 0 ? 'pl-0' : 'pl-4 mt-2'
  ]">
    <li v-for="(item, index) in items" :key="index" class="text-gray-200">
      <template v-if="typeof item === 'string'">
        <span v-html="item"></span>
      </template>
      <template v-else>
        <span v-html="item.text"></span>
        <ChangelogItem 
          v-if="item.subItems && item.subItems.length" 
          :items="item.subItems" 
          :depth="depth + 1" 
        />
      </template>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
});
</script>