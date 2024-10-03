import { Evaluacion } from "../../models/evaluacion";

export class Promedio {

    public static calcularPromedio(evaluacion: Evaluacion): number {
        const respuestas = evaluacion.respuestas;

        if(respuestas.length === 0) {
            return 0;
        }

        const categoriasPromedios = this.calcularPromediosCategorias(evaluacion);

        const sumaGeneral = Array.from(categoriasPromedios.values()).reduce((acc, promedio) => acc + promedio, 0);
        const promedioGeneral = sumaGeneral / categoriasPromedios.size;

        return promedioGeneral;
    }

    public static calcularPromediosSubcategorias(Evaluacion: Evaluacion): Map<string, number> {
        const respuestas = Evaluacion.respuestas;

        if(respuestas.length === 0) {
            return new Map();
        }

        const subcategoriasMap: Map<string, number[]> = new Map();

        respuestas.forEach(respuesta => {
            const subcategoriaId = respuesta.pregunta.subcategoria.id;

            if(!subcategoriasMap.has(subcategoriaId)) {
                subcategoriasMap.set(subcategoriaId, []);
            }

            subcategoriasMap.get(subcategoriaId)!.push(respuesta.valor);
        });

        const subcategoriasPromedios: Map<string, number> = new Map();

        subcategoriasMap.forEach((valores, subcategoriaId) => {
            const sumaValores = valores.reduce((acc, valor) => acc + valor, 0);
            const promedio = sumaValores / valores.length;
            subcategoriasPromedios.set(subcategoriaId, promedio);
        });

        return subcategoriasPromedios;
    }

    public static calcularPromediosCategorias(Evaluacion: Evaluacion): Map<string, number> {
        const respuestas = Evaluacion.respuestas;

        if(respuestas.length === 0) {
            return new Map();
        }

        const subcategoriasPromedios = this.calcularPromediosSubcategorias(Evaluacion);

        const categoriasMap: Map<string, number[]> = new Map();

        subcategoriasPromedios.forEach((promedio, subcategoriaId) => {
            const respuesta = Evaluacion.respuestas.find(respuesta => {
                return respuesta.pregunta.subcategoria.id === subcategoriaId;
            });

            const categoriaId = respuesta!.pregunta.subcategoria.categoria.id;

            if(categoriaId) {
                if(!categoriasMap.has(categoriaId)) {
                    categoriasMap.set(categoriaId, []);
                }
                categoriasMap.get(categoriaId)!.push(promedio);
            }
        });

        const categoriasPromedios: Map<string, number> = new Map();

        categoriasMap.forEach((valores, categoriaId) => {
            const sumaValores = valores.reduce((acc, valor) => acc + valor, 0);
            const promedio = sumaValores / valores.length;
            categoriasPromedios.set(categoriaId, promedio);
        });

        return categoriasPromedios;
    }

    
}