(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  window.customParser = require('socket.io-msgpack-parser');
  // module.exports = customParser;
  },{"socket.io-msgpack-parser":6}],2:[function(require,module,exports){
  
  /**
   * Expose `Emitter`.
   */
  
  if (typeof module !== 'undefined') {
    module.exports = Emitter;
  }
  
  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */
  
  function Emitter(obj) {
    if (obj) return mixin(obj);
  };
  
  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */
  
  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }
  
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  Emitter.prototype.on =
  Emitter.prototype.addEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
      .push(fn);
    return this;
  };
  
  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  Emitter.prototype.once = function(event, fn){
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }
  
    on.fn = fn;
    this.on(event, on);
    return this;
  };
  
  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  Emitter.prototype.off =
  Emitter.prototype.removeListener =
  Emitter.prototype.removeAllListeners =
  Emitter.prototype.removeEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};
  
    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }
  
    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;
  
    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }
  
    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };
  
  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */
  
  Emitter.prototype.emit = function(event){
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1)
      , callbacks = this._callbacks['$' + event];
  
    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }
  
    return this;
  };
  
  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */
  
  Emitter.prototype.listeners = function(event){
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };
  
  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */
  
  Emitter.prototype.hasListeners = function(event){
    return !! this.listeners(event).length;
  };
  
  },{}],3:[function(require,module,exports){
  'use strict';
  
  function Decoder(buffer) {
    this.offset = 0;
    if (buffer instanceof ArrayBuffer) {
      this.buffer = buffer;
      this.view = new DataView(this.buffer);
    } else if (ArrayBuffer.isView(buffer)) {
      this.buffer = buffer.buffer;
      this.view = new DataView(this.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      throw new Error('Invalid argument');
    }
  }
  
  function utf8Read(view, offset, length) {
    var string = '', chr = 0;
    for (var i = offset, end = offset + length; i < end; i++) {
      var byte = view.getUint8(i);
      if ((byte & 0x80) === 0x00) {
        string += String.fromCharCode(byte);
        continue;
      }
      if ((byte & 0xe0) === 0xc0) {
        string += String.fromCharCode(
          ((byte & 0x1f) << 6) |
          (view.getUint8(++i) & 0x3f)
        );
        continue;
      }
      if ((byte & 0xf0) === 0xe0) {
        string += String.fromCharCode(
          ((byte & 0x0f) << 12) |
          ((view.getUint8(++i) & 0x3f) << 6) |
          ((view.getUint8(++i) & 0x3f) << 0)
        );
        continue;
      }
      if ((byte & 0xf8) === 0xf0) {
        chr = ((byte & 0x07) << 18) |
          ((view.getUint8(++i) & 0x3f) << 12) |
          ((view.getUint8(++i) & 0x3f) << 6) |
          ((view.getUint8(++i) & 0x3f) << 0);
        if (chr >= 0x010000) { // surrogate pair
          chr -= 0x010000;
          string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
        } else {
          string += String.fromCharCode(chr);
        }
        continue;
      }
      throw new Error('Invalid byte ' + byte.toString(16));
    }
    return string;
  }
  
  Decoder.prototype.array = function (length) {
    var value = new Array(length);
    for (var i = 0; i < length; i++) {
      value[i] = this.parse();
    }
    return value;
  };
  
  Decoder.prototype.map = function (length) {
    var key = '', value = {};
    for (var i = 0; i < length; i++) {
      key = this.parse();
      value[key] = this.parse();
    }
    return value;
  };
  
  Decoder.prototype.str = function (length) {
    var value = utf8Read(this.view, this.offset, length);
    this.offset += length;
    return value;
  };
  
  Decoder.prototype.bin = function (length) {
    var value = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  };
  
  Decoder.prototype.parse = function () {
    var prefix = this.view.getUint8(this.offset++);
    var value, length = 0, type = 0, hi = 0, lo = 0;
  
    if (prefix < 0xc0) {
      // positive fixint
      if (prefix < 0x80) {
        return prefix;
      }
      // fixmap
      if (prefix < 0x90) {
        return this.map(prefix & 0x0f);
      }
      // fixarray
      if (prefix < 0xa0) {
        return this.array(prefix & 0x0f);
      }
      // fixstr
      return this.str(prefix & 0x1f);
    }
  
    // negative fixint
    if (prefix > 0xdf) {
      return (0xff - prefix + 1) * -1;
    }
  
    switch (prefix) {
      // nil
      case 0xc0:
        return null;
      // false
      case 0xc2:
        return false;
      // true
      case 0xc3:
        return true;
  
      // bin
      case 0xc4:
        length = this.view.getUint8(this.offset);
        this.offset += 1;
        return this.bin(length);
      case 0xc5:
        length = this.view.getUint16(this.offset);
        this.offset += 2;
        return this.bin(length);
      case 0xc6:
        length = this.view.getUint32(this.offset);
        this.offset += 4;
        return this.bin(length);
  
      // ext
      case 0xc7:
        length = this.view.getUint8(this.offset);
        type = this.view.getInt8(this.offset + 1);
        this.offset += 2;
        return [type, this.bin(length)];
      case 0xc8:
        length = this.view.getUint16(this.offset);
        type = this.view.getInt8(this.offset + 2);
        this.offset += 3;
        return [type, this.bin(length)];
      case 0xc9:
        length = this.view.getUint32(this.offset);
        type = this.view.getInt8(this.offset + 4);
        this.offset += 5;
        return [type, this.bin(length)];
  
      // float
      case 0xca:
        value = this.view.getFloat32(this.offset);
        this.offset += 4;
        return value;
      case 0xcb:
        value = this.view.getFloat64(this.offset);
        this.offset += 8;
        return value;
  
      // uint
      case 0xcc:
        value = this.view.getUint8(this.offset);
        this.offset += 1;
        return value;
      case 0xcd:
        value = this.view.getUint16(this.offset);
        this.offset += 2;
        return value;
      case 0xce:
        value = this.view.getUint32(this.offset);
        this.offset += 4;
        return value;
      case 0xcf:
        hi = this.view.getUint32(this.offset) * Math.pow(2, 32);
        lo = this.view.getUint32(this.offset + 4);
        this.offset += 8;
        return hi + lo;
  
      // int
      case 0xd0:
        value = this.view.getInt8(this.offset);
        this.offset += 1;
        return value;
      case 0xd1:
        value = this.view.getInt16(this.offset);
        this.offset += 2;
        return value;
      case 0xd2:
        value = this.view.getInt32(this.offset);
        this.offset += 4;
        return value;
      case 0xd3:
        hi = this.view.getInt32(this.offset) * Math.pow(2, 32);
        lo = this.view.getUint32(this.offset + 4);
        this.offset += 8;
        return hi + lo;
  
      // fixext
      case 0xd4:
        type = this.view.getInt8(this.offset);
        this.offset += 1;
        if (type === 0x00) {
          this.offset += 1;
          return void 0;
        }
        return [type, this.bin(1)];
      case 0xd5:
        type = this.view.getInt8(this.offset);
        this.offset += 1;
        return [type, this.bin(2)];
      case 0xd6:
        type = this.view.getInt8(this.offset);
        this.offset += 1;
        return [type, this.bin(4)];
      case 0xd7:
        type = this.view.getInt8(this.offset);
        this.offset += 1;
        if (type === 0x00) {
          hi = this.view.getInt32(this.offset) * Math.pow(2, 32);
          lo = this.view.getUint32(this.offset + 4);
          this.offset += 8;
          return new Date(hi + lo);
        }
        return [type, this.bin(8)];
      case 0xd8:
        type = this.view.getInt8(this.offset);
        this.offset += 1;
        return [type, this.bin(16)];
  
      // str
      case 0xd9:
        length = this.view.getUint8(this.offset);
        this.offset += 1;
        return this.str(length);
      case 0xda:
        length = this.view.getUint16(this.offset);
        this.offset += 2;
        return this.str(length);
      case 0xdb:
        length = this.view.getUint32(this.offset);
        this.offset += 4;
        return this.str(length);
  
      // array
      case 0xdc:
        length = this.view.getUint16(this.offset);
        this.offset += 2;
        return this.array(length);
      case 0xdd:
        length = this.view.getUint32(this.offset);
        this.offset += 4;
        return this.array(length);
  
      // map
      case 0xde:
        length = this.view.getUint16(this.offset);
        this.offset += 2;
        return this.map(length);
      case 0xdf:
        length = this.view.getUint32(this.offset);
        this.offset += 4;
        return this.map(length);
    }
  
    throw new Error('Could not parse');
  };
  
  function decode(buffer) {
    var decoder = new Decoder(buffer);
    var value = decoder.parse();
    if (decoder.offset !== buffer.byteLength) {
      throw new Error((buffer.byteLength - decoder.offset) + ' trailing bytes');
    }
    return value;
  }
  
  module.exports = decode;
  
  },{}],4:[function(require,module,exports){
  'use strict';
  
  function utf8Write(view, offset, str) {
    var c = 0;
    for (var i = 0, l = str.length; i < l; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) {
        view.setUint8(offset++, c);
      }
      else if (c < 0x800) {
        view.setUint8(offset++, 0xc0 | (c >> 6));
        view.setUint8(offset++, 0x80 | (c & 0x3f));
      }
      else if (c < 0xd800 || c >= 0xe000) {
        view.setUint8(offset++, 0xe0 | (c >> 12));
        view.setUint8(offset++, 0x80 | (c >> 6) & 0x3f);
        view.setUint8(offset++, 0x80 | (c & 0x3f));
      }
      else {
        i++;
        c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        view.setUint8(offset++, 0xf0 | (c >> 18));
        view.setUint8(offset++, 0x80 | (c >> 12) & 0x3f);
        view.setUint8(offset++, 0x80 | (c >> 6) & 0x3f);
        view.setUint8(offset++, 0x80 | (c & 0x3f));
      }
    }
  }
  
  function utf8Length(str) {
    var c = 0, length = 0;
    for (var i = 0, l = str.length; i < l; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) {
        length += 1;
      }
      else if (c < 0x800) {
        length += 2;
      }
      else if (c < 0xd800 || c >= 0xe000) {
        length += 3;
      }
      else {
        i++;
        length += 4;
      }
    }
    return length;
  }
  
  function _encode(bytes, defers, value) {
    var type = typeof value, i = 0, l = 0, hi = 0, lo = 0, length = 0, size = 0;
  
    if (type === 'string') {
      length = utf8Length(value);
  
      // fixstr
      if (length < 0x20) {
        bytes.push(length | 0xa0);
        size = 1;
      }
      // str 8
      else if (length < 0x100) {
        bytes.push(0xd9, length);
        size = 2;
      }
      // str 16
      else if (length < 0x10000) {
        bytes.push(0xda, length >> 8, length);
        size = 3;
      }
      // str 32
      else if (length < 0x100000000) {
        bytes.push(0xdb, length >> 24, length >> 16, length >> 8, length);
        size = 5;
      } else {
        throw new Error('String too long');
      }
      defers.push({ str: value, length: length, offset: bytes.length });
      return size + length;
    }
    if (type === 'number') {
      // TODO: encode to float 32?
  
      // float 64
      if (Math.floor(value) !== value || !isFinite(value)) {
        bytes.push(0xcb);
        defers.push({ float: value, length: 8, offset: bytes.length });
        return 9;
      }
  
      if (value >= 0) {
        // positive fixnum
        if (value < 0x80) {
          bytes.push(value);
          return 1;
        }
        // uint 8
        if (value < 0x100) {
          bytes.push(0xcc, value);
          return 2;
        }
        // uint 16
        if (value < 0x10000) {
          bytes.push(0xcd, value >> 8, value);
          return 3;
        }
        // uint 32
        if (value < 0x100000000) {
          bytes.push(0xce, value >> 24, value >> 16, value >> 8, value);
          return 5;
        }
        // uint 64
        hi = (value / Math.pow(2, 32)) >> 0;
        lo = value >>> 0;
        bytes.push(0xcf, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
        return 9;
      } else {
        // negative fixnum
        if (value >= -0x20) {
          bytes.push(value);
          return 1;
        }
        // int 8
        if (value >= -0x80) {
          bytes.push(0xd0, value);
          return 2;
        }
        // int 16
        if (value >= -0x8000) {
          bytes.push(0xd1, value >> 8, value);
          return 3;
        }
        // int 32
        if (value >= -0x80000000) {
          bytes.push(0xd2, value >> 24, value >> 16, value >> 8, value);
          return 5;
        }
        // int 64
        hi = Math.floor(value / Math.pow(2, 32));
        lo = value >>> 0;
        bytes.push(0xd3, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
        return 9;
      }
    }
    if (type === 'object') {
      // nil
      if (value === null) {
        bytes.push(0xc0);
        return 1;
      }
  
      if (Array.isArray(value)) {
        length = value.length;
  
        // fixarray
        if (length < 0x10) {
          bytes.push(length | 0x90);
          size = 1;
        }
        // array 16
        else if (length < 0x10000) {
          bytes.push(0xdc, length >> 8, length);
          size = 3;
        }
        // array 32
        else if (length < 0x100000000) {
          bytes.push(0xdd, length >> 24, length >> 16, length >> 8, length);
          size = 5;
        } else {
          throw new Error('Array too large');
        }
        for (i = 0; i < length; i++) {
          size += _encode(bytes, defers, value[i]);
        }
        return size;
      }
  
      // fixext 8 / Date
      if (value instanceof Date) {
        var time = value.getTime();
        hi = Math.floor(time / Math.pow(2, 32));
        lo = time >>> 0;
        bytes.push(0xd7, 0, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
        return 10;
      }
  
      if (value instanceof ArrayBuffer) {
        length = value.byteLength;
  
        // bin 8
        if (length < 0x100) {
          bytes.push(0xc4, length);
          size = 2;
        } else
        // bin 16
        if (length < 0x10000) {
          bytes.push(0xc5, length >> 8, length);
          size = 3;
        } else
        // bin 32
        if (length < 0x100000000) {
          bytes.push(0xc6, length >> 24, length >> 16, length >> 8, length);
          size = 5;
        } else {
          throw new Error('Buffer too large');
        }
        defers.push({ bin: value, length: length, offset: bytes.length });
        return size + length;
      }
  
      if (typeof value.toJSON === 'function') {
        return _encode(bytes, defers, value.toJSON());
      }
  
      var keys = [], key = '';
  
      var allKeys = Object.keys(value);
      for (i = 0, l = allKeys.length; i < l; i++) {
        key = allKeys[i];
        if (typeof value[key] !== 'function') {
          keys.push(key);
        }
      }
      length = keys.length;
  
      // fixmap
      if (length < 0x10) {
        bytes.push(length | 0x80);
        size = 1;
      }
      // map 16
      else if (length < 0x10000) {
        bytes.push(0xde, length >> 8, length);
        size = 3;
      }
      // map 32
      else if (length < 0x100000000) {
        bytes.push(0xdf, length >> 24, length >> 16, length >> 8, length);
        size = 5;
      } else {
        throw new Error('Object too large');
      }
  
      for (i = 0; i < length; i++) {
        key = keys[i];
        size += _encode(bytes, defers, key);
        size += _encode(bytes, defers, value[key]);
      }
      return size;
    }
    // false/true
    if (type === 'boolean') {
      bytes.push(value ? 0xc3 : 0xc2);
      return 1;
    }
    // fixext 1 / undefined
    if (type === 'undefined') {
      bytes.push(0xd4, 0, 0);
      return 3;
    }
    throw new Error('Could not encode');
  }
  
  function encode(value) {
    var bytes = [];
    var defers = [];
    var size = _encode(bytes, defers, value);
    var buf = new ArrayBuffer(size);
    var view = new DataView(buf);
  
    var deferIndex = 0;
    var deferWritten = 0;
    var nextOffset = -1;
    if (defers.length > 0) {
      nextOffset = defers[0].offset;
    }
  
    var defer, deferLength = 0, offset = 0;
    for (var i = 0, l = bytes.length; i < l; i++) {
      view.setUint8(deferWritten + i, bytes[i]);
      if (i + 1 !== nextOffset) { continue; }
      defer = defers[deferIndex];
      deferLength = defer.length;
      offset = deferWritten + nextOffset;
      if (defer.bin) {
        var bin = new Uint8Array(defer.bin);
        for (var j = 0; j < deferLength; j++) {
          view.setUint8(offset + j, bin[j]);
        }
      } else if (defer.str) {
        utf8Write(view, offset, defer.str);
      } else if (defer.float !== undefined) {
        view.setFloat64(offset, defer.float);
      }
      deferIndex++;
      deferWritten += deferLength;
      if (defers[deferIndex]) {
        nextOffset = defers[deferIndex].offset;
      }
    }
    return buf;
  }
  
  module.exports = encode;
  
  },{}],5:[function(require,module,exports){
  exports.encode = require('./encode');
  exports.decode = require('./decode');
  
  },{"./decode":3,"./encode":4}],6:[function(require,module,exports){
  
  var msgpack = require('notepack.io');
  var Emitter = require('component-emitter');
  
  /**
   * Packet types (see https://github.com/socketio/socket.io-protocol)
   */
  
  exports.CONNECT = 0;
  exports.DISCONNECT = 1;
  exports.EVENT = 2;
  exports.ACK = 3;
  exports.ERROR = 4;
  exports.BINARY_EVENT = 5;
  exports.BINARY_ACK = 6;
  
  var errorPacket = {
    type: exports.ERROR,
    data: 'parser error'
  };
  
  function Encoder () {}
  
  Encoder.prototype.encode = function (packet, callback) {
    switch (packet.type) {
      case exports.CONNECT:
      case exports.DISCONNECT:
      case exports.ERROR:
        return callback([ JSON.stringify(packet) ]);
      default:
        return callback([ msgpack.encode(packet) ]);
    }
  };
  
  function Decoder () {}
  
  Emitter(Decoder.prototype);
  
  Decoder.prototype.add = function (obj) {
    if (typeof obj === 'string') {
      this.parseJSON(obj);
    } else {
      this.parseBinary(obj);
    }
  };
  
  Decoder.prototype.parseJSON = function (obj) {
    try {
      var decoded = JSON.parse(obj);
      this.emit('decoded', decoded);
    } catch (e) {
      this.emit('decoded', errorPacket);
    }
  };
  
  Decoder.prototype.parseBinary = function (obj) {
    try {
      var decoded = msgpack.decode(obj);
      this.emit('decoded', decoded);
    } catch (e) {
      this.emit('decoded', errorPacket);
    }
  };
  
  Decoder.prototype.destroy = function () {};
  
  exports.Encoder = Encoder;
  exports.Decoder = Decoder;
  
  },{"component-emitter":2,"notepack.io":5}]},{},[1]);
  