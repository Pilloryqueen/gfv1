export default function defined(name) {
  return this[name] !== undefined && this[name] !== null;
}
