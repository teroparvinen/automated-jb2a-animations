import { aaAutoRecognition } from './custom-recognition/auto-recognition.js';
import AutorecShim from './formApps/AutorecMenu/appShim.js'
import { aaAutorec } from './custom-recognition/aaAutoRecList.js';
import { AnimationState } from './AnimationState.js';

/**
 * Constants for setting scope type.
 *
 * @type {{world: string, client: string}}
 */
const scope = {
   client: 'client',
   world: 'world'
};

const moduleId = 'autoanimations';

/**
 * @param {TJSGameSettings}   gameSettings -
 */
export function initSettings(gameSettings) {
   // Add a convenience hook to open Autorec settings from macro.
   Hooks.on('AA.Open.AutorecSetting', () => new AutorecShim());

   game.settings.registerMenu(moduleId, 'custom-autorec', {
      label: 'autoanimations.settings.autoRecSetting',
      icon: 'fas fa-dice-d20',
      type: AutorecShim,
      restricted: true,
   });

   const settings = [];

   settings.push({
      moduleId,
      key: 'aaAutorec',
      options: {
         name: 'Automatic Recognition',
         hint: 'Configure Automatic Recognition',
         scope: scope.world,
         config: false,
         default: aaAutorec.defaultConfiguration,
         type: Object,
      }
   });

   settings.push({
      moduleId,
      key: 'killAllAnim',
      options: {
         name: 'autoanimations.settings.toggleAnimations',
         hint: 'autoanimations.settings.toggleAnimations_hint',
         scope: scope.client,
         config: true,
         type: String,
         choices: {
            on: 'autoanimations.settings.ON',
            off: 'autoanimations.settings.OFF',
         },
         default: 'on',
         onChange: value => {
            if (value === 'off') {
              AnimationState.enabled = false;
            }
            if (value === 'on') {
               AnimationState.enabled = true;
               window.location.reload()
            }
         }
      }
   });

   settings.push({
      moduleId,
      key: 'disableAutoRec',
      options: {
         name: 'autoanimations.settings.settingDisableAutoRec',
         hint: 'autoanimations.settings.settingDisableAutoRecHint',
         scope: scope.client,
         config: true,
         type: Boolean,
         default: false,
      }
   });

   settings.push({
      moduleId,
      key: 'globaldelay',
      options: {
         name: 'autoanimations.settings.globaldelay_name',
         hint: 'autoanimations.settings.globaldelay_hint',
         scope: scope.world,
         config: true,
         default: 100,
         type: Number
      }
   });

   settings.push({
      moduleId,
      key: 'videoLoop',
      options: {
         name: 'autoanimations.settings.animPreview',
         hint: 'autoanimations.settings.animPreviewHint',
         scope: scope.world,
         type: String,
         choices: {
            '0': 'No Video Preview',
            '1': 'Manually Play Video Preview',
            '2': 'Autoplay Video Preview'
         },
         default: '0',
         config: true
      }
   });

   settings.push({
      moduleId,
      key: 'jb2aLocation',
      options: {
         name: 'autoanimations.settings.s3Name',
         hint: 'autoanimations.settings.s3Hint',
         scope: scope.world,
         config: true,
         type: String,
         default: '',
         onChange: () => { window.location.reload() }
      }
   });

   settings.push({
      moduleId,
      key: 'hideFromPlayers',
      options: {
         name: 'autoanimations.settings.animtab_name',
         hint: 'autoanimations.settings.animtab_hint',
         scope: scope.world,
         config: true,
         type: Boolean,
         default: false,
      }
   });

   settings.push({
      moduleId,
      key: 'decoupleSound',
      options: {
         name: 'autoanimations.settings.decoupleSounds',
         hint: 'autoanimations.settings.decoupleSounds_hint',
         scope: scope.world,
         config: true,
         type: Boolean,
         default: false,
      }
   });

   settings.push({
      moduleId,
      key: 'rangeSwitch',
      options: {
         name: 'autoanimations.settings.settingRangeSwitch',
         hint: 'autoanimations.settings.settingRangeSwitchhint',
         scope: scope.client,
         config: true,
         type: Boolean,
         default: false,
      }
   });

   settings.push({
      moduleId,
      key: 'noTips',
      options: {
         name: 'autoanimations.settings.noTips',
         hint: 'autoanimations.settings.noTipsHint',
         scope: scope.client,
         config: true,
         type: Boolean,
         default: false,
      }
   });

   switch (game.system.id) {
      case 'demonlord':
         settings.push({
            moduleId,
            key: 'playtrigger',
            options: {
               name: 'autoanimations.settings.demonlordtrigger_name',
               hint: 'autoanimations.settings.demonlordtrigger_hint',
               scope: scope.world,
               type: String,
               choices: {
                  rollattack: 'autoanimations.settings.demonlordtrigger_rollattack',
                  hits: 'autoanimations.settings.demonlordtrigger_hits',
                  misses: 'autoanimations.settings.demonlordtrigger_misses',
                  rolldamage: 'autoanimations.settings.demonlordtrigger_rolldamage',
                  applydamage: 'autoanimations.settings.demonlordtrigger_applydamage',
               },
               default: 'rollattack',
               config: true
            }
         });
         break

      case 'sfrpg':
         settings.push({
            moduleId,
            key: 'playonDamage',
            options: {
               name: 'autoanimations.settings.midiondmg_name',
               hint: 'autoanimations.settings.midiondmg_hint',
               scope: scope.world,
               type: Boolean,
               default: false,
               config: true,
               onChange: () => { window.location.reload() }
            }
         });
         break;

      case 'dnd5e':
      case 'sw5e':
         settings.push({
            moduleId,
            key: 'disableAEAnimations',
            options: {
               name: 'autoanimations.settings.disableAEAnimations',
               hint: 'autoanimations.settings.disableAEAnimationsHint',
               scope: scope.world,
               type: Boolean,
               default: false,
               config: true,
            }
         });

         if (game.modules.get('midi-qol')?.active) {
            settings.push({
               moduleId,
               key: 'playonhit',
               options: {
                  name: 'autoanimations.settings.midionhit_name',
                  hint: 'autoanimations.settings.midionhit_hint',
                  scope: scope.world,
                  type: Boolean,
                  default: false,
                  config: true,
               }
            });

            settings.push({
               moduleId,
               key: 'playonmiss',
               options: {
                  name: 'autoanimations.settings.midionmiss_name',
                  hint: 'autoanimations.settings.midionmiss_hint',
                  scope: scope.world,
                  type: Boolean,
                  default: false,
                  config: true,
               }
            });

            settings.push({
               moduleId,
               key: 'playonDamage',
               options: {
                  name: 'autoanimations.settings.midiondmg_name',
                  hint: 'autoanimations.settings.midiondmg_hint',
                  scope: scope.world,
                  type: Boolean,
                  default: false,
                  config: true,
                  onChange: () => { window.location.reload() }
               }
            });

            settings.push({
               moduleId,
               key: 'EnableCritical',
               options: {
                  name: 'autoanimations.settings.crithit_name',
                  hint: 'autoanimations.settings.crithit_hint',
                  scope: scope.world,
                  type: Boolean,
                  default: false,
                  config: true,
                  onchange: () => { window.location.reload() }
               }
            });

            settings.push({
               moduleId,
               key: 'CriticalAnimation',
               options: {
                  name: 'autoanimations.settings.crithitAnim_name',
                  //name: 'Choose A File',
                  scope: scope.world,
                  config: true,
                  type: String,
                  filePicker: 'imagevideo'
               }
            });

            settings.push({
               moduleId,
               key: 'EnableCriticalMiss',
               options: {
                  name: 'autoanimations.settings.critmiss_name',
                  hint: 'autoanimations.settings.critmiss_hint',
                  scope: scope.world,
                  type: Boolean,
                  default: false,
                  config: true,
                  onchange: () => { window.location.reload() }
               }
            });

            settings.push({
               moduleId,
               key: 'CriticalMissAnimation',
               options: {
                  name: 'autoanimations.settings.critmissAnim_name',
                  scope: scope.world,
                  config: true,
                  type: String,
                  filePicker: 'imagevideo'
               }
            });
         } else {
            settings.push({
               moduleId,
               key: 'playonDamageCore',
               options: {
                  name: 'autoanimations.settings.coreondmg_name',
                  hint: 'autoanimations.settings.coreondmg_hint',
                  scope: scope.world,
                  type: Boolean,
                  default: false,
                  config: true,
               }
            });
         }
         break;

      case 'pf2e':
         settings.push({
            moduleId,
            key: 'playonDamageCore',
            options: {
               name: 'autoanimations.settings.coreondmg_name',
               hint: 'autoanimations.settings.coreondmg_hint',
               scope: scope.world,
               type: Boolean,
               default: false,
               config: true,
            }
         });

         settings.push({
            moduleId,
            key: 'playonmiss',
            options: {
               name: 'autoanimations.settings.midionmiss_name',
               hint: 'Requires Animations to be played on Attack rolls',
               scope: scope.world,
               type: Boolean,
               default: false,
               config: true,
            }
         });

         settings.push({
            moduleId,
            key: 'disableNestedEffects',
            options: {
               name: 'autoanimations.settings.disableNested',
               hint: 'autoanimations.settings.disableNestedHint',
               scope: scope.world,
               type: Boolean,
               default: false,
               config: true,
            }
         });
         break;

      case 'pf1':
         settings.push({
            moduleId,
            key: 'disableAEAnimations',
            options: {
               name: 'autoanimations.settings.disableAEAnimations',
               hint: 'autoanimations.settings.disableAEAnimationsHint',
               scope: scope.world,
               type: Boolean,
               default: false,
               config: true,
            }
         });
         break;
   }

   settings.push({
      moduleId,
      key: 'debug',
      options: {
         name: 'autoanimations.settings.debugging',
         scope: scope.world,
         config: true,
         default: false,
         type: Boolean
      }
   });

   gameSettings.registerAll(settings);
}
