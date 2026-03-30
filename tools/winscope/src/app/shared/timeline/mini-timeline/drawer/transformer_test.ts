/*
 * Copyright (C) 2023 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {makeConverterZeroRteOffsets, makeRealTimestamp,} from '@common/time/testing/test_helpers';
import {TimeRange} from '@common/time/time';

import {Transformer} from './transformer';

describe('Transformer', () => {
  const converter = makeConverterZeroRteOffsets();

  it('can transform', () => {
    const fromRange = new TimeRange(
      makeRealTimestamp(BigInt(1689763211000000000)),
      makeRealTimestamp(BigInt(1689763571000000000)),
    );
    const toRange = {
      from: 100,
      to: 1100,
    };
    const transformer = new Transformer(fromRange, toRange, converter);

    const rangeStart = fromRange.startNs;
    const rangeEnd = fromRange.endNs;
    const range = fromRange.endNs - fromRange.startNs;

    expect(transformer.transform(fromRange.from)).toBe(toRange.from);
    expect(transformer.transform(fromRange.to)).toBe(toRange.to);

    expect(
      transformer.transform(makeRealTimestamp(rangeStart + range / BigInt(2))),
    ).toBe(toRange.from + (toRange.to - toRange.from) / 2);
    expect(
      transformer.transform(makeRealTimestamp(rangeStart + range / BigInt(4))),
    ).toBe(toRange.from + (toRange.to - toRange.from) / 4);
    expect(
      transformer.transform(makeRealTimestamp(rangeStart + range / BigInt(20))),
    ).toBe(toRange.from + (toRange.to - toRange.from) / 20);

    expect(
      transformer.transform(makeRealTimestamp(rangeStart - range / BigInt(2))),
    ).toBe(toRange.from - (toRange.to - toRange.from) / 2);
    expect(
      transformer.transform(makeRealTimestamp(rangeEnd + range / BigInt(2))),
    ).toBe(toRange.to + (toRange.to - toRange.from) / 2);
  });

  it('can untransform', () => {
    const fromRange = new TimeRange(
      makeRealTimestamp(1689763211000000000n),
      makeRealTimestamp(1689763571000000000n),
    );
    const toRange = {
      from: 100,
      to: 1100,
    };
    const transformer = new Transformer(fromRange, toRange, converter);

    const rangeStart = fromRange.startNs;
    const range = fromRange.endNs - fromRange.startNs;

    expect(transformer.untransform(toRange.from).getValueNs()).toBe(
      fromRange.startNs,
    );
    expect(transformer.untransform(toRange.to).getValueNs()).toBe(
      fromRange.endNs,
    );

    expect(
      transformer
        .untransform(toRange.from + (toRange.to - toRange.from) / 2)
        .getValueNs(),
    ).toBe(rangeStart + range / BigInt(2));
    expect(
      transformer
        .untransform(toRange.from + (toRange.to - toRange.from) / 4)
        .getValueNs(),
    ).toBe(rangeStart + range / BigInt(4));
    expect(
      transformer
        .untransform(toRange.from + (toRange.to - toRange.from) / 20)
        .getValueNs(),
    ).toBe(rangeStart + range / BigInt(20));

    expect(
      transformer
        .untransform(toRange.from - (toRange.to - toRange.from) / 2)
        .getValueNs(),
    ).toBe(rangeStart - range / BigInt(2));
    expect(
      transformer
        .untransform(toRange.from + (toRange.to - toRange.from) / 2)
        .getValueNs(),
    ).toBe(rangeStart + range / BigInt(2));
  });
});
