const { sortCompactToStr } = require('.')

describe('Utils', () => {
  test('sortCompactToStr', () => {
    const result = sortCompactToStr('createdAt', 'desc')
    expect(result).toEqual('-createdAt')
  })
})
