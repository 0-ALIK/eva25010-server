import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubtipoSoftware } from "./subtipo_software";

@Entity('tipo_software')
export class TipoSoftware extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100, unique: true})
    public nombre: string;

    @OneToMany(() => SubtipoSoftware, subtipoSoftware => subtipoSoftware.tipoSoftware)
    public subtiposSoftware: SubtipoSoftware[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}