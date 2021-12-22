import express from 'express';
import bodyParser from "body-parser";
import pool from "./db";
const app = express();

// setup
app.use(bodyParser.json({ limit: '2mb' }));

// Home Route
app.get('/', async (req, res) => {
    res.json({
        message: 'Docker Service :D'
    })
});

// temp
app.get('/create-table', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection()

        const sql = `
            CREATE TABLE IF NOT EXISTS desserts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )  ENGINE=INNODB;`;

        let result = await conn.query(sql);
        console.log(result);
        res.send("desserts table created");
    } catch (error) {
        throw error
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

app.get('/insert/:dish', async (req, res) => {
    const { dish } = req.params;
    let conn;
    try {
        conn = await pool.getConnection()

        const sql = `INSERT INTO desserts (name) VALUES ('${dish}')`;
        let result = await conn.query(sql);

        console.log(result);
        res.send(`${dish} inserted into desserts table`)
    } catch (error) {
        throw error
    } finally {
        if (conn) {
            conn.release();
        }
    }

})

// Route to test database connection
app.get('/desserts', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection()

        let sql = `SELECT * FROM desserts`;
        let result = await conn.query(sql);

        res.send(result)
    } catch (error) {
        throw error
    } finally {
        if (conn) {
            conn.release();
        }
    }
})

const port = process.env.PORT || 3000;

// Listening Server
app.listen(port, () => {
    console.log(`Server is up at port:${port}`)
})
