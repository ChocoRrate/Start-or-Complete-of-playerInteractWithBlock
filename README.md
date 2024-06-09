# Start-or-Complete-of-playerInteractWithBlock
playerInteractWithBlockの開始と終了時のイベントを追加します。

クリック開始時のイベント
```js
import {playerStartInteractWithBlock, playerCompleteInteractWithBlock} from "./CR_lib/events";

// ブロッククリック開始時のイベントを登録(playerStartInteractWithBlock)
playerStartInteractWithBlock.subscribe((event) => {
const player = event.player //クリックしたプレイヤー <Minecraft:Player>
const itemStack = event.itemStack //手に持ってるアイテムスタック <Minecraft.ItemStack / undefined>
const block = event.block //クリックしたブロック <Minecraft.Block>
const blockFace = event.blockFace //クリックしたブロックの面 <Minecraft.Direction>
const faceLocation //クリックした面の場所 <Minecraft.Vector3>
const nextBlock = event.nextBlock //クリックした面に基づくブロック(バニラの、ブロックを設置するであろう場所) <Minecraft.Block>
});
```

クリック終了時のイベント
```js
import {playerStartInteractWithBlock, playerCompleteInteractWithBlock} from "./CR_lib/events";

// ブロッククリック終了時のイベントを登録(playerCompleteInteractWithBlock)
playerCompleteInteractWithBlock.subscribe((event) => {
const player = event.player //クリックしたプレイヤー <Minecraft:Player>
const itemStack = event.itemStack //手に持ってるアイテムスタック <Minecraft.ItemStack / undefined>
const block = event.block //クリックしたブロック <Minecraft.Block>
const blockFace = event.blockFace //クリックしたブロックの面 <Minecraft.Direction>
const faceLocation //クリックした面の場所 <Minecraft.Vector3>
const nextBlock = event.nextBlock //クリックした面に基づくブロック（バニラの、ブロックを設置するであろう場所）<Minecraft.Block>
const interactedTime = event.interactedTime //クリックを継続した時間 <Number>
});
```
