const csv = require('csv-parser')
const fs = require('fs')
const results = [];

// fs.createReadStream('whitelist.csv')
//   .pipe(csv())
//   .on('data', (data) => results.push(data))
//   .on('end', () => {
//       console.log(results[0])
//       for(const result of results) {
//           console.log(result.Address)
//       }
//   });

// import assert from 'assert';
// import { parse } from 'csv-parse/sync';

// const input = `
// "key_1","key_2"
// "value 1","value 2"
// `;
// const records = parse(input, {
//   columns: true,
//   skip_empty_lines: true
// });
// assert.deepStrictEqual(
//   records,
//   [{ key_1: 'value 1', key_2: 'value 2' }]
// );