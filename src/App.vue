<script setup lang="ts">
  import { useTreeDataEditable } from "./hooks/useTreeDataEditable"
  import { Tree as ATree, Input as AInput, Button as AButton } from 'ant-design-vue'
  import { TreeDataItem as TreeData } from 'ant-design-vue/lib/tree/Tree'

  const {
    getTreeData,
    createNodes,
    createParentNode,
    updateNodeValue,
    getTreeItem,
    createNodeChild,
    removeNode,
  } = useTreeDataEditable<string>()

  createNodes([
    {
      TITLE: 'parent-0',
      VALUE: 'value',
      CHILDS: [
        {
          TITLE: 'child-0-0',
          VALUE: 'value',
          CHILDS: [
            {
              TITLE: 'child-0-0-0',
              VALUE: 'value',
              CHILDS: [],
            },
          ],
        },
        {
          TITLE: 'child-0-1',
          VALUE: 'value',
          CHILDS: [],
        },
      ],
    },
  ])
  const getNodeInfo = (key: string) => {
    console.log(getTreeItem(key))
  }
</script>

<template>
  <h1 class="custom-tree-title">Tree data editable</h1>
  <div class="custom-tree-container">
    <a-button @click="createParentNode({ TITLE: 'New created parent', VALUE: 'value' })"> Create parent </a-button> <br><br>
    <a-tree :tree-data="(getTreeData as TreeData[])" default-expand-all>
      <template #title="dataRef">
        <div>{{ dataRef.title }}</div>
        <a-input v-model:value="dataRef.VALUE" disabled></a-input>
        <a-button @click="updateNodeValue(dataRef.key, 'updatedValue')"> update </a-button>
        <a-button @click="getNodeInfo(dataRef.key)"> info </a-button>
        <a-button @click="createNodeChild(dataRef.key, { TITLE: '', VALUE: 'newChildValue' })">+</a-button>
        <a-button @click="removeNode(dataRef.key)">-</a-button>
      </template>
    </a-tree>
  </div>
</template>

<style lang="scss">
.custom-tree-title {
  text-align: center;
  margin: 60px 0 30px;
}
.custom-tree-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
