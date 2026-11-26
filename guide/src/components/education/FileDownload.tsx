import React from 'react';
import {
  Button,
  Popover,
  SpaceBetween,
  Icon,
  Box,
} from '@cloudscape-design/components';
import '@/styles/download-files.css';
import '@/styles/download-button-override.css';

interface FileInfo {
  name: string;
  description: string;
}

interface FileDownloadProps {
  fileName: string;
  downloadUrl: string;
  files: FileInfo[];
  usageTasks?: string[];
}

/**
 * 실습 파일 다운로드 컴포넌트
 */
export const FileDownload: React.FC<FileDownloadProps> = ({
  fileName,
  downloadUrl,
  files,
  usageTasks = [],
}) => {
  // Base path 추가 (GitHub Pages 지원)
  const fullDownloadUrl = downloadUrl.startsWith('http')
    ? downloadUrl
    : `${import.meta.env.BASE_URL}${downloadUrl.replace(/^\//, '')}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullDownloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="file-download-box">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        {/* 다운로드 버튼 */}
        <Button
          variant="normal"
          iconName="download"
          onClick={handleDownload}
          className="download-file-button"
        >
          {fileName}
        </Button>

        {/* 정보 팝오버 - 항상 표시 */}
        <Popover
          dismissButton={false}
          position="right"
          size="large"
          triggerType="custom"
          content={
            <div className="file-info-popover">
              <SpaceBetween direction="vertical" size="m">
                {/* 포함 파일 목록 */}
                {files.length > 0 ? (
                  <div>
                    <Box variant="h4" margin={{ bottom: 's' }}>
                      <SpaceBetween
                        direction="horizontal"
                        size="xs"
                        alignItems="center"
                      >
                        <Icon name="folder" />
                        <span>포함 파일</span>
                      </SpaceBetween>
                    </Box>
                    <div className="file-list">
                      {files.map((file, index) => (
                        <div key={index} className="file-item">
                          <code className="file-name">{file.name}</code>
                          <span className="file-desc">{file.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Box variant="h4" margin={{ bottom: 's' }}>
                      <SpaceBetween
                        direction="horizontal"
                        size="xs"
                        alignItems="center"
                      >
                        <Icon name="status-info" />
                        <span>파일 정보</span>
                      </SpaceBetween>
                    </Box>
                    <Box fontSize="body-s" color="text-body-secondary">
                      이 압축 파일에는 실습에 필요한 파일들이 포함되어 있습니다.
                    </Box>
                  </div>
                )}

                {/* 사용 태스크 */}
                {usageTasks.length > 0 && (
                  <div>
                    <Box variant="h4" margin={{ bottom: 's' }}>
                      <SpaceBetween
                        direction="horizontal"
                        size="xs"
                        alignItems="center"
                      >
                        <Icon name="status-positive" variant="success" />
                        <span>사용 태스크</span>
                      </SpaceBetween>
                    </Box>
                    <div className="usage-tasks">
                      {usageTasks.map((task, index) => {
                        // "태스크 X:" 또는 "태스크 X-Y:" 패턴 감지 및 분리
                        const match = task.match(
                          /^(태스크\s+[\d-]+):\s*(.+)$/s,
                        );
                        const taskNumber = match ? match[1] : null;
                        const taskDescription = match ? match[2] : task;

                        return (
                          <div key={index} className="usage-task-item">
                            <SpaceBetween direction="vertical" size="xs">
                              {taskNumber && (
                                <Box fontSize="body-m" fontWeight="bold">
                                  {taskNumber}
                                </Box>
                              )}
                              <div className="usage-task-description">
                                {taskDescription}
                              </div>
                            </SpaceBetween>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </SpaceBetween>
            </div>
          }
        >
          <Button
            variant="inline-icon"
            iconName="status-info"
            ariaLabel="파일 정보 보기"
          />
        </Popover>
      </SpaceBetween>
    </div>
  );
};
