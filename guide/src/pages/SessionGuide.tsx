import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Alert,
  Badge,
  ColumnLayout,
  Button,
  Popover,
  StatusIndicator,
  Icon,
} from '@cloudscape-design/components';
import { curriculum, sessionTypeConfig, Session } from '@/data/curriculum';
import { findPrivateItem } from '@/utils/privateMenu';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { loadMarkdownFile, parseMarkdownText } from '@/utils/markdownLoader';
import '@/styles/badges.css';
import '@/styles/download-files.css';
import '@/styles/session-guide.css';
import '@/styles/key-point-cards.css';

// AWS 서비스명을 CSS 클래스명으로 변환
const getServiceBadgeClass = (service: string): string => {
  const serviceMap: { [key: string]: string } = {
    // Management & Governance
    'AWS Console': 'console',
    'AWS Management Console': 'console',
    'AWS CloudShell': 'codebuild',
    'Amazon CloudWatch': 'cloudwatch',
    'AWS CloudTrail': 'cloudwatch',
    'AWS CloudFormation': 'cloudformation',
    'AWS Well-Architected Tool': 'well-architected-tool',

    // Storage
    'Amazon S3': 's3',
    'Amazon EBS': 'ebs',
    'Amazon EFS': 'ebs',
    'AWS Backup': 's3',

    // Compute
    'Amazon EC2': 'ec2',
    'AWS Lambda': 'lambda',
    'Amazon ECS': 'ecs',
    'AWS Auto Scaling': 'auto-scaling',

    // Networking
    'Amazon VPC': 'vpc',
    'Elastic Load Balancing': 'elb',
    'Application Load Balancer': 'alb',
    'Amazon API Gateway': 'api-gateway',
    'Amazon CloudFront': 'cloudfront',
    'Amazon Route 53': 'route-53',

    // Database
    'Amazon RDS': 'rds',
    'Amazon Aurora': 'rds',
    'Amazon DynamoDB': 'dynamodb',
    'Amazon ElastiCache': 'elasticache',

    // Developer Tools
    'AWS CodePipeline': 'codepipeline',
    'AWS CodeBuild': 'codebuild',
    'AWS CodeCommit': 'codecommit',
    'AWS CodeDeploy': 'codedeploy',
    'AWS Infrastructure Composer': 'infrastructure-composer',

    // Security
    'AWS IAM': 'iam',
    'AWS IAM Identity Center': 'iam',
    'AWS STS': 'iam',
    'AWS Organizations': 'organizations',
    'Amazon Cognito': 'cognito',
    'Amazon GuardDuty': 'guardduty',
    'AWS Security Hub': 'security-hub',
    'AWS Secrets Manager': 'secrets-manager',
    'AWS KMS': 'kms',
    'AWS Certificate Manager': 'certificate-manager',

    // Management & Governance (추가 서비스)
    'AWS Systems Manager': 'systems-manager',
    'AWS Systems Manager Parameter Store': 'parameter-store',
    'Amazon SNS': 'sns',
    'AWS Config': 'config',
    'Amazon EventBridge': 'eventbridge',

    // Analytics
    'AWS Glue': 'glue',
    'Amazon Athena': 'athena',
    'AWS Lake Formation': 'lake-formation',
    'Amazon QuickSight': 'quicksight',
    'Amazon Quick Suite': 'quick-suite',

    // Cloud Financial Management
    'AWS Cost Explorer': 'cost-explorer',
    'AWS Budgets': 'budgets',

    // Machine Learning
    'Amazon SageMaker': 'sagemaker',
    'Amazon Rekognition': 'rekognition',
    'Amazon Bedrock': 'bedrock',

    // Analytics (추가)
    'OpenSearch Serverless': 'opensearch-serverless',
    'Amazon OpenSearch Serverless': 'opensearch-serverless',

    // Containers
    'Amazon ECR': 'ecr',
    'Amazon EKS': 'eks',
    Kubernetes: 'kubernetes',

    // Additional Services
    'AWS X-Ray': 'xray',
    'AWS Resource Groups & Tag Editor': 'resource-groups',
  };

  return serviceMap[service] || 'default';
};

// 마크다운 콘텐츠에서 태스크 제목 추출
const extractTasks = (content: string): string[] => {
  const taskRegex = /^##\s+태스크\s+(\d+):\s+(.+)$/gm;
  const tasks: string[] = [];
  let match;

  while ((match = taskRegex.exec(content)) !== null) {
    const taskNumber = match[1];
    const taskTitle = match[2].trim();
    tasks.push(`태스크 ${taskNumber}: ${taskTitle}`);
  }

  return tasks;
};

// 페이지 목차(TOC) 추출 인터페이스
export interface TocItem {
  id: string;
  title: string;
  level: number;
  emoji?: string;
}

// 백틱(`code`)을 <code> 태그로 변환하여 React 노드 배열로 반환
const renderInlineCode = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /`([^`]+)`/g;
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.substring(lastIndex, m.index));
    }
    parts.push(
      <code key={m.index} className="key-point-inline-code">{m[1]}</code>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
};

interface SessionGuideProps {
  /** /ICT 처럼 URL 파라미터 없이 특정 차시를 보여줄 때 사용 */
  fixedWeek?: number;
  fixedSession?: number;
  /** 이 브라우저에만 저장된 개인 본문 id (/private/:id) */
  privateId?: string;
}

export const SessionGuide: React.FC<SessionGuideProps> = ({ fixedWeek, fixedSession, privateId }) => {
  const params = useParams<{
    weekNumber: string;
    sessionNumber: string;
  }>();
  const weekNumber = fixedWeek !== undefined ? String(fixedWeek) : params.weekNumber;
  const sessionNumber = fixedSession !== undefined ? String(fixedSession) : params.sessionNumber;
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [colabContent, setColabContent] = useState<string>('');
  const [cleanupContent, setCleanupContent] = useState<string>('');
  const [referenceContent, setReferenceContent] = useState<string>('');
  const [additionalResourcesContent, setAdditionalResourcesContent] =
    useState<string>('');
  const [keyPointsItems, setKeyPointsItems] = useState<
    { emoji: string; title: string; desc: string }[]
  >([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const week = parseInt(weekNumber || '0');
  const session = parseInt(sessionNumber || '0');

  // 커리큘럼 데이터에서 해당 주차와 차시 찾기
  const privateItem = privateId ? findPrivateItem(privateId) : undefined;
  const privateMeta = (() => {
    try {
      return privateItem?.markdown ? parseMarkdownText(privateItem.markdown).metadata : undefined;
    } catch {
      return undefined;
    }
  })();
  const weekData = privateItem
    ? curriculum.find((w) => w.week === privateItem.week)
    : curriculum.find((w) => w.week === week);
  const sessionData = privateItem
    ? ({
        session: privateItem.session ?? 0,
        type: 'demo',
        title: privateMeta?.title || privateItem.label,
        hasContent: true,
        markdownPath: `private:${privateItem.id}`,
        description: '🔒 이 브라우저에만 저장된 개인 자료입니다.',
      } as Session)
    : weekData?.sessions.find((s) => s.session === session);

  useEffect(() => {
    const loadContent = async () => {
      if (!sessionData) {
        setError('해당 차시를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }

      // 마크다운 파일이 있는 경우 로드
      if (sessionData.hasContent && sessionData.markdownPath) {
        try {
          const data = await loadMarkdownFile(sessionData.markdownPath);
          let content = data.content;

          // Keep the optional Colab appendix after all lesson cards.
          const colabMatch = content.match(/\n## 코랩에서 실행할 경우[\s\S]*?(?=\n## |\n# |$)/);
          const colabSection = colabMatch?.[0].trim() || '';
          if (colabMatch) content = content.replace(colabMatch[0], '');
          setColabContent(colabSection);

          // 역순으로 분리: 참고 → 추가 학습 리소스 → 리소스 정리

          // 0. 핵심 포인트 정리 섹션 분리
          const keyPointsMatch = content.match(/\n## 💡 핵심 포인트 정리[\s\S]*?(?=\n## |\n# |$)/);
          if (keyPointsMatch) {
            const section = keyPointsMatch[0];
            content = content.replace(section, '');
            // 각 항목 파싱: 이모지\n제목\n설명 (각각 별도 줄)
            // eslint-disable-next-line no-misleading-character-class
            const itemRegex = /^([\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\ufe0f]+)\n(.+)\n(.+)$/gmu;
            const items: { emoji: string; title: string; desc: string }[] = [];
            let m;
            while ((m = itemRegex.exec(section)) !== null) {
              items.push({ emoji: m[1].trim(), title: m[2].trim(), desc: m[3].trim() });
            }
            setKeyPointsItems(items);
          } else {
            setKeyPointsItems([]);
          }

          // 1. 참고 섹션 분리 (가장 마지막)
          const referenceMatch = content.match(/\n## (?:📚 )?참고:/);
          let refContent = '';
          if (referenceMatch) {
            refContent = content.substring(referenceMatch.index! + 1);
            content = content.substring(0, referenceMatch.index);
          }

          // 2. 추가 학습 리소스 섹션 분리
          const additionalMatch = content.match(/\n## 추가 학습 리소스/);
          let additionalContent = '';
          if (additionalMatch) {
            additionalContent = content.substring(additionalMatch.index! + 1);
            content = content.substring(0, additionalMatch.index);
          }

          // 3. 리소스 정리 섹션 분리 (제목 줄 제거)
          const cleanupMatch = content.match(/\n##? (?:🗑️ )?리소스 정리/);
          let cleanContent = '';
          if (cleanupMatch) {
            cleanContent = content.substring(cleanupMatch.index! + 1);
            // 첫 번째 줄(## 리소스 정리)을 제거
            cleanContent = cleanContent.replace(/^##? (?:🗑️ )?리소스 정리\s*\n/, '');
            content = content.substring(0, cleanupMatch.index);
          }

          // 4. 상태 업데이트
          setMarkdownContent(content);
          setCleanupContent(cleanContent);
          setReferenceContent(refContent);
          setAdditionalResourcesContent(additionalContent);
          setMetadata(data.metadata);
          setError(null);
        } catch (err) {
          console.error('마크다운 파일 로드 실패:', err);
          setError('실습 가이드를 불러오는 중 오류가 발생했습니다.');
        }
      }

      setIsLoading(false);
    };

    loadContent();
  }, [week, session, sessionData?.markdownPath]);

  if (!weekData || !sessionData) {
    return (
      <Container>
        <Alert type="error" header="페이지를 찾을 수 없습니다">
          요청하신 주차 또는 차시가 존재하지 않습니다.
        </Alert>
      </Container>
    );
  }

  const config = sessionTypeConfig[sessionData.type];

  // 시험인 경우 특별 처리
  if (sessionData.type === 'none') {
    return (
      <Container
        header={
          <Header
            variant="h1"
            description={weekData.title}
            actions={
              <Badge color={config.color as any}>
                {config.emoji} {config.label}
              </Badge>
            }
          >
            {session}교시: {sessionData.title}
          </Header>
        }
      >
        <Alert type="info" header="시험 안내">
          이 주차는 시험이 진행됩니다. 자세한 일정은 강의 공지사항을 확인하세요.
        </Alert>
      </Container>
    );
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      {[
        <Container
          key="header-card"
          header={
            <Header
              variant="h1"
              description={sessionData.description || weekData.title}
              actions={
                <Badge color={config.color as any}>
                  {config.emoji} {config.label}
                </Badge>
              }
            >
              {sessionData.title}
            </Header>
          }
        >
          {/* AWS 서비스 배지 */}
          {metadata?.awsServices && metadata.awsServices.length > 0 && (
            <Box margin={{ top: 's' }}>
              <Box color="text-label" padding={{ bottom: 'xs' }}>
                사용 도구:
              </Box>
              <SpaceBetween direction="horizontal" size="xs">
                {Array.isArray(metadata.awsServices) &&
                  metadata.awsServices.map((service: string, index: number) => (
                    <span
                      key={`service-${index}`}
                      className={`aws-service-badge ${getServiceBadgeClass(service)}`}
                    >
                      {service}
                    </span>
                  ))}
              </SpaceBetween>
            </Box>
          )}
        </Container>,

        <Container
          key="overview-card"
          id="overview"
          header={
            <Header variant="h2">
              <span className="session-section-title main-header">
                📋 {sessionData.type === 'lab' ? '실습' : '데모'} 개요
              </span>
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            {/* 실습/데모 목표 및 주요 태스크 */}
            <ColumnLayout
              key="learning-objectives"
              columns={2}
              variant="text-grid"
            >
              <div key="learning-objectives-section">
                <Box variant="h2" padding={{ bottom: 's' }}>
                  <span className="session-section-title sub-header">
                    🎯 {sessionData.type === 'lab' ? '실습' : '데모'} 목표
                  </span>
                </Box>
                {metadata?.learningObjectives &&
                  metadata.learningObjectives.length > 0 ? (
                  <ul className="session-objectives-list">
                    {metadata.learningObjectives.map(
                      (objective: string, index: number) => (
                        <li key={`objective-${index}`}>{objective}</li>
                      ),
                    )}
                  </ul>
                ) : (
                  <div className="session-empty-message">
                    학습 목표는 실습 가이드에서 확인하세요.
                  </div>
                )}
              </div>

              <div key="tasks-section">
                <Box variant="h2" padding={{ bottom: 's' }}>
                  <span className="session-section-title sub-header">
                    📋 주요 태스크
                  </span>
                </Box>
                {markdownContent && extractTasks(markdownContent).length > 0 ? (
                  <ul className="session-tasks-list">
                    {extractTasks(markdownContent).map(
                      (task: string, index: number) => (
                        <li key={`task-${index}`}>{task}</li>
                      ),
                    )}
                  </ul>
                ) : (
                  <div className="session-empty-message">
                    주요 태스크는 실습 가이드에서 확인하세요.
                  </div>
                )}
              </div>
            </ColumnLayout>

            {/* 실습 정보 카드 */}
            {(metadata?.resources ||
              metadata?.estimatedCost ||
              metadata?.freeTier) && (
                <Box key="lab-info" padding={{ top: 'm' }}>
                  <ColumnLayout columns={3} variant="text-grid">
                    {[
                      /* 생성되는 리소스 */
                      metadata?.resources && metadata.resources.length > 0 && (
                        <Box key="resources-info">
                          <SpaceBetween direction="vertical" size="xs">
                            <Box>
                              <SpaceBetween
                                direction="horizontal"
                                size="xs"
                                alignItems="center"
                              >
                                <Icon name="status-info" variant="link" />
                                <Box variant="h4">생성되는 리소스</Box>
                              </SpaceBetween>
                            </Box>
                            <Box color="text-body-secondary">
                              <SpaceBetween direction="vertical" size="xxs">
                                {metadata.resources.map(
                                  (resource: string, index: number) => (
                                    <div key={`resource-${index}`}>
                                      • {resource}
                                    </div>
                                  ),
                                )}
                              </SpaceBetween>
                            </Box>
                          </SpaceBetween>
                        </Box>
                      ),

                      /* 예상 비용 */
                      metadata?.estimatedCost && (
                        <Box key="estimated-cost">
                          <SpaceBetween direction="vertical" size="xs">
                            <Box>
                              <SpaceBetween
                                direction="horizontal"
                                size="xs"
                                alignItems="center"
                              >
                                <Icon name="status-warning" variant="warning" />
                                <Box variant="h4">예상 비용</Box>
                              </SpaceBetween>
                            </Box>
                            <Box color="text-body-secondary">
                              {metadata.estimatedCost}
                            </Box>
                          </SpaceBetween>
                        </Box>
                      ),

                      /* 프리티어 정보 */
                      metadata?.freeTier !== undefined && (
                        <Box key="free-tier">
                          <SpaceBetween direction="vertical" size="xs">
                            <Box>
                              <SpaceBetween
                                direction="horizontal"
                                size="xs"
                                alignItems="center"
                              >
                                <Icon
                                  name={
                                    metadata.freeTier
                                      ? 'status-positive'
                                      : 'status-negative'
                                  }
                                  variant={
                                    metadata.freeTier ? 'success' : 'error'
                                  }
                                />
                                <Box variant="h4">프리티어</Box>
                              </SpaceBetween>
                            </Box>
                            <Box color="text-body-secondary">
                              {metadata.freeTier
                                ? '프리티어 범위 내에서 실습 가능'
                                : '일부 리소스는 프리티어 범위를 초과할 수 있음'}
                            </Box>
                          </SpaceBetween>
                        </Box>
                      ),
                      ].filter(Boolean)}
                  </ColumnLayout>
                </Box>
              )}

            {/* 파일 다운로드 섹션 - Popover 스타일 */}
            {metadata?.downloadFiles && metadata.downloadFiles.length > 0 && (
              <div key="download-files" className="download-files-section">
                <div className="download-files-header">
                  <div className="download-files-icon">📦</div>
                  <h3 className="download-files-title">실습 파일 다운로드</h3>
                </div>
                <p className="download-files-description">
                  실습을 시작하기 전에 다음 파일들을 다운로드하세요.
                </p>
                <ColumnLayout
                  columns={metadata.downloadFiles.length > 1 ? 2 : 1}
                  className={
                    metadata.downloadFiles.length === 1
                      ? 'download-files-grid-single'
                      : ''
                  }
                >
                  {metadata.downloadFiles.map((file: any, index: number) => (
                    <div key={index} className="download-file-card">
                      <div className="download-file-header">
                        <div className="download-file-name download-file-name-wrapper">
                          📄 {file.name}
                        </div>
                        <Popover
                          dismissButton={false}
                          position="top"
                          size="large"
                          triggerType="custom"
                          renderWithPortal={false}
                          fixedWidth
                          content={
                            <Box padding="m">
                              <SpaceBetween direction="vertical" size="m">
                                <div key="file-info">
                                  <Box variant="h4" padding={{ bottom: 'xs' }}>
                                    📋 파일 정보
                                  </Box>
                                  <Box color="text-body-secondary">
                                    {file.description}
                                  </Box>
                                </div>

                                <hr
                                  key="divider"
                                  className="download-file-divider"
                                />

                                <div key="file-type">
                                  <Box variant="h4" padding={{ bottom: 'xs' }}>
                                    🏷️ 파일 타입
                                  </Box>
                                  <StatusIndicator type="info">
                                    CloudFormation 템플릿 (YAML)
                                  </StatusIndicator>
                                </div>

                                <div key="resources">
                                  <Box variant="h4" padding={{ bottom: 'xs' }}>
                                    📦 포함된 리소스
                                  </Box>
                                  <Box>
                                    <SpaceBetween
                                      direction="vertical"
                                      size="xxs"
                                    >
                                      <div key="resource-1">
                                        • VPC 및 서브넷 (퍼블릭/프라이빗)
                                      </div>
                                      <div key="resource-2">
                                        • EC2 인스턴스 2개
                                      </div>
                                      <div key="resource-3">
                                        • 보안 그룹 및 IAM Role
                                      </div>
                                      <div key="resource-4">• S3 버킷</div>
                                    </SpaceBetween>
                                  </Box>
                                </div>

                                <div key="usage">
                                  <Box variant="h4" padding={{ bottom: 'xs' }}>
                                    💡 사용 방법
                                  </Box>
                                  <Box color="text-body-secondary">
                                    {file.description}
                                  </Box>
                                  <Box
                                    color="text-body-secondary"
                                    padding={{ top: 'xs' }}
                                  >
                                    (스택 생성 완료까지 약 3-5분 소요)
                                  </Box>
                                </div>
                              </SpaceBetween>
                            </Box>
                          }
                        >
                          <Button
                            variant="icon"
                            iconName="status-info"
                            ariaLabel="파일 정보 보기"
                          />
                        </Popover>
                      </div>
                      <Button
                        variant={index === 0 ? 'primary' : 'normal'}
                        iconName="download"
                        href={
                          file.path.startsWith('http')
                            ? file.path
                            : `${import.meta.env.BASE_URL}${file.path.replace(/^\//, '')}`
                        }
                        download={file.name}
                      >
                        다운로드
                      </Button>
                    </div>
                  ))}
                </ColumnLayout>
              </div>
            )}
          </SpaceBetween>
        </Container>,

        <Container
          key="guide-card"
          id="guide"
          header={
            <Header variant="h2">
              <span className="guide-header-title">
                {sessionData.type === 'demo'
                  ? '🎥 데모 가이드'
                  : '🎯 실습 가이드'}
              </span>
            </Header>
          }
        >
          {isLoading ? (
            <Box textAlign="center" padding="xxl">
              <Box variant="p" color="text-body-secondary">
                {sessionData.type === 'demo'
                  ? '데모 가이드를'
                  : '실습 가이드를'}{' '}
                불러오는 중...
              </Box>
            </Box>
          ) : error ? (
            <Alert type="warning" header="콘텐츠 준비 중">
              {error}
            </Alert>
          ) : sessionData.hasContent && markdownContent ? (
            <MarkdownRenderer content={markdownContent} />
          ) : (
            <Alert type="warning" header="콘텐츠 준비 중">
              상세한 {sessionData.type === 'demo' ? '데모' : '실습'} 가이드는 곧
              업데이트될 예정입니다.
            </Alert>
          )}
        </Container>,

        cleanupContent && (
          <Container
            key="cleanup-card"
            id="cleanup"
            header={
              <Header variant="h2">
                <span className="session-section-title main-header">🗑️ 리소스 정리</span>
              </Header>
            }
          >
            <MarkdownRenderer content={cleanupContent} />
          </Container>
        ),

        (metadata?.keyConcepts ||
          metadata?.bestPractices ||
          metadata?.warnings ||
          keyPointsItems.length > 0) && (
          <Container
            key="key-points-card"
            id="key-points-card"
            header={
              <Header variant="h2">
                <span className="key-points-header-title">💡 핵심 포인트 정리</span>
              </Header>
            }
          >
            {keyPointsItems.length > 0 ? (
              <div className="key-points-grid">
                {keyPointsItems.map((item, index) => (
                  <div key={`kp-${index}`} className="key-point-card">
                    <div className="key-point-card-emoji">{item.emoji}</div>
                    <div className="key-point-card-body">
                      <div className="key-point-card-title">{item.title}</div>
                      <div className="key-point-card-desc">{renderInlineCode(item.desc)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SpaceBetween direction="vertical" size="l">
                <Box padding={{ horizontal: 'l', vertical: 'm' }}>
                  <SpaceBetween direction="vertical" size="xs">
                    {[
                      ...(metadata.keyConcepts || []).map(
                        (item: string, idx: number) => ({
                          icon: '💡',
                          title: `핵심 ${idx + 1}`,
                          content: item,
                          type: 'concept',
                        }),
                      ),
                      ...(metadata.bestPractices || []).map(
                        (item: string, idx: number) => ({
                          icon: '✅',
                          title: `실무 ${idx + 1}`,
                          content: item,
                          type: 'practice',
                        }),
                      ),
                      ...(metadata.warnings || []).map(
                        (item: string, idx: number) => ({
                          icon: '⚠️',
                          title: `주의 ${idx + 1}`,
                          content: item,
                          type: 'warning',
                        }),
                      ),
                    ].map((item, index) => (
                      <Box
                        key={`${item.type}-${index}`}
                        padding="s"
                        className="key-point-item"
                      >
                        <SpaceBetween
                          direction="horizontal"
                          size="s"
                          alignItems="start"
                        >
                          <Box fontSize="heading-s">{item.icon}</Box>
                          <Box className="key-point-content">
                            <SpaceBetween direction="vertical" size="xxs">
                              <Box fontSize="body-m" fontWeight="bold">
                                {item.title}
                              </Box>
                              <Box fontSize="body-s" color="text-body-secondary">
                                {item.content}
                              </Box>
                            </SpaceBetween>
                          </Box>
                        </SpaceBetween>
                      </Box>
                    ))}
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            )}
          </Container>
        ),

        referenceContent && (
          <Container key="reference-card" id="reference">
            <SpaceBetween direction="vertical" size="l">
              <MarkdownRenderer content={referenceContent} />
              {additionalResourcesContent && (
                <MarkdownRenderer content={additionalResourcesContent} />
              )}
            </SpaceBetween>
          </Container>
        ),
              colabContent && (
          <Container key="colab-card" id="colab">
            <MarkdownRenderer content={colabContent} />
          </Container>
        ),
].filter(Boolean)}
    </SpaceBetween>
  );
};
