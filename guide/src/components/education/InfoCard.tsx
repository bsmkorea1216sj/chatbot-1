import React, { useState } from 'react'
import {
    Container,
    Header,
    SpaceBetween,
    Badge,
    Box,
    Button
} from '@cloudscape-design/components'

interface InfoCardProps {
    title: string
    description?: string
    type: 'info' | 'warning' | 'success' | 'error'
    estimatedTime?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    prerequisites?: string[]
    children: React.ReactNode
    collapsible?: boolean
    defaultExpanded?: boolean
}

export const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    type,
    estimatedTime,
    difficulty,
    prerequisites,
    children,
    collapsible = false,
    defaultExpanded = true
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    // 난이도별 색상 매핑 (초급: 녹색, 중급: 파란색, 고급: 빨간색)
    const getDifficultyBadgeColor = (difficulty?: string): 'blue' | 'green' | 'grey' | 'red' => {
        switch (difficulty) {
            case 'beginner':
                return 'green'
            case 'intermediate':
                return 'blue'
            case 'advanced':
                return 'red'
            default:
                return 'grey'
        }
    }

    // 난이도 한국어 표시
    const getDifficultyLabel = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner':
                return '초급'
            case 'intermediate':
                return '중급'
            case 'advanced':
                return '고급'
            default:
                return ''
        }
    }

    // 타입별 색상 매핑 - CloudScape Badge 지원 색상만 사용
    const getTypeColor = (type: string): 'blue' | 'green' | 'grey' | 'red' => {
        switch (type) {
            case 'info':
                return 'blue'
            case 'warning':
                return 'red' // warning을 red로 매핑 (yellow는 지원되지 않음)
            case 'success':
                return 'green'
            case 'error':
                return 'red'
            default:
                return 'grey'
        }
    }

    const headerContent = (
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
            <Box fontWeight="bold" fontSize="heading-s">{title}</Box>
            <SpaceBetween direction="horizontal" size="xs">
                <Badge color={getTypeColor(type)}>
                    {type === 'info' ? '정보' :
                        type === 'warning' ? '주의' :
                            type === 'success' ? '성공' :
                                type === 'error' ? '오류' : type}
                </Badge>
                {difficulty && (
                    <Badge color={getDifficultyBadgeColor(difficulty)}>
                        {getDifficultyLabel(difficulty)}
                    </Badge>
                )}
                {estimatedTime && (
                    <Badge color="grey">
                        ⏱️ {estimatedTime}
                    </Badge>
                )}
            </SpaceBetween>
        </SpaceBetween>
    )

    const cardContent = (
        <SpaceBetween direction="vertical" size="s">
            {description && (
                <Box color="text-body-secondary">
                    {description}
                </Box>
            )}

            {prerequisites && prerequisites.length > 0 && (
                <Box>
                    <Box fontWeight="bold" fontSize="body-s" color="text-label">
                        사전 요구사항:
                    </Box>
                    <SpaceBetween direction="vertical" size="xs">
                        {prerequisites.map((prerequisite, index) => (
                            <Box key={index} fontSize="body-s" color="text-body-secondary">
                                • {prerequisite}
                            </Box>
                        ))}
                    </SpaceBetween>
                </Box>
            )}

            <Box>{children}</Box>
        </SpaceBetween>
    )

    if (collapsible) {
        return (
            <Container
                header={
                    <Header
                        variant="h3"
                        actions={
                            <Button
                                variant="icon"
                                iconName={isExpanded ? "angle-up" : "angle-down"}
                                onClick={() => setIsExpanded(!isExpanded)}
                                ariaLabel={isExpanded ? "접기" : "펼치기"}
                            />
                        }
                    >
                        {headerContent}
                    </Header>
                }
            >
                {isExpanded && cardContent}
            </Container>
        )
    }

    return (
        <Container
            header={
                <Header variant="h3">
                    {headerContent}
                </Header>
            }
        >
            {cardContent}
        </Container>
    )
}