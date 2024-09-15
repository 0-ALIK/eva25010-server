import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pregunta } from "./pregunta";
import { Evaluacion } from "./evaluacion";

@Entity()
export class Respuesta extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'int'})
    public valor: number;

    @ManyToOne(() => Pregunta, pregunta => pregunta.respuestas, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public pregunta: Pregunta;

    @ManyToOne(() => Evaluacion, evaluacion => evaluacion.respuestas, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public evaluacion: Evaluacion;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}