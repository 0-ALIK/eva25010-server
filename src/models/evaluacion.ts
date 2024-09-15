import { BaseEntity, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "./usuario";
import { Software } from "./software";
import { Comentario } from "./comentario";
import { Respuesta } from "./respuesta";
import { RespuestaCustom } from "./respuesta_custom";

@Entity()
export class Evaluacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Usuario, usuario => usuario.evaluaciones, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public usuario: Usuario;

    @ManyToOne(() => Software, software => software.evaluaciones, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public software: Software;

    @OneToOne(() => Comentario, comentario => comentario.evaluacion)
    public comentario: Comentario;

    @OneToMany(() => Respuesta, respuesta => respuesta.evaluacion)
    public respuestas: Respuesta[];

    @OneToMany(() => RespuestaCustom, respuestaCustom => respuestaCustom.evaluacion)
    public respuestasCustom: RespuestaCustom[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}