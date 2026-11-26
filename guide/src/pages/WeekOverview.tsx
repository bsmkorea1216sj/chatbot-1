import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Link,
  StatusIndicator,
  ColumnLayout,
} from '@cloudscape-design/components';
import { curriculum, weekSessions } from '@/data/curriculum';
import '@/styles/week-overview.css';

export const WeekOverview: React.FC = () => {
  const { weekNumber } = useParams<{ weekNumber: string }>();
  const navigate = useNavigate();
  const week = curriculum.find((w) => w.week === parseInt(weekNumber || '0'));

  if (!week) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <SpaceBetween size="m">
            <Header variant="h1">PART를 찾을 수 없습니다</Header>
            <Button onClick={() => navigate('/dashboard')}>
              커리큘럼으로 돌아가기
            </Button>
          </SpaceBetween>
        </Box>
      </Container>
    );
  }

  // 타입별 StatusIndicator 타입
  const getStatusType = (type: string): 'success' | 'info' | 'stopped' => {
    if (type === 'lab') return 'success';
    if (type === 'demo') return 'info';
    return 'stopped';
  };

  const getTypeLabel = (type: string) => {
    if (type === 'lab') return '실습';
    if (type === 'demo') return '데모';
    return '강의';
  };

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`PART ${week.week}의 모든 실습을 확인하세요`}
          >
            PART {week.week}: {week.title}
          </Header>
        }
      >
        <Box padding="m">
          <ColumnLayout columns={2}>
            {weekSessions(week).map((session, idx) => {
              const hasLink =
                session.hasContent &&
                (session.type === 'lab' || session.type === 'demo');

              return (
                <Box key={idx} padding="m" className="session-item">
                  <SpaceBetween direction="vertical" size="s">
                    <SpaceBetween
                      direction="horizontal"
                      size="xs"
                      alignItems="center"
                    >
                      <StatusIndicator type={getStatusType(session.type)}>
                        {getTypeLabel(session.type)}
                      </StatusIndicator>
                      <Box fontWeight="bold" color="text-label">
                        {session.session}교시
                      </Box>
                    </SpaceBetween>
                    {hasLink ? (
                      <Link
                        fontSize="heading-m"
                        onFollow={() =>
                          navigate(
                            `/week/${week.week}/session/${session.session}`,
                          )
                        }
                      >
                        {session.title}
                      </Link>
                    ) : (
                      <Box fontSize="heading-m" color="text-body-secondary">
                        {session.title}
                      </Box>
                    )}
                    {session.description && (
                      <Box color="text-body-secondary">
                        {session.description}
                      </Box>
                    )}
                  </SpaceBetween>
                </Box>
              );
            })}
          </ColumnLayout>
        </Box>
      </Container>

      <Container>
        <Box textAlign="center">
          <Button onClick={() => navigate('/dashboard')}>
            전체 커리큘럼 보기
          </Button>
        </Box>
      </Container>
    </SpaceBetween>
  );
};
