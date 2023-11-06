import { JSONSchema } from './types/json-schema'
import { idToName, idToNameSpace } from './lib/idUtils'
import { convertProperties } from './lib/convertProperties'
import { AvroSchema } from './types/avro/avro'
import JsonSchemaDereferencer from '@json-schema-tools/dereferencer'

export * from './types/avro/avro'

export interface IJSONSchemaToAvroOptions {
  deReferenceJsonSchema?: boolean
}

async function convert(
  inputSchema?: JSONSchema,
  options?: IJSONSchemaToAvroOptions,
): Promise<AvroSchema> {
  if (!inputSchema) {
    throw new Error('No schema given')
  }
  const jsonSchema = options?.deReferenceJsonSchema
    ? await new JsonSchemaDereferencer(inputSchema).resolve()
    : inputSchema
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
