import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "./usuario";

@Entity()
export class Profesion extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100, unique: true})
    public nombre: string;

    @OneToMany(() => Usuario, usuario => usuario.profesion)
    public usuarios: Usuario[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}