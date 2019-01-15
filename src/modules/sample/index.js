import add from './utils/add'
import SomeClass from 'SomeClass'
import components from './components'

export const services = {
  add,

  /**
   * These services are going to be registered. They will be
   * created by Bottle once someone need them.
   *
   * 'someClass' object (instance of `SomeClass`),
   * 'SomeClass' constructor.
   */
  SomeClass,

  /**
   * If you need own instance of `SomeClass`, you can create it using
   * the automatically resolved `SomeClass` constructor.
   *
   * @param {class} SomeClass SomeClass constructor.
   *
   * @return {SomeClass}
   */
  mySomeClass: function (SomeClass) {
    return new SomeClass('great job')
  },

  ...components
}
