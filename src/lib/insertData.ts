export async function insertData(promisePool:any, tableName:string, data:Record<string, string | number>) {
    try {
      const [keys, values, count] = extract(data);
      const [rows] = await promisePool.execute(
        `INSERT INTO ${tableName} (${keys}) VALUES (${count})`,
        values
      );

      console.log(`${rows.affectedRows} row(s) inserted.`);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }
  
const extract = (obj: Record<string, string | number>) => {
  const keys = Object.keys(obj).join(",");
  const values = Object.values(obj);
  const count = Array(values.length).fill("?").join(",")
  return [keys, values, count]
}
