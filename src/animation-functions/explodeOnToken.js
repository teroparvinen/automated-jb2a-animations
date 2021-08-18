import { buildFile } from "./file-builder/build-filepath.js"
import { JB2APATREONDB } from "./databases/jb2a-patreon-database.js";
import { JB2AFREEDB } from "./databases/jb2a-free-database.js";
//import { AAITEMCHECK } from "./item-arrays.js";

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export async function explodeOnToken(handler) {
    function moduleIncludes(test) {
        return !!game.modules.get(test);
    }
    let obj01 = moduleIncludes("jb2a_patreon") === true ? JB2APATREONDB : JB2AFREEDB;
    let globalDelay = game.settings.get("autoanimations", "globaldelay");
    await wait(globalDelay);

    let sourceToken = handler.actorToken;
    let name = handler.explosionVariant;
    name = name === "boulder" ? "boulderimpact" : name;
    let explosion = await buildFile(true, name, "static", "01", handler.explosionColor)

    // builds Source Token file if Enabled, and pulls from flags if already set
    let sourceFX;
    let sFXScale;
    if (handler.sourceEnable) {
        sourceFX = await buildFile(true, handler.sourceName, "static", handler.sourceVariant, handler.sourceColor);
        sFXScale = 2 * sourceToken.w / sourceFX.metadata.width;
    }
    // builds Target Token file if Enabled, and pulls from flags if already set
    let targetFX;
    let tFXScale;
    if (handler.targetEnable) {
        targetFX = await buildFile(true, handler.targetName, "static", handler.targetVariant, handler.targetColor)
    }
    let tokenScale = (1.5 * sourceToken.w / explosion.metadata.width)
    let animationScale = ((200 * handler.explosionRadius) / explosion.metadata.width)
    const optionScale = handler.options?.scale ?? 1
    let scaleT10 = handler.options?.scaleToToken ? (tokenScale * optionScale) : animationScale;
    if (handler.animType === "t10") {
        new Sequence()
            .effect()
                .atLocation(sourceToken)
                .scale(sFXScale * handler.sourceScale)
                .repeats(handler.sourceLoops, handler.sourceLoopDelay)
                .belowTokens(handler.sourceLevel)
                .waitUntilFinished(handler.sourceDelay)
                .playIf(handler.sourceEnable)
                .addOverride(async (effect, data) => {
                    if (handler.sourceEnable) {
                    data.file = sourceFX.file;
                }
                return data;
                })            
            .effect()
                .file(explosion.file)
                .atLocation(sourceToken)
                .randomizeMirrorY()
                .repeats(handler.explosionLoops, handler.explosionDelay)
                //.missed(hit)
                .scale(scaleT10)
                .belowTokens(handler.animLevel)
                .addOverride(
                    async (effect, data) => {
                        return data
                    })
            .play()
        return
    } else {
        //.waitUntilFinished(-500 + handler.explosionDelay)

        async function cast() {
            let arrayLength = handler.allTargets.length;
            for (var i = 0; i < arrayLength; i++) {

                let target = handler.allTargets[i];
                if (handler.targetEnable) {
                    tFXScale = 2 * target.w / targetFX.metadata.width;
                }        
    
            let hit;
            if (handler.playOnMiss) {
                hit = handler.hitTargetsId.includes(target.id) ? false : true;
            } else {
                hit = false;
            }
            let targetScale = (1.5 * target.w / explosion.metadata.width)
            let scaleT9 = handler.options?.scaleToToken ? (targetScale * optionScale) : animationScale;

                new Sequence()
                    .effect()
                        .atLocation(sourceToken)
                        .scale(sFXScale * handler.sourceScale)
                        .repeats(handler.sourceLoops, handler.sourceLoopDelay)
                        .belowTokens(handler.sourceLevel)
                        .waitUntilFinished(handler.sourceDelay)
                        .playIf(handler.sourceEnable)
                        .addOverride(async (effect, data) => {
                            if (handler.sourceEnable) {
                            data.file = sourceFX.file;
                            }
                            return data;
                            })            
                    .effect()
                        .file(explosion.file)
                        .atLocation(target)
                        //.randomizeMirrorY()
                        .repeats(handler.explosionLoops, handler.explosionDelay)
                        .scale(scaleT9)
                        .belowTokens(handler.animLevel)
                        .playIf(() => { return arrayLength })
                    .effect()
                        .delay(handler.targetDelay)
                        .atLocation(target)
                        .scale(tFXScale * handler.targetScale)
                        .repeats(handler.targetLoops, handler.targetLoopDelay)
                        .belowTokens(handler.targetLevel)
                        .playIf(handler.targetEnable)
                        .addOverride(async (effect, data) => {
                            if (handler.targetEnable) {
                                data.file = targetFX.file;
                            }
                            return data;
                        })                
                        .play()
            }
        }
        cast()
    }
}
