import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const SRC = 'C:/Users/Administrator/Downloads/ẢNH CHANG';
const OUT = path.resolve('public/images');

const jobs = [
  { src: 'Gemini_Generated_Image_7ji4mm7ji4mm7ji4.png', out: 'ceo-portrait.jpg', width: 900, height: 1125, fit: 'cover' },
  { src: 'FB_IMG_1782487668023.jpg', out: 'about-photo.jpg', width: 900, height: 1200, fit: 'cover' },
  { src: 'kakao.jpg', out: 'kakao-qr.png', width: 400, height: 400, fit: 'cover', format: 'png' },
  { src: 'FB_IMG_1767198642258.jpg', out: 'gallery-1.jpg', width: 1000, height: 1000, fit: 'cover' },
  { src: 'FB_IMG_1774618371330.jpg', out: 'gallery-2.jpg', width: 1000, height: 750, fit: 'cover' },
  { src: 'FB_IMG_1779196078123.jpg', out: 'gallery-3.jpg', width: 1000, height: 750, fit: 'cover' },
  { src: 'FB_IMG_1779977456515.jpg', out: 'gallery-4.jpg', width: 1000, height: 1000, fit: 'cover' },
  { src: 'FB_IMG_1779979835194.jpg', out: 'gallery-5.jpg', width: 1000, height: 750, fit: 'cover' },
  { src: 'FB_IMG_1779979275030.jpg', out: 'gallery-6.jpg', width: 1000, height: 750, fit: 'cover' },
];

fs.mkdirSync(OUT, { recursive: true });

for (const job of jobs) {
  const srcPath = path.join(SRC, job.src);
  const outPath = path.join(OUT, job.out);
  let pipeline = sharp(srcPath).resize(job.width, job.height, { fit: job.fit, position: 'attention' });
  pipeline = job.format === 'png' ? pipeline.png({ quality: 90 }) : pipeline.jpeg({ quality: 82, mozjpeg: true });
  await pipeline.toFile(outPath);
  const { size } = fs.statSync(outPath);
  console.log(`${job.out}: ${(size / 1024).toFixed(0)} KB`);
}
console.log('Done.');
