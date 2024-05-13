use abv::{av2bv, bv2av};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_av_to_bv(input: &str) -> Result<String, JsValue> {
    match av2bv (input
        .parse::<u64>()
        .map_err(|_err| JsValue::from_str("Input must be a valid number"))?) {
        Ok(output) => Ok(output.to_string()),
        Err(e) => Err(JsValue::from_str(&e.to_string())),
    }
}

#[wasm_bindgen]
pub fn wasm_bv_to_av(input: &str) -> Result<String, JsValue> {
    match bv2av(input) {
        Ok(output) => Ok(output.to_string()),
        Err(e) => Err(JsValue::from_str(&e.to_string())),
    }
}