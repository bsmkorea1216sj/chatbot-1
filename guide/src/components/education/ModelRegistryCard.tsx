import React, { useState } from 'react'
import {
    Container,
    Header,
    SpaceBetween,
    Box,
    Badge,
    Button,
    Table,
    StatusIndicator,
    Modal,
    ColumnLayout
} from '@cloudscape-design/components'
import { CopyableCode } from './CopyableCode'

interface ModelVersion {
    version: string
    status: 'PendingManualApproval' | 'Approved' | 'Rejected'
    accuracy: number
    f1Score: number
    createdTime: string
    description?: string
    modelArn?: string
}

interface ModelRegistryCardProps {
    modelPackageGroupName: string
    description: string
    versions: ModelVersion[]
    onApprove?: (version: string) => void
    onReject?: (version: string) => void
    onDeploy?: (version: string) => void
}

export const ModelRegistryCard: React.FC<ModelRegistryCardProps> = ({
    modelPackageGroupName,
    description,
    versions,
    onApprove,
    onReject,
    onDeploy
}) => {
    const [selectedVersion, setSelectedVersion] = useState<ModelVersion | null>(null)
    const [showModal, setShowModal] = useState(false)

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <Badge color="green">승인됨</Badge>
            case 'Rejected':
                return <Badge color="red">거부됨</Badge>
            case 'PendingManualApproval':
                return <Badge color="blue">승인 대기</Badge>
            default:
                return <Badge color="grey">알 수 없음</Badge>
        }
    }

    const getStatusIndicator = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'success'
            case 'Rejected':
                return 'error'
            case 'PendingManualApproval':
                return 'pending'
            default:
                return 'info'
        }
    }

    const handleVersionClick = (version: ModelVersion) => {
        setSelectedVersion(version)
        setShowModal(true)
    }

    const handleApprove = (version: string) => {
        onApprove?.(version)
        setShowModal(false)
    }

    const handleReject = (version: string) => {
        onReject?.(version)
        setShowModal(false)
    }

    const handleDeploy = (version: string) => {
        onDeploy?.(version)
        setShowModal(false)
    }

    return (
        <>
            <Container
                header={
                    <Header variant="h3">
                        Model Registry: {modelPackageGroupName}
                    </Header>
                }
            >
                <SpaceBetween direction="vertical" size="m">
                    <Box>{description}</Box>

                    <Table
                        columnDefinitions={[
                            {
                                id: "version",
                                header: "버전",
                                cell: item => (
                                    <Button
                                        variant="link"
                                        onClick={() => handleVersionClick(item)}
                                    >
                                        {item.version}
                                    </Button>
                                )
                            },
                            {
                                id: "status",
                                header: "상태",
                                cell: item => (
                                    <StatusIndicator type={getStatusIndicator(item.status)}>
                                        {getStatusBadge(item.status)}
                                    </StatusIndicator>
                                )
                            },
                            {
                                id: "accuracy",
                                header: "정확도",
                                cell: item => `${(item.accuracy * 100).toFixed(2)}%`
                            },
                            {
                                id: "f1Score",
                                header: "F1 Score",
                                cell: item => item.f1Score.toFixed(4)
                            },
                            {
                                id: "createdTime",
                                header: "생성 시간",
                                cell: item => new Date(item.createdTime).toLocaleString('ko-KR')
                            },
                            {
                                id: "actions",
                                header: "작업",
                                cell: item => (
                                    <SpaceBetween direction="horizontal" size="xs">
                                        {item.status === 'PendingManualApproval' && (
                                            <>
                                                <Button
                                                    onClick={() => handleApprove(item.version)}
                                                >
                                                    승인
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(item.version)}
                                                >
                                                    거부
                                                </Button>
                                            </>
                                        )}
                                        {item.status === 'Approved' && (
                                            <Button
                                                variant="primary"
                                                onClick={() => handleDeploy(item.version)}
                                            >
                                                배포
                                            </Button>
                                        )}
                                    </SpaceBetween>
                                )
                            }
                        ]}
                        items={versions}
                        empty={
                            <Box textAlign="center" color="inherit">
                                <b>등록된 모델 버전이 없습니다</b>
                                <Box variant="p" color="inherit">
                                    파이프라인을 실행하여 모델을 등록하세요.
                                </Box>
                            </Box>
                        }
                        header={
                            <Header
                                counter={`(${versions.length})`}
                                description="등록된 모델 버전들을 관리하고 승인 워크플로를 수행합니다"
                            >
                                모델 버전
                            </Header>
                        }
                    />
                </SpaceBetween>
            </Container>

            {/* 모델 상세 정보 모달 */}
            <Modal
                visible={showModal}
                onDismiss={() => setShowModal(false)}
                header={`모델 버전 ${selectedVersion?.version} 상세 정보`}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setShowModal(false)}>
                                닫기
                            </Button>
                            {selectedVersion?.status === 'PendingManualApproval' && (
                                <>
                                    <Button
                                        onClick={() => selectedVersion && handleReject(selectedVersion.version)}
                                    >
                                        거부
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => selectedVersion && handleApprove(selectedVersion.version)}
                                    >
                                        승인
                                    </Button>
                                </>
                            )}
                            {selectedVersion?.status === 'Approved' && (
                                <Button
                                    variant="primary"
                                    onClick={() => selectedVersion && handleDeploy(selectedVersion.version)}
                                >
                                    배포하기
                                </Button>
                            )}
                        </SpaceBetween>
                    </Box>
                }
            >
                {selectedVersion && (
                    <SpaceBetween direction="vertical" size="m">
                        <ColumnLayout columns={2}>
                            <Box>
                                <SpaceBetween direction="vertical" size="s">
                                    <Box>
                                        <Box variant="awsui-key-label">상태</Box>
                                        {getStatusBadge(selectedVersion.status)}
                                    </Box>
                                    <Box>
                                        <Box variant="awsui-key-label">정확도</Box>
                                        <Box>{(selectedVersion.accuracy * 100).toFixed(2)}%</Box>
                                    </Box>
                                    <Box>
                                        <Box variant="awsui-key-label">F1 Score</Box>
                                        <Box>{selectedVersion.f1Score.toFixed(4)}</Box>
                                    </Box>
                                </SpaceBetween>
                            </Box>
                            <Box>
                                <SpaceBetween direction="vertical" size="s">
                                    <Box>
                                        <Box variant="awsui-key-label">생성 시간</Box>
                                        <Box>{new Date(selectedVersion.createdTime).toLocaleString('ko-KR')}</Box>
                                    </Box>
                                    <Box>
                                        <Box variant="awsui-key-label">버전</Box>
                                        <Box>{selectedVersion.version}</Box>
                                    </Box>
                                </SpaceBetween>
                            </Box>
                        </ColumnLayout>

                        {selectedVersion.description && (
                            <Box>
                                <Box variant="awsui-key-label">설명</Box>
                                <Box>{selectedVersion.description}</Box>
                            </Box>
                        )}

                        {selectedVersion.modelArn && (
                            <Box>
                                <Box variant="awsui-key-label">모델 ARN</Box>
                                <CopyableCode
                                    term={selectedVersion.modelArn}
                                    type="config"
                                    variant="block"
                                />
                            </Box>
                        )}

                        <Box>
                            <Box variant="awsui-key-label">성능 메트릭</Box>
                            <ColumnLayout columns={2}>
                                <Box>
                                    <Box fontSize="body-s" color="text-body-secondary">정확도</Box>
                                    <Box fontSize="heading-m" color="text-status-success">
                                        {(selectedVersion.accuracy * 100).toFixed(2)}%
                                    </Box>
                                </Box>
                                <Box>
                                    <Box fontSize="body-s" color="text-body-secondary">F1 Score</Box>
                                    <Box fontSize="heading-m" color="text-status-info">
                                        {selectedVersion.f1Score.toFixed(4)}
                                    </Box>
                                </Box>
                            </ColumnLayout>
                        </Box>
                    </SpaceBetween>
                )}
            </Modal>
        </>
    )
}