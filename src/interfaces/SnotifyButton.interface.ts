import {SnotifyToast} from '../components/toast.model';
/**
 * Buttons config.
 */

/**
 * Buttons config
 */
export interface SnotifyButton {
  /**
   * SnotifyButton text
   */
  text: string
  /**
   * Action which will be called after button click
   */
  action?: (toast: SnotifyToast) => void
  /**
   * Should button text be bold.
   */
  bold?: boolean
  /**
   * Additional className.
   */
  className?: string
}
