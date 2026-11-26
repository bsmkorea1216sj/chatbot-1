import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Header,
    Button,
    Grid
} from '@cloudscape-design/components'

interface QuickJumpProps {
    // 현재 props 없음 - 향후 확장 가능
}

export const QuickJump: React.FC<QuickJumpProps> = () => {
    const navigate = useNavigate()

    const quickLinks = [
        { title: '환경 설정', href: '/setup', description: 'AWS 환경 설정 가이드' },
        { title: 'Week 1', href: '/week/1', description: 'AWS 기초 및 관리 인터페이스' },
        { title: 'Week 5', href: '/week/5', description: '기초 과정 마무리' },
        { title: 'Week 10', href: '/week/10', description: '중급 과정 마무리' },
        { title: 'Week 15', href: '/week/15', description: '고급 과정 마무리' },
        { title: '중간고사', href: '/midterm', description: '중간 평가' }
    ]

    return (
        <Container
            header={
                <Header variant="h2">
                    빠른 이동
                </Header>
            }
        >
            <Grid gridDefinition={[
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } },
                { colspan: { default: 12, xs: 6, s: 4, m: 4, l: 4 } }
            ]}>
                {quickLinks.map((link, index) => (
                    <Button
                        key={index}
                        variant="normal"
                        onClick={() => navigate(link.href)}
                        fullWidth
                    >
                        {link.title}
                    </Button>
                ))}
            </Grid>
        </Container>
    )
}