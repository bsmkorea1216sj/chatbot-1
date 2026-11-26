import React from 'react'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import Alert from '@cloudscape-design/components/alert'
import ExpandableSection from '@cloudscape-design/components/expandable-section'
import { GuideBadge } from '../ui/GuideBadge'
import '@/styles/lab-step.css'

interface LabStepProps {
    stepNumber: number
    title: string
    instructions: (string | React.ReactNode)[]
    expectedResult?: string
    troubleshooting?: {
        issue: string
        solution: string
    }[]
}

/**
 * 실습 단계 컴포넌트
 * 각 실습 단계의 상세 지침과 예상 결과를 표시합니다.
 * 대학생들이 따라하기 쉽도록 매우 상세한 단계별 안내를 제공합니다.
 */
export const LabStep: React.FC<LabStepProps> = ({
    stepNumber,
    title,
    instructions,
    expectedResult,
    troubleshooting = []
}) => {
    return (
        <Container
            header={
                <Header
                    variant="h3"
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <GuideBadge type="step">
                                {stepNumber}단계
                            </GuideBadge>
                        </SpaceBetween>
                    }
                >
                    {title}
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="m">
                {/* 실습 지침 - 대학생들을 위해 매우 상세하게 작성 */}
                <div>
                    <SpaceBetween direction="vertical" size="s">
                        <Box variant="h4">📋 상세 실습 지침</Box>
                        <Alert type="info" header="💡 실습 팁">
                            각 단계를 천천히 따라하세요. 화면이 바뀌거나 새로운 창이 열리면 잠시 기다린 후 다음 단계로 진행하세요.
                        </Alert>
                        <ol className="lab-step-instructions-list">
                            {instructions.map((instruction, index) => (
                                <li
                                    key={index}
                                    className="lab-step-instruction"
                                >
                                    {typeof instruction === 'string' ? (
                                        <span dangerouslySetInnerHTML={{ __html: instruction }} />
                                    ) : (
                                        instruction
                                    )}
                                </li>
                            ))}
                        </ol>
                    </SpaceBetween>
                </div>

                {/* 예상 결과 - 학생들이 올바르게 진행했는지 확인할 수 있도록 */}
                {expectedResult && (
                    <div className="lab-step-result">
                        <SpaceBetween direction="vertical" size="s">
                            <div className="lab-step-result-title">
                                ✅ 예상 결과
                            </div>

                            <div className="lab-step-result-subtitle">
                                이 단계를 올바르게 완료했다면:
                            </div>

                            <div className="lab-step-result-content">
                                {expectedResult}
                            </div>

                            <div className="lab-step-result-tip">
                                💡 위와 같은 결과가 나타나지 않으면 이전 단계를 다시 확인해보세요.
                            </div>
                        </SpaceBetween>
                    </div>
                )}

                {/* 문제 해결 - 자주 발생하는 문제들에 대한 해결책 */}
                {troubleshooting.length > 0 && (
                    <ExpandableSection headerText="🔧 문제 해결 가이드" variant="container">
                        <SpaceBetween direction="vertical" size="m">
                            <div>
                                <strong>자주 발생하는 문제들과 해결 방법:</strong>
                            </div>
                            {troubleshooting.map((item, index) => (
                                <Alert key={index} type="warning" header={`❗ ${item.issue}`}>
                                    <div>
                                        <strong>해결 방법:</strong>
                                    </div>
                                    <div className="troubleshooting-solution">
                                        {item.solution}
                                    </div>
                                </Alert>
                            ))}
                            <Alert type="info" header="💬 추가 도움이 필요하다면">
                                <SpaceBetween direction="vertical" size="xs">
                                    <div>• 담당 교수님이나 조교에게 문의하세요</div>
                                    <div>• AWS 공식 문서를 참조하세요</div>
                                    <div>• 동료 학생들과 함께 문제를 해결해보세요</div>
                                </SpaceBetween>
                            </Alert>
                        </SpaceBetween>
                    </ExpandableSection>
                )}
            </SpaceBetween>
        </Container>
    )
}

export default LabStep