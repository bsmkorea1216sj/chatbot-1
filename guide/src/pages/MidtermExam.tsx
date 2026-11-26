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

export const MidtermExam: React.FC = () => {
  return (
    <div className="exam-page">
      <SpaceBetween direction="vertical" size="l">
        {/* 헤더 */}
        <div className="exam-hero">
          <div className="exam-badge">Midterm Exam</div>
          <h1 className="exam-title">중간고사</h1>
          <p className="exam-subtitle">클라우드 서비스 디자인 중간고사 안내</p>
        </div>

        {/* 시험 정보 */}
        <Container header={<Header variant="h2">시험 정보</Header>}>
          <SpaceBetween direction="vertical" size="m">
            <Alert type="info" header="시험 일정">
              중간고사 일정은 학사 일정에 따라 공지될 예정입니다.
            </Alert>

            <ColumnLayout columns={2} variant="text-grid">
              <Box>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="h4">시험 범위</Box>
                  <Box variant="p" color="text-body-secondary">
                    1주차 ~ 7주차 강의 내용
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
            <Box variant="p">중간고사는 다음 주제들을 중심으로 출제됩니다:</Box>

            <ul className="exam-topics-list">
              <li>AWS Well-Architected Framework 6가지 원칙</li>
              <li>IAM 역할 및 정책 관리</li>
              <li>VPC 설계 및 네트워크 구성</li>
              <li>서버리스 아키텍처 (Lambda, API Gateway)</li>
              <li>데이터베이스 설계 (RDS, DynamoDB)</li>
              <li>Infrastructure as Code (CloudFormation)</li>
              <li>컨테이너 기초 (Docker, ECS)</li>
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
              <li>Well-Architected Framework 6가지 원칙 암기</li>
            </ul>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
};
