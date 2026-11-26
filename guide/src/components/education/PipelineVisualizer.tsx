import React from 'react'
import {
    Container,
    Header,
    SpaceBetween,
    Box,
    Badge,
    StatusIndicator,
    ProgressBar
} from '@cloudscape-design/components'
import '@/styles/pipeline-visualizer.css'

interface PipelineStep {
    id: string
    name: string
    status: 'pending' | 'running' | 'success' | 'failed'
    duration?: string
    description?: string
    artifacts?: string[]
    logs?: string
}

interface PipelineVisualizerProps {
    title: string
    steps: PipelineStep[]
    overallStatus: 'pending' | 'running' | 'success' | 'failed'
    executionTime?: string
    onStepClick?: (stepId: string) => void
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
    title,
    steps,
    overallStatus,
    executionTime,
    onStepClick
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'success'
            case 'running': return 'in-progress'
            case 'failed': return 'error'
            default: return 'pending'
        }
    }

    const getOverallStatusBadge = () => {
        switch (overallStatus) {
            case 'success':
                return <Badge color="green">✅ 완료</Badge>
            case 'running':
                return <Badge color="blue">🔄 실행중</Badge>
            case 'failed':
                return <Badge color="red">❌ 실패</Badge>
            default:
                return <Badge color="grey">⏳ 대기</Badge>
        }
    }

    const completedSteps = steps.filter(step => step.status === 'success').length
    const progressPercentage = (completedSteps / steps.length) * 100

    return (
        <Container
            header={
                <Header
                    variant="h3"
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            {getOverallStatusBadge()}
                            {executionTime && (
                                <Badge color="grey">⏱️ {executionTime}</Badge>
                            )}
                        </SpaceBetween>
                    }
                >
                    {title}
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="m">
                {/* 전체 진행률 */}
                <ProgressBar
                    value={progressPercentage}
                    label="파이프라인 진행률"
                    description={`${completedSteps}/${steps.length} 단계 완료`}
                />

                {/* 파이프라인 단계들 */}
                <SpaceBetween direction="vertical" size="s">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`pipeline-step-card ${step.status === 'running' ? 'pipeline-step-card--running' : ''} ${onStepClick ? 'pipeline-step-card--clickable' : ''}`}
                            onClick={() => onStepClick?.(step.id)}
                        >
                            <SpaceBetween direction="horizontal" size="m" alignItems="center">
                                {/* 단계 번호 */}
                                <div className={`pipeline-step-number pipeline-step-number--${step.status}`}>
                                    {step.status === 'success' ? '✓' :
                                        step.status === 'failed' ? '✗' :
                                            step.status === 'running' ? '⟳' : index + 1}
                                </div>

                                {/* 단계 정보 */}
                                <div className="pipeline-step-info">
                                    <SpaceBetween direction="vertical" size="xs">
                                        <SpaceBetween direction="horizontal" size="s" alignItems="center">
                                            <Box fontWeight="bold">{step.name}</Box>
                                            <StatusIndicator type={getStatusColor(step.status)}>
                                                {step.status === 'success' ? '완료' :
                                                    step.status === 'running' ? '실행중' :
                                                        step.status === 'failed' ? '실패' : '대기'}
                                            </StatusIndicator>
                                            {step.duration && (
                                                <Badge color="grey">{step.duration}</Badge>
                                            )}
                                        </SpaceBetween>

                                        {step.description && (
                                            <Box color="text-body-secondary" fontSize="body-s">
                                                {step.description}
                                            </Box>
                                        )}

                                        {step.artifacts && step.artifacts.length > 0 && (
                                            <Box>
                                                <Box fontSize="body-s" fontWeight="bold">생성된 아티팩트:</Box>
                                                <SpaceBetween direction="horizontal" size="xs">
                                                    {step.artifacts.map((artifact, artifactIndex) => (
                                                        <Badge key={artifactIndex} color="blue">
                                                            {artifact}
                                                        </Badge>
                                                    ))}
                                                </SpaceBetween>
                                            </Box>
                                        )}
                                    </SpaceBetween>
                                </div>

                                {/* 연결선 (마지막 단계가 아닌 경우) */}
                                {index < steps.length - 1 && (
                                    <div className="pipeline-step-connector" />
                                )}
                            </SpaceBetween>
                        </div>
                    ))}
                </SpaceBetween>
            </SpaceBetween>
        </Container>
    )
}