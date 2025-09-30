export class Tatuador {
    nombreTatuador: string;
    tecnica: string;
    zona: string;
    lote?: number;
    color?: string;
    marca: string;
    fechaCaducidad: string;

    constructor(data: any) {
        this.nombreTatuador = data.nombreTatuador;
        this.tecnica = data.tecnica;
        this.zona = data.zona;
        this.lote = data.lote;
        this.color = data.color;
        this.marca = data.marca;
        this.fechaCaducidad = data.fechaCaducidad;
    }
}