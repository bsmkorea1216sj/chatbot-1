import React from 'react'
import { copyright } from '@/data/siteConfig'
import '@/styles/footer.css'

interface FooterProps {
    variant?: 'light' | 'dark'
}

export const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
    return (
        <footer className={`app-footer app-footer--${variant}`}>
            <div className="app-footer-content">
                <p className="app-footer-copyright">
                    {copyright}
                </p>
                <p className="app-footer-credit">
                    모든 샘플 파일의 회사명·인물·수치는 실습용 가상 데이터입니다.
                </p>
            </div>
        </footer>
    )
}
