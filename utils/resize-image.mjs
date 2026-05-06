#!/usr/bin/env node
/**
 * Usage:
 *   node utils/resize-image.mjs <input> [--width <w>] [--height <h>] [--out <output>] [--overwrite]
 *
 * If only one dimension is given the other scales proportionally.
 * Output defaults to <name>-<w>x<h>.<ext> next to the source file.
 * --overwrite replaces the original file in place.
 */

import sharp from "sharp";
import { resolve, parse, join } from "path";
import { readFile, writeFile, unlink } from "fs/promises";

function parseArgs(argv) {
  const args = {};
  let i = 0;
  while (i < argv.length) {
    if (argv[i] === "--width" || argv[i] === "-w") {
      args.width = parseInt(argv[++i], 10);
    } else if (argv[i] === "--height" || argv[i] === "-h") {
      args.height = parseInt(argv[++i], 10);
    } else if (argv[i] === "--out" || argv[i] === "-o") {
      args.out = argv[++i];
    } else if (argv[i] === "--overwrite") {
      args.overwrite = true;
    } else if (!args.input) {
      args.input = argv[i];
    }
    i++;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (!args.input) {
  console.error("Error: input file is required.");
  console.error(
    "Usage: node utils/resize-image.mjs <input> [--width <w>] [--height <h>] [--out <output>] [--overwrite]"
  );
  process.exit(1);
}

if (!args.width && !args.height) {
  console.error("Error: at least --width or --height is required.");
  process.exit(1);
}

const inputPath = resolve(args.input);
const parsed = parse(inputPath);

const w = args.width || null;
const h = args.height || null;

let outputPath;
if (args.overwrite) {
  outputPath = inputPath;
} else if (args.out) {
  outputPath = resolve(args.out);
} else {
  const defaultName = `${parsed.name}-${w ?? "auto"}x${h ?? "auto"}${parsed.ext}`;
  outputPath = join(parsed.dir, defaultName);
}

const meta = await sharp(inputPath).metadata();
console.log(`Input:  ${inputPath} (${meta.width}×${meta.height})`);

if (args.overwrite) {
  // sharp can't write to the same path it reads from — buffer first
  const buffer = await sharp(inputPath).resize(w, h, { fit: "fill" }).toBuffer();
  await writeFile(outputPath, buffer);
} else {
  await sharp(inputPath).resize(w, h, { fit: "fill" }).toFile(outputPath);
}

const outMeta = await sharp(outputPath).metadata();
console.log(`Output: ${outputPath} (${outMeta.width}×${outMeta.height})`);
