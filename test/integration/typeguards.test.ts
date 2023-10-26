import assert from 'assert'
import convert, { isAvroArraySchema, isAvroRecordSchema } from '../../src'
import * as fs from 'fs'
import * as path from 'path'
import { AvroSchema } from '../../src/types/avro/avro'

async function convertSchema(sampleName: string): Promise<AvroSchema> {
  const jsonSchemaPath = path.join(
    __dirname,
    `./samples/${sampleName}/input.json`,
  )
  const jsonSchema = await fs.promises.readFile(jsonSchemaPath, 'utf-8')
  return convert(JSON.parse(jsonSchema))
}

describe('type guards', () => {
  let recordSchema: AvroSchema
  let arraySchema: AvroSchema

  before(async () => {
    recordSchema = await convertSchema('simple')
    arraySchema = await convertSchema('root_array')
  })

  it('validates record schema', () => {
    assert.strictEqual(isAvroRecordSchema(recordSchema), true)
    assert.strictEqual(isAvroRecordSchema(arraySchema), false)
  })

  it('validates array schema', () => {
    assert.strictEqual(isAvroArraySchema(arraySchema), true)
    assert.strictEqual(isAvroArraySchema(recordSchema), false)
  })
})
