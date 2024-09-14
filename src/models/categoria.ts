import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Subcategoria } from "./subcategoria";
import { SoftwareCategoria } from "./software_categoria";
import { PreguntaCustom } from "./pregunta_custom";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100 })
    public nombre: string;

    @OneToMany(() => Subcategoria, subcategoria => subcategoria.categoria)
    public subcategorias: Subcategoria[];

    @OneToMany(() => SoftwareCategoria, softwareCategoria => softwareCategoria.categoria)
    public softwareCategorias: SoftwareCategoria[];

    @OneToMany(() => PreguntaCustom, preguntaCustom => preguntaCustom.categoria)
    public preguntasCustom: PreguntaCustom[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}