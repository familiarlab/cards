import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCanvas, loadImage } from 'canvas';

import styles from './CardBuilder.module.scss';

function generate_card() {
  const multiplier = 2;
  const font_size = 30;

  const canvas_height = 675;
  const canvas_width = 1200;
  const canvas = createCanvas(canvas_width, canvas_height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas_width * multiplier, canvas_height * multiplier);
  ctx.fillStyle = '#000000';
  ctx.font = `${font_size * multiplier}px GothicA1`;
  ctx.fillText('Lorem Ipsum', 50 * multiplier, (50 + font_size) * multiplier);

  // ctx.drawImage(image, 212, 213, 95, 95);
  return canvas.toDataURL();
}

function CardBuilder() {
  const [paths, setPaths] = useState('');

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    // setPaths(acceptedFiles.map((file: any) => URL.createObjectURL(file)));

    let myFont = new FontFace('GothicA1', 'url(./Gothic_A1/GothicA1-Black.ttf)');
    myFont.load().then((font) => {
      document.fonts.add(font);
      setPaths(generate_card());
    });
  }, [setPaths]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  const isReady = (paths.length > 0);

  return (
    <div className={styles.CardBuilder}>
      <div {...getRootProps()} className={styles.DropZone}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <span>Drag is lookin' good</span> :
            <span>Drag Image or Tap Open</span>
        }
      </div>
      {
        isReady ? <img src={paths} /> : <span />
      }
    </div>
  )
}

export default CardBuilder;
