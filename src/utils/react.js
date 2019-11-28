import React from 'react'

// TODO(vs): This is only used by jQuery-based Tooltip component, remove this
// once that component gets replaced by patternfly-react equivalent component.
export function cloneElementWithCustomRef (reactElement, customRef, props = {}) {
  return React.cloneElement(reactElement, Object.assign({}, props, {
    ref: (e) => {
      // invoke custom callback ref
      customRef(e)

      // invoke existing callback ref, if it's defined
      if (typeof reactElement.ref === 'function') {
        reactElement.ref(e)
      }
    }
  }))
}

export function propNamesToType (names, propType) {
  const nameList = Array.isArray(names) ? names : Object.keys(names)
  return nameList.reduce(
    (acc, name) => { acc[name] = propType; return acc },
    {}
  )
}

export function selectProps (props, keys) {
  const keyList = Array.isArray(keys) ? keys : Object.keys(keys)
  const selected = keyList.reduce(
    (acc, key) => {
      if (props[key]) {
        acc[key] = props[key]
      }
      return acc
    },
    {}
  )
  return selected
}
