import * as React from "react";
import Button from "@cloudscape-design/components/button";
import './AWSButton.css'

interface AWSButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'normal' | 'link';
    size?: 'small' | 'normal' | 'large';
    disabled?: boolean;
    onClick?: () => void;
    iconName?: 'external' | 'status-positive' | 'status-negative';
    href?: string;
    download?: string;
}

/**
 * AWS 콘솔 버튼 컴포넌트
 * AWS 오렌지색 스타일을 사용합니다.
 * 실습 가이드에서 AWS 콘솔 버튼명을 표시할 때 사용합니다.
 */
export const AWSButton: React.FC<AWSButtonProps> = ({
    children,
    variant = 'primary',
    size = 'small',
    disabled = false,
    onClick,
    iconName,
    href,
    download,
    ...props
}) => {
    // large 크기일 때 커스텀 클래스 추가
    const buttonClass = size === 'large'
        ? 'aws-button-orange aws-button-large'
        : 'aws-button-orange';

    // 접근성을 위한 aria-label 생성
    const buttonText = typeof children === 'string' ? children : String(children);
    const ariaLabel = `AWS 콘솔 버튼: ${buttonText}`;

    return (
        <Button
            variant={variant}
            disabled={disabled}
            onClick={onClick}
            iconName={iconName as any}
            href={href}
            download={download}
            className={buttonClass}
            ariaLabel={ariaLabel}
            {...props}
        >
            {children}
        </Button>
    );
};

// default export도 제공
export default AWSButton;