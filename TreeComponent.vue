<script setup lang="ts">
  const {
    getTreeData,
    createNodes,
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
  <a-tree :tree-data="getTreeData" class="custom-tree">
    <template #VALUE="{ title, dataRef }">
      <div>{{ title }}</div>
      <a-input v-model:value="dataRef.VALUE" disabled></a-input>
      <a-button @click="updateNodeValue(dataRef.key, 'updatedValue')"> update </a-button>
      <a-button @click="getNodeInfo(dataRef.key)"> info </a-button>
      <a-button @click="createNodeChild(dataRef.key, { TITLE: '', VALUE: 'newChildValue' })">+</a-button>
      <a-button @click="removeNode(dataRef.key)">-</a-button>
    </template>
  </a-tree>
</template>

<style lang="scss">
  .custom-tree.ant-tree {
    li {
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .ant-tree {
      &-switcher {
        margin-top: 8px;
      }
      &-treenode-switcher-close,
      &-treenode-switcher-open {
        display: flex;
        flex-wrap: wrap;
      }
      &-child-tree {
        width: 100%;
        margin-top: 30px;
      }
      &-node-content-wrapper {
        display: block;
        height: 40px;
      }
    }
  }
</style>
