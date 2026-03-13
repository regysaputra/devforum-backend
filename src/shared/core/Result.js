class Result {
  constructor(isSuccess, error, value) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }

    if (!isSuccess && !error) {
      throw new Error("InvalidOperation: A failing result needs to contain an error message");
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);  // Make it immutable
  }

  getValue() {
    if (!this.isSuccess) {
      throw new Error("Can't get the value of an error result. Use 'error' instead.");
    }

    return this._value;
  }

  static ok(value) {
    return new Result(true, null, value);
  }

  static fail(error) {
    return new Result(false, error, null);
  }
}

export default Result;