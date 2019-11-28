import { expect } from 'chai'
import { storageUnitTable } from '../constants'
import { convertValue } from './unit-conversion'

describe('convertValue', function () {
  it('scales down the unit when value is too small', function () {
    expect(convertValue(storageUnitTable, 'TiB', 0.001)).to.deep.equal({
      unit: 'GiB', value: 0.001 * 1024
    })
    expect(convertValue(storageUnitTable, 'TiB', 0.000001)).to.deep.equal({
      unit: 'MiB', value: 0.000001 * (1024 ** 2)
    })
    expect(convertValue(storageUnitTable, 'GiB', 0.001)).to.deep.equal({
      unit: 'MiB', value: 0.001 * 1024
    })
  })

  it('scales down the unit when value is too small (custom minimum thresholds)', function () {
    expect(convertValue(storageUnitTable, 'TiB', 0.0499, 0.05)).to.deep.equal({
      unit: 'GiB', value: 0.0499 * 1024
    })
    expect(convertValue(storageUnitTable, 'TiB', 0.051, 0.05)).to.deep.equal({
      unit: 'TiB', value: 0.051
    })
  })

  it('scales up the unit when value is too big', function () {
    expect(convertValue(storageUnitTable, 'MiB', 10000)).to.deep.equal({
      unit: 'GiB', value: 10000 / 1024
    })
    expect(convertValue(storageUnitTable, 'MiB', 10000000)).to.deep.equal({
      unit: 'TiB', value: 10000000 / (1024 ** 2)
    })
    expect(convertValue(storageUnitTable, 'GiB', 10000)).to.deep.equal({
      unit: 'TiB', value: 10000 / 1024
    })
  })

  it('returns the same unit and value when unit is not in the table', function () {
    expect(convertValue(storageUnitTable, 'foo', 1)).to.deep.equal({
      unit: 'foo', value: 1
    })
  })

  it('scale all values down 1 unit', function () {
    expect(convertValue(storageUnitTable, 'TiB', [ 0.0123, 0.0456 ])).to.deep.equal({
      unit: 'GiB',
      value: [ 0.0123 * 1024, 0.0456 * 1024 ]
    })
  })

  it('scale all values, ignoring 0 values', function () {
    expect(convertValue(storageUnitTable, 'MiB', [ 0, 5 * 1024 ** 2, 6 * 1024 ** 2 ])).to.deep.equal({
      unit: 'TiB',
      value: [ 0, 5, 6 ]
    })
  })

  it('scale all values up 2 units', function () {
    expect(convertValue(storageUnitTable, 'MiB', [ (1 * 1024 ** 2), (2 * 1024 ** 2) ])).to.deep.equal({
      unit: 'TiB',
      value: [ 1, 2 ]
    })
  })

  it('no scaling, 1 value in the array is in range', function () {
    expect(convertValue(storageUnitTable, 'TiB', [ 1.01, 0.02 ])).to.deep.equal({
      unit: 'TiB',
      value: [ 1.01, 0.02 ]
    })
  })

  it('returns the same unit and values when unit is not in the table', function () {
    expect(convertValue(storageUnitTable, 'foo', [ 1, 2, 3 ])).to.deep.equal({
      unit: 'foo', value: [ 1, 2, 3 ]
    })
  })
})
