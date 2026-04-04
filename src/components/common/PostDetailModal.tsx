"use client";
import { Modal, Typography, Divider, Image } from 'antd';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

interface PostData {
  id?: number;
  title: string;
  summary: string;
  content: string;
  thumbnail?: string;
  author?: string;
  publishedAt?: string | Date;
}

interface PostDetailModalProps {
  post: PostData | null;
  open: boolean;
  onClose: () => void;
}

export default function PostDetailModal({ post, open, onClose }: PostDetailModalProps) {
  if (!post) return null;

  const defaultImage = "https://vnanet.vn/Data/Images/logo.png"; // Using the system logo as default or similar

  return (
    <Modal
      title={post.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px 40px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Image
          src={post.thumbnail || defaultImage}
          alt={post.title}
          style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
          fallback={defaultImage}
        />
      </div>

      <Title level={2}>{post.title}</Title>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 20 }}>
        <Text type="secondary">Tác giả: <strong>{post.author || "Ban biên tập"}</strong></Text>
        <Text type="secondary">Ngày đăng: {post.publishedAt ? dayjs(post.publishedAt).format('DD/MM/YYYY HH:mm') : '---'}</Text>
      </div>

      <Divider />

      <Typography>
        <Paragraph style={{ fontSize: 16, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {/* We use whiteSpace: 'pre-wrap' to handle line breaks if it's plain text, 
              or we can use dangerouslySetInnerHTML if it's HTML */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        </Paragraph>
      </Typography>
    </Modal>
  );
}
