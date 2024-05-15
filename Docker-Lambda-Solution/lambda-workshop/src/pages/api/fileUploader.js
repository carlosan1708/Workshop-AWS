import { uploadToS3 } from '@/pages/utils/awsHandler'
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disabling the built-in body parser
  },
};


export default async function handler(req, res) {
  // parse a file upload
  const form = formidable({});
  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
    const imageFieldName = fields['filename'][0];
    const imageFile = files['file'][0];
    const data = fs.readFileSync(imageFile.filepath);
    const response = await uploadToS3(imageFieldName, data)
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: `Error on S3 ${err}` });
  }
}
