import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { RespuestaCustom } from "./respuesta_custom";
import { SoftwareCategoria } from "./software_categoria";

@Entity()
export class PreguntaCustom extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 500})
    public descripcion: string;    

    @OneToMany(() => RespuestaCustom, respuesta => respuesta.pregunta)
    public respuestas: RespuestaCustom[];

    @OneToOne(() => SoftwareCategoria, softwareCategoria => softwareCategoria.preguntaCustom, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn()
    @Unique(["softwareCategoria"])
    public softwareCategoria: SoftwareCategoria;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}