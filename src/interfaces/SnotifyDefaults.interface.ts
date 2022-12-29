import {SnotifyToastConfig, SnotifyGlobalConfig} from '.';
import { SnotifyType } from '../types';

/**
 * Global configuration object
 */
export interface SnotifyDefaults {
  global?: SnotifyGlobalConfig
  toast?: SnotifyToastConfig
  type?: Record<SnotifyType, SnotifyToastConfig>
}
