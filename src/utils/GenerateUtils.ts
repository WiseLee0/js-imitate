function* generate(arr: any[]) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}
export default class GeneratorUtils {
  static run(params: string | any[]) {
    if (typeof params === "string") {
      return generate([...params]);
    }
    return generate(params);
  }
}
