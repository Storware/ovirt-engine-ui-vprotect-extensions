import { expect } from 'chai'
import { round } from './round'

describe('rounding precision tests', function () {
  it('rounding to tens', function () {
    expect(round(12344, -1)).to.equal(12340)
    expect(round(12345, -1)).to.equal(12350)
    expect(round(12344, -2)).to.equal(12300)
    expect(round(12354, -2)).to.equal(12400)
    expect(round(12445, -3)).to.equal(12000)
    expect(round(12545, -3)).to.equal(13000)
  })

  it('rounding to integer', function () {
    expect(round(12345)).to.equal(12345)
    expect(round(12345, 0)).to.equal(12345)
    expect(round(12345.4, 0)).to.equal(12345)
    expect(round(12345.5, 0)).to.equal(12346)
  })

  it('rounding to decimals', function () {
    expect(round(1.2345, 1)).to.equals(1.2)
    expect(round(1.2567, 1)).to.equals(1.3)
    expect(round(1.2345, 2)).to.equals(1.23)
    expect(round(1.2356, 2)).to.equals(1.24)
    expect(round(1.2344, 3)).to.equals(1.234)
    expect(round(1.2345, 3)).to.equals(1.235)
  })
})
