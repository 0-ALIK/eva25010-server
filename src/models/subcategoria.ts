import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./categoria";
import { Pregunta } from "./pregunta";

@Entity()
export class Subcategoria {
    @PrimaryColumn({length: 3})
    public id: string;

    @Column({length: 100, unique: true})
    public nombre: string;

    @ManyToOne(() => Categoria, categoria => categoria.subcategorias, {onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    public categoria: Categoria;

    @OneToMany(() => Pregunta, pregunta => pregunta.subcategoria)
    public preguntas: Pregunta[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}