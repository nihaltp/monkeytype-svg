import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const REVALIDATE_SECONDS = parseInt(process.env.MONKEYTYPE_REVALIDATE_SECONDS || '60', 10);

// Strict cache headers to prevent GitHub Camo and other proxies from serving stale images.
// We use 'no-store' to ensure the user always sees the most up-to-date server response,
// although the upstream Monkeytype data may be cached for REVALIDATE_SECONDS.
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();

  if (!username || username.length > 64) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#e2b714',
          }}
        >
          Invalid username
        </div>
      ),
      { width: 800, height: 250, headers: CACHE_HEADERS }
    );
  }

  try {
    const response = await fetch(
      `https://api.monkeytype.com/users/${encodeURIComponent(username)}/profile?isUid=false`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );

    if (!response.ok) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#323437',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#e2b714',
            }}
          >
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
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '3px',
              flexDirection: 'row',
            }}
          >
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                {week.map((dayCount, dayIndex) => {
                  const isFuture = dayCount === -1;
                  const isZero = dayCount === null || dayCount === 0;

                  // Future days are transparent
                  if (isFuture) {
                     return (
                      <div
                        key={dayIndex}
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: 'transparent',
                          borderRadius: '2px',
                        }}
                      />
                    );
                  }

                  const opacity = isZero
                    ? 0.4
                    : Math.min(1, 0.4 + (dayCount! / maxTests) * 0.6);
                  const color = isZero ? '#2c2e31' : '#e2b714';

                  return (
                    <div
                      key={dayIndex}
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: color,
                        opacity: opacity,
                        borderRadius: '2px',
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
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#e2b714',
          }}
        >
          Error generating image
        </div>
      ),
      { width: 800, height: 250, headers: CACHE_HEADERS }
    );
  }
}
