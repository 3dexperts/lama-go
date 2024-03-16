mod utils;

use wasm_bindgen::prelude::*;
use num_iter::range_step;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-lama-go!");
}

pub struct Board {
    edge_size: u32,
    spots: Vec<char>,
}

impl Board {
    pub fn new(edge_size: u32) -> Board {
        Board {
            edge_size,
            spots: vec!['\0'; (edge_size * edge_size) as usize],
        }
    }
}

#[wasm_bindgen]
pub struct BoardDecoder {
    board: Board,
}

#[wasm_bindgen]
impl BoardDecoder {
    pub fn new(board_edge_size: u32) -> BoardDecoder {
        let board = Board::new(board_edge_size);
        BoardDecoder {
            board,
        }
    }

    pub fn clear(&mut self) {
        self.board.spots.fill('\0');
    }

    pub fn decode(&mut self, encoded_string: &str) -> bool {
        let in_decimal = hex::decode(encoded_string).unwrap();

        let mut i: usize = 0;
        for v in in_decimal.iter() {
            for bit_shift in range_step(6, -1, -2) {
                match self.board.spots.get_mut(i) {
                    Some(place) => {
                        *place = char::from_u32((((v >> bit_shift as u8) & 0b11) | 0b00110000) as u32).unwrap();
                        i += 1;
                    },
                    None => { break; }
                }
            }
        }

        if i == (&self.board.edge_size * &self.board.edge_size) as usize {
            true
        } else {
            false
        }
    }

    pub fn get_board(&self) -> String {
        self.board.spots.iter().collect()
    }
}

pub const fn board_edge_size_to_encoded_size(edge_size: u32) -> u32 {
    let board_spot_in_bits: u32 = 2;
    let bits_in_byte: u32 = 8;
    let in_bits = (edge_size * edge_size) * board_spot_in_bits;
    return in_bits.div_ceil(bits_in_byte);
}

#[wasm_bindgen]
pub struct BoardEncoder {
    encoded_array: Vec<u8>,
}

#[wasm_bindgen]
impl BoardEncoder {
    pub fn new(board_edge_size: u32) -> BoardEncoder {
        BoardEncoder {
            encoded_array: vec![0; board_edge_size_to_encoded_size(board_edge_size) as usize],
        }
    }

    pub fn clear(&mut self) {
        self.encoded_array.fill(0);
    }

    pub fn encode(&mut self, board_string: &str) -> bool {
        let mut chars = board_string.chars();

        let mut i: usize = 0;
        let mut bit_shift: u32 = 6;
        while let Some(c) = chars.next() {
            match c {
                '1' => {
                    match self.encoded_array.get_mut(i) {
                        Some(v) => { *v |= 0b01 << bit_shift; },
                        None => { break; }
                    }
                },
                '2' => {
                    match self.encoded_array.get_mut(i) {
                        Some(v) => { *v |= 0b10 << bit_shift; },
                        None => { break; }
                    }
                },
                _ => { }
            }
            if bit_shift == 0 {
                i += 1;
                bit_shift = 8;
            }
            bit_shift -= 2;
        }

        if i == self.encoded_array.len() {
            true
        } else {
            false
        }
    }

    pub fn get_encoded_string(&self) -> String {
        hex::encode(&self.encoded_array)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decode_simple() {
        let mut decoder = BoardDecoder::new(2);
        decoder.decode("11");
        assert_eq!(decoder.get_board(), "0101", "Decoding failed for 11 pattern!");

        decoder.clear();
        decoder.decode("99");
        assert_eq!(decoder.get_board(), "2121", "Decoding failed for 99 pattern!");

        decoder.clear();
        decoder.decode("05");
        assert_eq!(decoder.get_board(), "0011", "Decoding failed for 05 pattern!");

        decoder.clear();
        decoder.decode("0a");
        assert_eq!(decoder.get_board(), "0022", "Decoding failed for 0a pattern!");

        decoder.clear();
        decoder.decode("50");
        assert_eq!(decoder.get_board(), "1100", "Decoding failed for 50 pattern!");

        decoder.clear();
        decoder.decode("a5");
        assert_eq!(decoder.get_board(), "2211", "Decoding failed for a5 pattern!");

        decoder.clear();
        decoder.decode("00");
        assert_eq!(decoder.get_board(), "0000", "Decoding failed for 00 pattern!");

        decoder.clear();
        decoder.decode("55");
        assert_eq!(decoder.get_board(), "1111", "Decoding failed for 55 pattern!");

        decoder.clear();
        decoder.decode("aa");
        assert_eq!(decoder.get_board(), "2222", "Decoding failed for aa pattern!");
    }

    #[test]
    fn encode_simple() {
        let mut encoder = BoardEncoder::new(2);

        encoder.encode("0101");
        assert_eq!(encoder.get_encoded_string(), "11", "Encoding failed for 0101 pattern!");

        encoder.clear();
        encoder.encode("2121");
        assert_eq!(encoder.get_encoded_string(), "99", "Encoding failed for 2121 pattern!");

        encoder.clear();
        encoder.encode("0011");
        assert_eq!(encoder.get_encoded_string(), "05", "Encoding failed for 0011 pattern!");

        encoder.clear();
        encoder.encode("0022");
        assert_eq!(encoder.get_encoded_string(), "0a", "Encoding failed for 0022 pattern!");

        encoder.clear();
        encoder.encode("1100");
        assert_eq!(encoder.get_encoded_string(), "50", "Encoding failed for 1100 pattern!");

        encoder.clear();
        encoder.encode("2211");
        assert_eq!(encoder.get_encoded_string(), "a5", "Encoding failed for 2211 pattern!");

        encoder.clear();
        encoder.encode("0000");
        assert_eq!(encoder.get_encoded_string(), "00", "Encoding failed for 0000 pattern!");

        encoder.clear();
        encoder.encode("1111");
        assert_eq!(encoder.get_encoded_string(), "55", "Encoding failed for 1111 pattern!");

        encoder.clear();
        encoder.encode("2222");
        assert_eq!(encoder.get_encoded_string(), "aa", "Encoding failed for 2222 pattern!");
    }
}