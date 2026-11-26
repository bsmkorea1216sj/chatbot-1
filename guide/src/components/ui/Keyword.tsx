import React from 'react'
import { AWSButton } from './AWSButton'
import '@/styles/keyword.css'

interface KeywordProps {
    children: React.ReactNode
    className?: string
}

/**
 * AWS 콘솔 메뉴명, 버튼명, 중요 키워드를 강조하는 컴포넌트
 * 실습 가이드에서 AWS 콘솔의 UI 요소나 중요한 용어를 강조할 때 사용합니다.
 */
export const Keyword: React.FC<KeywordProps> = ({
    children,
    className = '',
    ...props
}) => {
    // children에서 실제 텍스트 추출
    const extractText = (node: any): string => {
        if (typeof node === 'string') return node
        if (Array.isArray(node)) return node.map(extractText).join('')
        if (node?.props?.children) return extractText(node.props.children)
        return ''
    }

    const fullText = extractText(children)

    // 버튼 키워드 감지 (대소문자 구분 없이)
    const buttonKeywords = [
        'create', 'delete', 'add', 'remove', 'edit', 'update',
        'save', 'cancel', 'next', 'previous', 'finish', 'start',
        'stop', 'enable', 'disable', 'launch', 'terminate',
        'connect', 'disconnect', 'attach', 'detach', 'upload',
        'download', 'install', 'uninstall', 'open', 'close',
        'sign out', 'sign in', 'log out', 'log in'
    ]

    const isButton = buttonKeywords.some(keyword =>
        fullText.toLowerCase().includes(keyword)
    )

    // 버튼인 경우 AWSButton으로 렌더링 (모두 오렌지색, small 크기)
    if (isButton) {
        return (
            <span className="keyword-button-wrapper">
                <AWSButton variant="primary">
                    {children}
                </AWSButton>
            </span>
        )
    }

    // 필드명 (Bucket name, Region, Type, Status 등)은 단순 굵게만
    const fieldNames = [
        'bucket name', 'region', 'name', 'type', 'status',
        'id', 'arn', 'key', 'value', 'username', 'user name',
        'password', 'email', 'address', 'port', 'endpoint',
        'vpc', 'subnet', 'security group', 'role', 'policy'
    ]
    const isFieldName = fieldNames.some(field =>
        fullText.toLowerCase().includes(field.toLowerCase())
    )

    if (isFieldName) {
        return <strong className="keyword-field-name">{children}</strong>
    }

    // 일반 키워드는 파란색 배경 강조
    return (
        <strong
            className={`keyword-highlight ${className}`}
            {...props}
        >
            {children}
        </strong>
    )
}

export default Keyword