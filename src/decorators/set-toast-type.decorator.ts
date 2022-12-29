/**
 * Defines toast style depending on method name
 */
export function SetToastType(target, propertyKey, descriptor) {
  return {
    value: function (...args) {
      args[0].config = {
        ...args[0].config,
        type: propertyKey,
      };
      return descriptor.value.apply(this, args);
    },
  };
}
