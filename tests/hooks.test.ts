import { describe, expect, it } from 'vitest'
import { useTreeDataEditable } from "../src/hooks/useTreeDataEditable"

describe('useTreeDataEditable', () => {
  it('should return a valid TreeData array', () => {
    const { createNodes, getTreeData } = useTreeDataEditable<string>()

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
})
