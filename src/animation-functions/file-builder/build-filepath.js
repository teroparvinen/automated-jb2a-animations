//import { JB2APATREONDB } from "../jb2a-patreon-database.js";
//import { JB2AFREEDB } from "../jb2a-free-database.js";

export async function buildWeaponFile(jb2a, itemName, handler) {

    let color = handler.color === "a1" || !handler.color ? handler.defaultColor : handler.color
    //if (!color || color === "a1") { color = handler.defaultColor }
    let uaStrikeType = handler.uaStrikeType || "physical";
    let filePath;
    //console.log("Build a file Item Name is " + itemName)
    if (handler.enableCustom01) {
        filePath = handler.templates.customPath
    } else {
        switch (itemName) {
            case "1hs":
            case "2hs":
            case "1hp":
            case "2hp":
            case "1hb":
            case "2hb":
                filePath = `autoanimations.genericmelee.${itemName}`;
                break;
            case 'unarmedstrike':
            case 'flurryofblows':
                filePath = handler.color === "random" ? `autoanimations.${itemName}.${uaStrikeType}` : `autoanimations.${itemName}.${uaStrikeType}.${color}`;
                break;
            default:
                filePath = handler.color === "random" ? `autoanimations.${itemName}` : `autoanimations.${itemName}.${color}`
        }
    }
    //let videoData = await getVideoDimensionsOf(filePath[Object.keys(filePath)[0]]);//get video metadata
    //handler.item.setFlag("autoanimations", "defaults.primary.file", filePath)

    let data = {
        file: filePath,
    }
    return data;
}

export async function buildRangedFile(jb2a, itemName, handler) {

    let dmgType = handler.rangedOptions?.rangeDmgType ?? "physical";
    if (itemName === "arrow") { dmgType = handler.rangedOptions?.rangeDmgType ?? "regular" } else {
        dmgType = handler.rangedOptions?.rangeDmgType ?? "physical";
    }
    let color = handler.color === "a1" || !handler.color ? handler.defaultColor : handler.color;
    let filePath;
    //let fileData;
    //let variant = handler.spellVariant ?? "01";
    let dtvar = handler.dtvar;
    switch (itemName) {
        case "scorchingray":
            const spellVariant = handler.spellVariant || "01";
            filePath = handler.color === "random" ? `autoanimations.${itemName}.${spellVariant}` : `autoanimations.${itemName}.${spellVariant}.${color}`;
            break;
        case 'boulder':
        case 'siege':
        case 'rangejavelin':
        case 'rangesling':
            filePath = `autoanimations.${itemName}`;
            break;
        case 'rangehammer':
        case "rangedagger":
        case "rangehandaxe":
            // Just a patch until I separate range/melee animations
            if (color !== "dark purple" || color !== "white") (color = "white")
            if (!handler.dtvar || handler.dtvar === "a1") (dtvar = "01")
            filePath = `autoanimations.${itemName}.${dtvar}.${color}`;
            break;
        case "rangehandaxe":
        case "rangespear":
            filePath = `autoanimations.${itemName}.01.${color}`;
            break;
        case 'arrow':
        case 'bolt':
        case 'bullet':
            filePath = handler.color === "random" ? `autoanimations.${itemName}.${dmgType}` : `autoanimations.${itemName}.${dmgType}.${color}`;
            break;
        default:
            if (!handler.color || handler.color === "a1") { color = handler.defaultColor }
            filePath = handler.color === "random" ? `autoanimations.${itemName}` : `autoanimations.${itemName}.${color}`;
    }
    //let videoData = await getVideoDimensionsOf(fileData['30ft']);//get video metadata
    //handler.item.setFlag("autoanimations", "defaults.primary.file", filePath)

    let data = {
        file: filePath,
        //metadata: videoData,
    }
    //console.log(data)
    return data;
}

export async function buildAfterFile(jb2a, handler) {
    let color = handler.explosionColor;
    let variant = handler.explosionVariant;
    let impactVariant = handler.impactVar;
    //console.log(handler)
    let filePath;
    let fileData;
    if (handler.customExplode) {
        filePath = handler.customExplosionPath
        fileData = filePath
    } else {
        switch (true) {
            case variant === "shatter":
            case variant === "thunderwave":
                filePath = handler.explosionColor === "random" ? `autoanimations.explosion.${variant}` : `autoanimations.explosion.${variant}.${color}`;
                fileData = jb2a.explosion[variant][Object.keys(jb2a.explosion[variant])[0]]
                break;
            case variant === "boulder":
                filePath = `autoanimations.explosion.${variant}`;
                fileData = jb2a['explosion'][variant];
                break;
            case variant === "antilife-shell":
                filePath = `autoanimations.explosion.antilifeshell`;
                fileData = jb2a['explosion']['antilifeshell'];
                break;
            default:
                filePath = handler.explosionColor === "random" ? `autoanimations.explosion.${handler.explosionVariant}` : `autoanimations.explosion.${handler.explosionVariant}.${handler.explosionColor}`;
                fileData = jb2a['explosion'][variant][Object.keys(jb2a['explosion'][variant])[0]][0]
        }
    }
    let videoData = await getVideoDimensionsOf(fileData);//get video metadata
    let scale = ((200 * handler.explosionRadius) / (videoData.width))

    //handler.item.setFlag("autoanimations", "defaults.explosion.file", filePath)
    //handler.item.setFlag("autoanimations", "defaults.explosion.scale", scale)
    //handler.item.setFlag("autoanimations", "defaults.explosion.metadata", videoData)
    let data = {
        file: filePath,
        scale: scale,//Scale based on pixels and input
        metadata: videoData,
    }
    //console.log(data);
    return data;
}

export async function buildTokenAnimationFile(jb2a, itemName, handler) {
    let color = handler.color;
    let variant = handler.spellVariant ?? "01";
    let filePath;
    let filePath02;
    let fileData;
    //console.log("Item Name for file build is " + itemName)
    if (handler.enableCustom01) {
        filePath = handler.custom01
        filePath02 = handler.custom01
        fileData = filePath
    } else {
        switch (itemName) {
            case "generichealing":
                if (!handler.color || handler.color === "a1") { color = handler.defaultColor }
                filePath = color === "random" ? `autoanimations.${itemName}.${variant}` : `autoanimations.${itemName}.${variant}.${color}`;
                fileData = jb2a["generichealing"][variant][Object.keys(jb2a["generichealing"][variant])[0]]
                break;
            case "mistystep":
                if (!handler.color || handler.color === "a1") { color = handler.defaultColor }
                filePath = color === "random" ? `autoanimations.${itemName}.01` : `autoanimations.${itemName}.01.${color}`;
                filePath02 = color === "random" ? `autoanimations.${itemName}.02` : `autoanimations.${itemName}.02.${color}`;
                fileData = jb2a[itemName]["01"][Object.keys(jb2a[itemName]["01"])[0]]
                break;
            default:
                if (!handler.color || handler.color === "a1") { color = handler.defaultColor }
                filePath = color === "random" ? `autoanimations.${itemName}` : `autoanimations.${itemName}.${color}`;
                fileData = jb2a[itemName][Object.keys(jb2a[itemName])[0]]
                break;
        }
    }
    let videoData = await getVideoDimensionsOf(fileData);//get video metadata
    //handler.item.setFlag("autoanimations", "defaults.primary.file", filePath)
    //handler.item.setFlag("autoanimations", "defaults.primary.msFile", filePath02)
    //handler.item.setFlag("autoanimations", "defaults.primary.metadata", videoData)

    let data = {
        file: filePath,
        msFile: filePath02,
        //loops: handler.animationLoops,
        //loopDelay: handler.loopDelay,
        //level: handler.animLevel,
        metadata: videoData,
    }
    return data;
}

export async function buildTemplateFile(jb2a, handler) {
    let flags = handler.templates;
    let filePath;
    let fileData;
    if (handler.templates.customAnim) {
        filePath = handler.templates.customPath
        fileData = filePath
    } else {
        switch (handler.templates?.tempAnim) {
            case "fogcloud":
                filePath = `autoanimations.templates.${flags.tempType}.${flags.tempAnim}`;
                fileData = jb2a['templates'][flags.tempType][flags.tempAnim];
                break;
            default:
                filePath = flags.tempColor === "random" ? `autoanimations.templates.${flags.tempType}.${flags.tempAnim}` : `autoanimations.templates.${flags.tempType}.${flags.tempAnim}.${flags.tempColor}`;
                fileData = flags.tempColor === "random" ? jb2a['templates'][flags.tempType][flags.tempAnim][Object.keys(jb2a['templates'][flags.tempType][flags.tempAnim])[0]] : jb2a['templates'][flags.tempType][flags.tempAnim][flags.tempColor];
        }
    }
    let videoData = await getVideoDimensionsOf(fileData);//get video metadata
    //handler.item.setFlag("autoanimations", "defaults.primary.file", filePath)
    //handler.item.setFlag("autoanimations", "defaults.primary.fileData", fileData)
    //handler.item.setFlag("autoanimations", "defaults.primary.metadata", videoData)

    let data = {
        file: filePath,
        file2: fileData,
        loops: handler.templates.tempLoop,
        delay: handler.templates.loopDelay,
        level: handler.animLevel,
        metadata: videoData
    }
    return data;
}

export async function buildSourceTokenFile(jb2a, animName, handler) {
    let filePath;
    let fileData;
    let color = handler.flags.sourceToken?.color ?? "";
    if (handler.sourceCustomEnable) {
        filePath = handler.sourceCustomPath
        fileData = filePath
    } else {
        switch (animName) {
            case "explosion":
            case "impact":
                filePath = handler.sourceColor === "random" ? `autoanimations.explosion.${animName}` : `autoanimations.explosion.${animName}.${color}`;
                fileData = jb2a.explosion[animName][Object.keys(jb2a.explosion[animName])[0]][0]
                break;
            case "marker":
                if (handler.sourceVariant === "boulder") {
                    filePath = `autoanimations.tokenEffect.${animName}.${handler.sourceVariant}`;
                    fileData = jb2a['tokenEffect'][animName][handler.sourceVariant];
                } else {
                    filePath = handler.sourceColor === "random" ? `autoanimations.tokenEffect.${animName}.${handler.sourceVariant}` : `autoanimations.tokenEffect.${animName}.${handler.sourceVariant}.${color}`;
                    fileData = handler.sourceColor === "random" ? jb2a['tokenEffect'][animName][handler.sourceVariant][Object.keys(jb2a['tokenEffect'][animName][handler.sourceVariant])[0]] : jb2a['tokenEffect'][animName][handler.sourceVariant][color]
                }
                break;
            case "divinesmite":
                filePath = handler.sourceColor === "random" ? `autoanimations.divinesmite.caster` : `autoanimations.divinesmite.caster.${color}`;
                fileData = handler.sourceColor === "random" ? jb2a['divinesmite']['caster'][Object.keys(jb2a['divinesmite']['caster'])[0]] : jb2a['divinesmite']['caster'][color]
                break;
            case "sneakattack":
                filePath = handler.sourceColor === "random" ? `autoanimations.sneakattack` : `autoanimations.sneakattack.${color}`;
                fileData = handler.sourceColor === "random" ? jb2a['sneakattack'][Object.keys(jb2a['sneakattack'])[0]] : jb2a['sneakattack'][color]
                break;
            default:
                filePath = handler.sourceColor === "random" ? `autoanimations.tokenEffect.${animName}` : `autoanimations.tokenEffect.${animName}.${color}`;
                fileData = handler.sourceColor === "random" ? jb2a['tokenEffect'][animName][Object.keys(jb2a['tokenEffect'][animName])[0]] : jb2a['tokenEffect'][animName][color]
        }
    }
    let videoData = await getVideoDimensionsOf(fileData);//get video metadata
    //handler.item.setFlag("autoanimations", "defaults.source.file", filePath)
    //handler.item.setFlag("autoanimations", "defaults.source.metadata", videoData)

    let data = {
        file: filePath,
        metadata: videoData
    }
    return data;
}

export async function buildTargetTokenFile(jb2a, animName, handler) {
    let filePath;
    let fileData;
    let color = handler.flags.targetToken?.color ?? "";
    //console.log("animation name is " + animName)
    //console.log(handler.targetVariant)
    if (handler.targetCustomEnable) {
        filePath = handler.targetCustomPath
        fileData = filePath
    } else {
        switch (animName) {
            case "explosion":
            case "impact":
                filePath = handler.targetColor === "random" ? `autoanimations.explosion.${animName}` : `autoanimations.explosion.${animName}.${handler.targetColor}`;
                fileData = jb2a.explosion[animName][Object.keys(jb2a.explosion[animName])[0]][0]
                break;
            case "marker":
                if (handler.targetVariant === "boulder") {
                    filePath = `autoanimations.tokenEffect.${animName}.${handler.targetVariant}`;
                    fileData = jb2a['tokenEffect'][animName][handler.targetVariant];
                } else {
                    filePath = handler.targetColor === "random" ? `autoanimations.tokenEffect.${animName}.${handler.targetVariant}` : `autoanimations.tokenEffect.${animName}.${handler.targetVariant}.${color}`;
                    fileData = handler.targetColor === "random" ? jb2a['tokenEffect'][animName][handler.targetVariant][Object.keys(jb2a['tokenEffect'][animName][handler.targetVariant])[0]] : jb2a['tokenEffect'][animName][handler.targetVariant][color]
                }
                break;
            case "divinesmite":
                filePath = handler.sourceColor === "random" ? `autoanimations.divinesmite.target` : `autoanimations.divinesmite.target.${color}`;
                fileData = handler.sourceColor === "random" ? jb2a['divinesmite']['target'][Object.keys(jb2a['divinesmite']['target'])[0]] : jb2a['divinesmite']['target'][color]
                break;
            case "sneakattack":
                filePath = handler.sourceColor === "random" ? `autoanimations.sneakattack` : `autoanimations.sneakattack.${color}`;
                fileData = handler.sourceColor === "random" ? jb2a['sneakattack'][Object.keys(jb2a['sneakattack'])[0]] : jb2a['sneakattack'][color]
                break;
            default:
                filePath = handler.targetColor === "random" ? `autoanimations.tokenEffect.${animName}` : `autoanimations.tokenEffect.${animName}.${color}`;
                fileData = handler.targetColor === "random" ? jb2a['tokenEffect'][animName][Object.keys(jb2a['tokenEffect'][animName])[0]] : jb2a['tokenEffect'][animName][color]
        }
    }
    let videoData = await getVideoDimensionsOf(fileData);//get video metadata
    //handler.item.setFlag("autoanimations", "defaults.target.file", filePath)
    //handler.item.setFlag("autoanimations", "defaults.target.metadata", videoData)

    let data = {
        file: filePath,
        metadata: videoData
    }
    return data;
}

export async function buildShieldFile(jb2a, handler) {
    const spellVariant = handler.spellVariant || "01";
    const color = handler.color || "blue";
    const shieldVar = handler.options.shieldVar || "outro_fade";

    const file01 = `autoanimations.shield.${spellVariant}.${color}.intro`;
    const file02 = `autoanimations.shield.${spellVariant}.${color}.loop`;
    const file03 = `autoanimations.shield.${spellVariant}.${color}.${shieldVar}`;

    const fileData = jb2a["shield"]["01"]["blue"]["intro"];
    const metadata = await getVideoDimensionsOf(fileData);

    return { file01, file02, file03, metadata };
}

export async function buildHMFile(jb2a, handler) {
    let filePath01 = `autoanimations.huntersmark.${handler.hmAnim}.pulse.${handler.color}`;
    //let fileData01 = jb2a['huntersmark'][handler.hmAnim]['pulse']['green']
    let filePath02 = jb2a['huntersmark'][handler.hmAnim]['loop'][handler.color];
    //let videoData = await getVideoDimensionsOf(filePath02);

    let data = {
        file01: filePath01,
        file02: filePath02,
        //metadata: videoData,
    }
    return data;
}

function getVideoDimensionsOf(url) {
    return new Promise(resolve => {
        // create the video element
        const video = document.createElement('video');
        video.preload = "metadata";

        // place a listener on it
        video.addEventListener("loadedmetadata", function () {
            // retrieve dimensions
            const height = this.videoHeight;
            const width = this.videoWidth;
            const duration = this.duration
            // send back result
            resolve({ height, width, duration });
        }, false);
        video.src = url;

    });
}
