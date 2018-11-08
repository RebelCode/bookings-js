import template from './template.html'

/**
 * The staff members list component.
 *
 * @since [*next-version*]
 *
 * @param mapStore
 *
 * @return {*}
 */
export default function (makeItemsListMixin, mapStore) {
  return {
    ...template,
    mixins: [
      makeItemsListMixin(mapStore, 'staffMembers')
    ]
  }
}
