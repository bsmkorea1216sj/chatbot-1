import React from 'react'
import '../../styles/guide-badges.css'

interface GuideBadgeProps {
    type: 'step' | 'info' | 'warning' | 'success' | 'error' | 'test' | 'output' |
    'beginner' | 'intermediate' | 'advanced' |
    'completed' | 'current' | 'pending' |
    'lab' | 'theory' | 'project'
    children: React.ReactNode
    className?: string
}

/**
 * 실습 가이드용 배지 컴포넌트
 * 단계, 난이도, 상태 등을 시각적으로 구분하여 표시합니다.
 */
export const GuideBadge: React.FC<GuideBadgeProps> = ({
    type,
    children,
    className = '',
    ...props
}) => {
    const badgeClass = `guide-badge guide-badge--${type}`
    const combinedClassName = [badgeClass, className].filter(Boolean).join(' ')

    // 배지 타입별 한국어 텍스트 매핑
    const getBadgeText = () => {
        switch (type) {
            case 'step': return '단계'
            case 'info': return '정보'
            case 'warning': return '주의'
            case 'success': return '완료'
            case 'error': return '오류'
            case 'test': return '테스트'
            case 'output': return '결과'
            case 'beginner': return '초급'
            case 'intermediate': return '중급'
            case 'advanced': return '고급'
            case 'completed': return '완료됨'
            case 'current': return '진행중'
            case 'pending': return '대기중'
            case 'lab': return '실습'
            case 'theory': return '이론'
            case 'project': return '프로젝트'
            default: return children
        }
    }

    return (
        <span
            className={combinedClassName}
            role="status"
            aria-label={`${getBadgeText()} 배지`}
            {...props}
        >
            {children || getBadgeText()}
        </span>
    )
}

export default GuideBadge