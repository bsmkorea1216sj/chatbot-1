// Buffer polyfill for browser
import { Buffer as BufferPolyfill } from 'buffer/'

// 전역 타입 확장
declare global {
    interface Window {
        Buffer: typeof BufferPolyfill
        global: typeof globalThis
    }
    // eslint-disable-next-line no-var
    var global: typeof globalThis
}

// Buffer를 전역으로 설정 (gray-matter가 사용)
if (typeof window !== 'undefined') {
    window.Buffer = BufferPolyfill
    window.global = window
        ; (globalThis as any).Buffer = BufferPolyfill
}

// Node.js 스타일 global 객체 설정
if (typeof (globalThis as any)['global'] === 'undefined') {
    (globalThis as any)['global'] = globalThis
}

export { BufferPolyfill as Buffer }
