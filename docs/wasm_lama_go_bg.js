let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
*/
export function greet() {
    wasm.greet();
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

const BoardFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_board_free(ptr >>> 0));
/**
*/
export class Board {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Board.prototype);
        obj.__wbg_ptr = ptr;
        BoardFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoardFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_board_free(ptr);
    }
    /**
    * @param {number} edge_size
    * @returns {Board}
    */
    static new(edge_size) {
        const ret = wasm.board_new(edge_size);
        return Board.__wrap(ret);
    }
}

const BoardDecoderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_boarddecoder_free(ptr >>> 0));
/**
*/
export class BoardDecoder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BoardDecoder.prototype);
        obj.__wbg_ptr = ptr;
        BoardDecoderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoardDecoderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boarddecoder_free(ptr);
    }
    /**
    * @param {number} size
    * @returns {BoardDecoder}
    */
    static new(size) {
        const ret = wasm.boarddecoder_new(size);
        return BoardDecoder.__wrap(ret);
    }
    /**
    * @param {string} encoded_string
    * @returns {boolean}
    */
    decode(encoded_string) {
        const ptr0 = passStringToWasm0(encoded_string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.boarddecoder_decode(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    get_board() {
        const ret = wasm.boarddecoder_get_board(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const BoardEncoderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_boardencoder_free(ptr >>> 0));
/**
*/
export class BoardEncoder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BoardEncoder.prototype);
        obj.__wbg_ptr = ptr;
        BoardEncoderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoardEncoderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boardencoder_free(ptr);
    }
    /**
    * @param {number} board_edge_size
    * @returns {BoardEncoder}
    */
    static new(board_edge_size) {
        const ret = wasm.boardencoder_new(board_edge_size);
        return BoardEncoder.__wrap(ret);
    }
    /**
    * @param {string} board_string
    * @returns {boolean}
    */
    encode(board_string) {
        const ptr0 = passStringToWasm0(board_string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.boardencoder_encode(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    get_encoded_string() {
        const ret = wasm.boarddecoder_get_board(this.__wbg_ptr);
        return ret >>> 0;
    }
}

export function __wbg_alert_537335660bdf6db0(arg0, arg1) {
    alert(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

