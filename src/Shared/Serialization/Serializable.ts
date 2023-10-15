export default interface Serializable {
  serialize(): Promise<object>;
}
