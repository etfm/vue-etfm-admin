import { filterValidOptions, isValidPreferenceKey } from '../../../src/plugin/plugin-utils';

import { vi, describe, it, expect } from 'vitest';

describe('plugin utils 测试', () => {
  it('isValidPreferenceKey', () => {
    // @ts-ignore
    expect(isValidPreferenceKey('x')).toBeFalsy();
    // @ts-ignore
    expect(isValidPreferenceKey('x', { properties: {} })).toBeFalsy();
    // @ts-ignore
    expect(isValidPreferenceKey('x', { properties: 1 })).toBeFalsy();
    // @ts-ignore
    expect(isValidPreferenceKey('x', { properties: 'str' })).toBeFalsy();
    // @ts-ignore
    expect(isValidPreferenceKey('x', { properties: [] })).toBeFalsy();
    expect(
      isValidPreferenceKey('x', {
        title: 'title',
        properties: [
          {
            key: 'y',
            type: 'string',
            description: 'x desc',
          },
        ],
      }),
    ).toBeFalsy();
    expect(
      isValidPreferenceKey('x', {
        title: 'title',
        properties: [
          {
            key: 'x',
            type: 'string',
            description: 'x desc',
          },
        ],
      }),
    ).toBeTruthy();
  });

  it('filterValidOptions', () => {
    const mockDeclaration = {
      title: 'title',
      properties: [
        {
          key: 'x',
          type: 'string',
          description: 'x desc',
        },
        {
          key: 'y',
          type: 'string',
          description: 'y desc',
        },
        {
          key: 'z',
          type: 'string',
          description: 'z desc',
        },
      ],
    };
    // @ts-ignore
    expect(filterValidOptions()).toBeUndefined();
    // @ts-ignore
    expect(filterValidOptions(1)).toBe(1);
    expect(
      filterValidOptions(
        {
          x: 1,
          y: 2,
        },
        mockDeclaration,
      ),
    ).toEqual({
      x: 1,
      y: 2,
    });
    expect(
      filterValidOptions(
        {
          x: 1,
          y: undefined,
        },
        mockDeclaration,
      ),
    ).toEqual({
      x: 1,
    });
    expect(
      filterValidOptions(
        {
          x: 1,
          z: null,
        },
        mockDeclaration,
      ),
    ).toEqual({
      x: 1,
    });
    expect(
      filterValidOptions(
        {
          a: 1,
        },
        mockDeclaration,
      ),
    ).toEqual({});
  });
});
