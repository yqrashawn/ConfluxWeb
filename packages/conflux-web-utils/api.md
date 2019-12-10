
----------
# abi

## FunctionCoder.constructor

Function coder

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------
name    | string | true     |         |
inputs  | array  | false    |         |
outputs | array  | false    |         |

### Return

`void`

### Example

```
> abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
> coder = new FunctionCoder(abi)
   FunctionCoder {
      name: 'func',
      inputs: [ { type: 'int' }, { type: 'bool' } ],
      outputs: [ { type: 'int' } ],
      type: 'func(int256,bool)'
    }
```

## EventCoder.constructor

Event coder

### Parameters

Name      | Type    | Required | Default | Description
----------|---------|----------|---------|------------
anonymous | boolean | true     |         |
name      | string  | true     |         |
inputs    | array   | true     |         |

### Return

`void`

### Example

```
> abi = {
    name: 'EventName',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        name: 'number',
        type: 'uint',
      },
    ],
   }
> coder = new EventCoder(abi)
   EventCoder {
      anonymous: false,
      name: 'EventName',
      inputs: [
        { indexed: true, name: 'account', type: 'address' },
        { indexed: false, name: 'number', type: 'uint' }
      ],
      type: 'EventName(address,uint256)',
      NamedTuple: [Function: NamedTuple(account,number)]
    }
```

## FunctionCoder.signature

Get function signature by abi (json interface)

### Parameters

`void`

### Return

`string` 

### Example

```
> abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
> coder = new FunctionCoder(abi)
> coder.signature()
   "0x360ff942"
```

## FunctionCoder.encodeInputs

Get function signature by abi (json interface)

### Parameters

Name  | Type  | Required | Default | Description
------|-------|----------|---------|------------
array | array | true     |         |

### Return

`string` 

### Example

```
> abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
> coder = new FunctionCoder(abi)
> coder.encodeInputs([100, true])
   "0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001"
```

## FunctionCoder.decodeInputs

Decode hex with inputs by abi (json interface)

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|------------
hex  | string | true     |         | Hex string

### Return

`array` NamedTuple

### Example

```
> abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
> coder = new FunctionCoder(abi)
> result = coder.decodeInputs('0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001')
   NamedTuple(0,1) [ BigNumber { s: 1, e: 2, c: [ 100 ] }, true ]
> console.log([...result])
   [100, true]
> console.log(result[0])
   100
> console.log(result[1])
   true
```

## FunctionCoder.decodeOutputs

Decode hex with outputs by abi (json interface)

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|------------
hex  | string | true     |         | Hex string

### Return

`array` NamedTuple

### Example

```
> abi = { name: 'func', inputs: [{ type: 'int' }, { type: 'bool' }], outputs: [{ type: 'int' }] }
> coder = new FunctionCoder(abi)
> result = coder.decodeOutputs('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
   NamedTuple(0) [ BigNumber { s: -1, e: 0, c: [ 1 ] } ]
> console.log([...result])
   [-1]
> console.log(result[0])
   -1
```

## EventCoder.signature

Get function signature by abi (json interface)

### Parameters

`void`

### Return

`string` 

### Example

```
> coder = new EventCoder(abi)
> coder.signature()
   "0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7"
```

## EventCoder.encodeInputByIndex

Encode input by index

### Parameters

Name  | Type   | Required | Default | Description
------|--------|----------|---------|------------
value | any    | true     |         |
index | number | true     |         |

### Return

`string` 

### Example

```
> coder = new EventCoder(abi)
> coder.encodeInputByIndex('0x123456789012345678901234567890123456789', 0)
   "0x0000000000000000000000000123456789012345678901234567890123456789"
> coder.encodeInputByIndex(10, 1)
   "0x000000000000000000000000000000000000000000000000000000000000000a"
```

## EventCoder.decodeLog

Decode log

### Parameters

Name   | Type   | Required | Default | Description
-------|--------|----------|---------|-------------------
topics | array  | true     |         | Array of hex sting
data   | string | true     |         | Hex string

### Return

`array` NamedTuple

### Example

```
> coder = new EventCoder(abi)
> result = coder.decodeLog({
      data: '0x000000000000000000000000000000000000000000000000000000000000000a',
      topics: [
        '0xb0333e0e3a6b99318e4e2e0d7e5e5f93646f9cbf62da1587955a4092bf7df6e7',
        '0x0000000000000000000000000123456789012345678901234567890123456789',
      ],
    })
   NamedTuple(account,number) ['0x0123456789012345678901234567890123456789',BigNumber { s: 1, e: 1, c: [ 10 ] }]
> console.log([...result])
   [0x0123456789012345678901234567890123456789, 10]
> console.log(result.account) // `account` a field name in abi
   "0x0123456789012345678901234567890123456789"
> console.log(result.number) // `number` a field name in abi
   10
```

----------
# sign




## sign.sha3

sha3

### Parameters

Name   | Type   | Required | Default | Description
-------|--------|----------|---------|------------
buffer | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> sha3(Buffer.from(''))
 <Buffer c5 d2 46 01 86 f7 23 3c 92 7e 7d b2 dc c7 03 c0 e5 00 b6 53 ca 82 27 3b 7b fa d8 04 5d 85 a4 70>
```

## sign.rlpEncode

rlp encode

> replace zero as empty

### Parameters

Name  | Type           | Required | Default | Description
------|----------------|----------|---------|------------
array | Array.<Buffer> | true     |         |

### Return

`Buffer` 

### Example

```
> rlpEncode([0, 1, 2].map(v => Buffer.from([v])))
 <Buffer c3 80 01 02>
> rlpEncode([1, 2].map(v => Buffer.from([v])))
 <Buffer c3 80 01 02>
```

## sign.randomBuffer

gen a random buffer with `size` bytes.

> Note: call `crypto.randomBytes`

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|------------
size | number | true     |         |

### Return

`Buffer` 

### Example

```
> randomBuffer(0)
 <Buffer >
> randomBuffer(1)
 <Buffer 33>
> randomBuffer(1)
 <Buffer 5a>
```

## sign.randomPrivateKey

Gen a random PrivateKey buffer.

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|------------
entropy | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> randomPrivateKey()
 <Buffer 23 fb 3b 2b 1f c9 36 8c a4 8e 5b dc c7 a9 e2 bd 67 81 43 3b f2 3a cc da da ff a9 dd dd b6 08 d4>
> randomPrivateKey()
 <Buffer e7 5b 68 fb f9 50 19 94 07 80 d5 13 2e 40 a7 f9 a1 b0 5d 72 c8 86 ca d1 c6 59 cd a6 bf 37 cb 73>
```

```
> entropy = randomBuffer(32)
> randomPrivateKey(entropy)
 <Buffer 57 90 e8 3d 16 10 02 b9 a4 33 87 e1 6b cd 40 7e f7 22 b1 d8 94 ae 98 bf 76 a4 56 fb b6 0c 4b 4a>
> randomPrivateKey(entropy) // same `entropy`
 <Buffer 89 44 ef 31 d4 9c d0 25 9f b0 de 61 99 12 4a 21 57 43 d4 4b af ae ef ae e1 3a ba 05 c3 e6 ad 21>
```

## sign.publicKeyToAddress

Get address by public key.

### Parameters

Name      | Type   | Required | Default | Description
----------|--------|----------|---------|------------
publicKey | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 4c 6f a3 22 12 5f a3 1a 42 cb dd a8 73 0d 4c f0 20 0d 72 db>
```

## sign.privateKeyToAddress

Get address by private key.

### Parameters

Name       | Type   | Required | Default | Description
-----------|--------|----------|---------|------------
privateKey | Buffer | true     |         |

### Return

`Buffer` 

### Example

```
> privateKeyToAddress(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

## sign.ecdsaSign

Sign ecdsa

### Parameters

Name       | Type   | Required | Default | Description
-----------|--------|----------|---------|------------
hash       | Buffer | true     |         |
privateKey | Buffer | true     |         |

### Return

`object` ECDSA signature object.
- r {Buffer}
- s {Buffer}
- v {number}

### Example

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]);
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> ecdsaSign(buffer32, privateKey)
 {
  r: <Buffer 21 ab b4 c3 fd 51 75 81 e6 c7 e7 e0 7f 40 4f a2 2c ba 8d 8f 71 27 0b 29 58 42 b8 3c 44 b5 a4 c6>,
  s: <Buffer 08 59 7b 69 8f 8f 3c c2 ba 0b 45 ee a7 7f 55 29 ad f9 5c a5 51 41 e7 9b 56 53 77 3d 00 5d 18 58>,
  v: 0
 }
```

## sign.ecdsaRecover

Recover ecdsa

### Parameters

Name      | Type   | Required | Default | Description
----------|--------|----------|---------|------------
hash      | Buffer | true     |         |
options   | object | true     |         |
options.r | Buffer | true     |         |
options.s | Buffer | true     |         |
options.v | number | true     |         |

### Return

`Buffer` publicKey

### Example

```
> privateKey = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1])
> buffer32 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])
> privateKeyToAddress(privateKey)
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
> publicKeyToAddress(ecdsaRecover(buffer32, ecdsaSign(buffer32, privateKey)))
 <Buffer 0d b9 e0 02 85 67 52 28 8b ef 47 60 fa 67 94 ec 83 a8 53 b9>
```

----------
# transaction




## Transaction.constructor

Signs a transaction. This account needs to be unlocked.

### Parameters

Name    | Type   | Required | Default | Description
--------|--------|----------|---------|-----------------------------
options | object | true     |         | See `Transaction.rawOptions`

### Return

`Transaction` 


## Transaction.hash

Getter of transaction hash include signature.

> Note: calculate every time.

### Parameters

`void`

### Return

`string,undefined` If transaction has r,s,v return hex string, else return undefined.


## Transaction.from

Getter of sender address.

> Note: calculate every time.

### Parameters

`void`

### Return

`string,undefined` If ECDSA recover success return address, else return undefined.


## Transaction.sign

Sign transaction and set 'r','s','v'.

### Parameters

Name       | Type   | Required | Default | Description
-----------|--------|----------|---------|------------------------
privateKey | string | true     |         | Private key hex string.

### Return

`void`


## Transaction.encode

Encode rlp.

### Parameters

Name             | Type    | Required | Default | Description
-----------------|---------|----------|---------|-----------------------------------------
includeSignature | boolean | false    | false   | Whether or not to include the signature.

### Return

`Buffer` 


## Transaction.serialize

Get the raw tx hex string.

### Parameters

`void`

### Return

`Buffer` 


## Transaction.sendOptions



### Parameters

Name             | Type                    | Required | Default | Description
-----------------|-------------------------|----------|---------|----------------------------------------------------------------------------------------------------
options          | object                  | true     |         |
options.from     | string                  | true     |         | The address the transaction is send from.
options.nonce    | string,number           | true     |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice | string,number           | true     |         | The gasPrice used for each paid gas.
options.gas      | string,number           | true     |         | The gas provided for the transaction execution. It will return unused gas.
options.to       | string                  | false    |         | The address the transaction is directed to.
options.value    | string,number,BigNumber | false    |         | the value sent with this transaction
options.data     | string,Buffer           | false    | ''      | The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.

### Return

`object` Formatted send transaction options object.


## Transaction.callOptions



### Parameters

Name             | Type                    | Required | Default | Description
-----------------|-------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------
options          | object                  | true     |         |
options.from     | string                  | false    |         | The address the transaction is sent from.
options.nonce    | string,number           | false    |         | The caller nonce (transaction count).
options.gasPrice | string,number           | false    |         | The gasPrice used for each paid gas.
options.gas      | string,number           | false    |         | The gas provided for the transaction execution. `call` consumes zero gas, but this parameter may be needed by some executions.
options.to       | string                  | true     |         | The address the transaction is directed to.
options.value    | string,number,BigNumber | false    |         | Integer of the value sent with this transaction.
options.data     | string,Buffer           | false    |         | Hash of the method signature and encoded parameters.

### Return

`object` Formatted call contract options object.


## Transaction.estimateOptions



### Parameters

Name             | Type                    | Required | Default | Description
-----------------|-------------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------
options          | object                  | true     |         |
options.from     | string                  | false    |         | The address the transaction is sent from.
options.nonce    | string,number           | false    |         | The caller nonce (transaction count).
options.gasPrice | string,number           | false    |         | The gasPrice used for each paid gas.
options.gas      | string,number           | false    |         | The gas provided for the transaction execution. `call` consumes zero gas, but this parameter may be needed by some executions.
options.to       | string                  | false    |         | The address the transaction is directed to.
options.value    | string,number,BigNumber | false    |         | Integer of the value sent with this transaction.
options.data     | string,Buffer           | false    |         | Hash of the method signature and encoded parameters.

### Return

`object` Formatted call contract options object.


## Transaction.rawOptions



### Parameters

Name             | Type                    | Required | Default | Description
-----------------|-------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------
options          | object                  | true     |         |
options.nonce    | string,number           | true     |         | This allows to overwrite your own pending transactions that use the same nonce.
options.gasPrice | string,number,BigNumber | true     |         | The price of gas for this transaction in drip.
options.gas      | string,number           | true     |         | The amount of gas to use for the transaction (unused gas is refunded).
options.to       | string                  | false    |         | The destination address of the message, left undefined for a contract-creation transaction.
options.value    | string,number,BigNumber | false    | 0       | The value transferred for the transaction in drip, also the endowment if it’s a contract-creation transaction.
options.data     | string,Buffer           | false    | ''      | Either a ABI byte string containing the data of the function call on a contract, or in the case of a contract-creation transaction the initialisation code.
options.r        | string,Buffer           | false    |         | ECDSA signature r
options.s        | string,Buffer           | false    |         | ECDSA signature s
options.v        | string,number           | false    |         | ECDSA recovery id

### Return

`object` Formatted sign transaction options object.


----------
# type



## type.EpochNumber.EARLIEST

The earliest epochNumber where the genesis block in.
`string`


## type.EpochNumber.LATEST_STATE

The latest epochNumber where the latest block with an executed state in.
`string`


## type.EpochNumber.LATEST_MINED

The latest epochNumber where the latest mined block in.
`string`


## type.Hex

Hex formatter, trans value to hex string

### Parameters

Name  | Type                                     | Required | Default | Description
------|------------------------------------------|----------|---------|-----------------------------
value | string,number,Buffer,Date,BigNumber,null | true     |         | The value to gen hex string.

### Return

`string` Hex string.

### Example

```
> Hex(null)
 "0x"
> Hex(1) // also BigNumber
 "0x01"
> Hex('10') // from naked hex string
 "0x10"
> Hex('0x1') // pad prefix 0 auto
 "0x01"
> Hex(Buffer.from([1, 2]))
 "0x0102"
```

## type.Hex.isHex

Check if is hex string.

> Hex: /^0x([0-9a-f][0-9a-f])*$/

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|-------------------
hex  | string | true     |         | Value to be check.

### Return

`boolean` 

### Example

```
> Hex.isHex('0x')
 true
> Hex.isHex('0x01')
 true
> Hex.isHex('0x1')
 false
> Hex.isHex('01')
 false
```

## type.Hex.fromNumber

Get hex string from number.

### Parameters

Name  | Type                    | Required | Default | Description
------|-------------------------|----------|---------|------------
value | number,BigNumber,string | true     |         |

### Return

`string` 

### Example

```
> Hex.fromNumber('10')
 "0x0a"
> Hex('10')
 "0x10"
```

## type.Hex.toBuffer

Get `Buffer` by `Hex` string.

> NOTE: It's importance to only support `Hex` string, cause `Transaction.encode` will not check hex again.

### Parameters

Name | Type   | Required | Default | Description
-----|--------|----------|---------|----------------
hex  | string | true     |         | The hex string.

### Return

`Buffer` 

### Example

```
> Hex.toBuffer('0x0102')
 <Buffer 01 02>
```

## type.Hex.concat

Concat `Hex` string by order.

### Parameters

Name   | Type  | Required | Default | Description
-------|-------|----------|---------|--------------------
values | array | true     |         | Array of hex string

### Return

`string` 

### Example

```
> Hex.concat('0x01', '0x02', '0x0304')
 "0x01020304"
> Hex.concat()
 "0x"
```

## type.Drip



### Parameters

Name  | Type                           | Required | Default | Description
------|--------------------------------|----------|---------|------------
value | string,number,Buffer,BigNumber | true     |         |

### Return

`string` 

### Example

```
> Drip(1)
 "0x01"
```

```
> Drip.toGDrip(Drip.fromCFX(1));
 "1000000000"
```

## type.Drip.fromGDrip

Get Drip hex string by GDrip value.

> NOTE: Rounds towards nearest neighbour. If equidistant, rounds towards zero.

### Parameters

Name  | Type                    | Required | Default | Description
------|-------------------------|----------|---------|----------------
value | string,number,BigNumber | true     |         | Value in GDrip.

### Return

`string` Hex string in drip.

### Example

```
> Drip.fromGDrip(1)
 "0x3b9aca00"
> Drip.fromGDrip(0.1)
 "0x05f5e100"
```

## type.Drip.fromCFX

Get Drip hex string by CFX value.

> NOTE: Rounds towards nearest neighbour. If equidistant, rounds towards zero.

### Parameters

Name  | Type                    | Required | Default | Description
------|-------------------------|----------|---------|--------------
value | string,number,BigNumber | true     |         | Value in CFX.

### Return

`string` Hex string in drip.

### Example

```
> Drip.fromCFX(1)
 "0x0de0b6b3a7640000"
> Drip.fromCFX(0.1)
 "0x016345785d8a0000"
```

## type.Drip.toGDrip

Get `GDrip` from Drip.

### Parameters

Name  | Type                    | Required | Default | Description
------|-------------------------|----------|---------|------------
value | string,number,BigNumber | true     |         |

### Return

`BigNumber` 

### Example

```
> Drip.toGDrip(1e9)
 "1"
> Drip.toGDrip(Drip.fromCFX(1))
 "1000000000"
```

## type.Drip.toCFX

Get `CFX` from Drip.

### Parameters

Name  | Type                    | Required | Default | Description
------|-------------------------|----------|---------|------------
value | string,number,BigNumber | true     |         |

### Return

`BigNumber` 

### Example

```
> Drip.toCFX(1e18)
 "1"
> Drip.toCFX(Drip.fromGDrip(1e9))
 "1"
```

## type.PrivateKey

Get and validate `PrivateKey` from value

### Parameters

Name  | Type                           | Required | Default | Description
------|--------------------------------|----------|---------|------------
value | string,number,Buffer,BigNumber | true     |         |

### Return

`string` 

### Example

```
> PrivateKey('0123456789012345678901234567890123456789012345678901234567890123')
 "0x0123456789012345678901234567890123456789012345678901234567890123"
```

## type.Address

Get and validate `Address` from value

### Parameters

Name  | Type                           | Required | Default | Description
------|--------------------------------|----------|---------|------------
value | string,number,Buffer,BigNumber | true     |         |

### Return

`string` 

### Example

```
> Address('0123456789012345678901234567890123456789')
 "0x0123456789012345678901234567890123456789"
```

## type.EpochNumber

Get and validate `EpochNumber` from value

### Parameters

Name  | Type                           | Required | Default | Description
------|--------------------------------|----------|---------|------------
value | string,number,Buffer,BigNumber | true     |         |

### Return

`string` 

### Example

```
> EpochNumber(0)
 "0x00"
> EpochNumber('100')
 "0x64"
> EpochNumber('earliest')
 "earliest"
> EpochNumber('LATEST_STATE')
 "latest_state"
```

## type.BlockHash

Get and validate `BlockHash` from value

### Parameters

Name  | Type                           | Required | Default | Description
------|--------------------------------|----------|---------|------------
value | string,number,Buffer,BigNumber | true     |         |

### Return

`string` 

### Example

```
> BlockHash('0123456789012345678901234567890123456789012345678901234567890123')
 "0x0123456789012345678901234567890123456789012345678901234567890123"
```

## type.TxHash

Get and validate `TxHash` from value

### Parameters

Name  | Type                           | Required | Default | Description
------|--------------------------------|----------|---------|------------
value | string,number,Buffer,BigNumber | true     |         |

### Return

`string` 

### Example

```
> TxHash('0123456789012345678901234567890123456789012345678901234567890123')
 "0x0123456789012345678901234567890123456789012345678901234567890123"
```
