import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Software } from "./software";

@Entity()
export class Licencia {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100, unique: true})
    public nombre: string;

    @OneToMany(() => Software, software => software.licencia)
    public software: Software[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}