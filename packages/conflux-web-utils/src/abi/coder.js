/* eslint-disable no-use-before-define */

const lodash = require('lodash');
const BigNumber = require('bignumber.js');
const { Hex, Address } = require('../type');
const { BYTE_BITS, WORD_BYTES, padBuffer, assert } = require('./utils');
const namedTuple = require('./namedTuple');

// ----------------------------------------------------------------------------
class Pointer extends Number {}

/**
 * @param coders {Coder[]}
 * @param array {array}
 * @return {Buffer}
 */
function pack(coders, array) {
  let offset = 0;
  const staticList = [];
  const dynamicList = [];

  lodash.zip(coders, array)
    .forEach(([coder, value]) => {
      const buffer = coder.encode(value);

      if (coder.dynamic) {
        offset += WORD_BYTES;
        staticList.push(new Pointer(dynamicList.length)); // push index of dynamic to static
        dynamicList.push(buffer);
      } else {
        offset += buffer.length;
        staticList.push(buffer);
      }
    });

  // write back the dynamic address
  staticList.forEach((pointer, index) => {
    if (pointer instanceof Pointer) {
      staticList[index] = UINT_CODER.encode(offset);
      offset += dynamicList[pointer].length;
    }
  });

  return Buffer.concat([...staticList, ...dynamicList]);
}

/**
 *
 * @param coders {Coder[]}
 * @param stream {HexStream}
 * @return {array}
 */
function unpack(coders, stream) {
  const startIndex = stream.index;

  const array = coders.map((coder) => {
    if (coder.dynamic) {
      const offset = UINT_CODER.decode(stream).toNumber();
      return new Pointer(startIndex + offset);
    } else {
      return coder.decode(stream);
    }
  });

  lodash.zip(coders, array)
    .forEach(([coder, value], index) => {
      if (value instanceof Pointer) {
        assert(Number(value) === stream.index, {
          message: 'stream.index error',
          expect: value,
          got: stream.index,
          coder,
          stream,
        });

        array[index] = coder.decode(stream);
      }
    });

  return array;
}

// ============================================================================
class Coder {
  static from(component) {} // eslint-disable-line no-unused-vars

  constructor({ type, name }) {
    this.type = type;
    this.name = name;
    this.dynamic = false;
  }

  /**
   * @return {Buffer}
   */
  encode(value) {} // eslint-disable-line no-unused-vars

  /**
   * @param stream {HexStream}
   * @return {*}
   */
  decode(stream) {} // eslint-disable-line no-unused-vars
}

class NullCoder extends Coder {
  static from({ type, name }) {
    if (type !== '') {
      return undefined;
    }
    return new this({ name, type: 'null' });
  }

  /**
   * @param value {null}
   * @return {Buffer}
   */
  encode(value) {
    assert(value === null, {
      message: 'unexpected type',
      expect: null,
      got: value,
      coder: this,
    });

    return Buffer.from('');
  }

  /**
   * @return {null}
   */
  decode() {
    return null;
  }
}

class BoolCoder extends Coder {
  static from({ type, name }) {
    if (type !== 'bool') {
      return undefined;
    }
    return new this({ type, name });
  }

  /**
   * @param value {*}
   * @return {Buffer}
   */
  encode(value) {
    return padBuffer(Hex(value ? 1 : 0));
  }

  /**
   * @param stream {HexStream}
   * @return {boolean}
   */
  decode(stream) {
    return !UINT_CODER.decode(stream).isZero();
  }
}

class AddressCoder extends Coder {
  static from({ type, name }) {
    if (type !== 'address') {
      return undefined;
    }
    return new this({ type, name });
  }

  /**
   * @param address {string}
   * @return {Buffer}
   */
  encode(address) {
    return padBuffer(Address(address));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    return Address(stream.read(20));
  }
}

class NumberCoder extends Coder {
  static from({ type, name }) {
    const match = type.match(/^(u?int)([0-9]*)$/);
    if (!match) {
      return undefined;
    }

    const [, label, bits] = match;
    return new this({
      name,
      signed: !label.startsWith('u'),
      size: bits ? parseInt(bits, 10) / BYTE_BITS : undefined,
    });
  }

  constructor({ name, signed = false, size = WORD_BYTES } = {}) {
    assert(Number.isInteger(size) && size <= WORD_BYTES, {
      message: 'invalid number size',
      expect: `integer && <=${WORD_BYTES}`,
      got: size,
      coder: { name, signed },
    });

    super({ name, type: `${signed ? '' : 'u'}int${size * BYTE_BITS}` });
    this.signed = signed;
    this.size = size;
  }

  get _bound() {
    return BigNumber(2).pow(this.size * BYTE_BITS - (this.signed ? 1 : 0));
  }

  /**
   * @param value {number|BigNumber|string}
   * @return {Buffer}
   */
  encode(value) {
    const bound = this._bound; // for call `getter` only once

    let number = BigNumber(value);
    let twosComplement = number;

    if (this.signed && number.lt(0)) {
      twosComplement = number.plus(bound);
      number = number.plus(BigNumber(2).pow(WORD_BYTES * BYTE_BITS));
    }

    assert(twosComplement.gte(0) && twosComplement.lt(bound), {
      message: 'bound error',
      expect: `0<= && <${bound}`,
      got: twosComplement,
      coder: this,
      value,
    });

    return padBuffer(Hex(number));
  }

  /**
   * @param stream {HexStream}
   * @return {BigNumber}
   */
  decode(stream) {
    const bound = this._bound; // for call `getter` only once

    let value = BigNumber(stream.read(this.size), 16); // 16: hex base

    if (this.signed && value.gte(bound)) {
      value = value.minus(BigNumber(2).pow(this.size * BYTE_BITS));
    }

    return value;
  }
}

class BytesCoder extends Coder {
  static from({ type, name }) {
    const match = type.match(/^bytes([0-9]*)$/);
    if (!match) {
      return undefined;
    }

    const [, size] = match;
    return new this({
      name,
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  constructor({ name, size }) {
    if (size !== undefined) {
      assert(Number.isInteger(size) && size <= WORD_BYTES, {
        message: 'invalid number size',
        expect: `integer && <=${WORD_BYTES}`,
        got: size,
        coder: { name },
      });
    }

    super({ name, type: `bytes${size > 0 ? size : ''}` });
    this.size = size;
    this.dynamic = Boolean(size === undefined);
  }

  /**
   * @param array {ArrayLike}
   * @return {Buffer}
   */
  encode(array) {
    if (this.size !== undefined) {
      assert(array.length === this.size, {
        message: 'length not match',
        expect: this.size,
        got: array.length,
        coder: this,
      });
    }

    let buffer = padBuffer(Buffer.from(array), true);
    if (this.size === undefined) {
      buffer = Buffer.concat([UINT_CODER.encode(array.length), buffer]);
    }
    return buffer;
  }

  /**
   * @param stream {HexStream}
   * @return {Buffer}
   */
  decode(stream) {
    let length = this.size;
    if (length === undefined) {
      length = UINT_CODER.decode(stream).toNumber();
    }

    return Buffer.from(stream.read(length, true), 'hex');
  }
}

class StringCoder extends BytesCoder {
  static from({ type, name }) {
    if (type !== 'string') {
      return undefined;
    }
    return new this({ type, name });
  }

  constructor({ type, name }) {
    super({ name, size: undefined });
    this.type = type;
  }

  /**
   * @param value {string} - string in utf8
   * @return {Buffer}
   */
  encode(value) {
    return super.encode(Buffer.from(value, 'utf8'));
  }

  /**
   * @param stream {HexStream}
   * @return {string}
   */
  decode(stream) {
    const bytes = super.decode(stream);
    return bytes.toString('utf8');
  }
}

class ArrayCoder extends Coder {
  static from({ type, name }) {
    const match = type.match(/^(.*)\[([0-9]*)]$/);
    if (!match) {
      return undefined;
    }

    const [, subType, size] = match;
    return new this({
      name,
      coder: getCoder({ type: subType }),
      size: size ? parseInt(size, 10) : undefined,
    });
  }

  constructor({ name, coder, size }) {
    if (size !== undefined) {
      assert(Number.isInteger(size) && 0 < size, {
        message: 'invalid number size',
        expect: 'integer && >0',
        got: size,
        coder: { name },
      });
    }

    super({ name, type: `${coder.type}[${size > 0 ? size : ''}]` });

    this.size = size;
    this.coder = coder;
    this.dynamic = Boolean(size === undefined) || coder.dynamic;
  }

  /**
   * @param array {array}
   * @return {Buffer}
   */
  encode(array) {
    assert(Array.isArray(array), {
      message: 'unexpected type',
      expect: 'array',
      got: typeof array,
      coder: this,
    });

    if (this.size !== undefined) {
      assert(array.length === this.size, {
        message: 'length not match',
        expect: this.size,
        got: array.length,
        coder: this,
      });
    }

    const coders = lodash.range(array.length).map(() => this.coder);
    let buffer = pack(coders, array);
    if (this.size === undefined) {
      buffer = Buffer.concat([UINT_CODER.encode(array.length), buffer]);
    }
    return buffer;
  }

  /**
   * @param stream {HexStream}
   * @return {array}
   */
  decode(stream) {
    let length = this.size;

    if (length === undefined) {
      length = UINT_CODER.decode(stream).toNumber();
    }

    const coders = lodash.range(length).map(() => this.coder);
    return unpack(coders, stream);
  }
}

class TupleCoder extends Coder {
  static from({ type, name, components }) {
    if (!type.startsWith('tuple')) {
      return undefined;
    }
    return new this({ name, coders: components.map(getCoder) });
  }

  constructor({ name, coders }) {
    super({ name, type: `(${coders.map(coder => coder.type).join(',')})` });
    this.size = coders.length;
    this.coders = coders;
    this.dynamic = lodash.some(coders, coder => coder.dynamic);
    this.names = coders.map((coder, index) => coder.name || `${index}`);
    this.NamedTuple = namedTuple(...this.names);
  }

  /**
   * @param array {array}
   * @return {Buffer}
   */
  encode(array) {
    if (lodash.isPlainObject(array)) {
      array = this.NamedTuple.fromObject(array);
    }

    assert(Array.isArray(array), {
      message: 'unexpected type',
      expect: 'array',
      got: typeof array,
      coder: this,
    });

    assert(array.length === this.size, {
      message: 'length not match',
      expect: this.size,
      got: array.length,
      coder: this,
    });

    return pack(this.coders, array);
  }

  /**
   * @param stream {HexStream}
   * @return {NamedTuple}
   */
  decode(stream) {
    const array = unpack(this.coders, stream);
    return new this.NamedTuple(...array);
  }
}

// ----------------------------------------------------------------------------
const UINT_CODER = new NumberCoder();

/**
 * Get coder by abi component.
 *
 * @param component {object}
 * @param component.type {string}
 * @param [component.name] {string}
 * @param [component.components] {array} - For TupleCoder
 * @return {Coder}
 */
function getCoder(component) {
  // sorted by probability
  const coder = TupleCoder.from(component)
    || AddressCoder.from(component)
    || NumberCoder.from(component)
    || StringCoder.from(component)
    || BytesCoder.from(component)
    || ArrayCoder.from(component)
    || BoolCoder.from(component)
    || NullCoder.from(component);

  assert(coder instanceof Coder, {
    message: 'can not found matched coder',
    component,
  });

  return coder;
}

module.exports = getCoder;
