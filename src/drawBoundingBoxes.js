const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function drawBoundingBoxes(imagePath, boundingBoxesPath, outputImagePath) {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(image, 0, 0);
  
    const boundingBoxes = JSON.parse(fs.readFileSync(boundingBoxesPath));
  
    boundingBoxes.forEach(box => {
        let allowed = [
            'link',
            'a',
            'button',
            'input',
        ]
        if(!allowed.includes(box.tagName)){
            return;
        }
  
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  
    const out = fs.createWriteStream(outputImagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created.'));
  }
  
  module.exports = drawBoundingBoxes;
  