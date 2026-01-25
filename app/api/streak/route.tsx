import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

interface MonkeytypeProfile {
  data?: {
    streak?: number;
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
      { width: 800, height: 250 }
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
        { width: 800, height: 250 }
      );
    }

    const data: MonkeytypeProfile = await response.json();
    const streak = data?.data?.streak ?? 0;
    const testsByDays = data?.data?.testActivity?.testsByDays ?? [];

    // Get the last 30 days of activity
    const last30Days = testsByDays.slice(-30);

    // Calculate max value for opacity scaling
    const maxTests = Math.max(
      ...last30Days.filter((val): val is number => val !== null && val !== undefined),
      1
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#323437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 40px',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        >
          {/* Left Side - Streak */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#e2b714',
              }}
            >
              {streak}
            </div>
            <div
              style={{
                fontSize: 20,
                color: '#a0a0a0',
                fontWeight: '500',
              }}
            >
              Current Streak
            </div>
          </div>

          {/* Right Side - Activity Heat Map */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              width: '360px',
              height: '160px',
              alignContent: 'flex-start',
              justifyContent: 'flex-end',
            }}
          >
            {last30Days.map((tests, index) => {
              const isNull = tests === null || tests === undefined;
              const opacity = isNull ? 1 : Math.max(0.3, tests / maxTests);
              const color = isNull ? '#646669' : '#e2b714';

              return (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: color,
                    opacity: opacity.toString(),
                    borderRadius: '4px',
                  }}
                />
              );
            })}
          </div>
        </div>
      ),
      { width: 800, height: 250 }
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
      { width: 800, height: 250 }
    );
  }
}

export const revalidate = 14400; // 4 hours
