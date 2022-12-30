import mitt, { Emitter } from 'mitt';
import { SnotifyToast } from './components/toast.model';
import { TOAST_DEFAULTS } from './toastDefaults';
import { SnotifyToastConfig, Snotify, SnotifyDefaults } from './interfaces';
import { SnotifyStyle } from './enums';
import { SnotifyType } from './types';
import { TransformArgument } from './decorators/transform-argument.decorator';
import { SetToastType } from './decorators/set-toast-type.decorator';

/**
 * Generates random id
 */
const uuid = (): number => {
  return Math.floor(Math.random() * (Date.now() - 1)) + 1;
};

const mergeDeep = <T extends SnotifyToastConfig | SnotifyDefaults>(
  ...args: (T | undefined)[]
): T => {
  const config = {};
  for (const inConfig of args) {
    if (!inConfig) {
      continue;
    }
    for (const key of Object.keys(inConfig)) {
      if (
        typeof config[key] === 'object' &&
        typeof inConfig[key] === 'object'
      ) {
        if (
          !config[key] ||
          !inConfig[key] ||
          Array.isArray(config[key]) ||
          Array.isArray(inConfig[key])
        ) {
          config[key] = inConfig[key];
        } else {
          config[key] = {
            ...config[key],
            ...inConfig[key],
          };
        }
      } else {
        config[key] = inConfig[key];
      }
    }
  }
  return config as T;
};

type SnotifyEvents = {
  snotify: SnotifyToast[]
  remove: number | string
  toastChanged: SnotifyToast
};

/**
 * this - create, remove, config toasts
 */
export class SnotifyService {
  readonly emitter: Emitter<SnotifyEvents> = mitt<SnotifyEvents>();
  notifications: SnotifyToast[] = [];
  config: SnotifyDefaults = TOAST_DEFAULTS;
  /**
   * emit changes in notifications array
   */
  emit(): void {
    this.emitter.emit('snotify', this.notifications.slice());
  }

  /**
   * returns SnotifyToast object
   */
  get(id: number): SnotifyToast | undefined {
    return this.notifications.find((toast) => toast.id === id);
  }

  /**
   * add SnotifyToast to notifications array
   */
  add(toast: SnotifyToast): void {
    if (this.config.global?.newOnTop) {
      this.notifications.unshift(toast);
    } else {
      this.notifications.push(toast);
    }
    this.emit();
  }

  /**
   * If ID passed, emits toast animation remove, if ID & REMOVE passed, removes toast from notifications array
   */
  remove(id?: number | string, remove?: boolean): void {
    if (!id) {
      return this.clear();
    } else if (remove) {
      this.notifications = this.notifications.filter(
        (toast) => toast.id !== id
      );
      return this.emit();
    }
    this.emitter.emit('remove', id);
  }

  /**
   * Clear notifications array
   */
  clear(): void {
    this.notifications = [];
    this.emit();
  }

  button(
    text: string,
    closeOnClick = true,
    action: (toast?: SnotifyToast) => void = () => undefined,
    bold = false
  ) {
    return {
      text,
      action: closeOnClick
        ? (toast: SnotifyToast) => {
          action(toast);
          this.remove(toast.id);
        }
        : action,
      bold,
    };
  }

  /**
   * Creates toast and add it to array, returns toast id
   */
  create(snotify: Snotify): SnotifyToast | undefined {
    if (this.config.global?.oneAtTime && this.notifications.length !== 0)
      return;
    if (
      this.config.global?.preventDuplicates &&
      this.notifications.filter((t) => t.config?.type === snotify.config?.type)
        .length === 1
    ) {
      return;
    }
    const config = mergeDeep(
      this.config.toast,
      this.config.type && snotify.config?.type
        ? this.config.type[snotify.config.type]
        : undefined,
      snotify.config
    );
    const toast = new SnotifyToast(
      config.id ? config.id : uuid(),
      uuid(),
      snotify.title ?? '',
      snotify.body ?? '',
      config
    );
    this.add(toast);
    return toast;
  }

  setDefaults(defaults: SnotifyDefaults): SnotifyDefaults {
    return (this.config = mergeDeep(this.config, defaults));
  }

  /**
   * Create toast with simple style returns toast id;
   */
  simple(body: string): SnotifyToast | undefined;
  /**
   * Create toast with simple style returns toast id;
   */
  simple(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with simple style returns toast id;
   */
  simple(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with simple style  returns toast id;
   */
  simple(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  simple(args) {
    return this.create(args);
  }

  /**
   * Create toast with success style returns toast id;
   */
  success(body: string): SnotifyToast | undefined;
  /**
   * Create toast with success style returns toast id;
   */
  success(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with success style returns toast id;
   */
  success(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with success style  returns toast id;
   */
  success(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  success(args) {
    return this.create(args);
  }

  /**
   * Create toast with error style returns toast id;
   */
  error(body: string): SnotifyToast | undefined;
  /**
   * Create toast with error style returns toast id;
   */
  error(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with error style returns toast id;
   */
  error(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with error style  returns toast id;
   */
  error(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  error(args) {
    return this.create(args);
  }

  /**
   * Create toast with info style returns toast id;
   */
  info(body: string): SnotifyToast | undefined;
  /**
   * Create toast with info style returns toast id;
   */
  info(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with info style returns toast id;
   */
  info(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with info style  returns toast id;
   */
  info(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  info(args) {
    return this.create(args);
  }

  /**
   * Create toast with warning style returns toast id;
   */
  warning(body: string): SnotifyToast | undefined;
  /**
   * Create toast with warning style returns toast id;
   */
  warning(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with warning style returns toast id;
   */
  warning(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with warning style  returns toast id;
   */
  warning(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  warning(args) {
    return this.create(args);
  }

  /**
   * Create toast with confirm style returns toast id;
   */
  confirm(body: string): SnotifyToast | undefined;
  /**
   * Create toast with confirm style returns toast id;
   */
  confirm(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with confirm style returns toast id;
   */
  confirm(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with confirm style  returns toast id;
   */
  confirm(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  confirm(args) {
    return this.create(args);
  }

  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   */
  prompt(body: string): SnotifyToast | undefined;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   */
  prompt(body: string, title: string): SnotifyToast | undefined;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   */
  prompt(body: string, config: SnotifyToastConfig): SnotifyToast | undefined;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   */
  prompt(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  prompt(args) {
    return this.create(args);
  }

  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   */
  async(body: string, action: () => Promise<Snotify>): SnotifyToast | undefined;
  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   */
  async(
    body: string,
    title: string,
    action: () => Promise<Snotify>
  ): SnotifyToast | undefined;
  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   */
  async(
    body: string,
    action: () => Promise<Snotify>,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   */
  async(
    body: string,
    title: string,
    action: () => Promise<Snotify>,
    config: SnotifyToastConfig
  ): SnotifyToast | undefined;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  async(args) {
    const async = args.action;
    const toast = this.create(args);
    toast?.on('mounted', () => {
      async()
        .then((next: Snotify) => {
          toast.key = uuid();
          this.mergeToast(toast, next, SnotifyStyle.success);
        })
        .catch((error?: Snotify) => {
          toast.key = uuid();
          this.mergeToast(toast, error, SnotifyStyle.error);
        });
    });

    return toast;
  }

  mergeToast(
    toast: SnotifyToast,
    next: Snotify | undefined,
    type?: SnotifyType
  ) {
    if (next?.body) {
      toast.body = next.body;
    }
    if (next?.title) {
      toast.title = next.title;
    }
    if (next?.config) {
      if (type) {
        toast.config = mergeDeep(
          toast.config,
          this.config.global,
          this.config.toast?.[type],
          { type },
          next.config
        );
      } else {
        toast.config = mergeDeep(toast.config, next.config);
      }
    }
    if (next?.html && toast.config) {
      toast.config.html = next.html;
    }
    this.emit();
    this.emitter.emit('toastChanged', toast);
  }

  /**
   * Creates empty toast with html string inside
   */
  html(html: string, config?: SnotifyToastConfig): SnotifyToast | undefined {
    return this.create({
      title: undefined,
      body: undefined,
      config: {
        ...config,
        ...{ html },
      },
    });
  }
}
