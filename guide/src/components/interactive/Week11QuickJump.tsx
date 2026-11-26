import React from 'react'
import {
    Container,
    Header,
    Button,
    Grid,
    SpaceBetween,
    Box,
    Badge
} from '@cloudscape-design/components'

interface Week11QuickJumpProps {
    onJumpToSection?: (sectionId: string) => void
    completedSteps?: number[]
    environmentReady?: boolean
}

export const Week11QuickJump: React.FC<Week11QuickJumpProps> = ({
    onJumpToSection,
    completedSteps = [],
    environmentReady = false
}) => {
    const quickLinks = [
        {
            id: 'overview',
            title: '실습 개요',
            description: '학습 목표 및 사용 서비스',
            icon: '📋',
            available: true
        },
        {
            id: 'environment',
            title: '환경 설정',
            description: 'SageMaker Studio 접속',
            icon: '⚙️',
            available: true
        },
        {
            id: 'pipeline',
            title: '파이프라인 생성',
            description: 'ML 워크플로 구축',
            icon: '🔄',
            available: environmentReady
        },
        {
            id: 'model-registry',
            title: 'Model Registry',
            description: '모델 버전 관리',
            icon: '📦',
            available: completedSteps.length >= 5
        },
        {
            id: 'code-examples',
            title: '코드 예제',
            description: '파이프라인 코드 샘플',
            icon: '💻',
            available: true
        },
        {
            id: 'troubleshooting',
            title: '문제 해결',
            description: '일반적인 오류 해결',
            icon: '🔧',
            available: true
        }
    ]

    const handleJumpToSection = (sectionId: string) => {
        if (onJumpToSection) {
            onJumpToSection(sectionId)
        } else {
            // 기본 동작: 해당 섹션으로 스크롤
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }

    const getButtonVariant = (link: any) => {
        if (!link.available) return 'normal'
        if (link.id === 'pipeline' && environmentReady) return 'primary'
        if (link.id === 'model-registry' && completedSteps.length >= 5) return 'primary'
        return 'normal'
    }

    return (
        <Container
            header={
                <Header
                    variant="h3"
                    description="실습 섹션으로 빠르게 이동합니다"
                >
                    빠른 이동
                </Header>
            }
        >
            <Grid gridDefinition={[
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } }
            ]}>
                {quickLinks.map((link, index) => (
                    <Box key={index}>
                        <Button
                            variant={getButtonVariant(link)}
                            onClick={() => handleJumpToSection(link.id)}
                            fullWidth
                            disabled={!link.available}
                        >
                            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                <Box fontSize="heading-s">{link.icon}</Box>
                                <Box>
                                    <Box fontWeight="bold">{link.title}</Box>
                                    <Box fontSize="body-s" color="text-body-secondary">
                                        {link.description}
                                    </Box>
                                </Box>
                            </SpaceBetween>
                        </Button>
                        {!link.available && (
                            <Box margin={{ top: 'xs' }}>
                                <Badge color="grey">
                                    {link.id === 'pipeline' ? '환경 설정 필요' :
                                        link.id === 'model-registry' ? '파이프라인 완료 필요' : '준비중'}
                                </Badge>
                            </Box>
                        )}
                    </Box>
                ))}
            </Grid>
        </Container>
    )
}