import path from 'path';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
// eslint-disable-next-line camelcase
import fluent_ffmpeg from 'fluent-ffmpeg';
import { OpenDialogReturnValue, dialog } from 'electron';
import createPathIfNotExists from './fileHelper';

// eslint-disable-next-line camelcase
fluent_ffmpeg.setFfmpegPath(ffmpeg.path);

export async function selectVideoFile(): Promise<string> {
  const { filePaths }: OpenDialogReturnValue = await dialog.showOpenDialog({
    title: 'Select Video File',
    properties: ['openFile'],
    filters: [{ name: 'Video Files', extensions: ['mp4', 'avi', 'mov'] }],
  });

  if (!filePaths || filePaths.length === 0) {
    console.log('User cancelled the dialog');
    return '';
  }

  return filePaths[0];
}

export async function selectPath(): Promise<string> {
  const { filePaths: outputPaths } = await dialog.showOpenDialog({
    title: 'Select Output Directory',
    properties: ['openDirectory'],
  });

  if (!outputPaths) {
    console.log('User cancelled the dialog');
    return '';
  }

  return outputPaths[0];
}

export function extractFrames(
  sourcePath: string,
  outputPath: string,
  skipFrames: number,
  callback: (progress: number) => void,
) {
  createPathIfNotExists(outputPath);

  const options: string[] = [];

  if (skipFrames > 0) {
    options.push(`-vf`);
    options.push(`select=not(mod(n\\,${skipFrames}))`);
    options.push(`-vsync vfr`);
    options.push(`-q:v 1`);
  } else {
    options.push(`-q:v 1`);
    options.push(`-vsync vfr`);
  }

  let totalTime: number;

  const command = fluent_ffmpeg(sourcePath)
    .outputOptions(options)
    .on('codecData', (data) => {
      totalTime = parseInt(data.duration.replace(/:/g, ''), 10);
    })
    .on('progress', (progress) => {
      const time = parseInt(progress.timemark.replace(/:/g, ''), 10);
      const percentage = (time / totalTime) * 100;
      callback(percentage);
    })
    .on('end', () => {
      console.log('Frame extraction complete');
    })
    .on('error', (err: Error) => {
      console.error('FFmpeg Error:', err.message);
    });

  command.saveToFile(path.join(outputPath, 'frame-%04d.jpg'));
}
