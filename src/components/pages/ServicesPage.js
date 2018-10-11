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
    created () {
      console.info('component created...')
    },
    components: {
      'services': 'services'
    }
  }
}