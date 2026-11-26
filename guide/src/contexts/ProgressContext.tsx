import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProgressContextType {
    completedWeeks: number[]
    currentWeek: number
    markWeekCompleted: (weekNumber: number) => void
    setCurrentWeek: (weekNumber: number) => void
    getProgressPercentage: () => number
    isWeekCompleted: (weekNumber: number) => boolean
    getWeekStatus: (weekNumber: number) => 'completed' | 'current' | 'pending'
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [completedWeeks, setCompletedWeeks] = useState<number[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('completedWeeks')
            return saved ? JSON.parse(saved) : []
        }
        return []
    })

    const [currentWeek, setCurrentWeek] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('currentWeek')
            return saved ? parseInt(saved) : 1
        }
        return 1
    })

    useEffect(() => {
        localStorage.setItem('completedWeeks', JSON.stringify(completedWeeks))
    }, [completedWeeks])

    useEffect(() => {
        localStorage.setItem('currentWeek', currentWeek.toString())
    }, [currentWeek])

    const markWeekCompleted = (weekNumber: number) => {
        setCompletedWeeks(prev => {
            if (!prev.includes(weekNumber)) {
                return [...prev, weekNumber].sort((a, b) => a - b)
            }
            return prev
        })

        // 다음 주차로 자동 이동
        if (weekNumber === currentWeek && weekNumber < 15) {
            setCurrentWeek(weekNumber + 1)
        }
    }

    const getProgressPercentage = () => {
        return (completedWeeks.length / 15) * 100
    }

    const isWeekCompleted = (weekNumber: number) => {
        return completedWeeks.includes(weekNumber)
    }

    const getWeekStatus = (weekNumber: number): 'completed' | 'current' | 'pending' => {
        if (completedWeeks.includes(weekNumber)) return 'completed'
        if (weekNumber === currentWeek) return 'current'
        return 'pending'
    }

    return (
        <ProgressContext.Provider value={{
            completedWeeks,
            currentWeek,
            markWeekCompleted,
            setCurrentWeek,
            getProgressPercentage,
            isWeekCompleted,
            getWeekStatus
        }}>
            {children}
        </ProgressContext.Provider>
    )
}

export const useProgress = () => {
    const context = useContext(ProgressContext)
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider')
    }
    return context
}