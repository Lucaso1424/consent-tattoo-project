export class Tatuador {
    nombreTatuador: string;
    nifTatuador: string;
    tecnica: string;
    zona: string;
    diseño: string;
    nombreAplicador: string;
    lote?: number;
    color?: string;
    marca: string;
    redSocial: string;
    fechaCaducidad: string;

    constructor(data: any) {
        this.nombreTatuador = data.nombreTatuador;
        this.nifTatuador = data.nifTatuador;
        this.tecnica = data.tecnica;
        this.zona = data.zona;
        this.diseño = data.diseño;
        this.nombreAplicador = data.nombreAplicador;
        this.lote = data.lote;
        this.color = data.color;
        this.redSocial = data.redSocial;
        this.marca = data.marca;
        this.fechaCaducidad = data.fechaCaducidad;
    }
}