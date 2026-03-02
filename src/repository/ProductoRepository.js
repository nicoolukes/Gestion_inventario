class ProductoRepository {
    constructor(pool){
        this.pool=pool;
    }
    async agregarProducto(dataProduct){
        const query= `
            INSERT into producto(nombre, imagen, stock, stock_minimo, precio_venta, precio_compra, detalle, categoria)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const values=[
            dataProduct.nombre,
            dataProduct.imagen,
            dataProduct.stock,
            dataProduct.stock_minimo,
            dataProduct.precio_venta,
            dataProduct.precio_compra,
            dataProduct.detalle,
            dataProduct.categoria
        ];

        const result = await this.pool.query(query, values)

        return result.rows[0];
    }

    async modificarProducto(id, dataProduct){
        const query=`
           UPDATE producto
           SET
                nombre= $1, 
                imagen= COALESCE($2, imagen), 
                stock= $3, 
                stock_minimo= $4, 
                precio_venta= $5, 
                precio_compra= $6, 
                detalle= $7, 
                categoria= $8
            WHERE id_producto = $9
            RETURNING *;
        `;

        const values=[
            dataProduct.nombre,
            dataProduct.imagen,
            dataProduct.stock,
            dataProduct.stock_minimo,
            dataProduct.precio_venta,
            dataProduct.precio_compra,
            dataProduct.detalle,
            dataProduct.categoria,
            id
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async listarProducto(){
        const query= `
            SELECT * from producto
        `;
        
        const result = await this.pool.query(query);
        return result.rows
    }

    async eliminarProducto(id){
        const query = `
            DELETE FROM producto WHERE id_producto = $1 RETURNING *;

        `;
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async buscarProducto(nombre, categoria){
        const query = `
            SELECT * FROM producto 
            WHERE 1=1;
        `
        const value = [];

        if(nombre){
            value.push(`%${nombre}%`);
            query+= `AND nombre ILIKE $${value.length}`;
        }

        if(categoria){
            value.push(categoria);
            query+= `AND categoria = $${value.length}`
        }

        query+= `ORDER BY nombre ASC`;

        const result = await this.pool.query(query, value);
        return result.rows;
    }

    async traerProducto(id, client){
        const executor = client || this.pool;
        const query = `
            SELECT * FROM producto
            WHERE id_producto = ANY($1)
            FOR UPDATE
        `;

        const result = await executor.query(query, [id]);

        return result.rows[0];
    }

    async actualizarStock(stock, id, client){
        const executor = client || this.pool;
        const query =`
            UPDATE producto
            SET 
                stock= ${stock}
            WHERE id_producto = $1 "
        `
        await executor.query(query, [id]);
    }
}

module.exports= ProductoRepository;

//http://localhost:3000/cargarProducto?nombre=h&imagen=b&stock=1&stock_minimo=1&precio_venta=2&precio_compra=2&detalle=c&categoria=d