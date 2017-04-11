var compare = require('./compare-abc-to-svg');

describe('Rendering tests', function () {
  it('should compare', function () {
    return compare('/input/aaa_high_note.abc', '/input/aaa_high_note.svg');
  });
});
