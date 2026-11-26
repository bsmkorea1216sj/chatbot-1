import React, { useState } from 'react'
import {
    Box,
    Button,
    SpaceBetween,
    Badge,
    Popover
} from '@cloudscape-design/components'

interface CopyableCodeProps {
    term: string
    description?: string
    type?: 'command' | 'code' | 'config' | 'url'
    copyable?: boolean
    badge?: string
    variant?: 'inline' | 'block'
}

export const CopyableCode: React.FC<CopyableCodeProps> = ({
    term,
    description,
    type = 'command',
    copyable = true,
    badge,
    variant = 'inline'
}) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(term)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('복사 실패:', err)
        }
    }

    const getTypeStyle = () => {
        const baseStyle = {
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: 'var(--font-size-body-s)',
            padding: 'var(--space-xs)',
            borderRadius: 'var(--border-radius-item)',
            border: '1px solid var(--color-border-divider-default)'
        }

        switch (type) {
            case 'command':
                return {
                    ...baseStyle,
                    backgroundColor: 'var(--color-background-code-editor)',
                    color: 'var(--color-text-accent)'
                }
            case 'code':
                return {
                    ...baseStyle,
                    backgroundColor: 'var(--color-background-container-content)',
                    color: 'var(--color-text-body-default)'
                }
            case 'config':
                return {
                    ...baseStyle,
                    backgroundColor: 'var(--color-background-notification-blue)',
                    color: 'var(--color-text-notification-default)'
                }
            case 'url':
                return {
                    ...baseStyle,
                    backgroundColor: 'var(--color-background-notification-green)',
                    color: 'var(--color-text-notification-default)'
                }
            default:
                return baseStyle
        }
    }

    const termElement = (
        <span style={getTypeStyle()}>
            {term}
        </span>
    )

    const content = (
        <SpaceBetween
            direction={variant === 'inline' ? 'horizontal' : 'vertical'}
            size="xs"
        >
            {description ? (
                <Popover
                    size="medium"
                    position="top"
                    triggerType="custom"
                    dismissButton={false}
                    content={
                        <Box>
                            <strong>{type === 'command' ? 'Command' : type === 'code' ? 'Code' : type === 'config' ? 'Configuration' : 'URL'}:</strong>
                            <br />
                            {description}
                        </Box>
                    }
                >
                    {termElement}
                </Popover>
            ) : (
                termElement
            )}

            <SpaceBetween direction="horizontal" size="xs">
                {badge && (
                    <Badge color="blue">{badge}</Badge>
                )}

                {copyable && (
                    <Button
                        variant="icon"
                        iconName={copied ? "check" : "copy"}
                        onClick={handleCopy}
                        ariaLabel={`${term} 복사`}
                    />
                )}
            </SpaceBetween>
        </SpaceBetween>
    )

    return variant === 'block' ? (
        <Box margin={{ vertical: 'xs' }}>
            {content}
        </Box>
    ) : (
        content
    )
}