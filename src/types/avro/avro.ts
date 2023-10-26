import { schema as avsc } from 'avsc'

/**
 * Subset of Avro types used in the conversion from JSON schema to Avro schema
 */

export interface AvroSchemaField {
  name: string
  doc?: string
  type: AvroComplexType | AvroSchemaRecordType | string | string[]
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  default?: any
  order?: 'ascending' | 'descending' | 'ignore'
}
export interface AvroSchemaRecordType {
  type: 'record' | 'error'
  name: string
  namespace?: string
  doc?: string
  aliases?: string[]
  fields: AvroSchemaField[]
  [key: string]: unknown
}
export interface AvroSchemaArrayType {
  type: 'array'
  items: AvroSchemaType
}

export type AvroComplexType =
  | avsc.EnumType
  | avsc.NamedType
  | AvroSchemaArrayType
  | AvroSchemaRecordType
export type AvroSchemaArrayField = AvroSchemaField & {
  type: AvroSchemaArrayType
}
export type AvroSchemaType = AvroDefinedType | AvroDefinedType[]
export type AvroDefinedType = avsc.PrimitiveType | AvroComplexType | string

export interface AvroBaseSchema {
  name: string
  namespace?: string
  doc?: string
}
export type AvroArraySchema = AvroBaseSchema & AvroSchemaArrayType
export type AvroSchema = AvroArraySchema | AvroSchemaRecordType

export function isAvroRecordSchema(
  schema: AvroSchema,
): schema is AvroSchemaRecordType {
  return (
    (<AvroSchemaRecordType>schema).name !== undefined &&
    ((<AvroSchemaRecordType>schema).type === 'record' ||
      (<AvroSchemaRecordType>schema).type === 'error') &&
    Array.isArray((<AvroSchemaRecordType>schema).fields)
  )
}

export function isAvroArraySchema(
  schema: AvroSchema,
): schema is AvroArraySchema {
  return (
    (<AvroArraySchema>schema).type === 'array' &&
    (<AvroArraySchema>schema).name !== undefined &&
    (<AvroArraySchema>schema).items !== undefined
  )
}
