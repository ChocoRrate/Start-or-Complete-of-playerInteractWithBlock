import { world, system } from "@minecraft/server";

const PlayerStartInteractWithBlockCallbacks = new Map();
const PlayerCompleteInteractWithBlockCallbacks = new Map();
const StartedButYetCompletePlayer = new Map();
const StartedButYetCompletePlayerRunTimeoutList = new Map();
const PlayerInteractBlockTime = new Map();

export class playerStartInteractWithBlock {
    callback = () => { };
    constructor(callback) {
        this.callback = callback;
        PlayerStartInteractWithBlockCallbacks.set(this.callback, true);
    };
    static subscribe(callback) {
        new playerStartInteractWithBlock(callback);
    }
    static unsubscribe(callback) {
        PlayerStartInteractWithBlockCallbacks.delete(callback);
    };
};

export class playerCompleteInteractWithBlock {
    callback = () => { };
    constructor(callback) {
        this.callback = callback;
        PlayerCompleteInteractWithBlockCallbacks.set(this.callback, true);
    };
    static subscribe(callback) {
        new playerCompleteInteractWithBlock(callback);
    }
    static unsubscribe(callback) {
        PlayerCompleteInteractWithBlockCallbacks.delete(callback);
    };
};

world.beforeEvents.playerInteractWithBlock.subscribe(ev => {
    const { player, block, itemStack, blockFace, faceLocation } = ev
    let nextBlock = null
    {
        if (blockFace === 'Down') {
            nextBlock = block.below()
        } else if (blockFace === 'Up') {
            nextBlock = block.above()
        } else {
            nextBlock = block[blockFace.toLowerCase()]()
        }
    }
    let playerCompleteInteractWithBlockEventData = {
        player: player,
        itemStack: itemStack,
        block: block,
        blockFace: blockFace,
        nextBlock: nextBlock,
        faceLocation: faceLocation,
        interactedTime: PlayerInteractBlockTime.get(player.name)
    };
    let playerStartInteractWithBlockEventData = {
        player: player,
        itemStack: itemStack,
        block: block,
        blockFace: blockFace,
        nextBlock: nextBlock,
        faceLocation: faceLocation
    };

    if (StartedButYetCompletePlayer.has(player.name)) {
        system.clearRun(StartedButYetCompletePlayerRunTimeoutList.get(player.name));
        StartedButYetCompletePlayerRunTimeoutList.set(player.name, system.runTimeout(() => {
            system.run(() => {
                PlayerCompleteInteractWithBlockCallbacks.forEach((_, callback) => callback(playerCompleteInteractWithBlockEventData));
                StartedButYetCompletePlayer.delete(player.name);
                PlayerInteractBlockTime.delete(player.name);
            });
        }, 2));
    } else {

        system.run(() => {
            PlayerStartInteractWithBlockCallbacks.forEach((_, callback) => callback(playerStartInteractWithBlockEventData));
        });

        StartedButYetCompletePlayer.set(player.name, true);
        system.clearRun(StartedButYetCompletePlayerRunTimeoutList.get(player.name) || 0);
        PlayerInteractBlockTime.set(player.name,0)

        StartedButYetCompletePlayerRunTimeoutList.set(player.name, system.runTimeout(() => {
            system.run(() => {
                playerCompleteInteractWithBlockEventData.interactedTime = PlayerInteractBlockTime.get(player.name)
                PlayerCompleteInteractWithBlockCallbacks.forEach((_, callback) => callback(playerCompleteInteractWithBlockEventData));
                StartedButYetCompletePlayer.delete(player.name);
                PlayerInteractBlockTime.delete(player.name);
            });
        },2));
    }
    PlayerInteractBlockTime.forEach((values,keys)=>PlayerInteractBlockTime.set(keys,values+1))
});