import { JSONSchema } from './types/json-schema'
import { idToName, idToNameSpace } from './lib/idUtils'
import { convertProperties } from './lib/convertProperties'
import { AvroSchema } from './types/avro/avro'

export * from './types/avro/avro'

function convert(jsonSchema?: JSONSchema): AvroSchema {
  if (!jsonSchema) {
    throw new Error('No schema given')
  }
  const name = idToName(jsonSchema, 'main')
  const convertedProperties = convertProperties(jsonSchema, [], name)
  const namespace = idToNameSpace(jsonSchema)
  return {
    name,
    ...convertedProperties,
    ...(jsonSchema.description &&
      convertedProperties.type !== 'array' && { doc: jsonSchema.description }),
    ...(namespace && { namespace }),
  }
}

export default convert
