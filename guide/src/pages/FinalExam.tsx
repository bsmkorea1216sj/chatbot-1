import React from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Alert,
  Box,
  ColumnLayout,
} from '@cloudscape-design/components';
import '@/styles/exam.css';

export const FinalExam: React.FC = () => {
  return (
    <div className="exam-page">
      <SpaceBetween direction="vertical" size="l">
        {/* 헤더 */}
        <div className="exam-hero">
          <div className="exam-badge">Final Exam</div>
          <h1 className="exam-title">기말고사</h1>
          <p className="exam-subtitle">클라우드 서비스 디자인 기말고사 안내</p>
        </div>

        {/* 시험 정보 */}
        <Container header={<Header variant="h2">시험 정보</Header>}>
          <SpaceBetween direction="vertical" size="m">
            <Alert type="info" header="시험 일정">
              기말고사 일정은 학사 일정에 따라 공지될 예정입니다.
            </Alert>

            <ColumnLayout columns={2} variant="text-grid">
              <Box>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="h4">시험 범위</Box>
                  <Box variant="p" color="text-body-secondary">
                    9주차 ~ 15주차 강의 내용
                  </Box>
                </SpaceBetween>
              </Box>

              <Box>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="h4">시험 형식</Box>
                  <Box variant="p" color="text-body-secondary">
                    추후 공지 예정
                  </Box>
                </SpaceBetween>
              </Box>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {/* 주요 학습 주제 */}
        <Container header={<Header variant="h2">주요 학습 주제</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="p">기말고사는 다음 주제들을 중심으로 출제됩니다:</Box>

            <ul className="exam-topics-list">
              <li>컨테이너 오케스트레이션 (ECS, Fargate)</li>
              <li>CI/CD 파이프라인 구축</li>
              <li>캐싱 및 성능 최적화 (ElastiCache, CloudFront)</li>
              <li>데이터 레이크 및 분석 (S3, Glue, Athena)</li>
              <li>머신러닝 파이프라인 (SageMaker)</li>
              <li>보안 및 규정 준수 (Secrets Manager, Config)</li>
              <li>비용 최적화 및 모니터링</li>
              <li>글로벌 배포 및 DNS (Route 53, CloudFront)</li>
            </ul>
          </SpaceBetween>
        </Container>

        {/* 준비 사항 */}
        <Container header={<Header variant="h2">시험 준비 안내</Header>}>
          <SpaceBetween direction="vertical" size="m">
            <Alert type="warning" header="중요 안내">
              실습 내용을 충분히 복습하고, 각 AWS 서비스의 핵심 개념과 사용
              사례를 이해하는 것이 중요합니다.
            </Alert>

            <Box variant="p">
              <strong>추천 학습 방법:</strong>
            </Box>

            <ul className="exam-preparation-list">
              <li>각 주차별 실습 가이드 복습</li>
              <li>AWS 서비스 간 연동 방식 이해</li>
              <li>아키텍처 설계 원칙 숙지</li>
              <li>실습에서 다룬 주요 명령어 및 설정 복습</li>
            </ul>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
};
