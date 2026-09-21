import fs from 'node:fs/promises';

const fonts = [
  ['dm-sans', 'dmsans', 'DMSans%5Bopsz%2Cwght%5D.ttf'],
  ['manrope', 'manrope', 'Manrope%5Bwght%5D.ttf']
];
await fs.mkdir('dist/assets/fonts', { recursive: true });
for (const [name, directory, filename] of fonts) {
  const base = `https://raw.githubusercontent.com/google/fonts/main/ofl/${directory}/`;
  const responses = await Promise.all([fetch(base + filename), fetch(base + 'OFL.txt')]);
  if (responses.some(response => !response.ok)) throw Error(`Font download failed: ${name}`);
  const font = Buffer.from(await responses[0].arrayBuffer());
  let variableTable = -1;
  for (let i = 0; i < font.readUInt16BE(4); i++) {
    const table = 12 + i * 16;
    if (font.toString('ascii', table, table + 4) === 'fvar') variableTable = font.readUInt32BE(table + 8);
  }
  if (variableTable < 0) throw Error(`Expected a variable font: ${name}`);
  const start = variableTable + font.readUInt16BE(variableTable + 4);
  const count = font.readUInt16BE(variableTable + 8);
  const size = font.readUInt16BE(variableTable + 10);
  let weightRange;
  for (let i = 0; i < count; i++) {
    const axis = start + i * size;
    if (font.toString('ascii', axis, axis + 4) === 'wght') {
      weightRange = [font.readInt32BE(axis + 4) / 65536, font.readInt32BE(axis + 12) / 65536];
    }
  }
  if (!weightRange || weightRange[0] > 400 || weightRange[1] < 600) throw Error(`Missing required weights: ${name}`);
  await fs.writeFile(`dist/assets/fonts/${name}-variable.ttf`, font);
  await fs.writeFile(`dist/assets/fonts/${name}-OFL.txt`, await responses[1].text());
  console.log(`${name}: verified variable weights ${weightRange.join('–')}`);
}
