# Inshallah Adel Arrives

> A time zone converter for when your friend lives in a different temporal dimension. Predicts when Adel will actually arrive based on when he says he'll arrive.

## Features

- 🕐 **Adel Standard Time (AST)** - Convert normal time to Adel time
- 🤖 **Machine Learning** - Learns from historical lateness patterns
- 📊 **Statistics Dashboard** - Analyze lateness patterns by time/day
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎯 **Confidence Metrics** - Know how reliable predictions are

## Tech Stack

- Frontend: Angular 17+
- Backend: Node.js + Express
- ML: TensorFlow.js
- Database: SQLite

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/inshallah-adel-arrives.git
cd inshallah-adel-arrives
```

2. Install dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. Run development servers
```bash
npm run dev
```

Frontend: http://localhost:4200
Backend: http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Entries
- `POST /api/entries` - Record new entry
- `GET /api/entries` - Get all entries
- `GET /api/entries/:id` - Get specific entry
- `DELETE /api/entries/:id` - Delete entry

### Predictions
- `POST /api/predictions/predict` - Get prediction
- `GET /api/predictions/model-info` - Get model information

### Statistics
- `GET /api/statistics/summary` - Overall statistics
- `GET /api/statistics/by-hour` - Stats by hour of day
- `GET /api/statistics/by-day` - Stats by day of week

## License

MIT - Because sharing laughter about lateness should be free
