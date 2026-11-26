import React, { useState, useEffect } from 'react'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Checkbox from '@cloudscape-design/components/checkbox'
import { GuideBadge } from '../ui/GuideBadge'
import '@/styles/key-points-checklist.css'

interface KeyPointsChecklistProps {
    title: string
    items: string[]
    storageKey: string
    showProgress?: boolean
}

/**
 * 학습 목표나 체크리스트를 표시하는 교육용 컴포넌트
 * 로컬 스토리지를 사용하여 체크 상태를 저장합니다.
 */
export const KeyPointsChecklist: React.FC<KeyPointsChecklistProps> = ({
    title,
    items,
    storageKey,
    showProgress = true
}) => {
    const [checkedItems, setCheckedItems] = useState<boolean[]>([])

    // 로컬 스토리지에서 체크 상태 로드
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsedChecked = JSON.parse(saved)
                if (Array.isArray(parsedChecked) && parsedChecked.length === items.length) {
                    setCheckedItems(parsedChecked)
                } else {
                    setCheckedItems(new Array(items.length).fill(false))
                }
            } else {
                setCheckedItems(new Array(items.length).fill(false))
            }
        } catch (error) {
            console.error('체크리스트 상태 로드 실패:', error)
            setCheckedItems(new Array(items.length).fill(false))
        }
    }, [items.length, storageKey])

    // 체크 상태 변경 핸들러
    const handleItemCheck = (index: number, checked: boolean) => {
        const newCheckedItems = [...checkedItems]
        newCheckedItems[index] = checked
        setCheckedItems(newCheckedItems)

        // 로컬 스토리지에 저장
        try {
            localStorage.setItem(storageKey, JSON.stringify(newCheckedItems))
        } catch (error) {
            console.error('체크리스트 상태 저장 실패:', error)
        }
    }

    // 진행률 계산
    const completedCount = checkedItems.filter(Boolean).length
    const progressPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

    return (
        <Container
            header={
                <Header
                    variant="h3"
                    actions={
                        showProgress && (
                            <SpaceBetween direction="horizontal" size="xs">
                                <GuideBadge type={progressPercentage === 100 ? 'success' : 'info'}>
                                    {completedCount}/{items.length}
                                </GuideBadge>
                                {progressPercentage === 100 && (
                                    <GuideBadge type="success">완료</GuideBadge>
                                )}
                            </SpaceBetween>
                        )
                    }
                >
                    {title}
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="s">
                {items.map((item, index) => (
                    <Checkbox
                        key={index}
                        checked={checkedItems[index] || false}
                        onChange={({ detail }) => handleItemCheck(index, detail.checked)}
                    >
                        <span className={`checklist-item-text ${checkedItems[index] ? 'checklist-item-text--checked' : ''}`}>
                            {item}
                        </span>
                    </Checkbox>
                ))}

                {showProgress && progressPercentage === 100 && (
                    <Box
                        variant="div"
                        padding={{ top: 's' }}
                        textAlign="center"
                    >
                        <span className="checklist-completion-message">
                            🎉 모든 학습 목표를 달성했습니다!
                        </span>
                    </Box>
                )}
            </SpaceBetween>
        </Container>
    )
}

export default KeyPointsChecklist