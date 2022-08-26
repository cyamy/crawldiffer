import fs from 'fs-extra';
import { PNG } from 'pngjs';
import { readFileSync } from 'fs';
import sharp from 'sharp';

const targets = JSON.parse(fs.readFileSync('config.json', 'utf-8')).targets as {
  title: string;
  local: string;
  testUp: string;
}[];

const imagePath = 'screenshot';

const resizeImage = (
  input: string,
  output: string,
  width: number,
  height: number,
) => {
  sharp(input)
    .resize(width, height, {})
    .toFile(output, (err) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err);
    });
};

const forceDiffSetup = (
  targets: {
    title: string;
    local: string;
    testUp: string;
  }[],
) => {
  targets.forEach((current) => {
    const currentPath = imagePath + '/' + current.title;
    const local = PNG.sync.read(readFileSync(currentPath + '/' + 'local.png'));
    const testUp = PNG.sync.read(
      readFileSync(currentPath + '/' + 'testUp.png'),
    );

    const { width, height } = testUp;

    if (height !== local.height) {
      const file = currentPath + '/' + 'local.png';
      const resize = currentPath + '/' + 'local-resize.png';

      resizeImage(file, resize, width, height);
    }
  });
};

forceDiffSetup(targets);