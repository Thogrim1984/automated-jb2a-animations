import { sound } from "./sound.js";
import { video } from "./video.js";

/**
 * Creates default target data.
 *
 * @returns {DataTarget}
 */
export function target() {
   return {
      enable: false,
      video: { dbSection: "static", menuType: 'spell', animation: 'curewounds', variant: '01', color: 'blue', enableCustom: false, customPath: "" },
      sound: sound(),
      options: {
         elevation: 1000,
         isMasked: false,
         opacity: 1,
         persistent: false,
         repeat: 1,
         setRadius: false,
         size: 1,
         unbindAlpha: false,
         unbindVisibility: false,
         wait: 0,
         zIndex: 1
      }
   };
}

/**
 * @typedef {object} DataTarget
 *
 * @property {boolean=false}     enable -
 *
 * @property {DataVideo}         video -
 *
 * @property {DataSound}         sound -
 *
 * @property {DataTargetOptions} options -
 */

/**
 * @typedef {object} DataTargetOptions
 *
 * @property {boolean}     below -
 *
 * @property {number}      delay -
 *
 * @property {number}      delayAfter -
 *
 * @property {boolean}     isMasked -
 *
 * @property {number}      opacity -
 *
 * @property {boolean}     persistent -
 *
 * @property {number}      repeat -
 *
 * @property {number}      scale -
 *
 * @property {boolean}     unbindAlpha -
 *
 * @property {boolean}     unbindVisibility -
 *
 * @property {number}      zIndex -
 */
