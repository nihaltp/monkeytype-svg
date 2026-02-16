import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

// Strict cache headers to prevent GitHub Camo and other proxies from serving stale images.
// We use 'no-store' to ensure the user always sees the most up-to-date stats.
const CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};

interface MonkeytypeProfile {
  data?: {
    testActivity?: {
      testsByDays?: (number | null)[];
    };
  };
}

const ERROR_STYLE = {
  width: '100%',
  height: '100%',
  backgroundColor: '#323437',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  color: '#e2b714',
} as const;

const CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  backgroundColor: '#323437',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box' as const,
} as const;

const GRID_STYLE = {
  display: 'flex',
  gap: '3px',
  flexDirection: 'row' as const,
} as const;

const WEEK_STYLE = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '3px',
} as const;

const BASE_DAY_STYLE = {
  width: '10px',
  height: '10px',
  borderRadius: '2px',
} as const;

const FUTURE_DAY_STYLE = {
  ...BASE_DAY_STYLE,
  backgroundColor: 'transparent',
} as const;

const ZERO_DAY_STYLE = {
  ...BASE_DAY_STYLE,
  backgroundColor: '#2c2e31',
  opacity: 0.4,
} as const;

const ACTIVE_DAY_BASE_STYLE = {
  ...BASE_DAY_STYLE,
  backgroundColor: '#e2b714',
} as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new ImageResponse(
      (
        <div style={ERROR_STYLE}>
          Missing username parameter
        </div>
      ),
      { width: 800, height: 250, headers: CACHE_HEADERS }
    );
  }

  try {
    const response = await fetch(
      `https://api.monkeytype.com/users/${username}/profile?isUid=false`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return new ImageResponse(
        (
          <div style={ERROR_STYLE}>
            User not found
          </div>
        ),
        { width: 800, height: 250, headers: CACHE_HEADERS }
      );
    }

    const data: MonkeytypeProfile = await response.json();
    const testsByDays = data?.data?.testActivity?.testsByDays ?? [];

    // Calculate alignment
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    // We want to show 53 weeks to ensure full coverage
    const totalWeeks = 53;
    const totalDays = totalWeeks * 7;

    // Create a grid initialized with -1 (representing "future" days)
    const gridData: (number | null)[] = new Array(totalDays).fill(-1);

    // Calculate where the last data point (Today) should go in our grid.
    // The grid is a flat array representing 53 columns of 7 rows.
    // Column 52 (index 52) is the last column.
    // The cell for today is at index: (52 * 7) + dayOfWeek
    const gridEndIndex = (totalWeeks - 1) * 7 + dayOfWeek;

    // We populate the grid backwards from today
    // We take data from testsByDays backwards
    const availableDataPoints = testsByDays.length;

    // Iterate backwards through the grid starting from today's position
    for (let i = 0; i <= gridEndIndex; i++) {
      // The index in testsByDays corresponding to this grid position
      // gridEndIndex corresponds to availableDataPoints - 1 (the last item)
      // gridEndIndex - i corresponds to availableDataPoints - 1 - i

      const dataIndex = availableDataPoints - 1 - i;

      if (dataIndex >= 0) {
        gridData[gridEndIndex - i] = testsByDays[dataIndex];
      } else {
        // No more data available, fill remaining past slots with 0 (null) if needed,
        // but testsByDays usually has history. If we run out, it's effectively 0.
        // However, we initialized with -1, so we should explicitly set past days to 0 (null) if we run out of data
        gridData[gridEndIndex - i] = null;
      }
    }

    // For indices *after* gridEndIndex, they remain -1 (future).

    // Determine max tests for opacity scaling based on the visible data (excluding -1)
    const visibleValues = gridData.filter((val): val is number => val !== null && val !== undefined && val !== -1);
    const maxTests = visibleValues.length > 0 ? Math.max(...visibleValues, 1) : 1;

    // Chunk into weeks (7-day groups)
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < totalDays; i += 7) {
      weeks.push(gridData.slice(i, i + 7));
    }

    return new ImageResponse(
      (
        <div style={CONTAINER_STYLE}>
          <div style={GRID_STYLE}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} style={WEEK_STYLE}>
                {week.map((dayCount, dayIndex) => {
                  const isFuture = dayCount === -1;
                  const isZero = dayCount === null || dayCount === 0;

                  // Future days are transparent
                  if (isFuture) {
                    return (
                      <div key={dayIndex} style={FUTURE_DAY_STYLE} />
                    );
                  }

                  if (isZero) {
                    return (
                      <div key={dayIndex} style={ZERO_DAY_STYLE} />
                    );
                  }

                  const opacity = Math.min(1, 0.4 + (dayCount! / maxTests) * 0.6);

                  return (
                    <div
                      key={dayIndex}
                      style={{
                        ...ACTIVE_DAY_BASE_STYLE,
                        opacity: opacity,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 800,
        height: 250,
        headers: CACHE_HEADERS,
      }
    );
  } catch (error) {
    console.error('Error generating streak image:', error);
    return new ImageResponse(
      (
        <div style={ERROR_STYLE}>
          Error generating image
        </div>
      ),
      { width: 800, height: 250, headers: CACHE_HEADERS }
    );
  }
}
