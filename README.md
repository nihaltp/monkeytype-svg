# Monkeytype Streak SVG

A dynamic SVG generator that visualizes your Monkeytype daily streak and activity over the last year. It generates a contribution graph similar to GitHub's, perfect for displaying on your GitHub profile or personal website.

## Usage

You can generate your streak image by using the following URL structure:

```
https://monkeytype-svg.vercel.app/api/streak?username=YOUR_USERNAME
```

Replace `YOUR_USERNAME` with your actual Monkeytype username.

### Example

![Streak](https://monkeytype-svg.vercel.app/api/streak?username=nihaltp)

```markdown
![Streak](https://monkeytype-svg.vercel.app/api/streak?username=nihaltp)
```

## Development

This project is built with [Next.js](https://nextjs.org/) (App Router) and TypeScript.

### Prerequisites

- Node.js
- pnpm

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.
   To test the API endpoint locally, visit: `http://localhost:3000/api/streak?username=nihaltp`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
