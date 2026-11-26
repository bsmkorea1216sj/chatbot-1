import React from 'react'
import {
    Container,
    Header,
    ProgressBar,
    SpaceBetween,
    Box
} from '@cloudscape-design/components'
import { useProgress } from '@/contexts/ProgressContext'

interface ProgressTrackerProps {
    // 현재 props 없음 - 향후 확장 가능
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = () => {
    const { getProgressPercentage, completedWeeks, currentWeek } = useProgress()

    return (
        <Container
            header={
                <Header variant="h2">
                    학습 진도
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="m">
                <Box>
                    <ProgressBar
                        value={getProgressPercentage()}
                        label="전체 진도"
                        description={`${completedWeeks.length}/15 주차 완료`}
                    />
                </Box>

                <Box>
                    <strong>현재 주차:</strong> Week {currentWeek}
                </Box>

                <Box>
                    <strong>완료된 주차:</strong> {completedWeeks.length > 0 ? completedWeeks.join(', ') : '없음'}
                </Box>
            </SpaceBetween>
        </Container>
    )
}