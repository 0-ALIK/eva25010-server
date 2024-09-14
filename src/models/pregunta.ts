import { Column, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Subcategoria } from "./subcategoria";
import { Respuesta } from "./respuesta";

export class Pregunta {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 500})
    public descripcion: string; 

    @ManyToOne(() => Subcategoria, subcategoria => subcategoria.preguntas, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public subcategoria: Subcategoria;

    @OneToMany(() => Respuesta, respuesta => respuesta.pregunta)
    public respuestas: Respuesta[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}