class CajaRepository  {
    constructor(pool){
        this.pool = pool;
    }

    async registrarMovimiento(dataCaja, client){
        const executor = client || this.pool;
        const query = `
            INSERT INTO caja (monto, tipo, detalle, id_asignacion, origen, metodo_pago, id_venta)
            VALUES ($1, "INGRESO", $2, $3, "VENTA", $4, $5)
            RETURNING *;
        `;

        const values=[
            dataCaja.monto,
            dataCaja.detalle,
            dataCaja.responsable,
            dataCaja.metodo_pago,
            dataCaja.id_venta,
           
        ];

        const result = await executor.query(query, values);

        return result.rows[0];

        
    }
    async getSaldo(){
        const query = `
            SELECT COALESCE(SUM(
                CASE
                    WHEN tipo = 'INGRESO' THEN monto
                    WHEN tipo = 'EGRESO' THEN -monto
                    ELSE 0
                END
                
            ), 0) AS saldo
            FROM caja
            
        `
        const result = await this.pool.query(query);

        return Number(result.rows[0].saldo);
    }

    async listarMovimiento(){
        const query= `
            SELECT * FROM caja
        `;

        const result = await this.pool.query(query);
        return result.rows;
    }

    async modificarMovimiento(id, client){
        const executor = client || this.pool;
        const query = `
            UPDATE caja
            SET   
                tipo = "EGRESO",
                origen = "ANULACION"
            WHERE id_caja = $1    
        `;


        const result = await executor.query(query, [id]);
        return result.rows[0];
    }

    async traerMovimiento(id){
        const query = `
            SELECT id_caja FROM caja
            WHERE id_venta = $1
        `;

        const result = await this.pool.query(query, [id]);

        return result.rows[0];
    }
}

module.exports = CajaRepository;