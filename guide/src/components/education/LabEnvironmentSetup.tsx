import React, { useState } from 'react'
import {
    Container,
    Header,
    SpaceBetween,
    Alert,
    Box,
    Button,
    StatusIndicator,
    Link
} from '@cloudscape-design/components'
import { CopyableCode } from './CopyableCode'

interface SetupStep {
    id: string
    title: string
    description: string
    copyableValue?: string
    action?: React.ReactNode
}

interface LabEnvironmentSetupProps {
    title: string
    setupSteps: SetupStep[]
}

export const LabEnvironmentSetup: React.FC<LabEnvironmentSetupProps> = ({
    title,
    setupSteps
}) => {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

    const toggleStep = (stepId: string) => {
        setCompletedSteps(prev => {
            const newSet = new Set(prev)
            if (newSet.has(stepId)) {
                newSet.delete(stepId)
            } else {
                newSet.add(stepId)
            }
            return newSet
        })
    }

    const allStepsCompleted = completedSteps.size === setupSteps.length

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    description="실습 환경을 설정하고 준비 상태를 확인하세요"
                    actions={
                        <StatusIndicator type={allStepsCompleted ? 'success' : 'in-progress'}>
                            {allStepsCompleted ? '설정 완료' : '설정 진행중'}
                        </StatusIndicator>
                    }
                >
                    {title}
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="l">
                <Alert type="info" header="실습 환경 설정 안내">
                    <SpaceBetween direction="vertical" size="s">
                        <Box>실습을 시작하기 전에 다음 단계들을 순서대로 완료해주세요.</Box>
                        <Box>각 단계를 완료한 후 '완료' 버튼을 클릭하여 진행 상황을 추적하세요.</Box>
                    </SpaceBetween>
                </Alert>

                <SpaceBetween direction="vertical" size="l">
                    {setupSteps.map((step, index) => (
                        <Container
                            key={index}
                            header={
                                <Header
                                    variant="h3"
                                    actions={
                                        <Button
                                            variant={completedSteps.has(step.id) ? 'normal' : 'primary'}
                                            onClick={() => toggleStep(step.id)}
                                        >
                                            {completedSteps.has(step.id) ? '완료됨 ✓' : '완료'}
                                        </Button>
                                    }
                                >
                                    {step.title}
                                </Header>
                            }
                        >
                            <SpaceBetween direction="vertical" size="m">
                                <Box>{step.description}</Box>

                                {step.copyableValue && (
                                    <Box>
                                        <Box variant="awsui-key-label" margin={{ bottom: 'xs' }}>
                                            복사할 값:
                                        </Box>
                                        <CopyableCode
                                            term={step.copyableValue}
                                            type="url"
                                            variant="block"
                                        />
                                    </Box>
                                )}

                                {step.action && (
                                    <Box>
                                        <Box variant="awsui-key-label" margin={{ bottom: 'xs' }}>
                                            수행 작업:
                                        </Box>
                                        <Box padding="xs">
                                            {step.action}
                                        </Box>
                                    </Box>
                                )}
                            </SpaceBetween>
                        </Container>
                    ))}
                </SpaceBetween>

                <Alert type="warning" header="문제 해결">
                    <SpaceBetween direction="vertical" size="s">
                        <Box>
                            <strong>오류: 우선 로그 아웃 필요</strong><br />
                            "You must first log out before logging into a different AWS account" 메시지가 표시되면:
                        </Box>
                        <ul>
                            <li>"click here" 링크를 선택합니다</li>
                            <li>Amazon Web Services Sign In 웹 브라우저 탭을 닫습니다</li>
                            <li>초기 실습 페이지로 돌아가서 "콘솔 열기"를 다시 선택합니다</li>
                        </ul>

                        <Box>
                            <strong>오류: 실습 시작 선택 시 아무 반응이 없음</strong><br />
                            팝업 또는 스크립트 차단 프로그램 때문일 수 있습니다:
                        </Box>
                        <ul>
                            <li>팝업 차단 프로그램을 비활성화하거나 허용 목록에 추가</li>
                            <li>페이지를 새로 고친 후 다시 시도</li>
                        </ul>
                    </SpaceBetween>
                </Alert>

                {allStepsCompleted && (
                    <Alert type="success" header="환경 설정 완료!">
                        <SpaceBetween direction="vertical" size="s">
                            <Box>
                                모든 환경 설정이 완료되었습니다. 이제 SageMaker Pipelines 실습을 시작할 수 있습니다.
                            </Box>
                            <Box>
                                JupyterLab에서 <strong>lab_6.ipynb</strong> 노트북을 열고 실습을 진행하세요.
                            </Box>
                        </SpaceBetween>
                    </Alert>
                )}

                <Box>
                    <Box margin={{ bottom: 'xs' }} fontWeight="bold">
                        추가 도움이 필요하신가요?
                    </Box>
                    <SpaceBetween direction="horizontal" size="s">
                        <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/studio.html">
                            SageMaker Studio 사용자 가이드
                        </Link>
                        <Link external href="https://aws.amazon.com/training/">
                            AWS Training and Certification
                        </Link>
                    </SpaceBetween>
                </Box>
            </SpaceBetween>
        </Container>
    )
}
