/**
 * Validation result that holds boolean result of validation
 * and list of errors that occurred during validation.
 *
 * @since [*next-version*]
 *
 * @class ValidationResult
 */
export default class ValidationResult {
  /**
   * ValidationResult constructor.
   *
   * @since [*next-version*]
   *
   * @param {boolean} valid Is validation successful.
   * @param {Object.<string, string[]>} errorsBag List of fields and corresponding errors (if there are some).
   */
  constructor (valid, errorsBag) {
    this.valid = valid
    this.errorsBag = errorsBag
  }

  /**
   * Check that field has some validation error.
   *
   * @since [*next-version*]
   *
   * @param {string} field Field to check.
   *
   * @return {boolean} Whether this field has validation error.
   */
  hasError (field) {
    return !!this.errorsBag[field]
  }

  /**
   * Get field validation errors.
   *
   * @since [*next-version*]
   *
   * @param {string} field Field to get errors for.
   *
   * @return {string[]} Errors messages for field.
   */
  getError (field) {
    return this.errorsBag[field]
  }

  /**
   * Get all validation errors.
   *
   * @since [*next-version*]
   *
   * @return {Object.<string, string[]>} List of fields and corresponding errors (if there are some).
   */
  allErrors () {
    return this.errorsBag
  }
}