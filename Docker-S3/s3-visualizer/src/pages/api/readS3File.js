import { readTxtFile } from '@/pages/utils/awsHandler'

export default async function handler(req, res) {
  try {
    const { key } = req.query;
    const fileContent = await readTxtFile(key);
    const str = await fileContent.Body?.transformToString();
    res.status(200).send(str);
  } catch (error) {
    console.error('Error reading file from S3:', error);
    res.status(500).json({ error: 'Error reading file from S3' });
  }
}
  