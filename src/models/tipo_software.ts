import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Software } from "./software";

@Entity('tipo_software')
export class TipoSoftware {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100})
    public nombre: string;

    @OneToMany(() => Software, software => software.tipoSoftware)
    public software: Software[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}