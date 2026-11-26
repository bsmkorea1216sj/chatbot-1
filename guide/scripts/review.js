#!/usr/bin/env node

/**
 * 종합 리뷰 스크립트
 * 코드 품질과 가이드 품질을 검토하고 REVIEW_REPORT.json 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComprehensiveReviewer {
    constructor() {
        this.report = {
            timestamp: new Date().toISOString(),
            code: {
                total: 0,
                passed: 0,
                failed: 0,
                score: 0,
                issues: []
            },
            guides: {
                total: 0,
                passed: 0,
                failed: 0,
                score: 0,
                issues: []
            },
            overall: {
                score: 0,
                grade: 'F',
                recommendations: []
            }
        };
    }

    /**
     * 코드 품질 검사 (TypeScript, ESLint)
     */
    async checkCodeQuality() {
        console.log('🔍 코드 품질 검사 중...\n');

        try {
            // TypeScript 타입 체크
            console.log('  - TypeScript 타입 체크...');
            execSync('npm run type-check', { stdio: 'pipe' });
            this.report.code.passed++;
            console.log('    ✅ 타입 체크 통과');
        } catch (error) {
            this.report.code.failed++;
            this.report.code.issues.push({
                category: 'TypeScript',
                severity: 'error',
                message: '타입 오류 발견',
                count: 1
            });
            console.log('    ❌ 타입 체크 실패');
        }

        try {
            // ESLint 검사
            console.log('  - ESLint 검사...');
            execSync('npm run lint', { stdio: 'pipe' });
            this.report.code.passed++;
            console.log('    ✅ ESLint 통과');
        } catch (error) {
            this.report.code.failed++;
            this.report.code.issues.push({
                category: 'ESLint',
                severity: 'error',
                message: 'Lint 오류 발견',
                count: 1
            });
            console.log('    ❌ ESLint 실패');
        }

        this.report.code.total = this.report.code.passed + this.report.code.failed;
        this.report.code.score = this.report.code.total > 0
            ? Math.round((this.report.code.passed / this.report.code.total) * 100)
            : 0;

        console.log(`\n📦 코드 품질 점수: ${this.report.code.score}점\n`);
    }

    /**
     * 가이드 품질 검사 (validate.js)
     */
    async checkGuideQuality() {
        console.log('📚 가이드 품질 검사 중...\n');

        try {
            const output = execSync('npm run validate', { 
                stdio: 'pipe',
                encoding: 'utf-8'
            });

            // validate.js 출력 파싱
            const errorMatch = output.match(/오류:\s*(\d+)/);
            const warningMatch = output.match(/경고:\s*(\d+)/);
            const infoMatch = output.match(/정보:\s*(\d+)/);
            const totalMatch = output.match(/발견된 항목:\s*(\d+)/);

            const errors = errorMatch ? parseInt(errorMatch[1]) : 0;
            const warnings = warningMatch ? parseInt(warningMatch[1]) : 0;
            const infos = infoMatch ? parseInt(infoMatch[1]) : 0;
            const total = totalMatch ? parseInt(totalMatch[1]) : 0;

            this.report.guides.total = total;
            this.report.guides.failed = errors;
            this.report.guides.passed = total - errors;

            if (errors > 0) {
                this.report.guides.issues.push({
                    category: '가이드 표준',
                    severity: 'error',
                    message: '가이드 표준 오류',
                    count: errors
                });
            }

            if (warnings > 0) {
                this.report.guides.issues.push({
                    category: '가이드 경고',
                    severity: 'warning',
                    message: '가이드 표준 경고',
                    count: warnings
                });
            }

            // 점수 계산: 오류는 -10점, 경고는 -2점, 정보는 -0.5점
            const deduction = (errors * 10) + (warnings * 2) + (infos * 0.5);
            this.report.guides.score = Math.max(0, Math.round(100 - deduction));

            console.log(`  - 오류: ${errors}개`);
            console.log(`  - 경고: ${warnings}개`);
            console.log(`  - 정보: ${infos}개`);
            console.log(`\n📚 가이드 품질 점수: ${this.report.guides.score}점\n`);

        } catch (error) {
            console.log('  ⚠️ 가이드 검증 중 오류 발생');
            this.report.guides.score = 50;
        }
    }

    /**
     * 종합 점수 계산
     */
    calculateOverallScore() {
        // 코드 40%, 가이드 60% 가중치
        this.report.overall.score = Math.round(
            (this.report.code.score * 0.4) + (this.report.guides.score * 0.6)
        );

        // 등급 산정
        if (this.report.overall.score >= 90) {
            this.report.overall.grade = 'A';
        } else if (this.report.overall.score >= 80) {
            this.report.overall.grade = 'B';
        } else if (this.report.overall.score >= 70) {
            this.report.overall.grade = 'C';
        } else if (this.report.overall.score >= 60) {
            this.report.overall.grade = 'D';
        } else {
            this.report.overall.grade = 'F';
        }

        // 권장사항 생성
        this.generateRecommendations();
    }

    /**
     * 권장사항 생성
     */
    generateRecommendations() {
        const recommendations = [];

        // 코드 품질 권장사항
        if (this.report.code.score < 100) {
            const codeIssues = this.report.code.issues;
            codeIssues.forEach(issue => {
                recommendations.push({
                    priority: 'high',
                    category: issue.category,
                    message: issue.message,
                    action: `${issue.category} 오류를 수정하세요`
                });
            });
        }

        // 가이드 품질 권장사항
        if (this.report.guides.failed > 0) {
            recommendations.push({
                priority: 'high',
                category: '가이드 표준',
                message: `${this.report.guides.failed}개의 가이드 오류 발견`,
                action: 'npm run validate를 실행하여 상세 내용을 확인하고 수정하세요'
            });
        }

        if (this.report.guides.score < 90) {
            recommendations.push({
                priority: 'medium',
                category: '가이드 품질',
                message: '가이드 품질 개선 필요',
                action: '경고 및 정보 항목을 검토하여 가이드 품질을 향상시키세요'
            });
        }

        // 전체 점수가 낮은 경우
        if (this.report.overall.score < 70) {
            recommendations.push({
                priority: 'high',
                category: '전체 품질',
                message: '전체 품질이 기준 미달',
                action: '코드와 가이드 모두 개선이 필요합니다'
            });
        }

        this.report.overall.recommendations = recommendations;
    }

    /**
     * 리포트 저장
     */
    saveReport() {
        const reportPath = path.join(process.cwd(), 'REVIEW_REPORT.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
        console.log(`\n✅ 리포트 저장: ${reportPath}\n`);
    }

    /**
     * 결과 출력
     */
    printSummary() {
        console.log('═══════════════════════════════════════════════════');
        console.log(`📊 종합 검토 결과`);
        console.log('═══════════════════════════════════════════════════');
        console.log(`\n🎯 전체 점수: ${this.report.overall.score}점 (${this.report.overall.grade}등급)\n`);
        console.log(`📦 코드 품질: ${this.report.code.score}점`);
        console.log(`   - 통과: ${this.report.code.passed}/${this.report.code.total}`);
        console.log(`   - 실패: ${this.report.code.failed}/${this.report.code.total}\n`);
        console.log(`📚 가이드 품질: ${this.report.guides.score}점`);
        console.log(`   - 검사 항목: ${this.report.guides.total}개`);
        console.log(`   - 오류: ${this.report.guides.failed}개\n`);

        if (this.report.overall.recommendations.length > 0) {
            console.log('💡 권장사항:');
            this.report.overall.recommendations.forEach((rec, idx) => {
                const priorityIcon = rec.priority === 'high' ? '🔴' : '🟡';
                console.log(`   ${idx + 1}. ${priorityIcon} [${rec.priority.toUpperCase()}] ${rec.message}`);
                console.log(`      → ${rec.action}`);
            });
            console.log('');
        }

        console.log('═══════════════════════════════════════════════════\n');
    }

    /**
     * 메인 실행
     */
    async run() {
        console.log('\n🚀 종합 품질 검토 시작\n');

        await this.checkCodeQuality();
        await this.checkGuideQuality();
        this.calculateOverallScore();
        this.saveReport();
        this.printSummary();

        // 품질 기준 미달 시 exit code 1
        if (this.report.overall.score < 70) {
            console.log('❌ 품질 기준 미달 (70점 미만)\n');
            process.exit(1);
        }

        console.log('✅ 품질 기준 충족\n');
        process.exit(0);
    }
}

// 실행
const reviewer = new ComprehensiveReviewer();
reviewer.run().catch(error => {
    console.error('❌ 검토 중 오류 발생:', error);
    process.exit(1);
});
