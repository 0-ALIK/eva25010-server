import { BaseEntity, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Software } from "./software";
import { Categoria } from "./categoria";
import { PreguntaCustom } from "./pregunta_custom";

@Entity()
@Unique(["software", "categoria"])
export class SoftwareCategoria extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Software, software => software.categorias, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public software: Software;

    @ManyToOne(() => Categoria, categoria => categoria.softwareCategorias, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public categoria: Categoria;

    @OneToOne(() => PreguntaCustom, preguntaCustom => preguntaCustom.softwareCategoria)
    public preguntaCustom: PreguntaCustom;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}