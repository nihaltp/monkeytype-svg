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
<svg width="900" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="200" fill="#323437"/>
  <text x="450" y="100" fontFamily="monospace" fontSize="32" fill="#e2b714" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
    ${message}
  </text>
</svg>`;
}

function generateStreakSVG(streak: number, testsByDays: (number | null)[]): string {
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

  // Generate SVG rectangles for the heatmap
  let squaresHTML = '';
  let xPos = 180;
  const squareSize = 12;
  const gap = 3;

  weeks.forEach((week, weekIndex) => {
    week.forEach((dayCount, dayIndex) => {
      const yPos = 40 + dayIndex * (squareSize + gap);
      const isZero = dayCount === null || dayCount === 0;
      const opacity = isZero
        ? '0.3'
        : Math.min(1, 0.4 + (dayCount! / maxTests) * 0.6).toFixed(2);
      const color = isZero ? '#2c2e31' : '#e2b714';

      squaresHTML += `    <rect x="${xPos}" y="${yPos}" width="${squareSize}" height="${squareSize}" fill="${color}" opacity="${opacity}" rx="2"/>\n`;
    });

    xPos += squareSize + gap;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="900" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="900" height="200" fill="#323437"/>
  
  <!-- Streak Number -->
  <text x="40" y="70" fontFamily="monospace" fontSize="56" fill="#e2b714" fontWeight="bold">
    ${streak}
  </text>
  
  <!-- Streak Label -->
  <text x="40" y="110" fontFamily="monospace" fontSize="14" fill="#a0a0a0" fontWeight="500">
    Current Streak
  </text>
  
  <!-- Contribution Heatmap -->
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
