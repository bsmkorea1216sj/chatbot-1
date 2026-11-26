import React from 'react'
import CopyToClipboard from '@cloudscape-design/components/copy-to-clipboard'
import '@/styles/user-value.css'

interface UserValueProps {
    children: React.ReactNode
    className?: string
    copyable?: boolean
}

export const UserValue: React.FC<UserValueProps> = ({
    children,
    copyable = true,
}) => {
    const textValue = typeof children === 'string'
        ? children.replace(/\s+/g, ' ').trim()
        : String(children).replace(/\s+/g, ' ').trim()

    return (
        <span className="user-value-wrapper">
            {copyable && (
                <span className="user-value-copy-button">
                    <CopyToClipboard
                        copyButtonAriaLabel={`${textValue} 복사`}
                        copyErrorText="복사 실패"
                        copySuccessText="복사됨"
                        textToCopy={textValue}
                        variant="icon"
                    />
                </span>
            )}
            <code className="user-value-code">
                {textValue}
            </code>
        </span>
    )
}

export default UserValue
