import { describe, expect, it } from 'vitest'
import { useTreeDataEditable } from "../src/hooks/useTreeDataEditable"

describe('useTreeDataEditable', () => {
    const { createNodes, getTreeData, getTreeItem, getParentKey, createParentNode } = useTreeDataEditable<string>()

    createNodes([
        {
            TITLE: 'parent-0',
            VALUE: 'value',
            CHILDS: [
                {
                    TITLE: 'child-0-0',
                    VALUE: 'value',
                    CHILDS: [],
                },
            ],
        },
    ])

    it('should return a valid TreeData array', () => {
        const expectedTreeData = [
            {
                key: '0-0',
                title: 'parent-0',
                VALUE: 'value',
                children: [
                    {
                        key: '0-0-0',
                        title: 'child-0-0',
                        VALUE: 'value',
                        children: [],
                    },
                ],
            }
        ]

        expect(getTreeData.value).toEqual(expectedTreeData)
    })

    it('should return a valid tree item', () => {
        const expectedTreeItem = {
            KEY: '0-0-0',
            TITLE: 'child-0-0',
            VALUE: 'value',
            CHILDS: [],
        }

        expect(getTreeItem('0-0-0')).toEqual(expectedTreeItem)
    })

    it('should return a parent key', () => {
        expect(getParentKey('0-0-0')).toEqual('0-0')
    })

    it('should create a parent node', () => {
        const expectedParentNode = {
            KEY: '0-1',
            TITLE: 'new parent node',
            VALUE: 'value',
            CHILDS: [],
        }

        createParentNode({
            TITLE: expectedParentNode.TITLE,
            VALUE: expectedParentNode.VALUE
        })

        expect(getTreeItem(expectedParentNode.KEY)).toEqual(expectedParentNode)
    })
})
