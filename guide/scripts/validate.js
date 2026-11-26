#!/usr/bin/env node

/**
 * 고급 검증 규칙 - 추가 표준 검증
 * 
 * 기본 검증(validate-markdown-guide.js)을 통과한 후
 * 더 세밀한 표준을 검증합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

class AdvancedValidator {
    constructor() {
        this.issues = [];
    }

    /**
     * 고급 검증 규칙
     */
    rules = {
        // 1. Front Matter 완성도 검증
        frontMatterCompleteness: {
            check: (content, filePath) => {
                const issues = [];
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

                if (!frontMatterMatch) return issues;

                const frontMatter = frontMatterMatch[1];

                // awsServices 필드 권장
                if (!frontMatter.includes('awsServices:')) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: '권장: awsServices 필드 추가 (AWS 서비스 배지 표시)',
                        severity: 'info',
                        category: 'Front Matter'
                    });
                }

                // learningObjectives 필드 권장
                if (!frontMatter.includes('learningObjectives:')) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: '권장: learningObjectives 필드 추가 (학습 목표 표시)',
                        severity: 'info',
                        category: 'Front Matter'
                    });
                }

                // prerequisites 필드 권장
                if (!frontMatter.includes('prerequisites:')) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: '권장: prerequisites 필드 추가 (사전 요구사항 표시)',
                        severity: 'info',
                        category: 'Front Matter'
                    });
                }

                return issues;
            }
        },

        // 2. 표준 구조 검증
        standardStructure: {
            check: (content, filePath) => {
                const issues = [];

                // "## 실습 개요" 섹션이 있으면 경고 (Front Matter로 대체)
                if (content.includes('## 실습 개요')) {
                    issues.push({
                        file: filePath,
                        line: content.split('\n').findIndex(l => l.includes('## 실습 개요')) + 1,
                        message: '중복: "## 실습 개요" 섹션 제거 (Front Matter로 자동 표시)',
                        severity: 'warning',
                        category: '구조'
                    });
                }

                // "## 실습 목표" 섹션이 있으면 경고
                if (content.includes('## 실습 목표') || content.includes('## 학습 목표')) {
                    issues.push({
                        file: filePath,
                        line: content.split('\n').findIndex(l => l.includes('## 실습 목표') || l.includes('## 학습 목표')) + 1,
                        message: '중복: "## 실습 목표" 섹션 제거 (learningObjectives로 자동 표시)',
                        severity: 'warning',
                        category: '구조'
                    });
                }

                // "## 사전 요구사항" 섹션이 있으면 경고
                if (content.includes('## 사전 요구사항')) {
                    issues.push({
                        file: filePath,
                        line: content.split('\n').findIndex(l => l.includes('## 사전 요구사항')) + 1,
                        message: '중복: "## 사전 요구사항" 섹션 제거 (prerequisites로 자동 표시)',
                        severity: 'warning',
                        category: '구조'
                    });
                }

                // "## 리소스 정리" 섹션 권장
                if (!content.includes('## 리소스 정리')) {
                    issues.push({
                        file: filePath,
                        line: content.split('\n').length,
                        message: '권장: "## 리소스 정리" 섹션 추가',
                        severity: 'info',
                        category: '구조'
                    });
                }

                return issues;
            }
        },

        // 3. Alert 사용 패턴 검증
        alertUsage: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // WARNING Alert에 비용 정보 포함 권장
                lines.forEach((line, index) => {
                    if (line.includes('[!WARNING]')) {
                        const nextLines = lines.slice(index, index + 10).join('\n');

                        // 리소스 정리 섹션의 WARNING
                        if (nextLines.includes('리소스') || nextLines.includes('삭제')) {
                            // 비용 정보가 없으면 권장
                            if (!nextLines.match(/\$|원|비용|과금/)) {
                                issues.push({
                                    file: filePath,
                                    line: index + 1,
                                    message: '권장: WARNING Alert에 비용 정보 추가 (예: "시간당 약 $0.017")',
                                    severity: 'info',
                                    category: 'Alert'
                                });
                            }
                        }
                    }
                });

                return issues;
            }
        },

        // 4. 태스크 완료 표시 검증
        taskCompletion: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // "## 태스크" 섹션 찾기
                lines.forEach((line, index) => {
                    if (line.match(/^## 태스크 \d+:/)) {
                        // 다음 태스크 또는 섹션까지의 내용 확인
                        let nextSectionIndex = index + 1;
                        while (nextSectionIndex < lines.length && !lines[nextSectionIndex].startsWith('##')) {
                            nextSectionIndex++;
                        }

                        const taskContent = lines.slice(index, nextSectionIndex).join('\n');

                        // "✅ **태스크 완료**" 표시 권장
                        if (!taskContent.includes('✅ **태스크 완료**')) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: '권장: 태스크 끝에 "✅ **태스크 완료**: 설명" 추가',
                                severity: 'info',
                                category: '태스크'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 5. 코드 블록 언어 지정 검증
        codeBlockLanguage: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    // 코드 블록 시작 (언어 지정 없음)
                    if (line === '```' && index > 0) {
                        // 이전 줄이 "다음 명령어를 실행합니다:" 같은 패턴인지 확인
                        const prevLine = lines[index - 1];
                        if (prevLine.includes('명령어') || prevLine.includes('코드') || prevLine.includes('쿼리')) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: '권장: 코드 블록에 언어 지정 (```bash, ```python, ```json 등)',
                                severity: 'info',
                                category: '코드 블록'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 6. 일관성 검증 - 버킷 이름 패턴
        bucketNamingConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // 버킷 이름 패턴 찾기
                const bucketPatterns = content.match(/`[a-z0-9-]+-bucket[^`]*`/g);

                if (bucketPatterns && bucketPatterns.length > 1) {
                    // 고유한 패턴들
                    const uniquePatterns = [...new Set(bucketPatterns)];

                    if (uniquePatterns.length > 1) {
                        issues.push({
                            file: filePath,
                            line: 1,
                            message: `정보: 여러 버킷 이름 패턴 사용됨 (${uniquePatterns.length}개) - 일관성 확인 필요`,
                            severity: 'info',
                            category: '일관성'
                        });
                    }
                }

                return issues;
            }
        },

        // 7. 대기 시간 표현 검증
        waitTimeExpression: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    // 괄호 안에 시간 정보가 있는 경우
                    if (line.match(/기다립니다\s*\([^)]*분[^)]*\)/)) {
                        issues.push({
                            file: filePath,
                            line: index + 1,
                            message: '표준: 대기 시간은 NOTE Alert로 분리 (괄호 사용 금지)',
                            severity: 'warning',
                            category: '대기 시간'
                        });
                    }
                });

                return issues;
            }
        },

        // 8. 실습 파일 다운로드 검증
        downloadFileCheck: {
            check: (content, filePath) => {
                const issues = [];

                // [!DOWNLOAD] Alert 찾기
                if (content.includes('[!DOWNLOAD]')) {
                    const downloadMatch = content.match(/\[!DOWNLOAD\]([\s\S]*?)(?=\n##|\n>|$)/);

                    if (downloadMatch) {
                        const downloadContent = downloadMatch[1];

                        // 파일 목록 설명이 있는지 확인
                        if (!downloadContent.includes('-')) {
                            issues.push({
                                file: filePath,
                                line: content.split('\n').findIndex(l => l.includes('[!DOWNLOAD]')) + 1,
                                message: '권장: 다운로드 파일 목록 및 설명 추가',
                                severity: 'info',
                                category: '파일 다운로드'
                            });
                        }
                    }
                }

                return issues;
            }
        },

        // 9. 조사 일관성 검증 ("~를" vs "~을")
        particleConsistency: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 같은 단어에 대해 다른 조사 사용 패턴 찾기
                const wordParticles = new Map();

                lines.forEach((line, index) => {
                    // "단어를" 또는 "단어을" 패턴 찾기
                    const matches = line.matchAll(/([가-힣]+)(를|을)\s/g);

                    for (const match of matches) {
                        const word = match[1];
                        const particle = match[2];

                        if (!wordParticles.has(word)) {
                            wordParticles.set(word, []);
                        }

                        wordParticles.get(word).push({
                            particle,
                            line: index + 1,
                            text: line.trim()
                        });
                    }
                });

                // 같은 단어에 다른 조사가 사용된 경우 경고
                wordParticles.forEach((occurrences, word) => {
                    const particles = [...new Set(occurrences.map(o => o.particle))];

                    if (particles.length > 1) {
                        const firstOccurrence = occurrences[0];
                        issues.push({
                            file: filePath,
                            line: firstOccurrence.line,
                            message: `일관성: "${word}" 단어에 "${particles.join('", "')}" 조사가 혼용됨 (${occurrences.length}회)`,
                            severity: 'info',
                            category: '조사 일관성'
                        });
                    }
                });

                return issues;
            }
        },

        // 10. 동사 일관성 검증
        verbConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // 동의어 그룹 정의
                const synonymGroups = [
                    { words: ['생성합니다', '만듭니다'], preferred: '생성합니다' },
                    { words: ['확인합니다', '체크합니다'], preferred: '확인합니다' },
                    { words: ['삭제합니다', '제거합니다'], preferred: '삭제합니다' },
                    { words: ['변경합니다', '수정합니다', '바꿉니다'], preferred: '변경합니다' }
                ];

                synonymGroups.forEach(group => {
                    const counts = {};
                    group.words.forEach(word => {
                        const regex = new RegExp(word, 'g');
                        const matches = content.match(regex);
                        if (matches) {
                            counts[word] = matches.length;
                        }
                    });

                    // 2개 이상의 동의어가 사용된 경우
                    const usedWords = Object.keys(counts);
                    if (usedWords.length > 1) {
                        const total = Object.values(counts).reduce((a, b) => a + b, 0);
                        issues.push({
                            file: filePath,
                            line: 1,
                            message: `일관성: 동의어 혼용 - ${usedWords.map(w => `"${w}"(${counts[w]}회)`).join(', ')} → "${group.preferred}" 사용 권장`,
                            severity: 'info',
                            category: '동사 일관성'
                        });
                    }
                });

                return issues;
            }
        },

        // 11. 용어 일관성 검증 (한글/영문 혼용)
        terminologyConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // 혼용되면 안 되는 용어 쌍
                const termPairs = [
                    { korean: '버킷', english: 'Bucket', preferred: 'korean' },
                    { korean: '인스턴스', english: 'Instance', preferred: 'korean' },
                    { korean: '함수', english: 'Function', preferred: 'korean' },
                    { korean: '역할', english: 'Role', preferred: 'korean' }
                ];

                termPairs.forEach(pair => {
                    const koreanCount = (content.match(new RegExp(pair.korean, 'g')) || []).length;
                    const englishCount = (content.match(new RegExp(pair.english, 'g')) || []).length;

                    // 둘 다 사용된 경우 (AWS 콘솔 키워드 제외)
                    if (koreanCount > 0 && englishCount > 0) {
                        // 제외할 패턴들
                        let excludedCount = 0;

                        // 1. AWS 서비스명 (예: "S3 Bucket", "EC2 Instance")
                        const awsServicePattern = new RegExp(`(S3|EC2|Lambda|RDS|VPC|ECS|EKS|ALB|NLB|CloudFront|CloudWatch)\\s+${pair.english}`, 'g');
                        excludedCount += (content.match(awsServicePattern) || []).length;

                        // 2. 굵은 글씨로 감싸진 AWS 콘솔 필드명/메뉴명 (예: **Role name**, **Bucket name**)
                        const boldPattern = new RegExp(`\\*\\*[^*]*${pair.english}[^*]*\\*\\*`, 'g');
                        excludedCount += (content.match(boldPattern) || []).length;

                        // 3. 백틱으로 감싸진 값 (예: `CreateBucket`, `AssumeRole`)
                        const backtickPattern = new RegExp(`\`[^\`]*${pair.english}[^\`]*\``, 'g');
                        excludedCount += (content.match(backtickPattern) || []).length;

                        // 4. 대괄호로 감싸진 버튼명 (예: [[Create bucket]], [[Delete]])
                        const buttonPattern = new RegExp(`\\[\\[[^\\]]*${pair.english}[^\\]]*\\]\\]`, 'g');
                        excludedCount += (content.match(buttonPattern) || []).length;

                        // AWS 콘솔 키워드를 제외한 영문 사용 횟수
                        const nonAwsEnglishCount = englishCount - excludedCount;

                        if (nonAwsEnglishCount > 0) {
                            issues.push({
                                file: filePath,
                                line: 1,
                                message: `일관성: "${pair.korean}"(${koreanCount}회)와 "${pair.english}"(${nonAwsEnglishCount}회) 혼용 → "${pair.korean}" 사용 권장 (설명문에서만)`,
                                severity: 'info',
                                category: '용어 일관성'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 12. 숫자 표기 일관성
        numberFormatConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // 아라비아 숫자와 한글 숫자 혼용 검사
                const arabicNumbers = (content.match(/\d+개/g) || []).length;
                const koreanNumbers = (content.match(/(한|두|세|네|다섯|여섯|일곱|여덟|아홉|열)\s*개/g) || []).length;

                if (arabicNumbers > 0 && koreanNumbers > 0) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: `일관성: 숫자 표기 혼용 - 아라비아 숫자(${arabicNumbers}회)와 한글 숫자(${koreanNumbers}회) → 아라비아 숫자 사용 권장`,
                        severity: 'info',
                        category: '숫자 표기'
                    });
                }

                return issues;
            }
        },

        // 13. 범위 표기 일관성 (하이픈 vs 물결표)
        rangeFormatConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // "5-10분" vs "5~10분" 패턴 찾기
                const hyphenRanges = (content.match(/\d+-\d+분/g) || []).length;
                const tildeRanges = (content.match(/\d+~\d+분/g) || []).length;

                if (hyphenRanges > 0 && tildeRanges > 0) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: `일관성: 범위 표기 혼용 - 하이픈(${hyphenRanges}회)과 물결표(${tildeRanges}회) → 하이픈 사용 권장 (예: "5-10분")`,
                        severity: 'info',
                        category: '범위 표기'
                    });
                }

                return issues;
            }
        },

        // 14. 따옴표 일관성
        quoteConsistency: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 상태값 따옴표 검사 (큰따옴표 사용 권장)
                lines.forEach((line, index) => {
                    // 작은따옴표로 감싼 상태값 찾기
                    if (line.match(/'(Available|Enabled|Running|Active|Deployed)'/)) {
                        issues.push({
                            file: filePath,
                            line: index + 1,
                            message: '일관성: 상태값은 큰따옴표 사용 권장 (예: "Available")',
                            severity: 'info',
                            category: '따옴표 일관성'
                        });
                    }
                });

                return issues;
            }
        },

        // 15. 리스트 스타일 일관성
        listStyleConsistency: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 글머리 기호 사용 패턴 찾기
                const bulletTypes = {
                    dash: 0,
                    asterisk: 0,
                    plus: 0
                };

                lines.forEach(line => {
                    if (line.match(/^\s*-\s+[^-]/)) bulletTypes.dash++;
                    if (line.match(/^\s*\*\s+[^*]/)) bulletTypes.asterisk++;
                    if (line.match(/^\s*\+\s+/)) bulletTypes.plus++;
                });

                const usedTypes = Object.entries(bulletTypes)
                    .filter(([_, count]) => count > 0)
                    .map(([type, count]) => `${type}(${count}회)`);

                if (usedTypes.length > 1) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: `일관성: 글머리 기호 혼용 - ${usedTypes.join(', ')} → "-" 사용 권장`,
                        severity: 'info',
                        category: '리스트 스타일'
                    });
                }

                return issues;
            }
        },

        // 16. 강조 스타일 일관성
        emphasisConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // **굵게**와 *기울임* 사용 패턴
                const boldCount = (content.match(/\*\*[^*]+\*\*/g) || []).length;
                const italicCount = (content.match(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g) || []).length;

                // 필드명에 기울임 사용 시 경고 (굵게가 아닌 경우만)
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    // *Text*는 찾되 **Text**는 제외
                    if (line.match(/(?<!\*)\*[A-Z][a-z]+\s+[a-z]+\*(?!\*)/)) {
                        issues.push({
                            file: filePath,
                            line: index + 1,
                            message: '일관성: 필드명은 굵게(**) 사용 권장, 기울임(*) 대신',
                            severity: 'info',
                            category: '강조 스타일'
                        });
                    }
                });

                return issues;
            }
        },

        // 17. 코드 인라인 사용 일관성
        inlineCodeConsistency: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 복사 가능한 값이 백틱 없이 사용된 경우
                lines.forEach((line, index) => {
                    // "입력합니다" 앞에 백틱 없는 값
                    const match = line.match(/([a-z0-9-]+)을?\s*입력합니다/);
                    if (match && !line.includes(`\`${match[1]}\``)) {
                        issues.push({
                            file: filePath,
                            line: index + 1,
                            message: `일관성: 입력값 "${match[1]}"은 백틱으로 감싸기 권장 (\`${match[1]}\`)`,
                            severity: 'info',
                            category: '코드 인라인'
                        });
                    }
                });

                return issues;
            }
        },

        // 18. 완료 표시 일관성
        completionMessageConsistency: {
            check: (content, filePath) => {
                const issues = [];

                // 완료 표시 패턴 찾기
                const patterns = {
                    standard: (content.match(/✅ \*\*태스크 완료\*\*/g) || []).length,
                    demo: (content.match(/✅ \*\*데모 완료\*\*/g) || []).length,
                    short: (content.match(/✅ 완료(?!\*\*)/g) || []).length,
                    other: (content.match(/✅[^태데]*완료[^:]/g) || []).length
                };

                const usedPatterns = Object.entries(patterns)
                    .filter(([_, count]) => count > 0)
                    .map(([type, count]) => `${type}(${count}회)`);

                if (usedPatterns.length > 1) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: `일관성: 완료 표시 혼용 - ${usedPatterns.join(', ')} → "✅ **태스크 완료**:" 또는 "✅ **데모 완료**:" 사용 권장`,
                        severity: 'info',
                        category: '완료 표시'
                    });
                }

                return issues;
            }
        },

        // 19. 페이지 구조 표준 검증
        pageStructureStandard: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 실습 개요 위치 확인 (Front Matter 직후)
                const frontMatterEnd = content.indexOf('---', 4);
                if (frontMatterEnd > 0) {
                    const afterFrontMatter = content.substring(frontMatterEnd + 3);
                    const firstSection = afterFrontMatter.match(/^[\s\S]*?(?=##)/);

                    if (firstSection && firstSection[0].trim().length > 0) {
                        // 실습 개요가 있는지 확인
                        if (!firstSection[0].includes('실습') && !firstSection[0].includes('데모')) {
                            issues.push({
                                file: filePath,
                                line: frontMatterEnd + 5,
                                message: '권장: Front Matter 직후에 실습 개요 추가 (1-2문단)',
                                severity: 'info',
                                category: '페이지 구조'
                            });
                        }
                    }
                }

                // 태스크 섹션 구조 확인
                lines.forEach((line, index) => {
                    if (line.match(/^## 태스크 \d+:/)) {
                        // 다음 몇 줄 확인
                        const nextLines = lines.slice(index + 1, index + 10).join('\n');

                        // 태스크 설명이 있는지 확인 (번호 매기기 전에)
                        if (nextLines.match(/^1\./m) && !nextLines.match(/^[^#1-9]/m)) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: '권장: 태스크 제목 다음에 태스크 설명 추가 (1-2문단)',
                                severity: 'info',
                                category: '페이지 구조'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 20. CONCEPT Alert 사용 적절성 검증
        conceptAlertUsage: {
            check: (content, filePath) => {
                const issues = [];

                // 파일명에서 데모/실습 구분
                const isDemo = filePath.includes('demo') || content.includes('(데모)');
                const conceptCount = (content.match(/\[!CONCEPT\]/g) || []).length;

                // CONCEPT Alert 연속 사용 검증 (사이에 일반 텍스트가 2줄 이상 없으면 연속으로 간주)
                const lines = content.split('\n');
                let lastConceptLine = -1;
                let hasConsecutive = false;
                
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('[!CONCEPT]')) {
                        if (lastConceptLine !== -1) {
                            // 이전 CONCEPT와 현재 CONCEPT 사이의 일반 텍스트 줄 수 확인
                            let textLineCount = 0;
                            for (let j = lastConceptLine + 1; j < i; j++) {
                                const line = lines[j].trim();
                                // Alert 내부가 아니고, 빈 줄이 아니고, > 로 시작하지 않는 줄만 카운트
                                if (line && !line.startsWith('>')) {
                                    textLineCount++;
                                }
                            }
                            if (textLineCount < 2) {
                                hasConsecutive = true;
                                break;
                            }
                        }
                        lastConceptLine = i;
                    }
                }
                
                if (hasConsecutive) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: '일관성: [!CONCEPT] Alert가 연속으로 사용됨 → 사이에 2줄 이상의 설명 추가 권장',
                        severity: 'warning',
                        category: 'CONCEPT Alert'
                    });
                }

                if (isDemo) {
                    // 데모 가이드: CONCEPT 사용 권장
                    if (conceptCount === 0) {
                        issues.push({
                            file: filePath,
                            line: 1,
                            message: '권장: 데모 가이드에서는 [!CONCEPT] Alert 적극 활용',
                            severity: 'info',
                            category: 'CONCEPT Alert'
                        });
                    }
                }

                return issues;
            }
        },

        // 21. 참고 섹션 구조 검증
        referenceSection: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 📚 참고 섹션 찾기
                const referenceIndex = lines.findIndex(l => l.includes('## 📚 참고:'));

                if (referenceIndex >= 0) {
                    const referenceLine = lines[referenceIndex];

                    // 이모지 확인
                    if (!referenceLine.includes('📚')) {
                        issues.push({
                            file: filePath,
                            line: referenceIndex + 1,
                            message: '표준: 참고 섹션 제목에 📚 이모지 필수',
                            severity: 'warning',
                            category: '참고 섹션'
                        });
                    }

                    // 하위 섹션 개수 확인
                    let subsectionCount = 0;
                    for (let i = referenceIndex + 1; i < lines.length; i++) {
                        if (lines[i].startsWith('## ')) break;
                        if (lines[i].startsWith('### ')) subsectionCount++;
                    }

                    if (subsectionCount < 2) {
                        issues.push({
                            file: filePath,
                            line: referenceIndex + 1,
                            message: `권장: 참고 섹션에 최소 2개 이상의 하위 섹션 추가 (현재 ${subsectionCount}개)`,
                            severity: 'info',
                            category: '참고 섹션'
                        });
                    }
                }

                // 데모 가이드인데 참고 섹션이 없으면 경고
                const isDemo = filePath.includes('demo') || content.includes('(데모)');
                if (isDemo && referenceIndex < 0) {
                    issues.push({
                        file: filePath,
                        line: lines.length,
                        message: '필수: 데모 가이드에는 "## 📚 참고:" 섹션 필수',
                        severity: 'warning',
                        category: '참고 섹션'
                    });
                }

                return issues;
            }
        },

        // 22. 태스크 설명 위치 검증
        taskDescriptionPlacement: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    if (line.match(/^## 태스크 \d+:/)) {
                        // 다음 줄이 바로 번호 매기기인지 확인
                        const nextNonEmptyLine = lines.slice(index + 1).find(l => l.trim().length > 0);

                        if (nextNonEmptyLine && nextNonEmptyLine.match(/^1\./)) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: '표준: 태스크 제목과 단계 사이에 태스크 설명 필수 (1-2문단)',
                                severity: 'warning',
                                category: '태스크 설명'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 23. 실습/데모 구분 검증
        labDemoDistinction: {
            check: (content, filePath) => {
                const issues = [];

                const hasDownload = content.includes('[!DOWNLOAD]');
                const hasConcept = content.includes('[!CONCEPT]');
                const hasReference = content.includes('## 📚 참고:');

                // 파일명이나 제목에서 데모 여부 확인
                const isDemo = filePath.includes('demo') || content.includes('(데모)');

                if (isDemo) {
                    // 데모 가이드 검증
                    // [!DOWNLOAD]는 데모에서도 사용 가능 (규칙 변경)

                    if (!hasReference) {
                        issues.push({
                            file: filePath,
                            line: 1,
                            message: '필수: 데모 가이드에는 "## 📚 참고:" 섹션 필수',
                            severity: 'warning',
                            category: '실습/데모 구분'
                        });
                    }
                }
                // 실습 가이드는 CONCEPT 개수 제한 없음 (연속 사용만 경고)

                return issues;
            }
        },

        // 24. 섹션 제목 스타일 검증
        sectionTitleStyle: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    // ## 레벨 제목 검증
                    if (line.match(/^## [^태]/)) {
                        // "태스크", "마무리", "리소스 정리", "추가", "📚 참고" 외의 제목
                        if (!line.includes('마무리') &&
                            !line.includes('리소스 정리') &&
                            !line.includes('추가') &&
                            !line.includes('📚 참고')) {

                            // 태스크가 아닌데 번호가 있는 경우
                            if (line.match(/^## \d+/)) {
                                issues.push({
                                    file: filePath,
                                    line: index + 1,
                                    message: '표준: 태스크 제목은 "## 태스크 X:" 형식 사용',
                                    severity: 'warning',
                                    category: '섹션 제목'
                                });
                            }
                        }
                    }

                    // ### 레벨 제목 검증 (참고 섹션 내부)
                    if (line.startsWith('### ')) {
                        // 참고 섹션 내부인지 확인
                        const beforeLines = lines.slice(0, index).reverse();
                        const lastH2 = beforeLines.find(l => l.startsWith('## '));

                        if (lastH2 && lastH2.includes('📚 참고:')) {
                            // 참고 섹션 내부의 하위 제목
                            // 영문명이 있는지 확인
                            if (line.match(/[A-Z][a-z]+/) && !line.match(/\([A-Z][a-z]+.*\)/)) {
                                issues.push({
                                    file: filePath,
                                    line: index + 1,
                                    message: '권장: 참고 섹션 하위 제목에 영문명 포함 (예: "### CDN (Content Delivery Network)")',
                                    severity: 'info',
                                    category: '섹션 제목'
                                });
                            }
                        }
                    }
                });

                return issues;
            }
        },

        // 25. 태스크 설명 품질 검증
        taskDescriptionQuality: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    if (line.match(/^## 태스크 \d+:/)) {
                        // 다음 섹션까지의 내용 추출
                        let descriptionText = '';
                        let i = index + 1;

                        while (i < lines.length && !lines[i].match(/^1\./)) {
                            if (lines[i].startsWith('##')) break;
                            if (lines[i].startsWith('###')) break;
                            if (lines[i].startsWith('>')) break;
                            descriptionText += lines[i] + ' ';
                            i++;
                        }

                        // 설명 길이 확인 (최소 50자)
                        const cleanText = descriptionText.replace(/[#*`>\[\]]/g, '').trim();
                        if (cleanText.length > 0 && cleanText.length < 50) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: `권장: 태스크 설명이 너무 짧습니다 (${cleanText.length}자, 최소 50자 권장)`,
                                severity: 'info',
                                category: '태스크 설명 품질'
                            });
                        }

                        // 키워드 강조 확인 (최소 2개 이상의 굵은 글씨)
                        const boldCount = (descriptionText.match(/\*\*[^*]+\*\*/g) || []).length;
                        if (boldCount < 2 && cleanText.length > 50) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: `권장: 태스크 설명에 주요 키워드를 굵게 표시 (현재 ${boldCount}개, 권장 2개 이상)`,
                                severity: 'info',
                                category: '태스크 설명 품질'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 26. 단계 내 설명 혼재 검증
        stepDescriptionMixing: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    // 번호 매기기 단계
                    if (line.match(/^\d+\. /)) {
                        // 괄호 안에 긴 설명이 있는지 (20자 이상)
                        const parenMatch = line.match(/\(([^)]+)\)/);
                        if (parenMatch && parenMatch[1].length > 20) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: '표준: 단계 내 긴 괄호 설명은 Alert나 💡로 분리',
                                severity: 'warning',
                                category: '단계 설명 혼재'
                            });
                        }

                        // 단계가 너무 긴지 (150자 이상)
                        if (line.length > 150) {
                            issues.push({
                                file: filePath,
                                line: index + 1,
                                message: `권장: 단계가 너무 깁니다 (${line.length}자). 여러 단계로 분리하거나 설명을 Alert로 이동`,
                                severity: 'info',
                                category: '단계 설명 혼재'
                            });
                        }
                    }
                });

                return issues;
            }
        },

        // 27. 실습 환경 정보 검증
        labEnvironmentInfo: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // WARNING Alert 찾기
                lines.forEach((line, index) => {
                    if (line.includes('[!WARNING]')) {
                        const nextLines = lines.slice(index, index + 15).join('\n');

                        // 리소스 정리가 아닌 첫 번째 WARNING (실습 시작 부분)
                        if (index < 100 && nextLines.includes('리소스') && nextLines.includes('삭제')) {
                            // 리전 정보 확인
                            if (!nextLines.match(/ap-northeast-\d|us-east-\d|eu-west-\d|ap-south-\d|리전/)) {
                                issues.push({
                                    file: filePath,
                                    line: index + 1,
                                    message: '권장: WARNING Alert에 리전 정보 추가 (예: ap-northeast-2 리전 기준)',
                                    severity: 'info',
                                    category: '실습 환경 정보'
                                });
                            }

                            // 비용 정보 형식 확인
                            if (nextLines.match(/\$/) && !nextLines.match(/\$\d+\.\d{2,3}/)) {
                                issues.push({
                                    file: filePath,
                                    line: index + 1,
                                    message: '권장: 비용 정보는 "$X.XXX" 형식 사용 (예: $0.017)',
                                    severity: 'info',
                                    category: '실습 환경 정보'
                                });
                            }
                        }
                    }
                });

                return issues;
            }
        },

        // 28. Prerequisites 통합 검증
        prerequisitesIntegration: {
            check: (content, filePath) => {
                const issues = [];

                // Front Matter에 prerequisites 있는지
                const hasFrontMatterPrereq = content.match(/^---[\s\S]*?prerequisites:/m);

                // 본문에 사전 요구사항 섹션이 있는지
                const bodyPrereqMatch = content.match(/^## 사전 요구사항|^## Prerequisites/m);

                if (hasFrontMatterPrereq && bodyPrereqMatch) {
                    const bodyPrereqLine = content.split('\n')
                        .findIndex(l => l.match(/^## 사전 요구사항|^## Prerequisites/)) + 1;

                    issues.push({
                        file: filePath,
                        line: bodyPrereqLine,
                        message: '중복: Front Matter에 prerequisites가 있으므로 본문 섹션 제거',
                        severity: 'warning',
                        category: 'Prerequisites 통합'
                    });
                }

                if (!hasFrontMatterPrereq && !bodyPrereqMatch) {
                    // 실습 가이드인데 prerequisites가 전혀 없으면
                    const isDemo = filePath.includes('demo') || content.includes('(데모)');
                    if (!isDemo && content.includes('## 태스크')) {
                        issues.push({
                            file: filePath,
                            line: 1,
                            message: '권장: Front Matter에 prerequisites 필드 추가',
                            severity: 'info',
                            category: 'Prerequisites 통합'
                        });
                    }
                }

                return issues;
            }
        },

        // 29. 태스크 번호 매기기 검증
        taskNumbering: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // 모든 태스크 찾기
                const tasks = [];
                lines.forEach((line, index) => {
                    const match = line.match(/^## 태스크 (\d+):/);
                    if (match) {
                        tasks.push({
                            number: parseInt(match[1]),
                            line: index + 1,
                            title: line
                        });
                    }
                });

                if (tasks.length === 0) return issues;

                // 태스크 0이 있는지 확인
                const hasTask0 = tasks.some(t => t.number === 0);

                if (hasTask0) {
                    const task0 = tasks.find(t => t.number === 0);

                    // 태스크 0 다음 내용 확인 (환경 설정 관련인지)
                    const task0Content = lines.slice(task0.line, task0.line + 30).join('\n').toLowerCase();

                    const setupKeywords = [
                        'cloudformation', '템플릿', 'template', '배포',
                        '환경 설정', '사전 준비', '다운로드', '압축 해제',
                        'vpc', '서브넷', 'subnet', 's3 버킷', 'iam 역할',
                        'ide', 'cli', '설정', 'setup'
                    ];

                    const hasSetupKeyword = setupKeywords.some(keyword =>
                        task0Content.includes(keyword)
                    );

                    if (!hasSetupKeyword) {
                        issues.push({
                            file: filePath,
                            line: task0.line,
                            message: '권장: 태스크 0은 환경 설정/사전 준비 작업에만 사용 (CloudFormation 배포, 파일 다운로드, VPC 생성 등)',
                            severity: 'info',
                            category: '태스크 번호 매기기'
                        });
                    }

                    // 태스크 0 다음이 태스크 1인지 확인
                    if (tasks.length > 1 && tasks[1].number !== 1) {
                        issues.push({
                            file: filePath,
                            line: tasks[1].line,
                            message: `표준: 태스크 0 다음은 태스크 1이어야 함 (현재: 태스크 ${tasks[1].number})`,
                            severity: 'warning',
                            category: '태스크 번호 매기기'
                        });
                    }
                } else {
                    // 태스크 0이 없는 경우, 태스크 1부터 시작하는지 확인
                    if (tasks[0].number !== 1) {
                        issues.push({
                            file: filePath,
                            line: tasks[0].line,
                            message: `표준: 태스크는 0 또는 1부터 시작해야 함 (현재: 태스크 ${tasks[0].number})`,
                            severity: 'warning',
                            category: '태스크 번호 매기기'
                        });
                    }
                }

                // 태스크 번호 연속성 확인
                for (let i = 1; i < tasks.length; i++) {
                    const expected = tasks[i - 1].number + 1;
                    const actual = tasks[i].number;

                    if (actual !== expected) {
                        issues.push({
                            file: filePath,
                            line: tasks[i].line,
                            message: `표준: 태스크 번호가 연속적이지 않음 (이전: ${tasks[i - 1].number}, 현재: ${actual}, 예상: ${expected})`,
                            severity: 'error',
                            category: '태스크 번호 매기기'
                        });
                    }
                }

                return issues;
            }
        },

        // 30. 다운로드 파일 설명 검증
        downloadFileDescription: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // [!DOWNLOAD] Alert 찾기
                const downloadIndex = lines.findIndex(l => l.includes('[!DOWNLOAD]'));

                if (downloadIndex === -1) return issues;

                // 다운로드 섹션 추출 (다음 ## 또는 > 까지)
                let downloadSection = '';
                let i = downloadIndex;
                while (i < lines.length && !lines[i].startsWith('##') &&
                    (lines[i].startsWith('>') || lines[i].trim() === '' || i === downloadIndex)) {
                    downloadSection += lines[i] + '\n';
                    i++;
                    if (i > downloadIndex + 30) break; // 최대 30줄 (관련 태스크 포함)
                }

                // 파일 목록 찾기 (- `파일명` 형식)
                const fileItems = downloadSection.match(/- `([^`]+)`[^\n]*/g) || [];

                if (fileItems.length === 0) {
                    issues.push({
                        file: filePath,
                        line: downloadIndex + 1,
                        message: '권장: 다운로드 파일 목록 및 설명 추가 (- `파일명` - 간단한 설명 형식)',
                        severity: 'info',
                        category: '다운로드 파일 설명'
                    });
                    return issues;
                }

                // 각 파일 항목 검증
                fileItems.forEach((item, index) => {
                    const itemLine = lines.findIndex(l => l.includes(item)) + 1;
                    const fileName = item.match(/- `([^`]+)`/)?.[1];

                    // 파일 설명 길이 확인 (5-50자 권장)
                    const descMatch = item.match(/- `[^`]+` - (.+)/);
                    if (!descMatch) {
                        issues.push({
                            file: filePath,
                            line: itemLine,
                            message: '권장: 파일 설명 추가 (- `파일명` - 간단한 설명 형식)',
                            severity: 'info',
                            category: '다운로드 파일 설명'
                        });
                        return;
                    }

                    const descLength = descMatch[1].trim().length;

                    // 파일 설명이 너무 짧은 경우
                    if (descLength < 5) {
                        issues.push({
                            file: filePath,
                            line: itemLine,
                            message: '권장: 파일 설명을 더 구체적으로 작성 (최소 5자)',
                            severity: 'info',
                            category: '다운로드 파일 설명'
                        });
                    }

                    // 파일 설명이 너무 긴 경우 (태스크 정보는 관련 태스크 섹션으로)
                    if (descLength > 50) {
                        const hasTaskInDesc = descMatch[1].match(/태스크 \d+|Task \d+/i);
                        if (hasTaskInDesc) {
                            issues.push({
                                file: filePath,
                                line: itemLine,
                                message: '권장: 파일 설명은 간단히, 자세한 사용 방법은 "관련 태스크" 섹션에 작성',
                                severity: 'info',
                                category: '다운로드 파일 설명'
                            });
                        }
                    }
                });

                // "관련 태스크" 섹션 확인
                const hasRelatedTasks = downloadSection.match(/\*\*관련 태스크:\*\*/);

                if (!hasRelatedTasks) {
                    issues.push({
                        file: filePath,
                        line: downloadIndex + 1,
                        message: '권장: "**관련 태스크:**" 섹션 추가 (각 파일의 자세한 사용 방법 명시)',
                        severity: 'info',
                        category: '다운로드 파일 설명'
                    });
                } else {
                    // 관련 태스크 항목 찾기
                    const taskItems = downloadSection.match(/- 태스크 \d+:[^\n]+/g) || [];

                    if (taskItems.length === 0) {
                        issues.push({
                            file: filePath,
                            line: downloadIndex + 1,
                            message: '권장: 관련 태스크 항목 추가 (- 태스크 X: 자세한 설명 형식)',
                            severity: 'info',
                            category: '다운로드 파일 설명'
                        });
                    } else {
                        // 각 태스크 항목 검증
                        taskItems.forEach((taskItem) => {
                            const taskLine = lines.findIndex(l => l.includes(taskItem)) + 1;
                            const taskDescMatch = taskItem.match(/- 태스크 \d+: (.+)/);

                            if (taskDescMatch) {
                                const taskDescLength = taskDescMatch[1].trim().length;

                                // 태스크 설명이 너무 짧은 경우
                                if (taskDescLength < 30) {
                                    issues.push({
                                        file: filePath,
                                        line: taskLine,
                                        message: '권장: 태스크 설명을 더 자세하게 작성 (최소 30자, 파일명과 구체적인 사용 방법 포함)',
                                        severity: 'info',
                                        category: '다운로드 파일 설명'
                                    });
                                }

                                // 파일명 언급 확인
                                const mentionsFile = fileItems.some(item => {
                                    const fileName = item.match(/- `([^`]+)`/)?.[1];
                                    return fileName && taskDescMatch[1].includes(fileName);
                                });

                                if (!mentionsFile) {
                                    issues.push({
                                        file: filePath,
                                        line: taskLine,
                                        message: '권장: 태스크 설명에 사용할 파일명 명시 (예: "file.json을 참고하여...")',
                                        severity: 'info',
                                        category: '다운로드 파일 설명'
                                    });
                                }
                            }
                        });
                    }
                }

                // 파일 개수가 너무 많은지 확인 (10개 이상)
                if (fileItems.length > 10) {
                    issues.push({
                        file: filePath,
                        line: downloadIndex + 1,
                        message: `정보: 다운로드 파일이 많습니다 (${fileItems.length}개). ZIP 파일로 그룹화 고려`,
                        severity: 'info',
                        category: '다운로드 파일 설명'
                    });
                }

                return issues;
            }
        },

        // 31. 제목-내용 적합성 검증
        titleContentAlignment: {
            check: (content, filePath) => {
                const issues = [];
                const lines = content.split('\n');

                // Front Matter에서 title 추출
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (!frontMatterMatch) return issues;

                const frontMatter = frontMatterMatch[1];
                const titleMatch = frontMatter.match(/title:\s*["'](.+)["']/);
                if (!titleMatch) return issues;

                const title = titleMatch[1];

                // 제목에서 주요 키워드 추출
                const titleKeywords = this.extractKeywords(title);

                // 본문 내용 (Front Matter 제외)
                const bodyContent = content.substring(frontMatterMatch[0].length).toLowerCase();

                // 각 키워드가 본문에 충분히 등장하는지 확인
                const keywordAnalysis = titleKeywords.map(keyword => {
                    const regex = new RegExp(keyword.toLowerCase(), 'gi');
                    const matches = bodyContent.match(regex) || [];
                    return {
                        keyword,
                        count: matches.length,
                        sufficient: matches.length >= 3 // 최소 3회 이상 등장 권장
                    };
                });

                // 충분히 등장하지 않는 키워드 찾기
                const insufficientKeywords = keywordAnalysis.filter(k => !k.sufficient);

                if (insufficientKeywords.length > 0) {
                    const keywordList = insufficientKeywords
                        .map(k => `"${k.keyword}"(${k.count}회)`)
                        .join(', ');

                    issues.push({
                        file: filePath,
                        line: 1,
                        message: `제목-내용 적합성: 제목의 주요 키워드가 본문에 충분히 등장하지 않음 - ${keywordList} (최소 3회 권장)`,
                        severity: 'warning',
                        category: '제목-내용 적합성'
                    });
                }

                // AWS 서비스명 확인
                const awsServicesMatch = frontMatter.match(/awsServices:\s*\n([\s\S]*?)(?=\n[a-z]|$)/);
                if (awsServicesMatch) {
                    const awsServices = awsServicesMatch[1]
                        .split('\n')
                        .map(line => line.trim().replace(/^-\s*/, ''))
                        .filter(line => line.length > 0);

                    // 각 AWS 서비스가 본문에 등장하는지 확인
                    awsServices.forEach(service => {
                        const serviceKeyword = service.replace(/^(Amazon|AWS)\s+/, ''); // "Amazon S3" → "S3"
                        const regex = new RegExp(serviceKeyword, 'gi');
                        const matches = bodyContent.match(regex) || [];

                        if (matches.length < 2) {
                            issues.push({
                                file: filePath,
                                line: 1,
                                message: `제목-내용 적합성: Front Matter의 AWS 서비스 "${service}"가 본문에 충분히 등장하지 않음 (${matches.length}회, 최소 2회 권장)`,
                                severity: 'info',
                                category: '제목-내용 적합성'
                            });
                        }
                    });
                }

                // 데모/실습 구분 확인
                const isDemo = filePath.includes('demo') || title.includes('(데모)') || title.includes('데모');
                const hasLabKeywords = bodyContent.includes('실습') || bodyContent.includes('lab');
                const hasDemoKeywords = bodyContent.includes('데모') || bodyContent.includes('demo') || bodyContent.includes('시연');

                if (isDemo && !hasDemoKeywords) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: '제목-내용 적합성: 제목에 "데모"가 있지만 본문에 데모 관련 내용이 부족합니다',
                        severity: 'warning',
                        category: '제목-내용 적합성'
                    });
                }

                if (!isDemo && !hasLabKeywords) {
                    issues.push({
                        file: filePath,
                        line: 1,
                        message: '제목-내용 적합성: 실습 가이드인데 본문에 "실습" 키워드가 부족합니다',
                        severity: 'info',
                        category: '제목-내용 적합성'
                    });
                }

                return issues;
            }
        }
    };

    /**
     * 제목에서 주요 키워드 추출
     */
    extractKeywords(title) {
        // 불용어 제거
        const stopWords = [
            '및', '와', '과', '을', '를', '이', '가', '은', '는', '의', '에', '로', '으로',
            '기반', '통한', '위한', '사용', '활용', '구축', '생성', '설정', '관리',
            'Week', 'week', '실습', '데모', '가이드'
        ];

        // 제목을 단어로 분리
        const words = title
            .replace(/[()[\]]/g, '') // 괄호 제거
            .split(/\s+/)
            .filter(word => word.length > 1) // 1글자 단어 제거
            .filter(word => !stopWords.includes(word)); // 불용어 제거

        // AWS 서비스명 우선 추출
        const awsServices = [];
        const awsServicePattern = /(VPC|S3|EC2|Lambda|RDS|DynamoDB|CloudFormation|ECS|EKS|ElastiCache|CloudFront|Glue|Athena|SageMaker|Bedrock|EventBridge|API Gateway|CloudWatch|X-Ray|GuardDuty|Config|Secrets Manager|Parameter Store|Route53|Rekognition)/gi;

        let match;
        while ((match = awsServicePattern.exec(title)) !== null) {
            awsServices.push(match[1]);
        }

        // 기술 용어 추출 (2글자 이상의 영문 또는 한글)
        const techTerms = words.filter(word =>
            word.match(/^[A-Z][a-z]+/) || // 영문 (첫 글자 대문자)
            word.match(/^[가-힣]{2,}/) // 한글 (2글자 이상)
        );

        // AWS 서비스 + 기술 용어 결합 (중복 제거)
        return [...new Set([...awsServices, ...techTerms])];
    }

    /**
    };

    /**
     * 파일 검증
     */
    validateFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileIssues = [];

        // 각 규칙 적용
        Object.entries(this.rules).forEach(([ruleName, rule]) => {
            if (rule.check) {
                const issues = rule.check(content, filePath);
                fileIssues.push(...issues);
            }
        });

        return fileIssues;
    }

    /**
     * 디렉토리 검증
     */
    validateDirectory(dirPath) {
        const files = this.getAllMarkdownFiles(dirPath);

        console.log(`${colors.cyan}🔍 고급 검증 시작 (${files.length}개 파일)${colors.reset}\n`);

        const allIssues = [];

        files.forEach(file => {
            const issues = this.validateFile(file);
            allIssues.push(...issues);
        });

        this.printResults(allIssues, files.length);
    }

    /**
     * 결과 출력
     */
    printResults(issues, totalFiles) {
        // 카테고리별로 그룹화
        const byCategory = {};
        const bySeverity = { error: 0, warning: 0, info: 0 };

        issues.forEach(issue => {
            if (!byCategory[issue.category]) {
                byCategory[issue.category] = [];
            }
            byCategory[issue.category].push(issue);
            bySeverity[issue.severity]++;
        });

        console.log(`${colors.yellow}📊 고급 검증 결과${colors.reset}\n`);
        console.log(`총 파일: ${totalFiles}`);
        console.log(`발견된 항목: ${issues.length}`);
        console.log(`  - 오류: ${colors.red}${bySeverity.error}${colors.reset}`);
        console.log(`  - 경고: ${colors.yellow}${bySeverity.warning}${colors.reset}`);
        console.log(`  - 정보: ${colors.blue}${bySeverity.info}${colors.reset}`);
        console.log('');

        if (issues.length === 0) {
            console.log(`${colors.green}✅ 모든 고급 검증 통과!${colors.reset}\n`);
            return;
        }

        // 카테고리별 출력
        Object.entries(byCategory).forEach(([category, categoryIssues]) => {
            console.log(`${colors.cyan}📁 ${category} (${categoryIssues.length}개)${colors.reset}`);

            categoryIssues.forEach((issue, index) => {
                const icon = issue.severity === 'error' ? '❌' :
                    issue.severity === 'warning' ? '⚠️' : 'ℹ️';
                const fileName = path.basename(issue.file);

                console.log(`${icon} ${fileName}:${issue.line}`);
                console.log(`   ${issue.message}`);
                if (index < categoryIssues.length - 1) console.log('');
            });

            console.log('');
        });
    }

    /**
     * 모든 마크다운 파일 찾기
     */
    getAllMarkdownFiles(dirPath) {
        const files = [];

        const walk = (dir) => {
            const items = fs.readdirSync(dir);

            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    walk(fullPath);
                } else if (item.endsWith('.md')) {
                    files.push(fullPath);
                }
            });
        };

        walk(dirPath);
        return files;
    }
}

// 메인 실행
const validator = new AdvancedValidator();
const args = process.argv.slice(2);

if (args.length === 0) {
    const contentDir = path.join(process.cwd(), 'public', 'content');
    validator.validateDirectory(contentDir);
} else {
    args.forEach(filePath => {
        const fullPath = path.isAbsolute(filePath)
            ? filePath
            : path.join(process.cwd(), filePath);

        if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                validator.validateDirectory(fullPath);
            } else {
                const issues = validator.validateFile(fullPath);
                validator.printResults(issues, 1);
            }
        } else {
            console.error(`${colors.red}❌ 파일을 찾을 수 없습니다: ${filePath}${colors.reset}`);
        }
    });
}
