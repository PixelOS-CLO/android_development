/*
 * Copyright (C) 2026 The Android Open Source Project
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

import {UTC_TIMEZONE_INFO} from '@common/time/timestamp_converter';

import {toJSON, TraceMetadata} from './trace_metadata';

describe('TraceMetadata', () => {
  it('toJSON returns undefined for empty metadata', () => {
    const metadata: TraceMetadata = {};
    expect(toJSON(metadata)).toBeUndefined();
  });

  it('toJSON returns undefined for metadata with undefined values', () => {
    const metadata: TraceMetadata = {
      timezoneInfo: undefined,
      screenRecordingOffsets: undefined,
    };
    expect(toJSON(metadata)).toBeUndefined();
  });

  it('toJSON returns metadata for non-empty metadata', () => {
    const metadata: TraceMetadata = {
      screenRecordingOffsets: {
        elapsedRealTimeNanos: 123n,
        realToElapsedTimeOffsetNanos: 456n,
      },
      timezoneInfo: UTC_TIMEZONE_INFO,
    };
    expect(toJSON(metadata)).toEqual(
      '{"screenRecordingOffsets":{"elapsedRealTimeNanos":"123","realToElapsedTimeOffsetNanos":"456"},"timezoneInfo":{"timezone":"UTC","locale":"en-US"}}',
    );
  });
});
