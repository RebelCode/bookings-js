/**
 * Add function service.
 *
 * @injectable
 *
 * @return {function(*, *): *}
 */
export default function add () {
  return (a, b) => a + b
}
