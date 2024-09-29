import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SoftwareTecnologia } from "./software_tecnologia";

@Entity()
export class Tecnologia {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100, unique: true })
    public nombre: string;

    @OneToMany(() => SoftwareTecnologia, softwareTecnologia => softwareTecnologia.tecnologia)
    public softwareTecnologias: SoftwareTecnologia[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}