import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Evaluacion } from "./evaluacion";

@Entity()
export class Comentario {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 250 })
    public descripcion: string;

    @OneToOne(() => Evaluacion, evaluacion => evaluacion.comentario, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn()
    @Unique(["evaluacion"])
    public evaluacion: Evaluacion;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}