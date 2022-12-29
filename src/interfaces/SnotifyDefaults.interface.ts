import { SnotifyType } from '../types';
import { SnotifyGlobalConfig } from './SnotifyGlobalConfig.interface';
import { SnotifyToastConfig } from './SnotifyToastConfig.interface';

/**
 * Global configuration object
 */
export interface SnotifyDefaults {
  global?: SnotifyGlobalConfig
  toast?: SnotifyToastConfig
  type?: Record<SnotifyType, SnotifyToastConfig>
}
