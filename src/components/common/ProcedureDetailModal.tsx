"use client";
import { Modal, Typography, Divider, Button, Timeline } from 'antd';
import { DownloadOutlined, FieldTimeOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface ProcedureStep {
  title: string;
  detail: string;
}

interface ProcedureData {
  id?: number;
  title: string;
  description: string;
  content: string;
  requiredDocuments?: string;
  processingTime?: string;
  fee?: string;
  formUrl?: string;
  steps?: ProcedureStep[];
}

interface ProcedureDetailModalProps {
  procedure: ProcedureData | null;
  open: boolean;
  onClose: () => void;
}

export default function ProcedureDetailModal({ procedure, open, onClose }: ProcedureDetailModalProps) {
  if (!procedure) return null;

  return (
    <Modal
      title={procedure.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
    >
      <Title level={3}>{procedure.title}</Title>
      <Paragraph type="secondary">{procedure.description}</Paragraph>
      
      <Divider />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div>
          <Text strong><FieldTimeOutlined /> Thời gian giải quyết:</Text>
          <div style={{ marginTop: 4 }}>{procedure.processingTime || "Nghiên cứu theo quy trình"}</div>
        </div>
        <div>
          <Text strong><DollarOutlined /> Lệ phí:</Text>
          <div style={{ marginTop: 4 }}>{procedure.fee || "Miễn phí"}</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong><FileTextOutlined /> Hồ sơ yêu cầu:</Text>
        <Paragraph style={{ marginTop: 8, background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
          {procedure.requiredDocuments || "Liên hệ trực tiếp để biết chi tiết"}
        </Paragraph>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong>Trình tự thực hiện:</Text>
        <div style={{ marginTop: 16 }}>
          {procedure.steps && procedure.steps.length > 0 ? (
            <Timeline
              items={procedure.steps.map((step, index) => ({
                color: 'blue',
                children: (
                  <>
                    <Text strong>{step.title}</Text>
                    <Paragraph style={{ marginTop: 4 }}>{step.detail}</Paragraph>
                  </>
                ),
              }))}
            />
          ) : (
             <div 
              style={{ lineHeight: '1.8' }} 
              dangerouslySetInnerHTML={{ __html: procedure.content?.replace(/\n/g, '<br/>') }} 
            />
          )}
        </div>
      </div>

      {procedure.formUrl && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            size="large" 
            href={procedure.formUrl} 
            target="_blank"
          >
            Tải về biểu mẫu
          </Button>
        </div>
      )}
    </Modal>
  );
}
