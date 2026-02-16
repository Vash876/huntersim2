<template>
  <div class="relative p-4 flex flex-col flex-1">
    <div class="flex items-center gap-2 mb-3">
      <IconSuperscript :size="30" class="text-amber-400" />
      <h4 class="text-sm font-semibold text-amber-300">Exponent Helper</h4>
    </div>

    <!-- Suffix → e-notation table -->
    <table class="w-full text-xs">
      <thead>
        <tr class="border-b border-gray-700/50">
          <th class="text-[10px] text-gray-500 text-left pb-1 font-normal">Suffix</th>
          <th class="text-[10px] text-gray-500 text-right pb-1 font-normal">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in suffixTable" :key="i" :class="i % 2 === 0 ? 'bg-amber-950/15' : ''">
          <td class="font-mono text-amber-400 px-1 py-0.5">{{ entry.label }}</td>
          <td class="font-mono text-right text-gray-300 px-1 py-0.5">{{ entry.notation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { IconSuperscript } from '@tabler/icons-vue';

const SUFFIXES = ['k','m','b','t','qa','qu','sx','sp','o','n','d'];

const suffixTable = SUFFIXES.map((suffix, i) => {
  const exp = (i + 1) * 3;
  return {
    label: `${suffix}`,
    notation: `1e${exp}`,
  };
});
</script>
