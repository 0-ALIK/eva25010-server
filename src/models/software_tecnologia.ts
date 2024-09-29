import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Software } from "./software";
import { Tecnologia } from "./tecnologia";

@Entity()
export class SoftwareTecnologia {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Software, software => software.softwareTecnologias)
    public software: Software;   

    @ManyToOne(() => Tecnologia, tecnologia => tecnologia.softwareTecnologias )
    public tecnologia: Tecnologia;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}