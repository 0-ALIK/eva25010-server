import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipoSoftware } from "./tipo_software";
import { Software } from "./software";

@Entity()
export class SubtipoSoftware extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 100})
    public nombre: string;

    @ManyToOne(() => TipoSoftware, tipoSoftware => tipoSoftware.subtiposSoftware)
    public tipoSoftware: TipoSoftware;

    @OneToMany(() => Software, software => software.subtipoSoftware)
    public software: Software[];
}