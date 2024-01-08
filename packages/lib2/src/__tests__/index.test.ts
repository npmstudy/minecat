import { describe, expect, it } from 'vitest';

import { lib } from '..';

describe('lib', () => {
  it('should render lib', () => {
    expect(lib()).toBe('lib');
  });
});
