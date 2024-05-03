#Build
```
$ wasm-pack build --target web
```
#Important files:
```
DEST_DIR=../docs/
cp pkg/wasm_lama_go.d.ts $DEST_DIR
cp pkg/wasm_lama_go.js $DEST_DIR
cp pkg/wasm_lama_go_bg.wasm $DEST_DIR
```
