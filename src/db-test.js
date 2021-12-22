const mariadb = require('mariadb');
const pool = mariadb.createPool({ host: '172.17.0.2', user: 'root', password: 'test', database: 'raspberrypi', connectionLimit: 5 });

async function asyncFunction() {
    let conn;
    try {

        conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1 as val");
        // rows: [ {val: 1}, meta: ... ]

        const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
        
        console.log('hjk', rows)

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}
