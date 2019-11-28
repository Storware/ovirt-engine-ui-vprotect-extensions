import { formatMessage, translateMessage } from './utils/intl'
import messageDescriptors from './intl/messages'

function messageDescriptorsTo (descriptors, transform) {
  const result = {}

  Object.keys(descriptors).forEach(key => {
    const { id, defaultMessage } = descriptors[key]
    result[key] = transform(id, defaultMessage)
  })

  return Object.freeze(result)
}
function messageDescriptorsToFormatFunctions (descriptors) {
  return messageDescriptorsTo(
    descriptors,
    (id, defaultMessage) => (values) => formatMessage(id, defaultMessage, values)
  )
}

function messageDescriptorsToTranslatedMessage (descriptors) {
  return messageDescriptorsTo(
    descriptors,
    (id, defaultMessage) => () => translateMessage(id, defaultMessage)
  )
}

export const msg = messageDescriptorsToFormatFunctions(messageDescriptors)
export const l10n = messageDescriptorsToTranslatedMessage(messageDescriptors)
