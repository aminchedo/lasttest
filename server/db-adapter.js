// Database adapter to make SQL queries work with lowdb
import { runAsync as lowdbRun, getAsync as lowdbGet, allAsync as lowdbAll } from './db.js';

// Parse SQL queries and convert to lowdb operations
function parseSQLQuery(sql, params = []) {
  const trimmedSQL = sql.trim().toUpperCase();
  
  if (trimmedSQL.startsWith('SELECT')) {
    return parseSelectQuery(sql, params);
  } else if (trimmedSQL.startsWith('INSERT')) {
    return parseInsertQuery(sql, params);
  } else if (trimmedSQL.startsWith('UPDATE')) {
    return parseUpdateQuery(sql, params);
  } else if (trimmedSQL.startsWith('DELETE')) {
    return parseDeleteQuery(sql, params);
  }
  
  throw new Error(`Unsupported SQL query: ${sql}`);
}

function parseSelectQuery(sql, params) {
  // Extract table name from SELECT query
  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  if (!tableMatch) throw new Error('No table found in SELECT query');
  
  const tableName = tableMatch[1];
  
  // Extract WHERE conditions
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
  let conditions = {};
  
  if (whereMatch) {
    const whereClause = whereMatch[1];
    // Simple WHERE parsing - handle basic conditions
    if (whereClause.includes('=')) {
      const parts = whereClause.split('=');
      if (parts.length === 2) {
        const key = parts[0].trim();
        let value = parts[1].trim().replace(/['"]/g, '');
        
        // Handle parameterized queries
        if (value === '?') {
          value = params[0];
        }
        
        conditions[key] = value;
      }
    }
  }
  
  return { operation: 'SELECT', tableName, conditions };
}

function parseInsertQuery(sql, params) {
  const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
  if (!tableMatch) throw new Error('No table found in INSERT query');
  
  const tableName = tableMatch[1];
  
  // Extract column names from INSERT INTO table (col1, col2, ...) VALUES
  const columnsMatch = sql.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)/i);
  const valuesMatch = sql.match(/VALUES\s*\(([^)]+)\)/i);
  
  if (!valuesMatch) throw new Error('No VALUES found in INSERT query');
  
  const values = valuesMatch[1].split(',').map(v => v.trim().replace(/['"]/g, ''));
  
  // Create data object from values and params
  const data = {};
  let paramIndex = 0;
  
  values.forEach((value, index) => {
    if (value === '?') {
      // Use parameter value
      if (params[paramIndex] !== undefined) {
        // Use column name if available, otherwise use generic name
        const columnName = columnsMatch ? columnsMatch[1].split(',').map(c => c.trim())[index] : `col_${index}`;
        data[columnName] = params[paramIndex];
        paramIndex++;
      }
    } else {
      const columnName = columnsMatch ? columnsMatch[1].split(',').map(c => c.trim())[index] : `col_${index}`;
      data[columnName] = value;
    }
  });
  
  return { operation: 'INSERT', tableName, data };
}

function parseUpdateQuery(sql, params) {
  const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (!tableMatch) throw new Error('No table found in UPDATE query');
  
  const tableName = tableMatch[1];
  
  // Extract SET clause
  const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
  if (!setMatch) throw new Error('No SET clause found in UPDATE query');
  
  const setClause = setMatch[1];
  const data = {};
  
  // Parse SET clause
  const assignments = setClause.split(',');
  assignments.forEach(assignment => {
    const [key, value] = assignment.split('=').map(s => s.trim());
    if (value === '?') {
      // Use parameter value
      const paramIndex = params.findIndex(p => p !== undefined);
      if (paramIndex !== -1) {
        data[key] = params[paramIndex];
      }
    } else {
      data[key] = value.replace(/['"]/g, '');
    }
  });
  
  // Extract WHERE clause
  const whereMatch = sql.match(/WHERE\s+(.+?)$/i);
  let conditions = {};
  
  if (whereMatch) {
    const whereClause = whereMatch[1];
    if (whereClause.includes('=')) {
      const parts = whereClause.split('=');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim().replace(/['"]/g, '');
        conditions[key] = value;
      }
    }
  }
  
  return { operation: 'UPDATE', tableName, data, conditions };
}

function parseDeleteQuery(sql, params) {
  const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  if (!tableMatch) throw new Error('No table found in DELETE query');
  
  const tableName = tableMatch[1];
  
  // Extract WHERE conditions
  const whereMatch = sql.match(/WHERE\s+(.+?)$/i);
  let conditions = {};
  
  if (whereMatch) {
    const whereClause = whereMatch[1];
    if (whereClause.includes('=')) {
      const parts = whereClause.split('=');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim().replace(/['"]/g, '');
        conditions[key] = value;
      }
    }
  }
  
  return { operation: 'DELETE', tableName, conditions };
}

// Wrapper functions that maintain SQL compatibility
export async function runAsync(sql, params = []) {
  try {
    const parsed = parseSQLQuery(sql, params);
    
    if (parsed.operation === 'INSERT') {
      return await lowdbRun(parsed.tableName, 'INSERT', parsed.data);
    } else if (parsed.operation === 'UPDATE') {
      return await lowdbRun(parsed.tableName, 'UPDATE', { ...parsed.data, ...parsed.conditions });
    } else if (parsed.operation === 'DELETE') {
      return await lowdbRun(parsed.tableName, 'DELETE', parsed.conditions);
    }
    
    throw new Error(`Unsupported operation: ${parsed.operation}`);
  } catch (err) {
    console.error('Error in runAsync:', err);
    throw err;
  }
}

export async function getAsync(sql, params = []) {
  try {
    const parsed = parseSQLQuery(sql, params);
    
    if (parsed.operation === 'SELECT') {
      return await lowdbGet(parsed.tableName, parsed.conditions);
    }
    
    throw new Error(`Unsupported operation: ${parsed.operation}`);
  } catch (err) {
    console.error('Error in getAsync:', err);
    throw err;
  }
}

export async function allAsync(sql, params = []) {
  try {
    const parsed = parseSQLQuery(sql, params);
    
    if (parsed.operation === 'SELECT') {
      return await lowdbAll(parsed.tableName, parsed.conditions);
    }
    
    throw new Error(`Unsupported operation: ${parsed.operation}`);
  } catch (err) {
    console.error('Error in allAsync:', err);
    throw err;
  }
}