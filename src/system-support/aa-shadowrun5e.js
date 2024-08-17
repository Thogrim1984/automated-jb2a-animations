import { AnimationState } from "../AnimationState.js";
import { debug } from "../constants/constants.js";
import { trafficCop } from "../router/traffic-cop.js";
import AAHandler from "../system-handlers/workflow-data.js";
import { getRequiredData } from "./getRequiredData.js";

export function systemHooks() {
    Hooks.on("createChatMessage", async (msg) => { checkChatMessage(msg) });
}

const TEST = {
    Melee: 'MeleeAttackTest',
    Drain: 'DrainTest',
    Skill: 'SkillTest',
    Fade: 'FadeTest',
    Thrown: 'ThrownAttackTest',
    Range: 'RangedAttackTest',
    Spell: 'SpellCastingTest',

    Opposed: 'OpposedTest',

    SummonSpirit: 'SummonSpiritTest',
    Ritual: 'RitualSpellcastingTest',
    ComplexForm: 'ComplexFormTest',
    CompileSprite: 'CompileSpriteTest',

}

const weaponRanges = new Map([
    ["holdOutPistol", "Pistole"],
    ["lightPistol", "Pistole"],
    ["heavyPistol", "Pistole"],

    ["taser", "Taser"],

    ["machinePistol", "Schnellfeuerpistole"],
    ["smg", "Schnellfeuerpistole"],

    ["sniperRifle", "Scharfschützengewehr"],
    ["sportingRifle", "Scharfschützengewehr"],

    ["assaultRifle", "Gewehr"],

    ["lightMachinegun", "Schweres Gewehr"],
    ["mediumHeavyMachinegun", "Schweres Gewehr"],
    ["shotgunSlug", "Schweres Gewehr"],
    ["assaultCannon", "Schweres Gewehr"],

    ["lightCrossbow", "Armbrust"],
    ["mediumCrossbow", "Armbrust"],
    ["heavyCrossbow", "Armbrust"],

    ["shotgunFlechette", "Schrotflinte"],

    ["grenadeLauncher", "Granatwerfer"],

    ["missileLauncher", "Raketenwerfer"],

    ["bow", "Bogen"],

    ["thrownKnife", "Wurfmesser"],

    ["net", "Netz"],

    ["shuriken", "Shuriken"],

    ["standardThrownGrenade", "Granate"],
    ["aerodynamicThrownGrenade", "Granate"],

    ["harpoonGun", "Harpune"],
    ["harpoonGunUnderwater", "Harpune"],

    ["flamethrower", "Flammenwerfer"],
]);

const spiritTypes = new Map([
    ["air", "Luft"],
    ["aircraft", "Flugzeug"],
    ["airwave", "Radiowelle"],
    ["anarch", "Anarch"],
    ["arboreal", "Arboreal"],
    ["automotive", "Bodenfahrzeug"],
    ["beasts", "Tier"],
    ["blackjack", "Blackjack"],
    ["blood", "Blut"],
    ["boggle", "Zersetzer"],
    ["bugul", "Bugul"],
    ["carcass", "Kadaver"],
    ["caretaker", "Insekt: Pfleger"],
    ["ceramic", "Keramik"],
    ["chindi", "Chindi"],
    ["corpse", "Leiche"],
    ["croki", "Croki"],
    ["detritus", "Geröll"],
    ["duende", "Duende"],
    ["earth", "Erde"],
    ["elvar", "Elvar"],
    ["energy", "Energie"],
    ["erinyes", "Erinyes"],
    ["fire", "Feuer"],
    ["greenman", "Greenman"],
    ["guardian", "Beschützer"],
    ["guidance", "Ratgeber"],
    ["imp", "Imp"],
    ["jarl", "Jarl"],
    ["kappa", "Kappa"],
    ["kokopelli", "Kokopelli"],
    ["man", "Mensch"],
    ["master_shedim", "Meistershedim"],
    ["metal", "Metall"],
    ["morbi", "Morbi"],
    ["muse", "Muse"],
    ["nightmare", "Nachtmahr"],
    ["nocnitasa", "Nocnitasa"],
    ["nymph", "Insekt: Nymphe"],
    ["palefire", "Fahlfeuer"],
    ["phantom", "Phantom"],
    ["plant", "Pflanze"],
    ["preta", "Preta"],
    ["queen", "Insekt: Königin/Mutter"],
    ["rot", "Fäulnis"],
    ["scout", "Insekt: Späher"],
    ["shade", "Nachtschatten"],
    ["shedim", "Shedim"],
    ["ship", "Schiff"],
    ["soldier", "Insekt: Soldat"],
    ["stabber", "Stabber"],
    ["succubus", "Sukkubus"],
    ["task", "Helfer"],
    ["toxic_air", "Smog"],
    ["toxic_beasts", "Abscheulichkeit"],
    ["toxic_earth", "Ödnis"],
    ["toxic_fire", "Nuklear"],
    ["toxic_man", "Seuche"],
    ["toxic_water", "Schlamm"],
    ["train", "Eisenbahn"],
    ["tungak", "Tungak"],
    ["vucub", "Vucub Caquix"],
    ["water", "Wasser"],
    ["worker", "Insekt: Arbeiter"],
    ["wraith", "Wraith"]
]);

const skills = new Map([
    ["aeronautics_mechanic", "Luftfahrtmechanik"],
    ["alchemy", "Alchemie"],
    ["animal_handling", "Tierführung"],
    ["arcana", "Arkana"],
    ["archery", "Projektilwaffen"],
    ["armorer", "Waffenbau"],
    ["artificing", "Fokusherstellung"],
    ["artisan", "Handwerk"],
    ["assensing", "Askennen"],
    ["astral_combat", "Astralkampf"],
    ["automatics", "Schnellfeuerwaffen"],
    ["automotive_mechanic", "Fahrzeugmechanik"],
    ["banishing", "Verbannen"],
    ["binding", "Binden"],
    ["biotechnology", "Biotechnologie"],
    ["blades", "Klingenwaffen"],
    ["chemistry", "Chemie"],
    ["clubs", "Knüppel"],
    ["compiling", "Kompilieren"],
    ["computer", "Computer"],
    ["con", "Überreden"],
    ["counterspelling", "Antimagie"],
    ["cybercombat", "Matrixkampf"],
    ["cybertechnology", "Kybernetik"],
    ["decompiling", "Dekompilieren"],
    ["demolitions", "Sprengstoffe"],
    ["disenchanting", "Entzaubern"],
    ["disguise", "Verkleiden"],
    ["diving", "Tauchen"],
    ["electronic_warfare", "Elektronische Kriegsführung"],
    ["escape_artist", "Entfesseln"],
    ["etiquette", "Gebräuche"],
    ["exotic_melee", "Exotische Nahkampfwaffe"],
    ["exotic_range", "Exotische Fernkampfwaffe"],
    ["first_aid", "Erste Hilfe"],
    ["flight", "Fliegen"],
    ["forgery", "Fälschen"],
    ["free_fall", "Freifall"],
    ["gunnery", "Geschütze"],
    ["gymnastics", "Akrobatik"],
    ["hacking", "Hacking"],
    ["hardware", "Hardware"],
    ["heavy_weapons", "Schwere Waffen"],
    ["impersonation", "Verkörperung"],
    ["industrial_mechanic", "Industriemechanik"],
    ["instruction", "Unterricht"],
    ["intimidation", "Einschüchtern"],
    ["leadership", "Führung"],
    ["locksmith", "Schlosser"],
    ["longarms", "Gewehre"],
    ["medicine", "Medizin"],
    ["nautical_mechanic", "Seefahrtmechanik"],
    ["navigation", "Navigation"],
    ["negotiation", "Verhandlung"],
    ["palming", "Fingerfertigkeit"],
    ["perception", "Wahrnehmung"],
    ["performance", "Vorführung"],
    ["pilot_aerospace", "Raumfahrzeuge"],
    ["pilot_aircraft", "Flugzeuge"],
    ["pilot_exotic_vehicle", "Exotisches Fahrzeug"],
    ["pilot_ground_craft", "Bodenfahrzeuge"],
    ["pilot_walker", "Läufer"],
    ["pilot_water_craft", "Schiffe"],
    ["pistols", "Pistolen"],
    ["registering", "Registrieren"],
    ["ritual_spellcasting", "Ritualzauberei"],
    ["running", "Laufen"],
    ["skill", "Fertigkeit"],
    ["skills", "Fertigkeiten"],
    ["sneaking", "Schleichen"],
    ["software", "Software"],
    ["spellcasting", "Spruchzauberei"],
    ["summoning", "Herbeirufen"],
    ["survival", "Survival"],
    ["swimming", "Schwimmen"],
    ["throwing_weapons", "Wurfwaffen"],
    ["tracking", "Spurenlesen"],
    ["unarmed_combat", "Waffenloser Kampf"]
]);

const spellCategories = new Map([
    ["combat", "Kampf"],
    ["detection", "Wahrnehmung"],
    ["health", "Heilung"],
    ["illusion", "Illusion"],
    ["manipulation", "Manipulation"]
]);

const spriteTypes = new Map([
    ["companion", "Begleiter"],
    ["courier", "Kurier"],
    ["crack", "Infiltrator"],
    ["data", "Daten"],
    ["fault", "Stör"],
    ["generalist", "Generalist"],
    ["machine", "Maschinen"]
]);

const complexFormTargets = new Map([
    ["persona", "Persona"],
    ["device", "Gerät"],
    ["file", "Datei"],
    ["self", "Selbst"],
    ["sprite", "Sprite"],
    ["host", "Host"],
    ["ic", "IC"],
    ["other", "Andere"]
]);

const damageTypes = new Map([
    ["physical", "Körperlich"],
    ["stun", "Geistig"],
    ["matrix", "Matrix"]
]);

const elementTypes = new Map([
    ["fire", "Feuer"],
    ["cold", "Kälte"],
    ["acid", "Säure"],
    ["electricity", "Elektrizität"],
    ["radiation", "Strahlung"]
]);


/* 
    This method handles ShadowRun 5e system specific behavior.
    - For weapons, as the system has hundreds of weapon items with different names,
        a second lookup if performed with the range-attribute and a third if performed with the skill name to allow a quick setup while still offering the main base behavior.
    - For spells, we use the same trick with the magic school as a fallback
 */
async function checkChatMessage(msg) {
    if (msg.user.id !== game.user.id) {
        return;
    }

    const test = await game.shadowrun5e?.test?.fromMessage(msg.id);
    if (!test) {
        return;
    }

    // #1 Let's create the compiledData based on the test type
    let compiledData = await computeCompiledData(msg, test);
    if (!compiledData) {
        return;
    }

    // #2 Evaluate if the item directly is a match in the AA configuration
    if (await tryAnimationWith(compiledData)) {
        return;
    }

    // #3 If not, let's find a match using TEST-specific means as item name
    let alternativeName;
    computeDamageData(compiledData);

    switch (test.type) {
        case TEST.Spell:
            alternativeName = await computeSpellTestData(compiledData);
            if (!alternativeName.includes("Fläche") && !alternativeName.includes("Permanent")) {
                buildTargetAnimation(compiledData);
            }
            break;
        case TEST.Range:
        case TEST.Thrown:
            alternativeName = await computeRangedWeaponTestData(compiledData);
            buildTargetAnimation(compiledData);
            break;
        case TEST.Melee:
            let meleeSkill = compiledData.item?.system?.action.skill;
            if (meleeSkill && skills.has(meleeSkill)) {
                alternativeName = `Fertigkeit: ${skills.get(meleeSkill)}`
            }
            computeDamageData(compiledData);
            break;
        case TEST.SummonSpirit:
            alternativeName = await computeSummonSpiritTestData(compiledData);
            break;
        case TEST.CompileSprite:
            alternativeName = await computeCompileSpriteTestData(compiledData);
            break;
        case TEST.ComplexForm:
            alternativeName = await computeComplexFormTestData(compiledData);
            if (!alternativeName.includes("Permanent") && alternativeName.includes("Persona") || alternativeName.includes("IC")) {
                buildTargetAnimation(compiledData);
            }
            break;
    }

    if (alternativeName && await tryAnimationWith(compiledData, alternativeName)) {
        return;
    }

    // #4 Last, we can try the skill. 

    const skill = compiledData.item?.system?.action.skill;
    if (skill && skills.has(skill)) {
        if (await tryAnimationWith(compiledData, `Fertigkeit: ${skills.get(skill)}`)) {
            return;
        }
    }
}

async function buildTargetAnimation(compiledData) {

    let damageName;
    let useAmmo = false;
    let tempHandler;

    if (compiledData.ammo) {


        let clonedData = {
            ...compiledData
        };

        clonedData = {
            ...clonedData,
            item: compiledData.ammo
        };

        tempHandler = await buildHandler(clonedData, null, "Munitionshandler");

        if (tempHandler?.animationData) {
            useAmmo = true;
        }
    }

    if (!useAmmo) {
        let damage = [];
        if (compiledData.damageType && damageTypes.has(compiledData.damageType)) damage.push(damageTypes.get(compiledData.damageType));
        if (compiledData.elementType && damageTypes.has(compiledData.elementType)) damage.push(damageTypes.get(compiledData.elementType));

        if (damage.length > 0) {
            damageName = `Schaden ${damage.join('/')}`;
        } else {
            return compiledData;
        }

        tempHandler = await buildHandler(compiledData, damageName, "Schadenshandler");
    }



    if (tempHandler?.animationData) {
        let animationData = tempHandler.animationData;
        let video = animationData.primary.video;
        let sound = animationData.primary.sound;
        let options = animationData.primary.options;

        if (!compiledData.sr5TargetAnimationData) {
            compiledData.sr5TargetAnimationData = {};
        }

        compiledData.sr5TargetAnimationData.macro = animationData.macro;
        let target = {
            enable: true,
            video: {
                dbSection: video.dbSection,
                menuType: video.menuType,
                animation: video.animation,
                variant: video.variant,
                color: video.color,
                enableCustom: video.enableCustom,
                customPath: video.customPath
            },
            sound: {
                enable: sound.enable,
                delay: sound.delay,
                repeat: sound.repeat,
                repeatDelay: sound.repeatDelay,
                startTime: sound.startTime,
                volume: sound.volume
            },
            options: {
                addTokenWidth: options.addTokenWidth,
                anchor: options.anchor,
                contrast: options.contrast,
                delay: options.delay,
                elevation: options.elevation,
                fadeIn: options.fadeIn,
                fadeOut: options.fadeOut,
                isMasked: options.isMasked,
                isRadius: options.isRadius,
                opacity: options.opacity,
                persistent: options.persistent,
                repeat: compiledData.overrideRepeat > 0 ? compiledData.overrideRepeat : options.repeat,
                repeatDelay: options.repeatDelay,
                saturate: options.saturate,
                size: options.size,
                tint: options.tint,
                tintColor: options.tintColor,
                unbindAlpha: options.unbindAlpha,
                unbindVisibility: options.unbindVisibility,
                zIndex: options.zIndex
            }
        };

        compiledData.sr5TargetAnimationData.target = target;
    }

    return;
}

async function computeDamageData(compiledData) {
    let damageType = compiledData.item?.system?.action?.damage?.type?.value;
    let elementType = compiledData.item?.system?.action?.damage?.element?.value;

    if (damageType) {
        compiledData.damageType = damageType;
    }

    if (elementType) {
        compiledData.elementType = elementType;
    }


    // Prüfen ob das Item Munition hat
    if (compiledData.item?.getEquippedAmmo()) {
        compiledData.ammo = compiledData.item.getEquippedAmmo();
    }

    return;
}

async function computeSummonSpiritTestData(compiledData) {
    let spiritType = compiledData.item?.system?.spirit?.type;
    if (spiritType && spiritTypes.has(spiritType)) {
        return `Beschwörung: ${spiritTypes.get(spiritType)}`;
    }
    return;
}

async function computeCompileSpriteTestData(compiledData) {
    let spriteType = compiledData.item?.system?.sprite?.type;
    if (spriteType && spriteTypes.has(spriteType)) {
        return `Kompilierung: ${spriteTypes.get(spriteType)}`;
    }
    return;
}

async function computeComplexFormTestData(compiledData) {
    let target;
    let permanent;

    let formTarget = compiledData.item?.system?.target;
    if (formTarget && complexFormTargets.has(formTarget)) {
        target = complexFormTargets.get(formTarget);
    }

    if (compiledData.item?.system?.duration === "sustained" || compiledData.item?.system?.duration === "permanent") {
        permanent = true;
    }

    let alternativeName = `Komplexe Form mit Ziel: ${target ? target : "Unbekannt"}`;

    if (permanent) {
        alternativeName += " (Permanent)";
    }

    return alternativeName;
}

async function computeSpellTestData(compiledData) {
    let area = false;
    let category;
    let permanent = false;

    if (compiledData.item?.system?.target === "los-a") {
        area = true;
    }

    category = compiledData.item?.system?.category;

    if (compiledData.item?.system?.duration === "sustained" || compiledData.item?.system?.duration === "permanent") {
        permanent = true;
    }

    let categoryValue = spellCategories.get(category.toLowerCase());

    if (!categoryValue) {
        return;
    }

    let alternativeName = `Zauber: ${categoryValue}`;

    const conditions = [];
    if (area) conditions.push("Fläche");
    if (permanent) conditions.push("Permanent");

    if (conditions.length > 0) {
        alternativeName += ` (${conditions.join('/')})`;
    }

    return alternativeName;
}

async function computeRangedWeaponTestData(compiledData) {
    let rangeCategory = compiledData.item?.system?.range?.ranges?.category;
    if (rangeCategory && weaponRanges.has(rangeCategory)) {
        return `Waffe: ${weaponRanges.get(rangeCategory)}`;
    }
    return;
}

async function computeCompiledData(msg, test) {
    let item;
    switch (test.type) {
        case TEST.Skill:
            let skill = test.data?.action?.skill;
            if (skill && skills.has(skill)) {
                item = {
                    name: `Fertigkeit: ${skills.get(skill)}`
                };
            }
            break;

        // In case of drain test, the item is the same as the Spell casting test, it's wrong
        case TEST.Drain:
            item = {
                name: 'Entzug',
            }
            break;

        // In case of fade test, the item is the same as the Complex Form test, it's wrong
        case TEST.Fade:
            item = {
                name: 'Schwund',
            }
            break;

        // In case of opposed test, the item is the attacker's one. Not good.
        case TEST.Opposed:
            return;

        default:
            const itemUuid = test.data.sourceItemUuid;
            item = await fromUuid(itemUuid);
            if (!item) {
                return;
            }
    }

    const compiledData = await getRequiredData({
        item: item,
        actorId: msg.speaker?.actor,
        tokenId: msg.speaker?.token,
        workflow: msg,
    });

    if (!compiledData) {
        return;
    }

    if (test.type == TEST.Range) {
        // In case of range, depending on the firing mode, multiple bullets might be fired.
        // Let's override the repeat with that information.

        // TODO: use test data once SR5 System has fixed the missing information
        // let bulletCount = test.data.fireMode.value;
        const message = game.messages.get(msg.id);
        const bulletCount = message.flags?.shadowrun5e?.TestData?.data?.fireMode?.value;
        if (bulletCount && bulletCount > 1) {
            compiledData.overrideRepeat = bulletCount;
        }
    }

    return compiledData;
}

async function buildHandler(compiledData, itemNameOverride, debug) {
    if (itemNameOverride) {
        compiledData.item = {
            name: itemNameOverride
        }
    }

    compiledData.item.debug = debug;

    return await AAHandler.make(compiledData)
}

async function tryAnimationWith(compiledData, itemNameOverride) {

    let handler = await buildHandler(compiledData, itemNameOverride, "tryAnimationWith");

    if (compiledData.sr5TargetAnimationData) {
        handler.animationData.macro = compiledData.sr5TargetAnimationData.macro;
        handler.animationData.target = compiledData.sr5TargetAnimationData.target
    }


    if (handler?.item && handler.sourceToken) {
        trafficCop(handler);
        return true;
    }

    return;
}