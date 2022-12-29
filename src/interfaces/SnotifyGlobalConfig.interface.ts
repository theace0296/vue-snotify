/**
 * Toast dock configuration
 */
export interface SnotifyGlobalConfig {
  /**
   * Max toast items on screen.
   *
   * > For example you want to display 3 toasts max at the time. But for some purposes your system calls it 10 times.
   * >
   * > With this option, 3 toast will be shown. And after each of it will disappear, new toast from the queue will be shown.
   */
  maxOnScreen?: number
  /**
   * Max toast items at position.
   *
   * Same as maxOnScreen, but affects only current toast position (like rightBottom)
   */
  maxAtPosition?: number
  /**
   * Should new items come from top or bottom side.
   *
   * > This option created for styling purposes.
   * >
   * > For example, if your toast position is TOP-RIGHT. Its not very nice, when items comes from top and pulls down all other toasts
   */
  newOnTop?: boolean
  /**
   * Only one toast in the queue
   */
  oneAtTime?: boolean
  /**
   * Only one toast type in the queue
   */
  preventDuplicates?: boolean
}
