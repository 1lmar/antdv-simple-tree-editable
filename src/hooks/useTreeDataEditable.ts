import { computed, ref, Ref, unref } from 'vue'

interface TreeItemProps<T> {
  TITLE: string
  VALUE: T
  CHILDS: TreeItemProps<T>[]
}

interface TreeItem<T> extends Omit<TreeItemProps<T>, 'CHILDS'> {
  KEY: string
  CHILDS: TreeItem<T>[]
}

type TreeDataItem<T> = {
  VALUE: T | null
  title: string
  key: string
  children: TreeDataItem<T>[]
  slots?: object
}

/**
 * Composition API to edit ant-design tree
 */
export function useTreeDataEditable<T>() {
  const treeData = ref<TreeItem<T>[]>([]) as Ref<TreeItem<T>[]>

  function getNode(KEY: string, treeData: TreeItem<T>[]): any {
    return treeData.reduce((a, item) => {
      if (a) return a
      if (item.KEY === KEY) return item
      if (item.CHILDS) return getNode(KEY, item.CHILDS)
    }, null)
  }

  function createNodes(PROPS: TreeItemProps<T>[]) {
    PROPS.forEach((treeItemProps) => {
      treeData.value.push({
        KEY: `0-${treeData.value.length}`,
        ...treeItemProps,
        CHILDS: treeItemProps.CHILDS
          ? validateTreeItemProps(
              treeItemProps.CHILDS,
              `0-${treeData.value.length}`
            )
          : [],
      })
    })
  }

  function validateTreeItemProps(
    treeItems: TreeItemProps<T>[],
    prefixKey: string
  ): TreeItem<T>[] {
    if (!(treeItems.length > 0)) return []
    return treeItems.map((treeItemProps, index) => {
      return {
        KEY: `${prefixKey}-${index}`,
        ...treeItemProps,
        CHILDS: treeItemProps.CHILDS
          ? validateTreeItemProps(treeItemProps.CHILDS, `${prefixKey}-${index}`)
          : [],
      }
    })
  }

  function createNodeChild(KEY: string, PROPS: Omit<TreeItemProps<T>, 'CHILDS'>) {
    const treeItem = getNode(KEY, treeData.value)
    treeItem.CHILDS.push({
      KEY: `${treeItem.KEY}-${treeItem.CHILDS.length}`,
      TITLE: PROPS.TITLE,
      VALUE: PROPS.VALUE,
      CHILDS: [],
    })
  }

  function createParentNode(PROPS: Omit<TreeItemProps<T>, 'CHILDS'>) {
    return treeData.value.push({
      KEY: `0-${treeData.value.length}`,
      ...PROPS,
      CHILDS: [],
    })
  }

  function removeNode(KEY: string) {
    if (isParentNode(KEY)) return removeParentNode(KEY)
    const parentItem: TreeItem<T> = getNode(
      getParentKey(KEY),
      treeData.value as TreeItem<T>[]
    )
    parentItem.CHILDS = parentItem.CHILDS.filter((item) => item.KEY !== KEY)
  }

  function removeParentNode(KEY: string) {
    treeData.value = treeData.value.filter((item) => item.KEY !== KEY)
  }

  function isLastNode(KEY: string) {
    if (isParentNode(KEY)) return !(treeData.value.length > 1)
    const parentItem = getTreeItem(getParentKey(KEY))
    return !(parentItem.CHILDS.length > 1)
  }

  function isParentNode(KEY: string) {
    return KEY.split('-').length <= 2
  }

  function getParentKey(KEY: string) {
    const keys = KEY.split('-')
    keys.splice(-1)
    return keys.join('-')
  }

  /**
   * Метод проверяет, удовлетворяет ли какой-либо элемент дерева
   * условию, заданному в передаваемой функции.
   */
  function someTreeItem(callback: (item: TreeItem<T>) => boolean): boolean {
    return someTreeItemRecursion(treeData.value, callback)
  }

  function someTreeItemRecursion(
    trees: TreeItem<T>[],
    callback: (item: TreeItem<T>) => boolean
  ): boolean {
    return trees.some((parentItem) => {
      if (callback(parentItem)) return true
      if (!(parentItem.CHILDS.length > 0)) return false
      return someTreeItemRecursion(parentItem.CHILDS, callback)
    })
  }

  function clearTree() {
    return (treeData.value = [])
  }

  function getTreeItem(KEY: string): TreeItem<T> {
    return unref(getNode(KEY, treeData.value))
  }

  function updateNodeValue(KEY: string, VALUE: T) {
    const treeItem: TreeItem<T> = getNode(KEY, treeData.value)
    treeItem.VALUE = VALUE
  }

  function clearChilds(KEY: string) {
    const treeItem: TreeItem<T> = getNode(KEY, treeData.value)
    treeItem.CHILDS = []
  }

  const getTreeData = computed(() => {
    return treeData.value.map((item) => convertTreeData(item))
  })

  function convertTreeData(item: TreeItem<T>): TreeDataItem<T> {
    return {
      VALUE: item.VALUE || null,
      title: item.TITLE,
      key: item.KEY,
      children: item.CHILDS
        ? item.CHILDS.map((child) => convertTreeData(child))
        : [],
    }
  }

  return {
    getTreeData,
    getTreeItem,
    getParentKey,
    createParentNode,
    removeNode,
    someTreeItem,
    createNodes,
    createNodeChild,
    clearTree,
    updateNodeValue,
    clearChilds,
    isLastNode,
  }
}
