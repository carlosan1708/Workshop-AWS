import { listObjects } from '@/pages/utils/awsHandler'

export default async function handler(req, res) {
  try {
    const files = await listObjects();
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files from S3:', error);
    res.status(500).json({ error: 'Error fetching files from S3' });
  }
}
