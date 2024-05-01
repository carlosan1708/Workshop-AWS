import { generateS3PresignedUrl } from '@/pages/utils/awsHandler'

export default async function handler(req, res) {
  try {
    const { key } = req.query;
    const url = await generateS3PresignedUrl(key);
    res.status(200).send(url);
  } catch (error) {
    console.error('Error generating presigned url on S3:', error);
    res.status(500).json({ error: 'Error generating presigned url on S3' });
  }
}
  