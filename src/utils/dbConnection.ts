import { connectToMongoDB } from '../services/mongodb';

interface ConnectionResult {
  success: boolean;
  error?: string;
}

export async function testConnection(connectionString: string, dbName: string): Promise<ConnectionResult> {
  try {
    const result = await connectToMongoDB(connectionString, dbName);
    if (!result.success) {
      throw new Error(result.error);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}