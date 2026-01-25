import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

interface MonkeytypeProfile {
  data?: {
    testActivity?: {
      testsByDays?: (number | null)[];
    };
  };
}

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
            backgroundColor: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#e2b714',
          }}
        >
          Missing username parameter
        </div>
      ),
      { width: 800, height: 150 }
    );
  }

  try {
    const response = await fetch(
      `https://api.monkeytype.com/users/${username}/profile?isUid=false`,
      { next: { revalidate: 60 } }
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
        { width: 800, height: 150 }
      );
    }

    const data: MonkeytypeProfile = await response.json();
    const testsByDays = data?.data?.testActivity?.testsByDays ?? [];

    // Get the last 365 days
    const last365 = testsByDays.slice(-365);

    // Calculate max tests for opacity scaling
    const maxTests = Math.max(
      ...last365.filter((val): val is number => val !== null && val !== undefined),
      1
    );

    // Chunk into weeks (7-day groups)
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < last365.length; i += 7) {
      weeks.push(last365.slice(i, i + 7));
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
                  const isZero = dayCount === null || dayCount === 0;
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
        height: 150,
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
      { width: 800, height: 150 }
    );
  }
}
