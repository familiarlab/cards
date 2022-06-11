
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCanvas, loadImage } from 'canvas';

import styles from './CardBuilder.module.scss';
import model from './model/1444-LOST-FOREVER-TWITTER.png';

function generate_card(file: any, image: any) {
  const messages = [
    ['Adopt a lost boy,', 'Keep him forever'],
    // ['123456789123456789'], // 19
    ['STILL LOST', 'GOT NO LISTINGS'],
    ['GET LOST','(with us)']
  ];
  const hashtag = [
    '#WAGBOY'
  ];
  const links = [
    ['Magic Eden', 'LOSTBOYCLUB'],
    ['Twitter', 'LOSTBOY_CLUB']
  ];

  const multiplier = 3;

  const base_font_size = 40;
  const font_size = base_font_size * multiplier;

  const base_height = 657 * multiplier;
  const base_width = 1200 * multiplier;

  const pfp_height = 488 * multiplier;
  const pfp_width = 488 * multiplier;

  const padding = (base_height - pfp_height) / 2;
  const column_two_x = padding + pfp_width;

  const canvas = createCanvas(base_width, base_height);
  const ctx = canvas.getContext('2d');

  // Draw Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, base_width, base_height);

  // Draw PFP
  ctx.drawImage(
    image,
    padding,
    padding,
    pfp_width,
    pfp_height
  );

  // Make Message
  const canvas_text_width = base_width - pfp_width - (padding * 3);
  const canvas_text_height = canvas_text_width * 0.7;
  const canvas_text = createCanvas(canvas_text_width, canvas_text_height);
  const ctx_text = canvas_text.getContext('2d');
  // ctx_text.fillStyle = 'cyan';
  // ctx_text.fillRect(0, 0, canvas_text_width, canvas_text_height);

  ctx_text.fillStyle = '#000000';
  ctx_text.font = `${font_size}px GothicA1Black`;
  ctx_text.textAlign = 'center';
  
  let cursor = 1;

  const lines_length = messages[1].length;
  const font_height_reducer = 15;

  const leading = font_size / 3 + font_height_reducer;
  const line_height = font_size - font_height_reducer;

  for (let i = 1; i <= lines_length; i++) {
    const height = (i == 1) ? line_height * cursor : line_height * cursor + leading;
    ctx_text.fillText(messages[1][i - 1], canvas_text_width / 2, height);
    cursor ++;
  }

  // Make Hashtag
  ctx_text.font = `${font_size * 0.7}px GothicA1Bold`;
  ctx_text.fillText(hashtag[0], canvas_text_width / 2, (font_size * 4) + leading);

  // Make Links
  const link_1_x = canvas_text_width / 2 - (canvas_text_width / 4);
  const link_2_x = canvas_text_width / 2 + (canvas_text_width / 4);

  ctx_text.font = `${font_size * 0.48}px GothicA1Bold`;
  ctx_text.fillText(links[0][0], link_1_x, (font_size * 6.6) + leading);
  ctx_text.fillText(links[1][0], link_2_x, (font_size * 6.6) + leading);

  const leading_modifier = 90;
  ctx_text.font = `${font_size * 0.48}px GothicA1Black`;
  ctx_text.fillText(links[0][1], link_1_x, (font_size * 6.6) + leading + leading_modifier);
  ctx_text.fillText(links[1][1], link_2_x, (font_size * 6.6) + leading + leading_modifier);

  // Paste Text
  const center_text_x = (column_two_x + (base_width - column_two_x) / 2) - (canvas_text_width / 2);
  const center_text_y = (base_height / 2) - (canvas_text_height / 2);

  ctx.drawImage(canvas_text, center_text_x, center_text_y, canvas_text_width, canvas_text_height);

  ctx.font = `${55}px GothicA1Bold`;
  ctx.fillStyle = '#000000';
  ctx.translate(190, base_height - padding);
  ctx.rotate(270 * Math.PI / 180);
  ctx.fillText('1444', 0, 0);
  ctx.restore();

  return canvas.toDataURL();
}

function CardBuilder() {
  const [paths, setPaths] = useState('');

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    console.log(file);

    const handle_async = async function() {
      let my_font_black = new FontFace('GothicA1Black', 'url(./Gothic_A1/GothicA1-Black.ttf)');
      let my_font_bold = new FontFace('GothicA1Bold', 'url(./Gothic_A1/GothicA1-Bold.ttf)');
      const font_black = await my_font_black.load();
      const font_bold = await my_font_bold.load();
      document.fonts.add(font_black);
      document.fonts.add(font_bold);
      const image = await loadImage(URL.createObjectURL(file))
      setPaths(generate_card(file, image));
    };

    handle_async();
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
      <br />
      <br />
      <img src={model} />
    </div>
  )
}

export default CardBuilder;
