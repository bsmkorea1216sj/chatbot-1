import React, { useState, useEffect } from 'react'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Box from '@cloudscape-design/components/box'
import RadioGroup from '@cloudscape-design/components/radio-group'
import Button from '@cloudscape-design/components/button'
import Alert from '@cloudscape-design/components/alert'
import ExpandableSection from '@cloudscape-design/components/expandable-section'
import { GuideBadge } from '../ui/GuideBadge'
import '@/styles/task-quiz.css'

interface QuizQuestion {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

interface TaskQuizProps {
    taskNumber: number
    questions: QuizQuestion[]
    storageKey: string
}

/**
 * 태스크 완료 후 이해도를 확인하는 퀴즈 컴포넌트
 * 접을 수 있는 형태로 제공되며, 로컬 스토리지에 답변을 저장합니다.
 */
export const TaskQuiz: React.FC<TaskQuizProps> = ({
    taskNumber,
    questions,
    storageKey
}) => {
    const [expanded, setExpanded] = useState(false)
    const [answers, setAnswers] = useState<(number | null)[]>([])
    const [submitted, setSubmitted] = useState(false)
    const [showResults, setShowResults] = useState(false)

    // 로컬 스토리지에서 답변 로드
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const savedData = JSON.parse(saved)
                setAnswers(savedData.answers || new Array(questions.length).fill(null))
                setSubmitted(savedData.submitted || false)
                setShowResults(savedData.submitted || false)
            } else {
                setAnswers(new Array(questions.length).fill(null))
            }
        } catch (error) {
            console.error('퀴즈 상태 로드 실패:', error)
            setAnswers(new Array(questions.length).fill(null))
        }
    }, [questions.length, storageKey])

    // 답변 변경 핸들러
    const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
        const newAnswers = [...answers]
        newAnswers[questionIndex] = answerIndex
        setAnswers(newAnswers)

        // 로컬 스토리지에 저장
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                answers: newAnswers,
                submitted: false
            }))
        } catch (error) {
            console.error('퀴즈 답변 저장 실패:', error)
        }
    }

    // 제출 핸들러
    const handleSubmit = () => {
        // 모든 문제에 답변했는지 확인
        const allAnswered = answers.every(answer => answer !== null)

        if (!allAnswered) {
            alert('모든 문제에 답변해주세요.')
            return
        }

        setSubmitted(true)
        setShowResults(true)

        // 로컬 스토리지에 저장
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                answers,
                submitted: true
            }))
        } catch (error) {
            console.error('퀴즈 제출 저장 실패:', error)
        }
    }

    // 다시 풀기 핸들러
    const handleReset = () => {
        setAnswers(new Array(questions.length).fill(null))
        setSubmitted(false)
        setShowResults(false)

        // 로컬 스토리지 초기화
        try {
            localStorage.removeItem(storageKey)
        } catch (error) {
            console.error('퀴즈 초기화 실패:', error)
        }
    }

    // 점수 계산
    const correctCount = answers.filter((answer, index) =>
        answer === questions[index].correctAnswer
    ).length
    const score = questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0

    return (
        <div className="task-quiz-wrapper">
            <ExpandableSection
                variant="container"
                expanded={expanded}
                onChange={({ detail }) => setExpanded(detail.expanded)}
                headerText={
                    <SpaceBetween direction="horizontal" size="s" alignItems="center">
                        <span>💡 이해도 확인</span>
                        {submitted && (
                            <GuideBadge type={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}>
                                {correctCount}/{questions.length} 정답
                            </GuideBadge>
                        )}
                    </SpaceBetween>
                }
            >
                <Container
                    header={
                        <Header
                            variant="h3"
                            description={`태스크 ${taskNumber}에서 학습한 내용을 확인해보세요`}
                            actions={
                                submitted && (
                                    <Button
                                        variant="normal"
                                        iconName="refresh"
                                        onClick={handleReset}
                                    >
                                        다시 풀기
                                    </Button>
                                )
                            }
                        >
                            태스크 {taskNumber} 이해도 확인
                        </Header>
                    }
                >
                    <SpaceBetween direction="vertical" size="l">
                        {/* 퀴즈 문제들 */}
                        {questions.map((question, qIndex) => (
                            <Box key={qIndex} variant="div" className="quiz-question">
                                <SpaceBetween direction="vertical" size="m">
                                    {/* 문제 */}
                                    <Box variant="div">
                                        <Box variant="h4" margin={{ bottom: 's' }}>
                                            문제 {qIndex + 1}
                                        </Box>
                                        <Box variant="p" fontSize="body-m">
                                            {question.question}
                                        </Box>
                                    </Box>

                                    {/* 선택지 */}
                                    <RadioGroup
                                        value={answers[qIndex]?.toString() || ''}
                                        onChange={({ detail }) =>
                                            handleAnswerChange(qIndex, parseInt(detail.value))
                                        }
                                        items={question.options.map((option, oIndex) => ({
                                            value: oIndex.toString(),
                                            label: option,
                                            disabled: submitted
                                        }))}
                                    />

                                    {/* 정답 표시 및 설명 */}
                                    {showResults && (
                                        <Alert
                                            type={
                                                answers[qIndex] === question.correctAnswer
                                                    ? 'success'
                                                    : 'error'
                                            }
                                            header={
                                                answers[qIndex] === question.correctAnswer
                                                    ? '✓ 정답입니다!'
                                                    : '✗ 오답입니다'
                                            }
                                        >
                                            <SpaceBetween direction="vertical" size="xs">
                                                {answers[qIndex] !== question.correctAnswer && (
                                                    <Box>
                                                        <strong>정답:</strong> {question.options[question.correctAnswer]}
                                                    </Box>
                                                )}
                                                <Box>
                                                    <strong>설명:</strong> {question.explanation}
                                                </Box>
                                            </SpaceBetween>
                                        </Alert>
                                    )}
                                </SpaceBetween>
                            </Box>
                        ))}

                        {/* 제출 버튼 및 결과 */}
                        {!submitted ? (
                            <Box textAlign="center">
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={answers.some(answer => answer === null)}
                                >
                                    답안 제출
                                </Button>
                            </Box>
                        ) : (
                            <Alert
                                type={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'info'}
                                header={`점수: ${score}점 (${correctCount}/${questions.length} 정답)`}
                            >
                                <SpaceBetween direction="vertical" size="xs">
                                    {score >= 80 && (
                                        <Box>🎉 훌륭합니다! 태스크 내용을 잘 이해하셨습니다.</Box>
                                    )}
                                    {score >= 60 && score < 80 && (
                                        <Box>👍 좋습니다! 조금 더 복습하면 완벽할 것 같습니다.</Box>
                                    )}
                                    {score < 60 && (
                                        <Box>📖 태스크 내용을 다시 한 번 복습해보세요.</Box>
                                    )}
                                </SpaceBetween>
                            </Alert>
                        )}
                    </SpaceBetween>
                </Container>
            </ExpandableSection>
        </div>
    )
}

export default TaskQuiz
