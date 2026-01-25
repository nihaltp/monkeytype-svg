import type { NextRequest } from 'next/server';

interface MonkeytypeProfile {
  data?: {
    streak?: number;
    testActivity?: {
      testsByDays?: (number | null)[];
    };
  };
}

function generateErrorSVG(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="250" fill="#323437"/>
  <text x="400" y="125" fontFamily="'Courier Prime', monospace" fontSize="32" fill="#e2b714" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
    ${message}
  </text>
</svg>`;
}

function generateStreakSVG(streak: number, testsByDays: (number | null)[]): string {
  // Get the last 30 days of activity
  const last30Days = testsByDays.slice(-30);

  // Calculate max value for opacity scaling
  const maxTests = Math.max(
    ...last30Days.filter((val): val is number => val !== null && val !== undefined),
    1
  );

  // Generate heat map squares
  const squareSize = 20;
  const gap = 6;
  let squaresHTML = '';

  last30Days.forEach((tests, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    const x = 440 + col * (squareSize + gap);
    const y = 60 + row * (squareSize + gap);

    const isNull = tests === null || tests === undefined;
    const opacity = isNull ? '1' : Math.max(0.3, tests / maxTests).toFixed(2);
    const color = isNull ? '#646669' : '#e2b714';

    squaresHTML += `    <rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" fill="${color}" opacity="${opacity}" rx="4"/>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="250" fill="#323437"/>
  
  <!-- Streak Number -->
  <text x="60" y="110" fontFamily="'Courier Prime', monospace" fontSize="72" fill="#e2b714" fontWeight="bold">
    ${streak}
  </text>
  
  <!-- Streak Label -->
  <text x="60" y="170" fontFamily="'Courier Prime', monospace" fontSize="20" fill="#a0a0a0" fontWeight="500">
    Current Streak
  </text>
  
  <!-- Activity Heat Map -->
${squaresHTML}</svg>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new Response(generateErrorSVG('Missing username parameter'), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }

  try {
    const response = await fetch(
      `https://api.monkeytype.com/users/${username}/profile?isUid=false`
    );

    if (!response.ok) {
      return new Response(generateErrorSVG('User not found'), {
        status: 404,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }

    const data: MonkeytypeProfile = await response.json();
    const streak = data?.data?.streak ?? 0;
    const testsByDays = data?.data?.testActivity?.testsByDays ?? [];

    const svg = generateStreakSVG(streak, testsByDays);

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=14400, s-maxage=14400',
      },
    });
  } catch (error) {
    console.error('Error generating streak image:', error);
    return new Response(generateErrorSVG('Error generating image'), {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}
