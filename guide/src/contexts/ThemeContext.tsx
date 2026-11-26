import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
    brandColors: {
        primary: string
        secondary: string
        accent: string
    }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const defaultBrandColors = {
    primary: '#0073bb', // CloudScape 기본 파란색
    secondary: '#146eb4',
    accent: '#1d8102'
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // 시스템 테마 감지
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
            if (savedTheme) return savedTheme

            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    })

    const [brandColors] = useState(defaultBrandColors)

    useEffect(() => {
        // CloudScape 테마 설정
        document.documentElement.setAttribute('data-awsui-theme', theme)
        document.documentElement.setAttribute('data-theme', theme)

        // 다크모드 클래스 설정
        if (theme === 'dark') {
            document.body.classList.add('awsui-dark-mode')
        } else {
            document.body.classList.remove('awsui-dark-mode')
        }

        // 로컬 스토리지에 저장
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, brandColors }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}