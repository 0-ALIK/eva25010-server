import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./categoria";
import { Software } from "./software";
import { RespuestaCustom } from "./respuesta_custom";

@Entity()
export class PreguntaCustom {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 500})
    public descripcion: string;    

    @ManyToOne(() => Categoria, categoria => categoria.preguntasCustom, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public categoria: Categoria;

    @ManyToOne(() => Software, software => software.preguntasCustom, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public software: Software;

    @OneToMany(() => RespuestaCustom, respuesta => respuesta.pregunta)
    public respuestas: RespuestaCustom[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}