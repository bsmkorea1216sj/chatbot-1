// 실습 사전 환경 및 파일 정보

export type FileType =
  | 'cloudformation'
  | 'lambda'
  | 'data'
  | 'yaml'
  | 'script'
  | 'config'
  | 'document'
  | 'code'
  | 'other';

export interface LabFile {
  name: string;
  type: FileType;
  description: string;
  usedInTask?: string;
}

export interface LabEnvironment {
  week: number;
  session: number;
  sessionType: 'theory' | 'lab' | 'demo' | 'none';
  hasPrerequisites: boolean;
  zipFileName?: string;
  files: LabFile[];
  cloudFormationResources?: string[];
  notes?: string;
}

// 15주차 실습 사전 환경 데이터
export const labEnvironments: LabEnvironment[] = [
  // Week 1: 클라우드 아키텍처 개요 및 설계 원칙
  {
    week: 1,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'AWS 콘솔과 CLI 기본 사용법 학습. 리소스를 생성하지 않으므로 비용 없음',
  },
  // Week 2: AWS IAM 고급 정책 구성
  {
    week: 2,
    session: 1,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'IAM 사용자, 그룹, 정책 관리 실습',
  },
  {
    week: 2,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'IAM 역할 생성 및 AssumeRole 실습',
  },
  // Week 3: Amazon VPC 및 서브넷 설계 실습
  {
    week: 3,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'VPC, 서브넷, IGW, NAT GW, 라우팅 테이블, 보안 그룹 구성',
  },
  // Week 4: Amazon EC2와 오토스케일링 구성 실습
  {
    week: 4,
    session: 1,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week4-1-ec2-instance-deploy.zip',
    files: [
      {
        name: 'setup-lab05-student.sh',
        type: 'script',
        description: 'EC2 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab05-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    cloudFormationResources: [
      'VPC (CloudArchitect-Lab-VPC)',
      'Public/Private Subnets',
      'Internet Gateway',
      'Security Group',
    ],
    notes: 'EC2 인스턴스 생성 및 관리 실습',
  },
  {
    week: 4,
    session: 3,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week4-3-ec2-autoscaling.zip',
    files: [
      {
        name: 'setup-lab06-student.sh',
        type: 'script',
        description: 'Auto Scaling 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab06-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    cloudFormationResources: [
      'VPC 및 서브넷',
      'Application Load Balancer',
      'Auto Scaling Group',
      'Launch Template',
    ],
    notes: 'EC2 Auto Scaling 및 로드 밸런서 구성 실습',
  },
  // Week 5: 스토리지 전략
  {
    week: 5,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'S3 버킷 생성 및 정적 웹사이트 호스팅 실습',
  },
  // Week 6: Amazon RDS 및 Amazon DynamoDB 구성
  {
    week: 6,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week6-2-rds-service.zip',
    files: [
      {
        name: 'setup-lab08-student.sh',
        type: 'script',
        description: 'RDS 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab08-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    cloudFormationResources: [
      'VPC 및 서브넷',
      'RDS Subnet Group',
      'Security Group',
    ],
    notes: 'RDS 인스턴스 생성 및 Multi-AZ 구성 실습',
  },
  {
    week: 6,
    session: 3,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'DynamoDB 테이블 생성 및 데이터 조작 실습',
  },
  // Week 7: 모니터링과 로깅
  {
    week: 7,
    session: 1,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week7-1-cloudwatch-dashboard.zip',
    files: [
      {
        name: 'setup-lab10-student.sh',
        type: 'script',
        description: 'CloudWatch 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab10-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    notes: 'CloudWatch 대시보드 구성 및 지표 모니터링 실습',
  },
  {
    week: 7,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week7-2-cloudwatch-logs.zip',
    files: [
      {
        name: 'setup-lab11-student.sh',
        type: 'script',
        description: 'CloudWatch Logs 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab11-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    notes: 'CloudWatch 알람 및 Logs Insights 분석 실습',
  },
  // Week 9: 서버리스 아키텍처 구성
  {
    week: 9,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week9-2-lambda-function.zip',
    files: [
      {
        name: 'setup-lab12-student.sh',
        type: 'script',
        description: 'Lambda 실습 환경 구축 스크립트 (DynamoDB 테이블, IAM 역할 생성)',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab12-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    cloudFormationResources: [
      'DynamoDB Table (CloudArchitect-Lab-Users)',
      'IAM Role (CloudArchitect-Lab-LambdaExecutionRole)',
    ],
    notes: 'Lambda 함수 생성 및 DynamoDB 연동 실습',
  },
  {
    week: 9,
    session: 3,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week9-3-api-gateway.zip',
    files: [
      {
        name: 'setup-lab13-student.sh',
        type: 'script',
        description: 'API Gateway 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab13-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    notes: 'API Gateway와 Lambda 통합 실습',
  },
  // Week 10: 컨테이너 아키텍처
  {
    week: 10,
    session: 1,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'Docker 이미지 빌드 및 ECR 푸시 실습',
  },
  {
    week: 10,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week10-2-ecs-service-deploy.zip',
    files: [
      {
        name: 'setup-lab15-student.sh',
        type: 'script',
        description: 'ECS 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab15-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    notes: 'ECS Fargate 서비스 배포 실습',
  },
  // Week 11: AWS 글로벌 인프라 및 엣지 컴퓨팅
  {
    week: 11,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week11-2-cloudfront-deploy.zip',
    files: [
      {
        name: 'setup-lab16-student.sh',
        type: 'script',
        description: 'CloudFront 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab16-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    notes: 'CloudFront 배포 생성 및 캐싱 전략 실습',
  },
  // Week 12: 백업 및 재해 복구 설계
  {
    week: 12,
    session: 3,
    sessionType: 'lab',
    hasPrerequisites: true,
    zipFileName: 'week12-3-backup-strategy.zip',
    files: [
      {
        name: 'setup-lab17-student.sh',
        type: 'script',
        description: 'AWS Backup 실습 환경 구축 스크립트',
        usedInTask: '사전 환경 구축',
      },
      {
        name: 'cleanup-lab17-student.sh',
        type: 'script',
        description: '실습 리소스 정리 스크립트',
        usedInTask: '리소스 정리',
      },
    ],
    notes: 'AWS Backup 서비스를 활용한 백업 전략 구성 실습',
  },
  // Week 13: 클라우드 비용 최적화 및 요금 분석
  {
    week: 13,
    session: 2,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'Cost Explorer를 활용한 비용 분석 실습',
  },
  // Week 14: 다중 계정 및 조직 관리 설계
  {
    week: 14,
    session: 3,
    sessionType: 'lab',
    hasPrerequisites: false,
    files: [],
    notes: 'IAM Identity Center를 활용한 통합 인증 실습',
  },
];

// 유틸리티 함수들
export const getWeekEnvironments = (week: number): LabEnvironment[] => {
  return labEnvironments.filter((env) => env.week === week);
};

export const getSessionEnvironment = (
  week: number,
  session: number
): LabEnvironment | undefined => {
  return labEnvironments.find(
    (env) => env.week === week && env.session === session
  );
};

export const getSessionsWithPrerequisites = (): LabEnvironment[] => {
  return labEnvironments.filter((env) => env.hasPrerequisites);
};

export const getFileTypeStatistics = (): Record<FileType, number> => {
  const stats: Record<FileType, number> = {
    cloudformation: 0,
    lambda: 0,
    data: 0,
    yaml: 0,
    script: 0,
    config: 0,
    document: 0,
    code: 0,
    other: 0,
  };

  labEnvironments.forEach((env) => {
    env.files.forEach((file) => {
      stats[file.type]++;
    });
  });

  return stats;
};

export const getTotalFileCount = (): number => {
  return labEnvironments.reduce((total, env) => total + env.files.length, 0);
};

export const getSessionsWithZipFiles = (): LabEnvironment[] => {
  return labEnvironments.filter((env) => env.zipFileName);
};
