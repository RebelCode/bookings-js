/**
 * Component for the services page.
 *
 * @since [*next-version*]
 *
 * @return {object} Services page component.
 */
export default function () {
  return {
    inject: {
      'services': 'services',
      '_': {
        from: 'translate'
      }
    },
    components: {
      'services': 'services'
    }
  }
}