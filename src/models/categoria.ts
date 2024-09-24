import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Subcategoria } from "./subcategoria";
import { SoftwareCategoria } from "./software_categoria";

@Entity()
export class Categoria extends BaseEntity {
    @PrimaryColumn({length: 3})
    public id: string;

    @Column({length: 100, unique: true})
    public nombre: string;

    @OneToMany(() => Subcategoria, subcategoria => subcategoria.categoria)
    public subcategorias: Subcategoria[];

    @OneToMany(() => SoftwareCategoria, softwareCategoria => softwareCategoria.categoria)
    public softwareCategorias: SoftwareCategoria[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}