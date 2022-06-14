
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCanvas, loadImage } from 'canvas';

import data from '../../data/opendata.json';
import styles from './CardBuilder.module.scss';

import GetColor from './GetColor';

const domain = window.location.hostname.split('.')[0];
const project = (domain === 'localhost') ? 'lostboyclub' : domain;
const project_data = data.filter(x => {
  return x.key === project
});
const messages = project_data[0].messages;
const hashtags = project_data[0].hashtags;
const links = project_data[0].links;

function generate_card(file: any, image: any, message: any) {
  const filename = file.path.split('.')[0];

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

  const highlight = file.highlight;

  // Make Message
  const canvas_text_width = base_width - pfp_width - (padding * 3);
  const canvas_text_height = canvas_text_width * 0.7;
  const canvas_text = createCanvas(canvas_text_width, canvas_text_height);
  const ctx_text = canvas_text.getContext('2d');

  ctx_text.fillStyle = '#000000';
  ctx_text.font = `${font_size}px GothicA1Black`;
  ctx_text.textAlign = 'center';

  let cursor = 1;

  const lines_length = message.length;
  const font_height_reducer = 15;

  const leading = font_size / 3 + font_height_reducer;
  const line_height = font_size - font_height_reducer;

  for (let i = 1; i <= lines_length; i++) {
    const height = (i == 1) ? line_height * cursor : line_height * cursor + leading;
    ctx_text.fillText(message[i - 1], canvas_text_width / 2, height);
    cursor ++;
  }

  // Make hashtags
  ctx_text.font = `${font_size * 0.7}px GothicA1Bold`;
  ctx_text.fillText(hashtags[0], canvas_text_width / 2, (font_size * 4) + leading);

  // Make Links
  const link_1_x = canvas_text_width / 2 - (canvas_text_width / 4);
  const link_2_x = canvas_text_width / 2 + (canvas_text_width / 4);

  ctx_text.font = `${font_size * 0.48}px GothicA1Bold`;
  ctx_text.fillText(links[0][0], link_1_x, (font_size * 6.6) + leading);
  ctx_text.fillText(links[1][0], link_2_x, (font_size * 6.6) + leading);

  const leading_modifier = 90;
  ctx_text.font = `${font_size * 0.48}px GothicA1Black`;

  ctx_text.fillStyle = highlight;
  ctx_text.fillText(links[0][1], link_1_x, (font_size * 6.6) + leading + leading_modifier);
  ctx_text.fillText(links[1][1], link_2_x, (font_size * 6.6) + leading + leading_modifier);

  // Paste Text
  const center_text_x = (column_two_x + (base_width - column_two_x) / 2) - (canvas_text_width / 2);
  const center_text_y = (base_height / 2) - (canvas_text_height / 2);

  ctx.drawImage(canvas_text, center_text_x, center_text_y, canvas_text_width, canvas_text_height);

  ctx.font = `${font_size * 0.48}px GothicA1Bold`;
  ctx.fillStyle = highlight;
  ctx.translate(190, base_height - padding);
  ctx.rotate(270 * Math.PI / 180);
  ctx.fillText(filename, 0, 0);
  ctx.restore();

  return canvas.toDataURL();
}

function CardBuilder() {
  const [paths, setPaths] = useState('');
  const [highlight, setHighlight] = useState('');
  const [rgb, setRgb] = useState({ r: 0, g: 255, b: 255, a: 1 });
  const [color, setColor] = useState({ r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a });
  const [showPicker, setShowPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(messages[0]);

  const handle_file = async function(file: any, message: any) {
    if (!file) {
      return null;
    }
    let my_font_black = new FontFace('GothicA1Black', 'url(./Gothic_A1/GothicA1-Black.ttf)');
    let my_font_bold = new FontFace('GothicA1Bold', 'url(./Gothic_A1/GothicA1-Bold.ttf)');
    const font_black = await my_font_black.load();
    const font_bold = await my_font_bold.load();
    document.fonts.add(font_black);
    document.fonts.add(font_bold);

    const image = await loadImage(URL.createObjectURL(file));
    const canvas = createCanvas(1, 1);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, 488, 488);
    const color = context.getImageData(0, 0, 1, 1).data;
    let r = color[0];
    let g = color[1];
    let b = color[2];
    let a = 1;
    const dominant_color = `rgba(${r}, ${g}, ${b})`;
    const light_or_dark = GetColor.light_dark(dominant_color);
    let highlight = dominant_color;
    if (light_or_dark == 'light') {
      const darken = 25;
      const boost_saturation = 0.75;
      const sat = GetColor.saturation([r - darken, g - darken, b - darken], boost_saturation);
      r = sat[0];
      g = sat[1];
      b = sat[2];
      a = 1;
      highlight = `rgba(${r}, ${g}, ${b})`;
    }
    setRgb({ r, g, b, a });
    setHighlight(highlight);
    file.highlight = highlight;

    setPaths(generate_card(file, image, message));
  };

  // Prepare Dropzone

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    setFile(file);
  }, [file]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop
  });

  // Watch for changes; regenerate

  useEffect(() => {
    handle_file(file, message)
  }, [file, message]);


  // Handle template changes

  const isReady = (paths.length > 0);

  const color_button_style = {
    backgroundColor: (highlight.length > 0) ? highlight : ''
  };
  const dropzone_style = {
    background: (isReady) ? 'none' : '',
  };
  const image_style = {
    opacity: (isDragActive) ? '30%' : ''
  };
  const tag_style = {};
  // const tag_style = {
  //   background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a}`
  // };
  const prompt_style = {
    color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a}`
  };

  return (
    <div className={styles.CardBuilder}>
      <div {...getRootProps()} className={styles.DropZone} style={dropzone_style}>
        <div>
          <input {...getInputProps()} />
          {
            isReady ? <img style={image_style} src={paths} /> : <span />
          }
          {
            (x => {
              let z = null;
              if (!isReady) {
                z = (isDragActive) ?
                  <span>Drag lookin' good</span> :
                  <span>Drag Image or Tap</span>;
              }

              return z
            })()
          }
          <div className={styles.ButtonContainer}>
          {
            isReady ? messages.map((x, i) => {
              return (
                <button onClick={(e: React.ChangeEvent<any>) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setMessage(messages[i]);
                }} key={i}>
                  {i + 1}
                </button>
              );
            }) : null
          }
          </div>
        </div>
      </div>
      <h1 style={tag_style}>
        <span>Built by </span>
        <a href="https://twitter.com/familiarbot">@familiarbot</a>
      </h1>
    </div>
  )
}

export default CardBuilder;
