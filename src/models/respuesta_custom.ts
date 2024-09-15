import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PreguntaCustom } from "./pregunta_custom";
import { Evaluacion } from "./evaluacion";

@Entity()
export class RespuestaCustom extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'int'})
    public valor: number;

    @ManyToOne(() => PreguntaCustom, pregunta => pregunta.respuestas, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public pregunta: PreguntaCustom;

    @ManyToOne(() => Evaluacion, evaluacion => evaluacion.respuestasCustom, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public evaluacion: Evaluacion;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}