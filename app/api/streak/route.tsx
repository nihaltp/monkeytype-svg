import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

interface MonkeytypeProfile {
  data?: {
    streak?: number;
    testActivity?: {
      testsByDays?: (number | null)[];
    };
  };
}

// Helper to chunk array into groups of specified size
const chunkArray = (arr: (number | null)[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontSize: 32,
            color: '#e2b714',
            fontWeight: 'bold',
          }}
        >
          Missing username parameter
        </div>
      ),
      { width: 900, height: 200 }
    );
  }

  try {
    const response = await fetch(
      `https://api.monkeytype.com/users/${username}/profile?isUid=false`
    );

    if (!response.ok) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#323437',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: 32,
              color: '#e2b714',
              fontWeight: 'bold',
            }}
          >
            User not found
          </div>
        ),
        { width: 900, height: 200 }
      );
    }

    const data: MonkeytypeProfile = await response.json();
    const streak = data?.data?.streak ?? 0;
    const testsByDays = data?.data?.testActivity?.testsByDays ?? [];

    // Get the last 365 days (or 371 for full weeks)
    const last365 = testsByDays.slice(-365);

    // Calculate max tests for opacity scaling
    const maxTests = Math.max(
      ...last365.filter((val): val is number => val !== null && val !== undefined),
      1
    );

    // Chunk into weeks (7-day groups)
    const weeks = chunkArray(last365, 7);

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#323437',
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            gap: '30px',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        >
          {/* Left Side - Streak Stats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '8px',
              minWidth: '150px',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#e2b714',
                lineHeight: 1,
              }}
            >
              {streak}
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#a0a0a0',
                fontWeight: '500',
              }}
            >
              Current Streak
            </div>
          </div>

          {/* Right Side - Contribution Graph */}
          <div
            style={{
              display: 'flex',
              gap: '3px',
              flexDirection: 'row',
              flex: 1,
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
                  const isZero = dayCount === null || dayCount === 0;
                  const opacity = isZero
                    ? 0.3
                    : Math.min(1, 0.4 + (dayCount! / maxTests) * 0.6);
                  const color = isZero ? '#2c2e31' : '#e2b714';

                  return (
                    <div
                      key={dayIndex}
                      style={{
                        width: '12px',
                        height: '12px',
                        background: color,
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
        width: 900,
        height: 200,
        headers: {
          'Cache-Control': 'public, max-age=14400, s-maxage=14400',
        },
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
            background: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontSize: 32,
            color: '#e2b714',
            fontWeight: 'bold',
          }}
        >
          Error generating image
        </div>
      ),
      { width: 900, height: 200 }
    );
  }
}
