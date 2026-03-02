class AsignarRepository{
    constructor(pool){
        this.pool = pool;
    }

    async registrarAsignacion(dataAsig){
        const query=`
            INSERT INTO asignacion_turno (dinero_inicio, dinero_fin, id_persona, id_turno, hora_fin_real)
            VALUES ($1, NULL, $2, $3, NULL)
            RETURNING *;
        `;

        const values=[
            dataAsig.dinero_inicio,
            dataAsig.id_persona,
            dataAsig.id_turno
        ];

        const result = await this.pool.query(query, values);

        return result.rows[0];
        
    }

    async modificarAsignacion(dataAsig){
        const query= `
            UPDATE asignacion_turno
           SET
                dinero_fin = $1,
                hora_fin_real = CURRENT_TIME
            WHERE id_asignacion = $2
            RETURNING *;
        `;

        const values=[
            dataAsig.dinero_fin,
            dataAsig.id_asignacion
        ];

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async buscarAsignacion(){
        const query = `
            SELECT * FROM asignacion_turno
            WHERE hora_fin_real IS NULL
            LIMIT 1
        `;

        const result = await this.pool.query(query);
        return result.rows[0] ?? null;
    }
}

module.exports = AsignarRepository;