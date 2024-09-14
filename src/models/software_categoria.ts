import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Software } from "./software";
import { Categoria } from "./categoria";

@Entity()
export class SoftwareCategoria {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Software, software => software.categorias, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public software: Software;

    @ManyToOne(() => Categoria, categoria => categoria.softwareCategorias, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public categoria: Categoria;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}