const csv = require('csv-parser')
const fs = require('fs')

export const readCSVFile = async (filepath:string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const jsonArray: any[] = [];

        fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (row: any) => {
            jsonArray.push(row);
        })
        .on('end', () => {
            resolve(jsonArray);
        })
        .on('error', (error: Error) => {
            console.error('Error reading CSV file:', error.message);
            reject({ error: 'Internal Server Error' });
        });
    });        
}