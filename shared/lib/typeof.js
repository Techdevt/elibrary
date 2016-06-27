const stringConstructor = "test".constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;

const typeOf = (object) => {
    if (object === null) {
        return "null";
    }
    else if (object === undefined) {
        return "undefined";
    }
    else if (object.constructor === stringConstructor) {
        return "string";
    }
    else if (object.constructor === arrayConstructor) {
        return "array";
    }
    else if (object.constructor === objectConstructor) {
        return "object";
    }
    else {
        return typeof object;
    }
};

export default typeOf;