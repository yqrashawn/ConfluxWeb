const { Hex } = require('conflux-web-utils/src/type');
const parse = require('../src/utils/parse');

test('parse.boolean', () => {
  expect(parse.boolean(undefined)).toEqual(false);

  expect(parse.boolean(true)).toEqual(true);
  expect(parse.boolean(1)).toEqual(true);
  expect(parse.boolean('1')).toEqual(true);

  expect(parse.boolean(false)).toEqual(false);
  expect(parse.boolean(0)).toEqual(false);
  expect(parse.boolean('0')).toEqual(false);

  // XXX: this quality let user must check `null` before `boolean`.
  expect(parse.boolean(null)).toEqual(false);
});

test('coincident to parse hex array with only one element to hex string', () => {
  const parser = parse(Hex).or(parse([Hex]));

  expect(parser('0xab')).toEqual('0xab');
  expect(parser(['0xab', '0xcd'])).toEqual(['0xab', '0xcd']);

  // XXX: cause parse Hex(['0xab']) will trigger Hex(`${['0xab']}`) and `${['0xab']}` === '0xab' coincident
  expect(parser(['0xab'])).toEqual('0xab');
});
