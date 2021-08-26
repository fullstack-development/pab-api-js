export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      anyOrNull(expectedType: any): R;
      toEqualOrNull(expectedObject: any): R;
      toEqualInArray(expectedObject: any): R;
      emptyArray(): R;
    }
    interface Expect {
      anyOrNull(expectedType: any): any;
      toEqualOrNull(expectedObject: any): any;
      toEqualInArray(expectedObject: any): any;
      emptyArray(): any;
    }
  }
}

const OK = {
  message: () => 'Ok',
  pass: true,
};

expect.extend({
  anyOrNull(received, argument) {
    if (received === null || expect(received).toEqual(expect.any(argument)) === undefined)
      return OK;
  },
  toEqualOrNull(received, argument) {
    if (received === null || expect(received).toEqual(argument) === undefined) return OK;
  },
  toEqualInArray(received, argument) {
    if (
      Array.isArray(received) &&
      received.every((el) => expect(el).toEqual(argument) === undefined)
    )
      return OK;
  },
  emptyArray(received) {
    if (expect(received).toEqual([]) === undefined) return OK;
  },
});
