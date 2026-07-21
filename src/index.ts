import { JSONSchema } from './types/json-schema'
import { idToName, idToNameSpace } from './lib/idUtils'
import { convertProperties } from './lib/convertProperties'
import { AvroSchema } from './types/avro/avro'
import JsonSchemaDereferencerExport from '@json-schema-tools/dereferencer'

export * from './types/avro/avro'
export * from './types/json-schema'

// @json-schema-tools/dereferencer is CJS with a tsc-style `exports.default`;
// under Node ESM interop the default import is the whole `module.exports`
// object, while under CJS it is the class itself — unwrap both shapes.
type Dereferencer = typeof JsonSchemaDereferencerExport
const JsonSchemaDereferencer: Dereferencer =
  (JsonSchemaDereferencerExport as Dereferencer & { default?: Dereferencer })
    .default ?? JsonSchemaDereferencerExport

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

export { convert }
export default convert
