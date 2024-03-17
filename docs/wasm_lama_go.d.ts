/* tslint:disable */
/* eslint-disable */
/**
*/
export function greet(): void;
/**
*/
export class BoardDecoder {
  free(): void;
/**
* @param {number} board_edge_size
* @returns {BoardDecoder}
*/
  static new(board_edge_size: number): BoardDecoder;
/**
*/
  clear(): void;
/**
* @param {string} encoded_string
* @returns {boolean}
*/
  decode(encoded_string: string): boolean;
/**
* @returns {string}
*/
  get_board(): string;
}
/**
*/
export class BoardEncoder {
  free(): void;
/**
* @param {number} board_edge_size
* @returns {BoardEncoder}
*/
  static new(board_edge_size: number): BoardEncoder;
/**
*/
  clear(): void;
/**
* @param {string} board_string
* @returns {boolean}
*/
  encode(board_string: string): boolean;
/**
* @returns {string}
*/
  get_encoded_string(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_boarddecoder_free: (a: number) => void;
  readonly boarddecoder_new: (a: number) => number;
  readonly boarddecoder_clear: (a: number) => void;
  readonly boarddecoder_decode: (a: number, b: number, c: number) => number;
  readonly boarddecoder_get_board: (a: number, b: number) => void;
  readonly __wbg_boardencoder_free: (a: number) => void;
  readonly boardencoder_new: (a: number) => number;
  readonly boardencoder_clear: (a: number) => void;
  readonly boardencoder_encode: (a: number, b: number, c: number) => number;
  readonly boardencoder_get_encoded_string: (a: number, b: number) => void;
  readonly greet: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
