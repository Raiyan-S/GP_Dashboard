import { connectToMongoDB } from '../services/mongodb';

export async function testConnection(connectionString, dbName) {
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