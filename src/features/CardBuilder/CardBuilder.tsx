import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCanvas, loadImage } from 'canvas';

function generate_card() {
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, 500);
  ctx.fillStyle = '#000000';
  ctx.font = '30px GothicA1';
  ctx.fillText('Lorem Ipsum', 10, 50);

  // ctx.drawImage(image, 212, 213, 95, 95);
  return canvas.toDataURL();
}

function CardBuilder() {
  // const height = 2025;
  // const width = 3600;
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

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Looking Good!</p> :
          <p>Drag your PFP image here, or tap to open</p>
      }
      <img src={paths} />
    </div>
  )
}

export default CardBuilder;
