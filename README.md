# Ant Design Vue simple tree data editable
A simple antdv tree editable composition API example

```
<script setup lang="ts">
const { getTreeData, createNodes, ... } = useTreeDataEditable()
createNodes([
  {
    TITLE: 'parent-0',
    VALUE: 'value',
    CHILDS: [...],
  },
])
</script>
<template>
  <a-tree :tree-data="getTreeData">
    <template #VALUE="{ title, dataRef }">
      <div>{{ title }}</div>
      <a-input v-model:value="dataRef.VALUE" disabled></a-input>
      <a-button @click="updateNodeValue(dataRef.key, 'updatedValue')"> update </a-button>
      <a-button @click="createNodeChild(dataRef.key, { TITLE: '', VALUE: 'newChildValue' })">+</a-button>
      <a-button @click="removeNode(dataRef.key)">-</a-button>
    </template>
  </a-tree>
</template>
```