import { MongoClient } from 'mongodb';
import { PerformanceData } from '../types';

let client: MongoClient | null = null;

export async function connectToMongoDB(connectionString: string, dbName: string) {
  try {
    client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db(dbName);
    return { success: true, db };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect to MongoDB' 
    };
  }
}

export async function getPerformanceData(): Promise<PerformanceData[]> {
  if (!client) {
    throw new Error('MongoDB client not initialized');
  }

  try {
    const db = client.db();
    const collection = db.collection('performance_metrics');
    const data = await collection.find().sort({ round: 1 }).toArray();
    return data as PerformanceData[];
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return [];
  }
}

export async function getDashboardStats() {
  if (!client) {
    throw new Error('MongoDB client not initialized');
  }

  try {
    const db = client.db();
    const collection = db.collection('performance_metrics');
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalRounds: { $max: '$round' },
          avgAccuracy: { $avg: '$accuracy' },
          avgF1Score: { $avg: '$f1Score' },
          avgLoss: { $avg: '$loss' }
        }
      }
    ]).toArray();

    return stats[0] || null;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
  }
}