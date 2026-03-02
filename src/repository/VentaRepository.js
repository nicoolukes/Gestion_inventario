class VentaRepository {
    constructor(pool) {
        this.pool = pool;
    }

    async registrarVenta(data, client) {
        const executor = client || this.pool;
        const query = `
            INSERT INTO venta (total, metodo_pago, id_asignacion)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [
            data.total,
            data.metodo_pago,
            data.responsable
        ];

        const result = await executor.query(query, values);

        return result.rows[0];


    }

    async registrarDetalle(data, client) {

        const executor = client || this.pool;

        const query = `
            INSERT INTO detalle_venta (precio_unitario, cantidad, id_venta, id_producto)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [
            data.precio_unitario,
            data.cantidad,
            data.id_venta,
            data.id_producto
        ];

        await executor.query(query, values);


    }

    async listarVenta() {
        const query = `
            SELECT 
                v.id_venta,
                v.fecha,
                v.metodo_pago,
                v.total,
                v.id_asignacion,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'producto_id', dv.id_producto,
                        'cantidad', dv.cantidad,
                        'precio_unitario', dv.precio_unitario,
                        'subtotal', dv.cantidad * dv.precio_unitario
                    )
                ) FILTER (WHERE dv.id_detalle IS NOT NULL), '[]'
            ) AS detalles
            FROM venta v
            LEFT JOIN detalle_venta dv 
            ON v.id_venta = dv.id_venta
            GROUP BY v.id_venta
            ORDER BY v.fecha DESC;
        `
        const result = await this.pool.query(query);
        return result.rows;
    }

    async buscarVenta(dataVenta) {
        const query = `
            SELECT * FROM venta v
            JOIN detalle_venta dv ON v.id_venta = dv.id_venta
            WHERE fecha BETWEEN $1 AND $2;
        `;

        const values = [
            dataVenta.fechaDesde,
            dataVenta.fechaHasta
        ];

        const result = await this.pool.query(query, values);
        return result.rows;
    }

    async eliminarVenta(id) {

        const query1 = `
            DELETE FROM detalle_venta WHERE id_venta = $1; 
        `;
        const query2 = `
            DELETE FROM caja WHERE id_venta = $1;
        `;
        const query3 = `
            DELETE FROM venta WHERE id_venta = $1 RETURNING *;
        `;

        await this.pool.query(query1, [id]);
        await this.pool.query(query2, [id]);
        const result = await this.pool.query(query3, [id]);
        return result.rows[0];

    }

    async buscarDetalle(id) {
        const query = `
            SELECT * FROM detalle_venta
            WHERE id_venta = $1 ;
        `;

        const result = await this.pool.query(query, [id]);
        return result.rows;
    }
}

module.exports = VentaRepository;