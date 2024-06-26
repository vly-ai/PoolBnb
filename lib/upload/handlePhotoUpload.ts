import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

const handlePhotoUpload = (req: NextApiRequest, res: NextApiResponse, callback: (files: formidable.Files) => void): void => {
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = './public/uploads';
  form.keepExtensions = true;

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir);
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: 'File upload failed' });
      return;
    }
    callback(files);
  });
};

export default handlePhotoUpload;