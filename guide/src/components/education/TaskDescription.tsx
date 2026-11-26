import React from 'react'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import ColumnLayout from '@cloudscape-design/components/column-layout'
import { GuideBadge } from '../ui/GuideBadge'
import '@/styles/task-description.css'

interface TaskDescriptionProps {
    taskNumber: number
    title: string
    description: string
    objectives: string[]
    prerequisites?: string[]
    estimatedSteps?: number
}

/**
 * 실습 태스크 설명 컴포넌트
 * 각 태스크의 개요, 목표, 사전 요구사항을 명확하게 표시합니다.
 */
export const TaskDescription: React.FC<TaskDescriptionProps> = ({
    taskNumber,
    title,
    description,
    objectives,
    prerequisites = [],
    estimatedSteps
}) => {
    return (
        <Container
            header={
                <Header
                    variant="h2"
                    description={description}
                    actions={
                        estimatedSteps ? (
                            <GuideBadge type="info">{estimatedSteps}단계</GuideBadge>
                        ) : undefined
                    }
                >
                    태스크 {taskNumber}. {title}
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="l">
                <ColumnLayout columns={prerequisites.length > 0 ? 2 : 1}>
                    {/* 학습 목표 */}
                    <Box>
                        <SpaceBetween direction="vertical" size="m">
                            <Box variant="h4">학습 목표</Box>
                            <ol className="task-objectives-list">
                                {objectives.map((objective, index) => (
                                    <li key={index}>
                                        {objective}
                                    </li>
                                ))}
                            </ol>
                        </SpaceBetween>
                    </Box>

                    {/* 사전 요구사항 */}
                    {prerequisites.length > 0 && (
                        <Box>
                            <SpaceBetween direction="vertical" size="m">
                                <Box variant="h4">사전 요구사항</Box>
                                <ul className="task-prerequisites-list">
                                    {prerequisites.map((prerequisite, index) => (
                                        <li key={index}>
                                            {prerequisite}
                                        </li>
                                    ))}
                                </ul>
                            </SpaceBetween>
                        </Box>
                    )}
                </ColumnLayout>
            </SpaceBetween>
        </Container>
    )
}

export default TaskDescription