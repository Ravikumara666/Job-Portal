import express from 'express';
import path from 'path';

import { uploadImage } from '../middleware/MultirPro'; // Your multer config

dotenv.config();
const router = express.Router();

// Cloudinary configuration



// Upload route

    console.log("ITS COMING HERE")

    // Optional: delete local file after successful upload
    fs.unlinkSync(localFilePath);

    // Generate optimized and cropped URLs
    const optimizedUrl = cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
    });
    console.log(optimizedUrl)

    const croppedUrl = cloudinary.url(publicId, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    res.json({
      message: 'Image uploaded successfully',
      cloudinaryUrl: result.secure_url,
      optimizedUrl,
      croppedUrl,
    });

  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
