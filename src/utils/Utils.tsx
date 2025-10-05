import type { Cliente } from "../models/Cliente";
import { PDFDocument, rgb } from "pdf-lib";
import type { Tatuador } from "../models/Tatuador";
import pdfBase from "/assets/consentimiento-informado-tatuajes-piercing-final.pdf";
import { toast } from 'react-toastify';

export class Utils {
    
    static async generatePdf(formData: Cliente, formDataTatuador: Tatuador) {
        const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer());
    
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
    
        const fontSize = 10;
    
        firstPage.drawText(`${formData.nombre} ` + `${formData.apellidos}`, { x: 90, y: 585, size: fontSize, color: rgb(0, 0, 0) });
        firstPage.drawText(`${formData.edad}`, { x: 500, y: 585, size: fontSize });                              
    
        firstPage.drawText(`${formData.nameTutor}`, { x: 155, y: 573, size: fontSize });                         
        firstPage.drawText(`${formData.ageTutor ?? ""}`, { x: 500, y: 573, size: fontSize });                          
    
        firstPage.drawText(`${formData.direccion}`, { x: 90, y: 560, size: fontSize });                          
    
        firstPage.drawText(`${formData.poblacion}`, { x: 90, y: 550, size: fontSize });                          
        firstPage.drawText(`${formData.codPostal ?? ""}`, { x: 270, y: 550, size: fontSize });                         
        firstPage.drawText(`${formData.provincia}`, { x: 380, y: 550, size: fontSize });                        
    
        firstPage.drawText(`${formData.telefonoFijo ?? ""}`, { x: 90, y: 539, size: fontSize });                      
        firstPage.drawText(`${formData.movil ?? ""}`, { x: 260, y: 539, size: fontSize });                             
        firstPage.drawText(`${new Date(formData.fechaNacimiento).toLocaleDateString()}`, { x: 445, y: 538, size: fontSize });   
    
        if (formData.fotoDni instanceof File) {
            const imageBytes = await formData.fotoDni.arrayBuffer();
    
            let image;
            if (formData.fotoDni.type === "image/png") {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                image = await pdfDoc.embedJpg(imageBytes);
            }
    
            const MAX_WIDTH = 150;
            const MAX_HEIGHT = 150;
    
            const widthScale = MAX_WIDTH / image.width;
            const heightScale = MAX_HEIGHT / image.height;
            const scale = Math.min(widthScale, heightScale);
    
            firstPage.drawImage(image, {
                x: 360,
                y: 620,
                width: image.width * scale,
                height: image.height * scale,
            });
        }
    
        const secondPage = pages[1];
    
        secondPage.drawText(`${formDataTatuador.tecnica ?? ""}`, { x: 90, y: 430, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(`${formDataTatuador.zona ?? ""}`, { x: 385, y: 430, size: fontSize, color: rgb(0, 0, 0) });
    
        secondPage.drawText(`${formDataTatuador.color ?? ""}`, { x: 250, y: 385, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(`${formDataTatuador.marca ?? ""}`, { x: 70, y: 385, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(`${formDataTatuador.lote ?? ""}`, { x: 380, y: 385, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(`${formDataTatuador.fechaCaducidad != '' ? new Date(formDataTatuador.fechaCaducidad).toLocaleDateString() : ""}`, { x: 500, y: 385, size: fontSize, color: rgb(0, 0, 0) });
    
        secondPage.drawText(`${formData.nif}`, { x: 90, y: 125, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(`${formData.nombre} ` + `${formData.apellidos}`, { x: 365, y: 125, size: fontSize, color: rgb(0, 0, 0) });
    
        const today = new Date();
    
        secondPage.drawText(`Madrid`, { x: 285, y: 195, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(today.getDate().toString(), { x: 365, y: 195, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText((today.getMonth() + 1).toString(), { x: 400, y: 195, size: fontSize, color: rgb(0, 0, 0) });
        secondPage.drawText(today.getFullYear().toString(), { x: 500, y: 195, size: fontSize, color: rgb(0, 0, 0) });
    
        const thirdPage = pages[2];
    
        thirdPage.drawText(`${formDataTatuador.tecnica ?? ""}`, { x: 131, y: 285, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.zona ?? ""}`, { x: 240, y: 285, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.diseño ?? ""}`, { x: 342, y: 285, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.nombreAplicador ?? ""}`, { x: 185, y: 275, size: fontSize, color: rgb(0, 0, 0) });
    
        thirdPage.drawText(`${formDataTatuador.marca ?? ""}`, { x: 131, y: 250, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.color ?? ""}`, { x: 220, y: 250, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.lote ?? ""}`, { x: 290, y: 250, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.fechaCaducidad != '' ? new Date(formDataTatuador.fechaCaducidad).toLocaleDateString() : ""}`, { x: 420, y: 250, size: fontSize, color: rgb(0, 0, 0) });
        
        thirdPage.drawText(`${formDataTatuador.redSocial ?? ""}`, { x: 358, y: 100, size: fontSize, color: rgb(0, 0, 0) });
    
        thirdPage.drawText(today.getDate().toString(), { x: 248, y: 75, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText((today.getMonth() + 1).toString(), { x: 280, y: 75, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(today.getFullYear().toString(), { x: 315, y: 75, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formData.nif}`, { x: 223, y: 55, size: fontSize, color: rgb(0, 0, 0) });
        thirdPage.drawText(`${formDataTatuador.nifTatuador}`, { x: 422, y: 30, size: fontSize, color: rgb(0, 0, 0) });
    
        const fourthPage = pages[3];
    
        fourthPage.drawText(`${formData.nombre} ` + `${formData.apellidos}`, { x: 175, y: 190, size: fontSize, color: rgb(0, 0, 0) });
        fourthPage.drawText(`${formData.nif}`, { x: 486, y: 185, size: 8, color: rgb(0, 0, 0) });
    
        fourthPage.drawText(`${formData.nameTutor}`, { x: 175, y: 160, size: fontSize, color: rgb(0, 0, 0) });
        fourthPage.drawText(`${formData.nifTutor}`, { x: 486, y: 165, size: 8, color: rgb(0, 0, 0) });

        if (formData.firma) {
            const imageBytes = formData.firma.split(",")[1];
            const imageUint8 = Uint8Array.from(atob(imageBytes), c => c.charCodeAt(0));
            const pngImage = await pdfDoc.embedPng(imageUint8);

            const MAX_WIDTH = 150;
            const MAX_HEIGHT = 150;
    
            const widthScale = MAX_WIDTH / pngImage.width;
            const heightScale = MAX_HEIGHT / pngImage.height;
            const scale = Math.min(widthScale, heightScale);

            secondPage.drawImage(pngImage, {
                x: 380,
                y: 150,
                width: pngImage.width * scale,
                height: pngImage.height * scale,
            });


            thirdPage.drawImage(pngImage, {
                x: 50,
                y: 30,
                width: pngImage.width * scale,
                height: pngImage.height * scale,
            });

            fourthPage.drawImage(pngImage, {
                x: 410,
                y: 100,
                width: pngImage.width * scale,
                height: pngImage.height * scale,
            });
        }

        fourthPage.drawText(today.getDate().toString(), { x: 96, y: 73, size: fontSize, color: rgb(0, 0, 0) });
        fourthPage.drawText((today.getMonth() + 1).toString(), { x: 187, y: 73, size: fontSize, color: rgb(0, 0, 0) });
        fourthPage.drawText(today.getFullYear().toString(), { x: 264.5, y: 73, size: fontSize, color: rgb(0, 0, 0) });
    
        const pdfBytes = await pdfDoc.save();
        return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    }

    static async downloadPdf(formData: Cliente, formDataTatuador: Tatuador) {
        const pdfBlob = await Utils.generatePdf(formData, formDataTatuador);
        const url = URL.createObjectURL(pdfBlob);
    
        const link = document.createElement("a");
        link.href = url;
        link.download = "consentimiento_impala_tattoo_" + formData.nombre + "_" + formData.apellidos + ".pdf";
        link.click();
    
        URL.revokeObjectURL(url);
        toast.success("Formulario descargado correctamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

}