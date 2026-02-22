const { Pool } = require("pg");


const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "123456",
    database: "gestion_inventario",
    port: "5432"
})



pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.stack);
    } else {
        console.log('✅ Conexión exitosa a Postgres. Hora del servidor:', res.rows[0].now);
    }
});


module.exports = pool;

