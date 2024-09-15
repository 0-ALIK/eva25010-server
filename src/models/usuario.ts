import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profesion } from "./profesion";
import { Software } from "./software";
import { Evaluacion } from "./evaluacion";

@Entity()
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100})
    public nombre: string;

    @Column({length: 100})
    public apellido: string;

    @Column({length: 255, unique: true})
    public correo: string;

    @Column({length: 255, select: false})
    public password: string;

    @Column({length: 100, nullable: true})
    public cargo: string;

    @Column({length: 255, nullable: true})
    public foto: string;

    @ManyToOne(() => Profesion, profesion => profesion.usuarios, {onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    public profesion: Profesion;

    @OneToMany(() => Software, software => software.usuario)
    public software: Software[];

    @OneToMany(() => Evaluacion, evaluacion => evaluacion.usuario)
    public evaluaciones: Evaluacion[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}