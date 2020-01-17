/* class decorator */
export function staticImplements<T>() {
    return <R extends T>(constructor: R) => constructor;
}
