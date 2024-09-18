import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "./usuario";
import { Licencia } from "./licencia";
import { SoftwareCategoria } from "./software_categoria";
import { Evaluacion } from "./evaluacion";
import { PreguntaCustom } from "./pregunta_custom";
import { SubtipoSoftware } from "./subtipo_software";
import { ImagenPreview } from "./imagen_preview";

@Entity()
export class Software extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100})
    public nombre: string;

    @Column({length: 20})
    public version: string;

    @Column({length: 255})
    public portada: string;

    @Column({type: 'text'})
    public descripcion: string;

    @ManyToOne(() => Usuario, usuario => usuario.software, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public usuario: Usuario;

    @ManyToOne(() => SubtipoSoftware, tipoSoftware => tipoSoftware.software, {onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    public subtipoSoftware: SubtipoSoftware;

    @ManyToOne(() => Licencia, licencia => licencia.software, {onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    public licencia: Licencia;

    @OneToMany(() => SoftwareCategoria, softwareCategoria => softwareCategoria.software)
    public categorias: SoftwareCategoria[];

    @OneToMany(() => Evaluacion, evaluacion => evaluacion.software)
    public evaluaciones: Evaluacion[];

    @OneToMany(() => PreguntaCustom, preguntaCustom => preguntaCustom.software)
    public preguntasCustom: PreguntaCustom[];

    @OneToMany(() => ImagenPreview, imagenPreview => imagenPreview.software)
    public imagenesPreview: ImagenPreview[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}